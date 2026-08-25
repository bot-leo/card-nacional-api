import argon2 from '@node-rs/argon2';
import { Account } from '../accounts/account.model';
import { Customer } from '../customers/customer.model';
import { Staff } from '../administration/staff/staff.model';
import { generateToken } from '../../shared/utils/generate-token';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../administration/rbac/roles.config';

export interface CustomerRegisterResult {
  token: string;
  registerCar: false;
}

export interface CustomerLoginResult {
  type: 'CUSTOMER';
  token: string;
  registerCar: boolean;
  user: {
    nomeCompleto: string;
    cpf: string;
    dataNascimento: Date;
    email: string;
  };
}

export interface StaffLoginResult {
  type: 'STAFF';
  token: string;
  staff: {
    name: string;
    email: string;
    roles: Role[];
  };
}

export type LoginResult = CustomerLoginResult | StaffLoginResult;

class AuthService {
  async register(data: RegisterDto): Promise<CustomerRegisterResult> {
    const { nomeCompleto, cpf, dataNascimento, email, senha } = data;

    const existingAccount = await Account.findOne({ email: email.toLowerCase() });
    if (existingAccount) throw new Error('E-mail já cadastrado');

    const existingCustomer = await Customer.findOne({ cpf });
    if (existingCustomer) throw new Error('CPF já cadastrado');

    // Argon2id — recomendado pela OWASP como primeira escolha
    const passwordHash = await argon2.hash(senha);

    const account = await Account.create({
      email: email.toLowerCase(),
      passwordHash,
      type: 'CUSTOMER',
      status: 'ACTIVE',
    });

    await Customer.create({
      accountId: account._id,
      nomeCompleto,
      cpf,
      dataNascimento: new Date(dataNascimento),
      registerCar: false,
      status: 'ACTIVE',
    });

    const token = generateToken({ sub: String(account._id), type: 'CUSTOMER' });
    return { token, registerCar: false };
  }

  async login(data: LoginDto): Promise<LoginResult> {
    const { email, senha } = data;

    const account = await Account.findOne({ email: email.toLowerCase() });
    // Mesmo erro para e-mail inexistente e senha errada — evita user enumeration
    if (!account) throw new Error('Credenciais inválidas');

    if (account.status !== 'ACTIVE') {
      throw new Error('Conta inativa ou suspensa. Entre em contato com o suporte');
    }

    const validPassword = await argon2.verify(account.passwordHash, senha);
    if (!validPassword) throw new Error('Credenciais inválidas');

    if (account.type === 'CUSTOMER') {
      const customer = await Customer.findOne({ accountId: account._id });
      if (!customer) throw new Error('Perfil de cliente não encontrado');

      const token = generateToken({ sub: String(account._id), type: 'CUSTOMER' });

      return {
        type: 'CUSTOMER',
        token,
        registerCar: customer.registerCar,
        user: {
          nomeCompleto: customer.nomeCompleto,
          cpf: customer.cpf,
          dataNascimento: customer.dataNascimento,
          email: account.email,
        },
      };
    }

    // STAFF
    const staff = await Staff.findOne({ accountId: account._id });
    if (!staff || staff.status !== 'ACTIVE') {
      throw new Error('Acesso de funcionário inativo');
    }

    const token = generateToken({
      sub: String(account._id),
      type: 'STAFF',
      roles: staff.roles,
    });

    return {
      type: 'STAFF',
      token,
      staff: {
        name: staff.name,
        email: account.email,
        roles: staff.roles as Role[],
      },
    };
  }
}

export const authService = new AuthService();
