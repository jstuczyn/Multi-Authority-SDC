import BpGroup from "../BpGroup";

import * as mocha from "mocha";
import * as chai from 'chai';


describe("Bilinear Pairing", () => {
    describe("Bilinearity Property", () => {
        const G = new BpGroup();

        // Get group generators
        const g1 = G.gen1;
        const g2 = G.gen2;
        const o = G.order;
        const e = G.pair;

        const x = G.ctx.BIG.randomnum(o, G.rngGen);
        const y = G.ctx.BIG.randomnum(o, G.rngGen);

        // Create G1Elem and G2Elem
        const g1Elem = G.ctx.PAIR.G1mul(g1, x);
        const g2Elem = G.ctx.PAIR.G2mul(g2, y);

        // pairing
        const gt = e(g1Elem, g2Elem);

        const big2 = new G.ctx.BIG(2);
        const big3 = new G.ctx.BIG(3);
        const big4 = new G.ctx.BIG(4);
        const big6 = new G.ctx.BIG(6);
        const big7 = new G.ctx.BIG(7);

        const g1test = g1Elem.mul(big2);
        const g2test = g2Elem.mul(big3);

        const gt6_1 = e(g1test, g2test);
        const gt6_2 = G.ctx.PAIR.GTpow(gt, big6);

        it("e(2*g1, 3*g2) == e(g1, g2)^6", () => {
            chai.assert.isTrue(gt6_1.equals(gt6_2));
        });

        it("e(2*g1, 3*g2) != e(g1, g2)^7", () => {
            const gt_7 = G.ctx.PAIR.GTpow(gt, big7);
            chai.assert.isNotTrue(gt6_1.equals(gt_7));
        });

        // Should have bilinearity property (  )


        it("e(3*g1, 4*g2) != e(g1, g2)^6", () => {
            const g1test_2 = g1Elem.mul(big3);
            const g2test_2 = g2Elem.mul(big4);
            const gt6_3 = e(g1test_2, g2test_2);

            chai.assert.isNotTrue(gt6_3.equals(gt6_2));
        });


        it("e(a*g1, g2) == e(g1,g2)^a for random a", () => {
            const a = G.ctx.BIG.randomnum(o, G.rngGen);
            const g1_test2 = g1Elem.mul(a);
            const gt_1 = e(g1_test2, g2Elem);
            const gt_2 = G.ctx.PAIR.GTpow(e(g1Elem, g2Elem), a);

            chai.assert.isTrue(gt_1.equals(gt_2));
        });

        it("e(g1, a*g2) == e(g1,g2)^a for random a", () => {
            const a = G.ctx.BIG.randomnum(o, G.rngGen);
            const g2_test2 = g2Elem.mul(a);
            const gt_1 = e(g1Elem, g2_test2);
            const gt_2 = G.ctx.PAIR.GTpow(e(g1Elem, g2Elem), a);

            chai.assert.isTrue(gt_1.equals(gt_2));
        });


        // it("e(a*g1, b*g2) == e(g1, g2)^(a*b) for random (a,b)", () => {
        //     const a = G.ctx.BIG.randomnum(o, G.rngGen);
        //     const b = G.ctx.BIG.randomnum(o, G.rngGen);
        //
        //     const g1_test2 = g1Elem.mul(a);
        //     const g2_test2 = g2Elem.mul(b);
        //
        //     const gt_1 = e(g1_test2, g2_test2);
        //
        //     const c = G.ctx.BIG.smul(a,b);
        //     // const c = G.ctx.BIG.mul(a,b);
        //
        //
        //     const gt_2 = G.ctx.PAIR.GTpow(e(g1Elem, g2Elem), c);
        //
        //     console.log("This is the core issue");
        //
        //     chai.assert.isTrue(gt_1.equals(gt_2));
        // })

    });

});