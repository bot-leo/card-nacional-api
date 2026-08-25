import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { AdminUpdateCustomerDto } from './dto/update-customer.dto';
import { ProvisionStaffDto } from './dto/provision-staff.dto';

class AdminController {
  // ── Clientes ────────────────────────────────────────────────────────────────

  async listCustomers(_req: Request, res: Response): Promise<void> {
    try {
      const customers = await adminService.listCustomers();
      res.status(200).json(customers);
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async getCustomer(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const customer = await adminService.getCustomerById(req.params.id);
      res.status(200).json(customer);
    } catch (err: unknown) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async updateCustomer(
    req: Request<{ id: string }, object, AdminUpdateCustomerDto>,
    res: Response
  ): Promise<void> {
    try {
      const updated = await adminService.updateCustomer(
        req.params.id,
        req.body,
        String(req.staff!._id)
      );
      res.status(200).json(updated);
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async activateCustomer(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const customer = await adminService.activateCustomer(
        req.params.id,
        String(req.staff!._id)
      );
      res.status(200).json(customer);
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async deactivateCustomer(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { reason } = req.body as { reason: string };
      const customer = await adminService.deactivateCustomer(
        req.params.id,
        String(req.staff!._id),
        reason
      );
      res.status(200).json(customer);
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async disableVehicle(req: Request<{ vehicleId: string }>, res: Response): Promise<void> {
    try {
      const { reason } = req.body as { reason: string };
      await adminService.disableCustomerVehicle(
        req.params.vehicleId,
        String(req.staff!._id),
        reason
      );
      res.status(200).json({ message: 'Veículo desativado com sucesso' });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  // ── Funcionários ─────────────────────────────────────────────────────────────

  async provisionStaff(
    req: Request<object, object, ProvisionStaffDto>,
    res: Response
  ): Promise<void> {
    try {
      const staff = await adminService.provisionStaff(req.body, String(req.staff!._id));
      res.status(201).json(staff);
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async listStaff(_req: Request, res: Response): Promise<void> {
    try {
      const staff = await adminService.listStaff();
      res.status(200).json(staff);
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async deactivateStaff(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const staff = await adminService.deactivateStaff(
        req.params.id,
        String(req.staff!._id)
      );
      res.status(200).json(staff);
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  }
}

export const adminController = new AdminController();
