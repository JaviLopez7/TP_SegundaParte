import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  crearFactura(cliente_id: number, productos: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-factura`, {
      cliente_id,
      productos
    });
  }


  obtenerFacturasEmitidas(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:3000/facturas/exportar-csv');
}

  
}
