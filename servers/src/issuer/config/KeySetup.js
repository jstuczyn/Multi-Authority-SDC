import { ctx, params } from '../../config';
import { DEBUG } from './appConfig';

export const keys = {};
export const pkBytes = [];
export const skBytes = [];

export const setupKeys = () => {
  const [G, o, g1, g2, e] = params;

  // todo: when refactoring entire codebase, change all randomnum calls to that
  keys.sk = ctx.BIG.randomnum(o, G.rngGen);
  keys.sk.toBytes(skBytes);
  keys.pk = g1.mul(keys.sk);
  keys.pk.toBytes(pkBytes);

  if (DEBUG) {
    console.log('Generated sk,pk keypair.');
  }
};
