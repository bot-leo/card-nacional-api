import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      account?: {
        _id: Types.ObjectId;
        email: string;
        status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
        type: 'CUSTOMER' | 'STAFF';
      };
      customer?: {
        _id: Types.ObjectId;
        accountId: Types.ObjectId;
        nomeCompleto: string;
        cpf: string;
        dataNascimento: Date;
        telefone?: string;
        registerCar: boolean;
        status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
      };
      staff?: {
        _id: Types.ObjectId;
        accountId: Types.ObjectId;
        name: string;
        roles: string[];
        status: 'ACTIVE' | 'INACTIVE';
      };
    }
  }
}

export {};
