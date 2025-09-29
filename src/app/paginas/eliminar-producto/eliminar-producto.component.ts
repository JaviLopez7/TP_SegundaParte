import { Component, HostListener } from '@angular/core';
import { Producto } from '../../interfaces/producto';
import { ServicioProductoService } from '../../servicios/servicio-producto.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-eliminar-producto',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './eliminar-producto.component.html',
  styleUrl: './eliminar-producto.component.css'
})
export class EliminarProductoComponent {
  productos: Producto[] = [];
  productoAEliminar: Producto | null = null;
  eliminando = false;

  constructor(private productoService: ServicioProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.listarProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        console.log('Productos cargados:', productos);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  prepararEliminacion(producto: Producto): void {
    this.productoAEliminar = producto;
  }

  cancelarEliminacion(): void {
    this.productoAEliminar = null;
  }

 confirmarEliminacion(): void {
  if (!this.productoAEliminar) return;

  this.eliminando = true;

  this.productoService.eliminarProducto(this.productoAEliminar.id).subscribe({
    next: () => {
      // Filtrar el producto eliminado de la lista
      this.productos = this.productos.filter(p => p.id !== this.productoAEliminar?.id);
      this.productoAEliminar = null;
    },
    error: (err) => {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar el producto.');
    },
    complete: () => {
      this.eliminando = false;
    }
  });
}


  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.productoAEliminar) {
      this.cancelarEliminacion();
    }
  }
}
