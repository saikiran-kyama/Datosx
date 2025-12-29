import { LightningElement } from 'lwc';
import AVATARS from '@salesforce/resourceUrl/avatars';

export default class HealthSystems extends LightningElement {
    // View state
    showDetail = false;
    selectedProjectId = '';
    selectedProject = null;
    
    // Filters
    showFilters = false;
    searchKey = '';
    statusDropdownOpen = false;
    stateDropdownOpen = false;
    cityDropdownOpen = false;
    mndaDropdownOpen = false;
    loiDropdownOpen = false;
    msaDropdownOpen = false;
    searchKey = '';
    statusDropdownOpen = false;
    stateDropdownOpen = false;
    cityDropdownOpen = false;
    mndaDropdownOpen = false;
    loiDropdownOpen = false;
    msaDropdownOpen = false;
    selectedStatus = [];
    selectedCities = [];
    selectedStates = [];
    selectedMnda = [];
    selectedLoi = [];
    selectedMsa = [];
    stateSearchTerm = '';
    citySearchTerm = '';
    
    // Sorting
    sortField = '';
    sortOrder = 'asc'; // 'asc' or 'desc'
    
    // Data
    data = [
        { id: '1', hsId: 'HS-001', hsName: 'Lakeside Health', status: 'Active', projects: 5, matches: 7, docs: 12, legal: 3, messages: 17, state: 'Texas', city: 'Houston', contact: 'Dr. Michael Stone', contactPhoto: `${AVATARS}/1.svg.jpg`, healthPhoto: `${AVATARS}/HS1.png`, email: 'michael.stone@lakesidehealth.com', phone: '+1-713-555-0101', lastUpdated: '2025-11-01' },
        { id: '2', hsId: 'HS-002', hsName: 'Sunshine Medical', status: 'Onboarding', projects: 3, matches: 4, docs: 6, legal: 2, messages: 8, state: 'Florida', city: 'Miami', contact: 'Dr. Ana Garcia', contactPhoto: `${AVATARS}/2.svg.jpg`, healthPhoto: `${AVATARS}/HS2.png`, email: 'ana.garcia@sunshinemed.com', phone: '+1-305-555-0112', lastUpdated: '2025-10-28' },
        { id: '3', hsId: 'HS-003', hsName: 'Bayview Health', status: 'Active', projects: 8, matches: 10, docs: 15, legal: 5, messages: 22, state: 'California', city: 'San Francisco', contact: 'Dr. Emily Chen', contactPhoto: `${AVATARS}/3.svg.jpg`, healthPhoto: `${AVATARS}/HS3.png`, email: 'emily.chen@bayviewhealth.com', phone: '+1-415-555-0123', lastUpdated: '2025-11-10' },
        { id: '4', hsId: 'HS-004', hsName: 'Riverview Medical', status: 'Onboarding', projects: 2, matches: 1, docs: 3, legal: 1, messages: 3, state: 'New York', city: 'Albany', contact: 'Dr. Steven Clark', contactPhoto: `${AVATARS}/4.svg.jpg`, healthPhoto: `${AVATARS}/HS4.png`, email: 'steven.clark@riverview.com', phone: '+1-518-555-0134', lastUpdated: '2025-10-15' },
        { id: '5', hsId: 'HS-005', hsName: 'Mountain Health', status: 'Active', projects: 6, matches: 9, docs: 10, legal: 2, messages: 14, state: 'Colorado', city: 'Denver', contact: 'Dr. Laura Bennett', contactPhoto: `${AVATARS}/5.svg.jpg`, healthPhoto: `${AVATARS}/HS5.png`, email: 'laura.bennett@mountainhealth.com', phone: '+1-303-555-0145', lastUpdated: '2025-11-05' },
        { id: '6', hsId: 'HS-006', hsName: 'Prairie Care', status: 'Active', projects: 4, matches: 5, docs: 7, legal: 1, messages: 9, state: 'Illinois', city: 'Chicago', contact: 'Dr. Raj Patel', contactPhoto: `${AVATARS}/6.svg.jpg`, healthPhoto: `${AVATARS}/HS6.png`, email: 'raj.patel@prairiecare.com', phone: '+1-312-555-0156', lastUpdated: '2025-10-22' },
        { id: '7', hsId: 'HS-007', hsName: 'Coastal General', status: 'Onboarding', projects: 1, matches: 2, docs: 2, legal: 0, messages: 2, state: 'Georgia', city: 'Atlanta', contact: 'Dr. Karen White', contactPhoto: `${AVATARS}/7.svg.jpg`, healthPhoto: `${AVATARS}/HS7.png`, email: 'karen.white@coastalgen.com', phone: '+1-404-555-0167', lastUpdated: '2025-09-30' },
        { id: '8', hsId: 'HS-008', hsName: 'Desert Springs', status: 'Active', projects: 7, matches: 8, docs: 11, legal: 4, messages: 19, state: 'Arizona', city: 'Phoenix', contact: 'Dr. Omar Ruiz', contactPhoto: `${AVATARS}/8.svg.jpg`, healthPhoto: `${AVATARS}/HS8.png`, email: 'omar.ruiz@desertsprings.com', phone: '+1-602-555-0178', lastUpdated: '2025-11-11' },
        { id: '9', hsId: 'HS-009', hsName: 'Riverbend Health', status: 'Active', projects: 5, matches: 6, docs: 9, legal: 2, messages: 11, state: 'Ohio', city: 'Columbus', contact: 'Dr. Megan Lee', contactPhoto: `${AVATARS}/1.svg.jpg`, healthPhoto: `${AVATARS}/HS1.png`, email: 'megan.lee@riverbend.com', phone: '+1-614-555-0189', lastUpdated: '2025-11-02' },
        { id: '10', hsId: 'HS-010', hsName: 'Harbor Medical', status: 'Onboarding', projects: 2, matches: 3, docs: 4, legal: 1, messages: 5, state: 'North Carolina', city: 'Charlotte', contact: 'Dr. Paul Gordon', contactPhoto: `${AVATARS}/2.svg.jpg`, healthPhoto: `${AVATARS}/HS2.png`, email: 'paul.gordon@harbormed.com', phone: '+1-704-555-0190', lastUpdated: '2025-10-18' },
        { id: '11', hsId: 'HS-011', hsName: 'Lakeshore Clinic', status: 'Active', projects: 9, matches: 12, docs: 18, legal: 6, messages: 26, state: 'Michigan', city: 'Detroit', contact: 'Dr. Nina Shah', contactPhoto: `${AVATARS}/3.svg.jpg`, healthPhoto: `${AVATARS}/HS3.png`, email: 'nina.shah@lakeshoreclinic.com', phone: '+1-313-555-0201', lastUpdated: '2025-11-12' },
        { id: '12', hsId: 'HS-012', hsName: 'Cedar Valley Health', status: 'Active', projects: 3, matches: 4, docs: 5, legal: 1, messages: 6, state: 'Minnesota', city: 'Minneapolis', contact: 'Dr. Erik Olson', contactPhoto: `${AVATARS}/4.svg.jpg`, healthPhoto: `${AVATARS}/HS4.png`, email: 'erik.olson@cedarvalley.com', phone: '+1-612-555-0212', lastUpdated: '2025-10-29' },
        { id: '13', hsId: 'HS-013', hsName: 'Blue Ridge Medical', status: 'Onboarding', projects: 2, matches: 2, docs: 3, legal: 0, messages: 3, state: 'Virginia', city: 'Richmond', contact: 'Dr. Claire Adams', contactPhoto: `${AVATARS}/5.svg.jpg`, healthPhoto: `${AVATARS}/HS5.png`, email: 'claire.adams@blueridge.com', phone: '+1-804-555-0223', lastUpdated: '2025-09-25' },
        { id: '14', hsId: 'HS-014', hsName: 'Pinecrest Health', status: 'Active', projects: 6, matches: 7, docs: 10, legal: 2, messages: 13, state: 'Tennessee', city: 'Nashville', contact: 'Dr. Henry Moore', contactPhoto: `${AVATARS}/6.svg.jpg`, healthPhoto: `${AVATARS}/HS6.png`, email: 'henry.moore@pinecrest.com', phone: '+1-615-555-0234', lastUpdated: '2025-11-07' },
        { id: '15', hsId: 'HS-015', hsName: 'Gulf Coast Health', status: 'Active', projects: 4, matches: 5, docs: 8, legal: 1, messages: 10, state: 'Louisiana', city: 'New Orleans', contact: 'Dr. Isabelle Martin', contactPhoto: `${AVATARS}/7.svg.jpg`, healthPhoto: `${AVATARS}/HS7.png`, email: 'isabelle.martin@gulfcoast.com', phone: '+1-504-555-0245', lastUpdated: '2025-10-09' },
        { id: '16', hsId: 'HS-016', hsName: 'Summit Medical', status: 'Onboarding', projects: 1, matches: 1, docs: 1, legal: 0, messages: 1, state: 'Indiana', city: 'Indianapolis', contact: 'Dr. Tom Baker', contactPhoto: `${AVATARS}/8.svg.jpg`, healthPhoto: `${AVATARS}/HS8.png`, email: 'tom.baker@summitmed.com', phone: '+1-317-555-0256', lastUpdated: '2025-10-05' },
        { id: '17', hsId: 'HS-017', hsName: 'Central Plains Health', status: 'Active', projects: 5, matches: 6, docs: 9, legal: 2, messages: 12, state: 'Missouri', city: 'Kansas City', contact: 'Dr. Olivia Park', contactPhoto: `${AVATARS}/1.svg.jpg`, healthPhoto: `${AVATARS}/HS1.png`, email: 'olivia.park@centralplains.com', phone: '+1-816-555-0267', lastUpdated: '2025-11-03' },
        { id: '18', hsId: 'HS-018', hsName: 'Harborview Health', status: 'Active', projects: 7, matches: 8, docs: 13, legal: 3, messages: 20, state: 'Washington', city: 'Seattle', contact: 'Dr. Carlos Gomez', contactPhoto: `${AVATARS}/2.svg.jpg`, healthPhoto: `${AVATARS}/HS2.png`, email: 'carlos.gomez@harborview.com', phone: '+1-206-555-0278', lastUpdated: '2025-11-09' },
        { id: '19', hsId: 'HS-019', hsName: 'Harborpoint Clinic', status: 'Onboarding', projects: 2, matches: 2, docs: 2, legal: 0, messages: 4, state: 'Massachusetts', city: 'Boston', contact: 'Dr. Sara Bennett', contactPhoto: `${AVATARS}/3.svg.jpg`, healthPhoto: `${AVATARS}/HS3.png`, email: 'sara.bennett@harborpoint.com', phone: '+1-617-555-0289', lastUpdated: '2025-09-20' },
        { id: '20', hsId: 'HS-020', hsName: 'Valley Regional', status: 'Active', projects: 10, matches: 14, docs: 22, legal: 7, messages: 30, state: 'California', city: 'Los Angeles', contact: 'Dr. William Hart', contactPhoto: `${AVATARS}/4.svg.jpg`, healthPhoto: `${AVATARS}/HS4.png`, email: 'william.hart@valleyregional.com', phone: '+1-323-555-0290', lastUpdated: '2025-11-13' }
    ];
    statusOptions = [
        { label: 'Active', value: 'Active', checked: false },
        { label: 'Onboarding', value: 'Onboarding', checked: false }
    ];
    stateOptionsBase = [
        { label: 'Telangana', value: 'Telangana', checked: false },
        { label: 'Delhi', value: 'Delhi', checked: false },
        { label: 'Maharashtra', value: 'Maharashtra', checked: false },
        { label: 'Karnataka', value: 'Karnataka', checked: false }
    ];
    cityOptionsBase = [
        { label: 'Hyderabad', value: 'Hyderabad', checked: false },
        { label: 'Delhi', value: 'Delhi', checked: false },
        { label: 'Mumbai', value: 'Mumbai', checked: false },
        { label: 'Bangalore', value: 'Bangalore', checked: false }
    ];
    mndaOptions = [
        { label: 'Under Partner Review', value: 'Under Partner Review', checked: false },
        { label: 'Under datosX Review', value: 'Under datosX Review', checked: false },
        { label: 'Pending for signatures', value: 'Pending for signatures', checked: false },
        { label: 'Signed', value: 'Signed', checked: false }
    ];
    loiOptions = [
        { label: 'Under Partner Review', value: 'Under Partner Review', checked: false },
        { label: 'Under datosX Review', value: 'Under datosX Review', checked: false },
        { label: 'Pending for signatures', value: 'Pending for signatures', checked: false },
        { label: 'Signed', value: 'Signed', checked: false }
    ];
    msaOptions = [
        { label: 'Under Partner Review', value: 'Under Partner Review', checked: false },
        { label: 'Under datosX Review', value: 'Under datosX Review', checked: false },
        { label: 'Pending for signatures', value: 'Pending for signatures', checked: false },
        { label: 'Signed', value: 'Signed', checked: false }
    ];
    get statusDropdownClass() { return this.statusDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get stateDropdownClass() { return this.stateDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get cityDropdownClass() { return this.cityDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get mndaDropdownClass() { return this.mndaDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get loiDropdownClass() { return this.loiDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get msaDropdownClass() { return this.msaDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    toggleStatusDropdown() { this.statusDropdownOpen = !this.statusDropdownOpen; this.closeOtherDropdowns('status'); }
    toggleStateDropdown() { this.stateDropdownOpen = !this.stateDropdownOpen; this.closeOtherDropdowns('state'); }
    toggleCityDropdown() { this.cityDropdownOpen = !this.cityDropdownOpen; this.closeOtherDropdowns('city'); }
    toggleMndaDropdown() { this.mndaDropdownOpen = !this.mndaDropdownOpen; this.closeOtherDropdowns('mnda'); }
    toggleLoiDropdown() { this.loiDropdownOpen = !this.loiDropdownOpen; this.closeOtherDropdowns('loi'); }
    toggleMsaDropdown() { this.msaDropdownOpen = !this.msaDropdownOpen; this.closeOtherDropdowns('msa'); }
    closeOtherDropdowns(except) {
        if (except !== 'status') this.statusDropdownOpen = false;
        if (except !== 'state') this.stateDropdownOpen = false;
        if (except !== 'city') this.cityDropdownOpen = false;
        if (except !== 'mnda') this.mndaDropdownOpen = false;
        if (except !== 'loi') this.loiDropdownOpen = false;
        if (except !== 'msa') this.msaDropdownOpen = false;
    }
    get filteredStateOptions() { return this.stateSearchTerm ? this.stateOptionsBase.filter(opt => opt.label.toLowerCase().includes(this.stateSearchTerm.toLowerCase())) : this.stateOptionsBase; }
    get filteredCityOptions() { return this.citySearchTerm ? this.cityOptionsBase.filter(opt => opt.label.toLowerCase().includes(this.citySearchTerm.toLowerCase())) : this.cityOptionsBase; }
    get statusDisplayText() { const count = this.statusOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get stateDisplayText() { const count = this.stateOptionsBase.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get cityDisplayText() { const count = this.cityOptionsBase.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get mndaDisplayText() { const count = this.mndaOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get loiDisplayText() { const count = this.loiOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get msaDisplayText() { const count = this.msaOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    toggleFilters() { this.showFilters = !this.showFilters; }
    closeFilter() { this.showFilters = false; this.closeOtherDropdowns(''); }
    // Handler for Grid Columns button click. Dispatches an event so a parent can react or implement toggling.
    handleGridColumnsClick() {
        // Placeholder: dispatch an event so other components or the page can show a columns modal/selector
        this.dispatchEvent(new CustomEvent('gridcolumns', { detail: { source: 'healthSystems' } }));
    }
    handleStatusCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.statusOptions = this.statusOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleStateCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.stateOptionsBase = this.stateOptionsBase.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleCityCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.cityOptionsBase = this.cityOptionsBase.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleMndaCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.mndaOptions = this.mndaOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleLoiCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.loiOptions = this.loiOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleMsaCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.msaOptions = this.msaOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleStateSearchInput(event) { this.stateSearchTerm = event.target.value; }
    handleCitySearchInput(event) { this.citySearchTerm = event.target.value; }
    resetStatusFilter() { this.statusOptions = this.statusOptions.map(opt => ({ ...opt, checked: false })); this.selectedStatus = []; }
    resetStateFilter() { this.stateOptionsBase = this.stateOptionsBase.map(opt => ({ ...opt, checked: false })); this.selectedStates = []; }
    resetCityFilter() { this.cityOptionsBase = this.cityOptionsBase.map(opt => ({ ...opt, checked: false })); this.selectedCities = []; }
    resetMndaFilter() { this.mndaOptions = this.mndaOptions.map(opt => ({ ...opt, checked: false })); this.selectedMnda = []; }
    resetLoiFilter() { this.loiOptions = this.loiOptions.map(opt => ({ ...opt, checked: false })); this.selectedLoi = []; }
    resetMsaFilter() { this.msaOptions = this.msaOptions.map(opt => ({ ...opt, checked: false })); this.selectedMsa = []; }
    clearAllFilters() { this.resetStatusFilter(); this.resetStateFilter(); this.resetCityFilter(); this.resetMndaFilter(); this.resetLoiFilter(); this.resetMsaFilter(); }
    applyFilter() {
        this.selectedStatus = this.statusOptions.filter(o => o.checked).map(o => o.value);
        this.selectedStates = this.stateOptionsBase.filter(o => o.checked).map(o => o.value);
        this.selectedCities = this.cityOptionsBase.filter(o => o.checked).map(o => o.value);
        this.selectedMnda = this.mndaOptions.filter(o => o.checked).map(o => o.value);
        this.selectedLoi = this.loiOptions.filter(o => o.checked).map(o => o.value);
        this.selectedMsa = this.msaOptions.filter(o => o.checked).map(o => o.value);
        this.closeOtherDropdowns('');
    }
    // Filtering
    get filteredData() {
        let temp = [...this.data];
        if (this.selectedStatus.length > 0) temp = temp.filter(i => this.selectedStatus.includes(i.status));
        if (this.selectedCities.length > 0) temp = temp.filter(i => this.selectedCities.includes(i.city));
        if (this.selectedStates.length > 0) temp = temp.filter(i => this.selectedStates.includes(i.state));
        if (this.selectedMnda.length > 0) temp = temp.filter(i => this.selectedMnda.includes(i.mnda));
        if (this.selectedLoi.length > 0) temp = temp.filter(i => this.selectedLoi.includes(i.loi));
        if (this.selectedMsa.length > 0) temp = temp.filter(i => this.selectedMsa.includes(i.msa));
        if (this.searchKey && this.searchKey.trim() !== '') {
            const key = this.searchKey.trim().toLowerCase();
            temp = temp.filter(i =>
                (i.hsName && i.hsName.toLowerCase().includes(key)) ||
                (i.city && i.city.toLowerCase().includes(key)) ||
                (i.state && i.state.toLowerCase().includes(key)) ||
                (i.contact && i.contact.toLowerCase().includes(key)) ||
                (i.projectId && i.projectId.toLowerCase().includes(key))
            );
        }
        
        // Apply sorting
        if (this.sortField) {
            temp.sort((a, b) => {
                let valA = a[this.sortField] || '';
                let valB = b[this.sortField] || '';
                
                // Case-insensitive string comparison
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();
                
                if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        return temp;
    }

    connectedCallback() {
        this.data = this.data.map(row => {
            const name = row.contact || '';
            const initials = name.split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
            const hsName = row.hsName || '';
            const hsInitials = hsName.split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
            // Map status to visual class: Active -> green, Onboarding -> info/orange
            let statusClass = 'badge-soft-info border border-info';
            if (row.status === 'Active') statusClass = 'badge-soft-success border border-success';
            else if (row.status === 'Onboarding') statusClass = 'badge-soft-info border border-info';

            return {
                ...row,
                statusClass,
                contactInitials: initials,
                contactPhoto: row.contactPhoto || '',
                healthInitials: hsInitials,
                healthPhoto: row.healthPhoto || ''
            };
        });
    }

    // Pagination settings
    pageSizeOptions = [5, 10, 25, 50, 100];
    pageSize = 25; // rows per page
    pageIndex = 0; // zero-based index

    // Ensure template select reflects current pageSize
    renderedCallback() {
        const sel = this.template.querySelector('#pageSize');
        if (sel && sel.value !== String(this.pageSize)) {
            sel.value = String(this.pageSize);
        }
    }

    // Compute based on filtered data (so filters/search affect pagination)
    get totalSize() {
        return this.filteredData.length;
    }

    get totalPages() {
        return Math.max(1, Math.ceil(this.totalSize / this.pageSize));
    }

    get pageNumber() {
        return this.pageIndex + 1;
    }

    get pagedData() {
        const start = this.pageIndex * this.pageSize;
        return this.filteredData.slice(start, start + this.pageSize);
    }

    get isFirstPage() {
        return this.pageIndex === 0;
    }

    get isLastPage() {
        return this.pageIndex >= this.totalPages - 1;
    }

    get startRecord() {
        if (this.totalSize === 0) return 0;
        return this.pageIndex * this.pageSize + 1;
    }

    get endRecord() {
        return Math.min(this.totalSize, (this.pageIndex + 1) * this.pageSize);
    }

    // Navigation
    nextPage() {
        if (!this.isLastPage) {
            this.pageIndex = Math.min(this.pageIndex + 1, this.totalPages - 1);
        }
    }

    previousPage() {
        if (!this.isFirstPage) {
            this.pageIndex = Math.max(this.pageIndex - 1, 0);
        }
    }

    goToFirst() {
        this.pageIndex = 0;
    }

    goToLast() {
        this.pageIndex = Math.max(0, this.totalPages - 1);
    }

    // Handle select change for page size
    handlePageSizeChange(event) {
        const newSize = parseInt(event.target.value, 10);
        if (!isNaN(newSize) && newSize > 0) {
            this.pageSize = newSize;
            // reset to first page when size changes
            this.pageIndex = 0;
        }
    }

    // Support a mat-paginator-like event or direct usage
    // Accept either an Event with detail {pageIndex, pageSize} or an object
    handlePage(event) {
        const payload = event && event.detail ? event.detail : event;
        if (!payload) return;
        if (typeof payload.pageSize === 'number') {
            this.pageSize = payload.pageSize;
        }
        if (typeof payload.pageIndex === 'number') {
            this.pageIndex = payload.pageIndex;
        }
    }

    // Search input handler (was referenced in template but missing)
    handleSearchChange(event) {
        this.searchKey = event.target.value;
        this.pageIndex = 0; // reset paging when searching
    }

    // Ensure we reset to first page when filters are applied
    applyFilter() {
        this.selectedStatus = this.statusOptions.filter(o => o.checked).map(o => o.value);
        this.selectedStates = this.stateOptionsBase.filter(o => o.checked).map(o => o.value);
        this.selectedCities = this.cityOptionsBase.filter(o => o.checked).map(o => o.value);
        this.selectedMnda = this.mndaOptions.filter(o => o.checked).map(o => o.value);
        this.selectedLoi = this.loiOptions.filter(o => o.checked).map(o => o.value);
        this.selectedMsa = this.msaOptions.filter(o => o.checked).map(o => o.value);
        this.closeOtherDropdowns('');
        this.pageIndex = 0;
    }

    // Sorting helpers
    get isSortedBy() {
        return {
            hsId: this.sortField === 'hsId',
            hsName: this.sortField === 'hsName',
            status: this.sortField === 'status',
            projects: this.sortField === 'projects',
            matches: this.sortField === 'matches',
            messages: this.sortField === 'messages',
            state: this.sortField === 'state',
            city: this.sortField === 'city',
            contact: this.sortField === 'contact',
            email: this.sortField === 'email',
            phone: this.sortField === 'phone',
            lastUpdated: this.sortField === 'lastUpdated'
        };
    }

    get sortDirection() {
        return this.sortOrder === 'asc' ? 'sorting-arrow-asc' : 'sorting-arrow-desc';
    }

    handleSort(event) {
        const field = event.currentTarget.dataset.field;
        if (!field) return;
        
        // Toggle sort order if clicking same field, otherwise default to asc
        if (this.sortField === field) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortOrder = 'asc';
        }
        
        // Reset to first page when sorting changes
        this.pageIndex = 0;
    }

    // Handle Project ID click to navigate to project detail
    handleProjectIdClick(event) {
        const projectId = event.currentTarget.dataset.projectId;
        if (!projectId) return;
        
        this.selectedProjectId = projectId;
        
        // Find the project data from our table (in real app, fetch from server)
        const row = this.data.find(r => r.projectId === projectId);
        if (row) {
            // Map health system data to project object format expected by projectDetail
            this.selectedProject = {
                projectId: row.projectId,
                projectName: row.hsName + ' Project', // Use HS name as project name placeholder
                status: row.status,
                sponsorName: row.hsName, // Using HS name as sponsor for demo
                description: `Project for ${row.hsName}`,
                ownerName: row.contact,
                history: `Historical data for ${row.projectId}`,
                // Add other fields as needed by projectDetail component
                twoPager: '',
                plannedSiteCount: '',
                primaryObjective: '',
                informationType: '',
                secondaryObjectives: '',
                statisticalAnalysis: '',
                populationCriteria: '',
                expectedTimeline: '',
                studyExclusions: '',
                healthSystemChosen: '',
                enrollmentTarget: '',
                submittedBy: row.contact
            };
            this.showDetail = true;
        }
    }

    // Handle back from project detail
    handleBack() {
        this.showDetail = false;
        this.selectedProject = null;
        this.selectedProjectId = '';
    }

    handleEdit(event) {
        const id = event.currentTarget.dataset.id;
        // Dispatch edit event for parent to handle
        this.dispatchEvent(new CustomEvent('edit', {
            detail: { recordId: id, source: 'healthSystems' },
            bubbles: true,
            composed: true
        }));
    }

    handleDelete(event) {
        const id = event.currentTarget.dataset.id;
        // Dispatch delete event for parent to handle
        this.dispatchEvent(new CustomEvent('delete', {
            detail: { recordId: id, source: 'healthSystems' },
            bubbles: true,
            composed: true
        }));
    }

    // Click handlers for the center-aligned numeric/link-like cells
    handleProjectCellClick(event) {
        const id = event.currentTarget.dataset.id;
        this.dispatchEvent(new CustomEvent('cellclick', { detail: { type: 'projects', id }, bubbles: true, composed: true }));
    }

    handleMatchCellClick(event) {
        const id = event.currentTarget.dataset.id;
        this.dispatchEvent(new CustomEvent('cellclick', { detail: { type: 'matches', id }, bubbles: true, composed: true }));
    }

    handleMessageCellClick(event) {
        const id = event.currentTarget.dataset.id;
        this.dispatchEvent(new CustomEvent('cellclick', { detail: { type: 'messages', id }, bubbles: true, composed: true }));
    }
}
