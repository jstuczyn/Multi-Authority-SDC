import {ctx} from '../config';
import Coin from '../../lib/Coin';
import * as crypto from 'crypto';

export function getCoin(pk, value) {
    return new Coin(pk, getRandomCoinId(), value);
}

// uses same RNG generator as the one used for key generation
function getRandomCoinId() {
    let RAW = crypto.randomBytes(128);

    let rng = new ctx.RAND();
    rng.clean();
    rng.seed(RAW.length, RAW);
    let groupOrder = new ctx.BIG(0);
    groupOrder.rcopy(ctx.ROM_CURVE.CURVE_Order);

    return ctx.BIG.randomnum(groupOrder, rng)
}
