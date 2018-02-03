// todo: does it also need to verify whole signature?

import express from 'express';
import bodyParser from 'body-parser';
import { checkUsedId, insertUsedId, changeBalance } from '../utils/DatabaseManager';
import { ctx, merchant, params } from '../../config';
import { DEBUG } from '../config/appConfig';
import Coin from '../../Coin';
import { fromSimplifiedProof, getCoinAttributesFromBytes } from '../../auxiliary';
import { sig_pkBytes } from '../config/KeySetup';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/', async (req, res) => {
  if (DEBUG) {
    console.log('Deposit coin post');
  }
  const [G, o, g1, g2, e] = params;

  const simplifiedCoin = req.body.coin;
  const simplifiedProof = req.body.proof;
  const idBytes = req.body.id;

  const client_name = req.body.client_name;
  const client_address = req.body.client_address;
  const merchant_name = req.body.name;
  const merchant_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const coinAttributes = getCoinAttributesFromBytes(simplifiedCoin);
  const [W, cm, r] = fromSimplifiedProof(simplifiedProof);
  const id = ctx.BIG.fromBytes(idBytes);

  // at the same time we are able to check if we the coin was really given to merchant
  const isProofValid = Coin.verifyProofOfSecret(params, coinAttributes.v, W, cm, r, merchant);


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

  // check if the actual id was revealed
  const isIDValid = coinAttributes.ID.equals(ctx.PAIR.G1mul(g1, id));
  if (DEBUG) {
    console.log(`Was actual id revealed: ${isIDValid}`);
  }

  // check signature
  const sha = ctx.ECDH.HASH_TYPE;
  const [C, D] = coinAttributes.sig;

  const coinStr = coinAttributes.value.toString() + coinAttributes.ttl.toString() + coinAttributes.v.toString() + coinAttributes.ID.toString();
  const isSignatureValid = (ctx.ECDH.ECPVP_DSA(sha, sig_pkBytes, coinStr, C, D) === 0);
  if (DEBUG) {
    console.log(`Is signature on coin valid: ${isSignatureValid}`);
  }

  // now finally check if the coin wasn't already spent
  const wasCoinAlreadySpent = await checkUsedId(id);
  if (DEBUG) {
    console.log(`Was coin already spent: ${wasCoinAlreadySpent}`);
  }

  if (isProofValid && isIDValid && isSignatureValid && !wasCoinAlreadySpent) {
    await insertUsedId(id);
    await changeBalance(client_name, client_address, -coinAttributes.value);
    await changeBalance(merchant_name, merchant_address, coinAttributes.value);
  }

  res.status(200)
    .json({
      success: true,
    });
});

export default router;
