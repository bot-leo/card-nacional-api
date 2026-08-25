import { Router } from 'express';
import { authController } from './auth.controller';

export const authRoutes = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Cadastra um novo cliente
 *     description: |
 *       Cria uma **Account** (identidade) e um **Customer** (perfil).
 *       O endpoint público nunca cria funcionários — apenas clientes.
 *       O token retornado é válido por **24h**.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             nomeCompleto: "Leonardo Lima"
 *             cpf: "12345678900"
 *             dataNascimento: "1990-10-20"
 *             email: "leonardo@cardnacional.com"
 *             senha: "Senha@Segura123"
 *     responses:
 *       201:
 *         description: Cliente cadastrado. `registerCar` é sempre `false` no primeiro acesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
authRoutes.post('/register', authController.register.bind(authController));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login de cliente ou funcionário
 *     description: |
 *       Autentica e retorna um JWT válido por **24h**.
 *
 *       Use o campo `type` para identificar o tipo de usuário:
 *       - `"CUSTOMER"` → contém `registerCar` e `user`. Se `registerCar: false`, redirecione para cadastro de veículo.
 *       - `"STAFF"` → contém `staff` com `roles`. Use para controle de acesso no painel admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "leonardo@cardnacional.com"
 *             senha: "Senha@Segura123"
 *     responses:
 *       200:
 *         description: Login realizado
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/CustomerLoginResponse'
 *                 - $ref: '#/components/schemas/StaffLoginResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
authRoutes.post('/login', authController.login.bind(authController));
