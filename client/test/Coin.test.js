import {expect, assert} from 'chai';
import Coin from '../lib/Coin';
import * as crypto from 'crypto';
import {ctx} from '../src/config';

describe('Coin object', () => {
    let coinValue, v, coin, ide, g2;
    before(() => {
        coinValue = 42;
        v = {'Dummy': 'object'};

        let x = new ctx.BIG(0);
        let y = new ctx.BIG(0);
        // Set up instance of g2
        g2 = new ctx.ECP2();
        let qx = new ctx.FP2(0);
        let qy = new ctx.FP2(0);

        // Set generator of g2
        x.rcopy(ctx.ROM_CURVE.CURVE_Pxa);
        y.rcopy(ctx.ROM_CURVE.CURVE_Pxb);
        qx.bset(x, y);
        x.rcopy(ctx.ROM_CURVE.CURVE_Pya);
        y.rcopy(ctx.ROM_CURVE.CURVE_Pyb);
        qy.bset(x, y);
        g2.setxy(qx, qy);

        let RAW = crypto.randomBytes(128);

        let rng = new ctx.RAND();
        rng.clean();
        rng.seed(RAW.length, RAW);
        let groupOrder = new ctx.BIG(0);
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
        })

    });

    it('The alias for getting public key works correctly', () => {
        expect(coin.publicKey).to.equal(coin.v);
    });

    it('The alias for getting time to live works correctly', () => {
        expect(coin.timeToLive).to.equal(coin.ttl);
    });

});