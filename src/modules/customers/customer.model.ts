import { Schema, model, Document, Types } from 'mongoose';

export interface ICustomer {
  accountId: Types.ObjectId;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: Date;
  telefone?: string;
  registerCar: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface ICustomerDocument extends ICustomer, Document {}

const CustomerSchema = new Schema<ICustomerDocument>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      unique: true,
    },
    nomeCompleto: { type: String, required: true, trim: true },
    cpf: { type: String, required: true, unique: true, trim: true },
    dataNascimento: { type: Date, required: true },
    telefone: { type: String, trim: true },
    registerCar: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export const Customer = model<ICustomerDocument>('Customer', CustomerSchema);
