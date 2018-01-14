import { ctx } from '../src/config';

const MIN_TTL_H = 12;

export default class Coin {
  constructor(v, ide, value, ttl = -1, id = null) {
    // this.ctx = new CTX('BN254');
    this.ctx = ctx;
    // does it matter if id is g1^id or g2^id ?

    const x = new this.ctx.BIG(0);
    const y = new this.ctx.BIG(0);

    // Set up instance of g2
    const g2 = new this.ctx.ECP2();
    const qx = new this.ctx.FP2(0);
    const qy = new this.ctx.FP2(0);

    // Set generator of g2
    x.rcopy(this.ctx.ROM_CURVE.CURVE_Pxa);
    y.rcopy(this.ctx.ROM_CURVE.CURVE_Pxb);
    qx.bset(x, y);
    x.rcopy(this.ctx.ROM_CURVE.CURVE_Pya);
    y.rcopy(this.ctx.ROM_CURVE.CURVE_Pyb);
    qy.bset(x, y);
    g2.setxy(qx, qy);

    this.g2 = g2;

    this.v = v;
    this.value = value;

    if (id === null) {
      this.id = this.ctx.PAIR.G2mul(this.g2, ide);
    } else {
      this.id = id;
    }

    if (ttl > 0) {
      this.ttl = ttl;
    } else {
      this.ttl = Coin.getTimeToLive();
    }
  }

  // alias for v
  get publicKey() {
    return this.v;
  }

  // alias for ttl
  get timeToLive() {
    return this.ttl;
  }

  getSimplifiedCoin() {
    const bytesId = [];
    const bytesV = [];
    this.id.toBytes(bytesId);
    this.v.toBytes(bytesV);
    return {
      bytesV: bytesV,
      value: this.value,
      ttl: this.ttl,
      bytesId: bytesId,
    };
  }

  // it is using same curve as the other scheme
  static keygen(params) {
      const [G, o, g1, g2, e] = params;

      const sk = G.ctx.BIG.randomnum(G.order, G.rngGen);
      const pk = G.ctx.PAIR.G2mul(g2, sk);

      return [sk, pk];
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

  static fromSimplifiedCoin(simplifiedCoin) {
    const {
      bytesV, value, ttl, bytesId,
    } = simplifiedCoin;

    const v = ctx.ECP2.fromBytes(bytesV); // ECP2?
    const id = ctx.ECP2.fromBytes(bytesId);
    return new Coin(v, null, value, ttl, id);
  }

  static getHourTimeDifference(date1, date2) {
    const difference = (date1.getTime() - date2.getTime()) / (1000 * 60 * 60);
    return Math.abs(Math.round(difference));
  }

  static getTimeToLive() {
    const currentTime = new Date();
    const endOfDayTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      23, 59, 59, 999,
    );

    let timeToLive;
    const hoursUntilEndOfDay = Coin.getHourTimeDifference(currentTime, endOfDayTime);
    // if it's less than MIN hours until end of day, set TTL to end of day plus 24h
    if (hoursUntilEndOfDay < MIN_TTL_H) {
      timeToLive = endOfDayTime.getTime() + 1 + (1000 * 60 * 60 * 24);
    } else {
      timeToLive = endOfDayTime.getTime() + 1; // otherwise just set it to end of day
    }

    return timeToLive;
  }
}
