import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../common/enums';
import { IS_ROLES_KEY } from '../../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(IS_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      if (err || !user) {
        throw err || new UnauthorizedException('Token inválido ou ausente');
      }
      return user;
    }

    if (!user) {
      throw new UnauthorizedException('Token inválido ou ausente');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new UnauthorizedException('Sem permissão para acessar este recurso');
    }

    return user;
  }
}
