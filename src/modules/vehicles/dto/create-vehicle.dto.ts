export interface CreateVehicleDto {
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  /** Formato Mercosul (ABC1D23) ou brasileiro (ABC-1234) */
  placa: string;
}
