import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import DASHBOARD_ASSETS from '@salesforce/resourceUrl/dashboardAssets';
import KPI from '@salesforce/resourceUrl/kpi';
import APEXCHARTS from '@salesforce/resourceUrl/apexcharts';
import HIGHCHARTS from '@salesforce/resourceUrl/highcharts';
import SPECIALITIES from '@salesforce/resourceUrl/specialities';
import AVATARS from '@salesforce/resourceUrl/avatars';

export default class DashboardHealthSystems extends NavigationMixin(LightningElement) {
    bootstrapInitialized = false;

    chartsInitialized = false;
    apexLoaded = false;
    apexChart = null;
    apexHeatmap = null;
    apexDonut = null;
    // Highcharts state
    highchartsLoaded = false;
    highchartsChart = null;
    _hcResizeObserver = null;
    // small KPI sparkline charts (ApexCharts instances)
    apexSparkCharts = [];
    // sample counts - replace these with real data bindings if available
    TotalInitiatedCount = 60;
    TotalPendingCount = 40;

    // Background images from kpi static resource (bg-01.svg .. bg-04.svg)
    get bgImage01() {
        return KPI + '/bg-01.svg';
    }
    get bgImage02() {
        return KPI + '/bg-02.svg';
    }
    get bgImage03() {
        return KPI + '/bg-03.svg';
    }
    get bgImage04() {
        return KPI + '/bg-04.svg';
    }

    // Avatar images from avatars static resource
    get av1() { return SPECIALITIES + '/spec1.jpg'; }
    get av2() { return SPECIALITIES + '/spec2.jpg'; }
    get av3() { return SPECIALITIES + '/spec3.jpg'; }
    get av4() { return SPECIALITIES + '/spec4.png'; }
    get av5() { return SPECIALITIES + '/spec5.png'; }

    get displayTaskTodoRecords() {
        return this.taskTodoRecords.map((item) => ({
            ...item,
            subjectClass: item.emphasis === 'critical' ? 'task-subject critical' : 'task-subject',
            responsibilityInitials: (item.responsibilityName || '')
                .split(' ')
                .map((part) => part && part[0])
                .filter(Boolean)
                .slice(0, 2)
                .join('')
                .toUpperCase()
        }));
    }

    taskTodoRecords = [
        {
            id: 'task1',
            subject: 'Health system board',
            emphasis: 'critical',
            dueDate: 'Nov 22, 2025',
            projectName: 'Beta Trial',
            responsibilityName: 'Ravi Kumar',
            responsibilityOrg: 'Acme Pharma',
            responsibilityPhoto: `${AVATARS}/1.svg.jpg`
        },
        {
            id: 'task2',
            subject: 'Upload revised protocol ',
            emphasis: 'standard',
            dueDate: 'Nov 24, 2025',
            projectName: 'Gamma Research',
            responsibilityName: 'Suman Rao',
            responsibilityOrg: 'BioHealth Ltd',
            responsibilityPhoto: `${AVATARS}/2.svg.jpg`
        },
        {
            id: 'task3',
            subject: 'Share SDV summary',
            emphasis: 'critical',
            dueDate: 'Nov 26, 2025',
            projectName: 'CDS Project',
            responsibilityName: 'Anil Mehta',
            responsibilityOrg: 'MedSolutions',
            responsibilityPhoto: `${AVATARS}/3.svg.jpg`
        },
        {
            id: 'task4',
            subject: 'Confirm PI onboarding ',
            emphasis: 'standard',
            dueDate: 'Nov 29, 2025',
            projectName: 'Delta Study',
            responsibilityName: 'Priya Singh',
            responsibilityOrg: 'Global Trials',
            responsibilityPhoto: `${AVATARS}/4.svg.jpg`
        },
    ];

    connectedCallback() {
        // Intentionally do NOT load global Bootstrap CSS here to avoid leaking styles
        // into the parent Lightning Experience page (navigation tabs, etc.).
        // Charts are initialized in renderedCallback where the template is available.
    }

    disconnectedCallback() {
        // cleanup Highcharts and observers
        try {
            if (this._hcResizeObserver) {
                this._hcResizeObserver.disconnect();
                this._hcResizeObserver = null;
            }
        } catch (e) { /* ignore */ }

        try {
            if (this.highchartsChart && this.highchartsChart.destroy) {
                this.highchartsChart.destroy();
                this.highchartsChart = null;
            }
        } catch (e) { /* ignore */ }

        try {
            if (this.apexChart && this.apexChart.destroy) {
                this.apexChart.destroy();
                this.apexChart = null;
            }
        } catch (e) { /* ignore */ }

        try {
            if (this.apexHeatmap && this.apexHeatmap.destroy) {
                this.apexHeatmap.destroy();
                this.apexHeatmap = null;
            }
        } catch (e) { /* ignore */ }

        try {
            if (this.apexSparkCharts && this.apexSparkCharts.length) {
                this.apexSparkCharts.forEach((c) => { if (c && typeof c.destroy === 'function') try { c.destroy(); } catch (e) { /* ignore */ } });
                this.apexSparkCharts = [];
            }
        } catch (e) { /* ignore */ }

        try {
            if (this.apexDonut && this.apexDonut.destroy) {
                this.apexDonut.destroy();
                this.apexDonut = null;
            }
        } catch (e) { /* ignore */ }
    }

    // Column chart state
    years = ['2025', '2024', '2023'];
    selectedYear = '2025';
    // CVP filter state (replaces the bootstrap dropdown inside LWC)
    selectedCvpFilter = 'Weekly';

    handleYearChange(event) {
        const val = event.target.value;
        this.selectedYear = val;
        // If ApexCharts is loaded, reinitialize/update Apex chart, otherwise fallback to canvas chart
        if (this.apexLoaded && this.apexChart) {
            this.initializeApexChart();
            // also refresh heatmap if present
            if (this.apexLoaded) this.initializeHeatmap();
        } else {
            this.drawColumnChart();
        }
    }

    // Handler for the Bottom 5 CVP's filter select
    handleCvpFilterChange(event) {
        this.selectedCvpFilter = event.target.value;
        // TODO: wire this value to actually filter the Bottom 5 list when data is dynamic
        // for now this updates the UI state and can be used to trigger further logic
    }

    renderedCallback() {
        if (this.chartsInitialized) return;
        this.chartsInitialized = true;
        // Initialize simple lightweight canvas charts (sparklines) without external libs
        this.initializeCharts();
        // Load ApexCharts library after sparklines are created and initialize the Apex chart.
        // If ApexCharts fails to load, fallback to the canvas implementation already present in drawColumnChart().
        this.loadApexLibraries()
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.warn('ApexCharts failed to load, falling back to canvas chart', err);
                // fallback: draw canvas-based column chart
                this.drawColumnChart();
            })
            .then(() => {
                // Regardless of ApexCharts success, attempt to load Highcharts and render the status pie
                this.loadHighchartsLibraries().catch((hcErr) => {
                    // eslint-disable-next-line no-console
                    console.warn('Highcharts failed to load', hcErr);
                });
            });
    }

    initializeCharts() {
        const datasets = {
            chart1: { data: [5, 9, 7, 14, 10, 16], color: '#ffffff' },
            chart2: { data: [3, 6, 4, 9, 7, 11], color: '#ffffff' },
            chart3: { data: [8, 7, 10, 12, 9, 13], color: '#ffffff' },
            chart4: { data: [6, 8, 7, 11, 10, 12], color: '#ffffff' }
        };

        Object.keys(datasets).forEach(ref => {
            // querySelector requires the colon to be escaped in the attribute selector
            const canvas = this.template.querySelector(`canvas[lwc\\:ref="${ref}"]`);
            if (canvas && canvas.getContext) {
                this.drawSparkline(canvas, datasets[ref].data, datasets[ref].color);
            }
        });

    // draw column chart after sparklines only if ApexCharts not available; otherwise Apex will render later
    }

    drawSparkline(canvas, data, color) {
        const ctx = canvas.getContext('2d');
        // size canvas to container
        const w = canvas.width = canvas.offsetWidth || 80;
        const h = canvas.height = canvas.offsetHeight || 50;
        ctx.clearRect(0, 0, w, h);

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        ctx.beginPath();
        data.forEach((v, i) => {
            const x = (i / (data.length - 1)) * (w - 4) + 2;
            const y = h - 2 - ((v - min) / range) * (h - 4);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Column chart drawing (grouped columns, 2 series)
    getColumnDataForYear(year) {
        // Example static data per year (two series)
        const sample = {
            2023: {
                seriesA: [8, 12, 10, 14, 9, 16, 11, 15, 13, 18, 12, 17],
                seriesB: [4, 6, 7, 9, 8, 10, 9, 11, 10, 12, 11, 13]
            },
            2024: {
                seriesA: [9, 14, 11, 16, 12, 17, 13, 18, 14, 19, 15, 19],
                seriesB: [5, 7, 8, 10, 9, 11, 10, 12, 11, 13, 12, 14]
            },
            2025: {
                seriesA: [10, 15, 12, 17, 14, 18, 16, 19, 17, 20, 18, 19],
                seriesB: [6, 8, 9, 11, 10, 12, 11, 13, 12, 14, 13, 15]
            }
        };
        return sample[year] || sample[2025];
    }

    drawColumnChart() {
        const canvas = this.template.querySelector('canvas[lwc\\:ref="columnChart"]');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        const w = canvas.width = container.offsetWidth || 800;
        const h = canvas.height = container.offsetHeight || 240;
        ctx.clearRect(0, 0, w, h);

        const padding = { left: 40, right: 20, top: 20, bottom: 30 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;

        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const data = this.getColumnDataForYear(this.selectedYear);
        const axisMax = 20;
        const max = axisMax;

        // axes
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, padding.top + chartH);
        ctx.lineTo(padding.left + chartW, padding.top + chartH);
        ctx.stroke();

        // draw bars
        const groupWidth = chartW / months.length;
        const barWidth = Math.min(20, groupWidth * 0.35);

        for (let i = 0; i < months.length; i++) {
            const xGroup = padding.left + i * groupWidth;
            // seriesA (left)
            const aVal = data.seriesA[i];
            const aH = (aVal / max) * chartH;
            const aX = xGroup + groupWidth/2 - barWidth - 2;
            const aY = padding.top + chartH - aH;
            ctx.fillStyle = '#0d6efd'; // blue
            ctx.fillRect(aX, aY, barWidth, aH);

            // seriesB (right)
            const bVal = data.seriesB[i];
            const bH = (bVal / max) * chartH;
            const bX = xGroup + groupWidth/2 + 2;
            const bY = padding.top + chartH - bH;
            ctx.fillStyle = '#198754'; // green
            ctx.fillRect(bX, bY, barWidth, bH);

            // month label
            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(months[i], xGroup + groupWidth/2, padding.top + chartH + 12);
        }

        // legend
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Series A', padding.left, padding.top - 6);
        ctx.fillStyle = '#0d6efd';
        ctx.fillRect(padding.left + 60, padding.top - 14, 12, 8);
        ctx.fillStyle = '#000';
        ctx.fillText('Series B', padding.left + 100, padding.top - 6);
        ctx.fillStyle = '#198754';
        ctx.fillRect(padding.left + 160, padding.top - 14, 12, 8);
    }

    // Load ApexCharts scripts and styles from static resource
    loadApexLibraries() {
        if (this.apexLoaded) return Promise.resolve();
        return Promise.all([
            loadScript(this, APEXCHARTS + '/apexcharts.min.js'),
            loadStyle(this, APEXCHARTS + '/apexcharts.css')
        ]).then(() => {
            this.apexLoaded = true;
            this.initializeApexChart();
            // initialize heatmap after apex is loaded
            this.initializeHeatmap();
            // initialize KPI sparklines
            this.initializeKpiSparklines();
                // initialize donut
                this.initializeDonut();
        });
    }

    // Load Highcharts from static resources and render the status pie
    loadHighchartsLibraries() {
        if (this.highchartsLoaded) return Promise.resolve();
        return Promise.all([
            loadScript(this, HIGHCHARTS + '/highcharts.js'),
            // exporting.js is optional but included in the static resource
            loadScript(this, HIGHCHARTS + '/exporting.js')
        ]).then(() => {
            this.highchartsLoaded = true;
            // render the chart once scripts are available
            this.renderStatusChart();
        });
    }

    async renderStatusChart() {
        // Ensure Highcharts is available
        // eslint-disable-next-line no-undef
        const Highcharts = window.Highcharts || (typeof Highcharts !== 'undefined' && Highcharts);
        if (!Highcharts) {
            // eslint-disable-next-line no-console
            console.error('Highcharts not available to render status chart');
            return;
        }

        // Destroy existing chart if it exists
        const existingChart = (Highcharts.charts || []).find(
            (chart) => chart && chart.renderTo && chart.renderTo.id === 'container10'
        );
        if (existingChart) {
            try { existingChart.destroy(); } catch (e) { /* ignore */ }
        }

    // small timeout to ensure DOM is painted
    setTimeout(async () => {
            // try to find element inside template first using data attribute (robust in shadow DOM)
            // wait a frame to ensure DOM nodes are painted
            await new Promise((res) => requestAnimationFrame(res));
            let containerElement = this.template.querySelector('div[data-id="container10"]');
            if (!containerElement) containerElement = this.template.querySelector('#container10');
            if (!containerElement) containerElement = document.getElementById('container10');
            if (!containerElement) {
                // eslint-disable-next-line no-console
                console.error('Container10 element not found! Chart cannot be rendered.');
                return;
            }

            const chartOptions = {
                credits: { enabled: false },
                chart: { type: 'pie', style: { fontSize: '16px' }, backgroundColor: 'transparent' },
                title: { text: undefined },
                tooltip: { enabled: false },
                legend: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    layout: 'horizontal',
                    itemStyle: { fontWeight: 'normal', fontSize: '13px', color: '#333' },
                    itemDistance: 25,
                    padding: 5,
                    margin: 8,
                    maxHeight: 50,
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        // set a relative size so pie occupies around half the available width
                        size: '80%',
                        center: ['50%', '58%'],
                        dataLabels: {
                            enabled: true,
                            // place labels outside with connectors
                            distance: 40,
                            format: '{point.percentage:.1f}%',
                            color: '#000',
                            style: { fontWeight: 'bold', fontSize: '13px' },
                            connectorColor: '#c8c8c8',
                            connectorWidth: 2,
                            crop: false,
                            overflow: 'allow'
                        },
                        showInLegend: true,
                    }
                },
                series: [
                    {
                        type: 'pie',
                        name: 'Status',
                        data: [
                            { name: 'Prospective', y: this.TotalInitiatedCount, color: '#008FFB' },
                            { name: 'Retrospective', y: this.TotalPendingCount, color: '#00E396' }
                        ]
                    }
                ]
            };

            try {
                // render into the element inside the component (pass element to avoid shadow DOM id lookup issues)
                const chart = Highcharts.chart(containerElement, chartOptions);
                // store reference for later reflow/destroy
                this.highchartsChart = chart;
                // Attach a ResizeObserver so the chart reflows when container size changes
                if (typeof ResizeObserver !== 'undefined') {
                    if (this._hcResizeObserver) {
                        try { this._hcResizeObserver.disconnect(); } catch (e) { /* ignore */ }
                    }
                    this._hcResizeObserver = new ResizeObserver(() => {
                        try { if (this.highchartsChart && this.highchartsChart.reflow) this.highchartsChart.reflow(); } catch (e) { /* ignore */ }
                    });
                    this._hcResizeObserver.observe(containerElement);
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error rendering status chart:', error);
            }
    }, 100);
    }

    // Initialize the ApexCharts column chart
    initializeApexChart() {
        if (!this.apexLoaded) return;
        const container = this.template.querySelector('div[data-id="apexChart"]');
        if (!container) return;

        // Build options using the internal getColumnDataForYear (12 months)
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const data = this.getColumnDataForYear(this.selectedYear);
        const options = {
            series: [
                { name: 'New', data: data.seriesA },
                // { name: 'Completed', data: data.seriesB }
            ],
            chart: { type: 'bar', height: 350 },
            plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ['transparent'] },
            xaxis: { categories: months },
            yaxis: {
                min: 0,
                max: 20,
                tickAmount: 4,
                labels: {
                    formatter: function (val) {
                        return val;
                    }
                },
                title: { text: 'Projects' }
            },
            fill: { opacity: 1 },
            tooltip: { y: { formatter: function (val) { return val; } } }
        };

        // If an existing chart exists, destroy it first
        if (this.apexChart && typeof this.apexChart.destroy === 'function') {
            try { this.apexChart.destroy(); } catch (e) { /* ignore */ }
            this.apexChart = null;
        }

        // eslint-disable-next-line no-undef
        this.apexChart = new ApexCharts(container, options);
        this.apexChart.render();
    }

    // Initialize the small KPI sparklines in the top KPI cards
    initializeKpiSparklines() {
        if (!this.apexLoaded) return;

        // configs based on the example you provided (small sparkline variants)
        const configs = [
            {
                selector: 's-col',
                options: {
                    series: [{ name: 'Data', data: [40,15,60,15,90,20,70] }],
                    chart: { type: 'bar', height: 54, sparkline: { enabled: true }, toolbar: { show: false } },
                    plotOptions: { bar: { columnWidth: '70%', borderRadius: 3 } },
                    colors: ['#2E37A4'],
                    tooltip: { enabled: false }
                }
            },
            {
                selector: 's-col-2',
                options: {
                    series: [{ name: 'Data', data: [22,35,30,40,28,45,40] }],
                    chart: { type: 'area', height: 54, sparkline: { enabled: true }, toolbar: { show: false } },
                    stroke: { curve: 'smooth', width: 1, colors: ['#F36C3D'] },
                    fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0 } },
                    colors: ['#F36C3D'],
                    tooltip: { enabled: false }
                }
            },
            {
                selector: 's-col-3',
                options: {
                    series: [{ name: 'Data', data: [80,35,50,45,35,60,50] }],
                    chart: { type: 'bar', height: 54, sparkline: { enabled: true }, toolbar: { show: false } },
                    plotOptions: { bar: { columnWidth: '70%', borderRadius: 0 } },
                    colors: ['#06AED4'],
                    tooltip: { enabled: false }
                }
            },
            {
                selector: 's-col-4',
                options: {
                    series: [{ name: 'Data', data: [20,12,9,14,18,25,30,28,35,40] }],
                    chart: { type: 'area', height: 54, sparkline: { enabled: true }, toolbar: { show: false } },
                    stroke: { curve: 'smooth', width: 2, colors: ['#008073'] },
                    fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0 } },
                    colors: ['#008073'],
                    tooltip: { enabled: false }
                }
            }
        ];

        // destroy any existing small charts first
        try {
            (this.apexSparkCharts || []).forEach((c) => { if (c && typeof c.destroy === 'function') try { c.destroy(); } catch (e) { /* ignore */ } });
        } catch (e) { /* ignore */ }
        this.apexSparkCharts = [];

        configs.forEach((cfg) => {
            const container = this.template.querySelector(`div[data-id="${cfg.selector}"]`);
            if (!container) return;
            // eslint-disable-next-line no-undef
            const chart = new ApexCharts(container, cfg.options);
            chart.render();
            this.apexSparkCharts.push(chart);
        });
    }

    // Generate series for the heatmap: months x days
    generateHeatmapSeries() {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months.map((m) => ({ name: m, data: this.generateData(31, { min: -30, max: 55 }) }));
    }

    // utility to produce array of {x: day, y: value}
    generateData(count, yrange) {
        return Array.from({ length: count }, (_, i) => ({ x: `${i + 1}`, y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min }));
    }

    initializeHeatmap() {
        if (!this.apexLoaded) return;
        const container = this.template.querySelector('div[data-id="apexHeatmap"]');
        if (!container) return;

        const series = this.generateHeatmapSeries();
        const options = {
            series: series,
            chart: { type: 'heatmap', height: 360, toolbar: { show: false } },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0.5,
                    colorScale: {
                        ranges: [
                            { from: -30, to: 5, name: 'Low', color: '#00A100' },
                            { from: 6, to: 20, name: 'Medium', color: '#128FD9' },
                            { from: 21, to: 45, name: 'High', color: '#FFB200' },
                            { from: 46, to: 55, name: 'Extreme', color: '#FF0000' }
                        ]
                    }
                }
            },
            dataLabels: { enabled: false },
            xaxis: { type: 'category' },
            legend: { show: false }
        };

        // destroy existing heatmap if present
        if (this.apexHeatmap && typeof this.apexHeatmap.destroy === 'function') {
            try { this.apexHeatmap.destroy(); } catch (e) { /* ignore */ }
            this.apexHeatmap = null;
        }

        // eslint-disable-next-line no-undef
        this.apexHeatmap = new ApexCharts(container, options);
        // Render and then populate a custom legend inside the card using the configured colorScale ranges
        this.apexHeatmap.render().then(() => {
            try {
                const legendEl = this.template.querySelector('div[data-id="heatmapLegend"]');
                if (legendEl) {
                    const ranges = (options.plotOptions && options.plotOptions.heatmap && options.plotOptions.heatmap.colorScale && options.plotOptions.heatmap.colorScale.ranges) || [];
                    let html = '';
                    for (let i = 0; i < ranges.length; i++) {
                        const r = ranges[i];
                        const color = r.color || '#ccc';
                        const label = r.name || `${r.from} - ${r.to}`;
                        const markerStyle = `background:${color};width:18px;height:18px;border-radius:4px;display:inline-block;border:2px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,0.08);vertical-align:middle;margin-right:8px;`;
                        html += `<div class="heatmap-legend-item"><span class="heatmap-marker" style="${markerStyle}"></span><span class="heatmap-label">${label}</span></div>`;
                    }
                    legendEl.innerHTML = html;
                    // basic inline layout fallback for environments where CSS may be strict
                    legendEl.style.display = 'flex';
                    legendEl.style.justifyContent = 'center';
                    legendEl.style.gap = '12px';
                    legendEl.style.marginTop = '12px';
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn('Failed to render heatmap legend', e);
            }
        });
    }

    // Initialize the donut chart for Top 3 CVP's
    initializeDonut() {
        if (!this.apexLoaded) return;
        const container = this.template.querySelector('div[data-id="apexDonut"]');
        if (!container) return;

        // Configure donut to match the provided design: centered total label + large value,
        // legend at bottom with numeric prefix, and generous drawing area to avoid clipping.
        // Use the provided circleChart-style configuration so legend and labels match design
        const options = {
            chart: { type: 'donut', height: 270, width: '100%', offsetY: -10 },
            // keep the numeric series but update labels to the requested geography names
            series: [5, 8, 2],
            labels: ['Clinical Trial', 'Device Validation', 'Software Validation'],
            colors: ['#6DA6F2', '#5C60CC', '#9B51B6'],
            legend: { show: false },
            dataLabels: { enabled: false },
            stroke: { width: 2, colors: ['#fff'] },
            plotOptions: {
                pie: {
                    donut: {
                        size: '60%',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '16px',
                                fontWeight: 400,
                                offsetY: -10,
                                color: '#0A1B39'
                            },
                            value: {
                                show: true,
                                fontSize: '18px',
                                fontWeight: 700,
                                offsetY: 10,
                                color: '#0A1B39'
                            },
                            total: {
                                show: true,
                                label: 'Total Projects',
                                fontSize: '14px',
                                color: '#0A1B39',
                                // ✅ Keep total constant — disable hover updates
                                showAlways: true,
                                formatter: function (w) {
                                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                }
                            }
                        }
                    }
                }
            },
            tooltip: { enabled: true }
        };

        // destroy existing donut if present
        if (this.apexDonut && typeof this.apexDonut.destroy === 'function') {
            try { this.apexDonut.destroy(); } catch (e) { /* ignore */ }
            this.apexDonut = null;
        }

        // eslint-disable-next-line no-undef
        this.apexDonut = new ApexCharts(container, options);
        this.apexDonut.render().then(() => {
            // After render, create/update a custom legend inside the card so it's guaranteed
            // to remain inside the white card background (and not overflow the card).
            try {
                const legendEl = this.template.querySelector('div[data-id="donutLegend"]');
                if (legendEl) {
                    // build legend markup using the same series/labels/colors
                    const series = options.series || [];
                    const labels = options.labels || [];
                    const colors = options.colors || [];
                    let html = '';
                    for (let i = 0; i < series.length; i++) {
                        const val = series[i] || 0;
                        const label = labels[i] || '';
                        const color = colors[i] || '#ccc';
                        // Use inline styles for the marker so it's visible even if outer CSS is overridden
                        const markerStyle = `background:${color};width:18px;height:18px;border-radius:50%;display:inline-block;border:2px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,0.08);vertical-align:middle;margin-right:8px;`;
                        html += `<div class="donut-legend-item"><span class="donut-marker" style="${markerStyle}"></span><span class="donut-label">${val} ${label}</span></div>`;
                    }
                    legendEl.innerHTML = html;
                    // Nudge the legend upward so it tucks closer under the donut
                    // Use transform for better compositing and to avoid layout reflow issues
                    try {
                        legendEl.style.transform = 'translateY(-65px)';
                        legendEl.style.position = 'relative';
                    } catch (err) {
                        // ignore if style assignment fails in some environments
                    }
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn('Failed to render custom donut legend', e);
            }
        });
    }

    // Navigation methods
    navigateToDoctors() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Doctor_Grid' // Replace with your actual tab/page API name
            }
        });
    }

    navigateToPatients() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Patient_Grid' // Replace with your actual tab/page API name
            }
        });
    }

    navigateToAppointments() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Appointment_List' // Replace with your actual tab/page API name
            }
        });
    }
}