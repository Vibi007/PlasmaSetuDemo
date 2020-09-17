import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndexMapComponent } from './index-map.component';
import { IndexMapRouter } from './index-map.router';
import { SharedComponentsModule } from '../../../shared/components/shared-components.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { IndexResolver } from './resolver/index-resolver.service';
import { IndexMapService} from './services/index-map.service';

@NgModule({
	declarations: [IndexMapComponent],
	imports: [
		IndexMapRouter,
		CommonModule,
		SharedComponentsModule,
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [IndexMapService, IndexResolver]
})

export class IndexMapModule { }
