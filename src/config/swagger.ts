import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const isTs = __filename.endsWith('.ts');
const ext = isTs ? 'ts' : 'js';

const swaggerDefinition: swaggerJSDoc.OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'Card Nacional API',
    version: '2.0.0',
    description: `
**Card Nacional** — Serviços de guincho e assistência veicular.

### Autenticação
Informe o JWT retornado no login como **Bearer Token** no header \`Authorization: Bearer <token>\`.

### Tipos de conta
| type | Descrição |
|------|-----------|
| \`CUSTOMER\` | Cliente da plataforma |
| \`STAFF\`    | Funcionário / Administrador |

### Fluxo inicial do cliente
1. \`POST /auth/register\` → token + \`registerCar: false\`
2. \`POST /vehicles\` → \`registerCar\` vira \`true\` no banco
3. Logins futuros → \`registerCar: true\` → acesso direto à plataforma

### Papéis de funcionário (RBAC)
| Role | Permissões principais |
|------|-----------------------|
| \`atendimento\` | Leitura de clientes/veículos, chamados |
| \`financeiro\`  | Pagamentos, assinaturas |
| \`operacoes\`   | Veículos, chamados |
| \`gestor\`      | Clientes, planos, audit |
| \`administrador\` | Acesso total + provisionamento de staff |
    `,
    contact: { name: 'Time Card Nacional', email: 'dev@cardnacional.com' },
  },
  servers: [
    {
      url: process.env.API_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,
      description: 'Servidor ativo',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Registro e login' },
    { name: 'Clientes', description: 'Perfil do cliente autenticado' },
    { name: 'Veículos', description: 'Veículo vinculado ao cliente' },
    { name: 'Admin - Clientes', description: 'Gestão de clientes (staff)' },
    { name: 'Admin - Veículos', description: 'Gestão de veículos (staff)' },
    { name: 'Admin - Funcionários', description: 'Provisionamento de staff (ADMINISTRADOR)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtido no login. Válido por **24h**.',
      },
    },
    responses: {
      Unauthorized: {
        description: 'Token ausente, inválido ou expirado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { error: 'Seu acesso expirou, faça o login novamente' },
          },
        },
      },
      Forbidden: {
        description: 'Permissão insuficiente',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { error: 'Permissão insuficiente', required: 'customer:deactivate' },
          },
        },
      },
      BadRequest: {
        description: 'Dados inválidos ou regra de negócio violada',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { error: 'E-mail já cadastrado' },
          },
        },
      },
      NotFound: {
        description: 'Recurso não encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { error: 'Cliente não encontrado' },
          },
        },
      },
    },
    schemas: {
      // ── Auth ───────────────────────────────────────────────────────────────
      RegisterRequest: {
        type: 'object',
        required: ['nomeCompleto', 'cpf', 'dataNascimento', 'email', 'senha'],
        properties: {
          nomeCompleto: { type: 'string', example: 'Leonardo Lima' },
          cpf: { type: 'string', example: '12345678900', description: 'Apenas dígitos' },
          dataNascimento: { type: 'string', format: 'date', example: '1990-10-20' },
          email: { type: 'string', format: 'email', example: 'leonardo@cardnacional.com' },
          senha: { type: 'string', format: 'password', minLength: 8, example: 'Senha@Segura123' },
        },
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          registerCar: {
            type: 'boolean',
            example: false,
            description: 'Sempre `false` no cadastro. Redirecione para cadastro de veículo.',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email', example: 'leonardo@cardnacional.com' },
          senha: { type: 'string', format: 'password', example: 'Senha@Segura123' },
        },
      },
      CustomerLoginResponse: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['CUSTOMER'], example: 'CUSTOMER' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          registerCar: {
            type: 'boolean',
            example: true,
            description: '`false` → redirecionar para cadastro de veículo. `true` → acesso direto.',
          },
          user: {
            type: 'object',
            properties: {
              nomeCompleto: { type: 'string', example: 'Leonardo Lima' },
              cpf: { type: 'string', example: '12345678900' },
              dataNascimento: { type: 'string', format: 'date-time' },
              email: { type: 'string', format: 'email', example: 'leonardo@cardnacional.com' },
            },
          },
        },
      },
      StaffLoginResponse: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['STAFF'], example: 'STAFF' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          staff: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Ana Souza' },
              email: { type: 'string', format: 'email', example: 'ana@cardnacional.com' },
              roles: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['atendimento', 'financeiro', 'operacoes', 'gestor', 'administrador'],
                },
                example: ['atendimento'],
              },
            },
          },
        },
      },

      // ── Customer ────────────────────────────────────────────────────────────
      CustomerProfile: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
          accountId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d2' },
          nomeCompleto: { type: 'string', example: 'Leonardo Lima' },
          cpf: { type: 'string', example: '12345678900' },
          dataNascimento: { type: 'string', format: 'date-time' },
          telefone: { type: 'string', example: '+55 11 99999-9999', nullable: true },
          registerCar: { type: 'boolean', example: true },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], example: 'ACTIVE' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UpdateMyProfileRequest: {
        type: 'object',
        description: 'Apenas `nomeCompleto` e `telefone` são aceitos (proteção contra mass assignment).',
        properties: {
          nomeCompleto: { type: 'string', example: 'Leonardo Lima Silva' },
          telefone: { type: 'string', example: '+55 11 99999-9999' },
        },
      },

      // ── Vehicles ────────────────────────────────────────────────────────────
      CreateVehicleRequest: {
        type: 'object',
        required: ['marca', 'modelo', 'ano', 'cor', 'placa'],
        properties: {
          marca: { type: 'string', example: 'Volkswagen' },
          modelo: { type: 'string', example: 'Gol 1.6' },
          ano: { type: 'integer', minimum: 1900, example: 2020 },
          cor: { type: 'string', example: 'Prata' },
          placa: { type: 'string', example: 'ABC1D23', description: 'Mercosul ou antigo' },
        },
      },
      UpdateVehicleRequest: {
        type: 'object',
        properties: {
          marca: { type: 'string', example: 'Fiat' },
          modelo: { type: 'string', example: 'Pulse' },
          ano: { type: 'integer', example: 2023 },
          cor: { type: 'string', example: 'Vermelho' },
          placa: { type: 'string', example: 'XYZ9A87' },
        },
      },
      VehicleResponse: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d3' },
          customerId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
          marca: { type: 'string', example: 'Volkswagen' },
          modelo: { type: 'string', example: 'Gol 1.6' },
          ano: { type: 'integer', example: 2020 },
          cor: { type: 'string', example: 'Prata' },
          placa: { type: 'string', example: 'ABC1D23' },
          status: { type: 'string', enum: ['ACTIVE', 'DISABLED'], example: 'ACTIVE' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      // ── Admin ───────────────────────────────────────────────────────────────
      AdminUpdateCustomerRequest: {
        type: 'object',
        description: 'Campos permitidos para atualização administrativa.',
        properties: {
          nomeCompleto: { type: 'string', example: 'Leonardo Lima' },
          telefone: { type: 'string', example: '+55 11 99999-9999' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], example: 'SUSPENDED' },
        },
      },
      DeactivateRequest: {
        type: 'object',
        required: ['reason'],
        properties: {
          reason: {
            type: 'string',
            minLength: 10,
            example: 'Solicitação do cliente via ticket #1234',
            description: 'Motivo obrigatório para auditoria',
          },
        },
      },
      ProvisionStaffRequest: {
        type: 'object',
        required: ['name', 'email', 'senha', 'roles'],
        properties: {
          name: { type: 'string', example: 'Ana Souza' },
          email: { type: 'string', format: 'email', example: 'ana@cardnacional.com' },
          senha: { type: 'string', format: 'password', minLength: 8, example: 'Senha@Segura123' },
          roles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['atendimento', 'financeiro', 'operacoes', 'gestor', 'administrador'],
            },
            example: ['atendimento'],
          },
        },
      },
      StaffResponse: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d4' },
          accountId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d5' },
          name: { type: 'string', example: 'Ana Souza' },
          roles: { type: 'array', items: { type: 'string' }, example: ['atendimento'] },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      // ── Shared ──────────────────────────────────────────────────────────────
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Mensagem de erro descritiva' },
          required: {
            type: 'string',
            nullable: true,
            example: 'customer:deactivate',
            description: 'Permissão necessária (apenas em erros 403)',
          },
        },
      },
    },
  },
};

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: [
    path.join(__dirname, `../modules/auth/auth.routes.${ext}`),
    path.join(__dirname, `../modules/customers/customer.routes.${ext}`),
    path.join(__dirname, `../modules/vehicles/vehicle.routes.${ext}`),
    path.join(__dirname, `../modules/administration/admin.routes.${ext}`),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
