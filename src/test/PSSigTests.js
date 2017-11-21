
import PSSig from "../PSSig";
import BpGroup from "../BpGroup";

import * as mocha from "mocha";
import * as chai from 'chai';

/*

describe("Pointcheval-Sanders Short Randomizable Signatures scheme", () => {
describe("Setup", () => {
    const params = PSSig.setup();
    const [G, o, g1, g2, e] = params;

    it("Returns BpGroup Object", () => {
        chai.assert.isNotNull(G);
        chai.assert.isTrue(G instanceof(BpGroup));
    });

    it("Returns Group Order", () => {
        chai.assert.isNotNull(o);
        chai.assert.isTrue(o instanceof(G.ctx.BIG));
    });

    it("Returns Gen1", () => {
        chai.assert.isNotNull(g1);
        chai.assert.isTrue(g1 instanceof(G.ctx.ECP));
    });

    it("Returns Gen2", () => {
        chai.assert.isNotNull(g2);
        chai.assert.isTrue(g2 instanceof(G.ctx.ECP2));
    });

    it("Returns Pair function", () => {
        chai.assert.isNotNull(e);
        chai.assert.isTrue(e instanceof(Function));
    });
});

describe("Keygen", () => {
    const params = PSSig.setup();
    const [G, o, g1, g2, e] = params;
    const [sk, pk] = PSSig.keygen(params);

    const [x, y] = sk;
    let [g, X, Y] = pk;

    it("Returns Secret Key (x,y)", () => {
        chai.assert.isTrue(x instanceof(G.ctx.BIG));
        chai.assert.isTrue(y instanceof(G.ctx.BIG));
    });

// todo: replace g2.mul with PAIR.G2mul
    describe("Returns Valid Private Key (g,X,Y)", () => {
        it("g = g2", () => {
            chai.assert.isTrue(g2.equals(g));
        });

        it("X = g2*x", () => {
            chai.assert.isTrue(X.equals(g2.mul(x)));
        });

        it("Y = g2*y", () => {
            chai.assert.isTrue(Y.equals(g2.mul(y)));
        });

    })
});

// h, sig = (x+y*m) * h
 describe("Sign", () => {
    const params = PSSig.setup();
    const [G, o, g1, g2, e] = params;
    const [sk, pk] = PSSig.keygen(params);
    const [x, y] = sk;

    let m = "Hello World!";

    const signature = PSSig.sign(params, sk, m);
    const [sig1, sig2] = signature;


    it("For signature(sig1, sig2), sig2 = ((x+y*(m mod p)) mod p) * sig1", () => {
        m = G.hashToBIG(m);
        const mcpy = new G.ctx.BIG(m);
        mcpy.mod(o);

        const t1 = G.ctx.BIG.mul(y,mcpy);

        const xDBIG =  new G.ctx.DBIG(0);
        for (let i = 0; i < G.ctx.BIG.NLEN; i++) {
            xDBIG.w[i] = x.w[i];
        }
        t1.add(xDBIG);
        const K = t1.mod(o);

        const sig_test = G.ctx.PAIR.G1mul(sig1, K);
        chai.assert.isTrue(sig2.equals(sig_test))
    });
});


describe("Verify", () => {
    describe("With sk = (42, 513)", () => {
        const params = PSSig.setup();
        const [G, o, g1, g2, e] = params;

        // keygen needs to be done "manually"
        const x = new G.ctx.BIG(42);
        const y = new G.ctx.BIG(513);

        const sk = [x, y];
        const pk = [g2, g2.mul(x), g2.mul(y)];

        const m = "Hello World!";
        const sig = PSSig.sign(params, sk, m);

        it("Successful verification for original message", () => {
            chai.assert.isTrue(PSSig.verify(params, pk, m, sig));
        });

        it("Failed verification for another message", () => {
            let m2 = "Other Hello World!";
            chai.assert.isNotTrue(PSSig.verify(params, pk, m2, sig));
        });

    });

    describe("With 'proper' random", () => {
        const params = PSSig.setup();
        const [G, o, g1, g2, e] = params;
        const [sk, pk] = PSSig.keygen(params);
        const [x, y] = sk;

        const m = "Hello World!";
        const sig = PSSig.sign(params, sk, m);

        it("Successful verification for original message", () => {
            chai.assert.isTrue(PSSig.verify(params, pk, m, sig));
        });

        it("Failed verification for another message", () => {
            let m2 = "Other Hello World!";
            chai.assert.isNotTrue(PSSig.verify(params, pk, m2, sig));
        });
    });
});


describe("Randomize", () => {
    const params = PSSig.setup();
    const [G, o, g1, g2, e] = params;
    const [sk, pk] = PSSig.keygen(params);
    const [x, y] = sk;

    const m = "Hello World!";
    let sig = PSSig.sign(params, sk, m);
    sig = PSSig.randomize(params, sig);

    it("Successful verification for original message with randomized signature", () => {
        chai.assert.isTrue(PSSig.verify(params, pk, m, sig));
    });

    it("Failed verification for another message with randomized signature", () => {
        let m2 = "Other Hello World!";
        chai.assert.isNotTrue(PSSig.verify(params, pk, m2, sig));
    });
});

// todo: better test for whether aggregation is correct

describe("Aggregate", () => {
    xit("Aggregation(s1) = s1", () => {
        const params = PSSig.setup();
        const [G, o, g1, g2, e] = params;
        const [sk, pk] = PSSig.keygen(params);
        const [x, y] = sk;

        const m = "Hello World!";
        let [sig1, sig2] = PSSig.sign(params, sk, m);
        let aggregateSig = PSSig.aggregateSignatures(params, [sig2]);

        chai.assert.isTrue(sig2.equals(aggregateSig));
    });
});

describe("Aggregate Verification", () => {
    // returns error when duplicates

   xit("using PSSIG", () => {
       const params = PSSig.setup();
       const [G, o, g1, g2, e] = params;

       const messagesToSign = 3;
       let pks = [];
       let ms = [];
       let sigs = [];

       for(let i = 0; i < messagesToSign; i++) {
           let messageToSign = `Test Message ${i}`;
           ms.push(messageToSign);
           let [sk, pk] = PSSig.keygen(params);
           pks.push(pk);
           let [sig1, sig2] = PSSig.sign(params, sk, messageToSign);
           sigs.push(sig2);
       }

       let aggregateSignature = PSSig.aggregateSignatures(params, sigs);

       chai.assert.isTrue(PSSig.verifyAggregation(params, pks, ms, aggregateSignature));

   });

   xit("using modified paper scheme", () => {
       const params = PSSig.setup();
       const [G, o, g1, g2, e] = params;

       // secret keys
       let x1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
       let x2 = G.ctx.BIG.randomnum(G.order, G.rngGen);

       // let x1 = new G.ctx.BIG(42)
       // let x2 = new G.ctx.BIG(144);

       // public keys
       let v1 = G.ctx.PAIR.G2mul(g2, x1);
       let v2 = G.ctx.PAIR.G2mul(g2, x2);

       // msg
       let m = "Hello World Test";
       let h = G.hashToPointOnCurve(m);

       // const rand = new G.ctx.BIG(13);
       // const h = G.ctx.PAIR.G1mul(g1, rand);


       // sign
       let sig1 = G.ctx.PAIR.G1mul(h, x1);
       let sig2 = G.ctx.PAIR.G1mul(h, x2);

       // intermediate verification
       console.log("ver1: ", (e(sig1, g2)).equals(e(h, v1)) );
       console.log("ver2: ", (e(sig2, g2)).equals(e(h, v2)) );



       let aggregateSignature = new G.ctx.ECP();
       aggregateSignature.copy(sig1);
       aggregateSignature.add(sig2); // aggregate signature


       aggregateSignature.affine(); // THIS IS THE MOST IMPORTANT BIT4

       // console.log("sig1: ", aggregateSignature.toString());
       // console.log("sig2: ", altAgg.toString());



       let gt_1 = e(aggregateSignature, g2);

       // console.log(gt_1.toString());
       // console.log(gt_11.toString());



       let aggregatePK = new G.ctx.ECP2();
       aggregatePK.copy(v1);

       aggregatePK.add(v2);

       console.log("aggPK:", aggregatePK.toString());

       let gt_2 = e(h, aggregatePK);


       chai.assert.isTrue(gt_1.equals(gt_2));

   });

   // https://link.springer.com/content/pdf/10.1007/11745853.pdf#page=270

   xit("Gentry-Ramzan", () => {
       const params = PSSig.setup();
       const [G, o, g1, g2, e] = params;

       // should arbitrary generator be "random" ?
       let m = "Hello";

       // secret keys
       let x1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
       let x2 = G.ctx.BIG.randomnum(G.order, G.rngGen);



       let ID1 = G.hashToPointOnCurve("ID1"); // different hash algorithm needs to be used
       let ID2 = G.hashToPointOnCurve("ID2");

       let Pi1 = G.ctx.PAIR.G1mul(ID1, x1);
       let Pi2 = G.ctx.PAIR.G1mul(ID2, x2);

       let Pm = G.hashToPointOnCurve(m);
       let r1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
       let r2 = G.ctx.BIG.randomnum(G.order, G.rngGen);


       // Si = riPm + sPi
       let S1 = G.ctx.PAIR.G1mul(Pm, r1);
       S1.add(Pi1);
       let T1 = G.ctx.PAIR.G1mul(g1, r1);


       let S2 = G.ctx.PAIR.G1mul(Pm, r2);
       S2.add(Pi2);
       let T2 = G.ctx.PAIR.G1mul(g1, r2);

       // aggregation; Sn and Tn
       S1.add(S2);
       T1.add(T2);


       let Gt_1 = e(S1, g2);






   });
});

});*/