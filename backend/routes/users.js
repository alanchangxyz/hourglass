const express = require('express');
const { db } = require('../server/db');

const usersRouter = express();

usersRouter.get('/', async (req, res) => {
  res.status(200).send('ping');
});

usersRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping');
});

usersRouter.post('/', async (req, res) => {
  const { id } = req.body;
  res.status(200).send('ping');
});

usersRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping');
});

usersRouter.put('/:', async (req, res) => {
  const { id } = req.params;
  res.status(200).send('ping');
});

module.exports = usersRouter;
