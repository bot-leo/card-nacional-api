import { Router } from 'express';
import { customerController } from './customer.controller';
import {
  authMiddleware,
  requireCustomer,
} from '../../infrastructure/http/middlewares/auth.middleware';

export const customerRoutes = Router();

/**
 * @openapi
 * /customers/me:
 *   get:
 *     tags: [Clientes]
 *     summary: Retorna o perfil do cliente autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerProfile'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
customerRoutes.get(
  '/me',
  authMiddleware,
  requireCustomer,
  customerController.getProfile.bind(customerController)
);

/**
 * @openapi
 * /customers/me:
 *   patch:
 *     tags: [Clientes]
 *     summary: Atualiza o perfil do cliente autenticado
 *     description: |
 *       Apenas `nomeCompleto` e `telefone` são aceitos.
 *       Campos como `cpf`, `status` e `registerCar` são ignorados mesmo se enviados
 *       (proteção contra mass assignment — OWASP API6).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMyProfileRequest'
 *           example:
 *             nomeCompleto: "Leonardo Lima Silva"
 *             telefone: "+55 11 99999-9999"
 *     responses:
 *       200:
 *         description: Perfil atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerProfile'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
customerRoutes.patch(
  '/me',
  authMiddleware,
  requireCustomer,
  customerController.updateProfile.bind(customerController)
);
