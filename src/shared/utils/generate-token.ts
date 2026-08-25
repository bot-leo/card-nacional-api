import jwt from 'jsonwebtoken';

export interface TokenPayload {
  sub: string;
  type: 'CUSTOMER' | 'STAFF';
  roles?: string[];
}

export function generateToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET não definida no ambiente');

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '24h') as unknown as number,
  });
}
