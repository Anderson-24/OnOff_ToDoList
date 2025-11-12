export interface IUser {
  id: number;
  fullName: string;
  email: string;
  passwordHash?: string; // opcional por seguridad
  isActive: boolean;
  createdAt: string;
}
