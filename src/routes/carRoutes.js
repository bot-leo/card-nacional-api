const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const authMiddleware = require('../middleWares/auth');

/**
 * @openapi
 * /carro:
 *   post:
 *     tags:
 *       - Carro
 *     summary: Cadastra o veículo do usuário autenticado
 *     description: Cada usuário pode ter apenas um veículo vinculado. Requer token JWT válido.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarroRequest'
 *     responses:
 *       201:
 *         description: Veículo cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarroResponse'
 *       400:
 *         description: Usuário já possui veículo ou placa já cadastrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authMiddleware, carController.create);

/**
 * @openapi
 * /carro:
 *   put:
 *     tags:
 *       - Carro
 *     summary: Atualiza o veículo do usuário autenticado
 *     description: Substitui os dados do veículo vinculado ao usuário. Requer token JWT válido.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarroRequest'
 *     responses:
 *       200:
 *         description: Veículo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarroResponse'
 *       400:
 *         description: Nenhum veículo vinculado ou placa já em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/', authMiddleware, carController.update);

/**
 * @openapi
 * /carro/me:
 *   get:
 *     tags:
 *       - Carro
 *     summary: Retorna o veículo do usuário autenticado
 *     description: Busca o veículo vinculado ao token JWT informado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Veículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarroResponse'
 *       404:
 *         description: Nenhum veículo cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', authMiddleware, carController.get);

module.exports = router;
