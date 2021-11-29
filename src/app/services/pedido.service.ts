import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
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
  actualizarPedido(cot_empresa: string,cot_numero: string, pedido: Pedido): Observable<Pedido>{
    return this.http.put<Pedido>(this.myAppUrl + this.myApiUrl + cot_empresa +"/"+cot_numero, pedido);
  }

  //ELIMINAR
  eliminarPedido(cot_empresa: string,cot_numero: string){
    return this.http.delete<Pedido>(this.myAppUrl + this.myApiUrl + cot_empresa +"/"+cot_numero);
  }

  //LISTAR
  obtenerPedidos(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => { this.list = data as Pedido[]; });
  }

  //EDITAR PEDIDO
  actualizar(pedido: any){
    this.actualizaFormulario.next(pedido);
  }
  obtenerPedido(): Observable<Pedido>{
    return this.actualizaFormulario.asObservable();
  }

  //BUSQUEDA DE CLIENTE
  seleccionarCliente(cliente: any){
    this.clienteForm.next(cliente);
  }
  obtenerCliente():Observable<Cliente>{
    return this.clienteForm.asObservable();
  }

  //BUSQUEDA DE PRODUCTO
  seleccionarProducto(producto: any){
    this.productoForm.next(producto);
  }
  obtenerProducto():Observable<Producto>{
    return this.productoForm.asObservable();
  }

  Cancelar(){
    let objeto = {} as any;
    this.actualizaFormulario.next(objeto);
    this.productoForm.next(objeto);
    this.clienteForm.next(objeto);
  }
}
