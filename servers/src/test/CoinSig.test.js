import { describe, it, xit } from 'mocha';
import { expect, assert } from 'chai';
import CoinSig from '../CoinSig';
import BpGroup from '../BpGroup';

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

    const [x1, x2, x3, x4] = sk;
    const [g, X1, X2, X3, X4] = pk;

    it('Returns Secret Key (x1, x2, x3, x4)', () => {
      assert.isTrue(x1 instanceof (G.ctx.BIG));
      assert.isTrue(x2 instanceof (G.ctx.BIG));
      assert.isTrue(x3 instanceof (G.ctx.BIG));
      assert.isTrue(x4 instanceof (G.ctx.BIG));
    });

    describe('Returns Valid Private Key (g, X1, X2, X3, X4)', () => {
      it('g = g2', () => {
        assert.isTrue(g2.equals(g));
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
  });
});
