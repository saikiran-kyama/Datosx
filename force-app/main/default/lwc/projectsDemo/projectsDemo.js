import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProjects from '@salesforce/apex/ProjectsController.getProjects';
import upsertProject from '@salesforce/apex/ProjectsController.upsertProject';
import deleteProject from '@salesforce/apex/ProjectsController.deleteProject';

export default class Projects extends LightningElement {
    isLoading = false;
    loadError;
    // Filters
    showFilters = false;
    searchKey = '';
    statusDropdownOpen = false;
    industryDropdownOpen = false;
    healthDropdownOpen = false;

    selectedStatus = [];
    selectedIndustry = [];
    selectedHealth = [];
    data = [];

    statusOptions = [
        'New',
        'Completed'
    ].map(v => ({ label: v, value: v, checked: false }));

    industryOptions = [
        { label: 'Healthcare', value: 'Healthcare', checked: false },
        { label: 'Life Sciences', value: 'Life Sciences', checked: false },
        { label: 'Information Technology', value: 'Information Technology', checked: false },
        { label: 'Construction', value: 'Construction', checked: false }
    ];
    healthOptions = []; // built from data

    get statusDropdownClass() { return this.statusDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get sponsorDropdownClass() { return this.industryDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get healthDropdownClass() { return this.healthDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }

    toggleStatusDropdown() { this.statusDropdownOpen = !this.statusDropdownOpen; this.closeOtherDropdowns('status'); }
    toggleSponsorDropdown() { this.industryDropdownOpen = !this.industryDropdownOpen; this.closeOtherDropdowns('industry'); }
    toggleHealthDropdown() { this.healthDropdownOpen = !this.healthDropdownOpen; this.closeOtherDropdowns('health'); }

    closeOtherDropdowns(except) {
        if (except !== 'status') this.statusDropdownOpen = false;
        if (except !== 'industry') this.industryDropdownOpen = false;
        if (except !== 'health') this.healthDropdownOpen = false;
    }

    get statusDisplayText() { const count = this.statusOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get sponsorDisplayText() { const count = this.industryOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get healthDisplayText() { const count = this.healthOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }

    toggleFilters() { this.showFilters = !this.showFilters; }
    closeFilter() { this.showFilters = false; this.closeOtherDropdowns(''); }

    handleStatusCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.statusOptions = this.statusOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleSponsorCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.industryOptions = this.industryOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleHealthCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.healthOptions = this.healthOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }

    handleSearchChange(event) { this.searchKey = event.target.value; this.pageIndex = 0; this.loadProjects(); }

    resetStatusFilter() { this.statusOptions = this.statusOptions.map(opt => ({ ...opt, checked: false })); this.selectedStatus = []; }
    resetSponsorFilter() { this.industryOptions = this.industryOptions.map(opt => ({ ...opt, checked: false })); this.selectedIndustry = []; }
    resetHealthFilter() { this.healthOptions = this.healthOptions.map(opt => ({ ...opt, checked: false })); this.selectedHealth = []; }
    clearAllFilters() { this.resetStatusFilter(); this.resetSponsorFilter(); this.resetHealthFilter(); this.loadProjects(); }

    applyFilter() {
        this.selectedStatus = this.statusOptions.filter(o => o.checked).map(o => o.value);
        this.selectedIndustry = this.industryOptions.filter(o => o.checked).map(o => o.value);
        this.selectedHealth = this.healthOptions.filter(o => o.checked).map(o => o.value);
        this.closeOtherDropdowns('');
        this.pageIndex = 0;
        this.loadProjects();
    }

    // Filtering
    get filteredData() {
        let temp = [...this.data];
        if (this.selectedStatus.length > 0) temp = temp.filter(i => this.selectedStatus.includes(i.status));
        if (this.selectedIndustry.length > 0) temp = temp.filter(i => this.selectedIndustry.includes(i.industry));
        if (this.selectedHealth.length > 0) temp = temp.filter(i => this.selectedHealth.includes(i.healthSystemName));
        if (this.searchKey && this.searchKey.trim() !== '') {
            const key = this.searchKey.trim().toLowerCase();
            temp = temp.filter(i =>
                (i.projectName && i.projectName.toLowerCase().includes(key)) ||
                (i.projectId && i.projectId.toLowerCase().includes(key)) ||
                (i.sponsorName && i.sponsorName.toLowerCase().includes(key)) ||
                (i.healthSystemName && i.healthSystemName.toLowerCase().includes(key)) ||
                (i.contact && i.contact.toLowerCase().includes(key)) ||
                (i.industry && i.industry.toLowerCase().includes(key)) ||
                (i.email && i.email.toLowerCase().includes(key)) ||
                (i.phone && i.phone.toLowerCase().includes(key)) ||
                (i.startDate && i.startDate.toLowerCase().includes(key)) ||
                (i.endDate && i.endDate.toLowerCase().includes(key)) ||
                (i.state && i.state.toLowerCase().includes(key)) ||
                (i.city && i.city.toLowerCase().includes(key))
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

    async connectedCallback() {
        await this.loadProjects();
    }

    async loadProjects() {
        this.isLoading = true;
        try {
            const records = await getProjects({
                searchKey: this.searchKey,
                statuses: this.selectedStatus,
                industries: this.selectedIndustry,
                sortField: this.getSortFieldForQuery(),
                sortOrder: this.sortOrder
            });
            this.setDataFromServer(records);
            this.loadError = null;
        } catch (error) {
            this.loadError = error;
            this.showToast('Error loading projects', this.getErrorMessage(error), 'error');
        } finally {
            this.isLoading = false;
        }
    }

    getSortFieldForQuery() {
        switch (this.sortField) {
            case 'projectId':
                return 'Project_Id__c';
            case 'projectName':
                return 'Name';
            case 'status':
                return 'Status__c';
            case 'startDate':
                return 'Start_Date__c';
            case 'endDate':
                return 'End_Date__c';
            case 'industry':
                return 'Industry__c';
            case 'contact':
                return 'Contact_Name__c';
            case 'email':
                return 'Contact_Email__c';
            case 'phone':
                return 'Contact_Phone__c';
            case 'lastUpdated':
                return 'Last_Updated__c';
            default:
                return 'Last_Updated__c';
        }
    }

    setDataFromServer(records) {
        const rows = (records || []).map((record, idx) => this.normalizeProject(record, idx));
        this.data = rows;
        this.healthOptions = this.buildHealthOptions(rows);
        this.pageIndex = 0;
    }

    buildHealthOptions(rows) {
        const selected = new Set(this.selectedHealth || []);
        const values = Array.from(new Set((rows || []).map(d => d.healthSystemName).filter(Boolean)));
        return values.map(v => ({ label: v, value: v, checked: selected.has(v) }));
    }

    normalizeProject(record, idx = 0) {
        const startDate = record.Start_Date__c || '';
        const endDate = record.End_Date__c || '';
        const status = record.Status__c || 'New';
        const healthSystemName = record.Health_System_Name__c || '';
        const sponsorName = record.Sponsor_Name__c || '';
        const contactName = record.Contact_Name__c || '';
        const industry = record.Industry__c || 'Life Sciences';
        const contactInitials = (contactName || '').split(' ').map(n => n && n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
        return {
            id: record.Id,
            projectId: record.Project_Id__c || record.Name || '',
            projectName: record.Name || '',
            sponsorName,
            healthSystemName,
            status,
            startDate,
            endDate,
            industry,
            contact: contactName,
            email: record.Contact_Email__c || '',
            phone: record.Contact_Phone__c || '',
            lastUpdated: record.Last_Updated__c || new Date().toISOString().split('T')[0],
            contactInitials,
            contactPhoto: '',
            statusClass: this.getStatusClass(status)
        };
    }

    buildStartDate(index) {
        const month = (index % 12) + 1;
        return `2025-${String(month).padStart(2, '0')}-10`;
    }

    buildEndDate(index) {
        const month = (index % 12) + 1;
        return `2026-${String(month).padStart(2, '0')}-20`;
    }

    // map status -> class (reuse sponsor badges style)
    getStatusClass(status) {
        if (!status) return 'badge-soft-info border border-info';
        const successStates = ['Study Ongoing', 'Study ongoing', 'Project Closed', 'Final Protocol provided', 'Agreements Finalization', 'NPS Shared', 'Completed'];
        const dangerStates = ['Project On Hold', 'Project Cancelled'];
        if (successStates.includes(status)) return 'badge-soft-success border border-success';
        if (dangerStates.includes(status)) return 'badge-soft-info border border-info';
        return 'badge-soft-info border border-info';
    }

    // Pagination settings
    pageSizeOptions = [5, 10, 25, 50, 100];
    pageSize = 25; // rows per page
    pageIndex = 0; // zero-based index
    // Detail view
    showDetail = false;
    selectedProject = null;

    // Edit state
    editingProjectId = null;

    // Add project modal state
    isAddProjectModalOpen = false;
    activeAddModalTab = 'details';
    addModalTabs = [
        { id: 'details', label: 'Project Details' },
        { id: 'history', label: 'Project History' },
        { id: 'scoping', label: 'Project Scoping Questionnaire' },
        { id: 'requirements', label: 'Project Requirements' },
        { id: 'documents', label: 'Document/Agreement Status' }
    ];

    addModalStatusOptions = [
        { label: 'New', value: 'New' },
        { label: 'Completed', value: 'Completed' }
    ];

    addIndustryOptions = [
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'Life Sciences', value: 'Life Sciences' },
        { label: 'Information Technology', value: 'Information Technology' },
        { label: 'Construction', value: 'Construction' }
    ];

    // Document/Agreement dropdown options
    documentOptions = [
        { label: '--None--', value: '' },
        { label: 'Draft', value: 'Draft' },
        { label: 'Under Review', value: 'Under Review' },
        { label: 'Approved', value: 'Approved' }
    ];

    // Options for scoping questionnaire dropdowns
    statAnalysisOptions = [
        { label: '--None--', value: '' },
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
    ];

    isHealthSystemOptions = [
        { label: '--None--', value: '' },
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
    ];

    // Requirement groups mirror the Project Detail Requirements tab
    requirementGroups = [
        {
            id: 'facilities',
            title: 'Facilities Available',
            items: [
                { id: 'fa1', label: 'Academic Medical Center', defaultChecked: true },
                { id: 'fa2', label: 'Ambulatory Surgical Center', defaultChecked: true },
                { id: 'fa3', label: 'Center of Excellence', defaultChecked: true },
                { id: 'fa4', label: 'Community Health Clinic', defaultChecked: true },
                { id: 'fa5', label: 'Diagnostic Imaging Center', defaultChecked: true },
                { id: 'fa6', label: 'Emergency Room / Urgent Care', defaultChecked: true },
                { id: 'fa7', label: 'Hospice', defaultChecked: true },
                { id: 'fa8', label: 'Nursing Home', defaultChecked: true },
                { id: 'fa9', label: 'Outpatient Clinic', defaultChecked: true },
                { id: 'fa10', label: 'Rehab Center', defaultChecked: true },
                { id: 'fa11', label: 'Research Institution', defaultChecked: true },
                { id: 'fa12', label: 'Other', defaultChecked: true }
            ]
        },
        {
            id: 'therapeuticArea',
            title: 'Therapeutic Area of Focus',
            items: [
                { id: 'ta1', label: 'Allergy and Immunology', defaultChecked: true },
                { id: 'ta2', label: 'Cardiovascular', defaultChecked: true },
                { id: 'ta3', label: 'Chronic Diseases', defaultChecked: true },
                { id: 'ta4', label: 'Dental', defaultChecked: true },
                { id: 'ta5', label: 'Dermatology', defaultChecked: true },
                { id: 'ta6', label: 'Diagnostic Radiology', defaultChecked: true },
                { id: 'ta7', label: 'Emergency Department (ER / ED)', defaultChecked: true },
                { id: 'ta8', label: 'Endocrinology (Diabetes, Thyroid)', defaultChecked: true },
                { id: 'ta9', label: 'ENT / Otolaryngology (Ear, Nose, Throat)', defaultChecked: true },
                { id: 'ta10', label: 'Gastroenterology', defaultChecked: true },
                { id: 'ta11', label: 'Genetic Medicine', defaultChecked: true },
                { id: 'ta12', label: 'Hematology', defaultChecked: true },
                { id: 'ta13', label: 'Infectious Disease', defaultChecked: true },
                { id: 'ta14', label: "Men's Health", defaultChecked: true },
                { id: 'ta15', label: 'Musculoskeletal', defaultChecked: true },
                { id: 'ta16', label: 'Nephrology', defaultChecked: true },
                { id: 'ta17', label: 'Neuroscience', defaultChecked: true },
                { id: 'ta18', label: 'Oncology', defaultChecked: true },
                { id: 'ta19', label: 'Ophthalmology', defaultChecked: true },
                { id: 'ta20', label: 'Pathology', defaultChecked: true },
                { id: 'ta21', label: 'Pediatrics', defaultChecked: true },
                { id: 'ta22', label: 'Physical medicine and rehab', defaultChecked: true },
                { id: 'ta23', label: 'Population Health', defaultChecked: true },
                { id: 'ta24', label: 'Preventative', defaultChecked: true },
                { id: 'ta25', label: 'Primary Care', defaultChecked: true },
                { id: 'ta26', label: 'Psychiatry', defaultChecked: true },
                { id: 'ta27', label: 'Pulmonary', defaultChecked: true },
                { id: 'ta28', label: 'Respiratory', defaultChecked: true },
                { id: 'ta29', label: 'Rheumatology', defaultChecked: true },
                { id: 'ta30', label: 'Surgery', defaultChecked: true },
                { id: 'ta31', label: 'Urology', defaultChecked: true },
                { id: 'ta32', label: "Women's Health", defaultChecked: true },
                { id: 'ta33', label: 'Other', defaultChecked: true }
            ]
        },
        {
            id: 'innovationFormat',
            title: 'Innovation format interest',
            items: [
                { id: 'if1', label: 'HCP efficacy', defaultChecked: true },
                { id: 'if2', label: 'Mobile health app', defaultChecked: true },
                { id: 'if3', label: 'AI algorithm', defaultChecked: true },
                { id: 'if4', label: 'Wearable device', defaultChecked: true },
                { id: 'if5', label: 'Web application', defaultChecked: true },
                { id: 'if6', label: 'Digital diagnostics', defaultChecked: true },
                { id: 'if7', label: 'Other', defaultChecked: true }
            ]
        },
        {
            id: 'innovationEndUser',
            title: 'Innovation end user focus',
            items: [
                { id: 'eu1', label: 'Providers', defaultChecked: true },
                { id: 'eu2', label: 'Patients/Consumers', defaultChecked: true },
                { id: 'eu3', label: 'Health Systems', defaultChecked: true },
                { id: 'eu4', label: 'Researchers', defaultChecked: true },
                { id: 'eu5', label: 'Administrators', defaultChecked: true },
                { id: 'eu6', label: 'Payers', defaultChecked: true },
                { id: 'eu7', label: 'Pharma', defaultChecked: false },
                { id: 'eu8', label: 'Other', defaultChecked: true }
            ]
        }
    ];

    selectedRequirementType = '';
    requirementSelections = {};

    newProjectForm = {
        projectId: '',
        projectName: '',
        startDate: '',
        endDate: '',
        industry: '',
        contact: '',
        email: '',
        phone: '',
        lastUpdated: '',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        enrollmentTarget: '',
        submittedBy: '',
        // document/agreement fields
        projectPlanningOverview: '',
        projectScopingTwoPager: '',
        sponsor: '',
        healthSystem: '',
        status: '',
        owner: '',
        ownerDisplay: 'Navin Malik',
        primaryContact: '',
        intakeContact: '',
        intakeEmail: '',
        intakePhone: '',
        notes: '',
        historyNotes: '',
        questionnaireSummary: '',
        questionnaireRisks: '',
        documentUrl: '',
        documentNotes: '',
        publishProject: false,
        hsMatchingCompleted: false,
        regulatoryFlag: false,
        requirements: {}
    };

    // Track per-field error messages for visual state in template
    fieldErrors = {};

    constructor() {
        super();
        this.initializeRequirementState();
    }

    initializeRequirementState() {
        const selections = {};
        this.requirementGroups.forEach(group => {
            selections[group.id] = {};
            group.items.forEach(item => {
                selections[group.id][item.id] = !!item.defaultChecked;
            });
        });
        this.requirementSelections = selections;
        if (!this.selectedRequirementType && this.requirementGroups.length > 0) {
            this.selectedRequirementType = this.requirementGroups[0].id;
        }
        this.syncRequirementSelectionsToForm();
    }

    syncRequirementSelectionsToForm() {
        this.newProjectForm = {
            ...this.newProjectForm,
            requirements: JSON.parse(JSON.stringify(this.requirementSelections))
        };
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
        this.loadProjects();
    }

    get isSortedBy() {
        return {
            projectId: this.sortField === 'projectId',
            status: this.sortField === 'status',
            projectName: this.sortField === 'projectName',
            startDate: this.sortField === 'startDate',
            endDate: this.sortField === 'endDate',
            industry: this.sortField === 'industry',
            contact: this.sortField === 'contact',
            email: this.sortField === 'email',
            phone: this.sortField === 'phone',
            lastUpdated: this.sortField === 'lastUpdated'
        };
    }

    get sortDirection() { return this.sortOrder === 'asc' ? 'sorting-arrow-asc' : 'sorting-arrow-desc'; }

    // Per-column sort arrow classes so we can show arrow on hover and reflect current sort direction
    get sortClassProjectId() { return `sort-arrow ${this.isSortedBy.projectId ? this.sortDirection : ''}`; }
    get sortClassStatus() { return `sort-arrow ${this.isSortedBy.status ? this.sortDirection : ''}`; }
    get sortClassProjectName() { return `sort-arrow ${this.isSortedBy.projectName ? this.sortDirection : ''}`; }
    get sortClassStartDate() { return `sort-arrow ${this.isSortedBy.startDate ? this.sortDirection : ''}`; }
    get sortClassEndDate() { return `sort-arrow ${this.isSortedBy.endDate ? this.sortDirection : ''}`; }
    get sortClassIndustry() { return `sort-arrow ${this.isSortedBy.industry ? this.sortDirection : ''}`; }
    get sortClassContact() { return `sort-arrow ${this.isSortedBy.contact ? this.sortDirection : ''}`; }
    get sortClassEmail() { return `sort-arrow ${this.isSortedBy.email ? this.sortDirection : ''}`; }
    get sortClassPhone() { return `sort-arrow ${this.isSortedBy.phone ? this.sortDirection : ''}`; }
    get sortClassLastUpdated() { return `sort-arrow ${this.isSortedBy.lastUpdated ? this.sortDirection : ''}`; }

    // Placeholder edit/delete handlers
    handleEdit(event) {
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        const proj = this.data.find(d => d.id === id);
        if (!proj) return;
        // Prefill add/edit form with project values
        this.newProjectForm = {
            ...this.newProjectForm,
            projectId: proj.projectId || '',
            projectName: proj.projectName || '',
            startDate: proj.startDate || '',
            endDate: proj.endDate || '',
            industry: proj.industry || '',
            contact: proj.contact || '',
            email: proj.email || '',
            phone: proj.phone || '',
            lastUpdated: proj.lastUpdated || '',
            sponsor: proj.sponsorName || '',
            healthSystem: proj.healthSystemName || '',
            status: proj.status || ''
        };
        this.editingProjectId = id;
        this.activeAddModalTab = 'details';
        this.isAddProjectModalOpen = true;
    }

    async handleDelete(event) {
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        const ok = window.confirm('Are you sure you want to delete this project?');
        if (!ok) return;
        this.isLoading = true;
        try {
            await deleteProject({ projectId: id });
            this.showToast('Deleted', 'Project deleted successfully', 'success');
            // refresh list
            await this.loadProjects();
        } catch (err) {
            this.showToast('Delete failed', this.getErrorMessage(err), 'error');
        } finally {
            this.isLoading = false;
        }
    }

    // Open detail view for given project id
    openDetail(event) {
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        const proj = this.data.find(d => d.id === id);
        if (proj) {
            this.selectedProject = proj;
            this.showDetail = true;
        }
    }

    // Handler for back event from detail component
    handleBack() {
        this.showDetail = false;
        this.selectedProject = null;
    }

    // ----- Add Project Modal Helpers -----
    openAddProjectModal() {
        this.activeAddModalTab = 'details';
        this.editingProjectId = null;
        this.resetNewProjectForm();
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
        // support lightning input/combobox (detail.value) and native inputs
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

    async handleAddProjectSaveNext() {
        if (!this.validateAddProjectForm()) {
            return;
        }

        this.isLoading = true;
        try {
            const form = this.newProjectForm || {};
            const payload = {
                // include Id when editing
                Id: this.editingProjectId || undefined,
                Project_Id__c: form.projectId || null,
                Name: form.projectName || form.projectId || 'New Project',
                Status__c: form.status || 'New',
                Start_Date__c: form.startDate || null,
                End_Date__c: form.endDate || null,
                Industry__c: form.industry || null,
                Sponsor_Name__c: form.sponsor || null,
                Health_System_Name__c: form.healthSystem || null,
                Contact_Name__c: form.contact || null,
                Contact_Email__c: form.email || null,
                Contact_Phone__c: form.phone || null,
                Last_Updated__c: form.lastUpdated || new Date().toISOString().split('T')[0]
            };

            const saved = await upsertProject({ project: payload });

            // Update local list immediately so user doesn't need to refresh
            const savedRow = this.normalizeProject(saved);
            // Remove any existing entry with same id
            this.data = (this.data || []).filter(d => d.id !== savedRow.id);
            // Add saved row to top
            this.data.unshift(savedRow);
            this.healthOptions = this.buildHealthOptions(this.data);

            this.showToast('Project saved', 'The project was saved successfully.', 'success');
            this.closeAddProjectModal();
            this.resetNewProjectForm();
            this.editingProjectId = null;
        } catch (error) {
            this.showToast('Unable to save project', this.getErrorMessage(error), 'error');
        } finally {
            this.isLoading = false;
        }
    }

    validateAddProjectForm() {
        // Validate using the managed form values first (reliable in LWC).
        const requiredFields = ['status', 'projectName', 'startDate', 'industry'];
        const missing = [];
        requiredFields.forEach(name => {
            const val = this.newProjectForm && this.newProjectForm[name];
            if (!val || (typeof val === 'string' && val.trim() === '')) {
                missing.push(name);
            }
        });

        // If status is Completed, endDate is required
        const statusVal = this.newProjectForm && this.newProjectForm.status;
        if (statusVal === 'Completed') {
            const endVal = this.newProjectForm && this.newProjectForm.endDate;
            if (!endVal || (typeof endVal === 'string' && endVal.trim() === '')) {
                if (!missing.includes('endDate')) missing.push('endDate');
            }
        }
        if (missing.length === 0) {
            // clear any previous custom validity messages and visual errors
            requiredFields.forEach(name => {
                const el = this.template.querySelector(`[name="${name}"]`);
                if (el && typeof el.setCustomValidity === 'function') el.setCustomValidity('');
                if (this.fieldErrors && this.fieldErrors[name]) delete this.fieldErrors[name];
            });
            // clear endDate error as well
            const endEl = this.template.querySelector(`[name="endDate"]`);
            if (endEl && typeof endEl.setCustomValidity === 'function') endEl.setCustomValidity('');
            if (this.fieldErrors && this.fieldErrors.endDate) delete this.fieldErrors.endDate;
            return true;
        }

        // set validity messages and focus first missing field
        const first = missing[0];
        missing.forEach(name => {
            const el = this.template.querySelector(`[name="${name}"]`);
            if (el && typeof el.setCustomValidity === 'function') {
                el.setCustomValidity('This field is required');
                if (typeof el.reportValidity === 'function') el.reportValidity();
            }
            // set visual error state
            this.fieldErrors = { ...(this.fieldErrors || {}), [name]: 'This field is required' };
        });
        const firstEl = this.template.querySelector(`[name="${first}"]`);
        if (firstEl && typeof firstEl.focus === 'function') {
            try { firstEl.focus(); } catch (e) {}
        }
        return false;
    }

    // Field-level helper getters used by template to add error classes/messages
    get statusFieldError() { return !!(this.fieldErrors && this.fieldErrors.status); }
    get projectNameFieldError() { return !!(this.fieldErrors && this.fieldErrors.projectName); }
    get startDateFieldError() { return !!(this.fieldErrors && this.fieldErrors.startDate); }
    get industryFieldError() { return !!(this.fieldErrors && this.fieldErrors.industry); }

    get endDateFieldError() { return !!(this.fieldErrors && this.fieldErrors.endDate); }

    get statusFieldClass() { return this.statusFieldError ? 'intake-field slds-has-error' : 'intake-field'; }
    get projectNameFieldClass() { return this.projectNameFieldError ? 'intake-field slds-has-error' : 'intake-field'; }
    get startDateFieldClass() { return this.startDateFieldError ? 'intake-field slds-has-error' : 'intake-field'; }
    get industryFieldClass() { return this.industryFieldError ? 'intake-field slds-has-error' : 'intake-field'; }
    get endDateFieldClass() { return this.endDateFieldError ? 'intake-field slds-has-error' : 'intake-field'; }

    handleAddProjectOverlayClick(event) {
        if (event.target.classList && event.target.classList.contains('modal-overlay')) {
            this.closeAddProjectModal();
        }
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

    get isAddTabScoping() {
        return this.activeAddModalTab === 'scoping';
    }

    get isAddTabRequirements() {
        return this.activeAddModalTab === 'requirements';
    }

    get isAddTabDocuments() {
        return this.activeAddModalTab === 'documents';
    }

    // Returns true when the current add-modal tab is the last tab in the flow
    get isAddTabLast() {
        const idx = this.addModalTabs.findIndex(tab => tab.id === this.activeAddModalTab);
        return idx === this.addModalTabs.length - 1;
    }

    // Label for the primary modal action button (Submit when on last tab)
    get addProjectSaveButtonLabel() {
        return 'Submit';
    }

    get requirementTypeOptions() {
        return this.requirementGroups.map(group => ({ label: group.title, value: group.id }));
    }

    get activeRequirementGroup() {
        if (!this.requirementGroups.length) {
            return null;
        }
        return this.requirementGroups.find(group => group.id === this.selectedRequirementType) || this.requirementGroups[0];
    }

    get activeRequirementGroupId() {
        const group = this.activeRequirementGroup;
        return group ? group.id : '';
    }

    get activeRequirementItems() {
        const group = this.activeRequirementGroup;
        if (!group) {
            return [];
        }
        const selections = this.requirementSelections[group.id] || {};
        return group.items.map(item => ({
            ...item,
            groupId: group.id,
            checked: selections[item.id] || false
        }));
    }

    handleRequirementTypeChange(event) {
        const value = event.detail?.value || event.target?.value;
        if (!value) {
            return;
        }
        this.selectedRequirementType = value;
    }

    handleRequirementCheckboxChange(event) {
        const groupId = event.currentTarget?.dataset?.groupId;
        const itemId = event.currentTarget?.dataset?.itemId;
        if (!groupId || !itemId) {
            return;
        }
        const checked = event.target?.checked || false;
        const groupSelections = {
            ...(this.requirementSelections[groupId] || {})
        };
        groupSelections[itemId] = checked;
        this.requirementSelections = {
            ...this.requirementSelections,
            [groupId]: groupSelections
        };
        this.syncRequirementSelectionsToForm();
    }

    getErrorMessage(error) {
        if (!error) {
            return 'Unknown error';
        }
        if (Array.isArray(error.body)) {
            return error.body.map(e => e.message).join(', ');
        }
        if (error.body && typeof error.body.message === 'string') {
            return error.body.message;
        }
        return error.message || 'Unknown error';
    }

    showToast(title, message, variant = 'info') {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    resetNewProjectForm() {
        this.newProjectForm = {
            projectId: '',
            projectName: '',
            startDate: '',
            endDate: '',
            industry: '',
            contact: '',
            email: '',
            phone: '',
            lastUpdated: '',
            trialDetails: '',
            plannedSiteCount: '',
            primaryObjective: '',
            informationType: '',
            studyObjectives: '',
            statAnalysis: '',
            populationCriteria: '',
            timeline: '',
            exclusions: '',
            enrollmentTarget: '',
            submittedBy: '',
            // document/agreement fields
            projectPlanningOverview: '',
            projectScopingTwoPager: '',
            sponsor: '',
            healthSystem: '',
            status: '',
            owner: '',
            ownerDisplay: 'Navin Malik',
            primaryContact: '',
            intakeContact: '',
            intakeEmail: '',
            intakePhone: '',
            notes: '',
            historyNotes: '',
            questionnaireSummary: '',
            questionnaireRisks: '',
            documentUrl: '',
            documentNotes: '',
            publishProject: false,
            hsMatchingCompleted: false,
            regulatoryFlag: false,
            requirements: JSON.parse(JSON.stringify(this.requirementSelections || {}))
        };
    }
}