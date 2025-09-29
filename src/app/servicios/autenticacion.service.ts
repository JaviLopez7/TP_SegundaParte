import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private router: Router) {}

  login(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/iniciar-sesion']);
  }

  obtenerUsuario(): Usuario | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  estaAutenticado(): boolean {
    return this.obtenerUsuario() !== null;
  }
}
