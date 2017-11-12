
import PSSig from "../PSSig";
import BpGroup from "../BpGroup";

import * as mocha from "mocha";
import * as chai from 'chai';

function stringToBytes(s) {
    let b = [];
    for (let i = 0; i < s.length; i++)
        b.push(s.charCodeAt(i));
    return b;
}

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

        //        const pk = [g2, g2.mul(x), g2.mul(y)];

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

        const testMessage = "Hello World!";
        const messageBytes = stringToBytes(testMessage);
        const H = new G.ctx.HASH256();
        H.process_array(messageBytes);
        const R = H.hash();
        const m = G.ctx.BIG.fromBytes(R);

        const signature = PSSig.sign(params, sk, m);
        const [sig1, sig2] = signature;


        // only works for y <= 513...
        it("For signature(sig1, sig2), sig2 = (x+y*m) * sig1", () => {
            // BIG TODO: smul vs mul... both have disadvantages, neither is working (will be shown in verify)
            const t1 = G.ctx.BIG.smul(y,m);
            const x_cp = new G.ctx.BIG(x);
            const t2 = x_cp.add(t1);

            let sig_test = sig1.mul(t2);
            chai.assert.isTrue(sig2.equals(sig_test))
        });
    });


    describe("Verify", () => {
        describe("With Y <= 513", () => {
            const params = PSSig.setup();
            const [G, o, g1, g2, e] = params;

            // keygen needs to be done "manually"
            const x = G.ctx.BIG.randomnum(G.order, G.rngGen);
            const y = new G.ctx.BIG(513);

            const sk = [x, y];
            const pk = [g2, g2.mul(x), g2.mul(y)];

            const testMessage = "Hello World!";
            const messageBytes = stringToBytes(testMessage);
            const H = new G.ctx.HASH256();
            H.process_array(messageBytes);
            const R = H.hash();
            const m = G.ctx.BIG.fromBytes(R);

            const sig = PSSig.sign(params, sk, m);

            it("Successful verification for original message", () => {
                chai.assert.isTrue(PSSig.verify(params, pk, m, sig));
            });

            it("Failed verification for another message", () => {
                let messageBytes2 = stringToBytes("Other Hello World!");
                let H2 = new G.ctx.HASH256();
                H2.process_array(messageBytes2);
                let R2 = H2.hash();
                let m2 = G.ctx.BIG.fromBytes(R2);

                chai.assert.isNotTrue(PSSig.verify(params, pk, m2, sig));
            });

        });

        describe("With 'proper' random", () => {
            const params = PSSig.setup();
            const [G, o, g1, g2, e] = params;
            const [sk, pk] = PSSig.keygen(params);
            const [x, y] = sk;

            const testMessage = "Hello World!";
            const messageBytes = stringToBytes(testMessage);
            const H = new G.ctx.HASH256();
            H.process_array(messageBytes);
            const R = H.hash();
            const m = G.ctx.BIG.fromBytes(R);

            const sig = PSSig.sign(params, sk, m);

            it("Successful verification for original message", () => {
                chai.assert.isTrue(PSSig.verify(params, pk, m, sig));
            });

            it("Failed verification for another message", () => {
                let messageBytes2 = stringToBytes("Other Hello World!");
                let H2 = new G.ctx.HASH256();
                H2.process_array(messageBytes2);
                let R2 = H2.hash();
                let m2 = G.ctx.BIG.fromBytes(R2);

                chai.assert.isNotTrue(PSSig.verify(params, pk, m2, sig));
            });
        });
    });


    describe("Randomize", () => {
        const params = PSSig.setup();
        const [G, o, g1, g2, e] = params;
        const [sk, pk] = PSSig.keygen(params);
        const [x, y] = sk;

        const testMessage = "Hello World!";
        const messageBytes = stringToBytes(testMessage);
        const H = new G.ctx.HASH256();
        H.process_array(messageBytes);
        const R = H.hash();
        const m = G.ctx.BIG.fromBytes(R);

        let sig = PSSig.sign(params, sk, m);
        sig = PSSig.randomize(params, sig);

        it("Successful verification for original message with randomized signature", () => {
            chai.assert.isTrue(PSSig.verify(params, pk, m, sig));
        });

        it("Failed verification for another message with randomized signature", () => {
            let messageBytes2 = stringToBytes("Other Hello World!");
            let H2 = new G.ctx.HASH256();
            H2.process_array(messageBytes2);
            let R2 = H2.hash();
            let m2 = G.ctx.BIG.fromBytes(R2);

            chai.assert.isNotTrue(PSSig.verify(params, pk, m2, sig));
        });
    });
});