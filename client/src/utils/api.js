import fetch from 'isomorphic-fetch';
import { ctx, DEBUG, PKs } from '../config';
import { getSimplifiedProof, getSimplifiedSignature } from './helpers';
// auxiliary, mostly for testing purposes to simulate delays
export function wait(t) {
  return new Promise(r => setTimeout(r, t));
}

export async function getPublicKey(server) {
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
}

export async function signCoin(server, coin, ElGamalPK = null, params = null, id = null, sk = null) {
  const signingCoin = coin.prepareCoinForSigning(ElGamalPK, params, id, sk);
  let signature = null;
  if (DEBUG) {
    console.log('signinig', signingCoin);
  }

  if (PKs[server] == null) {
    if (DEBUG) {
      console.log(`${server} wasn't queried before. We need to get its PK first.`);
    }
    const publicKey = await getPublicKey(server);
    PKs[server] = publicKey;
  } else if (DEBUG) {
    console.log(`${server} was queried before. It's PK is:`);
    console.log(PKs[server]);
  }

  try {
    let response = await
      fetch(`http://${server}/sign`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coin: signingCoin,
        }),
      });
    response = await response.json();
    signature = response.signature;
  } catch (err) {
    console.log(err);
    console.warn(`Call to ${server} was unsuccessful`);
  }
  return signature;
}

export async function spendCoin(coin, proof, signature, server) {
  const simplifiedCoin = coin.getSimplifiedCoin();
  const simplifiedProof = getSimplifiedProof(proof);
  const simplifiedSignature = getSimplifiedSignature(signature);

  let success = false;
  try {
    let response = await
      fetch(`http://${server}/spend`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coin: simplifiedCoin,
          proof: simplifiedProof,
          signature: simplifiedSignature,
        }),
      });
    response = await response.json();
    success = response.success;
  } catch (err) {
    console.log(err);
    console.warn(`Call to merchant ${server} was unsuccessful`);
  }
  return success;
}
