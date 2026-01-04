import { LightningElement, track } from 'lwc';

export default class PipelineMaster extends LightningElement {
    @track activeTab = 'healthSystems';
    @track sortBy = '';
    @track sortDirection = 'asc';
    @track pageIndex = 0;
    @track pageSize = 10;
    @track pageSizeOptions = [5, 10, 25, 50, 100];
    @track showFilters = false;
    
    // Enquiry Inner Screen Navigation
    @track showEnquiryInnerScreen = false;
    @track currentEnquiryId = '';
    
    // (Requirements and HS Matches features removed)
    
    // Select and HS Interested Checkboxes
    // (HS Matches UI removed)
    
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
    
    // (Requirement groups removed)

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
        { id: 'ENQ001', enquiryId: 'New1455', enquiryName: 'CDS Project', status: 'Study ongoing', completion: 76, sponsorName: 'Sample Sponsor', lastUpdated: '2025-11-15', state: 'California', city: 'San Francisco', contact: 'Dr. John Smith', email: 'john.smith@stmary.com', phone: '+1-415-555-0100' },
        { id: 'ENQ002', enquiryId: 'PX-1002', enquiryName: 'Beta Trial', status: 'Deep Dive Call', completion: 45, sponsorName: 'BioHealth Ltd', lastUpdated: '2025-11-10', state: 'Texas', city: 'Houston', contact: 'Dr. Lisa Chen', email: 'lisa.chen@greenvalley.com', phone: '+1-713-555-0200' },
        { id: 'ENQ003', enquiryId: 'PX-1003', enquiryName: 'Gamma Research', status: 'Protocol Draft 1 creation', completion: 62, sponsorName: 'MedSolutions', lastUpdated: '2025-11-08', state: 'New York', city: 'New York', contact: 'Dr. Michael Kim', email: 'michael.kim@northside.com', phone: '+1-212-555-0300' },
        { id: 'ENQ004', enquiryId: 'PX-1004', enquiryName: 'Delta Study', status: 'Study Ongoing', completion: 88, sponsorName: 'Global Trials', lastUpdated: '2025-11-12', state: 'Illinois', city: 'Chicago', contact: 'Dr. Raj Patel', email: 'raj.patel@stmary.com', phone: '+1-312-555-0400' },
        { id: 'ENQ005', enquiryId: 'PX-1005', enquiryName: 'Epsilon Pilot', status: 'Project On Hold', completion: 30, sponsorName: 'Acme Pharma', lastUpdated: '2025-10-25', state: 'Florida', city: 'Miami', contact: 'Dr. Sarah Lee', email: 'sarah.lee@greenvalley.com', phone: '+1-305-555-0500' },
        { id: 'ENQ006', enquiryId: 'PX-1006', enquiryName: 'Zeta Analysis', status: 'Initial Review', completion: 20, sponsorName: 'NextGen Pharma', lastUpdated: '2025-11-05', state: 'Texas', city: 'Dallas', contact: 'Dr. Kevin Brown', email: 'kevin.brown@houstonhealth.com', phone: '+1-214-555-1000' },
        { id: 'ENQ007', enquiryId: 'PX-1007', enquiryName: 'Theta Clinical Study', status: 'Feasibility Check', completion: 52, sponsorName: 'Alpha Bio', lastUpdated: '2025-10-30', state: 'Florida', city: 'Orlando', contact: 'Dr. Emily Clark', email: 'emily.clark@orlandohealth.com', phone: '+1-407-555-2000' },
        { id: 'ENQ008', enquiryId: 'PX-1008', enquiryName: 'Omega Trial', status: 'Study Ongoing', completion: 74, sponsorName: 'TriCore Labs', lastUpdated: '2025-11-14', state: 'California', city: 'San Diego', contact: 'Dr. Peter Adams', email: 'peter.adams@sandiegohealth.com', phone: '+1-619-555-3000' },
        { id: 'ENQ009', enquiryId: 'PX-1009', enquiryName: 'Sigma Research', status: 'Protocol Review', completion: 60, sponsorName: 'BioVantage', lastUpdated: '2025-11-09', state: 'Illinois', city: 'Chicago', contact: 'Dr. Anna White', email: 'anna.white@cggeneral.com', phone: '+1-312-555-4000' },
        { id: 'ENQ010', enquiryId: 'PX-1010', enquiryName: 'Lambda Study', status: 'Kickoff Meeting', completion: 10, sponsorName: 'OptimaBio', lastUpdated: '2025-11-01', state: 'Texas', city: 'Austin', contact: 'Dr. Jake Donovan', email: 'jake.donovan@houstonhealth.com', phone: '+1-512-555-5000' },
        { id: 'ENQ011', enquiryId: 'PX-1011', enquiryName: 'Kappa Trial', status: 'Deep Dive Call', completion: 48, sponsorName: 'HealthWave', lastUpdated: '2025-11-11', state: 'New York', city: 'Buffalo', contact: 'Dr. Laura Jones', email: 'laura.jones@nmc.com', phone: '+1-716-555-6000' },
        { id: 'ENQ012', enquiryId: 'PX-1012', enquiryName: 'Mu Clinical Study', status: 'Study Ongoing', completion: 70, sponsorName: 'BioMedX', lastUpdated: '2025-11-13', state: 'Florida', city: 'Tampa', contact: 'Dr. Henry Ford', email: 'henry.ford@miamimed.com', phone: '+1-813-555-7000' },
        { id: 'ENQ013', enquiryId: 'PX-1013', enquiryName: 'Nu Discovery', status: 'Protocol Draft 1 Creation', completion: 57, sponsorName: 'LifeCure', lastUpdated: '2025-11-06', state: 'California', city: 'Los Angeles', contact: 'Dr. Samuel Green', email: 'sam.green@stmary.com', phone: '+1-213-555-7100' },
        { id: 'ENQ014', enquiryId: 'PX-1014', enquiryName: 'Xi Research', status: 'Project On Hold', completion: 22, sponsorName: 'BioAxis', lastUpdated: '2025-11-02', state: 'Texas', city: 'San Antonio', contact: 'Dr. Karen Wells', email: 'karen.wells@houstonhealth.com', phone: '+1-210-555-7200' },
        { id: 'ENQ015', enquiryId: 'PX-1015', enquiryName: 'Omicron Trial', status: 'Feasibility Check', completion: 40, sponsorName: 'MedCore', lastUpdated: '2025-10-28', state: 'Florida', city: 'Jacksonville', contact: 'Dr. Olivia Reed', email: 'olivia.reed@orlandohealth.com', phone: '+1-904-555-7300' },
        { id: 'ENQ016', enquiryId: 'PX-1016', enquiryName: 'Rho Clinical', status: 'Kickoff Meeting', completion: 12, sponsorName: 'NextStep Labs', lastUpdated: '2025-11-04', state: 'New York', city: 'Albany', contact: 'Dr. Robert Miller', email: 'rob.miller@nmc.com', phone: '+1-518-555-7400' },
        { id: 'ENQ017', enquiryId: 'PX-1017', enquiryName: 'Tau Study', status: 'Study Ongoing', completion: 65, sponsorName: 'GenMed', lastUpdated: '2025-11-07', state: 'California', city: 'Sacramento', contact: 'Dr. Daniel Carter', email: 'daniel.carter@stmary.com', phone: '+1-916-555-7500' },
        { id: 'ENQ018', enquiryId: 'PX-1018', enquiryName: 'Chi Research', status: 'Protocol Review', completion: 55, sponsorName: 'BioNova', lastUpdated: '2025-10-31', state: 'Illinois', city: 'Springfield', contact: 'Dr. Megan Scott', email: 'megan.scott@cggeneral.com', phone: '+1-217-555-7600' },
        { id: 'ENQ019', enquiryId: 'PX-1019', enquiryName: 'Psi Pilot', status: 'Initial Review', completion: 18, sponsorName: 'MedPrime', lastUpdated: '2025-10-29', state: 'Florida', city: 'St. Petersburg', contact: 'Dr. Nina Harris', email: 'nina.harris@orlandohealth.com', phone: '+1-727-555-7700' },
        { id: 'ENQ020', enquiryId: 'PX-1020', enquiryName: 'Omega-2 Trial', status: 'Study Ongoing', completion: 80, sponsorName: 'NextGen Bio', lastUpdated: '2025-11-14', state: 'Texas', city: 'Houston', contact: 'Dr. Paul Rivera', email: 'paul.rivera@houstonhealth.com', phone: '+1-713-555-7800' }
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
        
        // Compute the CSS class for known statuses (no inline styles)
        let statusClass = 'status-badge status-default';
        if (s === 'partner') {
            statusClass = 'status-badge status-partner';
        } else if (s === 'prospect' || s === 'onboarding') {
            statusClass = 'status-badge status-prospect';
        } else if (s === 'active') {
            statusClass = 'status-badge status-active';
        } else if (s === 'inactive') {
            statusClass = 'status-badge status-inactive';
        } else if (s === 'completed') {
            statusClass = 'status-badge status-completed';
        } else if (s === 'study ongoing') {
            statusClass = 'status-badge status-study-ongoing';
        } else if (s.includes('deep dive')) {
            statusClass = 'status-badge status-deep-dive';
        } else if (s.includes('protocol draft') || s.includes('protocol draft 1') || s.includes('protocol draft 1 creation')) {
            statusClass = 'status-badge status-protocol-draft';
        } else if (s.includes('project on hold') || s.includes('on hold')) {
            statusClass = 'status-badge status-on-hold';
        } else if (s.includes('initial review')) {
            statusClass = 'status-badge status-initial-review';
        } else if (s.includes('feasibility check')) {
            statusClass = 'status-badge status-feasibility';
        } else if (s.includes('protocol review')) {
            statusClass = 'status-badge status-protocol-review';
        } else if (s.includes('kickoff meeting') || s.includes('kick-off') || s.includes('kickoff')) {
            statusClass = 'status-badge status-kickoff';
        }

        return {
            ...record,
            nameInitial: this.getInitials(record.name),
            sponsorInitial: this.getInitials(record.sponsorName),
            hsInitial: this.getInitials(record.healthSystemName),
            contactInitial: this.getInitials(record.contact),
            statusLower: s,
            statusClass
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

    // (Requirements modal removed)

    // Enquiry Navigation Handler
    handleEnquiryClick(event) {
        const enquiryId = event.currentTarget.dataset.id;
        console.log('Navigating to enquiry:', enquiryId);
        this.currentEnquiryId = enquiryId;
        this.showEnquiryInnerScreen = true;
    }

    // Back from Enquiry Inner Screen
    handleBackToList() {
        this.showEnquiryInnerScreen = false;
        this.currentEnquiryId = '';
    }

    // (Requirement group interactions removed)

    // (HS Matches getters removed)

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
}