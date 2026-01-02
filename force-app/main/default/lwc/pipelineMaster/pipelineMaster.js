import { LightningElement, track } from 'lwc';

export default class PipelineMaster extends LightningElement {
    @track activeTab = 'healthSystems';
    @track sortBy = '';
    @track sortDirection = 'asc';
    @track pageIndex = 0;
    @track pageSize = 10;
    @track pageSizeOptions = [5, 10, 25, 50, 100];
    @track showFilters = false;
    
    // Requirements Modal State
    @track showRequirementsModal = false;
    @track selectedEnquiryId = '';
    @track activeRequirementGroup = 'facilities';
    
    // HS Matches Modal State
    @track showHSMatchesModal = false;
    @track selectedHSMatchEnquiryId = '';
    @track selectedHSId = 'hs1';
    @track selectedHSName = 'Mayo Clinic';
    
    // Select and HS Interested Checkboxes
    @track selectCheckboxesData = [
        { id: 'sel1', label: 'Option 1', checked: true },
        { id: 'sel2', label: 'Option 2', checked: false },
        { id: 'sel3', label: 'Option 3', checked: true },
        { id: 'sel4', label: 'Option 4', checked: false },
        { id: 'sel5', label: 'Option 5', checked: true }
    ];
    
    @track hsInterestedCheckboxesData = [
        { id: 'hsi1', label: 'Interest 1', checked: true },
        { id: 'hsi2', label: 'Interest 2', checked: true },
        { id: 'hsi3', label: 'Interest 3', checked: false },
        { id: 'hsi4', label: 'Interest 4', checked: true },
        { id: 'hsi5', label: 'Interest 5', checked: false }
    ];
    
    // HS Matches List
    @track hsMatchesListData = [
        { id: 'hs1', name: 'Mayo Clinic', matchPercentage: 91 },
        { id: 'hs2', name: 'Cleveland Clinic', matchPercentage: 88 },
        { id: 'hs3', name: 'Johns Hopkins', matchPercentage: 84 },
        { id: 'hs4', name: 'Mass General', matchPercentage: 79 },
        { id: 'hs5', name: 'Stanford Health', matchPercentage: 75 }
    ];
    
    // Capability Groups Data
    @track staticCapabilityGroups = [
        {
            id: 'g_facilities',
            title: 'Facilities Available',
            isOpen: false,
            items: [
                { id: 'fa1', label: 'Academic Medical Center', hs: true, projectNeeds: true },
                { id: 'fa2', label: 'Ambulatory Surgical Center', hs: true, projectNeeds: true },
                { id: 'fa3', label: 'Center of Excellence', hs: false, projectNeeds: true },
                { id: 'fa4', label: 'Community Health Clinic', hs: true, projectNeeds: true },
                { id: 'fa5', label: 'Diagnostic Imaging Center', hs: true, projectNeeds: true },
                { id: 'fa6', label: 'Emergency Room / Urgent Care', hs: true, projectNeeds: true },
                { id: 'fa7', label: 'Hospice', hs: true, projectNeeds: true },
                { id: 'fa8', label: 'Nursing Home', hs: true, projectNeeds: true },
                { id: 'fa9', label: 'Outpatient Clinic', hs: true, projectNeeds: true },
                { id: 'fa10', label: 'Rehab Center', hs: true, projectNeeds: true },
                { id: 'fa11', label: 'Research Institution', hs: true, projectNeeds: true },
                { id: 'fa12', label: 'Other', hs: true, projectNeeds: true }
            ]
        },
        {
            id: 'g_therapeutic',
            title: 'Therapeutic Area of Focus',
            isOpen: false,
            items: [
                { id: 'ta1', label: 'Allergy and Immunology', hs: true, projectNeeds: true },
                { id: 'ta2', label: 'Cardiovascular', hs: true, projectNeeds: true },
                { id: 'ta3', label: 'Chronic Diseases', hs: true, projectNeeds: true },
                { id: 'ta4', label: 'Oncology', hs: true, projectNeeds: true },
                { id: 'ta5', label: 'Neuroscience', hs: true, projectNeeds: true }
            ]
        },
        {
            id: 'g_format',
            title: 'Innovation format interest',
            isOpen: false,
            items: [
                { id: 'if1', label: 'HCP efficacy', hs: true, projectNeeds: true },
                { id: 'if2', label: 'Mobile health app', hs: false, projectNeeds: true },
                { id: 'if3', label: 'AI algorithm', hs: true, projectNeeds: true },
                { id: 'if4', label: 'Wearable device', hs: true, projectNeeds: true },
                { id: 'if5', label: 'Web application', hs: true, projectNeeds: true },
                { id: 'if6', label: 'Digital diagnostics', hs: true, projectNeeds: true },
                { id: 'if7', label: 'Other', hs: true, projectNeeds: true }
            ]
        },
        {
            id: 'g_enduser',
            title: 'Innovation end user focus',
            isOpen: false,
            items: [
                { id: 'eu1', label: 'Providers', hs: true, projectNeeds: true },
                { id: 'eu2', label: 'Patients/Consumers', hs: true, projectNeeds: true },
                { id: 'eu3', label: 'Health Systems', hs: true, projectNeeds: true },
                { id: 'eu4', label: 'Researchers', hs: true, projectNeeds: true },
                { id: 'eu5', label: 'Administrators', hs: true, projectNeeds: true },
                { id: 'eu6', label: 'Payers', hs: true, projectNeeds: true },
                { id: 'eu7', label: 'Pharma', hs: false, projectNeeds: true },
                { id: 'eu8', label: 'Other', hs: true, projectNeeds: true }
            ]
        }
    ];
    
    // Requirement Groups Data
    @track requirementGroupsData = [
        {
            id: 'facilities',
            title: 'Facilities Available',
            items: [
                { id: 'fa1', label: 'Academic Medical Center', checked: true },
                { id: 'fa2', label: 'Ambulatory Surgical Center', checked: true },
                { id: 'fa3', label: 'Center of Excellence', checked: true },
                { id: 'fa4', label: 'Community Health Clinic', checked: true },
                { id: 'fa5', label: 'Diagnostic Imaging Center', checked: true },
                { id: 'fa6', label: 'Emergency Room / Urgent Care', checked: true },
                { id: 'fa7', label: 'Hospice', checked: true },
                { id: 'fa8', label: 'Nursing Home', checked: true },
                { id: 'fa9', label: 'Outpatient Clinic', checked: true },
                { id: 'fa10', label: 'Rehab Center', checked: true },
                { id: 'fa11', label: 'Research Institution', checked: true },
                { id: 'fa12', label: 'Other', checked: true }
            ]
        },
        {
            id: 'therapeuticArea',
            title: 'Therapeutic Area of Focus',
            items: [
                { id: 'ta1', label: 'Allergy and Immunology', checked: true },
                { id: 'ta2', label: 'Cardiovascular', checked: true },
                { id: 'ta3', label: 'Chronic Diseases', checked: true },
                { id: 'ta4', label: 'Dental', checked: true },
                { id: 'ta5', label: 'Dermatology', checked: true },
                { id: 'ta6', label: 'Diagnostic Radiology', checked: true },
                { id: 'ta7', label: 'Emergency Department (ER / ED)', checked: true },
                { id: 'ta8', label: 'Endocrinology (Diabetes, Thyroid)', checked: true },
                { id: 'ta9', label: 'ENT / Otolaryngology (Ear, Nose, Throat)', checked: true },
                { id: 'ta10', label: 'Gastroenterology', checked: true },
                { id: 'ta11', label: 'Genetic Medicine', checked: true },
                { id: 'ta12', label: 'Hematology', checked: true },
                { id: 'ta13', label: 'Infectious Disease', checked: true },
                { id: 'ta14', label: "Men's Health", checked: true },
                { id: 'ta15', label: 'Musculoskeletal', checked: true },
                { id: 'ta16', label: 'Nephrology', checked: true },
                { id: 'ta17', label: 'Neuroscience', checked: true },
                { id: 'ta18', label: 'Oncology', checked: true },
                { id: 'ta19', label: 'Ophthalmology', checked: true },
                { id: 'ta20', label: 'Pathology', checked: true },
                { id: 'ta21', label: 'Pediatrics', checked: true },
                { id: 'ta22', label: 'Physical medicine and rehab', checked: true },
                { id: 'ta23', label: 'Population Health', checked: true },
                { id: 'ta24', label: 'Preventative', checked: true },
                { id: 'ta25', label: 'Primary Care', checked: true },
                { id: 'ta26', label: 'Psychiatry', checked: true },
                { id: 'ta27', label: 'Pulmonary', checked: true },
                { id: 'ta28', label: 'Respiratory', checked: true },
                { id: 'ta29', label: 'Rheumatology', checked: true },
                { id: 'ta30', label: 'Surgery', checked: true },
                { id: 'ta31', label: 'Urology', checked: true },
                { id: 'ta32', label: "Women's Health", checked: true },
                { id: 'ta33', label: 'Other', checked: true }
            ]
        },
        {
            id: 'innovationFormat',
            title: 'Innovation format interest',
            items: [
                { id: 'if1', label: 'HCP efficacy', checked: true },
                { id: 'if2', label: 'Mobile health app', checked: true },
                { id: 'if3', label: 'AI algorithm', checked: true },
                { id: 'if4', label: 'Wearable device', checked: true },
                { id: 'if5', label: 'Web application', checked: true },
                { id: 'if6', label: 'Digital diagnostics', checked: true },
                { id: 'if7', label: 'Other', checked: true }
            ]
        },
        {
            id: 'innovationEndUser',
            title: 'Innovation end user focus',
            items: [
                { id: 'eu1', label: 'Providers', checked: true },
                { id: 'eu2', label: 'Patients/Consumers', checked: true },
                { id: 'eu3', label: 'Health Systems', checked: true },
                { id: 'eu4', label: 'Researchers', checked: true },
                { id: 'eu5', label: 'Administrators', checked: true },
                { id: 'eu6', label: 'Payers', checked: true },
                { id: 'eu7', label: 'Pharma', checked: false },
                { id: 'eu8', label: 'Other', checked: true }
            ]
        }
    ];

    // Mock data - replace with actual Apex calls
    @track healthSystemsData = [
        { id: 'HS001', name: 'Memorial Hospital', status: 'Partner', city: 'New York', state: 'NY', contact: 'John Doe', email: 'john@memorial.com', phone: '555-0101', lastUpdated: '2025-12-15' },
        { id: 'HS002', name: 'City Medical Center', status: 'Prospect', city: 'Los Angeles', state: 'CA', contact: 'Jane Smith', email: 'jane@citymed.com', phone: '555-0102', lastUpdated: '2025-12-20' }
    ];

    @track sponsorsData = [
        { id: 'SP001', name: 'PharmaCorp Inc', status: 'Partner', city: 'Boston', state: 'MA', contact: 'Mike Johnson', email: 'mike@pharmacorp.com', phone: '555-0201', lastUpdated: '2025-12-18' },
        { id: 'SP002', name: 'BioTech Solutions', status: 'Prospect', city: 'San Francisco', state: 'CA', contact: 'Sarah Williams', email: 'sarah@biotech.com', phone: '555-0202', lastUpdated: '2025-12-22' }
    ];

    @track enquiriesData = [
        { id: 'ENQ001', sponsorName: 'PharmaCorp Inc', status: 'Active', projectScoping: 'view', requirements: 5, hsMatches: 12, projectName: 'Clinical Trial Alpha', trialDetails: 'Phase III Study', contact: 'Mike Johnson', email: 'mike@pharmacorp.com', phone: '555-0201', lastUpdated: '2025-12-25' },
        { id: 'ENQ002', sponsorName: 'BioTech Solutions', status: 'Completed', projectScoping: 'view', requirements: 8, hsMatches: 7, projectName: 'Research Beta', trialDetails: 'Phase II Study', contact: 'Sarah Williams', email: 'sarah@biotech.com', phone: '555-0202', lastUpdated: '2025-12-28' }
    ];

    @track projectsData = [
        { projectId: 'PRJ001', projectName: 'Clinical Trial Alpha', status: 'Active', completion: '75%', sponsorName: 'PharmaCorp Inc', healthSystemName: 'Memorial Hospital', documents: 12, notes: 5, messages: 8, lastUpdated: '2025-12-30', state: 'NY', city: 'New York', contact: 'John Doe', email: 'john@memorial.com', phone: '555-0101' },
        { projectId: 'PRJ002', projectName: 'Research Beta', status: 'In Progress', completion: '45%', sponsorName: 'BioTech Solutions', healthSystemName: 'City Medical Center', documents: 8, notes: 3, messages: 12, lastUpdated: '2025-12-28', state: 'CA', city: 'Los Angeles', contact: 'Jane Smith', email: 'jane@citymed.com', phone: '555-0102' },
        { projectId: 'PRJ003', projectName: 'Vaccine Study', status: 'Completed', completion: '100%', sponsorName: 'PharmaCorp Inc', healthSystemName: 'Memorial Hospital', documents: 25, notes: 10, messages: 15, lastUpdated: '2025-12-15', state: 'MA', city: 'Boston', contact: 'Mike Johnson', email: 'mike@pharmacorp.com', phone: '555-0201' },
        { projectId: 'PRJ004', projectName: 'Gene Therapy Trial', status: 'Active', completion: '60%', sponsorName: 'BioTech Solutions', healthSystemName: 'Stanford Medical', documents: 15, notes: 7, messages: 20, lastUpdated: '2026-01-02', state: 'CA', city: 'San Francisco', contact: 'Sarah Williams', email: 'sarah@biotech.com', phone: '555-0202' }
    ];

    connectedCallback() {
        // Load initial data - can be replaced with Apex calls
        console.log('PipelineMaster component loaded');
        console.log('Health Systems:', this.healthSystemsData.length);
        console.log('Sponsors:', this.sponsorsData.length);
        console.log('Enquiries:', this.enquiriesData.length);
        console.log('Projects:', this.projectsData.length);
    }

    getInitials(name) {
        if (!name) return '';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    enrichRecordData(record) {
        const status = record.status || '';
        const s = status.toLowerCase();
        
        // Compute inline style for status column (text color + border color)
        let statusStyle = '';
        if (s === 'partner') {
            statusStyle = 'color: #2e844a; border: 1px solid #2e844a; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        } else if (s === 'prospect' || s === 'onboarding') {
            statusStyle = 'color: #0176d3; border: 1px solid #0176d3; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        } else if (s === 'active') {
            statusStyle = 'color: #0176d3; border: 1px solid #0176d3; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        } else if (s === 'inactive') {
            statusStyle = 'color: #c23934; border: 1px solid #c23934; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        } else if (s === 'completed') {
            statusStyle = 'color: #706e6b; border: 1px solid #706e6b; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        } else {
            statusStyle = 'color: #706e6b; border: 1px solid #706e6b; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        }

        return {
            ...record,
            nameInitial: this.getInitials(record.name),
            sponsorInitial: this.getInitials(record.sponsorName),
            hsInitial: this.getInitials(record.healthSystemName),
            contactInitial: this.getInitials(record.contact),
            statusLower: s,
            statusStyle
        };
    }

    get isHealthSystems() {
        return this.activeTab === 'healthSystems';
    }

    get isSponsors() {
        return this.activeTab === 'sponsors';
    }

    get isEnquiries() {
        return this.activeTab === 'enquiries';
    }

    get isProjects() {
        return this.activeTab === 'projects';
    }

    get healthSystemsClass() {
        return this.activeTab === 'healthSystems' ? 'tab-item active' : 'tab-item';
    }

    get sponsorsClass() {
        return this.activeTab === 'sponsors' ? 'tab-item active' : 'tab-item';
    }

    get enquiriesClass() {
        return this.activeTab === 'enquiries' ? 'tab-item active' : 'tab-item';
    }

    get projectsClass() {
        return this.activeTab === 'projects' ? 'tab-item active' : 'tab-item';
    }

    get totalSize() {
        if (this.isHealthSystems) {
            return this.healthSystemsData.length;
        } else if (this.isSponsors) {
            return this.sponsorsData.length;
        } else if (this.isEnquiries) {
            return this.enquiriesData.length;
        } else if (this.isProjects) {
            return this.projectsData.length;
        }
        return 0;
    }

    get currentData() {
        let data = [];
        if (this.isHealthSystems) {
            data = this.healthSystemsData;
        } else if (this.isSponsors) {
            data = this.sponsorsData;
        } else if (this.isEnquiries) {
            data = this.enquiriesData;
        } else if (this.isProjects) {
            data = this.projectsData;
        }
        const paginatedData = this.getPaginatedData(data);
        return paginatedData.map(record => this.enrichRecordData(record));
    }

    get sortIcon() {
        return this.sortDirection === 'asc' ? '↑' : '↓';
    }

    handleTabClick(event) {
        this.activeTab = event.currentTarget.dataset.tab;
        this.pageIndex = 0;
        this.sortBy = '';
        this.sortDirection = 'asc';
    }

    handleSort(event) {
        const field = event.currentTarget.dataset.field;
        if (this.sortBy === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = field;
            this.sortDirection = 'asc';
        }
        this.sortData();
    }

    sortData() {
        let dataToSort = [];
        if (this.isHealthSystems) {
            dataToSort = [...this.healthSystemsData];
        } else if (this.isSponsors) {
            dataToSort = [...this.sponsorsData];
        } else if (this.isEnquiries) {
            dataToSort = [...this.enquiriesData];
        } else if (this.isProjects) {
            dataToSort = [...this.projectsData];
        }

        dataToSort.sort((a, b) => {
            let aVal = a[this.sortBy] || '';
            let bVal = b[this.sortBy] || '';
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        if (this.isHealthSystems) {
            this.healthSystemsData = dataToSort;
        } else if (this.isSponsors) {
            this.sponsorsData = dataToSort;
        } else if (this.isEnquiries) {
            this.enquiriesData = dataToSort;
        } else if (this.isProjects) {
            this.projectsData = dataToSort;
        }
    }

    getPaginatedData(data) {
        const startIndex = this.pageIndex * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return data.slice(startIndex, endIndex);
    }

    handlePageChange(event) {
        this.pageIndex = event.detail.pageIndex;
        this.pageSize = event.detail.pageSize;
    }

    handleAdd() {
        // Implement add functionality
        console.log('Add clicked for:', this.activeTab);
    }

    handleFilter() {
        this.showFilters = !this.showFilters;
    }

    handleUpload() {
        // Implement upload functionality
        console.log('Upload clicked');
    }

    handleDownload() {
        // Implement download functionality
        console.log('Download clicked');
    }

    handleDownloadTemplate() {
        // Implement download template functionality
        console.log('Download template clicked');
    }

    handleEdit(event) {
        const recordId = event.currentTarget.dataset.id;
        console.log('Edit clicked for:', recordId);
        // Implement edit functionality
    }

    handleDelete(event) {
        const recordId = event.currentTarget.dataset.id;
        console.log('Delete clicked for:', recordId);
        // Implement delete functionality
    }

    // Requirements Modal Getters
    get requirementGroups() {
        return this.requirementGroupsData.map(group => {
            const selectedCount = group.items.filter(item => item.checked).length;
            return {
                ...group,
                selectedCount: `${selectedCount}/${group.items.length}`,
                navClass: this.activeRequirementGroup === group.id ? 'sidenav-item active' : 'sidenav-item'
            };
        });
    }

    get activeGroupTitle() {
        const group = this.requirementGroupsData.find(g => g.id === this.activeRequirementGroup);
        return group ? group.title : '';
    }

    get activeGroupItems() {
        const group = this.requirementGroupsData.find(g => g.id === this.activeRequirementGroup);
        return group ? group.items : [];
    }

    // Requirements Modal Handlers
    handleRequirementsClick(event) {
        const recordId = event.currentTarget.dataset.id;
        this.selectedEnquiryId = recordId;
        this.activeRequirementGroup = 'facilities';
        this.showRequirementsModal = true;
    }

    handleCloseRequirementsModal() {
        this.showRequirementsModal = false;
        this.selectedEnquiryId = '';
    }

    handleRequirementGroupClick(event) {
        const groupId = event.currentTarget.dataset.groupId;
        this.activeRequirementGroup = groupId;
    }

    handleItemCheck(event) {
        const itemId = event.currentTarget.dataset.itemId;
        const isChecked = event.target.checked;
        
        this.requirementGroupsData = this.requirementGroupsData.map(group => {
            if (group.id === this.activeRequirementGroup) {
                return {
                    ...group,
                    items: group.items.map(item => {
                        if (item.id === itemId) {
                            return { ...item, checked: isChecked };
                        }
                        return item;
                    })
                };
            }
            return group;
        });
    }

    handleSelectAll() {
        this.requirementGroupsData = this.requirementGroupsData.map(group => {
            if (group.id === this.activeRequirementGroup) {
                return {
                    ...group,
                    items: group.items.map(item => ({ ...item, checked: true }))
                };
            }
            return group;
        });
    }

    handleDeselectAll() {
        this.requirementGroupsData = this.requirementGroupsData.map(group => {
            if (group.id === this.activeRequirementGroup) {
                return {
                    ...group,
                    items: group.items.map(item => ({ ...item, checked: false }))
                };
            }
            return group;
        });
    }

    handleSaveRequirements() {
        // Calculate total selected requirements
        const totalSelected = this.requirementGroupsData.reduce((total, group) => {
            return total + group.items.filter(item => item.checked).length;
        }, 0);
        
        console.log('Saving requirements for:', this.selectedEnquiryId);
        console.log('Total selected:', totalSelected);
        
        // Update the enquiry record with the new requirements count
        this.enquiriesData = this.enquiriesData.map(enquiry => {
            if (enquiry.id === this.selectedEnquiryId) {
                return { ...enquiry, requirements: totalSelected };
            }
            return enquiry;
        });
        
        this.showRequirementsModal = false;
        this.selectedEnquiryId = '';
    }

    // HS Matches Modal Getters
    get selectCheckboxes() {
        return this.selectCheckboxesData;
    }

    get hsInterestedCheckboxes() {
        return this.hsInterestedCheckboxesData;
    }

    get hsMatchesList() {
        return this.hsMatchesListData.map(hs => ({
            ...hs,
            initials: this.getInitials(hs.name),
            itemClass: hs.id === this.selectedHSId ? 'hs-sidenav-item active' : 'hs-sidenav-item',
            matchPercentageDisplay: Math.round(hs.matchPercentage) + '%'
        }));
    }

    get capabilityGroups() {
        // Calculate total project needs across all groups
        const totalProjectNeeds = this.staticCapabilityGroups.reduce((total, group) => {
            return total + group.items.filter(item => item.projectNeeds).length;
        }, 0);

        return this.staticCapabilityGroups.map(group => {
            const enrichedItems = group.items.map(item => {
                // Calculate weight: each project need gets equal weight
                const weight = item.projectNeeds ? (100 / totalProjectNeeds) : 0;
                // Calculate score: weight if HS has capability, 0 otherwise
                const score = (item.projectNeeds && item.hs) ? weight : 0;
                
                return {
                    ...item,
                    weight: weight.toFixed(2) + '%',
                    score: score.toFixed(2) + '%',
                    weightValue: weight,
                    scoreValue: score
                };
            });

            // Calculate group totals
            const groupProjectNeedsCount = enrichedItems.filter(item => item.projectNeeds).length;
            const groupHSCount = enrichedItems.filter(item => item.hs && item.projectNeeds).length;
            const groupWeightSum = enrichedItems.reduce((sum, item) => sum + item.weightValue, 0);
            const groupScoreSum = enrichedItems.reduce((sum, item) => sum + item.scoreValue, 0);

            return {
                ...group,
                items: enrichedItems,
                projectNeedsCount: groupProjectNeedsCount,
                hsCount: groupHSCount,
                groupWeight: groupWeightSum.toFixed(2) + '%',
                groupScore: groupScoreSum.toFixed(2) + '%',
                summary: `(${groupProjectNeedsCount} / ${groupHSCount} / ${groupWeightSum.toFixed(2)}% / ${groupScoreSum.toFixed(2)}%)`
            };
        });
    }

    get totalProjectNeeds() {
        return this.staticCapabilityGroups.reduce((total, group) => {
            return total + group.items.filter(item => item.projectNeeds).length;
        }, 0);
    }

    get totalHS() {
        return this.staticCapabilityGroups.reduce((total, group) => {
            return total + group.items.filter(item => item.hs && item.projectNeeds).length;
        }, 0);
    }

    get totalWeightPercent() {
        return '100.00%';
    }

    get totalScorePercent() {
        const totalProjectNeeds = this.totalProjectNeeds;
        const totalHS = this.totalHS;
        
        // Score percentage is (total HS capabilities / total project needs) * 100
        const scorePercent = totalProjectNeeds > 0 ? (totalHS / totalProjectNeeds) * 100 : 0;
        return scorePercent.toFixed(2) + '%';
    }

    // HS Matches Modal Handlers
    handleHSMatchesClick(event) {
        const recordId = event.currentTarget.dataset.id;
        this.selectedHSMatchEnquiryId = recordId;
        // Default to first HS in the list
        this.selectedHSId = this.hsMatchesListData[0].id;
        this.selectedHSName = this.hsMatchesListData[0].name;
        this.showHSMatchesModal = true;
    }

    handleCloseHSMatchesModal() {
        this.showHSMatchesModal = false;
        this.selectedHSMatchEnquiryId = '';
    }

    handleHSCheckboxChange(event) {
        const itemId = event.currentTarget.dataset.itemId;
        const column = event.currentTarget.dataset.column;
        const isChecked = event.target.checked;
        
        if (column === 'select') {
            this.selectCheckboxesData = this.selectCheckboxesData.map(item => {
                if (item.id === itemId) {
                    return { ...item, checked: isChecked };
                }
                return item;
            });
        } else if (column === 'hsInterested') {
            this.hsInterestedCheckboxesData = this.hsInterestedCheckboxesData.map(item => {
                if (item.id === itemId) {
                    return { ...item, checked: isChecked };
                }
                return item;
            });
        }
    }

    handleHSSelect(event) {
        const item = event.currentTarget.closest('[data-id]');
        if (!item) return;
        const hsId = item.dataset.id;
        if (!hsId) return;
        
        this.selectedHSId = hsId;
        const selectedHS = this.hsMatchesListData.find(hs => hs.id === hsId);
        if (selectedHS) {
            this.selectedHSName = selectedHS.name;
        }
    }

    toggleCapabilityDropdown(event) {
        const btn = event.currentTarget.closest('[data-id]');
        if (!btn) return;
        const groupId = btn.dataset.id;
        if (!groupId) return;
        
        this.staticCapabilityGroups = this.staticCapabilityGroups.map(g => {
            if (g.id === groupId) {
                return { ...g, isOpen: !g.isOpen };
            }
            return g;
        });
    }

    handleSaveHSMatches() {
        console.log('Saving HS Matches for:', this.selectedHSMatchEnquiryId);
        this.showHSMatchesModal = false;
        this.selectedHSMatchEnquiryId = '';
    }

    handleSendToHS() {
        console.log('Send to HS clicked for:', this.selectedHSMatchEnquiryId);
        // Implement send to HS functionality
        this.showHSMatchesModal = false;
        this.selectedHSMatchEnquiryId = '';
    }

    handleApprove() {
        console.log('Approve clicked for:', this.selectedHSMatchEnquiryId);
        // Implement approve functionality
        this.showHSMatchesModal = false;
        this.selectedHSMatchEnquiryId = '';
    }
}