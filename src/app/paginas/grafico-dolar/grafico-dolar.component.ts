import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ServicoTipoCambioService } from '../../servicios/servico-tipo-cambio.service';
import { RouterModule } from '@angular/router'; 
Chart.register(...registerables);

@Component({
  selector: 'app-grafico-dolar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './grafico-dolar.component.html',
  styleUrls: ['./grafico-dolar.component.css']
})
export class GraficoDolarComponent implements AfterViewInit {
  @ViewChild('canvasDolar', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart; // instancia del gráfico

  // Offset de semanas: 0 = actual; -1 = anterior; -2 = dos atrás, etc.
  currentWeekOffset = 0;

  cargando = false;       // indica estado de carga de datos
  error: string | null = null; // mensaje de error en caso de fallos
  rangoLabel = '';        // etiqueta que describe el rango actual mostrado

  // Define si se prioriza el valor de venta o compra al elegir campos
  private preferVenta = true;

  // Se inyecta el servicio de tipo de cambio y ChangeDetectorRef para manejar errores de detección
  constructor(
    private tipoCambioService: ServicoTipoCambioService,
    private cdr: ChangeDetectorRef
  ) {}

  // Al finalizar la vista se carga la semana inicial (actual)
  ngAfterViewInit(): void {
    this.cargarSemana(this.currentWeekOffset);
  }

  // === Acciones de la UI ===

  // Permite retroceder una semana en el gráfico
  semanaAnterior(): void {
    this.currentWeekOffset -= 1;
    this.cargarSemana(this.currentWeekOffset);
  }

  // Permite volver a la semana actual desde semanas anteriores
  irAEstaSemana(): void {
    if (this.currentWeekOffset !== 0) {
      this.currentWeekOffset = 0;
      this.cargarSemana(this.currentWeekOffset);
    }
  }

  // === Lógica principal ===

  private cargarSemana(offsetSemanas: number): void {
    this.cargando = true;
    this.error = null;

    // Se obtiene el rango de fechas según la semana solicitada
    const { desde, hasta, label } = this.getWeekRange(offsetSemanas);
    this.rangoLabel = label;

    this.cdr.detectChanges();

    // Petición HTTP para recuperar datos de cotización
    this.tipoCambioService.getTipoCambio(desde, hasta).subscribe({
      next: (resp: any) => {
       
        const arr: any[] =
          Array.isArray(resp) ? resp :
          resp?.results ?? resp?.data ?? resp?.cotizaciones ?? resp?.items ?? resp?.value ?? [];

        type RowRaw = { fecha: string | null; valor: number };

        
        const rowsRaw: RowRaw[] = arr.map((row: any): RowRaw => {
          const fecha = this.pickDate(row);
          const valor = this.pickValor(row, this.preferVenta);
          return { fecha, valor };
        });

        const rows = rowsRaw.filter((x): x is { fecha: string; valor: number } =>
          typeof x.fecha === 'string' && x.fecha.length > 0 && Number.isFinite(x.valor)
        );

        // Orden cronológico por fecha
        rows.sort((a, b) => a.fecha.localeCompare(b.fecha));
        console.log('Normalizado:', rows);

        // Si no hay datos válidos, se muestra mensaje de error
        if (!rows.length) {
          this.error = 'No se encontraron datos para esta semana.';
          this.render([], []);
          this.cargando = false;
          return;
        }

        
        const labels = rows.map(r => r.fecha);
        const valores = rows.map(r => r.valor);
        this.render(labels, valores);
        this.cargando = false;
      },
      error: (e) => {
        console.error('Error API:', e);
        this.error = 'No se pudo obtener la cotización.';
        this.render([], []);
        this.cargando = false;
      }
    });
  }

  // Renderiza el gráfico de líneas con Chart.js
  private render(labels: string[], valores: number[]): void {
    if (this.chart) this.chart.destroy(); // destruir instancia previa si existe
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Evolución del dólar (semana seleccionada)',
          data: valores,
          borderColor: 'blue',
          backgroundColor: 'rgba(0,123,255,0.3)',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Fecha' } },
          y: { title: { display: true, text: 'ARS' } }
        }
      }
    });
  }

  // === Rango semanal ===

  /**
   * Calcula el lunes y domingo correspondientes a la semana deseada.
   * offset = 0 semana actual, -1 anterior, etc.
   * Ajusta el fin al día actual si la semana aún no terminó.
   */
  private getWeekRange(offsetSemanas: number): { desde: string; hasta: string; label: string } {
    const hoy = new Date();
    const todayYMD = this.ymd(hoy);

    // Determinar lunes de la semana actual
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const day = d.getDay();                 // 0=Domingo, 1=Lunes...
    const diffToMonday = (day + 6) % 7;     // distancia hasta lunes
    d.setDate(d.getDate() - diffToMonday);

    // Aplicar desplazamiento de semanas
    d.setDate(d.getDate() + offsetSemanas * 7);
    const monday = new Date(d);
    const sunday = new Date(d); sunday.setDate(sunday.getDate() + 6);

    // Si es la semana actual y el domingo aún no llegó, recorta hasta hoy
    const hastaDate = (offsetSemanas === 0 && sunday > hoy) ? hoy : sunday;

    const desde = this.ymd(monday);
    const hasta = this.ymd(hastaDate);

    const label = `Semana del ${desde} al ${hasta === todayYMD ? `${hasta} (hoy)` : hasta}`;
    return { desde, hasta, label };
  }

  // Devuelve fecha formateada YYYY-MM-DD
  private ymd(date: Date): string {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // === Helpers para extracción de datos sin tocar el servicio ===

  // Intenta extraer y normalizar la fecha desde distintos nombres de campo
  private pickDate(obj: any): string | null {
    const c = this.getFirst(obj, ['fecha', 'Fecha', 'date', 'Date', 'dia', 'Dia', 'fechaHora', 'FechaHora']);
    if (!c) return null;
    try {
      const d = new Date(c);
      if (!isNaN(d.getTime())) return d.toISOString().slice(0,10);
    } catch {}
    if (typeof c === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(c)) return c;
    return String(c);
  }

  // Intenta elegir el valor más representativo (venta/compra) según prioridad
  private pickValor(obj: any, preferVenta: boolean): number {
    const nombresVenta = [
      'tipoCotizacionVendedor','vendedor','venta','valorVenta','precioVenta',
      'sell','ask','oficialVenta','mayoristaVenta','minoristaVenta','turistaVenta'
    ];
    const nombresCompra = [
      'tipoCotizacionComprador','comprador','compra','valorCompra','precioCompra',
      'buy','bid','oficialCompra','mayoristaCompra','minoristaCompra','turistaCompra'
    ];
    const nombresGenericos = [
      'tipoCotizacion','valor','cierre','promedio','oficial','mayorista','minorista','turista','precio'
    ];

    const preferidos = preferVenta ? [...nombresVenta, ...nombresGenericos] : [...nombresCompra, ...nombresGenericos];

    // Busca campos preferidos de forma directa o anidada
    for (const name of preferidos) {
      const v = this.toNum(this.getFirst(obj, [name, `cotizacion.${name}`, `datos.${name}`, `valores.${name}`]));
      if (Number.isFinite(v)) return v;
    }

    // Como fallback, escanea todos los campos buscando un número razonable (300-5000)
    let best = NaN;
    this.walk(obj, (keyPath, val) => {
      if (/(fecha|dia|mes|anio|año|hora|id|codigo|código)/i.test(keyPath)) return;
      const n = this.toNum(val);
      if (Number.isFinite(n) && n >= 300 && n <= 5000) {
        if (!Number.isFinite(best) || n > best) best = n;
      }
    });

    return best;
  }

  // Convierte diferentes formatos de número (con coma o puntos)
  private toNum(v: any): number {
    if (v == null) return NaN;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const norm = v.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
      const n = Number(norm);
      return isFinite(n) ? n : NaN;
    }
    return NaN;
  }

  // Devuelve el primer valor definido de un conjunto de rutas posibles
  private getFirst(obj: any, paths: string[]): any {
    for (const p of paths) {
      const v = this.getByPath(obj, p);
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return undefined;
  }

  // Accede a propiedades anidadas por ruta "a.b.c"
  private getByPath(obj: any, path: string): any {
    if (!obj) return undefined;
    const parts = path.split('.');
    let cur = obj;
    for (const part of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, part)) {
        cur = cur[part];
      } else {
        return undefined;
      }
    }
    return cur;
  }

  // Recorre recursivamente un objeto para ejecutar un callback por cada propiedad
  private walk(obj: any, cb: (keyPath: string, val: any) => void, base: string = ''): void {
    if (obj && typeof obj === 'object') {
      for (const k of Object.keys(obj)) {
        const path = base ? `${base}.${k}` : k;
        const v = obj[k];
        cb(path, v);
        if (v && typeof v === 'object') this.walk(v, cb, path);
      }
    }
  }
}
