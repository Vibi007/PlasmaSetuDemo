import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class MapService {
    constructor(
        private http: HttpClient) { }

    getPinCodelatlng(pin: any): Observable<any> {
        return this.http.get('pinCode/' + pin)
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

    getMinlatlng(pin: any): Observable<any> {
        return this.http.get('Min/' + pin)
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

    postPinCode(pin: any): Observable<any> {
        return this.http.post('Min/', pin)
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

    getCityPotential(): Observable<any> {
        return this.http.get('HNI')
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


    getStates(): Observable<any> {
        return this.http.get('States')
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
        return this.http.get('States/' + state)
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