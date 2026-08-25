import 'dotenv/config';
import { connectDB } from './infrastructure/database/connection';
import { createApp } from './infrastructure/http/app';

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap(): Promise<void> {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Docs: http://localhost:${PORT}/api-docs`);
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao inicializar a aplicação:', err);
  process.exit(1);
});
