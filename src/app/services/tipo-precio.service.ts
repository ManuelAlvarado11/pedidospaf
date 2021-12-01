import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TipoPrecio } from '../models/tipoPrecio';

@Injectable({
  providedIn: 'root'
})
export class TipoPrecioService {
  myAppUrl = environment.myAppUrl;
  myApiUrl = 'api/fac_tipo_precio/';
  list!: TipoPrecio[];
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerTipoPrecios(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => {this.list = data as TipoPrecio[]; });
  }

}
