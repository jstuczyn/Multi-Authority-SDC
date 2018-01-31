import CTX from './lib/Milagro-Crypto-Library/ctx';
import CoinSig from './CoinSig';

export const signingServers = [
  '127.0.0.1:3000',
  '127.0.0.1:3001',
  '127.0.0.1:3002',
];

export const merchant = '127.0.0.1:4000';
export const issuer = '127.0.0.1:5000';

export const ctx = new CTX('BN254');
export const params = CoinSig.setup();
