// set of auxiliary functions that don't belong to any existing class/module

import * as crypto from 'crypto';
import Coin from './Coin';
import { ctx } from '../src/config';

export const stringToBytes = (s) => {
  const b = [];
  for (let i = 0; i < s.length; i++) {
    b.push(s.charCodeAt(i));
  }
  return b;
};

export const hashMessage = (m) => {
  const messageBytes = stringToBytes(m);
  const H = new ctx.HASH256();
  H.process_array(messageBytes);
  return H.hash();
};

export const hashToBIG = (m) => {
  const R = hashMessage(m);
  return ctx.BIG.fromBytes(R);
};

// implementation partially taken from https://github.com/milagro-crypto/milagro-crypto-js/blob/develop/src/node/mpin.js#L125
export const hashToPointOnCurve = (m) => {
  const R = hashMessage(m);

  if (R.length === 0) return null;
  const W = [];

  // needs to be adjusted if different curve was to be chosen
  const sha = 32;
  if (sha >= ctx.BIG.MODBYTES) {
    for (let i = 0; i < ctx.BIG.MODBYTES; i++) W[i] = R[i];
  } else {
    for (let i = 0; i < sha; i++) W[i] = R[i];
    for (let i = sha; i < ctx.BIG.MODBYTES; i++) W[i] = 0;
  }
  return ctx.ECP.mapit(W);
};

export const hashG2ElemToBIG = (G2elem) => {
  return this.hashToBIG(G2elem.toString());
};
