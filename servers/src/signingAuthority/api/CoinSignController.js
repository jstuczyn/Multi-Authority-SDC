import express from 'express';
import bodyParser from 'body-parser';
import Coin from '../../Coin';
import CoinSig from '../../CoinSig';
import { params, sk } from '../config/CoinSigSetup';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', (req, res) => {
  console.log('sign post');
  let responseStatus = -1;
  let signatureBytes = null;
  try {
    const simplifiedCoin = req.body.coin;
    const coin = Coin.fromSimplifiedCoin(simplifiedCoin);

    const [h, sig] = CoinSig.sign(params, sk, coin);
    const sigBytes = [];
    const hBytes = [];
    sig.toBytes(sigBytes);
    h.toBytes(hBytes);

    console.log('sig:', h.toString(), sig.toString());
    signatureBytes = [hBytes, sigBytes];

    responseStatus = 200;
  } catch (err) {
    responseStatus = 400;
  }
  res.status(responseStatus).json({ signature: signatureBytes });
});

router.get('/', (req, res) => {
  console.log('sign get');
  res.status(200).json({ hi: 'hi' });
});

export default router;
