import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../interfaces/producto';

@Pipe({
  name: 'filtroProductos'
})
export class FiltroProductosPipe implements PipeTransform {

  transform(productos: Producto[], textoBusqueda: string): Producto[] {
    if (!textoBusqueda || textoBusqueda.trim() === '') {
      return productos;
    }
    const termino = textoBusqueda.toLowerCase();
    return productos.filter(producto => 
      producto.nombre.toLowerCase().includes(termino) || 
      producto.categoria.toLowerCase().includes(termino)
    );
  }

}
