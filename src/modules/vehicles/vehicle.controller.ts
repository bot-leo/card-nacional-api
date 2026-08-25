import { Request, Response } from 'express';
import { vehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Types } from 'mongoose';

class VehicleController {
  async create(req: Request<object, object, CreateVehicleDto>, res: Response): Promise<void> {
    try {
      const vehicle = await vehicleService.create(
        req.customer!._id as Types.ObjectId,
        req.body
      );
      res.status(201).json(vehicle);
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async update(req: Request<object, object, UpdateVehicleDto>, res: Response): Promise<void> {
    try {
      const vehicle = await vehicleService.update(
        req.customer!._id as Types.ObjectId,
        req.body
      );
      res.status(200).json(vehicle);
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async getMyVehicle(req: Request, res: Response): Promise<void> {
    try {
      const vehicle = await vehicleService.findByCustomer(
        req.customer!._id as Types.ObjectId
      );
      if (!vehicle) {
        res.status(404).json({ error: 'Nenhum veículo cadastrado' });
        return;
      }
      res.status(200).json(vehicle);
    } catch {
      res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
  }
}

export const vehicleController = new VehicleController();
