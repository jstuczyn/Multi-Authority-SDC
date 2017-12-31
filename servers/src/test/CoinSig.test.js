import { before, beforeEach, describe, it, xit } from 'mocha';
import { expect, assert } from 'chai';
import CoinSig from '../CoinSig';
import BpGroup from '../BpGroup';
import Coin from '../Coin';
import { getCoin, getRandomCoinId } from '../auxiliary';
import BLSSig from '../BLSSig';

describe('CoinSig Scheme', () => {
  describe('Setup', () => {
    const params = CoinSig.setup();
    const [G, o, g1, g2, e] = params;

    it('Returns BpGroup Object', () => {
      assert.isNotNull(G);
      assert.isTrue(G instanceof (BpGroup));
    });

    it('Returns Group Order', () => {
      assert.isNotNull(o);
      assert.isTrue(o instanceof (G.ctx.BIG));
    });

    it('Returns Gen1', () => {
      assert.isNotNull(g1);
      assert.isTrue(g1 instanceof (G.ctx.ECP));
    });

    it('Returns Gen2', () => {
      assert.isNotNull(g2);
      assert.isTrue(g2 instanceof (G.ctx.ECP2));
    });

    it('Returns Pair function', () => {
      assert.isNotNull(e);
      assert.isTrue(e instanceof (Function));
    });
  });

  describe('Keygen', () => {
    const params = CoinSig.setup();
    const [G, o, g1, g2, e] = params;
    const [sk, pk] = CoinSig.keygen(params);

    const [x0, x1, x2, x3, x4] = sk;
    const [g, X0, X1, X2, X3, X4] = pk;

    it('Returns Secret Key (x0, x1, x2, x3, x4)', () => {
      assert.isTrue(x0 instanceof (G.ctx.BIG));
      assert.isTrue(x1 instanceof (G.ctx.BIG));
      assert.isTrue(x2 instanceof (G.ctx.BIG));
      assert.isTrue(x3 instanceof (G.ctx.BIG));
      assert.isTrue(x4 instanceof (G.ctx.BIG));
    });

    describe('Returns Valid Private Key (g, X0, X1, X2, X3, X4)', () => {
      it('g = g2', () => {
        assert.isTrue(g2.equals(g));
      });

      it('X0 = g2*x0', () => {
        assert.isTrue(X0.equals(G.ctx.PAIR.G2mul(g2, x0)));
      });

      it('X1 = g2*x1', () => {
        assert.isTrue(X1.equals(G.ctx.PAIR.G2mul(g2, x1)));
      });

      it('X2 = g2*x2', () => {
        assert.isTrue(X2.equals(G.ctx.PAIR.G2mul(g2, x2)));
      });

      it('X3 = g2*x3', () => {
        assert.isTrue(X3.equals(G.ctx.PAIR.G2mul(g2, x3)));
      });

      it('X4 = g2*x4', () => {
        assert.isTrue(X4.equals(G.ctx.PAIR.G2mul(g2, x4)));
      });
    });

    // h, sig = (x0 + x1*a1 + x2*a2 + ...) * h
    describe('Sign', () => {
      it('For signature(sig1, sig2), sig2 = (x0 + x1*a1 + x2*a2 + ...) * sig1', () => {
        const params = CoinSig.setup();
        const [G, o, g1, g2, e] = params;
        const [sk, pk] = CoinSig.keygen(params);
        const [x0, x1, x2, x3, x4] = sk;

        const coin_params = BLSSig.setup();
        const [coin_sk, coin_pk] = BLSSig.keygen(coin_params);
        const dummyCoin = getCoin(coin_pk, 42);

        const signature = CoinSig.sign(params, sk, dummyCoin);
        const [sig1, sig2] = signature;

        const a1 = new G.ctx.BIG(dummyCoin.value);
        a1.norm();
        const a2 = G.hashToBIG(dummyCoin.ttl.toString());
        const a3 = G.hashG2ElemToBIG(dummyCoin.v);
        const a4 = G.hashG2ElemToBIG(dummyCoin.id);

        const a1_cpy = new G.ctx.BIG(a1);
        a1_cpy.mod(o);
        const a2_cpy = new G.ctx.BIG(a2);
        a2_cpy.mod(o);
        const a3_cpy = new G.ctx.BIG(a3);
        a3_cpy.mod(o);
        const a4_cpy = new G.ctx.BIG(a4);
        a4_cpy.mod(o);

        const t1 = G.ctx.BIG.mul(x1, a1_cpy);
        const t2 = G.ctx.BIG.mul(x2, a2_cpy);
        const t3 = G.ctx.BIG.mul(x3, a3_cpy);
        const t4 = G.ctx.BIG.mul(x4, a4_cpy);

        const x0DBIG = new G.ctx.DBIG(0);
        for (let i = 0; i < G.ctx.BIG.NLEN; i++) {
          x0DBIG.w[i] = x0.w[i];
        }

        x0DBIG.add(t1);
        x0DBIG.add(t2);
        x0DBIG.add(t3);
        x0DBIG.add(t4);

        const K = x0DBIG.mod(o);

        const sig_test = G.ctx.PAIR.G1mul(sig1, K);
        assert.isTrue(sig2.equals(sig_test));
      });
    });

    describe('Verify', () => {
      let params;
      let sk;
      let pk;
      let dummyCoin;
      let testCoin;
      let sig;
      let coin_params;
      before(() => {
        params = CoinSig.setup();
        [sk, pk] = CoinSig.keygen(params);

        coin_params = BLSSig.setup();
        const [coin_sk, coin_pk] = BLSSig.keygen(coin_params);
        dummyCoin = getCoin(coin_pk, 42);
        testCoin = getCoin(coin_pk, 42); // to make it instance of same class

        sig = CoinSig.sign(params, sk, dummyCoin);
      });

      // 'resets' the test coin
      beforeEach(() => {
        testCoin.ttl = dummyCoin.ttl;
        testCoin.id = new G.ctx.ECP2();
        testCoin.id.copy(dummyCoin.id);
        testCoin.value = dummyCoin.value;
        testCoin.v = new G.ctx.ECP2();
        testCoin.v.copy(dummyCoin.v);
      });

      it('Successful verification of original coin', () => {
        assert.isTrue(CoinSig.verify(params, pk, dummyCoin, sig));
      });

      it('Failed verification for coin with different value', () => {
        testCoin.value = 256;
        assert.isNotTrue(CoinSig.verify(params, pk, testCoin, sig));
      });

      it('Failed verification for coin with different ttl', () => {
        // ttl of actual coin will never be equal to that
        testCoin.value = new Date().getTime() - 12345678;
        assert.isNotTrue(CoinSig.verify(params, pk, testCoin, sig));
      });

      it('Failed verification for coin with different id', () => {
        const newCoinIde = getRandomCoinId();
        testCoin.id = G.ctx.PAIR.G2mul(g2, newCoinIde);
        assert.isNotTrue(CoinSig.verify(params, pk, testCoin, sig));
      });

      it('Failed verification for coin with different private key', () => {
        const [new_coin_sk, new_coin_pk] = BLSSig.keygen(coin_params);
        testCoin.v = new_coin_pk;
        assert.isNotTrue(CoinSig.verify(params, pk, testCoin, sig));
      });
    });

    describe('Randomize', () => {
      const params = CoinSig.setup();
      const [sk, pk] = CoinSig.keygen(params);

      const coin_params = BLSSig.setup();
      const [coin_sk, coin_pk] = BLSSig.keygen(coin_params);
      const dummyCoin = getCoin(coin_pk, 42);

      let sig = CoinSig.sign(params, sk, dummyCoin);
      sig = CoinSig.randomize(params, sig);

      it('Successful verification for original coin with randomized signature', () => {
        assert.isTrue(CoinSig.verify(params, pk, dummyCoin, sig));
      });

      it('Failed verification for modified coin with the same randomized signature', () => {
        dummyCoin.value = 43;
        assert.isNotTrue(CoinSig.verify(params, pk, dummyCoin, sig));
      });
    });

    describe('Aggregate', () => {
      it('Aggregation(s1) = s1', () => {
        const params = CoinSig.setup();
        const [sk, pk] = CoinSig.keygen(params);

        const coin_params = BLSSig.setup();
        const [coin_sk, coin_pk] = BLSSig.keygen(coin_params);
        const dummyCoin = getCoin(coin_pk, 42);

        const sig = CoinSig.sign(params, sk, dummyCoin);
        const aggregateSig = CoinSig.aggregateSignatures(params, [sig]);

        assert.isTrue(sig[0].equals(aggregateSig[0]));
        assert.isTrue(sig[1].equals(aggregateSig[1]));
      });
    });

    it('Returns null if one of signatures is invalid (different h)', () => {
      const params = CoinSig.setup();
      const [sk, pk] = CoinSig.keygen(params);

      const coin_params = BLSSig.setup();
      const [coin_sk1, coin_pk1] = BLSSig.keygen(coin_params);
      const [coin_sk2, coin_pk2] = BLSSig.keygen(coin_params);

      const dummyCoin1 = getCoin(coin_pk1, 42);
      const dummyCoin2 = getCoin(coin_pk2, 43);

      const sig1 = CoinSig.sign(params, sk, dummyCoin1);
      const sig2 = CoinSig.sign(params, sk, dummyCoin2);

      const aggregateSig = CoinSig.aggregateSignatures(params, [sig1, sig2]);

      expect(aggregateSig).to.be.a('null');
    });
  });

  describe('Aggregate Verification', () => {
    describe('Public Key Aggregation', () => {
      it('Returns same key if single key is sent', () => {
        const params = CoinSig.setup();
        const [sk, pk] = CoinSig.keygen(params);
        const aPk = CoinSig.aggregatePublicKeys(params, [pk]);
        for (let i = 0; i < pk.length; i++) {
          assert.isTrue(pk[i].equals(aPk[i]));
        }
      });
    });

    describe('Aggregate Verification', () => {
      it('Works for single signature', () => {
        const params = CoinSig.setup();
        const [sk, pk] = CoinSig.keygen(params);

        const coin_params = BLSSig.setup();
        const [coin_sk, coin_pk] = BLSSig.keygen(coin_params);
        const dummyCoin = getCoin(coin_pk, 42);

        const sig = CoinSig.sign(params, sk, dummyCoin);
        const aggregateSig = CoinSig.aggregateSignatures(params, [sig]);

        assert.isTrue(CoinSig.verifyAggregation(params, [pk], dummyCoin, aggregateSig));
      });

      it('Works for three distinct signatures', () => {
        const params = CoinSig.setup();
        const [sk, pk] = CoinSig.keygen(params);

        const coin_params = BLSSig.setup();
        const [coin_sk, coin_pk] = BLSSig.keygen(coin_params);
        const dummyCoin = getCoin(coin_pk, 42);

        const coinsToSign = 3;
        const pks = [];
        const signatures = [];

        for (let i = 0; i < coinsToSign; i++) {
          const [sk, pk] = CoinSig.keygen(params);
          pks.push(pk);
          const signature = CoinSig.sign(params, sk, dummyCoin);
          signatures.push(signature);
        }

        const aggregateSignature = CoinSig.aggregateSignatures(params, signatures);

        assert.isTrue(CoinSig.verifyAggregation(params, pks, dummyCoin, aggregateSignature));
      });

      it("Doesn't work when one of three signatures is on different coin (but for some reason has same id)", () => {
        const params = CoinSig.setup();
        const [G, o, g1, g2, e] = params;

        const [sk, pk] = CoinSig.keygen(params);

        const coin_params = BLSSig.setup();
        const [coin_sk, coin_pk] = BLSSig.keygen(coin_params);
        const dummyCoin = getCoin(coin_pk, 42);

        const coinsToSign = 2;
        const pks = [];
        const signatures = [];

        for (let i = 0; i < coinsToSign; i++) {
          const [sk, pk] = CoinSig.keygen(params);
          pks.push(pk);
          const signature = CoinSig.sign(params, sk, dummyCoin);
          signatures.push(signature);
        }

        const [another_coin_sk, another_coin_pk] = BLSSig.keygen(coin_params);
        const anotherCoin = getCoin(another_coin_pk, 43);
        anotherCoin.id = new G.ctx.ECP2();
        anotherCoin.id.copy(dummyCoin.id);

        const [skm, pkm] = CoinSig.keygen(params);
        pks.push(pkm);
        const maliciousSignature = CoinSig.sign(params, skm, anotherCoin);
        signatures.push(maliciousSignature);

        const aggregateSignature = CoinSig.aggregateSignatures(params, signatures);

        assert.isNotTrue(CoinSig.verifyAggregation(params, pks, dummyCoin, aggregateSignature));
      });
    });
  });
});