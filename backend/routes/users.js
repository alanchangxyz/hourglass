const express = require('express');
const { db } = require('../server/db');

const usersRouter = express();

usersRouter.get('/', async (req, res) => {
  return res.status(200).send('ping - users get all');
});

usersRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  return res.status(200).send('ping - users get one');
});

usersRouter.post('/', async (req, res) => {
  const { id } = req.body;
  return res.status(200).send('ping - users post');
});

usersRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  return res.status(200).send('ping - users put');
});

usersRouter.put('/:', async (req, res) => {
  const { id } = req.params;
  return res.status(200).send('ping - users delete');
});

module.exports = usersRouter;
