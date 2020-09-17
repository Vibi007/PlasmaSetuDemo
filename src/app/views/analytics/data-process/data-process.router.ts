import { Routes, RouterModule } from '@angular/router';
import { DataProcessComponent } from "./data-process.component";

const DATAPROCESS_ROUTER: Routes = [
    { 
        path: '',
        component: DataProcessComponent
    }
];

export const DataProcessRouter = RouterModule.forChild(DATAPROCESS_ROUTER);

