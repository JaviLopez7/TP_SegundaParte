import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServicioProductoService } from '../../servicios/servicio-producto.service';
import { Producto } from '../../interfaces/producto';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,RouterLink],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent {

  productos: Producto[] = [];
  terminoBusqueda: string = '';
  campoOrden: 'nombre' | 'categoria' | 'precio' = 'nombre';
  ordenAscendente: boolean = true;

  constructor(private productoService: ServicioProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.listarProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        console.log('Productos cargados:', productos);
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  ordenarPor(campo: 'nombre' | 'categoria' | 'precio') {
    if (this.campoOrden === campo) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.campoOrden = campo;
      this.ordenAscendente = true;
    }
  }

  productosFiltrados(): Producto[] {
    const termino = this.terminoBusqueda.toLowerCase();

    let filtrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.categoria.toLowerCase().includes(termino)
    );

    return filtrados.sort((a, b) => {
      const valorA = a[this.campoOrden];
      const valorB = b[this.campoOrden];

      if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
      if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
      return 0;
    });
  }
}

