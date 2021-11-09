import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  myAppUrl = 'http://localhost:60215/';
  myApiUrl = 'api/fac_productos/';
  list!: Producto[];
  private actualizaFormulario = new BehaviorSubject<Producto>({} as any);
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private http: HttpClient) { }

  obtenerProductos(){
    this.http.get(this.myAppUrl + this.myApiUrl + this.userSesion.empresa).
                  toPromise().then(data => {this.list = data as Producto[]; });
  }

  obtenerPorducto(): Observable<Producto>{
    return this.actualizaFormulario.asObservable();
  }

  actualizar(producto: any){
    this.actualizaFormulario.next(producto);
  }
}
