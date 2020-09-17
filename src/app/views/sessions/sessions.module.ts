import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
// import { SignInService } from './signin/services/signin.service';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedComponentsModule,
		SessionsRoutingModule,
		FormWizardModule,
		NgSelectModule
	],
	declarations: [
		SignupComponent,
		SigninComponent,
		ForgotComponent
	],
	providers: [
		// SignInService
	]
})
export class SessionsModule { }
