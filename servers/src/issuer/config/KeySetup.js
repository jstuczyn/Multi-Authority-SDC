import { ctx, params } from '../../globalConfig';
import { DEBUG } from './appConfig';

export const sigKeys = {};
export const sig_pkBytes = [];
export const sig_skBytes = [];

export const setupKeys = () => {
  const [G, o, g1, g2, e] = params;

  // todo: when refactoring entire codebase, change all randomnum calls to that
  sigKeys.sk = ctx.BIG.randomnum(o, G.rngGen);
  sigKeys.sk.toBytes(sig_skBytes);
  sigKeys.pk = g1.mul(sigKeys.sk);
  sigKeys.pk.toBytes(sig_pkBytes);

  if (DEBUG) {
    console.log('Generated sk,pk keypair.');
  }
};
