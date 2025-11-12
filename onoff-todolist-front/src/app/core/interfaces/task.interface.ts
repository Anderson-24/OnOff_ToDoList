import { IUser } from './user.interface';
import { IStatusTask } from './status-task.interface';

export interface ITask {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  idUser: number;
  idStatus: number;

  // Relaciones (para respuesta del backend)
  user?: IUser;
  status?: IStatusTask;
}
