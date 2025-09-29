import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { RouterModule } from '@angular/router';
import { VentasService } from '../../servicios/ventas.service';
import { HttpClientModule } from '@angular/common/http';


Chart.register(...registerables);

@Component({
  selector: 'app-grafico-ventas',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './grafico-ventas.component.html',
  styleUrls: ['./grafico-ventas.component.css']
})
export class GraficoVentasComponent implements OnInit {

  
  @ViewChild('canvasVentas') canvasRef!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  // Estado actual de agrupación 
  tipo: 'dia' | 'semana' | 'mes' = 'dia';

 agrupacion: string = 'día';

  cargando = false;
  error: string | null = null;

  constructor(
    private ventasService: VentasService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cargarGrafico();
  }

  // Cambia el tipo de agrupación (día, semana, mes) y recarga el gráfico
  cambiarAgrupacion(nuevoTipo: 'dia' | 'semana' | 'mes') {
  if (this.tipo !== nuevoTipo) {
    this.tipo = nuevoTipo;
    this.agrupacion = this.formatearAgrupacion(nuevoTipo);
    this.cargarGrafico();
  }
}
formatearAgrupacion(tipo: 'dia' | 'semana' | 'mes'): string {
  switch (tipo) {
    case 'dia': return 'día';
    case 'semana': return 'semana';
    case 'mes': return 'mes';
    default: return '';
  }
}


  // Función principal que obtiene los datos desde el backend y arma el gráfico
  private cargarGrafico() {
    this.cargando = true;
    this.error = null;

    // Usamos setTimeout para que Angular no dispare ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.ventasService.obtenerVentasPorFecha(this.tipo).subscribe({
        next: (datos) => {
          // Procesamos los datos que vienen del backend para separarlos en etiquetas y cantidades
          const labels = datos.map(x => x.periodo.split('T')[0]); // Eliminamos la parte de la hora si la hubiera
          const cantidades = datos.map(x => x.cantidad);

          // Dibujamos el gráfico con esos datos
          this.renderChart(labels, cantidades);
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al obtener ventas:', err);
          this.error = 'No se pudo cargar el gráfico de ventas.';
          this.cargando = false;
        }
      });
    });
  }

  
  private renderChart(labels: string[], data: number[]) {
  
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar', // Tipo de gráfico: barras
      data: {
        labels, // Fechas como etiquetas
        datasets: [{
          label: `Cantidad de Ventas por ${this.tipo}`, // Texto dinámico según agrupación
          data, // Cantidades vendidas
          backgroundColor: 'rgba(0, 123, 255, 0.6)', // Color de las barras
          borderColor: 'rgba(0, 123, 255, 1)', // Borde más oscuro
          borderWidth: 1,
          barThickness: 30 // Grosor de las barras
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, 
        scales: {
          x: {
            title: { display: true, text: 'Fecha' } 
          },
          y: {
            title: { display: true, text: 'Cantidad de Ventas' }, 
            beginAtZero: true // Empezar desde 0 para mayor claridad
          }
        }
      }
    });
  }
}
