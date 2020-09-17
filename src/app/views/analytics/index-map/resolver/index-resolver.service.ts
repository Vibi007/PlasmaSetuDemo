import { Injectable, Inject } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
@Injectable()
export class IndexResolver implements Resolve<any> {

    constructor(private http: HttpClient) { }

    resolve(
        route: ActivatedRouteSnapshot,
        rstate: RouterStateSnapshot
    ): Observable<any> {
        let response1 = this.http.get('HNI');
        let response2 = this.http.get('Cities');
        return forkJoin([response1, response2]);
    }
}