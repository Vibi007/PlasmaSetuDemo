import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd, RouterEvent, RouterPreloader } from '@angular/router';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { RouterConfigLoader } from '@angular/router/src/router_config_loader';

@Component({
	selector: 'app-admin-layout',
	templateUrl: './admin-layout.component.html',
	styleUrls: ['./admin-layout.component.scss'],
	animations: [SharedAnimations]
})
export class AdminLayoutComponent implements OnInit {
	moduleLoading: boolean;
	isPadding: boolean = true;
	@ViewChild(PerfectScrollbarDirective) perfectScrollbar: PerfectScrollbarDirective;

	constructor(
		public navService: NavigationService,
		public searchService: SearchService,
		private router: Router
	) {
		this.router.events.subscribe(event => {
			this.isPadding = (event['url'] != '/dashboard/v4') ? false : true;
			if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
				this.moduleLoading = true;
			}
			if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
				this.moduleLoading = false;
			}
		});
	}

	ngOnInit() { }

}
