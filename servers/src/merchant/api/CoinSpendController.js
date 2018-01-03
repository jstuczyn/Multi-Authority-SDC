import express from 'express';
import bodyParser from 'body-parser';
import Coin from '../../Coin';
import CoinSig from '../../CoinSig';
import BLSSig from '../../BLSSig';
import { ctx, params } from '../../config';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const fromSimplifiedProof = (simplifiedProof) => {
  const [bytesW, bytesCm, bytesR] = simplifiedProof;
  const W = ctx.ECP2.fromBytes(bytesW);
  const cm = ctx.BIG.fromBytes(bytesCm);
  const r = ctx.BIG.fromBytes(bytesR);
  return [W, cm, r];
};

router.post('/', (req, res) => {
  console.log('spend post');
  let responseStatus = -1;
  let success = false;
  try {
    console.log("a");
    const simplifiedCoin = req.body.coin;
    const simplifiedProof = req.body.proof;
    // const [hBytes, sigBytes] = req.body.signature;
    // const h = ctx.ECP.fromBytes(hBytes);
    // const sig = ctx.ECP.fromBytes(sigBytes);

    const coin = Coin.fromSimplifiedCoin(simplifiedCoin);
    const [W, cm, r] = fromSimplifiedProof(simplifiedProof);

    const isProofValid = BLSSig.verifyProofOfSecret(params, coin.v, W, cm, r);
    console.log("IS VALID?", isProofValid);

    const pks = null; // todo: query to signing servers
    // todo: another params?
    // const isSignatureValid = CoinSig.verify(params, pks, coin, [h, sig]);

    // then check actual signature lol

    responseStatus = 200;
    success = isProofValid;
  } catch (err) {
    console.log("b");

    responseStatus = 400;
  }
  res.status(responseStatus).json({ success: success });
});

export default router;
