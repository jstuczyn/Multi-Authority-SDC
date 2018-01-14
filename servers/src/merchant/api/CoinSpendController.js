import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
import Coin from '../../Coin';
import CoinSig from '../../CoinSig';
import { ctx, params, signingServers } from '../../config';

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

const getPublicKey = async (server) => {
  const publicKey = [];

  try {
    let response = await fetch(`http://${server}/pk`);
    response = await response.json();
    const pkBytes = response.pk;
    const [gBytes, X0Bytes, X1Bytes, X2Bytes, X3Bytes, X4Bytes] = pkBytes;
    publicKey.push(ctx.ECP2.fromBytes(gBytes));
    publicKey.push(ctx.ECP2.fromBytes(X0Bytes));
    publicKey.push(ctx.ECP2.fromBytes(X1Bytes));
    publicKey.push(ctx.ECP2.fromBytes(X2Bytes));
    publicKey.push(ctx.ECP2.fromBytes(X3Bytes));
    publicKey.push(ctx.ECP2.fromBytes(X4Bytes));
  } catch (err) {
    console.log(err);
    console.warn(`Call to ${server} was unsuccessful`);
  }
  return publicKey;
};

const getPublicKeys = async (serversArg) => {
  const publicKeys = await Promise.all(serversArg.map(async (server) => {
    try {
      console.log(`Sending request to ${server}...`);
      const publicKey = await getPublicKey(server);
      return publicKey;
    } catch (err) {
      return null;
    }
  }));
  return publicKeys;
};

router.post('/', async (req, res) => {
  console.log('spend post');
  let responseStatus = -1;
  let success = false;
  try {
    const simplifiedCoin = req.body.coin;
    const simplifiedProof = req.body.proof;
    const [hBytes, sigBytes] = req.body.signature;
    const h = ctx.ECP.fromBytes(hBytes);
    const sig = ctx.ECP.fromBytes(sigBytes);

    const coin = Coin.fromSimplifiedCoin(simplifiedCoin);
    const [W, cm, r] = fromSimplifiedProof(simplifiedProof);

    const isProofValid = Coin.verifyProofOfSecret(params, coin.v, W, cm, r);
    // no point in verifying signature if proof is invalid
    if (!isProofValid) {
      console.log('Proof was invalid');
      res.status(200).json({ success: false });
    }

    const publicKeys = await getPublicKeys(signingServers);
    const aggregatePublicKey = CoinSig.aggregatePublicKeys(params, publicKeys);

    // todo: create another params?
    const isSignatureValid = CoinSig.verify(params, aggregatePublicKey, coin, [h, sig]);

    responseStatus = 200;
    success = isProofValid && isSignatureValid;
    console.log('Was coin spent: ', success);
  } catch (err) {
    console.log(err);

    responseStatus = 400;
  }
  res.status(responseStatus).json({ success: success });
});

export default router;
