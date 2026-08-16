const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Card Nacional API',
    version: '1.0.0',
    description: 'Documentacao da API para integracao com o front-end da Card Nacional.',
  },
  servers: [
    {
      url: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
      description: 'Servidor da API',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints de autenticacao',
    },
    {
      name: 'Carro',
      description: 'Gestao do veiculo vinculado ao usuario',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['nomeCompleto', 'cpf', 'dataNascimento', 'email', 'senha'],
        properties: {
          nomeCompleto: { type: 'string', example: 'Leonardo Lima' },
          cpf: { type: 'string', example: '12345678900' },
          dataNascimento: { type: 'string', format: 'date', example: '1990-10-20' },
          email: { type: 'string', format: 'email', example: 'usuario@cardnacional.com' },
          senha: { type: 'string', format: 'password', example: 'Senha@123' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email', example: 'usuario@cardnacional.com' },
          senha: { type: 'string', format: 'password', example: 'Senha@123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          registerCar: { type: 'boolean', example: false, description: 'Indica se o usuário já possui veículo cadastrado' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          registerCar: { type: 'boolean', example: true, description: 'Indica se o usuário já possui veículo cadastrado' },
          user: {
            type: 'object',
            properties: {
              nomeCompleto: { type: 'string', example: 'Leonardo Lima' },
              cpf: { type: 'string', example: '12345678900' },
              dataNascimento: { type: 'string', format: 'date-time', example: '1990-10-20T00:00:00.000Z' },
              email: { type: 'string', format: 'email', example: 'usuario@cardnacional.com' },
              plano: { type: 'string', nullable: true, example: 'Premium' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Mensagem de erro' },
        },
      },
      CarroRequest: {
        type: 'object',
        required: ['marca', 'modelo', 'ano', 'cor', 'placa'],
        properties: {
          marca: { type: 'string', example: 'Volkswagen' },
          modelo: { type: 'string', example: 'Gol' },
          ano: { type: 'integer', example: 2020 },
          cor: { type: 'string', example: 'Prata' },
          placa: { type: 'string', example: 'ABC1D23' },
        },
      },
      CarroResponse: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
          usuario: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d2' },
          marca: { type: 'string', example: 'Volkswagen' },
          modelo: { type: 'string', example: 'Gol' },
          ano: { type: 'integer', example: 2020 },
          cor: { type: 'string', example: 'Prata' },
          placa: { type: 'string', example: 'ABC1D23' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJSDoc(options);