import express from 'express';
import bodyParser from 'body-parser';
import { getBalance } from '../utils/DatabaseManager';
import { DEBUG } from '../config/appConfig';

const router = express.Router();

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
  const proofBytes = req.body.proof;
  const value = req.body.value;
  const user = req.body.user;

  const balance = await getBalance(user, sourceIp);
  if (DEBUG) {
    console.log('Balance of callee is', balance);
  }

  console.log(pkBytes, proofBytes, value, user);


  res.status(200).json({
    coin: null,
  });
});

export default router;
