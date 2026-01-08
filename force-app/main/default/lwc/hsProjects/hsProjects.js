import { LightningElement } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import AVATARS from '@salesforce/resourceUrl/avatars';
import FONT_AWESOME from '@salesforce/resourceUrl/fontawesome';

export default class HsProjects extends LightningElement {
    // Filters
    showFilters = false;
    searchKey = '';
    statusDropdownOpen = false;
    sponsorDropdownOpen = false;

    selectedStatus = [];
    selectedSponsor = [];

    // Sorting
    sortField = '';
    sortOrder = 'asc';

    // Sample Data for HS Projects
    data = [
        { 
            id: '1', 
            projectId: 'New1455', 
            projectName: 'CDS Project', 
            status: 'Study ongoing', 
            completion: 76,
            sponsorName: 'Sample Sponsor', 
            sponsorPhoto: `${AVATARS}/ODF1.png`, 
            documents: 3,
            notes: 2,
            messages: 28,
            lastUpdated: '2025-11-15',
            state: 'California',
            city: 'San Francisco',
            contact: 'Dr. John Smith',
            contactPhoto: `${AVATARS}/1.svg.jpg`,
            email: 'john.smith@stmary.com',
            phone: '+1-415-555-0100'
        },
        { id: '2', projectId: 'PX-1002', projectName: 'Beta Trial', status: 'Deep Dive Call', completion: 45, sponsorName: 'BioHealth Ltd', sponsorPhoto: `${AVATARS}/ODF2.png`, documents: 3, notes: 2, messages: 28, lastUpdated: '2025-11-10', state: 'Texas', city: 'Houston', contact: 'Dr. Lisa Chen', contactPhoto: `${AVATARS}/2.svg.jpg`, email: 'lisa.chen@greenvalley.com', phone: '+1-713-555-0200' },
        { id: '3', projectId: 'PX-1003', projectName: 'Gamma Research', status: 'Protocol Draft 1 creation', completion: 62, sponsorName: 'MedSolutions', sponsorPhoto: `${AVATARS}/ODF3.png`, documents: 3, notes: 2, messages: 28, lastUpdated: '2025-11-08', state: 'New York', city: 'New York', contact: 'Dr. Michael Kim', contactPhoto: `${AVATARS}/3.svg.jpg`, email: 'michael.kim@northside.com', phone: '+1-212-555-0300' },
        { id: '4', projectId: 'PX-1004', projectName: 'Delta Study', status: 'Study Ongoing', completion: 88, sponsorName: 'Global Trials', sponsorPhoto: `${AVATARS}/ODF.png`, documents: 3, notes: 2, messages: 28, lastUpdated: '2025-11-12', state: 'Illinois', city: 'Chicago', contact: 'Dr. Raj Patel', contactPhoto: `${AVATARS}/4.svg.jpg`, email: 'raj.patel@stmary.com', phone: '+1-312-555-0400' },
        { id: '5', projectId: 'PX-1005', projectName: 'Epsilon Pilot', status: 'Project On Hold', completion: 30, sponsorName: 'Acme Pharma', sponsorPhoto: `${AVATARS}/ODF1.png`, documents: 3, notes: 2, messages: 28, lastUpdated: '2025-10-25', state: 'Florida', city: 'Miami', contact: 'Dr. Sarah Lee', contactPhoto: `${AVATARS}/5.svg.jpg`, email: 'sarah.lee@greenvalley.com', phone: '+1-305-555-0500' },
        { id: '6', projectId: 'PX-1006', projectName: 'Zeta Analysis', status: 'Initial Review', completion: 20, sponsorName: 'NextGen Pharma', sponsorPhoto: `${AVATARS}/ODF2.png`, documents: 1, notes: 1, messages: 12, lastUpdated: '2025-11-05', state: 'Texas', city: 'Dallas', contact: 'Dr. Kevin Brown', contactPhoto: `${AVATARS}/1.svg.jpg`, email: 'kevin.brown@houstonhealth.com', phone: '+1-214-555-1000' },
        { id: '7', projectId: 'PX-1007', projectName: 'Theta Clinical Study', status: 'Feasibility Check', completion: 52, sponsorName: 'Alpha Bio', sponsorPhoto: `${AVATARS}/ODF3.png`, documents: 2, notes: 3, messages: 14, lastUpdated: '2025-10-30', state: 'Florida', city: 'Orlando', contact: 'Dr. Emily Clark', contactPhoto: `${AVATARS}/2.svg.jpg`, email: 'emily.clark@orlandohealth.com', phone: '+1-407-555-2000' },
        { id: '8', projectId: 'PX-1008', projectName: 'Omega Trial', status: 'Study Ongoing', completion: 74, sponsorName: 'TriCore Labs', sponsorPhoto: `${AVATARS}/ODF.png`, documents: 3, notes: 1, messages: 18, lastUpdated: '2025-11-14', state: 'California', city: 'San Diego', contact: 'Dr. Peter Adams', contactPhoto: `${AVATARS}/3.svg.jpg`, email: 'peter.adams@sandiegohealth.com', phone: '+1-619-555-3000' },
        { id: '9', projectId: 'PX-1009', projectName: 'Sigma Research', status: 'Protocol Review', completion: 60, sponsorName: 'BioVantage', sponsorPhoto: `${AVATARS}/ODF1.png`, documents: 3, notes: 3, messages: 22, lastUpdated: '2025-11-09', state: 'Illinois', city: 'Chicago', contact: 'Dr. Anna White', contactPhoto: `${AVATARS}/4.svg.jpg`, email: 'anna.white@cggeneral.com', phone: '+1-312-555-4000' },
        { id: '10', projectId: 'PX-1010', projectName: 'Lambda Study', status: 'Kickoff Meeting', completion: 10, sponsorName: 'OptimaBio', sponsorPhoto: `${AVATARS}/ODF2.png`, documents: 0, notes: 1, messages: 8, lastUpdated: '2025-11-01', state: 'Texas', city: 'Austin', contact: 'Dr. Jake Donovan', contactPhoto: `${AVATARS}/5.svg.jpg`, email: 'jake.donovan@houstonhealth.com', phone: '+1-512-555-5000' },
        { id: '11', projectId: 'PX-1011', projectName: 'Kappa Trial', status: 'Deep Dive Call', completion: 48, sponsorName: 'HealthWave', sponsorPhoto: `${AVATARS}/ODF3.png`, documents: 3, notes: 1, messages: 10, lastUpdated: '2025-11-11', state: 'New York', city: 'Buffalo', contact: 'Dr. Laura Jones', contactPhoto: `${AVATARS}/1.svg.jpg`, email: 'laura.jones@nmc.com', phone: '+1-716-555-6000' },
        { id: '12', projectId: 'PX-1012', projectName: 'Mu Clinical Study', status: 'Study Ongoing', completion: 70, sponsorName: 'BioMedX', sponsorPhoto: `${AVATARS}/ODF1.png`, documents: 4, notes: 2, messages: 30, lastUpdated: '2025-11-13', state: 'Florida', city: 'Tampa', contact: 'Dr. Henry Ford', contactPhoto: `${AVATARS}/2.svg.jpg`, email: 'henry.ford@miamimed.com', phone: '+1-813-555-7000' }
    ];

    statusOptions = [
        'Project Scoping Questionnaire Sent',
        'Project Scoping Questionnaire Received',
        'Deep Dive Call',
        'Draft Protocol Synopsis',
        'Protocol Synopsis Ready',
        'Health System Matching',
        'Protocol Draft 1 creation',
        'Protocol Draft 1 review',
        'Protocol Draft 2 creation',
        'Protocol Draft 2 review',
        'Study Ongoing',
        'Project On Hold',
        'Project Cancelled'
    ].map(v => ({ label: v, value: v, checked: false }));

    sponsorOptions = [];

    get statusDropdownClass() { return this.statusDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get sponsorDropdownClass() { return this.sponsorDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }

    toggleStatusDropdown() { this.statusDropdownOpen = !this.statusDropdownOpen; this.closeOtherDropdowns('status'); }
    toggleSponsorDropdown() { this.sponsorDropdownOpen = !this.sponsorDropdownOpen; this.closeOtherDropdowns('sponsor'); }

    closeOtherDropdowns(except) {
        if (except !== 'status') this.statusDropdownOpen = false;
        if (except !== 'sponsor') this.sponsorDropdownOpen = false;
    }

    get statusDisplayText() { const count = this.statusOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get sponsorDisplayText() { const count = this.sponsorOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }

    toggleFilters() { this.showFilters = !this.showFilters; }
    closeFilter() { this.showFilters = false; this.closeOtherDropdowns(''); }

    handleStatusCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.statusOptions = this.statusOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleSponsorCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.sponsorOptions = this.sponsorOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }

    handleSearchChange(event) { this.searchKey = event.target.value; this.pageIndex = 0; }

    resetStatusFilter() { this.statusOptions = this.statusOptions.map(opt => ({ ...opt, checked: false })); this.selectedStatus = []; }
    resetSponsorFilter() { this.sponsorOptions = this.sponsorOptions.map(opt => ({ ...opt, checked: false })); this.selectedSponsor = []; }
    clearAllFilters() { this.resetStatusFilter(); this.resetSponsorFilter(); }

    applyFilter() {
        this.selectedStatus = this.statusOptions.filter(o => o.checked).map(o => o.value);
        this.selectedSponsor = this.sponsorOptions.filter(o => o.checked).map(o => o.value);
        this.closeOtherDropdowns('');
        this.pageIndex = 0;
    }

    get filteredData() {
        let temp = [...this.data];
        if (this.selectedStatus.length > 0) temp = temp.filter(i => this.selectedStatus.includes(i.status));
        if (this.selectedSponsor.length > 0) temp = temp.filter(i => this.selectedSponsor.includes(i.sponsorName));
        if (this.searchKey && this.searchKey.trim() !== '') {
            const key = this.searchKey.trim().toLowerCase();
            temp = temp.filter(i =>
                (i.projectName && i.projectName.toLowerCase().includes(key)) ||
                (i.projectId && i.projectId.toLowerCase().includes(key)) ||
                (i.sponsorName && i.sponsorName.toLowerCase().includes(key)) ||
                (i.contact && i.contact.toLowerCase().includes(key)) ||
                (i.email && i.email.toLowerCase().includes(key)) ||
                (i.state && i.state.toLowerCase().includes(key)) ||
                (i.city && i.city.toLowerCase().includes(key))
            );
        }

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
        const sponsors = Array.from(new Set(this.data.map(d => d.sponsorName))).map(s => ({ label: s, value: s, checked: false }));
        this.sponsorOptions = sponsors;

        this.data = this.data.map((row, idx) => {
            const sponsorInitials = (row.sponsorName || '').split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
            const contactInitials = (row.contact || '').split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
            const questionnaires = this.buildQuestionnaires(idx);
            return {
                ...row,
                sponsorInitials,
                sponsorPhoto: row.sponsorPhoto || '',
                contactInitials,
                contactPhoto: row.contactPhoto || '',
                statusClass: this.getStatusClass(row.status),
                questionnaires
            };
        });

        loadStyle(this, FONT_AWESOME + '/css/all.min.css').catch((err) => {
            console.warn('Failed to load Font Awesome CSS', err);
        });
    }

    getStatusClass(status) {
        if (!status) return 'badge-soft-info border border-info';
        const s = String(status).toLowerCase().trim();
        const successStates = ['study ongoing', 'project closed', 'final protocol provided'];
        const dangerStates = ['project on hold', 'project cancelled'];
        if (successStates.includes(s)) return 'badge-soft-success border border-success';
        if (dangerStates.includes(s)) return 'badge-soft-info border border-info';
        return 'badge-soft-info border border-info';
    }

    questionnaireDefs = [
        { key: 'scoping', label: 'Project Scoping Questionnaire', icon: 'fas fa-search' },
        { key: 'protocol', label: 'Protocol Questionnaire', icon: 'fas fa-file-medical' },
        { key: 'nps', label: 'NPS Survey', icon: 'fa-solid fa-check-double' }
    ];

    questionnaireStatusCycle = ['Response Received', 'Awaiting Response', 'Pending'];

    getQuestionnaireColor(status) {
        if (status === 'Response Received') return '#2e844a';
        if (status === 'Awaiting Response') return '#f5a623';
        return '#9fa3a7';
    }

    buildQuestionnaires(idx) {
        return this.questionnaireDefs.map((def, i) => {
            const status = this.questionnaireStatusCycle[(idx + i) % this.questionnaireStatusCycle.length];
            const color = this.getQuestionnaireColor(status);
            const bg = color;
            const iconColor = '#ffffff';
            return {
                ...def,
                status,
                title: `${def.label} - ${status}`,
                style: `background-color: ${bg}; color: ${iconColor}; width: 29px; height: 29px; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; margin-right:8px; font-size:0.9rem;`
            };
        });
    }

    // Pagination
    pageSizeOptions = [5, 10, 25, 50, 100];
    pageSize = 25;
    pageIndex = 0;
    showDetail = false;
    selectedProject = null;

    // Add project modal
    isAddProjectModalOpen = false;
    activeAddModalTab = 'details';
    addModalTabs = [
        { id: 'details', label: 'Project Details' },
        { id: 'history', label: 'Project History' }
    ];

    addModalStatusOptions = [
        { label: 'NA', value: 'NA' },
        { label: 'Discovery', value: 'Discovery' },
        { label: 'Deep Dive Call', value: 'Deep Dive Call' },
        { label: 'Protocol Draft', value: 'Protocol Draft' },
        { label: 'Study Ongoing', value: 'Study Ongoing' },
        { label: 'Project On Hold', value: 'Project On Hold' },
        { label: 'Project Cancelled', value: 'Project Cancelled' }
    ];

    newProjectForm = {
        projectId: '',
        projectName: '',
        sponsor: '',
        status: '',
        notes: '',
        historyNotes: ''
    };

    // Questionnaire modal
    showQuestionnaireModal = false;
    questionnaireModalType = '';
    questionnaireModalTitle = '';
    questionnaireModalMessage = '';
    selectedQuestionnaireRow = null;

    get totalSize() { return this.filteredData.length; }
    get totalPages() { return Math.max(1, Math.ceil(this.totalSize / this.pageSize)); }
    get pageNumber() { return this.pageIndex + 1; }
    get pagedData() { const start = this.pageIndex * this.pageSize; return this.filteredData.slice(start, start + this.pageSize); }
    get isFirstPage() { return this.pageIndex === 0; }
    get isLastPage() { return this.pageIndex >= this.totalPages - 1; }

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
            projectId: this.sortField === 'projectId',
            projectName: this.sortField === 'projectName',
            status: this.sortField === 'status',
            completion: this.sortField === 'completion',
            sponsorName: this.sortField === 'sponsorName',
            documents: this.sortField === 'documents',
            notes: this.sortField === 'notes',
            messages: this.sortField === 'messages',
            lastUpdated: this.sortField === 'lastUpdated',
            state: this.sortField === 'state',
            city: this.sortField === 'city',
            contact: this.sortField === 'contact',
            email: this.sortField === 'email',
            phone: this.sortField === 'phone'
        };
    }

    get sortDirection() { return this.sortOrder === 'asc' ? 'sorting-arrow-asc' : 'sorting-arrow-desc'; }

    openDetail(event) {
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        const proj = this.data.find(d => d.id === id);
        if (proj) {
            this.selectedProject = proj;
            this.showDetail = true;
        }
    }

    handleBack() {
        this.showDetail = false;
        this.selectedProject = null;
    }

    openAddProjectModal() {
        this.activeAddModalTab = 'details';
        this.isAddProjectModalOpen = true;
    }

    closeAddProjectModal() {
        this.isAddProjectModalOpen = false;
    }

    handleAddProjectTabClick(event) {
        const tab = event.currentTarget?.dataset?.tab;
        if (tab) {
            this.activeAddModalTab = tab;
        }
    }

    get addModalTabsWithState() {
        return this.addModalTabs.map(tab => ({
            ...tab,
            className: tab.id === this.activeAddModalTab ? 'intake-nav-btn active' : 'intake-nav-btn'
        }));
    }

    handleAddProjectInputChange(event) {
        const target = event.target || event.currentTarget;
        const field = target?.name;
        if (!field) return;
        let value;
        if (event.detail && typeof event.detail.value !== 'undefined') {
            value = event.detail.value;
        } else if (target.type === 'checkbox') {
            value = target.checked;
        } else {
            value = target.value;
        }
        this.newProjectForm = { ...this.newProjectForm, [field]: value };
    }

    handleAddProjectSaveNext() {
        const currentIndex = this.addModalTabs.findIndex(tab => tab.id === this.activeAddModalTab);
        const isLast = currentIndex === this.addModalTabs.length - 1;
        if (isLast) {
            this.closeAddProjectModal();
            return;
        }
        const nextTab = this.addModalTabs[currentIndex + 1];
        this.activeAddModalTab = nextTab ? nextTab.id : this.addModalTabs[0].id;
    }

    handleAddProjectOverlayClick(event) {
        if (event.target.classList && event.target.classList.contains('modal-overlay')) {
             this.closeAddProjectModal();
        }
    }

    handleQuestionnaireClick(event) {
        const key = event.currentTarget.dataset.key;
        const rowId = event.currentTarget.dataset.rowid;
        const row = this.data.find(r => r.id === rowId) || null;
        const qItem = row && row.questionnaires ? row.questionnaires.find(q => q.key === key) : null;
        if (!qItem || qItem.status !== 'Pending') {
            return;
        }
        this.selectedQuestionnaireRow = row;
        this.questionnaireModalType = key;
        if (key === 'scoping') {
            this.questionnaireModalTitle = 'Send Project Scoping Questionnaire';
            this.questionnaireModalMessage = `Do you confirm to send Project Scoping Questionnaire`;
        } else if (key === 'protocol') {
            this.questionnaireModalTitle = 'Send Protocol Questionnaire';
            this.questionnaireModalMessage = `Do you confirm to send Protocol Questionnaire`;
        } else if (key === 'nps') {
            this.questionnaireModalTitle = 'Send NPS Survey';
            this.questionnaireModalMessage = 'Do you confirm to send NPS Survey?';
        } else {
            this.questionnaireModalTitle = 'Send Questionnaire';
            this.questionnaireModalMessage = `Do you confirm to send ${key} questionnaire`;
        }
        this.showQuestionnaireModal = true;
    }

    closeQuestionnaireModal() {
        this.showQuestionnaireModal = false;
        this.questionnaireModalType = '';
        this.selectedQuestionnaireRow = null;
    }

    confirmQuestionnaireSend() {
        console.log('Confirmed send for', this.questionnaireModalType, 'row', this.selectedQuestionnaireRow);
        this.closeQuestionnaireModal();
    }

    stopQuestionnaireModalPropagation(event) {
        event.stopPropagation();
    }

    stopAddProjectModalPropagation(event) {
        event.stopPropagation();
    }

    get isAddTabDetails() {
        return this.activeAddModalTab === 'details';
    }

    get isAddTabHistory() {
        return this.activeAddModalTab === 'history';
    }

    get isAddTabLast() {
        const idx = this.addModalTabs.findIndex(tab => tab.id === this.activeAddModalTab);
        return idx === this.addModalTabs.length - 1;
    }

    get addProjectSaveButtonLabel() {
        return this.isAddTabLast ? 'Submit' : 'Save & Next';
    }
}