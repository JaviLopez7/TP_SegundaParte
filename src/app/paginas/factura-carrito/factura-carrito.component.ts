import { Component, OnInit, OnDestroy } from '@angular/core';
import { Producto } from '../../interfaces/producto';
import { ServicioProductoService } from '../../servicios/servicio-producto.service';
import { ServicoTipoCambioService } from '../../servicios/servico-tipo-cambio.service';
import { ServicioCarritoService } from '../../servicios/servicio-carrito.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FacturaComponent } from '../factura/factura.component';
import { Router, RouterLink } from '@angular/router';
import { FacturaService } from '../../servicios/factura.service';
import { ChatComponent } from '../chat/chat.component';


@Component({
  selector: 'app-factura-carrito',
  standalone: true,
  imports: [FormsModule, CommonModule, FacturaComponent, RouterLink, ChatComponent],
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
    private router: Router,
    private facturaService: FacturaService
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

  descargarCSV() {
    this.facturaService.obtenerFacturasEmitidas().subscribe((data) => {
      console.log('Datos recibidos:', data);
      const csv = this.convertirAFormatoCSV(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'facturas.csv';
      a.click();
    });
  }

  // Convertir a CSV como método normal (sin 'function')
  convertirAFormatoCSV(datos: any[]): string {
    const encabezados = ['Fecha', 'Cliente', 'Producto', 'Cantidad', 'Precio Unitario', 'Total Producto', 'Total Factura'];

    const facturasMap = new Map<number, {
  fecha: string,
  cliente: string,
  total_factura: number,
  productos: Array<{
    producto: string,
    cantidad: number,
    precio_unitario: number,
    total_producto: number
  }>
}>();

datos.forEach(f => {
  const facturaId = f.factura_id;
  if (!facturasMap.has(facturaId)) {
    facturasMap.set(facturaId, {
      fecha: f.fecha ? f.fecha.split('T')[0] : '',
      cliente: `${f.cliente_nombre ?? ''} ${f.cliente_apellido ?? ''}`,
      total_factura: Number(f.total) || 0, // <== usa 'total' en lugar de 'total_factura'
      productos: []
    });
  }

  facturasMap.get(facturaId)?.productos.push({
    producto: f.producto_nombre || '',
    cantidad: Number(f.cantidad) || 0,
    precio_unitario: Number(f.precio_unitario) || 0,
    total_producto: Number(f.cantidad * f.precio_unitario) || 0
  });
});


    const filas: string[][] = [];

    for (const [_, factura] of facturasMap.entries()) {
      factura.productos.forEach(prod => {
        filas.push([
          factura.fecha,
          factura.cliente,
          prod.producto,
          prod.cantidad.toString(),
          prod.precio_unitario.toFixed(2),
          prod.total_producto.toFixed(2),
          '' // Total factura solo en fila final
        ]);
      });

      filas.push(['', '', '', '', '', 'Total Factura:', factura.total_factura.toFixed(2)]);
    }

    // Escapar valores para CSV (por si hay comas o comillas)
    const csvContent = [encabezados, ...filas]
      .map(fila => fila.map(campo => `"${campo.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return csvContent;
  }




}





