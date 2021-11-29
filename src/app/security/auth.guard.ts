import { Injectable } from '@angular/core';
import {Router, CanActivate,ActivatedRouteSnapshot } from '@angular/router';
import { ApiauthService } from '../services/apiauth.service';

@Injectable({ 
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    
    constructor(private route: Router, private apiAuthService: ApiauthService){

    }
    canActivate(route: ActivatedRouteSnapshot){
        const user = this.apiAuthService.userData;

        if(user){
            return true;
        }
        this.route.navigate(['/login']);
        return false;
    }
}