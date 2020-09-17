import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class IndexMapService {
    constructor(
        private http: HttpClient) { }


    getCityDealerList(City: string): Observable<any> {
        return this.http.get('Cities/' + City)
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

    getTierCities(city: string = null): Observable<any> {
        let url: string = (city) ? 'tier_cities/' + city : 'tier_cities';
        return this.http.get(url)
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
    };

    getTopTier(): Observable<any> {
        return this.http.get('tier_top')
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
    };
}