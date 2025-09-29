import { Component, OnInit } from '@angular/core';
import { Producto } from '../../interfaces/producto';
import { ServicioProductoService } from '../../servicios/servicio-producto.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-producto',
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent implements OnInit {

   producto!: Producto;
   guardado: boolean = false;
  cargando = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ServicioProductoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (!id) {
      this.error = 'ID de producto inválido';
      return;
    }

    this.cargando = true;

    this.productoService.obtenerProductoPorId(id).subscribe({
      next: (producto) => {
        this.producto = producto;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar producto', err);
        this.error = 'Error al cargar el producto';
        this.cargando = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.producto.id) {
      this.error = 'Producto sin ID. No se puede actualizar.';
      return;
    }

    
this.productoService.actualizarProducto(this.producto.id, this.producto).subscribe({

    next: () => {
      this.guardado = true;
      setTimeout(() => this.guardado = false, 3000); // Oculta el mensaje después de 3 segundos
    },
    error: (err) => {
      console.error('Error al guardar cambios:', err);
      alert('Ocurrió un error al guardar los cambios.');
    }
  });


    this.productoService.actualizarProducto(this.producto.id, this.producto).subscribe({
      next: () => {
        alert('Producto actualizado correctamente.');
        this.router.navigate(['/gestion-producto/listado']);
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err);
        this.error = 'Ocurrió un error al actualizar el producto.';
      }
    });
  }

   }
