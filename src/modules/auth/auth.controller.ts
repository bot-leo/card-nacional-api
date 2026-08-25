import { Request, Response } from 'express';
import { authService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

class AuthController {
  async register(req: Request<object, object, RegisterDto>, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async login(req: Request<object, object, LoginDto>, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (err: unknown) {
      res.status(401).json({ error: (err as Error).message });
    }
  }
}

export const authController = new AuthController();
