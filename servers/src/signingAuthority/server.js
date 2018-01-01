import app from './app';
import { hostname } from './config/appConfig';
import { setupCoinSigKeys } from './config/CoinSigSetup';


if (process.argv.length < 3) {
  throw new Error('No port number provided');
}

const port = parseInt(process.argv[2], 10);

const server = app.listen(port, hostname, () => {
  setupCoinSigKeys();
  console.log(`Server Started at: http://${hostname}:${port}/`);
});
