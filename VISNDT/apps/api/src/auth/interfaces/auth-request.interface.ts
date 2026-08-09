import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    name?: string | null;
    organizationId?: string | null;
    organization: {
      id: string;
      name: string;
      type: string;
    } | null;
    organizationMember: {
      role: string;
    } | null;
    workspaceRole: 'SUPPLIER' | 'BUYER' | null;
  };
}
