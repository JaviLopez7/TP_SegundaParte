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

export const routes: Routes = [
  { path: '', component: IniciarSesionComponent },
  { path: 'iniciar-sesion', component: IniciarSesionComponent },
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  { path: 'gestion', component: GestionComponent },
  { path: 'gestion-producto', component: GestionProductoComponent },
  { path: 'gestion-producto/alta', component: AltaComponent },
  { path: 'gestion-producto/listado', component: ListadoComponent },
  { path: 'gestion-producto/modificar', component: EditarComponent },
  { path: 'editar-producto/:id', component: EditarProductoComponent },
  { path: 'gestion-producto/baja', component: EliminarProductoComponent },
  { path: 'factura-carrito', component: FacturaCarritoComponent },
  { path: 'factura', component: FacturaComponent }, // Ruta para el componente de factura
  { path: 'chat', component: ChatComponent },
  { path: '**', component: NoEncontradoComponent }
];

