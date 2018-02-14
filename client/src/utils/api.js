import fetch from 'isomorphic-fetch';
import { ctx, DEBUG, PKs, ISSUE_STATUS, params } from '../config';
import { getProofOfSecret, getSimplifiedProof, getSimplifiedSignature, getRandomNumber } from './helpers';
import ElGamal from '../../lib/ElGamal';
import { getCoinRequestObject } from '../../lib/CoinRequest';

// auxiliary, mostly for testing purposes to simulate delays
export function wait(t) {
  return new Promise(r => setTimeout(r, t));
}

export const getPublicKey = async (server) => {
  if (DEBUG) {
    console.log(`Sending request to get public key of ${server}`);
  }
  try {
    let response = await fetch(`http://${server}/pk`);
    response = await response.json();
    const pkBytes = response.pk;
    // due to the way they implemeted ECDSA, we do not need to convert it
    return pkBytes;
  } catch (err) {
    console.log(err);
    console.warn(`Call to ${server} was unsuccessful`);
    return null;
  }
};

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

  console.log('some key', PKs[issuingServer])

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

export async function getSigningAuthorityPublicKey(server) {
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

// todo: now
export async function signCoin(server, signingCoin, ElGamalPK) {
  let signature = null;
  if (DEBUG) {
    console.log('Compressed coin to sign: ', signingCoin);
  }

  // this should have already been done when getting server status
  if (PKs[server] == null) {
    if (DEBUG) {
      console.log(`${server} wasn't queried before. We need to get its PK first.`);
    }
    const publicKey = await getSigningAuthorityPublicKey(server);
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

    // we need to recreate those from bytes representations to aggregate them
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

// ... we can't send v because it would link us to issuance, we just send value, ttl, id, proof of x (on aX3) and sig
// pkX = aX3^x
export async function spendCoin(coin, proof, signature, pkX, id, server) {
  const simplifiedProof = getSimplifiedProof(proof);
  const simplifiedSignature = getSimplifiedSignature(signature);
  const pkXBytes = [];
  const idBytes = [];
  pkX.toBytes(pkXBytes);
  id.toBytes(idBytes);

  const coinAttributes = {
    value: coin.value,
    ttl: coin.ttl,
    idBytes: idBytes,
  };

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
          coinAttributes: coinAttributes,
          proof: simplifiedProof,
          signature: simplifiedSignature,
          pkX: pkXBytes,
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
