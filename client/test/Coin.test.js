import { expect, assert } from 'chai';
import { before } from 'mocha';
import * as crypto from 'crypto';
import Coin from '../lib/Coin';
import { ctx } from '../src/config';

describe('Coin object', () => {
  let coinValue;
  let v;
  let coin;
  let ide;
  let g2;
  before(() => {
    coinValue = 42;
    v = { Dummy: 'object' };

    const x = new ctx.BIG(0);
    const y = new ctx.BIG(0);
    // Set up instance of g2
    g2 = new ctx.ECP2();
    const qx = new ctx.FP2(0);
    const qy = new ctx.FP2(0);

    // Set generator of g2
    x.rcopy(ctx.ROM_CURVE.CURVE_Pxa);
    y.rcopy(ctx.ROM_CURVE.CURVE_Pxb);
    qx.bset(x, y);
    x.rcopy(ctx.ROM_CURVE.CURVE_Pya);
    y.rcopy(ctx.ROM_CURVE.CURVE_Pyb);
    qy.bset(x, y);
    g2.setxy(qx, qy);

    const RAW = crypto.randomBytes(128);

    const rng = new ctx.RAND();
    rng.clean();
    rng.seed(RAW.length, RAW);
    const groupOrder = new ctx.BIG(0);
    groupOrder.rcopy(ctx.ROM_CURVE.CURVE_Order);

    ide = ctx.BIG.randomnum(groupOrder, rng);

    coin = new Coin(v, ide, coinValue);
  });

  describe('Construction', () => {
    it('Coin id equals to g2 to power of the random exponent', () => {
      assert.isTrue(coin.id.equals(ctx.PAIR.G2mul(g2, ide)));
    });

    it('Time to live generation', () => {
      // TODO: FIGURE OUT HOW TO PROPERLY TEST IT
    });

  });

  it('The alias for getting public key works correctly', () => {
    expect(coin.publicKey).to.equal(coin.v);
  });

  it('The alias for getting time to live works correctly', () => {
    expect(coin.timeToLive).to.equal(coin.ttl);
  });
});
