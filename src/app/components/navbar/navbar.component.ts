import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiauthService } from 'src/app/services/apiauth.service';
import { UserResponse } from 'src/app/models/userResponse';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuario!: UserResponse;
  
  constructor(public apiAuthService: ApiauthService,
              private router: Router){
    this.apiAuthService.user.subscribe(res =>{
    this.usuario = res;
    console.log("cambio el objeto"+ res);
    })
  }

  logout(){
    this.apiAuthService.logout();
  }

  ngOnInit(): void {
  }

}
