import { Request, Response } from 'express';
import { customerService } from './customer.service';
import { UpdateMyProfileDto } from './dto/update-profile.dto';
import { Types } from 'mongoose';

class CustomerController {
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.customer) {
        res.status(404).json({ error: 'Perfil não encontrado' });
        return;
      }
      res.status(200).json(req.customer);
    } catch {
      res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  }

  async updateProfile(
    req: Request<object, object, UpdateMyProfileDto>,
    res: Response
  ): Promise<void> {
    try {
      const updated = await customerService.updateOwnProfile(
        req.account!._id as Types.ObjectId,
        req.body
      );
      res.status(200).json(updated);
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  }
}

export const customerController = new CustomerController();
