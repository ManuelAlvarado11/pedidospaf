import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiauthService } from "../services/apiauth.service";

@Injectable({ 
    providedIn: 'root'
})

export class JwtInterceptor implements HttpInterceptor {
    constructor(private apiAuthService: ApiauthService){ }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        const user = this.apiAuthService.userData;
        if(user){
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            })
        }

        return next.handle(request);
    }
}