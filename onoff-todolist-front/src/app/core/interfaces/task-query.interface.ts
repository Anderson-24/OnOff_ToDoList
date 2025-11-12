export interface TaskQuery {
  page: number; // 1-based (o 0-based si prefieres; aquí uso 1-based)
  size: number; // rows por página
  sortField?: string; // 'title' | 'user.fullName' | ...
  sortOrder?: 1 | -1; // 1 asc, -1 desc
  userName?: string;
  email?: string;
  title?: string;
  globalUser?: string; // búsqueda global por nombre de usuario
}
