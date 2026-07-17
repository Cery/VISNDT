export interface JwtPayload {
  sub: string;
  email: string;
  name: string | null;
  organizationId: string | null;
}