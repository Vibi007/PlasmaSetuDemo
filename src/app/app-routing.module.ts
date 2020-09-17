import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGaurd } from './shared/services/auth.guard';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard/v4',
		pathMatch: 'full'
	},
	{
		path: '',
		component: AuthLayoutComponent,
		children: [
			{
				path: 'sessions',
				loadChildren: './views/sessions/sessions.module#SessionsModule'
			}
		]
	},
	{
		path: '',
		component: BlankLayoutComponent,
		children: [
			{
				path: 'others',
				loadChildren: './views/others/others.module#OthersModule'
			}
		]
	},
	{
		path: '',
		component: AdminLayoutComponent,
		canActivate: [AuthGaurd],
		children: [
			{
				path: 'dashboard',
				loadChildren: './views/dashboard/dashboard.module#DashboardModule'
			},
			{
				path: 'uikits',
				loadChildren: './views/ui-kits/ui-kits.module#UiKitsModule'
			},
			{
				path: 'forms',
				loadChildren: './views/forms/forms.module#AppFormsModule'
			},
			{
				path: 'invoice',
				loadChildren: './views/invoice/invoice.module#InvoiceModule'
			},
			{
				path: 'inbox',
				loadChildren: './views/inbox/inbox.module#InboxModule'
			},
			{
				path: 'calendar',
				loadChildren: './views/calendar/calendar.module#CalendarAppModule'
			},
			{
				path: 'chat',
				loadChildren: './views/chat/chat.module#ChatModule'
			},
			{
				path: 'tables',
				loadChildren: './views/data-tables/data-tables.module#DataTablesModule'
			},/*  {
				path: 'home',
				loadChildren: './views/analytics/home/home.module#HomeModule'
			}, {
				path: 'index-map',
				loadChildren: './views/analytics/index-map/index-map.module#IndexMapModule'
			} , {
				path: 'branch-map',
				loadChildren: './views/analytics/branch-stats/branch-stats.module#BranchStatsModule'
			},  {
				path: 'data-process',
				loadChildren: './views/analytics/data-process/data-process.module#DataProcessModule'
			},*/
			{
				path: 'pages',
				loadChildren: './views/pages/pages.module#PagesModule'
			}
		]
	},
	{
		path: '**',
		redirectTo: 'others/404'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
