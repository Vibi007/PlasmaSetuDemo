import { Component, OnInit } from '@angular/core';
import { echartStyles } from '../../../shared/echart-styles';
import { ProductService } from '../../../shared/services/product.service';
import { EChartOption } from 'echarts';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-dashboard-v4',
	templateUrl: './dashboard-v4.component.html',
	styleUrls: ['./dashboard-v4.component.scss']
})
export class DashboardV4Component implements OnInit {
	lineChart1;
	chartLineSmall1: any;
	chartLineSmall: any;
	products$: any;

	constructor(
		private route: ActivatedRoute,
		private productService: ProductService
	) { }

	ngOnInit() {

		this.route.data.subscribe(data => {
			this.chartLineSmall = {
				grid: {
					show: false,
					top: 6,
					right: 0,
					left: 0,
					bottom: 0
				},
				tooltip: {
					show: true,
					backgroundColor: 'rgba(0, 0, 0, .8)'
				},
				xAxis: {
					type: 'category',
					data: data.message.X,
					show: true
				},
				yAxis: {
					type: 'value',
					show: false
				},
				...{
					grid: echartStyles.gridAlignLeft,
					series: [{
						data: data.message.Y,
						...echartStyles.smoothLine,
						lineStyle: {
							color: '#4CAF50',
							...echartStyles.lineShadow
						},
						itemStyle: {
							color: '#4CAF50'
						}
					}]
				}
			};
		});

		/* 	this.chartLineSmall1 = {
					tooltip: {
						show: true,
						backgroundColor: 'rgba(0, 0, 0, .8)'
					},
					xAxis: {
						data: data.x,
						show: true,
						silent: false,
						splitLine: {
							show: false,
						},
					},
					yAxis: {
						type: 'value',
						show: true,
						splitLine: {
							show: true,
						},
					},
					series: [{
						data: data.y,
						...echartStyles.smoothLine,
						lineStyle: {
							color: '#4CAF50',
							...echartStyles.lineShadow
						},
						itemStyle: {
							color: '#4CAF50',
							fontSize: 1
						}
					}],
					animationEasing: 'elasticOut',
					animationDelayUpdate: (idx) => idx * 5,
				}; */


		this.lineChart1 = {
			...echartStyles.lineFullWidth, ...{
				series: [{
					data: [80, 40, 90, 20, 80, 30, 90, 30, 80, 10, 70, 30, 90],
					...echartStyles.smoothLine,
					markArea: {
						label: {
							show: true
						}
					},
					areaStyle: {
						color: 'rgba(102, 51, 153, .15)',
						origin: 'start'
					},
					lineStyle: {
						// width: 1,
						color: 'rgba(102, 51, 153, 0.68)',
					},
					itemStyle: {
						color: '#663399'
					}
				}, {
					data: [20, 80, 40, 90, 20, 80, 30, 90, 30, 80, 10, 70, 30],
					...echartStyles.smoothLine,
					markArea: {
						label: {
							show: true
						}
					},
					areaStyle: {
						color: 'rgba(255, 152, 0, 0.15)',
						origin: 'start'
					},
					lineStyle: {
						// width: 1,
						color: 'rgba(255, 152, 0, .6)',
					},
					itemStyle: {
						color: 'rgba(255, 152, 0, 1)'
					}
				}]
			}
		};
		this.products$ = this.productService.getProducts();

	}

}
