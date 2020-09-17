import { Routes, RouterModule } from '@angular/router';
import { IndexMapComponent } from "./index-map.component";
import { IndexResolver } from './resolver/index-resolver.service';

const INDEXMAP_ROUTER: Routes = [
    { 
        path: '',
        component: IndexMapComponent,
        resolve: { message: IndexResolver },
        data: {depth: 2}
    }
];

export const IndexMapRouter = RouterModule.forChild(INDEXMAP_ROUTER );

