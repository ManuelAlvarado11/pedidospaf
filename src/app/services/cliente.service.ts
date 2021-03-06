import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  myAppUrl = environment.myAppUrl;
  myApiUrl = 'api/fac_clientes/';
  list!: Cliente[];
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerClientesEnList(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => { this.list = data as Cliente[]; });
  }
  
  obtenerClientes():Observable<any>{
    return this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa);
  }

}
