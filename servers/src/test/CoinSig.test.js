import { describe, it, xit } from 'mocha';
import { expect, assert } from 'chai';
import CoinSig from '../CoinSig';
import BpGroup from '../BpGroup';
import Coin from '../Coin';
import { getCoin } from '../auxiliary';
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

        const a1 = G.hashToBIG(dummyCoin.value);
        const a2 = G.hashToBIG(dummyCoin.ttl);
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
  });
});
