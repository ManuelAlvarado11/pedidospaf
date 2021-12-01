import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  myAppUrl = environment.myAppUrl;
  myApiUrl = 'api/fac_productos/';
  list!: Producto[];
  producto!: Producto;
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerProductos(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => {this.list = data as Producto[]; });
  }

  obtenerProducto(producto: Producto){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa + '/' + producto.pro_codigo).
                  toPromise().then(data => {this.producto = data as Producto;});
  }

}
