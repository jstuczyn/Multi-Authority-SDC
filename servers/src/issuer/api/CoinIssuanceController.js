import express from 'express';
import bodyParser from 'body-parser';
import { getBalance, checkGeneratedId } from '../utils/DatabaseManager';
import { DEBUG } from '../config/appConfig';
import { ctx, issuer, params } from '../../config';
import { ISSUE_STATUS } from '../config/constants';
import { fromSimplifiedProof } from '../../auxiliary';
import Coin from '../../Coin';
import { sig_skBytes } from '../config/KeySetup';

const router = express.Router();
const [G, o, g1, g2, e] = params;

export const getNewId = async () => {
  let id = ctx.BIG.randomnum(o, G.rngGen);

  let isPresent = await checkGeneratedId(id.toString());

  /* eslint-disable no-await-in-loop */
  while (isPresent === 1) {
    id = ctx.BIG.randomnum(o, G.rngGen);
    isPresent = await checkGeneratedId(id.toString());
  }
  /* eslint-enable no-await-in-loop */

  return id;
};

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/', async (req, res) => {
  if (DEBUG) {
    console.log('POST Call to getcoin');
  }
  const sourceIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (DEBUG) {
    console.log('Request came from', sourceIp);
  }

  const pkBytes = req.body.pk;
  const simplifiedProof = req.body.proof;
  const value = req.body.value;
  const user = req.body.user;

  const balance = await getBalance(user, sourceIp);
  if (DEBUG) {
    console.log('Balance of callee is', balance);
  }

  if (balance < value) {
    if (DEBUG) {
      console.log('Error in issuing coin', ISSUE_STATUS.error_balance);
    }
    res.status(200).json({
      coin: null,
      id: null,
      status: ISSUE_STATUS.error_balance,
    });
    return;
  }

  const [W, cm, r] = fromSimplifiedProof(simplifiedProof);
  const pk = ctx.ECP2.fromBytes(pkBytes);

  const isProofValid = Coin.verifyProofOfSecret(params, pk, W, cm, r, issuer);

  if (!isProofValid) {
    if (DEBUG) {
      console.log('Error in issuing coin', ISSUE_STATUS.error_proof);
    }
    res.status(200).json({
      coin: null,
      id: null,
      status: ISSUE_STATUS.error_proof,
    });
    return;
  }

  // actually create the coin now
  const coin_id = await getNewId();
  const coin = new Coin(pk, coin_id, value);

  const coinStr = coin.value.toString() + coin.ttl.toString() + coin.v.toString() + coin.ID.toString();
  const sha = ctx.ECDH.HASH_TYPE;

  const C = [];
  const D = [];

  // to prevent tampering we need to sign it
  ctx.ECDH.ECPSP_DSA(sha, G.rngGen, sig_skBytes, coinStr, C, D);
  coin.sig = [C, D];

  const simplifiedCoin = coin.getSimplifiedCoin();
  const idBytes = [];
  coin_id.toBytes(idBytes);

  if (DEBUG) {
    console.log(ISSUE_STATUS.success);
  }

  res.status(200).json({
    coin: simplifiedCoin,
    id: idBytes,
    status: ISSUE_STATUS.success,
  });
});

export default router;
