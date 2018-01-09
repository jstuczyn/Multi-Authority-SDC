import CTX from './lib/Milagro-Crypto-Library/ctx';
import BLSSig from './BLSSig';

export const signingServers = [
  '127.0.0.1:3000',
  '127.0.0.1:3001',
  '127.0.0.1:3002',
];

export const merchant = '127.0.0.1:4000';

export const ctx = new CTX('BN254');

export let params;
if (BLSSig) {
  params = BLSSig.setup();
} else {
  console.log('For some reason Broken in TEST.ENV -- TODO: FIX');
}
