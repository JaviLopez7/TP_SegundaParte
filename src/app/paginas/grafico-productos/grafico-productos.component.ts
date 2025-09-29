import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico-productos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './grafico-productos.component.html',
  styleUrls: ['./grafico-productos.component.css']
})
export class GraficoProductosComponent implements AfterViewInit {
  @ViewChild('canvasProductos') canvasRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  constructor(private http: HttpClient) {}

private generarColores(cantidad: number): string[] {
  const colores: string[] = [];
  const baseColors = [
    '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#00A36C', '#F94144', '#43AA8B', '#F3722C'
  ];

  for (let i = 0; i < cantidad; i++) {
    colores.push(baseColors[i % baseColors.length]);
  }

  return colores;
}

  ngAfterViewInit(): void {
    this.http.get<any[]>('http://localhost:3000/productos-mas-vendidos')
      .subscribe(data => {
        const nombres = data.map(d => d.nombre);
        const cantidades = data.map(d => d.cantidad_vendida);

        this.chart = new Chart(this.canvasRef.nativeElement, {
          type: 'pie',
          data: {
            labels: nombres,
            datasets: [{
               label: 'Cantidad Vendida',
               data: cantidades,
               backgroundColor: this.generarColores(data.length),
              borderColor: '#fff',
              borderWidth: 2,
              hoverOffset: 10,
              hoverBorderColor: '#000',
              hoverBorderWidth: 2

              
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: 10
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#333'
                }
              },
              title: {
                display: true,
                text: 'Productos Más Vendidos',
                color: '#111',
                font: {
                  size: 18
                }
              }
            },
           
          }
        });
      });
  }
}
