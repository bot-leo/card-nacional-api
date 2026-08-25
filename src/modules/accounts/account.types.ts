import { Document } from 'mongoose';

export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type AccountType = 'CUSTOMER' | 'STAFF';

export interface IAccount {
  email: string;
  passwordHash: string;
  status: AccountStatus;
  type: AccountType;
}

export interface IAccountDocument extends IAccount, Document {}
