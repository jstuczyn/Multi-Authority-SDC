import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
import Coin from '../../Coin';
import CoinSig from '../../CoinSig';
import { ctx, params, signingServers, merchant, issuer } from '../../globalConfig'; // todo: import own address or check it in runtime?
import { DEBUG } from '../config/appConfig';
import { fromBytesProof, verifyProofOfSecret } from '../../auxiliary';
import { issuer_address } from '../../signingAuthority/config/constants';

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

const depositCoin = async (coinAttributes, simplifiedProof, sigBytes, pkXBytes, server) => {
  try {
    let response = await
      fetch(`http://${server}/depositcoin`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coinAttributes: coinAttributes,
          proof: simplifiedProof,
          signature: sigBytes,
          pkXBytes: pkXBytes,
          name: 'Merchant', // todo: replace with PK once generated
        }),
      });
    response = await response.json();
    const success = response.success;
    return success;
  } catch (err) {
    console.log(err);
    console.warn(`Call to ${server} was unsuccessful`);
    return false; // if call was unsuccessful assume deposit failed
  }
};

router.post('/', async (req, res) => {
  const client_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const client_name = 'Client';

  if (DEBUG) {
    console.log('spend post from ', client_address);
  }
  let responseStatus = -1;
  let success = false;
  try {
    const [G, o, g1, g2, e] = params;

    const coinAttributes = req.body.coinAttributes;
    const simplifiedProof = req.body.proof;
    // const [hBytes, sigBytes] = req.body.signature;
    const pkXBytes = req.body.pkX;

    const proofOfSecret = fromBytesProof(simplifiedProof);
    // const h = ctx.ECP.fromBytes(hBytes);
    // const sig = ctx.ECP.fromBytes(sigBytes);
    const pkX = ctx.ECP2.fromBytes(pkXBytes);
    const id = ctx.BIG.fromBytes(coinAttributes.idBytes);


    // TODO: NEXT THING TODO: CACHE RESPONSES TO SAVE TIME
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

    // lets not waste CPU on verifying signature, let the issuer do it
    // const isSignatureValid = CoinSig.verifyMixedBlindSign(params, aggregatePublicKey, coinAttributes, [h, sig], id, pkX);
    // if (DEBUG) {
    //   console.log(`Was signature valid: ${isSignatureValid}`);
    // }

    // now finally check if the coin wasn't already spent
    const wasCoinAlreadySpent = await checkDoubleSpend(id, issuer);
    if (DEBUG) {
      console.log(`Was coin already spent: ${wasCoinAlreadySpent}`);
    }

    // we don't need to create byte representations of all objects because we already have them
    // should we sign the request by merchant?
    const wasCoinDeposited = await depositCoin(coinAttributes, simplifiedProof, req.body.signature, pkXBytes, issuer_address);

    responseStatus = 200;
    success = isProofValid && !wasCoinAlreadySpent && wasCoinDeposited;
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
