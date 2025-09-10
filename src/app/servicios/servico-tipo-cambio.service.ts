import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicoTipoCambioService {

  private apiUrlBanco = 'https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones/USD';

  constructor(private http: HttpClient) { }

  //getTipoCambio(fechaDesde: string, fechaHasta: string) {
    //return this.http.get(`${this.apiUrlBanco}?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  //}

  getTipoCambio(fechaDesde: string, fechaHasta: string) {
  return this.http.get<{ tipoCotizacion: number }[]>(`${this.apiUrlBanco}?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
}


}
