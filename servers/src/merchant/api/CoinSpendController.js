import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
import Coin from '../../Coin';
import CoinSig from '../../CoinSig';
import { ctx, params, signingServers, merchant, issuer } from '../../config'; // todo: import own address or check it in runtime?
import { DEBUG } from '../config/appConfig';
import { fromSimplifiedProof } from '../../auxiliary';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

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

const getCoinAttributesFromBytes = (coinBytes) => {
  const {
    bytesV, bytesID, value, ttl,
  } = coinBytes;

  return {
    v: ctx.ECP2.fromBytes(bytesV),
    ID: ctx.ECP.fromBytes(bytesID),
    value: value,
    ttl: ttl,
  };
};

const checkDoubleSpend = async (id, server) => {
  const id_bytes = [];
  id.toBytes(id_bytes);
  try {
    let response = await
      fetch(`http://${server}/checkid`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id_bytes,
        }),
      });
    response = await response.json();
    const wasUsed = response.wasIdUsed;
    return wasUsed;
  } catch (err) {
    console.log(err);
    console.warn(`Call to ${server} was unsuccessful`);
    return true; // if call was unsuccessful assume coin was already spent
  }
};

router.post('/', async (req, res) => {
  if (DEBUG) {
    console.log('spend post');
  }
  let responseStatus = -1;
  let success = false;
  try {
    const [G, o, g1, g2, e] = params;

    const simplifiedCoin = req.body.coin;
    const simplifiedProof = req.body.proof;
    const [hBytes, sigBytes] = req.body.signature;
    const pkXBytes = req.body.pkX;
    const idBytes = req.body.id;

    const coinAttributes = getCoinAttributesFromBytes(simplifiedCoin);
    const [W, cm, r] = fromSimplifiedProof(simplifiedProof);
    const h = ctx.ECP.fromBytes(hBytes);
    const sig = ctx.ECP.fromBytes(sigBytes);
    const pkX = ctx.ECP2.fromBytes(pkXBytes);
    const id = ctx.BIG.fromBytes(idBytes);


    const isProofValid = Coin.verifyProofOfSecret(params, coinAttributes.v, W, cm, r, merchant);
    // no point in verifying signature if proof is invalid
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

    const publicKeys = await getPublicKeys(signingServers);
    const aggregatePublicKey = CoinSig.aggregatePublicKeys(params, publicKeys);

    // check if the actual id was revealed
    const isIDValid = coinAttributes.ID.equals(ctx.PAIR.G1mul(g1, id));
    if (DEBUG) {
      console.log(`Was actual id revealed: ${isIDValid}`);
    }

    // todo: create another params?
    const isSignatureValid = CoinSig.verifyMixedBlindSign(params, aggregatePublicKey, coinAttributes, [h, sig], id, pkX);
    if (DEBUG) {
      console.log(`Was signature valid: ${isSignatureValid}`);
    }

    // now finally check if the coin wasn't already spent
    const wasCoinAlreadySpent = await checkDoubleSpend(id, issuer);
    if (DEBUG) {
      console.log(`Was coin already spent: ${wasCoinAlreadySpent}`);
    }

    responseStatus = 200;
    success = isProofValid && isSignatureValid && isIDValid && !wasCoinAlreadySpent;
    if (DEBUG) {
      console.log(`Was coin successfully spent: ${success}`);
    }
  } catch (err) {
    console.warn(err);
    responseStatus = 400;
  }
  res.status(responseStatus)
    .json({ success: success });
});

export default router;
