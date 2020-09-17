import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class SignInService {
    constructor(
        private http: HttpClient) { }

    postPinCode(loginData: any): Observable<any> {
        return this.http.post('login', loginData)
            .pipe(
                map((response) => {
                    return response;
                }),
                catchError((err, caught) => {
                    console.error(err);
                    throw err;
                })
            );
    }
}