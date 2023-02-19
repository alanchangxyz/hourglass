const express = require('express');
const cors = require('cors');

const { db } = require('./server/db');
require('dotenv').config();

const recommendationsRouter = require('./routes/recommendations');
const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');

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
  const dt = await db.query('SELECT NOW()');
  console.log(dt[0].now);
  return res.status(200).send(`API running 🥳 from database: ${dt[0].now}`);
});

app.use('/recommendations', recommendationsRouter);
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);

app.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app;