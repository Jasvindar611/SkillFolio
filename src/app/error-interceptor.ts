import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(private dialog: MatDialog){}

    intercept(req: HttpRequest<any>, next: HttpHandler){
       return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) =>{
            let errorMessage = "An unknown error occurred!"
            if(error.error.message){
                if(error.error.message === 'You Need to Login first..'){
                    console.error("user needs to login first");
                }else if(error.error.message === 'Resume not found'){
                    console.error("there is not reume, user have to create it first");
                }
                else{
                    errorMessage = error.error.message;
                    this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
                    return throwError(error);
                }
            }
            
        })
       )
    }
}