// created so that the previous functionality (of normal sign) could be maintained

import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
import Coin from '../../Coin';
import CoinSig from '../../CoinSig';
import { params, sk } from '../config/CoinSigSetup';
import { DEBUG } from '../config/appConfig';
import ElGamal from '../../ElGamal';
import { issuer_address, PKs } from '../config/constants';
import { ctx, issuer } from '../../config';

const router = express.Router();


const getPublicKey = async (server) => {
  try {
    let response = await fetch(`http://${server}/pk`);
    response = await response.json();
    const pkBytes = response.pk;
    // due to the way they implemeted ECDSA, we do not need to convert it
    return pkBytes;
  } catch (err) {
    console.log(err);
    console.warn(`Call to ${server} was unsuccessful`);
    return null;
  }
};

const verifyCoinSignature = async (coin) => {
  if (PKs[issuer_address] == null) {
    if (DEBUG) {
      console.log('We do not know PK of the issuer, we need to ask it first.');
      PKs[issuer_address] = await getPublicKey(issuer_address);
      if (PKs[issuer_address] == null) {
        return -1; // we can't verify sig hence sign the coin
      }
    }
  }
  const sha = ctx.ECDH.HASH_TYPE;
  const [C, D] = coin.sig;

  const coinStr = coin.value.toString() + coin.ttl.toString() + coin.v.toString() + coin.ID.toString();
  return ctx.ECDH.ECPVP_DSA(sha, PKs[issuer_address], coinStr, C, D);
};

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', async (req, res) => {
  if (DEBUG) {
    console.log('blindsign post');
  }
  let responseStatus = -1;
  let signatureBytes = null;
  try {
    const signingCoin = req.body.coin;
    const ElGamalPKBytes = req.body.ElGamalPKBytes;
    // console.log(signingCoin);
    const coin = Coin.fromSigningCoin(signingCoin);


    // before we waste CPU on signing coin, first check if it wasn't tampered with (verify issuer sig)
    const isSignatureValid = await verifyCoinSignature(coin);
    if (isSignatureValid !== 0) {
      throw new Error('Coin was tampered with.');
    }

    console.log('is valid', isSignatureValid);

    const ElGamalPK = ElGamal.getPKFromBytes(params, ElGamalPKBytes);

    const [h, enc_sig] = CoinSig.mixedSignCoin(params, sk, coin, ElGamalPK);
    const hBytes = [];
    const enc_sig_a_Bytes = [];
    const enc_sig_b_Bytes = [];

    h.toBytes(hBytes);
    enc_sig[0].toBytes(enc_sig_a_Bytes);
    enc_sig[1].toBytes(enc_sig_b_Bytes);


    if (DEBUG) {
      console.log(`Signed the coin. \n h: ${h.toString()}, \n enc_sig_a: ${enc_sig[0].toString()} \n enc_sig_b: ${enc_sig[1].toString()}`);
    }

    signatureBytes = [hBytes, [enc_sig_a_Bytes, enc_sig_b_Bytes]];

    responseStatus = 200;
  } catch (err) {
    responseStatus = 400;
  }
  res.status(responseStatus).json({ signature: signatureBytes });
});

router.get('/', (req, res) => {
  console.log('blindsign get');
  res.status(200).json({ hi: 'hi' });
});

export default router;
