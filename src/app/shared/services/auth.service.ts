import { Injectable } from '@angular/core';
import { LocalStoreService } from './local-store.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	authenticated: string;

	constructor(
		private _cookieService: CookieService,
		private store: LocalStoreService,
		private http: HttpClient,
		private router: Router
	) {
		this.checkAuth();
	}

	checkAuth() {
		this.authenticated = localStorage.getItem('token');
	}

	getuser() {
		return of({});
	}

	signin(credentials:any): Observable<any> {
		this.authenticated = 'token';
		return this.http.post('login', credentials)
		.pipe(
			map((response) => {
				return response;
			}),
			catchError((err, caught) => {
				console.error(err);
				throw err;
			})
		);
		// return of({}).pipe(delay(1500));
	}
	
	signout() {
		this.authenticated = '';
		this._cookieService.delete('token');
		localStorage.clear();
		this.router.navigateByUrl('/sessions/signin');
	}
}
