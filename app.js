const http = require('http');
const CTX = require('./libs/Milagro-Crypto-Library/ctx');

// TODO: cleanup arguments to all functions


// Simple e(2Q, 3G) = e(Q, G)^6
function testDummyBilinearity() {
    let ctx = new CTX("BN254"); // BN254CX ??
    let RAW = [];
    let rng = new ctx.RAND();
    let G=new ctx.ECP(0); // cyclic group G1
    let Q=new ctx.ECP2(0); // cyclic group G2

    rng.clean();
    for (let i = 0; i < 100; i++) RAW[i] = i;
    rng.seed(100, RAW);

    let r = new ctx.BIG(0);
    let x = new ctx.BIG(0);
    let y = new ctx.BIG(0);

    let qx = new ctx.FP2(0);
    let qy = new ctx.FP2(0);

    // Set curve order
    r.rcopy(ctx.ROM_CURVE.CURVE_Order);

    // Set generator of G1
    x.rcopy(ctx.ROM_CURVE.CURVE_Gx);
    y.rcopy(ctx.ROM_CURVE.CURVE_Gy);
    G.setxy(x,y);

    // Set generator of G2
    x.rcopy(ctx.ROM_CURVE.CURVE_Pxa);
    y.rcopy(ctx.ROM_CURVE.CURVE_Pxb);
    qx.bset(x, y);
    x.rcopy(ctx.ROM_CURVE.CURVE_Pya);
    y.rcopy(ctx.ROM_CURVE.CURVE_Pyb);
    qy.bset(x, y);
    Q.setxy(qx, qy);

    x = ctx.BIG.randomnum(r,rng);
    y = ctx.BIG.randomnum(r,rng);

    // in another example those were multiplied by same group order, rather than random numbers; TODO: test
    let G1 = ctx.PAIR.G1mul(G,x);
    let Q1 = ctx.PAIR.G2mul(Q,y);

    // pairing
    let gt = ctx.PAIR.ate(Q1, G1);
    gt = ctx.PAIR.fexp(gt);

    let big2 = new ctx.BIG(2);
    let big3 = new ctx.BIG(3);
    let big6 = new ctx.BIG(6);
    let big7 = new ctx.BIG(7);

    let g1test = G1.mul(big2);
    let g2test = Q1.mul(big3);

    let gt6_1 = ctx.PAIR.ate(g2test, g1test);
    gt6_1 = ctx.PAIR.fexp(gt6_1);

    let gt6_2 = ctx.PAIR.GTpow(gt, big6);

    let truthyComparison = gt6_1.toString() == gt6_2.toString();

    let g7 = ctx.PAIR.GTpow(gt, big7);
    let falsyComparison = gt6_1.toString() == g7.toString();


    console.log("Does e(2Q, 3G) = e(Q, G)^6 ? " + truthyComparison);
    console.log("Does e(2Q, 3G) = e(Q, G)^7 ? " + falsyComparison);
}

// return order, gen1, gen2
function setup({ctx, rng}) {
    // console.log("setup");
    let g1 = new ctx.ECP(0); // cyclic group g1
    let g2 = new ctx.ECP2(0); // cyclic group g2

    let o = new ctx.BIG(0);
    let x = new ctx.BIG(0);
    let y = new ctx.BIG(0);
    let qx = new ctx.FP2(0);
    let qy = new ctx.FP2(0);

    // set order
    o.rcopy(ctx.ROM_CURVE.CURVE_Order);

    // Set generator of g1
    x.rcopy(ctx.ROM_CURVE.CURVE_Gx);
    y.rcopy(ctx.ROM_CURVE.CURVE_Gy);
    g1.setxy(x,y);

    // Set generator of g2
    x.rcopy(ctx.ROM_CURVE.CURVE_Pxa);
    y.rcopy(ctx.ROM_CURVE.CURVE_Pxb);
    qx.bset(x, y);
    x.rcopy(ctx.ROM_CURVE.CURVE_Pya);
    y.rcopy(ctx.ROM_CURVE.CURVE_Pyb);
    qy.bset(x, y);
    g2.setxy(qx, qy);

    return {o, g1, g2};
}

// g1 useless?
function keygen({ctx, rng}, {o, g1, g2}) {
    let x = ctx.BIG.randomnum(o, rng);
    let y = ctx.BIG.randomnum(o, rng);
    let sk = [x, y];
    let pk = [g2, ctx.PAIR.G2mul(g2,x), ctx.PAIR.G2mul(g2,y)];

    return [sk, pk]
}

function sign({ctx, rng}, {o, g1, g2}, {sk, m}) {
    let [x, y] = sk;
    let h = ctx.PAIR.G1mul(g1, ctx.BIG.randomnum(o, rng));
    // let h = g1.mul(ctx.BIG.randomnum(o, rng));

    // sig = (x+y*m) * h
    // x - BIG
    // y - BIG
    // m - message as BIG
    // h - G1

    // y * m
    // test: imul, pmul, pxmul

    console.log(y.toString());
    let tmp1 = ctx.BIG.mul(y,m); // apparently its DBIG; does it make it fail?

    // y.pmul(m); // most likely NOT imul

    // console.log(y.toString())
    // console.log(tmp1.toString())
    let tmp2 = x.add(tmp1);

    // let sig = ctx.PAIR.G1mul(h, tmp2); // check if G1mul or different inbuilt mul
    let sig = h.mul(tmp2);

    return [h, sig]
}

function verify({ctx, rng}, {o, g1, g2}, pk, m, sig) {
    let [g, X, Y] = pk;

    let [sig1, sig2] = sig;

    let part1 = !sig.INF;

    //  e(sig1, X + m * Y) == e(sig2, g)

    // m * Y
    // let G2_tmp1 = ctx.PAIR.G2mul(Y, m); // or normal mul?
    let G2_tmp1 = Y.mul(m);
    G2_tmp1.add(X);
    // G2_tmp1.affine(); // required?

    let Gt_1 = ctx.PAIR.ate(G2_tmp1, sig1); // swapped?
    Gt_1 = ctx.PAIR.fexp(Gt_1);

    let Gt_2 = ctx.PAIR.ate(g, sig2);
    Gt_2 = ctx.PAIR.fexp(Gt_2);

    let part2 = Gt_1.toString() == Gt_2.toString()

    console.log(Gt_1.toString())
    console.log(Gt_2.toString())

    return part1 && part2;

}

function randomize({ctx, rng}, {o, g1, g2}, {sig}) {
    let [sig1, sig2] = sig;
    let t = ctx.BIG.randomnum(o, rng);

    return [ctx.PAIR.G1mul(sig1, t), ctx.PAIR.G1mul(sig2, t)]
}


function testSetup({ctx, rng}) {
    console.log("Test Setup");

    setup({ctx, rng})
}

function testKeygen({ctx, rng}) {
    console.log("Test Keygen");

    let params = setup({ctx, rng});
    let [sk, pk] = keygen({ctx, rng}, params);
}

function testSign({ctx, rng}) {
    console.log("Test Sign");

    let params = setup({ctx, rng});
    let [sk, pk] = keygen({ctx, rng}, params);

    let testMessage = "Hello World!";

    let messageBytes = [];
    for (let i = 0; i < testMessage.length; i++){
        messageBytes.push(testMessage.charCodeAt(i));
    }

    let H = new ctx.HASH256();
    H.process_array(messageBytes);
    let R = H.hash(); // returns digest
    let m = ctx.BIG.fromBytes(R);
    sign({ctx, rng}, params, {sk, m})
}

function testVerify({ctx, rng}) {
    console.log("Test Verify");

    let params = setup({ctx, rng});
    let [sk, pk] = keygen({ctx, rng}, params);

    let testMessage = "Hello World!";

    let messageBytes = stringtobytes(testMessage);
    let H = new ctx.HASH256();
    H.process_array(messageBytes);
    let R = H.hash(); // returns digest
    let m = ctx.BIG.fromBytes(R);
    let sig = sign({ctx, rng}, params, {sk, m});

    console.log("This should return truthy:");
    let t = verify({ctx, rng}, params, pk, m, sig);
    console.log(t);

    let messageBytes2 = stringtobytes("Other Hello World!");
    let H2 = new ctx.HASH256();
    H2.process_array(messageBytes2);
    let R2 = H2.hash();
    let m2 = ctx.BIG.fromBytes(R2);

    console.log("This should return falsy:");
    let t2 = verify({ctx, rng}, params, pk, m2, sig);
    console.log(t2);
}

function testRandomize({ctx, rng}) {
    console.log("Test Randomize");

    let params = setup({ctx, rng});
    let [sk, pk] = keygen({ctx, rng}, params);

    let testMessage = "Hello World!";

    let messageBytes = stringtobytes(testMessage);
    let H = new ctx.HASH256();
    H.process_array(messageBytes);
    let R = H.hash(); // returns digest
    let m = ctx.BIG.fromBytes(R);
    let signature = sign({ctx, rng}, params, {sk, m});

    signature = randomize({ctx, rng}, params, {signature});

    console.log("This should return truthy:");
    let t = verify({ctx, rng}, params, pk, m, signature);
    console.log(t);

    let messageBytes2 = stringtobytes("Other Hello World!");
    let H2 = new ctx.HASH256();
    H2.process_array(messageBytes2);
    let R2 = H2.hash();
    let m2 = ctx.BIG.fromBytes(R2);

    console.log("This should return falsy:");
    let t2 = verify({ctx, rng}, params, pk, m2, signature);
    console.log(t2);
}

// taken from https://github.com/milagro-crypto/milagro-crypto-js/blob/1699e9d8a0ac1374050bad50c50964a87c0c307d/examples/example_HASH.js#L27
function bytestostring(b) {
    var s = "";
    var len = b.length;
    var ch;

    for (var i = 0; i < len; i++) {
        ch = b[i];
        s += ((ch >>> 4) & 15).toString(16);
        s += (ch & 15).toString(16);
    }
    return s;
}

// same source
function stringtobytes(s) {
    var b = [];
    for (var i = 0; i < s.length; i++)
        b.push(s.charCodeAt(i));
    return b;
}

function testSRS() {

    var ctx = new CTX("BN254"); // or BN254CX?
    var RAW = [];
    var rng = new ctx.RAND();


    rng.clean();
    for (let i = 0; i < 100; i++) RAW[i] = i;

    rng.seed(100, RAW);

    // testSetup({ctx, rng});
    // testKeygen({ctx, rng});
    // testSign({ctx, rng});

    testVerify({ctx, rng});
    // testRandomize({ctx, rng});






    //
    // let testMessage = "Hello World!";
    //
    // let messageBytes = [];
    // for (let i = 0; i < testMessage.length; i++){
    //     messageBytes.push(testMessage.charCodeAt(i));
    // }
    // // let ctx2 = new CTX("") // needed?
    // let H = new ctx.HASH256();
    // H.process_array(messageBytes);
    // let R = H.hash(); // returns digest
    //
    // let m = ctx.BIG.fromBytes(R);
    //

    /*

    let messageBytes = [];
    for (let i = 0; i < m.length; i++){
        messageBytes.push(m.charCodeAt(i));
    }
    let messageBN = ctx.BIG.fromBytes(messageBytes);

    // console.log(messageBytes);
    //
    // console.log(messageBN);
    //
    console.log(messageBN.toString());

    //let t = (messageBN.tobytearray(messageBN));


    // console.log(t);
    //
    // console.log(messageBN.toBytes(messageBN));
*/
    return;
    testDummyBilinearity();




    var ctx = new CTX("BN254");
    var RAW = [];
    var rng = new ctx.RAND();
    var G=new ctx.ECP(0); // cyclic group G1
    var Q=new ctx.ECP2(0); // cyclic group G2

    rng.clean();
    for (let i = 0; i < 100; i++) RAW[i] = i;

    rng.seed(100, RAW);


    var r = new ctx.BIG(0);
    var x = new ctx.BIG(0);
    var y = new ctx.BIG(0);

    //??
    var qx = new ctx.FP2(0);
    var qy = new ctx.FP2(0);

    // Set curve order
    // BN254 returns "16798108731015832284940804142231733909759579603404752749028378864165570215949" (after toString); same as the python's implementation; suggests correct curve

    r.rcopy(ctx.ROM_CURVE.CURVE_Order);

    // Set generator of G1
    x.rcopy(ctx.ROM_CURVE.CURVE_Gx);
    y.rcopy(ctx.ROM_CURVE.CURVE_Gy);
    G.setxy(x,y);

    // Set generator of G2
    x.rcopy(ctx.ROM_CURVE.CURVE_Pxa);
    y.rcopy(ctx.ROM_CURVE.CURVE_Pxb);
    qx.bset(x, y);
    x.rcopy(ctx.ROM_CURVE.CURVE_Pya);
    y.rcopy(ctx.ROM_CURVE.CURVE_Pyb);
    qy.bset(x, y);
    Q.setxy(qx, qy);

    console.log(r.toString());
    // no idea what those do
    let P = ctx.PAIR.G1mul(G,r);
    let W = ctx.PAIR.G2mul(Q,r);


    x = ctx.BIG.randomnum(r,rng);
    y = ctx.BIG.randomnum(r,rng);

    // comment those?
    let G1 = ctx.PAIR.G1mul(G,x); // is that the e stuff;this?; generator times rand?
    let Q1 = ctx.PAIR.G2mul(Q,y); // and that?

    let gt = ctx.PAIR.ate(Q1, G1); // try reversed?
    gt = ctx.PAIR.fexp(gt);
    // console.log(gt.toString());

    s = ctx.BIG.randomnum(r, rng);

    let test2num = new ctx.BIG(2);
    let test3num = new ctx.BIG(3);
    let test6num = new ctx.BIG(6);

    let g1test = G1.mul(test2num);
    let g2test = Q1.mul(test3num);

    let gt6_1 = ctx.PAIR.ate(g2test, g1test);
    gt6_1 = ctx.PAIR.fexp(gt6_1);

    let gt6_2 = ctx.PAIR.GTpow(gt, test6num);

    // let gttest = ctx.PAIR.ate(g1test, g2test);
}


















const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
    // console.log("test");
    testSRS();


});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});