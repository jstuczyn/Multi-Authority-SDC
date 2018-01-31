import { ctx } from './config';
import ElGamal from './ElGamal';
import { hashToPointOnCurve, hashToBIG } from './auxiliary';

const MIN_TTL_H = 12;

export default class Coin {
  // unfortunately javascript doesn't have constructor overloading
  constructor(v, id, value, ttl = -1, ID = null) {
    this.ctx = ctx;
    this.enc_sk = null;
    this.enc_id = null;

    // todo: set instance of BpGroup instead?

    // Set up instance of g1
    const g1 = new this.ctx.ECP();
    const x = new this.ctx.BIG(0);
    const y = new this.ctx.BIG(0);

    // Set generator of g1
    x.rcopy(this.ctx.ROM_CURVE.CURVE_Gx);
    y.rcopy(this.ctx.ROM_CURVE.CURVE_Gy);
    g1.setxy(x, y);

    this.g1 = g1;

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

    if (ID === null) {
      this.ID = this.ctx.PAIR.G1mul(this.g1, id);
    } else {
      this.ID = ID;
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
    const bytesID = [];
    const bytesV = [];
    this.ID.toBytes(bytesID);
    this.v.toBytes(bytesV);
    return {
      bytesV: bytesV,
      value: this.value,
      ttl: this.ttl,
      bytesID: bytesID,
      sig: this.sig,
    };
  }

  static fromSimplifiedCoin(simplifiedCoin) {
    const {
      bytesV, value, ttl, bytesID, sig
    } = simplifiedCoin;

    const v = ctx.ECP2.fromBytes(bytesV);
    const ID = ctx.ECP.fromBytes(bytesID);
    const recreatedCoin = new Coin(v, null, value, ttl, ID);
    recreatedCoin.sig = sig;
    return recreatedCoin;
  }

  // that is sent to signing authority so they need encrypted id and secret
  prepareCoinForSigning(ElGamalPK = null, params = null, id = null, sk = null) {
    if (!this.enc_sk) {
      const h = hashToPointOnCurve(this.value.toString() +
                                   this.ttl.toString() +
                                   this.v.toString() +
                                   this.ID.toString());

      const [a1, b1, k1] = ElGamal.encrypt(params, ElGamalPK, sk, h);
      const [a2, b2, k2] = ElGamal.encrypt(params, ElGamalPK, id, h);

      this.enc_sk = [a1, b1];
      this.enc_id = [a2, b2];
    }

    // keep bytes representation of coin attributes -
    // no point in recomputing them for each authority
    if (!this.bytesID) {
      // ID and v required by SA to compute h
      this.bytesID = [];
      this.bytesV = [];
      this.ID.toBytes(this.bytesID);
      this.v.toBytes(this.bytesV);

      const sk_a_bytes = [];
      const sk_b_bytes = [];
      const id_a_bytes = [];
      const id_b_bytes = [];

      this.enc_sk[0].toBytes(sk_a_bytes);
      this.enc_sk[1].toBytes(sk_b_bytes);
      this.enc_id[0].toBytes(id_a_bytes);
      this.enc_id[1].toBytes(id_b_bytes);

      this.enc_sk_bytes = [sk_a_bytes, sk_b_bytes];
      this.enc_id_bytes = [id_a_bytes, id_b_bytes];
    }

    return {
      bytesV: this.bytesV,
      value: this.value,
      ttl: this.ttl,
      bytesID: this.bytesID,
      enc_sk_bytes: this.enc_sk_bytes,
      enc_id_bytes: this.enc_id_bytes,
    };
  }

  static fromSigningCoin(signingCoin) {
    const {
      bytesV, value, ttl, bytesID, enc_sk_bytes, enc_id_bytes,
    } = signingCoin;

    const v = ctx.ECP2.fromBytes(bytesV);
    const ID = ctx.ECP.fromBytes(bytesID);

    const sk_a = ctx.ECP.fromBytes(enc_sk_bytes[0]);
    const sk_b = ctx.ECP.fromBytes(enc_sk_bytes[1]);

    const id_a = ctx.ECP.fromBytes(enc_id_bytes[0]);
    const id_b = ctx.ECP.fromBytes(enc_id_bytes[1]);

    const coin = new Coin(v, null, value, ttl, ID);
    coin.enc_sk = [sk_a, sk_b];
    coin.enc_id = [id_a, id_b];

    return coin;
  }

  // it is using same curve as the other scheme
  static keygen(params) {
    const [G, o, g1, g2, e] = params;

    const sk = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const pk = G.ctx.PAIR.G2mul(g2, sk);

    return [sk, pk];
  }

  static prepareProofOfSecret(params, sk, verifier) {
    const [G, o, g1, g2, e] = params;
    const w = ctx.BIG.randomnum(G.order, G.rngGen);
    const W = ctx.PAIR.G2mul(g2, w);
    const cm = hashToBIG(W.toString() + verifier);

    // to prevent object mutation
    const sk_cpy = new ctx.BIG(sk);
    const cm_cpy = new ctx.BIG(cm);
    sk_cpy.mod(o);
    cm_cpy.mod(o);

    const t1 = ctx.BIG.mul(sk_cpy, cm_cpy); // produces DBIG
    const t2 = t1.mod(o); // but this gives BIG back

    w.mod(o);
    const r = new ctx.BIG(w);

    r.copy(w);
    r.sub(t2);
    r.add(o); // to ensure positive result
    r.mod(o);

    return [W, cm, r]; // G2Elem, BIG, BIG
  }

  static verifyProofOfSecret(params, pk, W, cm, r, verifier) {
    const [G, o, g1, g2, e] = params;

    const t1 = ctx.PAIR.G2mul(g2, r);
    const t2 = ctx.PAIR.G2mul(pk, cm); // public key is g1^sk now, todo: fix

    t1.add(t2);
    t1.affine();

    const expr1 = t1.equals(W);
    const expr2 = ctx.BIG.comp(cm, hashToBIG(W.toString() + verifier)) === 0;

    return expr1 && expr2;
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
