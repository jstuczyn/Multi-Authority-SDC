import BpGroup from './BpGroup';

export default class BLSSig {
  static setup() {
    const G = new BpGroup();

    const g1 = G.gen1;
    const g2 = G.gen2;
    const e = G.pair;
    const o = G.order;

    return [G, o, g1, g2, e];
  }

  static keygen(params) {
    const [G, o, g1, g2, e] = params;

    const sk = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const pk = G.ctx.PAIR.G2mul(g2, sk);

    return [sk, pk];
  }

  static sign(params, sk, m) {
    const [G, o, g1, g2, e] = params;

    const h = G.hashToPointOnCurve(m);
    const sig = G.ctx.PAIR.G1mul(h, sk);

    return sig; // no need to return h as it is constant and deterministic given message
  }

  static verify(params, pk, m, sig) {
    const [G, o, g1, g2, e] = params;
    const h = G.hashToPointOnCurve(m);

    const Gt_1 = e(sig, g2);
    const Gt_2 = e(h, pk);

    return Gt_1.equals(Gt_2);
  }

  static aggregateSignatures(params, signatures) {
    const [G, o, g1, g2, e] = params;

    const aggregateSignature = new G.ctx.ECP();
    aggregateSignature.copy(signatures[0]);

    for (let i = 1; i < signatures.length; i++) {
      aggregateSignature.add(signatures[i]);
    }
    aggregateSignature.affine();

    return aggregateSignature;
  }

  static verifyAggregation(params, pks, m, aggregateSignature) {
    const [G, o, g1, g2, e] = params;

    const Gt_1 = e(aggregateSignature, g2);

    const aggregatePK = new G.ctx.ECP2();
    aggregatePK.copy(pks[0]);

    for (let i = 1; i < pks.length; i++) {
      aggregatePK.add(pks[i]);
    }
    aggregatePK.affine();


    const h = G.hashToPointOnCurve(m);
    const Gt_2 = e(h, aggregatePK);

    return Gt_1.equals(Gt_2);
  }

  static prepareProofOfSecret(params, sk) {
    const [G, o, g1, g2, e] = params;
    const w = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const W = G.ctx.PAIR.G2mul(g2, w);
    const cm = G.hashG2ElemToBIG(W);

    // to prevent object mutation
    const sk_cpy = new G.ctx.BIG(sk);
    const cm_cpy = new G.ctx.BIG(cm);
    sk_cpy.mod(o);
    cm_cpy.mod(o);

    const t1 = G.ctx.BIG.mul(sk_cpy, cm_cpy); // produces DBIG
    const t2 = t1.mod(o); // but this gives BIG back

    w.mod(o);
    const r = new G.ctx.BIG(w);

    r.copy(w);
    r.sub(t2);
    r.add(o); // to ensure positive result
    r.mod(o);

    return [W, cm, r]; // G2Elem, BIG, BIG
  }

  static verifyProofOfSecret(params, pk, W, cm, r) {
    const [G, o, g1, g2, e] = params;

    const t1 = G.ctx.PAIR.G2mul(g2, r);
    const t2 = G.ctx.PAIR.G2mul(pk, cm);

    t1.add(t2);
    t1.affine();

    const expr1 = t1.equals(W);
    const expr2 = G.ctx.BIG.comp(cm, G.hashG2ElemToBIG(W)) === 0;

    return expr1 && expr2;
  }
}
