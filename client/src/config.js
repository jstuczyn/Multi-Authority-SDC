import CTX from '../lib/Milagro-Crypto-Library/ctx';

export const servers = [
    '127.0.0.1:3000',
    '127.0.0.1:3001',
    '127.0.0.1:3002',
];

export const ctx = new CTX('BN254');

export const COIN_STATUS_CREATED = 'Generated';
export const COIN_STATUS_SIGNING = 'Signing';
export const COIN_STATUS_SIGNED = 'Signed';
export const COIN_STATUS_SPENT = 'Spent';

export const COIN_STATUS = {
    created: COIN_STATUS_CREATED,
    signing: COIN_STATUS_SIGNING,
    signed: COIN_STATUS_SIGNED,
    spent: COIN_STATUS_SPENT,
};

export const BUTTON_COIN_STATUS_SIGN = 'Sign Coin';
export const BUTTON_COIN_STATUS_SIGN_INPROGRESS = 'Signing...';
export const BUTTON_COIN_STATUS_SPEND = 'Spend Coin';
export const BUTTON_COIN_STATUS_SPENT = 'Coin was Spent';

export const BUTTON_COIN_STATUS = {
    sign: BUTTON_COIN_STATUS_SIGN,
    signing: BUTTON_COIN_STATUS_SIGN_INPROGRESS,
    spend: BUTTON_COIN_STATUS_SPEND,
    spent: BUTTON_COIN_STATUS_SPENT,
};