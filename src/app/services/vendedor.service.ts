import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vendedor } from '../models/vendedor';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  myAppUrl = 'http://localhost:60215/';
  myApiUrl = 'api/fac_vendedores_cajeros/';
  list!: Vendedor[];
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerVendedores(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => {this.list = data as Vendedor[]; });
  }

}
