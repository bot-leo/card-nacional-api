const carService = require('../services/carService');

class CarController {
  create = async (req, res) => {
    try {
      const car = await carService.create(req.user._id, req.body);
      res.status(201).json(car);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  update = async (req, res) => {
    try {
      const car = await carService.update(req.user._id, req.body);
      res.status(200).json(car);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  get = async (req, res) => {
    try {
      const car = await carService.findByUser(req.user._id);
      if (!car) return res.status(404).json({ error: 'Nenhum veículo cadastrado para este usuário' });
      res.status(200).json(car);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
  };
}

module.exports = new CarController();
