import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataListComponent } from './data-list/data-list.component';

@Component({
	selector: 'app-data-process',
	templateUrl: './data-process.component.html',
	styleUrls: ['./data-process.component.scss']
})
export class DataProcessComponent implements OnInit {
	formBasic: FormGroup;
	loading: boolean;
	showForm: boolean=true;
	list:any=[
		{
			id:1,
			name: 'Ayush'
		},
		{
			id:2,
			name: 'Vandan'
		},
		{
			id:3,
			name: 'Vaibhav'
		}
	]
	constructor(
		private fb: FormBuilder,
		private toastr: ToastrService) { }

	ngOnInit() {
		this.buildFormBasic();
	}

	buildFormBasic() {
		this.formBasic = this.fb.group({
			experience: []
		});
	}

	submit() {
		this.loading = true;
		setTimeout(() => {
			this.loading = false;
			this.showForm = false;
			this.toastr.success('Profile updated.', 'Success!', { progressBar: true });
		}, 3000);
	}


}
