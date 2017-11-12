/*
    TODO:
    - "proper" investigate RNG
 */

import CTX from "./lib/Milagro-Crypto-Library/ctx"


export default class BpGroup {
    constructor() {
        this.ctx = new CTX("BN254");

        // set order of the groups
        let o = new this.ctx.BIG(0);
        o.rcopy(this.ctx.ROM_CURVE.CURVE_Order);
        this.ord = o;

        // Set up instance of g1
        let g1 = new this.ctx.ECP();
        let x = new this.ctx.BIG(0);
        let y = new this.ctx.BIG(0);

        // Set generator of g1
        x.rcopy(this.ctx.ROM_CURVE.CURVE_Gx);
        y.rcopy(this.ctx.ROM_CURVE.CURVE_Gy);
        g1.setxy(x, y);

        this.g1 = g1;

        // Set up instance of g2
        let g2 = new this.ctx.ECP2();
        let qx = new this.ctx.FP2(0);
        let qy = new this.ctx.FP2(0);

        // Set generator of g2
        x.rcopy(this.ctx.ROM_CURVE.CURVE_Pxa);
        y.rcopy(this.ctx.ROM_CURVE.CURVE_Pxb);
        qx.bset(x, y);
        x.rcopy(this.ctx.ROM_CURVE.CURVE_Pya);
        y.rcopy(this.ctx.ROM_CURVE.CURVE_Pyb);
        qy.bset(x, y);
        g2.setxy(qx, qy);

        this.g2 = g2;

        /*
            Currently the RNG generator is seeded with constant seed;
            TODO: Investigate "proper" entropy sources
            TODO: Even though examples used |s| = 100, consider longer seeds?
         */
        let RAW = [];
        let rng = new this.ctx.RAND();
        rng.clean();
        for (let i = 0; i < 100; i++) RAW[i] = i;
        rng.seed(100, RAW);
        this.rng = rng;

        this.pair = this.pair.bind(this)
    }


    get rngGen() {
        return this.rng;
    }

    get order() {
        return this.ord;
    }

    get gen1() {
        return this.g1;
    }

    get gen2() {
        return this.g2;
    }

    pair(g1, g2) {
        return this.ctx.PAIR.fexp(this.ctx.PAIR.ate(g2, g1));
    };
};
