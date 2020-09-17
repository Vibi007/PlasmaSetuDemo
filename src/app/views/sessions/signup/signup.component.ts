import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
	animations: [SharedAnimations]
})
export class SignupComponent implements OnInit {
	isCompleted: boolean;
	data: any = {
		email: ''
	};
	step2Form: FormGroup;
	basicForm: FormGroup;

	constructor(private fb: FormBuilder) { }

	ngOnInit() {
		this.basicForm = this.fb.group({
			experience: ['', Validators.required]
		});
		this.step2Form = this.fb.group({
			blood_group: [''],
			covid_report: [''],
			discharge_report: [''],
			donated_plasma: [''],
			times_donated: [''],
			donated_date: [''],
			diseases: [''],
			asymptomatic: [''],
			covid_report_file: [''],
			discharge_report_file: [''],
			terms:[''],
			volunteer_type:[''],
			id_file:['', Validators.required],
			patient_condition:['']
		});

	}
	onStep1Next(e) {
		console.log(e)
		this.data.user_type=e.experience;
	}
	onStep2Next(e) { }
	onStep3Next(e) { }
	onComplete(e) { }
}
