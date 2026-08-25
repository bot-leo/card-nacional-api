import { Router } from 'express';
import { vehicleController } from './vehicle.controller';
import {
  authMiddleware,
  requireCustomer,
} from '../../infrastructure/http/middlewares/auth.middleware';

export const vehicleRoutes = Router();

/**
 * @openapi
 * /vehicles:
 *   post:
 *     tags: [Veículos]
 *     summary: Cadastra o veículo do cliente autenticado
 *     description: Um cliente pode ter apenas **um** veículo. Após o cadastro, `registerCar` vira `true`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVehicleRequest'
 *           example:
 *             marca: "Volkswagen"
 *             modelo: "Gol 1.6"
 *             ano: 2020
 *             cor: "Prata"
 *             placa: "ABC1D23"
 *     responses:
 *       201:
 *         description: Veículo cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
vehicleRoutes.post(
  '/',
  authMiddleware,
  requireCustomer,
  vehicleController.create.bind(vehicleController)
);

/**
 * @openapi
 * /vehicles:
 *   put:
 *     tags: [Veículos]
 *     summary: Atualiza o veículo do cliente autenticado
 *     description: Atualiza parcialmente os dados do veículo vinculado ao cliente.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVehicleRequest'
 *           example:
 *             cor: "Vermelho"
 *             placa: "XYZ9A87"
 *     responses:
 *       200:
 *         description: Veículo atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
vehicleRoutes.put(
  '/',
  authMiddleware,
  requireCustomer,
  vehicleController.update.bind(vehicleController)
);

/**
 * @openapi
 * /vehicles/me:
 *   get:
 *     tags: [Veículos]
 *     summary: Retorna o veículo do cliente autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Veículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *       404:
 *         description: Nenhum veículo cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
vehicleRoutes.get(
  '/me',
  authMiddleware,
  requireCustomer,
  vehicleController.getMyVehicle.bind(vehicleController)
);
