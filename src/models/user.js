const mongoose = require('mongoose');
const { useSyncExternalStore } = require('react');

const UserSchema = new mongoose.Schema({
  nomeCompleto: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  dataNascimento: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
}, { timestamps: true });useSyncExternalStore

module.exports = mongoose.model('User', UserSchema);
