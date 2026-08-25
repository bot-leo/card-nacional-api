import { Schema, model } from 'mongoose';
import { IAccountDocument } from './account.types';

const AccountSchema = new Schema<IAccountDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
    },
    type: {
      type: String,
      enum: ['CUSTOMER', 'STAFF'],
      required: true,
    },
  },
  { timestamps: true }
);

export const Account = model<IAccountDocument>('Account', AccountSchema);
