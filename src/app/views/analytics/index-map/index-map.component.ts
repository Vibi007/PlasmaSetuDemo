import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { MapViewComponent } from '../../../shared/components/map-view/map-view.component';
import { ActivatedRoute } from '@angular/router';
import { IndexMapService } from './services/index-map.service';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { element } from '@angular/core/src/render3';

@Component({
	selector: 'app-index-map',
	templateUrl: './index-map.component.html',
	styleUrls: ['./index-map.component.css'],
	animations: [SharedAnimations]
})
export class IndexMapComponent implements OnInit, AfterViewInit {
	@ViewChild(MapViewComponent) mapview: MapViewComponent;
	@ViewChild('toggleBtn') toggleBtn: ElementRef;
	@ViewChild('detailList') detailList: ElementRef;
	showDetail: boolean = false;
	isDetails: boolean = false;
	pincode: any;
	states: any = [];
	dealers: any = [];
	peopleLoading = false;
	index: string = 'customer';
	citiesList: any = [];
	tempCitiesList: any = [];
	oldZoom: number;
	lastCity: string;
	expandTxt = 'Visual Analytics';
	isExpand: boolean = false;
	activeCard: any = []
	lastIdx: number;
	cityCircle = []
	indexForm: FormGroup; //Form
	exchangeList: any = [];
	tierList: any = [];
	tempExchangeList: any = [];
	pinCode: number;
	list: any = [];
	tierType: string;
	topTier: any = [];
	ifbMarker: any = [];

	constructor(private route: ActivatedRoute,
		private fb: FormBuilder,
		private ngZone: NgZone,
		private indexService: IndexMapService) {
		this.indexForm = this.fb.group({
			'index': ['customer', Validators.required]
		});
	}

	ngOnInit(): void {
		this.route.data.subscribe(data => { console.log('data', data); this.list = this.citiesList = data.message[1]; this.exchangeList = data.message[0]; });
	}

	ngAfterViewInit() {
		this.mapview.mapInitializer();
		this.getCustomerPenetration(this.citiesList);
	}

	indexType(formData: FormData) {
		this.cityCircle.forEach(circle => {
			circle.setMap(null);
		});
		this.ifbMarker.forEach(ifbMarker => {
			ifbMarker.setMap(null);
		});
		this.ifbMarker = [];
		this.mapview.resetMap();
		this.lastIdx = null;
		this.activeCard = [];
		this.list = [];
		this.index = formData['index'];
		this.mapview.resetMap();
		this.showDetail = false;
		this.isDetails = false;
		if (formData['index'] != 'tier') {
			this.list = (formData['index'] == 'customer') ? this.citiesList : this.exchangeList;
			this.getCustomerPenetration(this.list);

		} else {
			this.indexService.getTierCities()
				.subscribe(data => {
					if (data) {
						this.tierList = this.list = data;
						this.tierType = 'Tier_2';
						this.getTierTypeData(this.tierType);
						setTimeout(() => {
							this.mapview.map.setZoom(5);
							this.mapZoomAction();
						}, 500);
					}
				});

			this.indexService.getTopTier()
				.subscribe(data => {
					if (data) {
						console.log('table data =====>', data)
						this.topTier = data;
						this.showDetail = true;
						this.isDetails = true;
					}
				})
		}
		if (window.innerWidth < 768) {
			setTimeout(() => {
				this.toggleBtn.nativeElement.click();
			}, 900);
		}
	}

	getCustomerPenetration(list) {
		if (list) {
			this.mapview.createMarker(null, list, null, false, (this.index == 'customer') ? true : false);
			setTimeout(() => {
				this.mapview.map.setZoom(5);
				this.mapZoomAction();
			}, 500);
		}
	}

	customSearchFn(term: string, item: any) {
		// console.log(term, item, parseInt(item.dealer_id) == parseInt(term), typeof parseInt(item.dealer_id), typeof parseInt(term))
		return item.City.toLowerCase().indexOf(term.toLowerCase()) > -1 || item.Dealer_Penetration.toString().indexOf(term) > -1 || item.Customer_penetration.toString().indexOf(term) > -1;
	}

	customeSearchExchangeFn(term: string, item: any) {
		return item.total.toString().indexOf(term) > -1 || item.WM.toString().indexOf(term) > -1
			|| item.PinCode.toString().indexOf(term) > -1 || item.City.toLowerCase().indexOf(term.toLowerCase()) > -1;
	}

	TierSearchFn(term: string, item: any) {
		return item.city1.toLowerCase().indexOf(term.toLowerCase()) > -1 || item.tier.toLowerCase().indexOf(term.toLowerCase()) > -1;
	}

	getCity(event) {
		if (event) {
			this.list = []
			this.list.push(event);
			this.listClicked(event, this.citiesList.findIndex(x => x.City.toLowerCase() == event.City.toLowerCase()));
		} else {
			let city = this.list[0];
			this.list = this.citiesList;
			this.listClicked(city, this.citiesList.findIndex(x => x.City.toLowerCase() == city.City.toLowerCase()))
		}
		if (window.innerWidth < 768) {
			setTimeout(() => {
				this.toggleBtn.nativeElement.click();
			}, 900);
		}
	}

	getExchangeData(event) {
		if (event) {
			this.list = []
			this.list.push(event);
			this.listClicked(event, this.exchangeList.findIndex(x => x.PinCode == event.PinCode));
		} else {
			let exchange = this.list[0];
			this.list = this.exchangeList;
			this.listClicked(exchange, this.exchangeList.findIndex(x => x.PinCode == exchange.PinCode))
		}
		if (window.innerWidth < 768) {
			setTimeout(() => {
				this.toggleBtn.nativeElement.click();
			}, 900);
		}
	}

	getTierData(event) {
		if (event) {
			this.list = []
			this.list.push(event);
			this.listClicked(event, this.tierList.findIndex(x => x.city1 == event.city1));
		} else {
			let tier = this.list[0];
			this.list = this.tierList;
			this.listClicked(tier, this.tierList.findIndex(x => x.city1 == tier.city1))
		}
		if (window.innerWidth < 768) {
			setTimeout(() => {
				this.toggleBtn.nativeElement.click();
			}, 900);
		}
	}

	getTierTypeData(event) {
		if (event) {
			this.list = this.tierList.filter(x => x.tier == event);
		} else {
			this.list = this.tierList;
		}
		this.mapview.resetMap();
		this.cityCircle.forEach(circle => {
			circle.setMap(null);
		})
		this.cityCircle = [];
		this.ifbMarker.forEach(ifbMarker => {
			ifbMarker.setMap(null);
		});
		this.ifbMarker = [];
		this.mapview.map.setZoom(5);
		this.createCircles(this.list);
	}

	listClicked(data, idx) {
		if (data) {
			this.cityCircle.forEach(circle => {
				circle.setMap(null);
			});
			this.cityCircle = [];
			this.ifbMarker.forEach(ifbMarker => {
				ifbMarker.setMap(null);
			});
			this.ifbMarker = [];
			if (idx != null && this.lastIdx == idx) {
				this.activeCard[this.lastIdx] = !this.activeCard[this.lastIdx];
				this.lastIdx = null;
				this.mapview.map.setZoom((this.index == "exchange") ? 10 : 7);
			} else if (idx != null) {
				this.activeCard[this.lastIdx] = false;
				this.activeCard[idx] = true;
				this.lastIdx = idx;
				this.mapview.map.setCenter(new google.maps.LatLng(data.lat, data.lng));
				this.mapview.map.setZoom((this.index == "exchange") ? 15 : 12);
			}
		}
		if ((this.lastIdx != null || this.activeCard[this.lastIdx]) && window.innerWidth < 768) {
			setTimeout(() => {
				this.toggleBtn.nativeElement.click();
			}, 900);
		}
	}


	mapZoomAction() {
		let city, marker, ibLabel, infoWindows = [], tempList: any = [];
		this.oldZoom = this.mapview.map.getZoom();
		google.maps.event.addListener(this.mapview.map, 'zoom_changed', () => {
			let data = Object.assign([], this.list);
			tempList = Object.assign([], data)
			let bounds = this.mapview.map.getBounds().getCenter(),
				newZoom = this.mapview.map.getZoom(),
				zoomDiff = newZoom - this.oldZoom;
			this.oldZoom = newZoom;
			let bound = bounds.lat().toFixed(3);
			city = tempList.sort((a, b) => Math.abs(parseFloat(bound) - a.lat) - Math.abs(parseFloat(bound) - b.lat))[0]
			console.log('city', city, parseFloat(bound), typeof parseFloat(bound), 'lastCity' + this.lastCity);
			console.log('newZoom', newZoom);
			if (zoomDiff < 0 && (newZoom == 7 && (this.index === 'customer' || this.index === 'tier'))) { //zoom out
				this.resetZoom(tempList);
			} else if (zoomDiff < 0 && newZoom == 10 && this.index === 'exchange') { //zoom out
				this.resetZoom(tempList);
			} else if (newZoom == 12 && this.index === 'customer') { //zoom in 
				this.setCustomerPenetration(city, newZoom);
			} else if (newZoom == 15 && this.index === 'exchange') {
				this.setExchangePotential(city, newZoom);
			} else if (newZoom == 12 && this.index === 'tier') { //zoom in 
				this.setTierPotential(city, newZoom);
			}

		});
	}

	setCustomerPenetration(city, newZoom) {
		setTimeout(() => {
			if (this.lastCity != city.City) {
				this.mapview.resetMap();
				this.cityCircle.forEach(circle => {
					circle.setMap(null);
				})
				this.cityCircle = [];
				this.lastCity = city.City;
				this.indexService.getCityDealerList(city.City).subscribe(data => {
					console.log('data==>', data);
					this.mapview.createMarker(null, data.dealers, null);
					if (this.cityCircle.length == 0) {
						data.customers.forEach((item, i) => {
							this.cityCircle.push(new google.maps.Circle({
								strokeColor: '#FF0000',
								strokeOpacity: 0.8,
								strokeWeight: 2,
								fillColor: '#FF0000',
								fillOpacity: 0.35,
								map: this.mapview.map,
								center: new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng)),
								radius: (Math.sqrt(item.Population) * newZoom)
							}));

							var marker = new google.maps.Marker({
								position: new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng)),
								map: this.mapview.map
							});
							marker.setVisible(false);
							let infoWindow = new google.maps.InfoWindow(), mapSelf = this.mapview;
							this.cityCircle[i].addListener('click', function (event) {
								let labelText = '<b><p>Customers Population:</b> ' + item.Population + '</p><hr><em>Pin Code :' + item.Pincode + '</em>';
								let myOptions1 = {
									content: labelText,
									maxwidth: 150,
									position: new google.maps.LatLng(item.lat, item.lng)
								};
								infoWindow.setOptions(myOptions1);
								infoWindow.open(mapSelf.map, this);
							});

							this.cityCircle[i].addListener('mouseout', function (event) {
								infoWindow.close();
							});
						});
					}
				})
			}
		}, 200);
	}


	setExchangePotential(city, newZoom) {
		this.mapview.resetMap();
		this.cityCircle.forEach(circle => {
			circle.setMap(null);
		})
		this.cityCircle = [];
		this.mapview.createMarker(null, [city], null);
		if (this.cityCircle.length == 0) {
			this.cityCircle.push(new google.maps.Circle({
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				map: this.mapview.map,
				center: new google.maps.LatLng(parseFloat(city.lat), parseFloat(city.lng)),
				radius: (Math.sqrt(city.total) * newZoom)
			}));
		}

	}

	setTierPotential(city, newZoom) {
		setTimeout(() => {
			if (this.lastCity != city.city1) {
				this.mapview.resetMap();
				this.cityCircle.forEach(circle => {
					circle.setMap(null);
				})
				this.cityCircle = [];
				this.lastCity = city.City;
				this.indexService.getTierCities(city.city1).subscribe(data => {
					console.log('setTierPotential==>', data);
					this.mapview.createMarker(null, data.Dealers, null);
					if (this.cityCircle.length == 0) {
						data.Customers.forEach((item, i) => {
							this.cityCircle.push(new google.maps.Circle({
								strokeColor: '#FF0000',
								strokeOpacity: 0.8,
								strokeWeight: 2,
								fillColor: '#FF0000',
								fillOpacity: 0.35,
								map: this.mapview.map,
								center: new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng)),
								radius: (Math.sqrt(item.population) * newZoom)
							}));

							var marker = new google.maps.Marker({
								position: new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng)),
								map: this.mapview.map
							});

							marker.setVisible(false);
							let infoWindow = new google.maps.InfoWindow(), mapSelf = this.mapview;
							this.cityCircle[i].addListener('click', function (event) {
								let labelText = '<b><p>Customers Population:</b> ' + item.population + '</p><hr style="margin-top: 0px;margin-bottom: 0px"><p> Nearest Dealer :<br/><b>' + item.Dealer + ' - ' + item.Dealer_pin + '</b><br/>(' + item.Distance + ' KM)  <p><hr style="margin-top: 0px;margin-bottom: 0px"><em>Pin Code :' + item.PinCode + ', Tier : ' + item.tier + '</em>';
								let myOptions1 = {
									content: labelText,
									maxwidth: 150,
									position: new google.maps.LatLng(item.lat, item.lng)
								};
								infoWindow.setOptions(myOptions1);
								infoWindow.open(mapSelf.map, this);
							});

							this.cityCircle[i].addListener('mouseout', function (event) {
								infoWindow.close();
							});
						});
					}
				})
			}
		}, 200);

	}

	resetZoom(tempList) {
		this.cityCircle.forEach(circle => {
			circle.setMap(null);
		});
		this.cityCircle = [];
		this.ifbMarker.forEach(ifbMarker => {
			ifbMarker.setMap(null);
		});
		this.ifbMarker = [];
		this.mapview.resetMap();
		this.lastCity = null;
		this.listClicked(tempList, this.lastIdx);
		if (this.index != 'tier') {
			this.mapview.createMarker(null, tempList, null, false, (this.index == 'customer') ? true : false);
		} else {
			this.createCircles(tempList);
		}
	}

	createCircles(latLngObj: any, radFactor: number = 500) {
		latLngObj.forEach((item, i) => {
			this.cityCircle.push(new google.maps.Circle({
				strokeColor: '#33BD65',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#507A1F',
				fillOpacity: 0.35,
				map: this.mapview.map,
				center: new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng)),
				radius: (Math.sqrt(item.Population) * radFactor)
			}));

			let marker = new google.maps.Marker({
				position: new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng)),
				map: this.mapview.map
			}), mapSelf = this.mapview, self=this;

			if (item.ifb_point == 'N') {
				let marker2 = new google.maps.Marker({
					icon: {
						url: 'assets/images/pins/cross_black.png',
						scaledSize: new google.maps.Size(10, 10)
					},
					position: new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng)),
					animation: google.maps.Animation.DROP,
					map: this.mapview.map,
				});
				marker2.setMap(this.mapview.map);
				this.ifbMarker.push(marker2);
			}

			marker.setVisible(false);
			let infoWindow = new google.maps.InfoWindow(),
				labelText = '<h6>' + item.city1 + '</h6><hr style=" margin: 5px !important;"><hr style=" margin: 5px !important;"><em> Tier Type : ' + item.tier + '</em>',
				myOptions1 = {
					content: labelText,
					maxwidth: 150,
					position: new google.maps.LatLng(item.lat, item.lng)
				};
			this.cityCircle[i].addListener('mouseover', function (event) {
				infoWindow.setOptions(myOptions1);
				infoWindow.open(mapSelf.map, this);
			});
			this.cityCircle[i].addListener('mouseout', function (event) {
				infoWindow.close();
			});
			this.cityCircle[i].addListener('click', function (event) {
				infoWindow.close();
				infoWindow.setOptions(myOptions1);
				infoWindow.open(mapSelf.map, this);
				self.listClicked(item, i)
			});
		});
	}


	expandClick() {
		// this.expandTxt = (this.isExpand) ? 'Expand to find the penetration ratio' : 'Collapse to view the full map';
		this.isExpand = !this.isExpand;
	}

	checkIndex() {
		return (this.index == 'customer') ? true : false;
	}

	expandDetails() {
		this.showDetail = !this.showDetail;
		this.isDetails = !this.isDetails;
		this.mobileScroll(document.body.scrollHeight + 5)
	}

	mobileScroll(yaxis: number) {
		this.ngZone.run(() => {
			if (this.showDetail && window.innerWidth < 768) {
				window.scroll(0, yaxis);
			}
		});
	}

}
