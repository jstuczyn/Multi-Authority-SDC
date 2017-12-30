// A slightly modified Pointcheval-Sanders Short Randomizable Signatures scheme
// to allow for larger number of signed messages

import BpGroup from './BpGroup';

export default class CoinSig {
  static setup() {
    return;
  }

  static keygen(params) {
    return;
  }

  static sign(params, sk, coin) {
    return;
  }

  static verify(params, pk, coin, sig) {
    return;
  }

  static randomize(params, sig) {
    return;
  }

  static aggregateSignatures(params, signatures) {
    return;
  }

  static verifyAggregation(params, pks, coin, aggregateSignature) {
    return;
  }
}
