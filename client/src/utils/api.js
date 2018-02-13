import fetch from 'isomorphic-fetch';
import { ctx, DEBUG, PKs, ISSUE_STATUS, params } from '../config';
import { getProofOfSecret, getSimplifiedProof, getSimplifiedSignature, getRandomNumber } from './helpers';
import ElGamal from '../../lib/ElGamal';
import Coin from '../../lib/Coin';
import { getCoinRequestObject } from '../../lib/CoinRequest';

// auxiliary, mostly for testing purposes to simulate delays
export function wait(t) {
  return new Promise(r => setTimeout(r, t));
}

export async function getCoin(sk_coin, pk_coin, value, pk_client, sk_client, issuingServer) {
  const [G, o, g1, g2, e] = params;

  const coin_id = getRandomNumber();
  const coin_id_bytes = [];
  coin_id.toBytes(coin_id_bytes); // don't send it to issuer, unless we generate it together


  // get pk of issuer instead
  const coinRequestObject =
    getCoinRequestObject(sk_coin, pk_coin, value, pk_client, sk_client, issuingServer);

  let issuedCoin;
  let issuance_status;

  if (DEBUG) {
    console.log(`Calling ${issuingServer} to get a coin`);
  }
  try {
    let response = await
      fetch(`http://${issuingServer}/getcoin`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coin_request: coinRequestObject,
        }),
      });
    response = await response.json();
    issuedCoin = response.coin;
    issuance_status = response.status;
  } catch (err) {
    console.log(err);
    console.warn(`Call to ${issuingServer} was unsuccessful`);
  }
  // todo: handle error codes
  if (issuance_status === ISSUE_STATUS.success) {
    return [issuedCoin, coin_id];
  } else {
    console.log(issuance_status);
    return [null, null];
  }
}

export async function checkIfAlive(server) {
  let isAlive = false;
  if (DEBUG) {
    console.log(`Checking status of ${server}`);
  }
  try {
    let response = await fetch(`http://${server}/status`);
    response = await response.json();
    isAlive = response.alive;
  } catch (err) {
    console.log(err);
    console.warn(`Call to ${server} was unsuccessful`);
  }
  return isAlive;
}

export async function getPublicKey(server) {
  const publicKey = [];
  if (DEBUG) {
    console.log(`Sending request to get public key of ${server}`);
  }
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

export async function signCoin(server, coin, ElGamalPK, params = null, id = null, sk = null) {
  const signingCoin = coin.prepareCoinForSigning(ElGamalPK, params, id, sk);
  let signature = null;
  if (DEBUG) {
    console.log('Compressed coin to sign: ', signingCoin);
  }

  // this would actually be needed for spending coin (to produce X3^x),
  // but if done here, we could verify if server is running, todo: actually do it
  if (PKs[server] == null) {
    if (DEBUG) {
      console.log(`${server} wasn't queried before. We need to get its PK first.`);
    }
    const publicKey = await getPublicKey(server);
    PKs[server] = publicKey;
  } else if (DEBUG) {
    console.log(`${server} was queried before. Its PK is:`);
    console.log(PKs[server]);
  }
  if (DEBUG) {
    console.log(`Sending signing query to ${server}`);
  }

  try {
    let response = await
      fetch(`http://${server}/blindsign`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coin: signingCoin,
          ElGamalPKBytes: ElGamal.getPKBytes(ElGamalPK),
        }),
      });
    response = await response.json();

    // since the call was successful, recreate the objects from bytes representations
    const [hBytes, [enc_sig_a_Bytes, enc_sig_b_Bytes]] = response.signature;

    const h = ctx.ECP.fromBytes(hBytes);
    const enc_sig_a = ctx.ECP.fromBytes(enc_sig_a_Bytes);
    const enc_sig_b = ctx.ECP.fromBytes(enc_sig_b_Bytes);

    signature = [h, [enc_sig_a, enc_sig_b]];
  } catch (err) {
    console.warn(err);
    console.warn(`Call to ${server} was unsuccessful`);
  }
  return signature;
}

// we need to send to the verifier coin(ID, v, ttl, value), id (we reveal it), proof of x, pkX and aggSig
export async function spendCoin(coin, proof, signature, pkX, id, server) {

  // due to being signed, coin already has bytesV and bytesID attributes
  const simplifiedCoin = {
    bytesV: coin.bytesV,
    bytesID: coin.bytesID,
    value: coin.value,
    ttl: coin.ttl,
    sig: coin.sig,
  };
  const simplifiedProof = getSimplifiedProof(proof);
  const simplifiedSignature = getSimplifiedSignature(signature);
  const pkXBytes = [];
  const idBytes = [];
  pkX.toBytes(pkXBytes);
  id.toBytes(idBytes);

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
          pkX: pkXBytes,
          id: idBytes,
        }),
      });
    response = await response.json();
    success = response.success;
  } catch (err) {
    console.warn(err);
    console.warn(`Call to merchant ${server} was unsuccessful`);
  }
  return success;
}
