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
  const id_str = id.toString();
  await pool.query('\
  INSERT INTO public."tblUsedIds"\
  ("Id")\
  VALUES ($1)', [id_str]);

  if (DEBUG) {
    console.log(`Inserted ${id_str} to UsedIds`);
  }
};

export const insertGeneratedId = async (id) => {
  const id_str = id.toString();
  await pool.query('\
  INSERT INTO public."tblGeneratedIds"\
  ("Id")\
  VALUES ($1)', [id_str]);

  if (DEBUG) {
    console.log(`Inserted ${id_str} to generatedIds`);
  }
};

// todo: modify to return a bool
export const checkGeneratedId = async (id) => {
  const res = await pool.query('\
  SELECT (1)\
  FROM public."tblGeneratedIds"\
  WHERE "Id" = $1', [id]);

  const wasGenerated = res.rows.length;
  if (DEBUG) {
    console.log(`Checked if coin id ${id} was already generated and result was: ${wasGenerated}`);
  }

  return wasGenerated;
};

export const checkUsedId = async (id) => {
  const res = await pool.query('\
  SELECT (1)\
  FROM public."tblUsedIds"\
  WHERE "Id" = $1', [id]);

  const wasUsed = res.rows.length;
  if (DEBUG) {
    console.log(`Checked if coin id ${id} was already used and result was: ${wasUsed}`);
  }

  return (wasUsed !== 0);
};
