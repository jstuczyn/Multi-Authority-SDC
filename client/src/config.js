import CTX from '../lib/Milagro-Crypto-Library/ctx';
import CoinSig from '../lib/CoinSig';

export const servers = [
  '127.0.0.1:3000',
  '127.0.0.1:3001',
  '127.0.0.1:3002',
];

export const ctx = new CTX('BN254');
export const params = CoinSig.setup();

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
