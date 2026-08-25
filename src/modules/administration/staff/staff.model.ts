import { Schema, model } from 'mongoose';
import { Role } from '../rbac/roles.config';
import { IStaffDocument } from './staff.types';

export { IStaffDocument };

const StaffSchema = new Schema<IStaffDocument>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    roles: {
      type: [String],
      enum: Object.values(Role),
      default: [Role.ATENDIMENTO],
    },
    provisionedBy: { type: Schema.Types.ObjectId, ref: 'Staff' },
  },
  { timestamps: true }
);

export const Staff = model<IStaffDocument>('Staff', StaffSchema);
