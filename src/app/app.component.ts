import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from './models/userResponse';
import { ApiauthService } from './services/apiauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PedidosFrontend';
  usuario!: UserResponse;

  constructor(public apiAuthService: ApiauthService,
              private router: Router){
                this.apiAuthService.user.subscribe(res =>{
                  this.usuario = res;
                  console.log("cambio el obejeto");
                })
            }
}
