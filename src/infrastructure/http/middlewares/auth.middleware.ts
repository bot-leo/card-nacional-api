import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Account } from '../../../modules/accounts/account.model';
import { Customer } from '../../../modules/customers/customer.model';
import { Staff } from '../../../modules/administration/staff/staff.model';

interface JwtPayload {
  sub: string;
  type: 'CUSTOMER' | 'STAFF';
  roles?: string[];
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const account = await Account.findById(decoded.sub).lean();
    if (!account || account.status !== 'ACTIVE') {
      res.status(401).json({ error: 'Conta inativa ou não encontrada' });
      return;
    }

    req.account = account as unknown as typeof req.account;

    if (decoded.type === 'CUSTOMER') {
      const customer = await Customer.findOne({ accountId: account._id }).lean();
      if (customer) req.customer = customer as unknown as typeof req.customer;
    } else if (decoded.type === 'STAFF') {
      const staff = await Staff.findOne({ accountId: account._id }).lean();
      if (staff) req.staff = staff as unknown as typeof req.staff;
    }

    next();
  } catch (err: unknown) {
    if ((err as Error & { name: string }).name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Seu acesso expirou, faça o login novamente' });
      return;
    }
    res.status(401).json({ error: 'Token inválido' });
  }
}

export function requireCustomer(req: Request, res: Response, next: NextFunction): void {
  if (!req.customer) {
    res.status(403).json({ error: 'Acesso restrito a clientes' });
    return;
  }
  next();
}

export function requireStaff(req: Request, res: Response, next: NextFunction): void {
  if (!req.staff) {
    res.status(403).json({ error: 'Acesso restrito a funcionários' });
    return;
  }
  next();
}
