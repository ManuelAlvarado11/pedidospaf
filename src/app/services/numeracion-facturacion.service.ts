import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { numeracionFacturacion } from '../models/numeracionFacturacion';

@Injectable({
  providedIn: 'root'
})
export class NumeracionFacturacionService {
  myAppUrl = environment.myAppUrl;
  myApiUrl = 'api/gen_numeros_facturacion/';
  list!: numeracionFacturacion[];
  numeracion!: Observable<numeracionFacturacion>;
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerNumeracion(num_table: string):Observable<numeracionFacturacion>{
    return this.http.get<numeracionFacturacion>(this.myAppUrl + this.myApiUrl + this.userSesion.empresa + "/"+num_table);
  }

  actualizarNumeracion(numeracion: numeracionFacturacion):Observable<numeracionFacturacion>{
    return this.http.put<numeracionFacturacion>(this.myAppUrl + this.myApiUrl + this.userSesion.empresa + "/"+numeracion.num_tabla, numeracion);
  }

}
