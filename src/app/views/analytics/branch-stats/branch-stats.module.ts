import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { branchStatsRouter } from './branch-stats.router';
import { SharedComponentsModule } from '../../../shared/components/shared-components.module';
import { BranchStatsComponent } from './branch-stats.component';
import { BranchStatsService } from './services/branch-stats.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';

import { BranchResolver } from './resolver/branch-resolver.service';

@NgModule({
	declarations: [
		BranchStatsComponent
	],
	imports: [
		branchStatsRouter,
		CommonModule,
		FormsModule,
		NgSelectModule,
		ReactiveFormsModule,
		SharedComponentsModule,
		SharedPipesModule
	],
	providers: [BranchResolver,BranchStatsService]
})

export class BranchStatsModule { }
