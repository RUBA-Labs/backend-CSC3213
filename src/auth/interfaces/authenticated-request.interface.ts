import { Request } from 'express';
import { Role } from '../../user/role.enum';

export interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        role: Role;
    };
}
