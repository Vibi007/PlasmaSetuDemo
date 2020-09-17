import { Routes, RouterModule } from '@angular/router';
import { BranchStatsComponent } from "./branch-stats.component";
import { BranchResolver } from './resolver/branch-resolver.service';

const BRANCH_ROUTER: Routes = [
    { 
        path: '',
        component: BranchStatsComponent,
        resolve: { message: BranchResolver },
        data: {depth: 2}
    }
];

export const branchStatsRouter = RouterModule.forChild(BRANCH_ROUTER );

