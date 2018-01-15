import * as crypto from 'crypto';
import { ctx } from '../config';
import Coin from '../../lib/Coin';

// uses same RNG generator as the one used for key generation
// it is exported to be used in Coin tests
export const getRandomCoinId = () => {
  const RAW = crypto.randomBytes(128);

  const rng = new ctx.RAND();
  rng.clean();
  rng.seed(RAW.length, RAW);
  const groupOrder = new ctx.BIG(0);
  groupOrder.rcopy(ctx.ROM_CURVE.CURVE_Order);

  return ctx.BIG.randomnum(groupOrder, rng);
};

export const getCoin = (pk, value) => {
  const coin_id = getRandomCoinId();
  const coin = new Coin(pk, coin_id, value)
  return [coin, coin_id];
};
