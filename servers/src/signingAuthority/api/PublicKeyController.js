import express from 'express';
import bodyParser from 'body-parser';
import { pkBytes } from '../config/CoinSigSetup';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/', (req, res) => {
  console.log('pk get');
  res.status(200).json({
    pk: pkBytes,
  });
});

export default router;
