import { Types } from 'mongoose';
import { Vehicle, IVehicleDocument } from './vehicle.model';
import { Customer } from '../customers/customer.model';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

class VehicleService {
  async create(customerId: Types.ObjectId, data: CreateVehicleDto): Promise<IVehicleDocument> {
    const existing = await Vehicle.findOne({ customerId });
    if (existing) throw new Error('Cliente já possui um veículo cadastrado');

    const placaEmUso = await Vehicle.findOne({ placa: data.placa.toUpperCase() });
    if (placaEmUso) throw new Error('Placa já cadastrada no sistema');

    const vehicle = await Vehicle.create({
      customerId,
      ...data,
      placa: data.placa.toUpperCase(),
    });

    // Sinaliza ao front que o veículo foi cadastrado
    await Customer.findByIdAndUpdate(customerId, { registerCar: true });

    return vehicle;
  }

  async update(customerId: Types.ObjectId, data: UpdateVehicleDto): Promise<IVehicleDocument> {
    const vehicle = await Vehicle.findOne({ customerId });
    if (!vehicle) throw new Error('Nenhum veículo vinculado a este cliente');

    if (data.placa) {
      const placaEmUso = await Vehicle.findOne({
        placa: data.placa.toUpperCase(),
        customerId: { $ne: customerId },
      });
      if (placaEmUso) throw new Error('Placa já cadastrada no sistema');
    }

    const updated = await Vehicle.findOneAndUpdate(
      { customerId },
      {
        ...data,
        ...(data.placa && { placa: data.placa.toUpperCase() }),
      },
      { new: true, runValidators: true }
    );

    return updated!;
  }

  async findByCustomer(customerId: Types.ObjectId): Promise<IVehicleDocument | null> {
    return Vehicle.findOne({ customerId, status: 'ACTIVE' });
  }

  /**
   * Desativa um veículo via painel administrativo.
   * Método exposto para o AdminService — nunca acesse Vehicle diretamente do admin.
   */
  async disableVehicle(
    vehicleId: Types.ObjectId,
    _adminId: string,
    _reason: string
  ): Promise<IVehicleDocument> {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) throw new Error('Veículo não encontrado');
    if (vehicle.status === 'DISABLED') throw new Error('Veículo já está desativado');

    vehicle.status = 'DISABLED';
    await vehicle.save();

    // TODO: AuditService.log({ action: 'vehicle:disable', vehicleId, adminId, reason })

    return vehicle;
  }
}

export const vehicleService = new VehicleService();
