const express = require('express');
const cors = require('cors');

const { db } = require('./server/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: `*`,
  }),
);

app.use(express.json());

app.get('/', async (req, res) => {
  await db.query('SELECT NOW()');
  return res.status(200).send('API running 🥳');
});

app.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app;