import { LightningElement } from 'lwc';
import AVATARS from '@salesforce/resourceUrl/avatars';

export default class Sponsers extends LightningElement {
    // View state
    showDetail = false;
    selectedProjectId = '';
    selectedProject = null;
    showAddModal = false;
    showEditModal = false;
    editRecordId = '';
    selectedSponsorId = '';
    selectedSponsor = null;
    
    // Filters
    showFilters = false;
    searchKey = '';
    statusDropdownOpen = false;
    mndaDropdownOpen = false;
    loiDropdownOpen = false;
    esaDropdownOpen = false;

    selectedStatus = [];
    selectedMnda = [];
    selectedLoi = [];
    selectedEsa = [];

    // Sorting
    sortField = '';
    sortOrder = 'asc'; // 'asc' or 'desc'

    // Sample Data for Sponsors (updated to match requested columns)
 data = [
  { id: '1', sponsorId: 'SP-001', sponsorName: 'Acme Pharma', status: 'Active', projects: 3, enquiries: 2, messages: 5, state: 'Texas', city: 'Houston', contact: 'Ravi Kumar', ownerPhoto: `${AVATARS}/1.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF1.png`, email: 'ravi.kumar@acmepharma.com', phone: '+1-415-555-0101', lastUpdated: '2025-11-12' },
  { id: '2', sponsorId: 'SP-002', sponsorName: 'BioHealth Ltd', status: 'Onboarding', projects: 3, enquiries: 2, messages: 5, state: 'Florida', city: 'Miami', contact: 'Suman Rao', ownerPhoto: `${AVATARS}/2.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF2.png`, email: 'suman.rao@biohealth.com', phone: '+1-212-555-0199', lastUpdated: '2025-11-05' },
  { id: '3', sponsorId: 'SP-003', sponsorName: 'MedSolutions', status: 'Active', projects: 3, enquiries: 2, messages: 5, state: 'California', city: 'San Diego', contact: 'Anil Mehta', ownerPhoto: `${AVATARS}/3.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF3.png`, email: 'anil.mehta@medsolutions.com', phone: '+1-713-555-0144', lastUpdated: '2025-10-30' },
  { id: '4', sponsorId: 'SP-004', sponsorName: 'Global Trials', status: 'Onboarding', projects: 3, enquiries: 2, messages: 5, state: 'New York', city: 'Buffalo', contact: 'Priya Singh', ownerPhoto: `${AVATARS}/4.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF.png`, email: 'priya.singh@globaltrials.com', phone: '+1-312-555-0123', lastUpdated: '2025-11-01' },

  { id: '5', sponsorId: 'SP-005', sponsorName: 'HealthNova', status: 'Active', projects: 4, enquiries: 3, messages: 8, state: 'Texas', city: 'Dallas', contact: 'Neeraj Patil', ownerPhoto: `${AVATARS}/1.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF1.png`, email: 'neeraj@healthnova.com', phone: '+1-469-555-0110', lastUpdated: '2025-11-10' },
  { id: '6', sponsorId: 'SP-006', sponsorName: 'CureGenix', status: 'Inactive', projects: 1, enquiries: 1, messages: 3, state: 'Florida', city: 'Tampa', contact: 'Meera Shah', ownerPhoto: `${AVATARS}/2.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF2.png`, email: 'meera@curegenix.com', phone: '+1-813-555-0147', lastUpdated: '2025-10-28' },
  { id: '7', sponsorId: 'SP-007', sponsorName: 'LifeBridge Research', status: 'Active', projects: 5, enquiries: 2, messages: 10, state: 'Georgia', city: 'Atlanta', contact: 'Vinay Joshi', ownerPhoto: `${AVATARS}/3.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF3.png`, email: 'vinay@lifebridge.com', phone: '+1-404-555-0133', lastUpdated: '2025-11-11' },
  { id: '8', sponsorId: 'SP-008', sponsorName: 'Prime Trials', status: 'Onboarding', projects: 2, enquiries: 1, messages: 4, state: 'Arizona', city: 'Phoenix', contact: 'Kritika Rao', ownerPhoto: `${AVATARS}/4.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF.png`, email: 'kritika@primetrials.com', phone: '+1-602-555-0172', lastUpdated: '2025-11-02' },

  { id: '9', sponsorId: 'SP-009', sponsorName: 'NeuroMedix', status: 'Active', projects: 6, enquiries: 3, messages: 12, state: 'Washington', city: 'Seattle', contact: 'Aakash Reddy', ownerPhoto: `${AVATARS}/1.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF1.png`, email: 'aakash@neuromedix.com', phone: '+1-206-555-0138', lastUpdated: '2025-10-26' },
  { id: '10', sponsorId: 'SP-010', sponsorName: 'Everest BioCare', status: 'Inactive', projects: 1, enquiries: 0, messages: 2, state: 'Illinois', city: 'Chicago', contact: 'Pooja Nair', ownerPhoto: `${AVATARS}/2.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF2.png`, email: 'pooja@everestbio.com', phone: '+1-312-555-0190', lastUpdated: '2025-09-14' },

  { id: '11', sponsorId: 'SP-011', sponsorName: 'Zenith Pharma', status: 'Active', projects: 4, enquiries: 2, messages: 9, state: 'Texas', city: 'Austin', contact: 'Rohan Gupta', ownerPhoto: `${AVATARS}/3.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF3.png`, email: 'rohan@zenithpharma.com', phone: '+1-512-555-0177', lastUpdated: '2025-11-06' },
  { id: '12', sponsorId: 'SP-012', sponsorName: 'VitalPath Research', status: 'Onboarding', projects: 2, enquiries: 1, messages: 6, state: 'Florida', city: 'Orlando', contact: 'Shruti Sharma', ownerPhoto: `${AVATARS}/4.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF.png`, email: 'shruti@vitalpath.com', phone: '+1-407-555-0195', lastUpdated: '2025-11-03' },

  { id: '13', sponsorId: 'SP-013', sponsorName: 'NovaTrials', status: 'Active', projects: 7, enquiries: 3, messages: 11, state: 'California', city: 'Los Angeles', contact: 'Arvind Rao', ownerPhoto: `${AVATARS}/1.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF1.png`, email: 'arvind@novatrials.com', phone: '+1-213-555-0184', lastUpdated: '2025-10-22' },
  { id: '14', sponsorId: 'SP-014', sponsorName: 'Clinix Research', status: 'Inactive', projects: 1, enquiries: 0, messages: 1, state: 'Georgia', city: 'Savannah', contact: 'Divya Pillai', ownerPhoto: `${AVATARS}/2.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF2.png`, email: 'divya@clinix.com', phone: '+1-912-555-0123', lastUpdated: '2025-09-19' },

  { id: '15', sponsorId: 'SP-015', sponsorName: 'PharmaEdge', status: 'Active', projects: 5, enquiries: 4, messages: 13, state: 'Texas', city: 'Houston', contact: 'Suresh Iyer', ownerPhoto: `${AVATARS}/3.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF3.png`, email: 'suresh@pharmaedge.com', phone: '+1-713-555-0166', lastUpdated: '2025-11-09' },
  { id: '16', sponsorId: 'SP-016', sponsorName: 'TrustMed Global', status: 'Onboarding', projects: 2, enquiries: 1, messages: 4, state: 'Arizona', city: 'Tucson', contact: 'Madhavi Rao', ownerPhoto: `${AVATARS}/4.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF.png`, email: 'madhavi@trustmed.com', phone: '+1-520-555-0155', lastUpdated: '2025-10-31' },

  { id: '17', sponsorId: 'SP-017', sponsorName: 'BioCrest Labs', status: 'Active', projects: 3, enquiries: 2, messages: 7, state: 'Washington', city: 'Spokane', contact: 'Hari Prasad', ownerPhoto: `${AVATARS}/1.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF1.png`, email: 'hari@biocrest.com', phone: '+1-509-555-0171', lastUpdated: '2025-10-18' },
  { id: '18', sponsorId: 'SP-018', sponsorName: 'MedCore Trials', status: 'Inactive', projects: 1, enquiries: 0, messages: 1, state: 'Florida', city: 'Jacksonville', contact: 'Lakshmi Menon', ownerPhoto: `${AVATARS}/2.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF2.png`, email: 'lakshmi@medcore.com', phone: '+1-904-555-0135', lastUpdated: '2025-09-25' },

  { id: '19', sponsorId: 'SP-019', sponsorName: 'Pulse BioResearch', status: 'Active', projects: 6, enquiries: 2, messages: 9, state: 'Illinois', city: 'Springfield', contact: 'Rajesh Kumar', ownerPhoto: `${AVATARS}/3.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF3.png`, email: 'rajesh@pulsebio.com', phone: '+1-217-555-0157', lastUpdated: '2025-11-07' },
  { id: '20', sponsorId: 'SP-020', sponsorName: 'Synergetic Trials', status: 'Onboarding', projects: 2, enquiries: 1, messages: 4, state: 'California', city: 'San Jose', contact: 'Deepika Rani', ownerPhoto: `${AVATARS}/4.svg.jpg`, sponsorPhoto: `${AVATARS}/ODF.png`, email: 'deepika@synergetic.com', phone: '+1-408-555-0148', lastUpdated: '2025-11-04' }
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

    // Add/Edit form fields
    formSponsorName = '';
    formState = '';
    formCity = '';
    formContact = '';
    formEmail = '';
    formPhone = '';
    formStatus = 'Active';

    statusOptionsList = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    // Modal-specific searchable single-select dropdown state
    formStateDropdownOpen = false;
    formCityDropdownOpen = false;
    formStateSearch = '';
    formCitySearch = '';

    get formStateDropdownClass() { return this.formStateDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get formCityDropdownClass() { return this.formCityDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get formFilteredStateOptions() { return this.formStateSearch ? this.stateOptionsBase.filter(opt => opt.label.toLowerCase().includes(this.formStateSearch.toLowerCase())) : this.stateOptionsBase; }
    get formFilteredCityOptions() { return this.formCitySearch ? this.cityOptionsBase.filter(opt => opt.label.toLowerCase().includes(this.formCitySearch.toLowerCase())) : this.cityOptionsBase; }
    get formStateDisplay() { return this.formState || 'Select State'; }
    get formCityDisplay() { return this.formCity || 'Select City'; }

    toggleFormStateDropdown() { this.formStateDropdownOpen = !this.formStateDropdownOpen; if (this.formStateDropdownOpen) this.formCityDropdownOpen = false; }
    toggleFormCityDropdown() { this.formCityDropdownOpen = !this.formCityDropdownOpen; if (this.formCityDropdownOpen) this.formStateDropdownOpen = false; }
    handleFormStateSearchInput(event) { this.formStateSearch = event.target.value; }
    handleFormCitySearchInput(event) { this.formCitySearch = event.target.value; }
    selectFormState(event) { const val = event.currentTarget.dataset.value; if (val) { this.formState = val; } this.formStateDropdownOpen = false; }
    selectFormCity(event) { const val = event.currentTarget.dataset.value; if (val) { this.formCity = val; } this.formCityDropdownOpen = false; }

    openAddModal() {
        this.editRecordId = '';
        this.formSponsorName = '';
        this.formState = '';
        this.formCity = '';
        this.formContact = '';
        this.formEmail = '';
        this.formPhone = '';
        this.formStatus = 'Active';
        this.showAddModal = true;
    }

    closeAddModal() { this.showAddModal = false; }

    openEditModal() { this.showEditModal = true; }
    closeEditModal() { this.showEditModal = false; }

    handleInputChange(event) {
        const { name, value } = event.target;
        if (name && Object.prototype.hasOwnProperty.call(this, name)) {
            this[name] = value;
        }
    }

    handleEdit(event) {
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        const rec = this.data.find(r => r.id === id) || this.filteredData.find(r => r.id === id);
        if (!rec) return;
        this.editRecordId = id;
        this.formSponsorName = rec.sponsorName || '';
        this.formState = rec.state || '';
        this.formCity = rec.city || '';
        this.formContact = rec.contact || '';
        this.formEmail = rec.email || '';
        this.formPhone = rec.phone || '';
        this.formStatus = rec.status === 'Inactive' || rec.status === 'Active' ? rec.status : 'Active';
        this.openEditModal();
    }

    saveEdit() {
        if (!this.editRecordId) return this.closeEditModal();
        const idx = this.data.findIndex(r => r.id === this.editRecordId);
        if (idx === -1) return this.closeEditModal();
        const updated = { ...this.data[idx] };
        updated.sponsorName = this.formSponsorName;
        updated.state = this.formState;
        updated.city = this.formCity;
        updated.contact = this.formContact;
        updated.email = this.formEmail;
        updated.phone = this.formPhone;
        updated.status = this.formStatus;
        updated.statusClass = this.computeStatusClass(updated.status);
        updated.lastUpdated = new Date().toISOString().slice(0,10);
        const contactName = updated.contact || '';
        updated.contactInitials = contactName.split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
        updated.ownerPhoto = '';
        updated.sponsorInitials = (updated.sponsorName || '').split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
        updated.sponsorPhoto = '';
        this.data = [...this.data.slice(0, idx), updated, ...this.data.slice(idx + 1)];
        this.closeEditModal();
    }

    saveAdd() {
        const id = `sp-${Date.now()}`;
        const sponsorInitials = (this.formSponsorName || '').split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
        const contactInitials = (this.formContact || '').split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
        const newRec = {
            id,
            sponsorId: id.toUpperCase(),
            sponsorName: this.formSponsorName,
            status: this.formStatus,
            projects: 0,
            enquiries: 0,
            messages: 0,
            state: this.formState,
            city: this.formCity,
            contact: this.formContact,
            ownerPhoto: '',
            contactInitials,
            sponsorPhoto: '',
            sponsorInitials,
            email: this.formEmail,
            phone: this.formPhone,
            lastUpdated: new Date().toISOString().slice(0,10),
            statusClass: this.computeStatusClass(this.formStatus)
        };
        this.data = [newRec, ...this.data];
        this.closeAddModal();
    }

    computeStatusClass(status) {
        let statusClass = 'badge-soft-info border border-info';
        if (status === 'Active') statusClass = 'badge-soft-success border border-success';
        else if (status === 'Inactive') statusClass = 'badge-soft-danger border border-danger';
        else if (status === 'Onboarding') statusClass = 'badge-soft-info border border-info';
        return statusClass;
    }

    // reuse same option set for mNDA & LOI (per user request)
    mndaOptions = [
          { label: 'Telangana', value: 'Telangana', checked: false },
        { label: 'Delhi', value: 'Delhi', checked: false },
        { label: 'Maharashtra', value: 'Maharashtra', checked: false },
        { label: 'Karnataka', value: 'Karnataka', checked: false }
    ];

    loiOptions = [
        { label: 'Hyderabad', value: 'Hyderabad', checked: false },
        { label: 'Delhi', value: 'Delhi', checked: false },
        { label: 'Mumbai', value: 'Mumbai', checked: false },
        { label: 'Bangalore', value: 'Bangalore', checked: false }
    ];

    // ESA options similar to previous MSA list
    esaOptions = [
        { label: 'Under Partner Review', value: 'Under Partner Review', checked: false },
        { label: 'Under datosX Review', value: 'Under datosX Review', checked: false },
        { label: 'Pending for signatures', value: 'Pending for signatures', checked: false },
        { label: 'Signed', value: 'Signed', checked: false }
    ];

    get statusDropdownClass() { return this.statusDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get mndaDropdownClass() { return this.mndaDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get loiDropdownClass() { return this.loiDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get esaDropdownClass() { return this.esaDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }

    toggleStatusDropdown() { this.statusDropdownOpen = !this.statusDropdownOpen; this.closeOtherDropdowns('status'); }
    toggleMndaDropdown() { this.mndaDropdownOpen = !this.mndaDropdownOpen; this.closeOtherDropdowns('mnda'); }
    toggleLoiDropdown() { this.loiDropdownOpen = !this.loiDropdownOpen; this.closeOtherDropdowns('loi'); }
    toggleEsaDropdown() { this.esaDropdownOpen = !this.esaDropdownOpen; this.closeOtherDropdowns('esa'); }

    closeOtherDropdowns(except) {
        if (except !== 'status') this.statusDropdownOpen = false;
        if (except !== 'mnda') this.mndaDropdownOpen = false;
        if (except !== 'loi') this.loiDropdownOpen = false;
        if (except !== 'esa') this.esaDropdownOpen = false;
    }

    get statusDisplayText() { const count = this.statusOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get mndaDisplayText() { const count = this.mndaOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get loiDisplayText() { const count = this.loiOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get esaDisplayText() { const count = this.esaOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }

    toggleFilters() { this.showFilters = !this.showFilters; }
    closeFilter() { this.showFilters = false; this.closeOtherDropdowns(''); }

    handleStatusCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.statusOptions = this.statusOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleMndaCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.mndaOptions = this.mndaOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleLoiCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.loiOptions = this.loiOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleEsaCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.esaOptions = this.esaOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }

    handleSearchChange(event) { this.searchKey = event.target.value; this.pageIndex = 0; }

    resetStatusFilter() { this.statusOptions = this.statusOptions.map(opt => ({ ...opt, checked: false })); this.selectedStatus = []; }
    resetMndaFilter() { this.mndaOptions = this.mndaOptions.map(opt => ({ ...opt, checked: false })); this.selectedMnda = []; }
    resetLoiFilter() { this.loiOptions = this.loiOptions.map(opt => ({ ...opt, checked: false })); this.selectedLoi = []; }
    resetEsaFilter() { this.esaOptions = this.esaOptions.map(opt => ({ ...opt, checked: false })); this.selectedEsa = []; }
    clearAllFilters() { this.resetStatusFilter(); this.resetMndaFilter(); this.resetLoiFilter(); this.resetEsaFilter(); }

    applyFilter() {
        this.selectedStatus = this.statusOptions.filter(o => o.checked).map(o => o.value);
        this.selectedMnda = this.mndaOptions.filter(o => o.checked).map(o => o.value);
        this.selectedLoi = this.loiOptions.filter(o => o.checked).map(o => o.value);
        this.selectedEsa = this.esaOptions.filter(o => o.checked).map(o => o.value);
        this.closeOtherDropdowns('');
        this.pageIndex = 0;
    }

    // Filtering
    get filteredData() {
        let temp = [...this.data];
        if (this.selectedStatus.length > 0) temp = temp.filter(i => this.selectedStatus.includes(i.status));
        if (this.selectedMnda.length > 0) temp = temp.filter(i => this.selectedMnda.includes(i.mnda));
        if (this.selectedLoi.length > 0) temp = temp.filter(i => this.selectedLoi.includes(i.loi));
        if (this.selectedEsa.length > 0) temp = temp.filter(i => this.selectedEsa.includes(i.esa));
        if (this.searchKey && this.searchKey.trim() !== '') {
            const key = this.searchKey.trim().toLowerCase();
            temp = temp.filter(i =>
                (i.sponsorName && i.sponsorName.toLowerCase().includes(key)) ||
                (i.contact && i.contact.toLowerCase().includes(key)) ||
                (i.sponsorId && i.sponsorId.toLowerCase().includes(key)) ||
                (i.email && i.email.toLowerCase().includes(key)) ||
                (i.phone && i.phone.toLowerCase().includes(key))
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

    connectedCallback() {
        this.data = this.data.map(row => {
            const contactName = row.contact || '';
            const contactInitials = contactName.split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
            const sponsorName = row.sponsorName || '';
            const sponsorInitials = sponsorName.split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
            // Map status visual: Active -> green, Onboarding -> light-blue
            let statusClass = 'badge-soft-info border border-info';
            if (row.status === 'Active') statusClass = 'badge-soft-success border border-success';
            else if (row.status === 'Onboarding') statusClass = 'badge-soft-info border border-info';

            return {
                ...row,
                statusClass,
                contactInitials: contactInitials,
                ownerPhoto: row.ownerPhoto || '',
                sponsorInitials: sponsorInitials,
                sponsorPhoto: row.sponsorPhoto || row.ownerPhoto || ''
            };
        });
    }

    // Pagination settings
    pageSizeOptions = [5, 10, 25, 50, 100];
    pageSize = 25; // rows per page
    pageIndex = 0; // zero-based index

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

    get isSortedBy() {
        return {
            sponsorId: this.sortField === 'sponsorId',
            sponsorName: this.sortField === 'sponsorName',
            status: this.sortField === 'status',
            projects: this.sortField === 'projects',
            enquiries: this.sortField === 'enquiries',
            messages: this.sortField === 'messages',
            state: this.sortField === 'state',
            city: this.sortField === 'city',
            contact: this.sortField === 'contact',
            email: this.sortField === 'email',
            phone: this.sortField === 'phone',
            lastUpdated: this.sortField === 'lastUpdated'
        };
    }

    get sortDirection() { return this.sortOrder === 'asc' ? 'sorting-arrow-asc' : 'sorting-arrow-desc'; }

    // Handle Project ID click to navigate to project detail
    handleProjectIdClick(event) {
        const projectId = event.currentTarget.dataset.projectId;
        if (!projectId) return;
        
        this.selectedProjectId = projectId;
        
        // Find the project data from our table (in real app, fetch from server)
        const row = this.data.find(r => r.projectId === projectId);
        if (row) {
            // Map sponsor data to project object format expected by projectDetail
            this.selectedProject = {
                projectId: row.projectId,
                projectName: row.sponsorName + ' Project', // Use sponsor name as project name placeholder
                status: row.status,
                sponsorName: row.sponsorName,
                description: `Project for ${row.sponsorName}`,
                ownerName: row.ownerName,
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
                submittedBy: row.ownerName
            };
            this.showDetail = true;
        }
    }

    // Handle sponsor ID click - navigate to sponsor detail view
    handleSponsorIdClick(event) {
        const sponsorId = event.currentTarget.dataset.id;
        const row = this.data.find(r => r.id === sponsorId);
        if (row) {
            this.selectedSponsorId = row.id;
            this.selectedSponsor = { ...row };
            this.showDetail = true;
        }
    }

    // Handle back from sponsor detail
    handleBack() {
        this.showDetail = false;
        this.selectedSponsor = null;
        this.selectedSponsorId = '';
    }

    // Placeholder edit/delete handlers
    handleEdit(event) { const id = event.currentTarget.dataset.id; this.dispatchEvent(new CustomEvent('edit', { detail: { id } })); }
    handleDelete(event) { const id = event.currentTarget.dataset.id; this.dispatchEvent(new CustomEvent('delete', { detail: { id } })); }
}
