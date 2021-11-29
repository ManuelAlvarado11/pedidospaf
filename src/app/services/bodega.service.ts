import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bodega } from '../models/bodega';

@Injectable({
  providedIn: 'root'
})
export class BodegaService {
  myAppUrl = 'http://localhost:60215/';
  myApiUrl = 'api/fac_bodegas/';
  list!: Bodega[];
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerBodegas(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => {this.list = data as Bodega[]; });
  }

}
