import { Role } from '../rbac/roles.config';

/**
 * Dados para provisionar um novo funcionário.
 * Fluxo restrito ao ADMINISTRADOR — nunca exposto publicamente.
 * Funcionários nunca são criados pelo endpoint /auth/register.
 */
export interface ProvisionStaffDto {
  name: string;
  email: string;
  senha: string;
  roles: Role[];
}
