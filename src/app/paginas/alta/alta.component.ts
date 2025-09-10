import { Component } from '@angular/core';
import { ServicioProductoService } from '../../servicios/servicio-producto.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-alta',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule,RouterLink],
  templateUrl: './alta.component.html',
  styleUrl: './alta.component.css'
})
export class AltaComponent {
  nombre: string = '';
  categoria: string = '';
  precio: number = 0;
  descripcion: string = '';
  imagen: string = '';
  categorias: string[] = [];
  mostrarMensajeExito: boolean = false;

  constructor(
    private productoService: ServicioProductoService,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/categorias').subscribe(data => {
      this.categorias = data.map(item => item.categoria);
    });
  }

  onSubmit(): void {
    if (!this.nombre || !this.categoria || this.precio <= 0) {
      return;
    }

    const producto = {
      nombre: this.nombre,
      categoria: this.categoria,
      precio: this.precio,
      descripcion: this.descripcion,
      imagen: this.imagen,
      cantidad: 0
    };

    this.productoService.crearProducto(producto).subscribe({
      next: () => {
        this.mostrarMensajeExito = true;

        setTimeout(() => {
          this.mostrarMensajeExito = false;
          this.location.back();
        }, 2000);
      },
      error: (err) => {
        console.error('Error al guardar producto:', err);
        alert('❌ Ocurrió un error al guardar el producto.');
      }
    });
  }
}


