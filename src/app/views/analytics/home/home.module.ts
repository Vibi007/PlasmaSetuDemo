import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { homeRouter } from './home.router';
import { MapService } from "./services/map.service";
import { SharedComponentsModule } from '../../../shared/components/shared-components.module';
import { HomeComponent } from './home.component';
// import { FilterSearchComponent } from '../../modals/filter-search/filter-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [
		HomeComponent,
		// FilterSearchComponent
	],
	imports: [
		homeRouter,
		CommonModule,
		FormsModule,
		NgSelectModule,
		ReactiveFormsModule,
		SharedComponentsModule
	],
	providers: [MapService, NgbActiveModal]
})

export class HomeModule { }
