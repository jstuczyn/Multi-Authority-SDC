import BpGroup from "./BpGroup"

/*
    TODO:
    - fix incorrect signature when given x,y = sk, y > 513

 */


export default class PSSig {

    static setup() {
        const G = new BpGroup();

        const g1 = G.gen1;
        const g2 = G.gen2;
        const e = G.pair;
        const o = G.order;

        return [G, o, g1, g2, e]
    }

    static keygen(params) {
        let [G, o, g1, g2, e] = params;

        // Target values:
        const x = G.ctx.BIG.randomnum(G.order, G.rngGen);
        const y = G.ctx.BIG.randomnum(G.order, G.rngGen);

        // Test values: (to compare intermediate products with values of working library)
        // X can be random as long as Y <= 513...

        // const x = new G.ctx.BIG(42);
        // const y = new G.ctx.BIG(513);

        const sk = [x, y];
        const pk = [g2, g2.mul(x), g2.mul(y)];

        return [sk, pk]
    }

    // sig = (x+y*m) * h
    static sign(params, sk, m) {
        let [G, o, g1, g2, e] = params;
        let [a, b] = sk;

        // makes a copy of them so that would not be overwritten during addition
        let x = new G.ctx.BIG(a);
        let y = new G.ctx.BIG(b);

        // Test value for testing and comparing intermediate products with working library
        // let rand = new G.ctx.BIG(32);

        // let h = G.ctx.PAIR.G1mul(g1, G.ctx.BIG.randomnum(o, G.rngGen));

        let rand = G.ctx.BIG.randomnum(o, G.rngGen);

        // target:
        // let h = g1.mul(rand);
        let h = G.ctx.PAIR.G1mul(g1, rand);

        // current broken alternatives:
        // smul returns instanceof BIG but loses carry of multiplication;
        // mul returns DBIG, which has correct value, but can't be used to multiply G1Elem
        let tmp1b = G.ctx.BIG.smul(y,m);
        let tmp1db = G.ctx.BIG.mul(y,m);

        let tmp2 = x.add(tmp1b);
        // tmp1db.add(x);

        let sig = h.mul(tmp2);
        // let sig = h.mul(tmp1db)

        return [h, sig]
    }

    //  e(sig1, X + m * Y) == e(sig2, g)
    static verify(params, pk, m, sig) {
        let [G, o, g1, g2, e] = params;
        let [g, X, Y] = pk;
        let [sig1, sig2] = sig;

        let G2_tmp1 = Y.mul(m);
        G2_tmp1.add(X);
        G2_tmp1.affine();

        let Gt_1 = e(sig1, G2_tmp1);
        let Gt_2 = e(sig2, g);

        return !sig.INF && Gt_1.equals(Gt_2);
    }

    static randomize(params, sig) {
        let [G, o, g1, g2, e] = params;
        let [sig1, sig2] = sig;
        let t = G.ctx.BIG.randomnum(G.order, G.rngGen);

        return [G.ctx.PAIR.G1mul(sig1, t), G.ctx.PAIR.G1mul(sig2, t)]
    }
}
