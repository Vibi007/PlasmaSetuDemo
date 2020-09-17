import { Injectable, Inject } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
@Injectable()
export class BranchResolver implements Resolve<any> {
    constructor(private http: HttpClient) { }

    resolve(
        route: ActivatedRouteSnapshot,
        rstate: RouterStateSnapshot
    ): Observable<any> {
        let response = this.http.get('Branches');
        return response;
    }
}