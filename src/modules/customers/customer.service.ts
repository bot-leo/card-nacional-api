import { Types } from 'mongoose';
import { Customer, ICustomerDocument } from './customer.model';
import { UpdateMyProfileDto } from './dto/update-profile.dto';

class CustomerService {
  async getOwnProfile(accountId: Types.ObjectId): Promise<ICustomerDocument | null> {
    return Customer.findOne({ accountId }).select('-__v');
  }

  async updateOwnProfile(
    accountId: Types.ObjectId,
    data: UpdateMyProfileDto
  ): Promise<ICustomerDocument> {
    // Extração explícita — impede mass assignment mesmo que o cliente envie campos extras
    const { nomeCompleto, telefone } = data;

    const updated = await Customer.findOneAndUpdate(
      { accountId },
      {
        ...(nomeCompleto !== undefined && { nomeCompleto }),
        ...(telefone !== undefined && { telefone }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) throw new Error('Perfil não encontrado');
    return updated;
  }
}

export const customerService = new CustomerService();
