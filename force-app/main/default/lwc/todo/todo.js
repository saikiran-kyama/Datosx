import { LightningElement } from 'lwc';
import AVATARS from '@salesforce/resourceUrl/avatars';

export default class Todo extends LightningElement {
	// View state
	viewMode = 'grid';
	calendarMode = 'monthly';
	currentMonthDate = new Date();
	weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	hourBlockHeight = 40; // px per hour in weekly view

	// View state
	showFilters = false;
	showAddModal = false;
	showEditModal = false;
	searchKey = '';

	// Add form fields
	formSubject = '';
	formDueDate = '';
	formProjectName = '';
	formResponsibility = '';
	formHsName = '';
	formSponsorName = '';

	hsOptions = [
		{ label: 'City Hospital', value: 'City Hospital' },
		{ label: 'Metro Clinic', value: 'Metro Clinic' },
		{ label: 'Neuro Center', value: 'Neuro Center' },
		{ label: 'Onco Clinic', value: 'Onco Clinic' },
		{ label: 'Sunrise Hospital', value: 'Sunrise Hospital' }
	];

	sponsorOptions = [
		{ label: 'Acme Pharma', value: 'Acme Pharma' },
		{ label: 'BioHealth Ltd', value: 'BioHealth Ltd' },
		{ label: 'MedSolutions', value: 'MedSolutions' },
		{ label: 'Zenith Pharma', value: 'Zenith Pharma' },
		{ label: 'NextGen Pharma', value: 'NextGen Pharma' }
	];

	statusOptionsList = [
		{ label: 'Upcoming', value: 'Upcoming' },
		{ label: 'Overdue', value: 'Overdue' },
		{ label: 'Completed', value: 'Completed' }
	];

	editRecordId = '';

	// Sorting
	sortField = '';
	sortOrder = 'asc';

	// Sample task data matching requested columns (20+ records)
	data = [
		{ id: '1', status: 'Upcoming', subject: 'Site initiation meeting', dueDate: '2026-01-10', completionDate: '', projectName: 'Heart Study A', responsibility: 'Dr. Patel', hsName: 'City Hospital', hsPhoto: `${AVATARS}/HS1.png`, sponsorName: 'Acme Pharma', sponsorPhoto: `${AVATARS}/ODF1.png`, dateCreated: '2025-12-01', lastUpdated: '2025-12-15' },
		{ id: '2', status: 'Overdue', subject: 'CRF finalisation', dueDate: '2025-12-01', completionDate: '', projectName: 'Diabetes Trial', responsibility: 'Meera Shah', hsName: 'Metro Clinic', hsPhoto: `${AVATARS}/HS2.png`, sponsorName: 'BioHealth Ltd', sponsorPhoto: `${AVATARS}/ODF2.png`, dateCreated: '2025-11-10', lastUpdated: '2025-12-02' },
		{ id: '3', status: 'Completed', subject: 'Regulatory submission', dueDate: '2025-11-20', completionDate: '2025-11-18', projectName: 'Neuro Study', responsibility: 'Rohan Gupta', hsName: 'Neuro Center', hsPhoto: `${AVATARS}/HS3.png`, sponsorName: 'MedSolutions', sponsorPhoto: `${AVATARS}/ODF3.png`, dateCreated: '2025-10-20', lastUpdated: '2025-11-18' },
		{ id: '4', status: 'Upcoming', subject: 'Monitor visit 1', dueDate: '2026-01-20', completionDate: '', projectName: 'Heart Study A', responsibility: 'Aakash Reddy', hsName: 'City Hospital', hsPhoto: `${AVATARS}/HS1.png`, sponsorName: 'Acme Pharma', sponsorPhoto: `${AVATARS}/ODF1.png`, dateCreated: '2025-12-05', lastUpdated: '2025-12-20' },
		{ id: '5', status: 'Overdue', subject: 'Data cleaning', dueDate: '2025-12-05', completionDate: '', projectName: 'Cancer Trial', responsibility: 'Divya Pillai', hsName: 'Onco Clinic', hsPhoto: `${AVATARS}/HS4.png`, sponsorName: 'Zenith Pharma', sponsorPhoto: `${AVATARS}/ODF.png`, dateCreated: '2025-11-15', lastUpdated: '2025-12-06' },
		{ id: '6', status: 'Upcoming', subject: 'Site training', dueDate: '2026-01-12', completionDate: '', projectName: 'Respiratory Study', responsibility: 'Dr. Kumar', hsName: 'Green Valley Clinic', hsPhoto: `${AVATARS}/HS2.png`, sponsorName: 'NextGen Pharma', sponsorPhoto: `${AVATARS}/ODF2.png`, dateCreated: '2025-12-02', lastUpdated: '2025-12-16' },
		{ id: '7', status: 'Completed', subject: 'Ethics approval', dueDate: '2025-10-28', completionDate: '2025-10-25', projectName: 'Pediatric Trial', responsibility: 'Dr. Sharma', hsName: 'Sunrise Hospital', hsPhoto: `${AVATARS}/HS5.png`, sponsorName: 'Alpha Bio', sponsorPhoto: `${AVATARS}/ODF3.png`, dateCreated: '2025-09-30', lastUpdated: '2025-10-28' },
		{ id: '8', status: 'Overdue', subject: 'Monitor report', dueDate: '2025-12-03', completionDate: '', projectName: 'Oncology Study', responsibility: 'Nisha Rai', hsName: 'Onco Clinic', hsPhoto: `${AVATARS}/HS4.png`, sponsorName: 'TriCore Labs', sponsorPhoto: `${AVATARS}/ODF.png`, dateCreated: '2025-11-01', lastUpdated: '2025-12-03' },
		{ id: '9', status: 'Upcoming', subject: 'Data lock', dueDate: '2026-02-01', completionDate: '', projectName: 'Diabetes Trial', responsibility: 'Rahul Verma', hsName: 'Metro Clinic', hsPhoto: `${AVATARS}/HS2.png`, sponsorName: 'BioHealth Ltd', sponsorPhoto: `${AVATARS}/ODF2.png`, dateCreated: '2025-12-10', lastUpdated: '2025-12-22' },
		{ id: '10', status: 'Completed', subject: 'Final report', dueDate: '2025-11-30', completionDate: '2025-11-29', projectName: 'Cardio Pilot', responsibility: 'Dr. Singh', hsName: 'City Hospital', hsPhoto: `${AVATARS}/HS1.png`, sponsorName: 'MedSolutions', sponsorPhoto: `${AVATARS}/ODF3.png`, dateCreated: '2025-10-05', lastUpdated: '2025-11-29' },
		{ id: '11', status: 'Upcoming', subject: 'Regulatory follow-up', dueDate: '2026-01-18', completionDate: '', projectName: 'Neurology Study', responsibility: 'Dr. Rao', hsName: 'Neuro Center', hsPhoto: `${AVATARS}/HS3.png`, sponsorName: 'Global Trials', sponsorPhoto: `${AVATARS}/ODF.png`, dateCreated: '2025-12-07', lastUpdated: '2025-12-21' },
		{ id: '12', status: 'Overdue', subject: 'Budget approval', dueDate: '2025-11-20', completionDate: '', projectName: 'Vaccine Study', responsibility: 'Anita Desai', hsName: 'St. Mary Hospital', hsPhoto: `${AVATARS}/HS1.png`, sponsorName: 'HealthWave', sponsorPhoto: `${AVATARS}/ODF1.png`, dateCreated: '2025-11-05', lastUpdated: '2025-11-20' },
		{ id: '13', status: 'Completed', subject: 'Participant consent', dueDate: '2025-11-02', completionDate: '2025-11-01', projectName: 'Behavioral Study', responsibility: 'Rita Menon', hsName: 'Northside Medical Center', hsPhoto: `${AVATARS}/HS3.png`, sponsorName: 'LifeCure', sponsorPhoto: `${AVATARS}/ODF2.png`, dateCreated: '2025-10-15', lastUpdated: '2025-11-01' },
		{ id: '14', status: 'Upcoming', subject: 'Site closeout', dueDate: '2026-02-15', completionDate: '', projectName: 'Closure Study', responsibility: 'Vikram Das', hsName: 'Chicago General', hsPhoto: `${AVATARS}/HS4.png`, sponsorName: 'BioAxis', sponsorPhoto: `${AVATARS}/ODF3.png`, dateCreated: '2025-12-12', lastUpdated: '2025-12-24' },
		{ id: '15', status: 'Overdue', subject: 'Data query resolution', dueDate: '2025-12-08', completionDate: '', projectName: 'Quality Study', responsibility: 'Kavita Rao', hsName: 'Miami Medical Center', hsPhoto: `${AVATARS}/HS5.png`, sponsorName: 'OptimaBio', sponsorPhoto: `${AVATARS}/ODF1.png`, dateCreated: '2025-11-18', lastUpdated: '2025-12-08' },
		{ id: '16', status: 'Upcoming', subject: 'Training refresh', dueDate: '2026-01-25', completionDate: '', projectName: 'Training Program', responsibility: 'Suresh Iyer', hsName: 'Houston Health Center', hsPhoto: `${AVATARS}/HS2.png`, sponsorName: 'NextGen Pharma', sponsorPhoto: `${AVATARS}/ODF2.png`, dateCreated: '2025-12-09', lastUpdated: '2025-12-23' },
		{ id: '17', status: 'Completed', subject: 'Database freeze', dueDate: '2025-11-22', completionDate: '2025-11-22', projectName: 'DataStudy', responsibility: 'Priya Nair', hsName: 'St. Mary Hospital', hsPhoto: `${AVATARS}/HS1.png`, sponsorName: 'BioVantage', sponsorPhoto: `${AVATARS}/ODF3.png`, dateCreated: '2025-10-30', lastUpdated: '2025-11-22' },
		{ id: '18', status: 'Overdue', subject: 'Protocol amendment', dueDate: '2025-12-12', completionDate: '', projectName: 'Amendment Study', responsibility: 'Manish Patel', hsName: 'Orlando Care Center', hsPhoto: `${AVATARS}/HS5.png`, sponsorName: 'Acme Pharma', sponsorPhoto: `${AVATARS}/ODF1.png`, dateCreated: '2025-11-20', lastUpdated: '2025-12-12' },
		{ id: '19', status: 'Upcoming', subject: 'Monitoring schedule', dueDate: '2026-02-05', completionDate: '', projectName: 'MonitorStudy', responsibility: 'Rashmi Singh', hsName: 'San Diego Health', hsPhoto: `${AVATARS}/HS1.png`, sponsorName: 'Zenith Pharma', sponsorPhoto: `${AVATARS}/ODF.png`, dateCreated: '2025-12-11', lastUpdated: '2025-12-25' },
		{ id: '20', status: 'Overdue', subject: 'Site paperwork', dueDate: '2025-12-02', completionDate: '', projectName: 'Admin Study', responsibility: 'Arun Bose', hsName: 'Chicago General', hsPhoto: `${AVATARS}/HS4.png`, sponsorName: 'MedSolutions', sponsorPhoto: `${AVATARS}/ODF3.png`, dateCreated: '2025-11-02', lastUpdated: '2025-12-02' }
	];

	// Pagination settings
	pageSizeOptions = [5, 10, 25, 50, 100];
	pageSize = 25; // rows per page
	pageIndex = 0; // zero-based index

	// Map status visual classes
	connectedCallback() {
		this.data = this.data.map(row => {
			let statusClass = 'badge-soft-info border border-info';
			if (row.status === 'Completed') statusClass = 'badge-soft-success border border-success';
			else if (row.status === 'Overdue') statusClass = 'badge-soft-danger border border-danger';
			else if (row.status === 'Upcoming') statusClass = 'badge-soft-info border border-info';

			return {
				...row,
				statusClass
			};
		});

		// bind resize sync so the upcoming rail can match calendar height
		this._boundSync = this.syncRailHeight.bind(this);
		window.addEventListener('resize', this._boundSync);

		// schedule an initial sync in case calendar renders immediately after connect
		setTimeout(() => { try { this.syncRailHeight(); } catch (e) {} }, 50);
	}

	// View switching
	switchView(event) {
		const mode = event.currentTarget?.dataset?.mode;
		if (!mode || mode === this.viewMode) return;
		this.viewMode = mode;
	}
    
	// handle view mode clicks on the topbar (monthly/weekly/daily)
	handleModeClick(event) {
		const btn = event.target.closest('.mode-btn');
		if (!btn || !btn.dataset) return;
		const mode = btn.dataset.mode;
		if (!mode) return;
		// allow monthly, weekly and daily
		this.calendarMode = mode;
		this.viewMode = 'calendar';
		setTimeout(() => { try { this.syncRailHeight(); } catch (e) {} }, 0);
	}

	get isGridView() { return this.viewMode === 'grid'; }
	get isCalendarView() { return this.viewMode === 'calendar'; }
	get isMonthlyView() { return this.isCalendarView && this.calendarMode === 'monthly'; }
	get isWeeklyView() { return this.isCalendarView && this.calendarMode === 'weekly'; }
	get isDailyView() { return this.isCalendarView && this.calendarMode === 'daily'; }
	get monthlyBtnClass() { return this.calendarMode === 'monthly' ? 'mode-btn active' : 'mode-btn'; }
	get weeklyBtnClass() { return this.calendarMode === 'weekly' ? 'mode-btn active' : 'mode-btn'; }
	get dailyBtnClass() { return this.calendarMode === 'daily' ? 'mode-btn active' : 'mode-btn'; }
	get gridToggleClass() { return this.isGridView ? 'toggle-btn active' : 'toggle-btn'; }
	get calendarToggleClass() { return this.isCalendarView ? 'toggle-btn active' : 'toggle-btn'; }

	get viewButtonLabel() {
		return this.isGridView ? 'Calendar View' : 'Grid View';
	}

	get viewButtonIcon() {
		return this.isGridView ? 'utility:event' : 'utility:table';
	}

	toggleView() {
		this.viewMode = this.isGridView ? 'calendar' : 'grid';

		// when switching to calendar, ensure rail height syncs
		if (this.viewMode === 'calendar') {
			setTimeout(() => { try { this.syncRailHeight(); } catch (e) {} }, 0);
		}
	}

	// Month navigation for calendar view
	nextPeriod() {
		const d = new Date(this.currentMonthDate);
		if (this.calendarMode === 'weekly') {
			d.setDate(d.getDate() + 7);
		} else {
			d.setMonth(d.getMonth() + 1);
		}
		this.currentMonthDate = d;
		setTimeout(() => { try { this.syncRailHeight(); } catch (e) {} }, 0);
	}

	prevPeriod() {
		const d = new Date(this.currentMonthDate);
		if (this.calendarMode === 'weekly') {
			d.setDate(d.getDate() - 7);
		} else {
			d.setMonth(d.getMonth() - 1);
		}
		this.currentMonthDate = d;
		setTimeout(() => { try { this.syncRailHeight(); } catch (e) {} }, 0);
	}

	// Jump to today
	goToToday() {
		this.currentMonthDate = new Date();
		setTimeout(() => { try { this.syncRailHeight(); } catch (e) {} }, 0);
	}

	get calendarTitle() {
		if (this.isWeeklyView) return this.weekRangeLabel;
		return this.calendarMonthLabel;
	}

	get calendarSubLabel() {
		if (this.isWeeklyView) return 'Week view';
		return this.calendarMonthLabel;
	}

	get calendarMonthLabel() {
		return this.currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	}

	get weekRangeLabel() {
		const start = this.weekStartDate;
		const end = new Date(start);
		end.setDate(start.getDate() + 6);
		const opts = { month: 'short', day: 'numeric' };
		const startLabel = start.toLocaleDateString('en-US', opts);
		const endLabel = end.toLocaleDateString('en-US', opts);
		const year = start.getFullYear() === end.getFullYear() ? start.getFullYear() : `${start.getFullYear()} / ${end.getFullYear()}`;
		return `${startLabel} - ${endLabel}, ${year}`;
	}

	get weekStartDate() {
		const d = new Date(this.currentMonthDate);
		const day = (d.getDay() + 6) % 7; // Monday-based
		d.setDate(d.getDate() - day);
		d.setHours(0, 0, 0, 0);
		return d;
	}

	// Calendar helpers
	formatDateKey(dateObj) {
		return [dateObj.getFullYear(), String(dateObj.getMonth() + 1).padStart(2, '0'), String(dateObj.getDate()).padStart(2, '0')].join('-');
	}

	// Split a title into lines with a fixed number of words per line
	splitTitleIntoLines(title = '', id = 'ln', wordsPerLine = 2) {
		if (!title || typeof title !== 'string') return [];
		const words = title.trim().split(/\s+/);
		const lines = [];
		for (let i = 0; i < words.length; i += wordsPerLine) {
			const slice = words.slice(i, i + wordsPerLine).join(' ');
			lines.push({ id: `${id}-l${i / wordsPerLine}`, text: slice });
		}
		return lines;
	}

	get eventsForCalendar() {
		return this.filteredData
			.filter(item => item.dueDate)
			.map(item => {
				const dateObj = new Date(item.dueDate);
				return {
					id: item.id,
					title: item.subject || 'Event',
					description: item.projectName || '',
					status: item.status,
					dateObj,
					dateKey: this.formatDateKey(dateObj)
				};
			});
	}

	// assign css classes for events and allow demo/random events to appear
	assignCssToEvent(evt) {
		// map status to colors: Upcoming -> blue, Completed -> green, Overdue -> purple
		let color = 'event-blue';
		if (evt.status === 'Completed') color = 'event-green';
		else if (evt.status === 'Overdue') color = 'event-purple';
		else if (evt.status === 'Upcoming') color = 'event-blue';
		return {
			...evt,
			cssClass: `event-pill ${color}`,
			lines: this.splitTitleIntoLines(evt.title || '', evt.id || `e-${Date.now()}`, 2)
		};
	}

	get eventsByDate() {
		const base = this.eventsForCalendar.reduce((acc, evt) => {
			const key = evt.dateKey;
			if (!acc[key]) acc[key] = [];
			acc[key].push(this.assignCssToEvent(evt));
			return acc;
		}, {});

		// deterministically generate demo events per-day based on the date key so
		// subjects/colors remain stable across renders and tab navigation
		const year = this.currentMonthDate.getFullYear();
		const month = this.currentMonthDate.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const demoTitles = ['Site meeting','Initiation','Review','Call','Checkpoint','Training','Follow-up'];
		const colorOptions = ['event-blue', 'event-green', 'event-purple'];

		const hashString = (s) => {
			let h = 0;
			for (let i = 0; i < s.length; i++) {
				h = (h << 5) - h + s.charCodeAt(i);
				h |= 0;
			}
			return Math.abs(h);
		};

		for (let d = 1; d <= daysInMonth; d++) {
			const key = this.formatDateKey(new Date(year, month, d));
			if (!base[key]) base[key] = [];
			// limit to max 3 events per day including real events
			const existing = base[key] || [];
			const maxPerDay = 3;
			const slotsLeft = Math.max(0, maxPerDay - existing.length);
			if (slotsLeft <= 0) continue;

			// deterministic seed from key and month to vary across dates
			const seed = hashString(key + 'stable-seed');
			const toAdd = seed % (slotsLeft + 1); // 0..slotsLeft
			for (let i = 0; i < toAdd; i++) {
				const idx = (seed + i) % demoTitles.length;
				const title = demoTitles[idx];
				const color = colorOptions[(seed + i) % colorOptions.length];
				base[key].push({
					id: `${key}-demo-${i}-${(seed + i).toString(36)}`,
					title,
					description: '',
					status: 'Upcoming',
					dateObj: new Date(year, month, d),
					dateKey: key,
					_demoColor: color
				});
			}
		}

		// Ensure the specific date range 2026-01-06 -> 2026-01-20 has at least one demo subject
		try {
			const ensureStart = new Date(2026, 0, 6); // Jan is month 0
			const ensureEnd = new Date(2026, 0, 20);
			for (let day = new Date(ensureStart); day <= ensureEnd; day.setDate(day.getDate() + 1)) {
				const key = this.formatDateKey(new Date(day));
				if (!base[key] || base[key].length === 0) {
					const seed = hashString(key + '-ensure');
					const color = colorOptions[seed % colorOptions.length];
					base[key] = base[key] || [];
					base[key].push({
						id: `${key}-ensure-${seed.toString(36)}`,
						title: 'Demo Task',
						description: '',
						status: 'Upcoming',
						dateObj: new Date(day),
						dateKey: key,
						_demoColor: color
					});
				}
			}
		} catch (e) {
			// fail-safe: don't block calendar generation if something unexpected happens
		}

		// Ensure every event has `lines` for rendering (monthly/weekly/daily)
		Object.keys(base).forEach(k => {
			base[k] = base[k].map(ev => ({
				...ev,
				lines: ev.lines || this.splitTitleIntoLines(ev.title || '', ev.id || `${k}-gen`, 2)
			}));
		});

		return base;
	}

	get currentMonthEvents() {
		const month = this.currentMonthDate.getMonth();
		const year = this.currentMonthDate.getFullYear();
		return this.eventsForCalendar.filter(evt => evt.dateObj.getMonth() === month && evt.dateObj.getFullYear() === year);
	}

	get upcomingEvents() {
		return [...this.currentMonthEvents]
			.sort((a, b) => a.dateObj - b.dateObj)
			.slice(0, 4)
			.map(evt => ({
				...evt,
				day: evt.dateObj.getDate(),
				time: '09:00',
				location: evt.description
			}));
	}

	get hasUpcomingEvents() { return this.upcomingEvents.length > 0; }

	// Status-based lists for calendar rail
	get upcomingList() {
		return this.eventsForCalendar
			.filter(e => e.status === 'Upcoming')
			.sort((a, b) => a.dateObj - b.dateObj)
			.slice(0, 6)
			.map(evt => ({ id: evt.id, title: evt.title, day: evt.dateObj.getDate(), time: '09:00', description: evt.description }));
	}

	get overdueList() {
		return this.eventsForCalendar
			.filter(e => e.status === 'Overdue')
			.sort((a, b) => a.dateObj - b.dateObj)
			.slice(0, 6)
			.map(evt => ({ id: evt.id, title: evt.title, day: evt.dateObj.getDate(), time: '09:00', description: evt.description }));
	}

	get completedList() {
		return this.eventsForCalendar
			.filter(e => e.status === 'Completed')
			.sort((a, b) => a.dateObj - b.dateObj)
			.slice(0, 6)
			.map(evt => ({ id: evt.id, title: evt.title, day: evt.dateObj.getDate(), time: '09:00', description: evt.description }));
	}

	get hasUpcomingList() { return this.upcomingList.length > 0; }
	get hasOverdueList() { return this.overdueList.length > 0; }
	get hasCompletedList() { return this.completedList.length > 0; }

	get calendarDays() {
		const year = this.currentMonthDate.getFullYear();
		const month = this.currentMonthDate.getMonth();
		const first = new Date(year, month, 1);
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const leading = (first.getDay() + 6) % 7; // shift Sunday to end so Monday is first
		const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;
		const eventsMap = this.eventsByDate;
		const todayKey = this.formatDateKey(new Date());
		const cells = [];

		for (let i = 0; i < leading; i++) {
			cells.push({ key: `pad-${i}`, label: '', events: [], isToday: false, isDimmed: true });
		}

		for (let day = 1; day <= daysInMonth; day++) {
			const dateObj = new Date(year, month, day);
			const key = this.formatDateKey(dateObj);
			// assign colors per-event in the order: green, blue, purple so multiple items differ
			const evts = (eventsMap[key] || []).map((e, idx) => {
				const colors = ['event-green', 'event-blue', 'event-purple'];
				const color = e && e._demoColor ? e._demoColor : colors[idx % colors.length];
				return { ...e, cssClass: `event-pill ${color}` };
			});
			cells.push({
				key,
				label: day,
				events: evts,
				isToday: key === todayKey,
				isDimmed: false
			});
		}

		while (cells.length < totalCells) {
			const idx = cells.length - (leading + daysInMonth);
			cells.push({ key: `post-${idx}`, label: '', events: [], isToday: false, isDimmed: true });
		}

		return cells;
	}

	get miniCalendarDays() {
		// reuse month grid for the mini calendar
		return this.calendarDays;
	}

	formatMinutes(total) {
		const h = Math.floor(total / 60);
		const m = total % 60;
		const labelH = ((h + 11) % 12) + 1;
		const ampm = h >= 12 ? 'PM' : 'AM';
		return `${labelH}:${String(m).padStart(2, '0')} ${ampm}`;
	}

	decorateWeeklyEvents(events = [], dayIndex = 0) {
		const preferredStarts = [180, 360, 420, 450, 510]; // 3:00, 6:00, 7:00, 7:30, 8:30
		const defaultDuration = 60;
		return events.map((e, idx) => {
			const colors = ['event-green', 'event-blue', 'event-purple'];
			const color = e && e._demoColor ? e._demoColor : colors[idx % colors.length];
			const startMinutes = e.startMinutes ?? preferredStarts[idx % preferredStarts.length];
			const duration = e.duration ?? defaultDuration;
			const top = (startMinutes / 60) * this.hourBlockHeight;
			const height = Math.max(40, (duration / 60) * this.hourBlockHeight);
			const endMinutes = startMinutes + duration;
			return {
				...e,
				cssClass: `week-event event-pill ${color}`,
				timeLabel: `${this.formatMinutes(startMinutes)} - ${this.formatMinutes(endMinutes)}`,
				style: `top:${top}px;height:${height}px;`
			};
		});
	}

	get weeklyDaysDetailed() {
		const start = this.weekStartDate;
		const todayKey = this.formatDateKey(new Date());
		const map = this.eventsByDate;
		const days = [];
		for (let i = 0; i < 7; i++) {
			const dateObj = new Date(start);
			dateObj.setDate(start.getDate() + i);
			const key = this.formatDateKey(dateObj);
			const evts = this.decorateWeeklyEvents(map[key] || [], i);
			days.push({
				key,
				weekday: this.weekDays[i],
				date: dateObj.getDate(),
				isToday: key === todayKey,
				events: evts
			});
		}
		return days;
	}

	get dailyDetailed() {
		const dateObj = new Date(this.currentMonthDate);
		dateObj.setHours(0,0,0,0);
		const key = this.formatDateKey(dateObj);
		const map = this.eventsByDate;
		const evts = this.decorateWeeklyEvents(map[key] || [], 0);
		return {
			key,
			weekday: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
			date: dateObj.getDate(),
			isToday: key === this.formatDateKey(new Date()),
			events: evts
		};
	}

	get timeSlots() {
		const slots = [];
		for (let h = 0; h <= 23; h++) {
			slots.push({ key: `h-${h}`, label: this.formatMinutes(h * 60) });
		}
		return slots;
	}

	// Filtering / Search
	handleSearchChange(event) { this.searchKey = event.target.value; this.pageIndex = 0; }

	// Filters: Status dropdown and due date range
	showStatusDropdown = false;
	statusOptions = [
		{ label: 'Upcoming', value: 'Upcoming', checked: false },
		{ label: 'Overdue', value: 'Overdue', checked: false },
		{ label: 'Completed', value: 'Completed', checked: false }
	];
	selectedStatus = [];

	dueDateFrom = '';
	dueDateTo = '';

	get statusDropdownClass() { return this.showStatusDropdown ? 'dropdown-menu show' : 'dropdown-menu'; }

	toggleStatusDropdown() { this.showStatusDropdown = !this.showStatusDropdown; }

	handleStatusCheckboxChange(event) {
		const value = event.target.value;
		const checked = event.target.checked;
		this.statusOptions = this.statusOptions.map(opt => opt.value === value ? { ...opt, checked } : opt);
	}

	handleDueDateFromChange(event) { this.dueDateFrom = event.target.value; }
	handleDueDateToChange(event) { this.dueDateTo = event.target.value; }

	applyFilter() {
		this.selectedStatus = this.statusOptions.filter(o => o.checked).map(o => o.value);
		this.showStatusDropdown = false;
		this.pageIndex = 0;
	}

	clearAllFilters() {
		this.statusOptions = this.statusOptions.map(opt => ({ ...opt, checked: false }));
		this.selectedStatus = [];
		this.dueDateFrom = '';
		this.dueDateTo = '';
		this.showStatusDropdown = false;
	}

	get statusDisplayText() { const count = this.statusOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }

	// Sorting
	handleSort(event) {
		const field = event.currentTarget.dataset.field;
		if (!field) return;
		if (this.sortField === field) {
			this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortField = field;
			this.sortOrder = 'asc';
		}
		this.pageIndex = 0;
	}

	get filteredData() {
		let temp = [...this.data];
		if (this.selectedStatus.length > 0) {
			temp = temp.filter(item => this.selectedStatus.includes(item.status));
		}
		if (this.dueDateFrom) {
			const from = new Date(this.dueDateFrom);
			temp = temp.filter(item => item.dueDate ? new Date(item.dueDate) >= from : false);
		}
		if (this.dueDateTo) {
			const to = new Date(this.dueDateTo);
			temp = temp.filter(item => item.dueDate ? new Date(item.dueDate) <= to : false);
		}
		if (this.searchKey && this.searchKey.trim() !== '') {
			const key = this.searchKey.trim().toLowerCase();
			temp = temp.filter(i =>
				(i.subject && i.subject.toLowerCase().includes(key)) ||
				(i.projectName && i.projectName.toLowerCase().includes(key)) ||
				(i.responsibility && i.responsibility.toLowerCase().includes(key)) ||
				(i.sponsorName && i.sponsorName.toLowerCase().includes(key))
			);
		}

		// Apply sorting
		if (this.sortField) {
			temp.sort((a, b) => {
				let valA = a[this.sortField] || '';
				let valB = b[this.sortField] || '';
				if (typeof valA === 'string') valA = valA.toLowerCase();
				if (typeof valB === 'string') valB = valB.toLowerCase();
				if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
				if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
				return 0;
			});
		}

		return temp;
	}

	get totalSize() { return this.filteredData.length; }
	get totalPages() { return Math.max(1, Math.ceil(this.totalSize / this.pageSize)); }
	get pageNumber() { return this.pageIndex + 1; }
	get pagedData() { const start = this.pageIndex * this.pageSize; return this.filteredData.slice(start, start + this.pageSize); }
	get isFirstPage() { return this.pageIndex === 0; }
	get isLastPage() { return this.pageIndex >= this.totalPages - 1; }
	get startRecord() { if (this.totalSize === 0) return 0; return this.pageIndex * this.pageSize + 1; }
	get endRecord() { return Math.min(this.totalSize, (this.pageIndex + 1) * this.pageSize); }

	nextPage() { if (!this.isLastPage) { this.pageIndex = Math.min(this.pageIndex + 1, this.totalPages - 1); } }
	previousPage() { if (!this.isFirstPage) { this.pageIndex = Math.max(this.pageIndex - 1, 0); } }
	goToFirst() { this.pageIndex = 0; }
	goToLast() { this.pageIndex = Math.max(0, this.totalPages - 1); }

	handlePageSizeChange(event) { const newSize = parseInt(event.target.value, 10); if (!isNaN(newSize) && newSize > 0) { this.pageSize = newSize; this.pageIndex = 0; } }
	handlePage(event) { const payload = event && event.detail ? event.detail : event; if (!payload) return; if (typeof payload.pageSize === 'number') { this.pageSize = payload.pageSize; } if (typeof payload.pageIndex === 'number') { this.pageIndex = payload.pageIndex; } }

	// Action handlers
	handleEdit(event) { const id = event.currentTarget.dataset.id; this.dispatchEvent(new CustomEvent('edit', { detail: { id } })); }
	handleDelete(event) { const id = event.currentTarget.dataset.id; this.dispatchEvent(new CustomEvent('delete', { detail: { id } })); }

	// Toggle filters panel
	toggleFilters() {
		this.showFilters = !this.showFilters;
		if (!this.showFilters) {
			this.showStatusDropdown = false;
		}
	}

	closeFilter() {
		this.showFilters = false;
		this.showStatusDropdown = false;
	}

	openAddModal() {
		this.editRecordId = '';
		this.formStatus = 'Upcoming';
		this.showAddModal = true;
	}

	closeAddModal() {
		this.showAddModal = false;
	}

	openEditModal() {
		this.showEditModal = true;
	}

	closeEditModal() {
		this.showEditModal = false;
	}

	handleInputChange(event) {
		const { name, value } = event.target;
		if (name && Object.prototype.hasOwnProperty.call(this, name)) {
			this[name] = value;
		}
	}

	saveTodo() {
		// create new todo record and close modal
		const id = `tmp-${Date.now()}`;
		const newRec = {
			id,
			status: this.formStatus || 'Upcoming',
			subject: this.formSubject,
			dueDate: this.formDueDate,
			projectName: this.formProjectName,
			responsibility: this.formResponsibility,
			hsName: this.formHsName,
			hsPhoto: '',
			sponsorName: this.formSponsorName,
			sponsorPhoto: '',
			dateCreated: new Date().toISOString().slice(0,10),
			lastUpdated: new Date().toISOString().slice(0,10)
		};
		newRec.statusClass = this.computeStatusClass(newRec.status);
		this.data = [newRec, ...this.data];
		this.closeAddModal();
	}

	computeStatusClass(status) {
		let statusClass = 'badge-soft-info border border-info';
		if (status === 'Completed') statusClass = 'badge-soft-success border border-success';
		else if (status === 'Overdue') statusClass = 'badge-soft-danger border border-danger';
		else if (status === 'Upcoming') statusClass = 'badge-soft-info border border-info';
		return statusClass;
	}

	handleEdit(event) {
		const id = event.currentTarget.dataset.id;
		if (!id) return;
		// find record
		const rec = this.data.find(r => r.id === id) || this.filteredData.find(r => r.id === id);
		if (!rec) return;
		this.editRecordId = id;
		this.formSubject = rec.subject || '';
		this.formDueDate = rec.dueDate || '';
		this.formProjectName = rec.projectName || '';
		this.formResponsibility = rec.responsibility || '';
		this.formHsName = rec.hsName || '';
		this.formSponsorName = rec.sponsorName || '';
		this.formStatus = rec.status || 'Upcoming';
		this.openEditModal();
	}

	saveEdit() {
		if (!this.editRecordId) return this.closeEditModal();
		const idx = this.data.findIndex(r => r.id === this.editRecordId);
		if (idx === -1) {
			this.closeEditModal();
			return;
		}
		const updated = { ...this.data[idx] };
		updated.subject = this.formSubject;
		updated.dueDate = this.formDueDate;
		updated.projectName = this.formProjectName;
		updated.responsibility = this.formResponsibility;
		updated.hsName = this.formHsName;
		updated.sponsorName = this.formSponsorName;
		updated.status = this.formStatus;
		updated.statusClass = this.computeStatusClass(updated.status);
		updated.lastUpdated = new Date().toISOString().slice(0,10);
		this.data = [...this.data.slice(0, idx), updated, ...this.data.slice(idx + 1)];
		this.closeEditModal();
	}

	get isSortedBy() {
		return {
			status: this.sortField === 'status',
			subject: this.sortField === 'subject',
			dueDate: this.sortField === 'dueDate',
			completionDate: this.sortField === 'completionDate',
			projectName: this.sortField === 'projectName',
			responsibility: this.sortField === 'responsibility',
			hsName: this.sortField === 'hsName',
			sponsorName: this.sortField === 'sponsorName',
			dateCreated: this.sortField === 'dateCreated',
			lastUpdated: this.sortField === 'lastUpdated'
		};
	}

	get sortDirection() { return this.sortOrder === 'asc' ? 'sorting-arrow-asc' : 'sorting-arrow-desc'; }

	// Keep the left rail's upcoming list height matched to the calendar main height
	syncRailHeight() {
		if (!this.template) return;
		const calendarMain = this.template.querySelector('.calendar-main');
		const calendarRail = this.template.querySelector('.calendar-rail');
		const miniCalendar = this.template.querySelector('.mini-calendar-card');
		const statusCards = this.template.querySelector('.status-cards');
		if (!calendarMain || !calendarRail || !statusCards) return;

		// match the left rail container height to the calendar main height
		const calH = calendarMain.clientHeight;
		calendarRail.style.height = `${calH}px`;
		calendarRail.style.overflow = 'hidden';

		// compute available height for the upcoming list: calendar height minus mini calendar and card header
		const miniH = miniCalendar ? miniCalendar.offsetHeight : 0;
		const upcomingCard = statusCards.querySelector('.status-card');
		const headerEl = upcomingCard ? upcomingCard.querySelector('.card-header') : null;
		const headerH = headerEl ? headerEl.offsetHeight : 0;
		const reserved = miniH + headerH + 24; // small padding allowance

		const upcomingList = statusCards.querySelector('.upcoming-list');
		if (upcomingList) {
			const max = Math.max(80, calH - reserved);
			upcomingList.style.maxHeight = `${max}px`;
			upcomingList.style.overflowY = 'auto';
		}
		// also ensure statusCards doesn't overflow the rail
		statusCards.style.maxHeight = `${calH}px`;
		statusCards.style.overflow = 'hidden';
	}

	renderedCallback() {
		if (this.isCalendarView) {
			// sync after rendering
			setTimeout(() => { try { this.syncRailHeight(); } catch (e) {} }, 0);
		}
	}

	disconnectedCallback() {
		if (this._boundSync) window.removeEventListener('resize', this._boundSync);
	}
}