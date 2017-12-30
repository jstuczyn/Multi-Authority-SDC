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

    const x1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const x2 = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const x3 = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const x4 = G.ctx.BIG.randomnum(G.order, G.rngGen);

    const X1 = G.ctx.PAIR.G2mul(g2, x1);
    const X2 = G.ctx.PAIR.G2mul(g2, x2);
    const X3 = G.ctx.PAIR.G2mul(g2, x3);
    const X4 = G.ctx.PAIR.G2mul(g2, x4);

    const sk = [x1, x2, x3, x4];
    const pk = [g2, X1, X2, X3, X4];

    return [sk, pk];
  }

  static sign(params, sk, coin) {
    return;
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
