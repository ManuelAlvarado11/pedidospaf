import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PreciosCantidad } from '../models/preciosCantidad';

@Injectable({
  providedIn: 'root'
})
export class PreciosCantidadService {
  myAppUrl = environment.myAppUrl;
  myApiUrl = 'api/fac_precios_cantidad/';
  list!: PreciosCantidad[];
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerPreciosCantidad(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => {this.list = data as PreciosCantidad[]; });
  }
}
