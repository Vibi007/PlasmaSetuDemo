import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';

import { DataProcessComponent } from './data-process.component';
import { DataProcessRouter } from './data-process.router';
import { SharedComponentsModule } from '../../../shared/components/shared-components.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataListComponent } from './data-list/data-list.component';

@NgModule({
	declarations: [
		DataProcessComponent,
		DataListComponent
	],
	imports: [
		DataProcessRouter,
		CommonModule,
		SharedComponentsModule,
		FormsModule,
		NgSelectModule,
		ReactiveFormsModule,
		NgxDatatableModule,
		NgxPaginationModule
	],
	providers: [DataProcessComponent]
})

export class DataProcessModule { }
