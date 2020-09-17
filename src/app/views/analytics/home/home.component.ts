import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { MapService } from './services/map.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { FilterSearchComponent } from '../../modals/filter-search/filter-search.component';
import { MapViewComponent } from '../../../shared/components/map-view/map-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit {
	srcLoc: google.maps.LatLng;
	polyArray = [];
	closeResult: string;
	pincode;
	searchDealer: any = [];
	activeCard: any = [];
	lastIdx: any;
	@ViewChild('toggleBtn') toggleBtn: ElementRef;
	@ViewChild(MapViewComponent) mapview: MapViewComponent;
	isExpand: boolean = false;
	expandTxt = 'Expand to find the closest warehouse list';
	warehouses: any = [];
	state;
	filterForm: FormGroup;
	states: any = [];
	dealers: any = [];
	peopleLoading = false;
	constructor(private mapService: MapService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public modal: NgbActiveModal,
		private modalService: NgbModal,	
		private formBuilder: FormBuilder) {
		this.filterForm = this.formBuilder.group({
			state: [null, Validators.required],
			dealer: [null, Validators.required]
		});

	}

	ngOnInit() { this.getStatesList() }

		ngAfterViewInit() {
		this.mapview.mapInitializer();
	}

	openFilterModal(content) {
		const ref = this.modalService.open(content, { centered: true });
		// ref.componentInstance.pincode = this.pincode;

		ref.result.then((result) => {
			if (result) {
				console.log("Yes Click", result);
				this.pincode = result.dealer.pinCode;
				this.searchDealer = result.dealer;
				this.searchDealer.state = result.state;
				this.searchPinLatLng(this.pincode, true);
			}
		},
			(cancel) => {
				console.log("Cancel Click");

			})
	}

	searchPinLatLng(pincode, isFiltered = false) {
		console.log(pincode, this.pincode);
		if (pincode) {
			this.mapview.resetMap();
			if (!isFiltered) { this.searchDealer = []; }
			this.mapService.getPinCodelatlng(pincode).subscribe(
				data => {
					console.log(data);
					this.mapview.marker.setIcon('assets/images/pins/green-dot.png');
					let content: string;
					if (this.searchDealer.dealer_name) {
						content = '<h6>' + this.searchDealer.dealer_name.toString() + '</h6>' + '<p>Address : ' + this.searchDealer.state + '</p><hr><em>Pin Code : ' + this.searchDealer.pinCode + '</em>';
					} else {
						content = '<h6>Searched Pin Code</h6><hr><em>Pin Code : ' + pincode.toString() + '</em>';
					}
					this.mapview.setMarker(new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lng)), content)
					this.mapview.map.setCenter(new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lng)));

					this.srcLoc = new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lng));
					this.searchWareHouse(pincode);
					if (window.innerWidth < 768) {
						setTimeout(() => {
							this.toggleBtn.nativeElement.click();
						}, 900);
					}
				},
				error => {
					console.log(error);
					this.srcLoc = null;
					this.warehouses = null;
					this.mapview.marker.setMap(null);
					this.mapview.resetMap();
					// this._flashMessagesService.show('No Record Found.', { cssClass: 'alert-danger', timeout: 4000 });
					if (window.innerWidth < 768) {
						setTimeout(() => {
							this.toggleBtn.nativeElement.click();
						}, 900);
					}

				}
			);
		}
	}

	searchWareHouse(pin) {
		this.mapService.getMinlatlng(pin).subscribe(
			data => {
				this.warehouses = data;
				this.mapview.createMarker(this.srcLoc, data, (this.searchDealer.dealer_name) ? this.searchDealer.dealer_name : 'Searched Pin Code', true);
			},
			error => {
				console.log(error);
			}
		)
	}

	focusMap(item, idx) {
		let marker, latlng, event;
		latlng = new google.maps.LatLng(item.lat, item.lng);
		marker = this.mapview.markersArray[idx];
		google.maps.event.trigger(this.mapview.markersArray[this.lastIdx], 'mouseout');
		if (this.lastIdx == 'src') { google.maps.event.trigger(this.mapview.marker, 'mouseout'); }

		if (idx != null && this.lastIdx == idx) {
			this.activeCard[this.lastIdx] = !this.activeCard[this.lastIdx];
			this.lastIdx = idx;
		} else if (idx != null) {
			this.activeCard[this.lastIdx] = false;
			this.activeCard[idx] = true;
			this.lastIdx = idx;

		} else if (idx == null) {
			latlng = item;
			marker = this.mapview.marker;
			(this.lastIdx != 'src') ? this.activeCard[this.lastIdx] = false : '';
			this.activeCard['src'] = !this.activeCard['src'];
			this.lastIdx = 'src';
		}
		event = (this.activeCard[this.lastIdx]) ? 'mouseover' : 'mouseout';
		this.mapview.map.setCenter(latlng);
		google.maps.event.trigger(marker, event);

		if (window.innerWidth < 768) {
			setTimeout(() => {
				this.toggleBtn.nativeElement.click();
			}, 900);
		}
	}

	expandClick() {
		this.expandTxt = (this.isExpand) ? 'Expand to find the closest warehouse list' : 'Collapse to view the full map';
		this.isExpand = !this.isExpand;
	}

	numOnly(event: any) {
		const pattern = /[0-9\+\-\ ]/;
		const inputChar = String.fromCharCode(event.charCode);
		if (!pattern.test(inputChar) && event.charCode != '0') {
			event.preventDefault();
		}
	}


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
		this.mapService.getStates()
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
			this.mapService.getDealers(event.trim())
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
