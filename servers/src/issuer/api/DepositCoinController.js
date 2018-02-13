// todo: does it also need to verify whole signature?

import express from 'express';
import bodyParser from 'body-parser';
import { checkUsedId, insertUsedId, changeBalance } from '../utils/DatabaseManager';
import { ctx, merchant, params, signingServers } from '../../globalConfig';
import { DEBUG } from '../config/appConfig';
import { fromBytesProof, verifyProofOfSecret } from '../../auxiliary';
import CoinSig from '../../CoinSig';
import fetch from 'isomorphic-fetch';

const router = express.Router();


// TODO: CODE REPETITION, MOVE THEM ELSEWHERE
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

// todo: get some form of simple cache...
const getPublicKeys = async (serversArg) => {
  const publicKeys = await Promise.all(serversArg.map(async (server) => {
    try {
      if (DEBUG) {
        console.log(`Sending request to ${server}...`);
      }
      const publicKey = await getPublicKey(server);
      return publicKey;
    } catch (err) {
      return null;
    }
  }));
  return publicKeys;
};


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/', async (req, res) => {
  if (DEBUG) {
    console.log('Deposit coin post');
  }
  const [G, o, g1, g2, e] = params;

  const coinAttributes = req.body.coinAttributes;
  const simplifiedProof = req.body.proof;
  const [hBytes, sigBytes] = req.body.signature;
  const pkXBytes = req.body.pkXBytes;

  const proofOfSecret = fromBytesProof(simplifiedProof);
  const h = ctx.ECP.fromBytes(hBytes);
  const sig = ctx.ECP.fromBytes(sigBytes);
  const pkX = ctx.ECP2.fromBytes(pkXBytes);
  const id = ctx.BIG.fromBytes(coinAttributes.idBytes);


  const merchant_name = req.body.name;
  const merchant_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;




  // todo: move to auxiliary(or different file?)
  const publicKeys = await getPublicKeys(signingServers);
  const aggregatePublicKey = CoinSig.aggregatePublicKeys(params, publicKeys);

  // aggregatePublicKey is [ag, aX0, aX1, aX2, aX3, aX4];
  const aX3 = aggregatePublicKey[4];

  // just check validity of the proof and double spending, we let issuer verify the signature
  const isProofValid = verifyProofOfSecret(params, pkX, proofOfSecret, merchant, aX3);


  if (DEBUG) {
    console.log(`Was proof of knowledge of secret valid: ${isProofValid}`);
  }
  if (!isProofValid) {
    if (DEBUG) {
      console.log('Proof was invalid, no further checks will be made.');
    }
    res.status(200)
      .json({ success: false });
    return;
  }

  // put here check of signature
  const isSignatureValid = CoinSig.verifyMixedBlindSign(params, aggregatePublicKey, coinAttributes, [h, sig], id, pkX);
  if (DEBUG) {
    console.log(`Was signature valid: ${isSignatureValid}`);
  }

  if (!isSignatureValid) {
    if (DEBUG) {
      console.log('Signature was invalid.');
    }
    res.status(200)
      .json({ success: false });
    return;
  }

  // now finally check if the coin wasn't already spent
  const wasCoinAlreadySpent = await checkUsedId(id);
  if (DEBUG) {
    console.log(`Was coin already spent: ${wasCoinAlreadySpent}`);
  }

  if (isProofValid && !wasCoinAlreadySpent && isSignatureValid) {
    await insertUsedId(id);
    await changeBalance(merchant_name, merchant_address, coinAttributes.value);
  }

  res.status(200)
    .json({
      success: true,
    });
});

export default router;
