import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { Pedido } from '../models/pedido';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  myAppUrl = 'http://localhost:60215/';
  myApiUrl = 'api/fac_pedidos/';
  list!: Pedido[];
  private actualizaFormulario = new BehaviorSubject<Pedido>({} as any);
  private clienteForm = new BehaviorSubject<Cliente>({} as any);
  private productoForm = new BehaviorSubject<Producto>({} as any);
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  //INSERTAR
  guardarPedido(pedido: Pedido):Observable<Pedido>{
    return this.http.post<Pedido>(this.myAppUrl + this.myApiUrl, pedido);
  }

  //ACTUALIZAR
  actualizarPedido(cot_empresa: string,cot_numero: string, cot_pedido: string, pedido: Pedido): Observable<Pedido>{
    return this.http.put<Pedido>(this.myAppUrl + this.myApiUrl + cot_empresa +"/"+cot_numero+"/"+cot_pedido, pedido);
  }

  //ELIMINAR
  eliminarPedido(cot_empresa: string,cot_numero: string, cot_pedido: string){
    return this.http.delete<Pedido>(this.myAppUrl + this.myApiUrl + cot_empresa +"/"+cot_numero+"/"+cot_pedido);
  }

  //LISTAR
  obtenerPedidos(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => { this.list = data as Pedido[]; });
  }

  //EDITAR PEDIDO
  obtenerPedido(): Observable<Pedido>{
    return this.actualizaFormulario.asObservable();
  }
  actualizar(pedido: any){
    this.actualizaFormulario.next(pedido);
  }

  //BUSQUEDA DE CLIENTE
  obtenerCliente():Observable<Cliente>{
    return this.clienteForm.asObservable();
  }
  seleccionarCliente(cliente: any){
    this.clienteForm.next(cliente);
  }

  //BUSQUEDA DE PRODUCTO
  obtenerProducto():Observable<Producto>{
    return this.productoForm.asObservable();
  }
  seleccionarProducto(producto: any){
    this.productoForm.next(producto);
  }
}
