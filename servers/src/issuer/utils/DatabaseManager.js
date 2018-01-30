import * as pg from 'pg';
import { DEBUG, pgConfig } from '../config/appConfig';

const pool = new pg.Pool(pgConfig);

export const getBalance = async (user, address) => {
  const res = await pool.query('\
  SELECT "Balance" \
  FROM public."tblClients"\
  WHERE "Name" = $1\
  AND\
  "Address" = $2', [user, address]);

  if (DEBUG) {
    console.log(`Queried balance for ${user} which is is ${res.rows[0].Balance}`);
  }

  return res.rows[0].Balance;
};

export const changeBalance = async (user, value) => {

};

export const insertUsedId = async (id) => {

};

export const insertGeneratedId = async (id) => {

};

