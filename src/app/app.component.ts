import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'bootDash';
	constructor(private router: Router) {
		// this.checkUserAuth();
	}

	checkUserAuth() {
		this.router.events.pipe(filter(e => e instanceof NavigationStart))
			.subscribe((navStart: NavigationStart) => {
				let token = localStorage.getItem('token');
				if (token && (navStart.url == '/' || navStart.url == '/sessions/signin' || navStart.url == '/sessions')) { 
					this.router.navigate(['/dashboard/v4']);
					return false;
				}
			});
	}
}
