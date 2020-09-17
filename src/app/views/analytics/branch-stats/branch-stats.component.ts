import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapViewComponent } from '../../../shared/components/map-view/map-view.component';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { BranchStatsService } from './services/branch-stats.service';

@Component({
	selector: 'app-branch-stats',
	templateUrl: './branch-stats.component.html',
	styleUrls: ['./branch-stats.component.scss'],
	animations: [SharedAnimations]
})
export class BranchStatsComponent implements OnInit, AfterViewInit {
	@ViewChild(MapViewComponent) mapview: MapViewComponent;
	@ViewChild('toggleBtn') toggleBtn: ElementRef;
	@ViewChild('detailList') detailList: ElementRef;
	showDetail: boolean = false;
	isDetails: boolean = false;
	branch: any = []
	branchDetails: any = [];
	tempDetails: any = [];
	activeCard: any = [];
	lastIdx: number;
	oldZoom;
	lastBranch;
	expandTxt = 'Visual Analytics';
	isExpand: boolean = false;
	constructor(private route: ActivatedRoute,
		private ngZone: NgZone,
		private branchstatsservice: BranchStatsService) { }

	ngOnInit() {
		this.route.data.subscribe(data => { console.log('data', data); this.tempDetails = this.branchDetails = data.message; });
	}

	ngAfterViewInit() {
		this.mapview.mapInitializer();
		this.mapDrawBranches(this.branchDetails);
		this.mapZoomAction();
	}

	listClicked(data, idx) {
		console.log('listClicked data', data);
		if (data) {
			this.branch = null;
			this.mapview.markerClicked.next([]);
			if (idx != null && this.lastIdx == idx) {
				this.activeCard[this.lastIdx] = !this.activeCard[this.lastIdx];
				this.lastIdx = null;
				this.showDetail = false;
				this.mapview.map.setZoom(5);
			} else if (idx != null) {
				this.activeCard[this.lastIdx] = false;
				this.activeCard[idx] = true;
				this.lastIdx = idx;
				this.showDetail = true;
				this.branch = data;
				this.mapview.map.setCenter(new google.maps.LatLng(data.lat, data.lng));
				this.mapview.resetMap();
				this.getBranchFranchise(data);
			} else {
				this.activeCard[this.lastIdx] = false;
			}
			if ((this.lastIdx != null || this.activeCard[this.lastIdx]) && window.innerWidth < 768) {
				setTimeout(() => {
					this.toggleBtn.nativeElement.click();			
				}, 900);
			}
		}
	}

	mapDrawBranches(list) {
		this.mapview.markerClicked.subscribe(
			data => {
				if (data['Details']) {
					console.log('data markerClicked', data);
					this.branch = data;
					this.showDetail = true;
					setTimeout(() => {
						this.mobileScroll(400);
					}, 1000);
				}
			});

		this.mapview.createMarker(null, list, null, false);
		setTimeout(() => {
			this.mapview.map.setZoom(4);
		}, 500);
	}

	getCity(event) {
		if (event) {
			this.showDetail = true;
			this.branchDetails = []
			this.branchDetails.push(event);
			this.listClicked(event, this.tempDetails.findIndex(x => x.Branch.toLowerCase() == event.Branch.toLowerCase()));
		} else {
			let branch = this.branchDetails[0];
			this.branchDetails = this.tempDetails;
			this.listClicked(branch, this.tempDetails.findIndex(x => x.Branch.toLowerCase() == branch.Branch.toLowerCase()))
		}

	}

	customSearchFn(term: string, item: any) {
		return item.Branch.toLowerCase().indexOf(term.toLowerCase()) > -1 || item.BrCode.toString().indexOf(term) > -1;
	}

	mapZoomAction() {
		let branch, marker, ibLabel, infoWindows = [], tempList: any = [];
		this.oldZoom = this.mapview.map.getZoom();
		google.maps.event.addListener(this.mapview.map, 'zoom_changed', () => {
			let data = Object.assign([], this.branchDetails); tempList = Object.assign([], data)
			let bounds = this.mapview.map.getBounds().getCenter(),
				newZoom = this.mapview.map.getZoom(),
				zoomDiff = newZoom - this.oldZoom;
			this.oldZoom = newZoom;
			let bound = bounds.lat().toFixed(3);
			branch = tempList.sort((a, b) => Math.abs(parseFloat(bound) - a.lat) - Math.abs(parseFloat(bound) - b.lat))[0]
			console.log('city', branch, parseFloat(bound), typeof parseFloat(bound), 'lastCity' + this.lastBranch);
			console.log('newZoom', newZoom);
			if (zoomDiff < 0 && newZoom == 5) { //zoom out
				this.resetZoom(tempList);
			} else if (zoomDiff > 0 && newZoom == 12) { //zoom in
				if (this.lastBranch != branch.Branch) {
					this.mapview.resetMap();
					this.getBranchFranchise(branch);
				}
			}
		});
	}

	resetZoom(tempList) {
		this.lastBranch = null;
		this.branch = null;
		this.showDetail = false;
		this.mapview.resetMap();
		this.listClicked(tempList, this.lastIdx);
		this.mapview.createMarker(null, tempList, null, false);
	}

	getBranchFranchise(branch: any) {
		this.lastBranch = branch.Branch;
		this.branch = branch;
		this.showDetail = true;
		this.activeCard[this.lastIdx] = true;
		this.branchstatsservice.getBranchFranchise(branch.BrCode)
			.subscribe(
				data => {
					console.log('branch data', data);
					this.mapview.createMarker(null, data, null, false);
					this.mapview.map.setZoom(9);
					setTimeout(() => {
						this.mobileScroll(400);
					}, 1800);
				});
	}

	expandClick() {
		this.isExpand = !this.isExpand;
	}
	expandDetails() {
		this.showDetail = !this.showDetail;
		this.isDetails = !this.isDetails;
		this.mobileScroll(document.body.scrollHeight + 5)
	}

	mobileScroll(yaxis:number){
		this.ngZone.run(() => {
			if (this.showDetail && window.innerWidth < 768) {
				window.scroll(0, yaxis);
			}
		});
	}
}
