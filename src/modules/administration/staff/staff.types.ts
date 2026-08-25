import { Document, Types } from 'mongoose';
import { Role } from '../rbac/roles.config';

export interface IStaff {
  accountId: Types.ObjectId;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  roles: Role[];
  provisionedBy?: Types.ObjectId;
}

export interface IStaffDocument extends IStaff, Document {}
