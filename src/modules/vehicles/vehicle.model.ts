import { Schema, model, Document, Types } from 'mongoose';

export type VehicleStatus = 'ACTIVE' | 'DISABLED';

export interface IVehicle {
  customerId: Types.ObjectId;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  placa: string;
  status: VehicleStatus;
}

export interface IVehicleDocument extends IVehicle, Document {}

const currentYear = new Date().getFullYear();

const VehicleSchema = new Schema<IVehicleDocument>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      unique: true,
    },
    marca: { type: String, required: true, trim: true },
    modelo: { type: String, required: true, trim: true },
    ano: {
      type: Number,
      required: true,
      min: [1900, 'Ano inválido'],
      max: [currentYear + 1, 'Ano inválido'],
    },
    cor: { type: String, required: true, trim: true },
    placa: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'DISABLED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export const Vehicle = model<IVehicleDocument>('Vehicle', VehicleSchema);
