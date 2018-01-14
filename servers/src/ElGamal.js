export default class ElGamal {
  static setup() {
    // not needed since its the same as CoinSig?
    return 0;
  }

  static keygen(params) {
    const [G, o, g1, g2, e] = params;
    const sk = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const pk = G.ctx.PAIR.G1mul(g1, sk);

    return [sk, pk];
  }

  static encrypt(params, pk, m, h) {
    // encrypts some h^m, where h is element of G1
    const [G, o, g1, g2, e] = params;
    const k = G.ctx.BIG.randomnum(G.order, G.rngGen);

    const a = G.ctx.PAIR.G1mul(g1, k);
    const b1 = G.ctx.PAIR.G1mul(pk, k);
    const b2 = G.ctx.PAIR.G1mul(h, m);

    b1.add(b2);
    b1.affine();

    return [a, b1, k];
  }

  static decrypt(params, sk, c) {
    const [G, o, g1, g2, e] = params;
    const [a, b] = c;

    const t1 = G.ctx.PAIR.G1mul(a, sk);

    // to prevent original object mutation
    const b_cpy = new G.ctx.ECP();
    b_cpy.copy(b);

    // mod stuff?
    b_cpy.sub(t1);
    return b_cpy;
  }
}
