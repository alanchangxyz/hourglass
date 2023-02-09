const pgp = require('pg-promise')({});
require('dotenv').config();

const cn = `postgres://${process.env.CDB_USER}:${encodeURIComponent(process.env.CDB_PASSWORD)}@${
  process.env.CDB_HOST
}:${process.env.CDB_PORT}/${process.env.CDB_DB_NAME}?sslmode=prefer`; // For pgp
const db = pgp(cn);

module.exports = { db };
