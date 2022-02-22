import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()

export class TokenInterceptor implements HttpInterceptor{

    constructor(){}

    intercept(req : HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        var token = localStorage.getItem("user");

        if(token){
            var clone = req.clone({
                headers : req.headers.set("Authorization", 'Bearer '+token)
            });
            
            return next.handle(clone);
        }
        else{
            return next.handle(req);
        }
    }
}