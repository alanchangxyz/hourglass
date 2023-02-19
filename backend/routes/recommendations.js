const express = require('express');
const { db } = require('../server/db');

const recommendationsRouter = express();

recommendationsRouter.get('/', async (req, res) => {
  return res.status(200).send('ping - recs get all');
});

recommendationsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  return res.status(200).send('ping - recs get one');
});

recommendationsRouter.post('/', async (req, res) => {
  const { id } = req.body;
  return res.status(200).send('ping - recs post');
});

recommendationsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  return res.status(200).send('ping - recs put');
});

recommendationsRouter.put('/:', async (req, res) => {
  const { id } = req.params;
  return res.status(200).send('ping - recs delete');
});

module.exports = recommendationsRouter;
