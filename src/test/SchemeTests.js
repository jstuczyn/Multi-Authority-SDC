
import PSSig from "../PSSig";
import BpGroup from "../BpGroup";

import * as mocha from "mocha";
import * as chai from 'chai';

describe("Pointcheval-Sanders Short Randomizable Signatures scheme", () => {
    /*
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
    });*/

    // todo: better test for whether aggregation is correct

    describe("Aggregate", () => {
        it("Aggregation(s1) = s1", () => {
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

       it("using PSSIG", () => {
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

       it("using modified paper scheme", () => {
           const params = PSSig.setup();
           const [G, o, g1, g2, e] = params;

           let x1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
           let x2 = G.ctx.BIG.randomnum(G.order, G.rngGen);

           let v1 = G.ctx.PAIR.G2mul(g2, x1);
           let v2 = G.ctx.PAIR.G2mul(g2, x2);

           let m1 = "Test1";
           let m2 = "Test2";

           let h1 = G.hashToPointOnCurve(m1);
           let h2 = G.hashToPointOnCurve(m2);

           let sig1 = G.ctx.PAIR.G1mul(h1, x1);
           let sig2 = G.ctx.PAIR.G1mul(h2, x2);

           console.log("ver1: ", (e(sig1, g2)).equals(e(h1, v1)) );
           console.log("ver2: ", (e(sig2, g2)).equals(e(h2, v2)) );

           let aggregateSignature = new G.ctx.ECP();
           aggregateSignature.copy(sig1);

           aggregateSignature.add(sig2); // aggregate signature

           let gt_1 = e(aggregateSignature, g2);


           let pair1 = e(h1, v1);

           let aggregatePairing = new G.ctx.FP12(pair1);


           let pair2 = e(h2, v2);

           aggregatePairing.a.add(pair2.a);
           aggregatePairing.b.add(pair2.b);
           aggregatePairing.c.add(pair2.c);




           chai.assert.isTrue(gt_1.equals(aggregatePairing));








       });
    });

});