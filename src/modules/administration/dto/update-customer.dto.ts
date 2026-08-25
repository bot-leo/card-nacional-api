/**
 * Campos que um administrador/gestor pode alterar em um cliente.
 * DTO separado do UpdateMyProfileDto — cada papel autoriza apenas seu conjunto de campos.
 * Proteção contra mass assignment — OWASP API6.
 */
export interface AdminUpdateCustomerDto {
  nomeCompleto?: string;
  telefone?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}
