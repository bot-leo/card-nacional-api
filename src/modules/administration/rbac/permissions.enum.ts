export enum Permission {
  // ── Clientes ──────────────────────────────────────────────────────────────
  CUSTOMER_READ       = 'customer:read',
  CUSTOMER_UPDATE     = 'customer:update',
  CUSTOMER_ACTIVATE   = 'customer:activate',
  CUSTOMER_DEACTIVATE = 'customer:deactivate',

  // ── Veículos ──────────────────────────────────────────────────────────────
  VEHICLE_READ    = 'vehicle:read',
  VEHICLE_UPDATE  = 'vehicle:update',
  VEHICLE_DISABLE = 'vehicle:disable',

  // ── Planos ────────────────────────────────────────────────────────────────
  PLAN_READ   = 'plan:read',
  PLAN_UPDATE = 'plan:update',

  // ── Assistência ───────────────────────────────────────────────────────────
  ASSISTANCE_READ   = 'assistance:read',
  ASSISTANCE_CREATE = 'assistance:create',
  ASSISTANCE_UPDATE = 'assistance:update',

  // ── Financeiro ────────────────────────────────────────────────────────────
  PAYMENT_READ      = 'payment:read',
  PAYMENT_REFUND    = 'payment:refund',
  SUBSCRIPTION_READ = 'subscription:read',

  // ── Auditoria ─────────────────────────────────────────────────────────────
  AUDIT_READ = 'audit:read',

  // ── Funcionários (exclusivo ADMINISTRADOR) ────────────────────────────────
  STAFF_PROVISION  = 'staff:provision',
  STAFF_READ       = 'staff:read',
  STAFF_DEACTIVATE = 'staff:deactivate',
}
