import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Login } from '../models/login';
import { UserResponse } from '../models/userResponse';

const httOption = {
  headers: new HttpHeaders({
    'Contend-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class ApiauthService {
  myAppUrl = 'http://localhost:60215/';
  myApiUrl = 'api/gen_usuarios/login/';
  private userSubject: BehaviorSubject<UserResponse>;
  public user!: Observable<UserResponse>;
  
  public get userData(): UserResponse{
    return this.userSubject.value;
  }

  constructor(private http: HttpClient) { 
    this.userSubject = new BehaviorSubject<UserResponse>(JSON.parse(localStorage.getItem('usuario')!));
    this.user =this.userSubject.asObservable();
  }

  login(login:Login):Observable<UserResponse>{
    return this.http.post<UserResponse>(this.myAppUrl + this.myApiUrl, login, httOption).pipe(
      map(res => {
        if(res.user != ""){
          localStorage.setItem('usuario', JSON.stringify(res));
          this.userSubject.next(res);
        }
        return res;
      })
    );
  }

  logout(){
    localStorage.removeItem('usuario');
    this.userSubject.next(null!);
  }
}
