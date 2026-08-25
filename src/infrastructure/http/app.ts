import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../../config/swagger';
import { authRoutes } from '../../modules/auth/auth.routes';
import { customerRoutes } from '../../modules/customers/customer.routes';
import { vehicleRoutes } from '../../modules/vehicles/vehicle.routes';
import { adminRoutes } from '../../modules/administration/admin.routes';

export function createApp(): express.Application {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '1mb' }));

  // Swagger — serve o JSON do spec e aponta a UI explicitamente para ele
  app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      explorer: true,
      customSiteTitle: 'Card Nacional API',
      swaggerOptions: {
        url: '/api-docs.json',
      },
    })
  );

  // Rotas
  app.use('/auth', authRoutes);
  app.use('/customers', customerRoutes);
  app.use('/vehicles', vehicleRoutes);
  app.use('/admin', adminRoutes);

  // 404
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Rota não encontrada' });
  });

  // Handler global de erros
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });

  return app;
}
