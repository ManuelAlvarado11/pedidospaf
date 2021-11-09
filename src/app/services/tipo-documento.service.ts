import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoDocumento } from '../models/tipoDocumento';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  myAppUrl = 'http://localhost:60215/';
  myApiUrl = 'api/fac_tipo_documento/';
  list!: TipoDocumento[];
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerTipoDocumentos(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => {this.list = data as TipoDocumento[]; });
  }

}
