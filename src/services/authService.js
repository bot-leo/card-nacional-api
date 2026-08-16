const bcrypt = require('bcryptjs');
const User = require('../models/user');
const generateToken = require('../utils/generateToken');

class AuthService {
  async register(userData) {
    const { nomeCompleto, cpf, dataNascimento, email, senha } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await User.create({
      nomeCompleto,
      cpf,
      dataNascimento,
      email,
      senha: hashedPassword,
    });

    const token = generateToken(user._id);
    return { token, registerCar: user.registerCar };
  }
}

module.exports = new AuthService();
