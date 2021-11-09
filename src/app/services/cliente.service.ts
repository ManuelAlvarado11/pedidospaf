import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  myAppUrl = 'http://localhost:60215/';
  myApiUrl = 'api/fac_clientes/';
  list!: Cliente[];
  private actualizaFormulario = new BehaviorSubject<Cliente>({} as any);
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerClientes(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => { this.list = data as Cliente[]; });
  }

  obtenerCliente(): Observable<Cliente>{
    return this.actualizaFormulario.asObservable();
  }

  actualizar(cliente: any){
    this.actualizaFormulario.next(cliente);
  }
}
