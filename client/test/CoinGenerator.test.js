import { expect, assert } from 'chai';

import {getCoin} from "../src/utils/coinGenerator";

describe('Coin Generator', () => {
    let coinValue, v, coin;
    before(() => {
        coinValue = 42;
        v = {'Dummy' : 'object'};
        coin = getCoin(v, coinValue);
    });

    it('Generated Coin has the same value as it was passed', () => {
       expect(coin.value).to.equal(coinValue);
    });

    it('Generated Coin has the same PK as it was passed', () => {
        expect(coin.v).to.equal(v);
    });

    it('Generated coins have unique (to some negligible probability) ids', () => {
        const anotherCoin = getCoin(v, coinValue);
        assert.isNotTrue(coin.id.equals(anotherCoin.id));
    });
});
