import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  myAppUrl = 'http://localhost:60215/';
  myApiUrl = 'api/fac_pedidos/';
  list!: Pedido[];

  constructor(private http: HttpClient) { }

  guardarPedido(pedido: Pedido):Observable<Pedido>{
    return this.http.post<Pedido>(this.myAppUrl + this.myApiUrl, pedido);
  }

  obtenerPedidos(){
    this.http.get(this.myAppUrl + this.myApiUrl).
                  toPromise().then(data => { this.list = data as Pedido[]; });
  }
}
