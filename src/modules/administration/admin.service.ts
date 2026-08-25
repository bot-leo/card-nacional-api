import argon2 from '@node-rs/argon2';
import { Types } from 'mongoose';
import { Account } from '../accounts/account.model';
import { Customer, ICustomerDocument } from '../customers/customer.model';
import { Staff, IStaffDocument } from './staff/staff.model';
import { vehicleService } from '../vehicles/vehicle.service';
import { AdminUpdateCustomerDto } from './dto/update-customer.dto';
import { ProvisionStaffDto } from './dto/provision-staff.dto';

class AdminService {
  // ── Clientes ────────────────────────────────────────────────────────────────

  async listCustomers(): Promise<ICustomerDocument[]> {
    return Customer.find().select('-__v').lean() as unknown as ICustomerDocument[];
  }

  async getCustomerById(customerId: string): Promise<ICustomerDocument> {
    const customer = await Customer.findById(customerId).select('-__v');
    if (!customer) throw new Error('Cliente não encontrado');
    return customer;
  }

  async updateCustomer(
    customerId: string,
    data: AdminUpdateCustomerDto,
    _adminId: string
  ): Promise<ICustomerDocument> {
    const { nomeCompleto, telefone, status } = data; // extração explícita — sem mass assignment

    const updated = await Customer.findByIdAndUpdate(
      customerId,
      {
        ...(nomeCompleto !== undefined && { nomeCompleto }),
        ...(telefone !== undefined && { telefone }),
        ...(status !== undefined && { status }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) throw new Error('Cliente não encontrado');

    // TODO: AuditService.log({ action: 'customer:update', targetId: customerId, actorId: _adminId })

    return updated;
  }

  async activateCustomer(customerId: string, _adminId: string): Promise<ICustomerDocument> {
    const customer = await Customer.findById(customerId);
    if (!customer) throw new Error('Cliente não encontrado');
    if (customer.status === 'ACTIVE') throw new Error('Cliente já está ativo');

    customer.status = 'ACTIVE';
    await customer.save();
    await Account.findByIdAndUpdate(customer.accountId, { status: 'ACTIVE' });

    // TODO: AuditService.log(...)

    return customer;
  }

  async deactivateCustomer(
    customerId: string,
    _adminId: string,
    _reason: string
  ): Promise<ICustomerDocument> {
    const customer = await Customer.findById(customerId);
    if (!customer) throw new Error('Cliente não encontrado');
    if (customer.status === 'INACTIVE') throw new Error('Cliente já está inativo');

    customer.status = 'INACTIVE';
    await customer.save();
    await Account.findByIdAndUpdate(customer.accountId, { status: 'INACTIVE' });

    // TODO: AuditService.log({ action: 'customer:deactivate', reason, actorId: _adminId })
    // TODO: NotificationService.notify(customer, 'account.deactivated', { reason })

    return customer;
  }

  // ── Veículos (delegado — nunca acessa a coleção diretamente) ─────────────────

  async disableCustomerVehicle(
    vehicleId: string,
    adminId: string,
    reason: string
  ): Promise<void> {
    await vehicleService.disableVehicle(new Types.ObjectId(vehicleId), adminId, reason);
  }

  // ── Provisionamento de funcionários ──────────────────────────────────────────

  async provisionStaff(
    data: ProvisionStaffDto,
    provisionedById: string
  ): Promise<IStaffDocument> {
    const existing = await Account.findOne({ email: data.email.toLowerCase() });
    if (existing) throw new Error('E-mail já está em uso');

    const passwordHash = await argon2.hash(data.senha);

    const account = await Account.create({
      email: data.email.toLowerCase(),
      passwordHash,
      type: 'STAFF',
      status: 'ACTIVE',
    });

    const staff = await Staff.create({
      accountId: account._id,
      name: data.name,
      roles: data.roles,
      status: 'ACTIVE',
      provisionedBy: new Types.ObjectId(provisionedById),
    });

    // TODO: AuditService.log({ action: 'staff:provision', targetId: staff._id, actorId: provisionedById })

    return staff;
  }

  async listStaff(): Promise<IStaffDocument[]> {
    return Staff.find().select('-__v').lean() as unknown as IStaffDocument[];
  }

  async deactivateStaff(staffId: string, _adminId: string): Promise<IStaffDocument> {
    const staff = await Staff.findById(staffId);
    if (!staff) throw new Error('Funcionário não encontrado');
    if (staff.status === 'INACTIVE') throw new Error('Funcionário já está inativo');

    staff.status = 'INACTIVE';
    await staff.save();
    await Account.findByIdAndUpdate(staff.accountId, { status: 'INACTIVE' });

    // TODO: AuditService.log(...)

    return staff;
  }
}

export const adminService = new AdminService();
