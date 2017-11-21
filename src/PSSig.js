import BpGroup from "./BpGroup"

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
        const [G, o, g1, g2, e] = params;

        // Target values:
        const x = G.ctx.BIG.randomnum(G.order, G.rngGen);
        const y = G.ctx.BIG.randomnum(G.order, G.rngGen);

        const sk = [x, y];
        const pk = [g2, G.ctx.PAIR.G2mul(g2, x), G.ctx.PAIR.G2mul(g2, y)];

        return [sk, pk]
    }

    // sig = (x+y*m) * h
    static sign(params, sk, m, isMessageHashed = false) {
        const [G, o, g1, g2, e] = params;
        const [x, y] = sk;

        // RANDOM h:
        // const rand = G.ctx.BIG.randomnum(o, G.rngGen);
        // const h = G.ctx.PAIR.G1mul(g1, rand);

        // h being hash of message to point on the curve
        const h = G.hashToPointOnCurve(m);

        if(!isMessageHashed) {
            m = G.hashToBIG(m);
        }

        // mcpy = m mod p
        const mcpy = new G.ctx.BIG(m);
        mcpy.mod(o);

        // t1 = y * (m mod p)
        const t1 = G.ctx.BIG.mul(y,mcpy);

        // DBIG constructor does not allow to pass it a BIG value hence we copy all word values manually
        const xDBIG =  new G.ctx.DBIG(0);
        for (let i = 0; i < G.ctx.BIG.NLEN; i++) {
            xDBIG.w[i] = x.w[i];
        }

        // t1 = x + y * (m mod p)
        t1.add(xDBIG);

        // K = (x + y * (m mod p)) mod p
        const K = t1.mod(o);

        // sig = K * h
        const sig = G.ctx.PAIR.G1mul(h, K);

        return [h, sig]
    }

    //  e(sig1, X + m * Y) == e(sig2, g)
    static verify(params, pk, m, sig) {
        const [G, o, g1, g2, e] = params;
        const [g, X, Y] = pk;
        const [sig1, sig2] = sig;

        m = G.hashToBIG(m);

        const G2_tmp1 = G.ctx.PAIR.G2mul(Y, m);
        G2_tmp1.add(X);
        G2_tmp1.affine();

        const Gt_1 = e(sig1, G2_tmp1);
        const Gt_2 = e(sig2, g);

        // TODO: sig is an array; check whether to check for INF for sig1 or sig2
        return !sig.INF && Gt_1.equals(Gt_2);
    }

    static randomize(params, sig) {
        const [G, o, g1, g2, e] = params;
        const [sig1, sig2] = sig;
        const t = G.ctx.BIG.randomnum(G.order, G.rngGen);

        return [G.ctx.PAIR.G1mul(sig1, t), G.ctx.PAIR.G1mul(sig2, t)]
    }


    static aggregateSignatures(params, signatures) {
        const [G, o, g1, g2, e] = params;

        let aggregateSignature = new G.ctx.ECP();
        aggregateSignature.copy(signatures[0]);

        for(let i = 1; i < signatures.length; i++) {
            aggregateSignature.add(signatures[1]);
        }

        aggregateSignature.affine();
        return aggregateSignature;
    }

   static verifyAggregation(params, pks, m, aggregateSignature) {

        // BLSSIG
       /*

               const [G, o, g1, g2, e] = params;

        let Gt_1 = e(aggregateSignature, g2);

        let aggregatePK = new G.ctx.ECP2();
        aggregatePK.copy(pks[0]);

        for(let i = 1; i < pks.length; i++) {
            aggregatePK.add(pks[i]);
        }

        aggregatePK.affine();

        const h = G.hashToPointOnCurve(m);
        let Gt_2 = e(h, aggregatePK);


        return Gt_1.equals(Gt_2);
        
        */



        const [G, o, g1, g2, e] = params;

        const Gt_1 = e(aggregateSignature, g2);




        let pairings = [];
        for(let i = 0; i < ms.length; i++) {
            let h = G.hashToPointOnCurve(ms[i]);
            let [g, X, Y] = pks[i];

            let m = G.hashToBIG(ms[i]); // replace with the other hash?

            const G2_tmp1 = G.ctx.PAIR.G2mul(Y, m);
            G2_tmp1.add(X);
            G2_tmp1.affine();

            const Gt_2 = e(h, G2_tmp1);

            pairings.push(Gt_2);
        }

        let aggregatePairing = new G.ctx.FP12(pairings[0]);

        for(let i = 1; i < pairings.length; i++) {
            // pairings[0].mul(pairings[i]);
            // operation was not explicitly defined but I assume it follows same pattern as FP4, FP2 and FP addition
            aggregatePairing.a.add(pairings[i].a);
            aggregatePairing.b.add(pairings[i].b);
            aggregatePairing.c.add(pairings[i].c);

        }

        return Gt_1.equals(aggregatePairing);




    }
}
