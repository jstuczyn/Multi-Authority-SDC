import { expect, assert } from 'chai';
import { getCoin } from '../src/utils/coinGenerator';
import { params, ctx } from '../src/config';

describe('Coin Generator', () => {
  let coinValue;
  let v;
  let coin;
  let coin_id;
  const [G, o, g1, g2, e] = params;
  before(() => {
    coinValue = 42;
    v = { Dummy: 'object' };
    [coin, coin_id] = getCoin(v, coinValue);
  });

  it('Generated Coin has the same value as it was passed', () => {
    expect(coin.value).to.equal(coinValue);
  });

  it('Generated Coin has the same PK as it was passed', () => {
    expect(coin.v).to.equal(v);
  });

  it("Generated Coin's ID = g1^id", () => {
    assert.isTrue(coin.ID.equals(ctx.PAIR.G1mul(g1, coin_id)));
  });

  it('Generated coins have unique (to some negligible probability) IDs and ids', () => {
    const [anotherCoin, anotherCoin_id] = getCoin(v, coinValue);
    assert.isNotTrue(coin.ID.equals(anotherCoin.ID));
    assert.isNotTrue(ctx.BIG.comp(coin_id, anotherCoin_id) === 0);
  });
});
