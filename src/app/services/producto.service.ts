import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { convertToObject } from 'typescript';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  myAppUrl = environment.myAppUrl;
  myApiUrl = 'api/fac_productos/';
  list!: Producto[];
  producto!: Producto;
  cantidad_reserva = 0;
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerProductosEnList(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => {this.list = data as Producto[]; });
  }

  obtenerProductos(): Observable<any>{
    return this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa);
  }

  obtenerProducto(producto: Producto){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa + '/' + producto.pro_codigo).
                  toPromise().then(data => {this.producto = data as Producto;});
  }

  obtenerReserva(producto: Producto){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa + '/01/' + producto.pro_codigo).
                  toPromise().then(data => {this.cantidad_reserva = + data });
  }

}
