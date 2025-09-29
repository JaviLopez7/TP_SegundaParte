import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ServicioCarritoService {

  productosCarrito: Producto[] = [];

  constructor() {}

  agregarProducto(producto: Producto): void {
  const existente = this.productosCarrito.find(p => p.id === producto.id);
  if (existente) {
    existente.cantidad = producto.cantidad ?? 1;
  } else {
    this.productosCarrito.push({ ...producto, cantidad: producto.cantidad ?? 1 });
  }
}


  eliminarProducto(id: number): void {
    this.productosCarrito = this.productosCarrito.filter(p => p.id !== id);
  }

  vaciarCarrito(): void {
    this.productosCarrito = [];
  }

  obtenerProductos(): Producto[] {
    // 👉 Devolvemos una copia por seguridad
    return [...this.productosCarrito];
  }

  obtenerTotal(): number {
    return this.productosCarrito.reduce((total, producto) => {
      return total + (producto.precio * (producto.cantidad || 1));
    }, 0);
  }
}
