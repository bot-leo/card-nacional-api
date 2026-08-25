import { Request, Response, NextFunction } from 'express';
import { Permission } from '../../../modules/administration/rbac/permissions.enum';
import { hasPermission, Role } from '../../../modules/administration/rbac/roles.config';

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.staff) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    if (!hasPermission(req.staff.roles as Role[], permission)) {
      res.status(403).json({
        error: 'Permissão insuficiente',
        required: permission,
      });
      return;
    }

    next();
  };
}
