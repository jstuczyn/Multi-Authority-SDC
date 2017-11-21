import BLSSig from "../BLSSig";
import BpGroup from "../BpGroup";

import * as mocha from "mocha";
import * as chai from 'chai';

describe("Boneh–Lynn–Shacham Signatures scheme", () => {
    describe("Setup", () => {
        const params = BLSSig.setup();
        const [G, o, g1, g2, e] = params;

        it("Returns BpGroup Object", () => {
            chai.assert.isNotNull(G);
            chai.assert.isTrue(G instanceof (BpGroup));
        });

        it("Returns Group Order", () => {
            chai.assert.isNotNull(o);
            chai.assert.isTrue(o instanceof (G.ctx.BIG));
        });

        it("Returns Gen1", () => {
            chai.assert.isNotNull(g1);
            chai.assert.isTrue(g1 instanceof (G.ctx.ECP));
        });

        it("Returns Gen2", () => {
            chai.assert.isNotNull(g2);
            chai.assert.isTrue(g2 instanceof (G.ctx.ECP2));
        });

        it("Returns Pair function", () => {
            chai.assert.isNotNull(e);
            chai.assert.isTrue(e instanceof (Function));
        });
    });

    describe("Keygen", () => {
        const params = BLSSig.setup();
        const [G, o, g1, g2, e] = params;
        const [sk, pk] = BLSSig.keygen(params);


        it("Returns Secret Key x", () => {
            chai.assert.isTrue(sk instanceof (G.ctx.BIG));
        });

        it("Returns Valid Private Key v = x * g2", () => {
            chai.assert.isTrue(pk.equals(G.ctx.PAIR.G2mul(g2, sk)));
        });
    });

// h, sig = (x+y*m) * h
    describe("Sign", () => {
        const params = BLSSig.setup();
        const [G, o, g1, g2, e] = params;
        const [sk, pk] = BLSSig.keygen(params);

        let m = "Hello World!";

        const signature = BLSSig.sign(params, sk, m);

        it("signature = sk * H(m)", () => {
            const h = G.hashToPointOnCurve(m);

            const sig_test = G.ctx.PAIR.G1mul(h, sk);
            chai.assert.isTrue(signature.equals(sig_test))
        });
    });


    describe("Verify", () => {
        const params = BLSSig.setup();
        const [G, o, g1, g2, e] = params;
        const [sk, pk] = BLSSig.keygen(params);

        const m = "Hello World!";
        const sig = BLSSig.sign(params, sk, m);

        it("Successful verification for original message", () => {
            chai.assert.isTrue(BLSSig.verify(params, pk, m, sig));
        });

        it("Failed verification for another message", () => {
            let m2 = "Other Hello World!";
            chai.assert.isNotTrue(BLSSig.verify(params, pk, m2, sig));
        });
    });

    describe("Aggregate", () => {
        xit("Aggregation(s1) = s1", () => {
            // const params = PSSig.setup();
            // const [G, o, g1, g2, e] = params;
            // const [sk, pk] = PSSig.keygen(params);
            // const [x, y] = sk;
            //
            // const m = "Hello World!";
            // let [sig1, sig2] = PSSig.sign(params, sk, m);
            // let aggregateSig = PSSig.aggregateSignatures(params, [sig2]);
            //
            // chai.assert.isTrue(sig2.equals(aggregateSig));
        });
    });

    describe("Aggregate Verification", () => {
        it("using BLSSig", () => {
            const params = BLSSig.setup();
            const [G, o, g1, g2, e] = params;

            const messagesToSign = 2;
            let pks = [];
            let signatures = [];

            const m = "Hello World!";

            for (let i = 0; i < messagesToSign; i++) {
                let [sk, pk] = BLSSig.keygen(params);
                pks.push(pk);
                let signature = BLSSig.sign(params, sk, m);
                signatures.push(signature);
            }

            let aggregateSignature = BLSSig.aggregateSignatures(params, signatures);

            chai.assert.isTrue(BLSSig.verifyAggregation(params, pks, m, aggregateSignature));

        });

    });


});