import { Injectable, Inject } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class DashboardResolver implements Resolve<any> {
    constructor(private http: HttpClient) { }

    resolve(
        route: ActivatedRouteSnapshot,
        rstate: RouterStateSnapshot
    ): Observable<any> {
        let response = this.http.get('total');
        return response;
    }
}