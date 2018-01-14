import { expect, assert } from 'chai';
import { before } from 'mocha';
import * as crypto from 'crypto';
import Coin from '../lib/Coin';
import CoinSig from '../lib/CoinSig'; // for params
import { ctx } from '../src/config';
import { getCoin } from '../src/utils/coinGenerator';

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

  // assumes previous tests would have detected errors so normal key generation could be used
  describe('Coin Object Simplification', () => {
    let properCoin;
    before(() => {
      const properCoinValue = 42;
      const params = CoinSig.setup();
      const [sk, pk] = Coin.keygen(params);
      properCoin = getCoin(pk, properCoinValue);
    });

    it('Can simplify a coin', () => {
      const simplifiedCoin = properCoin.getSimplifiedCoin();
      expect(simplifiedCoin).to.have.property('bytesV').that.is.an('array');
      expect(simplifiedCoin).to.have.property('value').that.is.an('number');
      expect(simplifiedCoin).to.have.property('ttl').that.is.an('number');
      expect(simplifiedCoin).to.have.property('bytesId').that.is.an('array');
    });

    it('Can re-create Coin', () => {
      const v_old = properCoin.v;
      const value_old = properCoin.value;
      const ttl_old = properCoin.ttl;
      const id_old = properCoin.id;

      const simplifiedCoin = properCoin.getSimplifiedCoin();
      const recreatedCoin = Coin.fromSimplifiedCoin(simplifiedCoin);

      const v_new = recreatedCoin.v;
      const value_new = recreatedCoin.value;
      const ttl_new = recreatedCoin.ttl;
      const id_new = recreatedCoin.id;

      assert.isTrue(v_old.equals(v_new));
      assert.isTrue(value_old === value_new);
      assert.isTrue(ttl_old === ttl_new);
      assert.isTrue(id_old.equals(id_new));
    });
  });

  describe('Prepare Proof of Secret', () => {
    it('Returns [W, cm, r], where none are null and cm = H(W)', () => {
      const params = CoinSig.setup();
      const [G, o, g1, g2, e] = params;

      const [sk, pk] = Coin.keygen(params);
      const [W, cm, r] = Coin.prepareProofOfSecret(params, sk);

      assert.isTrue(G.ctx.BIG.comp(cm, G.hashG2ElemToBIG(W)) === 0);
      assert.isNotNull(W);
      assert.isNotNull(cm);
      assert.isNotNull(r);
    });
  });

  describe('Verify Proof of Secret', () => {
    it('Works for valid sk, pk pair', () => {
      const params = CoinSig.setup();
      const [G, o, g1, g2, e] = params;

      const [sk, pk] = Coin.keygen(params);

      const [W, cm, r] = Coin.prepareProofOfSecret(params, sk);
      assert.isTrue(Coin.verifyProofOfSecret(params, pk, W, cm, r));
    });

    it('Does not work if sk and pk are unrelated', () => {
      const params = CoinSig.setup();
      const [G, o, g1, g2, e] = params;

      const [sk1, pk1] = Coin.keygen(params);
      const [sk2, pk2] = Coin.keygen(params);

      const [W1, cm1, r1] = Coin.prepareProofOfSecret(params, sk1);
      const [W2, cm2, r2] = Coin.prepareProofOfSecret(params, sk2);

      assert.isNotTrue(Coin.verifyProofOfSecret(params, pk2, W1, cm1, r1));
      assert.isNotTrue(Coin.verifyProofOfSecret(params, pk1, W2, cm2, r2));
    });

    it('Does not work if cm != H(W)', () => {
      const params = CoinSig.setup();
      const [G, o, g1, g2, e] = params;

      const [sk, pk] = Coin.keygen(params);
      const [W, cm, r] = Coin.prepareProofOfSecret(params, sk);

      const another_cm = G.ctx.BIG.randomnum(G.order, G.rngGen);

      assert.isNotTrue(Coin.verifyProofOfSecret(params, pk, W, another_cm, r));
    });

    it('Does not work if W was modified', () => {
      const params = CoinSig.setup();
      const [G, o, g1, g2, e] = params;

      const [sk, pk] = Coin.keygen(params);
      const [W, cm, r] = Coin.prepareProofOfSecret(params, sk);

      const another_w = G.ctx.BIG.randomnum(G.order, G.rngGen);
      const another_W = G.ctx.PAIR.G2mul(g2, another_w);

      assert.isNotTrue(Coin.verifyProofOfSecret(params, pk, another_W, cm, r));
    });

    it('Does not work if r was modified', () => {
      const params = CoinSig.setup();
      const [G, o, g1, g2, e] = params;

      const [sk, pk] = Coin.keygen(params);
      const [W, cm, r] = Coin.prepareProofOfSecret(params, sk);

      const t1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
      const t2 = G.ctx.BIG.randomnum(G.order, G.rngGen);
      const t3 = G.ctx.BIG.mul(t1, t2);

      const another_r = t3.mod(o);

      assert.isNotTrue(Coin.verifyProofOfSecret(params, pk, W, cm, another_r));
    });
  });
});
