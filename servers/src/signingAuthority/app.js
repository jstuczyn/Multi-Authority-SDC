import express from 'express';
import CoinSigController from './api/CoinSignController';
import PublicKeyController from './api/PublicKeyController';

const app = express();

// to enable cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/sign', CoinSigController);
app.use('/pk', PublicKeyController);

export default app;
