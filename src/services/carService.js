const Car = require('../models/car');
const User = require('../models/user');

class CarService {
  async create(userId, carData) {
    const { marca, modelo, ano, cor, placa } = carData;

    const existingCar = await Car.findOne({ usuario: userId });
    if (existingCar) throw new Error('Usuário já possui um veículo cadastrado');

    const placaEmUso = await Car.findOne({ placa: placa.toUpperCase() });
    if (placaEmUso) throw new Error('Placa já cadastrada no sistema');

    const car = await Car.create({ usuario: userId, marca, modelo, ano, cor, placa });

    await User.findByIdAndUpdate(userId, { registerCar: true });

    return car;
  }

  async update(userId, carData) {
    const { marca, modelo, ano, cor, placa } = carData;

    const car = await Car.findOne({ usuario: userId });
    if (!car) throw new Error('Nenhum veículo vinculado a este usuário');

    if (placa) {
      const placaEmUso = await Car.findOne({
        placa: placa.toUpperCase(),
        usuario: { $ne: userId },
      });
      if (placaEmUso) throw new Error('Placa já cadastrada no sistema');
    }

    const updatedCar = await Car.findOneAndUpdate(
      { usuario: userId },
      { marca, modelo, ano, cor, placa },
      { new: true, runValidators: true }
    );

    return updatedCar;
  }

  async findByUser(userId) {
    return Car.findOne({ usuario: userId });
  }
}

module.exports = new CarService();
