/*
    TODO:
    - "proper" investigate RNG
 */

// import {stringToBytes} from "../../servers/src/auxiliary"

// replaced in browser
import * as crypto from 'crypto';
import CTX from './Milagro-Crypto-Library/ctx';
import stringToBytes from './auxiliary';

export default class BpGroup {
// class BpGroup {
  constructor() {
    this.ctx = new CTX('BN254');

    // set order of the groups
    const o = new this.ctx.BIG(0);
    o.rcopy(this.ctx.ROM_CURVE.CURVE_Order);
    this.ord = o;

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

    /*
        Currently the RNG generator is seeded with constant seed;
        TODO: Investigate "proper" entropy sources
        TODO: Even though examples used |s| = 100, consider longer seeds?
     */
    // let RAW = new Uint8Array(128);
    // crypto.getRandomValues(RAW);

    const RAW = crypto.randomBytes(128);

    const rng = new this.ctx.RAND();
    rng.clean();
    rng.seed(RAW.length, RAW);
    // old "seed"
    // for (let i = 0; i < 100; i++) RAW[i] = i;
    // rng.seed(100, RAW);
    this.rng = rng;

    this.pair = this.pair.bind(this);
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
  }

  hashMessage(m) {
    const messageBytes = stringToBytes(m);
    const H = new this.ctx.HASH256();
    H.process_array(messageBytes);
    return H.hash();
  }

  hashToBIG(m) {
    const R = this.hashMessage(m);
    return this.ctx.BIG.fromBytes(R);
  }

  // implementation partially taken from https://github.com/milagro-crypto/milagro-crypto-js/blob/develop/src/node/mpin.js#L125
  hashToPointOnCurve(m) {
    const R = this.hashMessage(m);

    if (R.length === 0) return null;
    const W = [];

    // needs to be adjusted if different curve was to be chosen
    const sha = 32;
    if (sha >= this.ctx.BIG.MODBYTES) {
      for (let i = 0; i < this.ctx.BIG.MODBYTES; i++) W[i] = R[i];
    } else {
      for (let i = 0; i < sha; i++) W[i] = R[i];
      for (let i = sha; i < this.ctx.BIG.MODBYTES; i++) W[i] = 0;
    }
    return this.ctx.ECP.mapit(W);
  }
}
