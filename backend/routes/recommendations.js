const express = require('express');
const { db } = require('../server/db');

const recommendationsRouter = express();

recommendationsRouter.get('/', async (req, res) => {
  res.status(200).send('ping');
});

recommendationsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping');
});

recommendationsRouter.post('/', async (req, res) => {
  const { id } = req.body;
  res.status(200).send('ping');
});

recommendationsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping');
});

recommendationsRouter.put('/:', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping');
});

module.exports = recommendationsRouter;
