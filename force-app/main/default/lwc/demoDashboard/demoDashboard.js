import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import APEXCHARTS from '@salesforce/resourceUrl/apexcharts';
import HIGHCHARTS from '@salesforce/resourceUrl/highcharts';
import getMonthlyTrend from '@salesforce/apex/ProjectsController.getMonthlyTrend';
import getStatusCounts from '@salesforce/apex/ProjectsController.getStatusCounts';
import getIndustryCounts from '@salesforce/apex/ProjectsController.getIndustryCounts';

export default class DemoDashboard extends LightningElement {
	chartsInitialized = false;
	apexLoaded = false;
	highchartsLoaded = false;

	apexChart;
	apexDonut;
	highchartsChart;

	renderedCallback() {
		if (this.chartsInitialized) return;
		this.chartsInitialized = true;

		// Load ApexCharts first for the column + donut visuals
		Promise.all([
			loadScript(this, `${APEXCHARTS}/apexcharts.min.js`),
			loadStyle(this, `${APEXCHARTS}/apexcharts.css`)
		])
			.then(() => {
				this.apexLoaded = true;
				this.fetchData();
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.warn('ApexCharts failed to load', err);
			})
			.finally(() => this.loadHighcharts());
	}

	loadHighcharts() {
		if (this.highchartsLoaded) return;
		Promise.all([
			loadScript(this, `${HIGHCHARTS}/highcharts.js`),
			loadScript(this, `${HIGHCHARTS}/exporting.js`)
		])
			.then(() => {
				this.highchartsLoaded = true;
				this.renderTypePie();
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.warn('Highcharts failed to load', err);
			});
	}

	disconnectedCallback() {
		try { this.apexChart?.destroy(); } catch (e) { /* ignore */ }
		try { this.apexDonut?.destroy(); } catch (e) { /* ignore */ }
		try { this.highchartsChart?.destroy(); } catch (e) { /* ignore */ }
	}

	async fetchData() {
		try {
			const year = new Date().getFullYear();
			const [monthly, statusList, industry] = await Promise.all([
				getMonthlyTrend({ year }),
				getStatusCounts(),
				getIndustryCounts()
			]);
			this._monthly = monthly || null;
			this._statusList = statusList || [];
			this._industry = industry || { labels: [], series: [] };
			this.initializeColumnChart();
			this.initializeDonut();
			if (this.highchartsLoaded) {
				this.renderTypePie();
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.warn('Failed to fetch dashboard data', err);
		}
	}

    initializeColumnChart() {
		if (!this.apexLoaded) return;
		const target = this.template.querySelector('div[data-id="apexChart"]');
		if (!target) return;

		const months = (this._monthly && this._monthly.months) ? this._monthly.months : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const seriesA = (this._monthly && this._monthly.seriesNew) ? this._monthly.seriesNew : this.getColumnData().seriesA;
		const seriesB = (this._monthly && this._monthly.seriesCompleted) ? this._monthly.seriesCompleted : this.getColumnData().seriesB;

		const options = {
			series: [
				{ name: 'New', data: seriesA },
				{ name: 'Completed', data: seriesB }
			],
			chart: { type: 'bar', height: 320 },
			plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
			dataLabels: { enabled: false },
			stroke: { show: true, width: 2, colors: ['transparent'] },
			xaxis: { categories: months },
			yaxis: { min: 0, max: 5, title: { text: 'Projects' } },
			fill: { opacity: 1 },
			tooltip: { y: { formatter: (val) => val } }
		};

		try { this.apexChart?.destroy(); } catch (e) { /* ignore */ }
		// eslint-disable-next-line no-undef
		this.apexChart = new ApexCharts(target, options);
		this.apexChart.render();
	}

	initializeDonut() {
		if (!this.apexLoaded) return;
		const target = this.template.querySelector('div[data-id="apexDonut"]');
		if (!target) return;

		const options = {
			chart: { type: 'donut', height: 270, width: '100%' },
			series: (this._industry && this._industry.series && this._industry.series.length) ? this._industry.series : [214, 121, 150],
			labels: (this._industry && this._industry.labels && this._industry.labels.length) ? this._industry.labels : ['California', 'Texas', 'New York'],
			colors: (this._industry && this._industry.labels && this._industry.labels.length)
				? this._industry.labels.map((_, i) => ['#6DA6F2', '#5C60CC', '#9B51B6', '#9B51B6', '#00E396', '#FEB019', '#FF4560'][i % 7])
				: ['#6DA6F2', '#5C60CC', '#9B51B6'],
			legend: { show: false },
			dataLabels: { enabled: false },
			stroke: { width: 2, colors: ['#fff'] },
			plotOptions: {
				pie: {
					donut: {
						size: '60%',
						labels: {
							show: true,
							total: {
								show: true,
								label: 'Total Projects',
								showAlways: true,
								formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
							}
						}
					}
				}
			}
		};

		try { this.apexDonut?.destroy(); } catch (e) { /* ignore */ }
		// eslint-disable-next-line no-undef
		this.apexDonut = new ApexCharts(target, options);
		this.apexDonut.render().then(() => this.renderDonutLegend(options));
	}

	renderDonutLegend(options) {
		const legend = this.template.querySelector('div[data-id="donutLegend"]');
		if (!legend) return;
		const series = options.series || [];
		const labels = options.labels || [];
		const colors = options.colors || [];
		const html = series
			.map((val, idx) => {
				const color = colors[idx] || '#ccc';
				const label = labels[idx] || '';
				return `<div class="donut-legend-item"><span class="donut-marker" style="background:${color};width:14px;height:14px;border-radius:50%;display:inline-block;margin-right:6px;"></span>${val} ${label}</div>`;
			})
			.join('');
		legend.innerHTML = html;
	}

	renderTypePie() {
		// eslint-disable-next-line no-undef
		const Highcharts = window.Highcharts || (typeof Highcharts !== 'undefined' && Highcharts);
		if (!Highcharts) return;

		let container = this.template.querySelector('div[data-id="container10"]');
		if (!container) container = this.template.querySelector('#container10');
		if (!container) return;

		const statusData = (this._statusList && this._statusList.length) ? this._statusList : [
			{ name: 'Clinical Trials', y: 180, color: '#008FFB' },
			{ name: 'Real-World Evidence', y: 140, color: '#00E396' },
			{ name: 'Feasibility', y: 90, color: '#FEB019' }
		];

		const options = {
			credits: { enabled: false },
			chart: { type: 'pie', backgroundColor: 'transparent' },
			title: { text: undefined },
			tooltip: { enabled: true },
			legend: { enabled: true },
			plotOptions: {
				pie: {
					size: '80%',
					dataLabels: { enabled: true, format: '{point.percentage:.1f}%' },
					showInLegend: true
				}
			},
			series: [ { type: 'pie', name: 'Projects', data: statusData } ]
		};

		try { this.highchartsChart?.destroy(); } catch (e) { /* ignore */ }
		this.highchartsChart = Highcharts.chart(container, options);
	}

	getColumnData() {
		return {
			seriesA: [40, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 100],
			seriesB: [30, 35, 40, 45, 50, 55, 60, 65, 60, 70, 75, 80]
		};
	}
}