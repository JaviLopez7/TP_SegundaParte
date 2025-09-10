import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Producto } from '../../interfaces/producto';
import { CommonModule } from '@angular/common';
import { ServicoTipoCambioService } from '../../servicios/servico-tipo-cambio.service';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css'
})
export class FacturaComponent implements OnInit {

  @Input() productos: Producto[] = [];
  @Output() confirmarCompra = new EventEmitter<{
    productos: Producto[],
    totalARS: number,
    totalUSD: number,
    tipoCambio: number
  }>();

  tipoCambio: number = 0;

  constructor(private tipoCambioService: ServicoTipoCambioService) {}

  ngOnInit(): void {
    const fechaDesde = '2024-01-01';
    const hoy = new Date().toISOString().split('T')[0];

    this.tipoCambioService.getTipoCambio(fechaDesde, hoy).subscribe({
      next: (respuesta: any) => {
        const detalle = respuesta?.results?.[0]?.detalle;
        if (detalle?.length > 0) {
          this.tipoCambio = Number(detalle[0].tipoCotizacion);
        }
      },
      error: (error) => {
        console.error('Error al obtener tipo de cambio:', error);
        this.tipoCambio = 0;
      }
    });
  }

  calcularTotalARS(precio: number, cantidad: number = 1): number {
    return precio * cantidad;
  }

  calcularTotalUSD(precio: number, cantidad: number = 1): number {
    if (!this.tipoCambio || this.tipoCambio <= 0) return 0;
    return this.calcularTotalARS(precio, cantidad) / this.tipoCambio;
  }

  getTotalCantidad(): number {
    return this.productos.reduce((sum, p) => sum + (p.cantidad || 1), 0);
  }

  getTotalARS(): number {
    return this.productos.reduce((sum, p) => sum + this.calcularTotalARS(p.precio, p.cantidad), 0);
  }

  getTotalUSD(): number {
    return this.productos.reduce((sum, p) => sum + this.calcularTotalUSD(p.precio, p.cantidad), 0);
  }

  onConfirmarCompra(): void {
    if (!this.productos || this.productos.length === 0) return;

    this.confirmarCompra.emit({
      productos: this.productos,
      totalARS: this.getTotalARS(),
      totalUSD: this.getTotalUSD(),
      tipoCambio: this.tipoCambio
    });
  }
}

