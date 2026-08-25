/** Dados enviados pelo cliente no cadastro público. */
export interface RegisterDto {
  nomeCompleto: string;
  cpf: string;
  /** ISO 8601 — ex: "1990-10-20" */
  dataNascimento: string;
  email: string;
  /** Mínimo 8 caracteres */
  senha: string;
}
