// set of auxiliary functions that don't belong to any existing class/module

import * as crypto from 'crypto';
import Coin from './Coin';
import { ctx } from './config';

export const stringToBytes = (s) => {
  const b = [];
  for (let i = 0; i < s.length; i++) {
    b.push(s.charCodeAt(i));
  }
  return b;
};

export const getRandomCoinId = () => {
  const RAW = crypto.randomBytes(128);

  const rng = new ctx.RAND();
  rng.clean();
  rng.seed(RAW.length, RAW);
  const groupOrder = new ctx.BIG(0);
  groupOrder.rcopy(ctx.ROM_CURVE.CURVE_Order);

  return ctx.BIG.randomnum(groupOrder, rng);
};

export const getCoin = (pk, value) => new Coin(pk, getRandomCoinId(), value);
