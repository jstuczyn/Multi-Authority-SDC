import BLSsig from '../../lib/BLSSig';
import { params } from '../config'; // todo: should I create separate params instead? (those are associated with CoinSig)

export const getProofOfSecret = sk => (BLSsig.prepareProofOfSecret(params, sk));

export const getSimplifiedProof = (proof) => {
  const [W, cm, r] = proof;
  const bytesW = [];
  const bytesCm = [];
  const bytesR = [];
  W.toBytes(bytesW);
  cm.toBytes(bytesCm);
  r.toBytes(bytesR);

  return [bytesW, bytesCm, bytesR];
};
