import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilterService } from './services/filter.service';

@Component({
	selector: 'app-filter-search',
	templateUrl: './filter-search.component.html',
	styleUrls: ['./filter-search.component.css']
})
export class FilterSearchComponent implements OnInit {
	filterForm: FormGroup;
	pincode: any;
	states: any = [];
	dealers: any = [];
	peopleLoading = false;

	constructor(public modal: NgbActiveModal,
		private filterservice: FilterService,
		private formBuilder: FormBuilder) {
		this.filterForm = this.formBuilder.group({
			state: [null, Validators.required],
			dealer: [null, Validators.required]
		});
	}

	ngOnInit(): void { this.getStatesList() }


	customSearchFn(term: string, item: any) {
		term = term.toLowerCase();
		return item.toLowerCase().indexOf(term) > -1;
	}

	dealerSearchFn(term: string, item: any) {
		return item.dealer_name.toLowerCase().indexOf(term.toLowerCase()) > -1 || item.dealer_id.toString().indexOf(term) > -1 || item.pinCode.toString().indexOf(term) > -1;
	}

	closeModal(sendData) {
		this.modal.close(sendData);
	}

	onSubmit(formData: FormData) {
		console.log("Form was submitted!", formData);
		this.modal.close(formData);
	}

	getStatesList() {
		this.filterservice.getStates()
			.subscribe(data => {
				if (data.States.length > 0) {
					console.log('getStates', data);
					this.states = data.States;
				}
			},
				error => {
					console.log(error)
				})
	}

	getDealersList(event) {
		if (event) {
			this.filterservice.getDealers(event.trim())
				.subscribe(data => {
					console.log('getDealers', data);
					if (data.length > 0) {
						this.dealers = data;
					}
				},
					error => {
						console.log(error)
					})
		} else {
			this.dealers = [];
			this.filterForm.controls['dealer'].setValue(null);
		}
	}

}
