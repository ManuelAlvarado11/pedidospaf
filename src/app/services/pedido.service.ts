import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  myAppUrl = 'http://localhost:60215/';
  myApiUrl = 'api/fac_pedidos/';
  list!: Pedido[];
  private actualizaFormulario = new BehaviorSubject<Pedido>({} as any);

  constructor(private http: HttpClient) { }

  guardarPedido(pedido: Pedido):Observable<Pedido>{
    return this.http.post<Pedido>(this.myAppUrl + this.myApiUrl, pedido);
  }

  actualizarPedido(cot_empresa: string,cot_numero: string, cot_pedido: string, pedido: Pedido): Observable<Pedido>{
    return this.http.put<Pedido>(this.myAppUrl + this.myApiUrl + cot_empresa +"/"+cot_numero+"/"+cot_pedido, pedido);
  }

  eliminarPedido(cot_empresa: string,cot_numero: string, cot_pedido: string){
    return this.http.delete<Pedido>(this.myAppUrl + this.myApiUrl + cot_empresa +"/"+cot_numero+"/"+cot_pedido);
  }

  obtenerPedidos(){
    this.http.get(this.myAppUrl + this.myApiUrl).
                  toPromise().then(data => { this.list = data as Pedido[]; });
  }

  obtenerPedido(): Observable<Pedido>{
    return this.actualizaFormulario.asObservable();
  }

  actualizar(pedido: any){
    this.actualizaFormulario.next(pedido);
  }
}
