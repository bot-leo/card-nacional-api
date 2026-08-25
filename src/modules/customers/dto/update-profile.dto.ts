/**
 * Campos que o próprio cliente pode alterar no perfil.
 * NUNCA inclui: cpf, status, registerCar, accountId ou qualquer campo administrativo.
 * Proteção contra mass assignment — OWASP API Security Top 10: API6.
 */
export interface UpdateMyProfileDto {
  nomeCompleto?: string;
  telefone?: string;
}
