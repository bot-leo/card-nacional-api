const authService = require('../services/authService');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ error: 'Senha incorreta' });

    const token = generateToken(user._id);

    const { nomeCompleto, cpf, dataNascimento, plano, registerCar } = user;

    res.status(200).json({
      token,
      registerCar,
      user: { nomeCompleto, cpf, dataNascimento, email, plano }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
};
}

module.exports = new AuthController();
