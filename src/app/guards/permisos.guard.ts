import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const permisosGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const usuarioStr = localStorage.getItem('usuario');

  if (!usuarioStr) {
    return router.parseUrl('/iniciar-sesion');
  }

  const usuario = JSON.parse(usuarioStr);
  const rolesPermitidos = route.data?.['rol'];

  if (Array.isArray(rolesPermitidos)) {
    return rolesPermitidos.includes(usuario.rol_id) ? true : router.parseUrl('/gestion');
  }

  return usuario.rol_id === rolesPermitidos ? true : router.parseUrl('/gestion');
};
