import { Component, OnInit, OnDestroy } from '@angular/core';
import { Producto } from '../../interfaces/producto';
import { ServicioProductoService } from '../../servicios/servicio-producto.service';
import { ServicoTipoCambioService } from '../../servicios/servico-tipo-cambio.service';
import { ServicioCarritoService } from '../../servicios/servicio-carrito.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FacturaComponent } from '../factura/factura.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-factura-carrito',
  standalone: true,
  imports: [FormsModule, CommonModule, FacturaComponent, RouterLink],
  templateUrl: './factura-carrito.component.html',
  styleUrl: './factura-carrito.component.css'
})
export class FacturaCarritoComponent implements OnInit, OnDestroy {
  productosDisponibles: (Producto & { seleccionado?: boolean, cantidad?: number })[] = [];
  mostrarFactura: boolean = false;
  mostrarExito: boolean = false;
  tipoCambio: number = 0;

  constructor(
    private productoService: ServicioProductoService,
    private tipoCambioService: ServicoTipoCambioService,
    public carritoService: ServicioCarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.obtenerTipoCambio();
    document.addEventListener('keydown', this.escListener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.escListener);
  }

  escListener = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.mostrarFactura) {
      this.cerrarFactura();
    }
  };

  cargarProductos(): void {
    this.productoService.listarProductos().subscribe({
      next: productos => {
        this.productosDisponibles = productos.map(p => ({
          ...p,
          seleccionado: false,
          cantidad: 1
        }));
      },
      error: err => console.error('Error al cargar productos:', err)
    });
  }

  actualizarCarrito(producto: Producto & { seleccionado?: boolean, cantidad?: number }): void {
    if (producto.seleccionado) {
      const productoConCantidad = {
        ...producto,
        cantidad: producto.cantidad ?? 1
      };
      this.carritoService.agregarProducto(productoConCantidad);
    } else {
      this.carritoService.eliminarProducto(producto.id);
    }
  }

  confirmarSeleccion(): void {
    this.mostrarFactura = true;
  }

  cerrarFactura(): void {
    this.mostrarFactura = false;
  }

  manejarConfirmacionCompra(datosCompra: {
    productos: Producto[],
    totalARS: number,
    totalUSD: number,
    tipoCambio: number
  }): void {
    this.carritoService.vaciarCarrito();
    this.mostrarFactura = false;
    this.mostrarExito = true;

    setTimeout(() => {
      this.router.navigate(['/gestion']);
    }, 3000);
  }

  obtenerTipoCambio(): void {
    const hoy = new Date().toISOString().split('T')[0];
    this.tipoCambioService.getTipoCambio(hoy, hoy).subscribe({
      next: data => {
        if (data && data.length > 0) {
          this.tipoCambio = data[0].tipoCotizacion;
        }
      },
      error: err => console.error('Error al obtener tipo de cambio:', err)
    });
  }
}



