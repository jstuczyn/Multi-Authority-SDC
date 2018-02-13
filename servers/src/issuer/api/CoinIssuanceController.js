import express from 'express';
import bodyParser from 'body-parser';
import { getBalance, changeBalance } from '../utils/DatabaseManager';
import { DEBUG } from '../config/appConfig';
import { issuer } from '../../globalConfig';
import { ISSUE_STATUS } from '../config/constants';
import { sig_skBytes } from '../config/KeySetup';
import { verifyRequestSignature, verifyRequestProofOfCoinSecret } from '../../CoinRequest';
import { getIssuedCoin } from '../../IssuedCoin';


const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// don't cache client's pk as he sends it every request
// and in principle there can be an arbitrary number of clients
router.post('/', async (req, res) => {
  if (DEBUG) {
    console.log('POST Call to getcoin');
  }
  const sourceIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // just for purpose of debugging
  if (DEBUG) {
    console.log('Request came from', sourceIp);
  }

  const coin_request = req.body.coin_request;

  // start by verifying whether request is legit:
  const isSignatureValid = verifyRequestSignature(coin_request);
  if (!isSignatureValid) {
    if (DEBUG) {
      console.log('Error in issuing coin', ISSUE_STATUS.error_signature);
    }
    res.status(200)
      .json({
        coin: null,
        status: ISSUE_STATUS.error_signature,
      });
    return;
  }

  let balance = await getBalance(coin_request.pk_client_bytes);

  if (DEBUG) {
    console.log('Balance of callee is', balance);
    // this will only happen in debug mode to make it easier to test the system
    const cheat_balance = 1000.00;
    if (balance === -1) {
      await changeBalance(coin_request.pk_client_bytes, cheat_balance);
      balance = cheat_balance;
    }
  }

  if (balance < coin_request.value) {
    if (DEBUG) {
      console.log('Error in issuing coin', ISSUE_STATUS.error_balance);
    }
    res.status(200)
      .json({
        coin: null,
        status: ISSUE_STATUS.error_balance,
      });
    return;
  }

  const isProofValid = verifyRequestProofOfCoinSecret(
    coin_request.proof_bytes,
    coin_request.pk_coin_bytes,
    issuer, // todo: also replace with pk
  );

  if (!isProofValid) {
    if (DEBUG) {
      console.log('Error in issuing coin', ISSUE_STATUS.error_proof);
    }
    res.status(200)
      .json({
        coin: null,
        id: null,
        status: ISSUE_STATUS.error_proof,
      });
    return;
  }

  const issuedCoin = getIssuedCoin(
    coin_request.pk_coin_bytes,
    coin_request.value,
    coin_request.pk_client_bytes,
    sig_skBytes,
  );

  await changeBalance(coin_request.pk_client_bytes, -coin_request.value);

  if (DEBUG) {
    console.log(ISSUE_STATUS.success);
  }

  res.status(200)
    .json({
      coin: issuedCoin,
      status: ISSUE_STATUS.success,
    });
});

export default router;
