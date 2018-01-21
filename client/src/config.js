import CTX from '../lib/Milagro-Crypto-Library/ctx';
import CoinSig from '../lib/CoinSig';

export const DEBUG = true;
export const DETAILED_DEBUG = true;

export const signingServers = [
  '127.0.0.1:3000',
  '127.0.0.1:3001',
  '127.0.0.1:3002',
];

// even though it is set a const, it can still be mutated because it is an object;
// only the pointer can't be moved
export const PKs = {
  '127.0.0.1:3000': null,
  '127.0.0.1:3001': null,
  '127.0.0.1:3002': null,
};

export const merchant = '127.0.0.1:4000';

export const ctx = new CTX('BN254');
export const params = CoinSig.setup();
// todo: as in helpers.js, should there be separate params_coin for BLSSig?

const COIN_STATUS_CREATED = 'Generated';
const COIN_STATUS_SIGNING = 'Signing';
const COIN_STATUS_SIGNED = 'Signed';
const COIN_STATUS_SPENT = 'Spent';
const COIN_STATUS_SPENDING = 'Spending';
const COIN_STATUS_ERROR = 'Error';

export const COIN_STATUS = {
  created: COIN_STATUS_CREATED,
  signing: COIN_STATUS_SIGNING,
  signed: COIN_STATUS_SIGNED,
  spent: COIN_STATUS_SPENT,
  spending: COIN_STATUS_SPENDING,
  error: COIN_STATUS_ERROR,
};

const BUTTON_COIN_STATUS_SIGN = 'Sign Coin';
const BUTTON_COIN_STATUS_SIGN_IN_PROGRESS = 'Signing...';
const BUTTON_COIN_STATUS_SPEND = 'Spend Coin';
const BUTTON_COIN_STATUS_SPENT = 'Coin was Spent';
const BUTTON_COIN_STATUS_SPENDING_IN_PROGRESS = 'Spending...';
const BUTTON_COIN_STATUS_ERROR = 'Error';

export const BUTTON_COIN_STATUS = {
  sign: BUTTON_COIN_STATUS_SIGN,
  signing: BUTTON_COIN_STATUS_SIGN_IN_PROGRESS,
  spend: BUTTON_COIN_STATUS_SPEND,
  spent: BUTTON_COIN_STATUS_SPENT,
  spending: BUTTON_COIN_STATUS_SPENDING_IN_PROGRESS,
  error: BUTTON_COIN_STATUS_ERROR,
};

const SERVER_TYPE_SA = 'Signing Authority';
const SERVER_TYPE_MERCHANT = 'Merchant';

export const SERVER_TYPES = {
  signing: SERVER_TYPE_SA,
  merchant: SERVER_TYPE_MERCHANT,
};

const SERVER_STATUS_UP = 'Server is alive';
const SERVER_STATUS_DOWN = 'Server is down';
const SERVER_STATUS_CHECK = 'Checking server status...';

export const SERVER_STATUS = {
  alive: SERVER_STATUS_UP,
  down: SERVER_STATUS_DOWN,
  loading: SERVER_STATUS_CHECK,
};
