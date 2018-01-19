// created so that the previous functionality (of normal sign) could be maintained

import express from 'express';
import bodyParser from 'body-parser';
import Coin from '../../Coin';
import CoinSig from '../../CoinSig';
import { params, sk } from '../config/CoinSigSetup';
import { DEBUG } from '../config/appConfig';
import ElGamal from '../../ElGamal';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', (req, res) => {
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
