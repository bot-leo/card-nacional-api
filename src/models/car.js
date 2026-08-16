const mongoose = require('mongoose');


const CarSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  marca: { type: String, required: true, trim: true },
  modelo: { type: String, required: true, trim: true },
  ano: {
    type: Number,
    required: true,
    min: [1900, 'Ano inválido'],
    max: [new Date().getFullYear() + 1, 'Ano inválido'],
  },
  cor: { type: String, required: true, trim: true },
  placa: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);
