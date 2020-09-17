import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })

export class FilterService {

    private baseUrl = environment.API_URL;  // URL to web api base url
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient) { }

    getStates(): Observable<any> {
        return this.http.get(this.baseUrl + 'States')
            .pipe(
                map((response) => {
                    return response;
                }),
                catchError((err, caught) => {
                    console.error(err);
                    throw err;
                }
                )
            );
    }

    getDealers(state: string): Observable<any> {
        return this.http.get(this.baseUrl + 'States/'+ state)
            .pipe(
                map((response) => {
                    return response;
                }),
                catchError((err, caught) => {
                    console.error(err);
                    throw err;
                }
                )
            )
    }
}