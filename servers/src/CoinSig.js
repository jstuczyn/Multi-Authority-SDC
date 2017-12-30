// A slightly modified Pointcheval-Sanders Short Randomizable Signatures scheme
// to allow for larger number of signed messages

import BpGroup from './BpGroup';

export default class CoinSig {
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

    const x0 = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const x1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const x2 = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const x3 = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const x4 = G.ctx.BIG.randomnum(G.order, G.rngGen);

    const X0 = G.ctx.PAIR.G2mul(g2, x0);
    const X1 = G.ctx.PAIR.G2mul(g2, x1);
    const X2 = G.ctx.PAIR.G2mul(g2, x2);
    const X3 = G.ctx.PAIR.G2mul(g2, x3);
    const X4 = G.ctx.PAIR.G2mul(g2, x4);

    const sk = [x0, x1, x2, x3, x4];
    const pk = [g2, X0, X1, X2, X3, X4];

    return [sk, pk];
  }

  // sig = (x0 + x1*a1 + x2*a2 + x3*a3 + x4*a4) * h
  static sign(params, sk, coin) {
    const [G, o, g1, g2, e] = params;
    const [x0, x1, x2, x3, x4] = sk;

    // todo: should h be a hash to G1 of some attribute? if so of which one?
    const rand = G.ctx.BIG.randomnum(o, G.rngGen);
    const h = G.ctx.PAIR.G1mul(g1, rand);

    const a1 = G.hashToBIG(coin.value);
    const a2 = G.hashToBIG(coin.ttl);
    const a3 = G.hashG2ElemToBIG(coin.v);
    const a4 = G.hashG2ElemToBIG(coin.id);

    // calculate a1 mod p, a2 mod p, etc.
    const a1_cpy = new G.ctx.BIG(a1);
    a1_cpy.mod(o);

    const a2_cpy = new G.ctx.BIG(a2);
    a2_cpy.mod(o);

    const a3_cpy = new G.ctx.BIG(a3);
    a3_cpy.mod(o);

    const a4_cpy = new G.ctx.BIG(a4);
    a4_cpy.mod(o);

    // calculate t1 = x1 * (a1 mod p), t2 = x2 * (a2 mod p), etc.
    const t1 = G.ctx.BIG.mul(x1, a1_cpy);
    const t2 = G.ctx.BIG.mul(x2, a2_cpy);
    const t3 = G.ctx.BIG.mul(x3, a3_cpy);
    const t4 = G.ctx.BIG.mul(x4, a4_cpy);

    // DBIG constructor does not allow to pass it a BIG value hence we copy all word values manually
    const x0DBIG = new G.ctx.DBIG(0);
    for (let i = 0; i < G.ctx.BIG.NLEN; i++) {
      x0DBIG.w[i] = x0.w[i];
    }

    // x0 + t1 + t2 + ...
    x0DBIG.add(t1);
    x0DBIG.add(t2);
    x0DBIG.add(t3);
    x0DBIG.add(t4);

    // K = (x0 + x1*a1 + x2*a2 + ...) mod p
    const K = x0DBIG.mod(o);

    // sig = K * h
    const sig = G.ctx.PAIR.G1mul(h, K);

    return [h, sig];
  }

  static verify(params, pk, coin, sig) {
    return;
  }

  static randomize(params, sig) {
    return;
  }

  static aggregateSignatures(params, signatures) {
    return;
  }

  static verifyAggregation(params, pks, coin, aggregateSignature) {
    return;
  }
}
