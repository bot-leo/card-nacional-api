import { Router } from 'express';
import { adminController } from './admin.controller';
import {
  authMiddleware,
  requireStaff,
} from '../../infrastructure/http/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/http/middlewares/rbac.middleware';
import { Permission } from './rbac/permissions.enum';

export const adminRoutes = Router();

// Todos os endpoints do painel exigem autenticação de funcionário
adminRoutes.use(authMiddleware, requireStaff);

// ── Clientes ──────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/customers:
 *   get:
 *     tags: [Admin - Clientes]
 *     summary: Lista todos os clientes
 *     description: Requer permissão `customer:read`. Disponível para todos os papéis de staff.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerProfile'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminRoutes.get(
  '/customers',
  requirePermission(Permission.CUSTOMER_READ),
  adminController.listCustomers.bind(adminController)
);

/**
 * @openapi
 * /admin/customers/{id}:
 *   get:
 *     tags: [Admin - Clientes]
 *     summary: Retorna um cliente pelo ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerProfile'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
adminRoutes.get(
  '/customers/:id',
  requirePermission(Permission.CUSTOMER_READ),
  adminController.getCustomer.bind(adminController)
);

/**
 * @openapi
 * /admin/customers/{id}:
 *   patch:
 *     tags: [Admin - Clientes]
 *     summary: Atualiza dados de um cliente
 *     description: Requer `customer:update`. Apenas `nomeCompleto`, `telefone` e `status` são aceitos.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUpdateCustomerRequest'
 *           example:
 *             status: "SUSPENDED"
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerProfile'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminRoutes.patch(
  '/customers/:id',
  requirePermission(Permission.CUSTOMER_UPDATE),
  adminController.updateCustomer.bind(adminController)
);

/**
 * @openapi
 * /admin/customers/{id}/activate:
 *   post:
 *     tags: [Admin - Clientes]
 *     summary: Ativa a conta de um cliente
 *     description: Requer `customer:activate`. Ativa Account + Customer.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente ativado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerProfile'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
adminRoutes.post(
  '/customers/:id/activate',
  requirePermission(Permission.CUSTOMER_ACTIVATE),
  adminController.activateCustomer.bind(adminController)
);

/**
 * @openapi
 * /admin/customers/{id}/deactivate:
 *   post:
 *     tags: [Admin - Clientes]
 *     summary: Desativa a conta de um cliente
 *     description: |
 *       Requer `customer:deactivate`. Desativa Account + Customer.
 *       O motivo é obrigatório para fins de auditoria.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeactivateRequest'
 *           example:
 *             reason: "Solicitação do cliente via ticket #1234"
 *     responses:
 *       200:
 *         description: Cliente desativado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerProfile'
 */
adminRoutes.post(
  '/customers/:id/deactivate',
  requirePermission(Permission.CUSTOMER_DEACTIVATE),
  adminController.deactivateCustomer.bind(adminController)
);

// ── Veículos ──────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/vehicles/{vehicleId}/disable:
 *   post:
 *     tags: [Admin - Veículos]
 *     summary: Desativa um veículo
 *     description: |
 *       Requer `vehicle:disable`.
 *       **Nunca** acessa a coleção de veículos diretamente — delega ao `vehicleService.disableVehicle`,
 *       garantindo que validações, eventos e audit log sejam executados pela regra de negócio correta.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeactivateRequest'
 *           example:
 *             reason: "Veículo com dados inconsistentes — ticket #5678"
 *     responses:
 *       200:
 *         description: Veículo desativado com sucesso
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminRoutes.post(
  '/vehicles/:vehicleId/disable',
  requirePermission(Permission.VEHICLE_DISABLE),
  adminController.disableVehicle.bind(adminController)
);

// ── Funcionários ──────────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/staff:
 *   post:
 *     tags: [Admin - Funcionários]
 *     summary: Provisiona um novo funcionário
 *     description: |
 *       Requer `staff:provision` (exclusivo de **ADMINISTRADOR**).
 *       Funcionários **nunca** são criados pelo endpoint público `/auth/register`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProvisionStaffRequest'
 *           example:
 *             name: "Ana Souza"
 *             email: "ana@cardnacional.com"
 *             senha: "Senha@Segura123"
 *             roles: ["atendimento"]
 *     responses:
 *       201:
 *         description: Funcionário provisionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
adminRoutes.post(
  '/staff',
  requirePermission(Permission.STAFF_PROVISION),
  adminController.provisionStaff.bind(adminController)
);

/**
 * @openapi
 * /admin/staff:
 *   get:
 *     tags: [Admin - Funcionários]
 *     summary: Lista todos os funcionários
 *     description: Requer `staff:read`.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StaffResponse'
 */
adminRoutes.get(
  '/staff',
  requirePermission(Permission.STAFF_READ),
  adminController.listStaff.bind(adminController)
);

/**
 * @openapi
 * /admin/staff/{id}/deactivate:
 *   post:
 *     tags: [Admin - Funcionários]
 *     summary: Desativa um funcionário
 *     description: Requer `staff:deactivate` (exclusivo de **ADMINISTRADOR**).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Funcionário desativado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
adminRoutes.post(
  '/staff/:id/deactivate',
  requirePermission(Permission.STAFF_DEACTIVATE),
  adminController.deactivateStaff.bind(adminController)
);
