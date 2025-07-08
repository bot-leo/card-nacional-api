
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*', // ou use o domínio do seu front-end: 'https://meuapp.vercel.app'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

module.exports = app;