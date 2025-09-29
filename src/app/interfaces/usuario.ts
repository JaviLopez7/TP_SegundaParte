export interface Usuario {
  id: number| string;
  nombre: string;
  apellido: string;
  correo: string;
  rol_id: number;
  direccion?: string; // Solo para cliente
  telefono?: string;  // Solo para cliente
  permisos_especiales?: string; // Solo para administrador
}
