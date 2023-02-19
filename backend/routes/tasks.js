const express = require('express');
const { db } = require('../server/db');

const tasksRouter = express();

tasksRouter.get('/', async (req, res) => {
  res.status(200).send('ping - tasks get all');
});

tasksRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping - tasks get one');
});

tasksRouter.post('/', async (req, res) => {
  const { id } = req.body;
  res.status(200).send('ping - tasks post');
});

tasksRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping - tasks put');
});

tasksRouter.put('/:', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping - tasks delete');
});

module.exports = tasksRouter;
