import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap, filter, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router/';

/**
 * Http config class works as middelware for http requests through Interceptor.
 * 
 * @export
 * @class HttpConfigInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    apiUrl: string;
    private renewTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor(
        private toastr: ToastrService,
        private router: Router) {
        this.apiUrl = environment.API_URL;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // this.commonService.showLoading();
        const token = localStorage.getItem('token');

        const httpRequest = new HttpRequest(<any>request.method, this.apiUrl + request.url, request.body);
        request = Object.assign(request, httpRequest);
        //Authentication by setting header with token value
        if (token) {
            request = request.clone({
                setHeaders: {
                    'token': token
                }
            });
        }
        if (!request.headers.has('Content-Type')) {
            request = request.clone({
                setHeaders: {
                    'content-type': 'application/json'
                }
            });
        }

        /* request = request.clone({
            headers: request.headers.set('Accept', 'application/json')
        }); */

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
                /*  setTimeout(() => {
                     this.commonService.dismiss();
                 }, 1000); */

                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this.toastr.clear();
                if (error.status == 0) {
                } else if (error.status == 401) {
                    this.toastr.error('Please try after re-login..', "Unauthorized Access!", { progressBar: true });
                    localStorage.clear();
                    this.router.navigate(['/sessions/signin'])
                } else {
                    this.toastr.error('Something went wrong!', 'Error', { progressBar: true });

                }
                return throwError(error);
            }));
    }
}