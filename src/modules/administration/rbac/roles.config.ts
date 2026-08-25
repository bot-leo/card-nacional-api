import { Permission } from './permissions.enum';

export enum Role {
  ATENDIMENTO   = 'atendimento',
  FINANCEIRO    = 'financeiro',
  OPERACOES     = 'operacoes',
  GESTOR        = 'gestor',
  ADMINISTRADOR = 'administrador',
}

/**
 * Mapeamento explícito de role → permissões.
 * Princípio least-privilege: cada role recebe apenas o mínimo necessário.
 */
export const RolePermissions: Record<Role, Permission[]> = {
  [Role.ATENDIMENTO]: [
    Permission.CUSTOMER_READ,
    Permission.VEHICLE_READ,
    Permission.ASSISTANCE_READ,
    Permission.ASSISTANCE_CREATE,
    Permission.ASSISTANCE_UPDATE,
  ],

  [Role.FINANCEIRO]: [
    Permission.CUSTOMER_READ,
    Permission.SUBSCRIPTION_READ,
    Permission.PAYMENT_READ,
    Permission.PAYMENT_REFUND,
  ],

  [Role.OPERACOES]: [
    Permission.CUSTOMER_READ,
    Permission.VEHICLE_READ,
    Permission.VEHICLE_UPDATE,
    Permission.VEHICLE_DISABLE,
    Permission.ASSISTANCE_READ,
    Permission.ASSISTANCE_UPDATE,
  ],

  [Role.GESTOR]: [
    Permission.CUSTOMER_READ,
    Permission.CUSTOMER_UPDATE,
    Permission.CUSTOMER_ACTIVATE,
    Permission.CUSTOMER_DEACTIVATE,
    Permission.VEHICLE_READ,
    Permission.VEHICLE_UPDATE,
    Permission.VEHICLE_DISABLE,
    Permission.PLAN_READ,
    Permission.PLAN_UPDATE,
    Permission.SUBSCRIPTION_READ,
    Permission.ASSISTANCE_READ,
    Permission.ASSISTANCE_UPDATE,
    Permission.PAYMENT_READ,
    Permission.AUDIT_READ,
    Permission.STAFF_READ,
  ],

  // ADMINISTRADOR: acesso total a todas as permissões definidas
  [Role.ADMINISTRADOR]: Object.values(Permission) as Permission[],
};

export function hasPermission(roles: Role[], required: Permission): boolean {
  return roles.some((role) => RolePermissions[role]?.includes(required));
}
