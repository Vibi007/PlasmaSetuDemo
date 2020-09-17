import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAP_STYLES } from '../../constants/constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
	selector: 'app-map-view',
	templateUrl: './map-view.component.html',
	styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
	@ViewChild('mapContainer') gmap: ElementRef;
	map: google.maps.Map;
	styles: any = MAP_STYLES;
	marker = new google.maps.Marker({
		map: this.map,
		animation: google.maps.Animation.DROP
	});
	colorCode = ['#1377bf', '#561992', '#008000', '#365605']
	currentLoc: google.maps.LatLng;
	infoWindow = new google.maps.InfoWindow({ maxWidth: 200 });
	markersArray: any = [];
	polyArray: any = [];
	markersArray2: any = [];
	cityCircle: any = [];
	markerClicked: BehaviorSubject<any[]> = new BehaviorSubject([]);

	constructor() { }

	ngAfterViewInit(): void { }

	ngOnDestroy() {
		this.map.unbindAll()
		this.resetMap();
	}

	mapInitializer(latlngObj: any = [], routeSrc: string = '', setPath: boolean = false) {
		let mapProp = {
			center: new google.maps.LatLng(12.971599, 77.594566),
			zoom: 15,
			scaleControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: this.styles,
			options: {
				gestureHandling: 'greedy'
			}
		};
		this.map = new google.maps.Map(this.gmap.nativeElement, mapProp);
		this.setMarker(new google.maps.LatLng(12.971599, 77.594566), 'Default location');
		if ('geolocation' in navigator && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.currentLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				this.setMarker(this.currentLoc, 'Current Location');
				this.createMarker(this.currentLoc, latlngObj, routeSrc, setPath);
			});
		}
	}

	createMarker(srcLatLng: google.maps.LatLng, latlngObj: any = [], routeSrc: string, setPath: boolean = false, isPen: boolean = false) {
		// let pincode = this.pincode;
		latlngObj.forEach(async (elem, i) => {
			if ((elem.lat != 0 && elem.lng != 0) && (elem.lat && elem.lng) && (!Number.isNaN(elem.lat) && !Number.isNaN(elem.lng))) {
				console.log((elem.lat && elem.lng) && (!Number.isNaN(elem.lat) && !Number.isNaN(elem.lng)))

				let bounds = new google.maps.LatLngBounds(new google.maps.LatLng(elem.lat, elem.lng));
				let position = new google.maps.LatLng(elem.lat, elem.lng);
				let position2 = new google.maps.LatLng((elem.lat + (i * 0.00009)), (elem.lng + (i * 0.00009)));
				bounds.extend(position);
				/* '</h6><hr><p>Address : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id urna eu sem fringilla ultrices.</p><hr><em>Pin Code : ' + item.pinCode + '</em>' */
				let marker = new google.maps.Marker({
					position: position,
					animation: google.maps.Animation.DROP,
					map: this.map,
					title: (elem.plant) ? elem.plant.toString() : ''
				});
				let mapSelf = this, content, dealerType;

				if (typeof elem.Franchise != 'undefined') {
					marker.setIcon({ url: 'assets/images/pins/' + elem.color + '_home.png', scaledSize: new google.maps.Size(35, 35) });
				} else if (elem.IFB_point && (elem.IFB_point.toLowerCase() == 'X'.toLowerCase()) || elem.color == 'green') {
					marker.setIcon({ url: 'assets/images/pins/green.png' });
					dealerType = 'IFB Point';
				} else if (elem.IFB_point == '' || elem.color == 'red') {
					marker.setIcon({ url: 'assets/images/pins/red.png' });
					dealerType = 'Dealer';
				}

				/*if(elem.IFB_point == 'X' || elem.IFB_point == ''){
					this.cityCircle.push(new google.maps.Circle({
						strokeColor: '#00008B',
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: '0x220000FF',
						fillOpacity: 0,
						map: mapSelf.map,
						center: position,
						radius: (2 * 1000)
					}));
				} */

				if (elem.total) {
					content = '<h6 style="font-size:12px;"> TOTAL - ' + elem.total + '</h6><p><hr style=" margin: 5px !important;">'
						+ '  <b><span style="font-size:11px;">WM - </b>' + elem.WM
						+ ', </span><b><span style="font-size:11px;">MW - </b>' + elem.MW
						+ ', </span><b><span style="font-size:11px;">AC - </b>' + elem.AC
						+ ', </span><b><span style="font-size:11px;">DW - </b>' + elem.DW
						+ ', </span><b><span style="font-size:11px;">KA - </b>' + elem.KA
						+ ', </span><b><span style="font-size:11px;">IND - </b>' + elem.IND
						+ '</span></p><hr style=" margin: 5px !important;"><em>Pin Code : ' + elem.PinCode + ' </em>';
					marker.setIcon({
						url: 'assets/images/pins/red_bank.png',
						scaledSize: new google.maps.Size(50, 50), // scaled size 
					});

				} else if (typeof elem.City != 'undefined') {
					content = '<h6 style="font-size:12px;">' + elem.City + ' - <b><span style="color:' + elem.dealer_color + '">Dealers Penetration:</span> </b>' + parseFloat(elem.Dealer_Penetration).toFixed(3) + '*</h6><hr style=" margin: 5px !important;"><b><p><span style="font-size:11px;color:' + elem.dealer_color + '">Average National Dealers: </span>' + elem.dealer_avg + '*</p><hr style=" margin: 5px !important;"><em><span style="font-size:10px">*Index in respect of per lacs of population</span></em>';
				} else if (typeof elem.city1 != 'undefined') {
					content = '<h6>' + elem.city1 + '</h6><hr style=" margin: 5px !important;"><hr style=" margin: 5px !important;"><em> Tier Type : ' + elem.tier + '</em>';
					let iconUrl: string = 'assets/images/pins/';
					iconUrl = iconUrl + ((elem.tier == 'Tier_2') ? 'city_green.png' : ((elem.tier == 'Tier_3') ? 'city_blue.png' : 'city_purple.png'));
					marker.setIcon({
						url: iconUrl,
						scaledSize: new google.maps.Size(40, 40), // scaled size 
					});
				} else if (typeof elem.Dealer != 'undefined' || typeof elem.dealer != 'undefined') {
					content = '<h6>' + elem.Dealer + '</h6><hr style=" margin: 5px !important;"><b><p>Pin Code : </b>' + elem.dealer_pin + '</p><hr style=" margin: 5px !important;"><em>' + dealerType + '</em>';
				} else if (typeof elem.Branch != 'undefined') {
					content = '<h6>' + elem.Branch + '</h6><hr style=" margin: 5px !important;"><b><p>Branch Code : </b>' + elem.BrCode + '</p><hr style=" margin: 5px !important;"><em>IFB Branch </em>';
				} else if (typeof elem.Franchise != 'undefined') {
					content = '<h6>' + elem.Franchise + '</h6><hr style=" margin: 5px !important;"><b><p>Franchise Code : </b>' + elem.FrCode + '</p><hr style=" margin: 5px !important;"><em>IFB Franchise </em>';
				} else {
					content = '<h6>' + elem.plant + '</h6><hr style=" margin: 5px !important;"><em>Pin Code : ' + elem.pinCode + '</em>'
				}

				if (elem.dealer_color) {
					marker.setIcon({
						url: 'assets/images/pins/' + elem.dealer_color + '_dealer.png',
						scaledSize: new google.maps.Size(35, 35), // scaled size
						origin: new google.maps.Point(0, 0), // origin
						anchor: new google.maps.Point(0, 54)
					});
				}

				marker.addListener('click', function (event) { mapSelf.mapInfoWindow('set', content, this); });
				marker.addListener('mouseover', function (event) { mapSelf.mapInfoWindow('set', content, this); });
				marker.addListener('mouseout', function (event) { mapSelf.mapInfoWindow('', '', '', null) });
				marker.addListener('click', function (event) { mapSelf.markerClicked.next(elem); });

				marker.setMap(this.map);
				this.markersArray.push(marker);

				if (isPen) {
					let marker2 = new google.maps.Marker({
						position: position2,
						animation: google.maps.Animation.DROP,
						map: this.map,
						title: (elem.plant) ? elem.plant.toString() : '',

					});
					if (elem.cust_color) {
						let url: string = 'assets/images/pins/' + elem.cust_color + '_home.png';
						marker2.setIcon({
							url: url,
							scaledSize: new google.maps.Size(35, 35), // scaled size
						})
					}

					let content2: string;
					if (typeof elem.City != 'undefined') {
						content2 = '<h6 style="font-size:12px;">' + elem.City + ' - <b><span style="color:' + elem.cust_color + '">Customers Penetration:</span> </b>' + parseFloat(elem.Customer_penetration).toFixed(3) + '*</h6><hr style=" margin: 5px !important;"><b><p><span style="font-size:11px;color:' + elem.cust_color + '">Avg National Customers: </span>' + elem.cust_avg + '*</p><hr style=" margin: 5px !important;"><em><span style="font-size:10px">*Index in respect of per lacs of population</span></em>';
					}

					marker2.addListener('click', function (event) { mapSelf.mapInfoWindow('set', content2, this); });
					marker2.addListener('mouseover', function (event) { mapSelf.mapInfoWindow('set', content2, this); });
					marker2.addListener('mouseout', function (event) { mapSelf.mapInfoWindow('', '', '', null) });
					marker2.setMap(this.map);
					this.markersArray2.push(marker2);
				}

				if (setPath) {
					// Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
					let boundsListener = google.maps.event.addListener((this.map), 'bounds_changed', (event) => {
						this.map.setZoom(14);
						google.maps.event.removeListener(boundsListener);
					});
					// Automatically center the map fitting all markers on the screen
					this.map.fitBounds(bounds);

					let infoTitle = (elem.plant) ? elem.plant.toString() : '';
					this.createPath(srcLatLng, { lat: elem.lat, lng: elem.lng }, '<p> <span style="color: green; font-weight: bold;">' + routeSrc + '</span> to <span style="color: ' + this.colorCode[i] + '; font-weight: bold">' + infoTitle + '</span></p><hr style=" margin: 5px !important;"><em>Distance : <b>' + parseInt(elem.distance) + " KM</b><em>", this.colorCode[i], bounds);
				}
			}
		});
	}

	createPath(srcLatLng, latlng: any = [], infoContent: string, colorCode: string, bounds) {
		let service = new google.maps.DirectionsService();
		let des = new google.maps.LatLng(latlng.lat, latlng.lng);

		service.route({
			origin: srcLatLng,
			destination: des,
			travelMode: google.maps.TravelMode.DRIVING
		}, (result, status) => {
			if (status == google.maps.DirectionsStatus.OK) {
				let mapSelf = this, path: any = new google.maps.MVCArray();// new path for the next result
				//'#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
				let poly = new google.maps.Polyline({
					map: this.map,
					strokeColor: colorCode,
					strokeWeight: 4
				});
				poly.setPath(path);
				this.polyArray.push(poly);
				google.maps.event.addListener(poly, 'mouseover', function (event) { // lets add event listeners
					poly.set('strokeColor', 'red');
					poly.set('strokeOpacity', 0.8);
					poly.set('zIndex', 1);
					mapSelf.infoWindow.setPosition(event.latLng);
					mapSelf.mapInfoWindow('set', infoContent, this)
				});

				google.maps.event.addListener(poly, 'mouseout', function () {
					poly.set('strokeColor', colorCode);
					poly.set('strokeOpacity', 0.8);
					poly.set('zIndex', -1);
					mapSelf.infoWindow.close();
				});

				for (var k = 0, len = result.routes[0].overview_path.length; k < len; k++) {
					path.push(result.routes[0].overview_path[k]);
					bounds.extend(result.routes[0].overview_path[k]);
					this.map.fitBounds(bounds);
				}
			} else console.log("Directions Service failed:" + status);
		});
	}

	setMarker(LatLng: google.maps.LatLng, content: string, mapSelf = this) {
		this.marker.setPosition(LatLng);
		this.marker.addListener('mouseover', function (event) {
			mapSelf.mapInfoWindow('set', content, this);
		});
		this.marker.addListener('mouseout', function (event) {
			mapSelf.mapInfoWindow('', '', this);
		});
		if (window.innerWidth < 768) {
			this.marker.addListener('click', function (event) {
				mapSelf.mapInfoWindow('set', content, this);
			});
		}
		this.marker.setMap(this.map);
		this.map.setCenter(LatLng);
	}

	mapInfoWindow(action: string, content: string, eveSelf: any, map: google.maps.Map = this.map) {
		this.infoWindow.close();
		if (action == 'set') {
			this.infoWindow.setContent(content);
			this.infoWindow.open(map, eveSelf);
		}
	}

	resetMap() {
		this.markersArray.forEach(cord => {
			cord.setMap(null);
			this.map.unbind(cord)

		});
		this.markersArray = [];
		this.markersArray2.forEach(cord2 => {
			cord2.setMap(null);
			this.map.unbind(cord2)
		});
		this.markersArray2 = [];
		this.cityCircle.forEach(circle => {
			circle.setMap(null);
			this.map.unbind(circle)

		});
		this.cityCircle = []
		this.marker.setMap(null);
		this.polyArray.forEach(polyline => {
			polyline.setMap(null);
			this.map.unbind(polyline)

		});

	}
}
