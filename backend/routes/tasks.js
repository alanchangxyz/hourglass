const express = require('express');
const { db } = require('../server/db');

const tasksRouter = express();

tasksRouter.get('/', async (req, res) => {
  res.status(200).send('ping');
});

tasksRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping');
});

tasksRouter.post('/', async (req, res) => {
  const { id } = req.body;
  res.status(200).send('ping');
});

tasksRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping');
});

tasksRouter.put('/:', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping');
});

module.exports = tasksRouter;
