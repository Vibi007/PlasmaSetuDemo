import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterSearchComponent } from './filter-search.component';
import { FilterService } from './services/filter.service';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
	declarations: [
		FilterSearchComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule
	],
	exports: [ FilterSearchComponent ],
	providers:[FilterService]
})

export class FilterModule { }
