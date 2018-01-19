import express from 'express';
import CoinSignController from './api/CoinSignController';
import PublicKeyController from './api/PublicKeyController';
import CoinBlindSignController from './api/CoinBlindSignController';

const app = express();

// to enable cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/blindsign', CoinBlindSignController);
app.use('/sign', CoinSignController);
app.use('/pk', PublicKeyController);

export default app;
