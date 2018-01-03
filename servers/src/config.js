import CTX from './lib/Milagro-Crypto-Library/ctx';
import BLSSig from './BLSSig';

export const ctx = new CTX('BN254');
export const params = BLSSig.setup();
