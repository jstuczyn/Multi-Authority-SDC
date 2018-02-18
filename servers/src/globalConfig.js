import CTX from './lib/Milagro-Crypto-Library/ctx';
import CoinSig from './CoinSig';

export const signingServers = (process.env.NODE_ENV === 'production') ? [
  '35.177.85.84:3000',
  '35.177.164.153:3001',
  '35.176.145.134:3002',
] : [
  '127.0.0.1:3000',
  '127.0.0.1:3001',
  '127.0.0.1:3002',
];

export const merchant = (process.env.NODE_ENV === 'production') ? '35.178.63.67:3001' : '127.0.0.1:4000';

export const issuer = (process.env.NODE_ENV === 'production') ? '35.177.203.169:3002' : '127.0.0.1:5000';

export const ctx = new CTX('BN254');
export const params = CoinSig.setup();
