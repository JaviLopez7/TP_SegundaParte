import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})

export class ServicioProductoService {
   private apiUrl = 'http://localhost:3000/registrarproducto';

  constructor(private http: HttpClient) {}

  crearProducto(producto: Omit<Producto, 'id'>) {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  listarProductos() {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerProductoPorId(id: number) {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  actualizarProducto(id: number, producto: Omit<Producto, 'id'>) {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}


