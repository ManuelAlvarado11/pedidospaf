import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CnfCorrelativoPedidos } from '../models/cnfCorrelativoPedidos';

@Injectable({
  providedIn: 'root'
})
export class CorrelativoPedidosService {
  myAppUrl = 'http://localhost:60215/';
  myApiUrl = 'api/fac_cnf_correlativos_pedidos/';
  list!: CnfCorrelativoPedidos[];
  correlativo!: CnfCorrelativoPedidos;
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerCorrelativo(cnf_bodega: string):Observable<CnfCorrelativoPedidos>{
    return this.http.get<CnfCorrelativoPedidos>(this.myAppUrl + this.myApiUrl + this.userSesion.empresa + "/"+cnf_bodega );
  }

  actualizarCorrelativo(correlativo: CnfCorrelativoPedidos):Observable<CnfCorrelativoPedidos>{
    return this.http.put<CnfCorrelativoPedidos>(this.myAppUrl + this.myApiUrl + this.userSesion.empresa + "/"+correlativo.cnf_bodega, correlativo);
  }

}
