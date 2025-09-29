import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './componentes/menu/menu.component';
import { AutenticacionService } from './servicios/autenticacion.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PrimerParcial';

   mostrarMenu: boolean = false;

  constructor(
    private router: Router,
    private autenticacion: AutenticacionService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const ruta = event.url;

        // Mostrar menú solo si está autenticado y no está en login o registro
        const rutasSinMenu = ['/iniciar-sesion', '/registrar-usuario'];
        this.mostrarMenu = this.autenticacion.estaAutenticado() && !rutasSinMenu.includes(ruta);
      });
  }
}
