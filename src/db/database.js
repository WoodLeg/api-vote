import sqlite3 from 'sqlite3';
import { isNull } from 'lodash';

const DB_PATH = process.env.DB_PATH;
const isNotTest = process.env.NODE_ENV !== 'test';
console.log(DB_PATH);
const SQ = sqlite3.verbose();
let db = null;

export function open() {
  return new Promise((resolve, reject) => {
    db = new SQ.Database(DB_PATH || '', sqlite3.OPEN_READWRITE, err => {
      if (err) {
        reject({ ok: false, error: err, message: 'Connection to database failed' });
      } else {
        if (isNotTest) console.log('🔗  Connection to database ...');
        resolve({ ok: true });
      }
    });
  });
}

export function run(query, params = []) {
  return new Promise((resolve, reject) => {
    if (isNull(db)) {
      notConnected(reject);
      return;
    }
    db.run(query, ...params, err => {
      if (err) {
        reject({ ok: false, error: err, message: 'Fail to insert entry in database' });
      } else {
        resolve({ ok: true, message: 'Insertion done.' });
      }
    });
  });
}

export function get(query, params = []) {
  return new Promise((resolve, reject) => {
    if (isNull(db)) {
      notConnected(reject);
      return;
    }
    if (isNotTest) console.log('📦  Retreiving single data ...');
    db.get(query, params, (err, row) => {
      if (err) {
        reject({ ok: false, error: err });
      } else {
        if (isNotTest) console.log('✨  Found data.');
        resolve({ ok: true, data: row });
      }
    });
  });
}

export function all(query, params = []) {
  return new Promise((resolve, reject) => {
    if (isNull(db)) {
      notConnected(reject);
      return;
    }
    if (isNotTest) console.log('📦  Retreiving all data ...');
    db.all(query, params, (err, rows) => {
      if (err) {
        reject({ ok: false, error: err });
      } else {
        if (isNotTest) console.log('✨  Found data.');
        resolve({ ok: true, data: rows });
      }
    });
  });
}

export function close() {
  return new Promise((resolve, reject) => {
    if (isNull(db)) {
      notConnected(reject);
      return;
    }
    db.close(err => {
      if (err) {
        reject({ ok: false, error: err });
      } else {
        if (isNotTest) console.log('🔌  Closing database connection ...');
        resolve({ ok: true });
      }
    });
  });
}

function notConnected(reject) {
  return reject({ ok: false, message: 'Database not connected' });
}

const database = {
  open,
  run,
  get,
  close,
  all
};

export default database;
