import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { Usuario } from '../../interfaces/usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

   usuario: Usuario | null = null;

  constructor(private router: Router, public autenticacion: AutenticacionService) {
  }


  get esCliente(): boolean {
    return this.usuario?.rol_id === 1;
  }

  get esAdministrador(): boolean {
    return this.usuario?.rol_id === 2;
  }


 ngOnInit() {
    this.usuario = this.autenticacion.obtenerUsuario();
  }

  cerrarSesion() {
    this.autenticacion.logout();
  }

}
