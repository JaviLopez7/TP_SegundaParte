import { Routes } from '@angular/router';
import { IniciarSesionComponent } from './paginas/iniciar-sesion/iniciar-sesion.component';
import { RegistrarUsuarioComponent } from './paginas/registrar-usuario/registrar-usuario.component';
import { NoEncontradoComponent } from './paginas/no-encontrado/no-encontrado.component';
import { GestionComponent } from './paginas/gestion/gestion.component';
import { GestionProductoComponent } from './paginas/gestion-producto/gestion-producto.component';
import { AltaComponent } from './paginas/alta/alta.component';
import { ListadoComponent } from './paginas/listado/listado.component';
import { EditarComponent } from './paginas/editar/editar.component';
import { EditarProductoComponent } from './paginas/editar-producto/editar-producto.component';
import { EliminarProductoComponent } from './paginas/eliminar-producto/eliminar-producto.component';
import { FacturaCarritoComponent } from './paginas/factura-carrito/factura-carrito.component';
import { FacturaComponent } from './paginas/factura/factura.component';
import { ChatComponent } from './paginas/chat/chat.component';
import { GraficoDolarComponent } from './paginas/grafico-dolar/grafico-dolar.component';
import { GraficoVentasComponent } from './paginas/grafico-ventas/grafico-ventas.component';
import { GraficoProductosComponent } from './paginas/grafico-productos/grafico-productos.component';
import { permisosGuard } from './guards/permisos.guard';


export const routes: Routes = [
  { path: '', component: IniciarSesionComponent },
  { path: 'iniciar-sesion', component: IniciarSesionComponent },
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },

  { path: 'gestion', component: GestionComponent, canActivate: [permisosGuard], data: { rol: [1, 2] } },
  { path: 'gestion-producto', component: GestionProductoComponent, canActivate: [permisosGuard], data: { rol: 2 } },
  { path: 'gestion-producto/alta', component: AltaComponent, canActivate: [permisosGuard], data: { rol: 2 } },
  { path: 'gestion-producto/listado', component: ListadoComponent, canActivate: [permisosGuard], data: { rol: 2 } },
  { path: 'gestion-producto/modificar', component: EditarComponent, canActivate: [permisosGuard], data: { rol: 2 } },
  { path: 'editar-producto/:id', component: EditarProductoComponent, canActivate: [permisosGuard], data: { rol: 2 } },
  { path: 'gestion-producto/baja', component: EliminarProductoComponent, canActivate: [permisosGuard], data: { rol: 2 } },

  { path: 'factura-carrito', component: FacturaCarritoComponent, canActivate: [permisosGuard], data: { rol: [1, 2] } },
  { path: 'factura', component: FacturaComponent, canActivate: [permisosGuard], data: { rol: 1 } },

  
  { path: 'grafico-dolar', component: GraficoDolarComponent, canActivate: [permisosGuard], data: { rol: 2 } },
  { path: 'grafico-ventas', component: GraficoVentasComponent, canActivate: [permisosGuard], data: { rol: 2 } },
  { path: 'grafico-productos', component: GraficoProductosComponent, canActivate: [permisosGuard], data: { rol: 2 } },

  { path: '**', component: NoEncontradoComponent }
];




