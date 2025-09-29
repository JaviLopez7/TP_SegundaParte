import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VentasService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  obtenerVentasPorFecha(tipo: 'dia' | 'semana' | 'mes'): Observable<{ periodo: string, cantidad: number }[]> {
    return this.http.get<{ periodo: string, cantidad: number }[]>(`${this.apiUrl}/ventas-por-fecha?tipo=${tipo}`);
  }
}
