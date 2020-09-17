import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BranchStatsService {
    constructor(
        private http: HttpClient) { }

    getBranchFranchise(brCode: any): Observable<any> {
        return this.http.get('Branches/' + brCode)
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