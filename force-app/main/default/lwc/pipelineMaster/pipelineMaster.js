import { LightningElement, track } from 'lwc';

export default class PipelineMaster extends LightningElement {
    @track activeTab = 'healthSystems';
    @track sortBy = '';
    @track sortDirection = 'asc';
    @track pageIndex = 0;
    @track pageSize = 25;
    @track pageSizeOptions = [5, 10, 25, 50, 100];
    @track showFilters = false;

    // Modal state
    @track showAddModal = false;
    @track showEditModal = false;
    @track editRecordId = '';
    // Promote modal state
    @track showPromoteModal = false;
    @track promoteRecordId = '';
    @track promoteRecordName = '';

    // Form fields (Health Systems / Sponsors)
    @track formName = '';
    @track formCity = '';
    @track formState = '';
    @track formContact = '';
    @track formEmail = '';
    @track formPhone = '';

    // Modal-specific searchable single-select dropdown state (for State/City in forms)
    @track formStateDropdownOpen = false;
    @track formCityDropdownOpen = false;
    @track formStateSearch = '';
    @track formCitySearch = '';

    // Enquiries-only fields
    @track formEnquiryStatus = 'Active';
    @track formEnquirySponsorName = '';
    @track formEnquiryProjectName = '';
    @track formEnquiryProjectDetails = '';
    @track formEnquiryDocName = '';

    enquiryStatusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Completed', value: 'Completed' }
    ];
    
    // Filter state
    @track statusDropdownOpen = false;
    @track cityDropdownOpen = false;
    @track stateDropdownOpen = false;
    @track statusOptions = [];
    @track cityOptions = [];
    @track stateOptions = [];
    @track selectedStatus = [];
    @track selectedCity = [];
    @track selectedState = [];
    
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
        { id: 'HS002', name: 'City Medical Center', status: 'Prospect', city: 'Los Angeles', state: 'CA', contact: 'Jane Smith', email: 'jane@citymed.com', phone: '555-0102', lastUpdated: '2025-12-20' },
        { id: 'HS003', name: 'Green Valley Health', status: 'Partner', city: 'Chicago', state: 'IL', contact: 'Alan Wright', email: 'alan@greenvalley.com', phone: '555-0103', lastUpdated: '2025-12-10' },
        { id: 'HS004', name: 'Bayview Medical', status: 'Prospect', city: 'San Francisco', state: 'CA', contact: 'Emily Chen', email: 'emily@bayview.com', phone: '555-0104', lastUpdated: '2025-12-12' },
        { id: 'HS005', name: 'Lakeside Clinic', status: 'Partner', city: 'Seattle', state: 'WA', contact: 'Mark Turner', email: 'mark@lakeside.com', phone: '555-0105', lastUpdated: '2025-12-08' },
        { id: 'HS006', name: 'Sunrise Hospital', status: 'Prospect', city: 'Miami', state: 'FL', contact: 'Priya Shah', email: 'priya@sunrise.com', phone: '555-0106', lastUpdated: '2025-12-05' },
        { id: 'HS007', name: 'Cedar Valley Health', status: 'Partner', city: 'Denver', state: 'CO', contact: 'Luke Adams', email: 'luke@cedarvalley.com', phone: '555-0107', lastUpdated: '2025-12-07' },
        { id: 'HS008', name: 'Harborview Center', status: 'Prospect', city: 'Boston', state: 'MA', contact: 'Sara Bennett', email: 'sara@harborview.com', phone: '555-0108', lastUpdated: '2025-12-09' },
        { id: 'HS009', name: 'Summit Health', status: 'Partner', city: 'Phoenix', state: 'AZ', contact: 'Carlos Mendez', email: 'carlos@summit.com', phone: '555-0109', lastUpdated: '2025-12-11' },
        { id: 'HS010', name: 'Prairie Care', status: 'Prospect', city: 'Dallas', state: 'TX', contact: 'Rachel Lee', email: 'rachel@prairiecare.com', phone: '555-0110', lastUpdated: '2025-12-06' },
        { id: 'HS011', name: 'Riverview Health', status: 'Partner', city: 'Portland', state: 'OR', contact: 'Tom Harris', email: 'tom@riverview.com', phone: '555-0111', lastUpdated: '2025-12-13' },
        { id: 'HS012', name: 'Coastal General', status: 'Prospect', city: 'San Diego', state: 'CA', contact: 'Nina Patel', email: 'nina@coastalgen.com', phone: '555-0112', lastUpdated: '2025-12-14' },
        { id: 'HS013', name: 'Valley Regional', status: 'Partner', city: 'Austin', state: 'TX', contact: 'Victor Cruz', email: 'victor@valleyregional.com', phone: '555-0113', lastUpdated: '2025-12-16' },
        { id: 'HS014', name: 'Evergreen Hospital', status: 'Prospect', city: 'Atlanta', state: 'GA', contact: 'Linda Park', email: 'linda@evergreen.com', phone: '555-0114', lastUpdated: '2025-12-18' },
        { id: 'HS015', name: 'Pinecrest Medical', status: 'Partner', city: 'Nashville', state: 'TN', contact: 'James Cole', email: 'james@pinecrest.com', phone: '555-0115', lastUpdated: '2025-12-17' },
        { id: 'HS016', name: 'Midtown Clinic', status: 'Prospect', city: 'Columbus', state: 'OH', contact: 'Olivia Grant', email: 'olivia@midtown.com', phone: '555-0116', lastUpdated: '2025-12-04' },
        { id: 'HS017', name: 'Highland Health', status: 'Partner', city: 'Charlotte', state: 'NC', contact: 'Ethan Ross', email: 'ethan@highland.com', phone: '555-0117', lastUpdated: '2025-12-03' },
        { id: 'HS018', name: 'Maplewood Medical', status: 'Prospect', city: 'Houston', state: 'TX', contact: 'Grace Kim', email: 'grace@maplewood.com', phone: '555-0118', lastUpdated: '2025-12-02' },
        { id: 'HS019', name: 'Canyon Ridge Health', status: 'Partner', city: 'Salt Lake City', state: 'UT', contact: 'Henry Diaz', email: 'henry@canyonridge.com', phone: '555-0119', lastUpdated: '2025-12-01' },
        { id: 'HS020', name: 'Silver Lake Clinic', status: 'Prospect', city: 'Detroit', state: 'MI', contact: 'Isabel Moore', email: 'isabel@silverlake.com', phone: '555-0120', lastUpdated: '2025-11-30' }
    ];

    @track sponsorsData = [
        { id: 'SP001', name: 'PharmaCorp Inc', status: 'Partner', city: 'Boston', state: 'MA', contact: 'Mike Johnson', email: 'mike@pharmacorp.com', phone: '555-0201', lastUpdated: '2025-12-18' },
        { id: 'SP002', name: 'BioTech Solutions', status: 'Prospect', city: 'San Francisco', state: 'CA', contact: 'Sarah Williams', email: 'sarah@biotech.com', phone: '555-0202', lastUpdated: '2025-12-22' },
        { id: 'SP003', name: 'NextGen Pharma', status: 'Partner', city: 'Houston', state: 'TX', contact: 'Kevin Brown', email: 'kevin@nextgen.com', phone: '555-0203', lastUpdated: '2025-12-15' },
        { id: 'SP004', name: 'LifeCure Labs', status: 'Prospect', city: 'Seattle', state: 'WA', contact: 'Amelia Clark', email: 'amelia@lifecure.com', phone: '555-0204', lastUpdated: '2025-12-14' },
        { id: 'SP005', name: 'Global Trials', status: 'Partner', city: 'Chicago', state: 'IL', contact: 'Raj Patel', email: 'raj@globaltrials.com', phone: '555-0205', lastUpdated: '2025-12-12' },
        { id: 'SP006', name: 'MedSolutions', status: 'Prospect', city: 'Denver', state: 'CO', contact: 'Linda Gomez', email: 'linda@medsolutions.com', phone: '555-0206', lastUpdated: '2025-12-11' },
        { id: 'SP007', name: 'HealthWave', status: 'Partner', city: 'Miami', state: 'FL', contact: 'Victor Long', email: 'victor@healthwave.com', phone: '555-0207', lastUpdated: '2025-12-10' },
        { id: 'SP008', name: 'TriCore Labs', status: 'Prospect', city: 'Phoenix', state: 'AZ', contact: 'Nora Diaz', email: 'nora@tricore.com', phone: '555-0208', lastUpdated: '2025-12-09' },
        { id: 'SP009', name: 'OptimaBio', status: 'Partner', city: 'Dallas', state: 'TX', contact: 'Chris Young', email: 'chris@optimabio.com', phone: '555-0209', lastUpdated: '2025-12-08' },
        { id: 'SP010', name: 'BioVantage', status: 'Prospect', city: 'San Diego', state: 'CA', contact: 'Irene Flores', email: 'irene@biovantage.com', phone: '555-0210', lastUpdated: '2025-12-07' },
        { id: 'SP011', name: 'Prime Therapeutics', status: 'Partner', city: 'Atlanta', state: 'GA', contact: 'Derek Lee', email: 'derek@primethera.com', phone: '555-0211', lastUpdated: '2025-12-06' },
        { id: 'SP012', name: 'Vertex Research', status: 'Prospect', city: 'Portland', state: 'OR', contact: 'Sophia Martin', email: 'sophia@vertex.com', phone: '555-0212', lastUpdated: '2025-12-05' },
        { id: 'SP013', name: 'CureGenix', status: 'Partner', city: 'Austin', state: 'TX', contact: 'Ethan Carter', email: 'ethan@curegenix.com', phone: '555-0213', lastUpdated: '2025-12-04' },
        { id: 'SP014', name: 'Synergetic Trials', status: 'Prospect', city: 'Charlotte', state: 'NC', contact: 'Grace Howard', email: 'grace@synergetic.com', phone: '555-0214', lastUpdated: '2025-12-03' },
        { id: 'SP015', name: 'Pulse BioResearch', status: 'Partner', city: 'Columbus', state: 'OH', contact: 'Oliver Scott', email: 'oliver@pulsebio.com', phone: '555-0215', lastUpdated: '2025-12-02' },
        { id: 'SP016', name: 'Everest BioCare', status: 'Prospect', city: 'Detroit', state: 'MI', contact: 'Harper James', email: 'harper@everestbio.com', phone: '555-0216', lastUpdated: '2025-12-01' },
        { id: 'SP017', name: 'Zenith Pharma', status: 'Partner', city: 'Tampa', state: 'FL', contact: 'Liam Brooks', email: 'liam@zenithpharma.com', phone: '555-0217', lastUpdated: '2025-11-30' },
        { id: 'SP018', name: 'NovaTrials', status: 'Prospect', city: 'Philadelphia', state: 'PA', contact: 'Chloe Evans', email: 'chloe@novatrials.com', phone: '555-0218', lastUpdated: '2025-11-29' },
        { id: 'SP019', name: 'Clinix Research', status: 'Partner', city: 'Kansas City', state: 'MO', contact: 'Noah Price', email: 'noah@clinix.com', phone: '555-0219', lastUpdated: '2025-11-28' },
        { id: 'SP020', name: 'TrustMed Global', status: 'Prospect', city: 'Orlando', state: 'FL', contact: 'Ava Reed', email: 'ava@trustmed.com', phone: '555-0220', lastUpdated: '2025-11-27' }
    ];

    @track enquiriesData = [
        { id: 'ENQ001', enquiryId: 'New1455', status: 'Active', statusClass: 'status-badge status-active', sponsorName: 'Sample Sponsor', sponsorInitial: 'SS', projectName: 'CDS Clinical Trial', projectDetails: 'Phase III cardiovascular study', hasDocument: true, hsAllocated: 'Mayo Clinic', dateCreated: '2025-10-15', lastUpdated: '2025-11-15' },
        { id: 'ENQ002', enquiryId: 'PX-1002', status: 'Active', statusClass: 'status-badge status-active', sponsorName: 'BioHealth Ltd', sponsorInitial: 'BH', projectName: 'Beta Research', projectDetails: 'Oncology drug trial Phase II', hasDocument: true, hsAllocated: 'Cleveland Clinic', dateCreated: '2025-10-10', lastUpdated: '2025-11-10' },
        { id: 'ENQ003', enquiryId: 'PX-1003', status: 'Inactive', statusClass: 'status-badge status-inactive', sponsorName: 'MedSolutions', sponsorInitial: 'MS', projectName: 'Gamma Protocol', projectDetails: 'Neurological disorder study', hasDocument: false, hsAllocated: '-', dateCreated: '2025-10-08', lastUpdated: '2025-11-08' },
        { id: 'ENQ004', enquiryId: 'PX-1004', status: 'Active', statusClass: 'status-badge status-active', sponsorName: 'Global Trials', sponsorInitial: 'GT', projectName: 'Delta Study', projectDetails: 'Diabetes management research', hasDocument: true, hsAllocated: 'Johns Hopkins', dateCreated: '2025-10-12', lastUpdated: '2025-11-12' },
        { id: 'ENQ005', enquiryId: 'PX-1005', status: 'Inactive', statusClass: 'status-badge status-inactive', sponsorName: 'Acme Pharma', sponsorInitial: 'AP', projectName: 'Epsilon Trial', projectDetails: 'Immunology clinical trial', hasDocument: false, hsAllocated: '-', dateCreated: '2025-09-25', lastUpdated: '2025-10-25' },
        { id: 'ENQ006', enquiryId: 'PX-1006', status: 'Active', statusClass: 'status-badge status-active', sponsorName: 'NextGen Pharma', sponsorInitial: 'NP', projectName: 'Zeta Discovery', projectDetails: 'Rare disease treatment study', hasDocument: true, hsAllocated: 'Stanford Health', dateCreated: '2025-10-05', lastUpdated: '2025-11-05' },
        { id: 'ENQ007', enquiryId: 'PX-1007', status: 'Completed', statusClass: 'status-badge status-completed', sponsorName: 'Alpha Bio', sponsorInitial: 'AB', projectName: 'Theta Clinical', projectDetails: 'Respiratory disease trial', hasDocument: true, hsAllocated: 'Mass General', dateCreated: '2025-09-30', lastUpdated: '2025-10-30' },
        { id: 'ENQ008', enquiryId: 'PX-1008', status: 'Active', statusClass: 'status-badge status-active', sponsorName: 'TriCore Labs', sponsorInitial: 'TL', projectName: 'Omega Research', projectDetails: 'Pain management study', hasDocument: true, hsAllocated: 'UCSF Medical', dateCreated: '2025-10-14', lastUpdated: '2025-11-14' },
        { id: 'ENQ009', enquiryId: 'PX-1009', status: 'Active', statusClass: 'status-badge status-active', sponsorName: 'BioVantage', sponsorInitial: 'BV', projectName: 'Sigma Trial', projectDetails: 'Infectious disease protocol', hasDocument: false, hsAllocated: 'Northwestern', dateCreated: '2025-10-09', lastUpdated: '2025-11-09' },
        { id: 'ENQ010', enquiryId: 'PX-1010', status: 'Inactive', statusClass: 'status-badge status-inactive', sponsorName: 'OptimaBio', sponsorInitial: 'OB', projectName: 'Lambda Study', projectDetails: 'Metabolic syndrome research', hasDocument: false, hsAllocated: '-', dateCreated: '2025-10-01', lastUpdated: '2025-11-01' },
        { id: 'ENQ011', enquiryId: 'PX-1011', status: 'Active', statusClass: 'status-badge status-active', sponsorName: 'HealthWave', sponsorInitial: 'HW', projectName: 'Kappa Protocol', projectDetails: 'Cardiovascular intervention', hasDocument: true, hsAllocated: 'Duke Health', dateCreated: '2025-10-11', lastUpdated: '2025-11-11' },
        { id: 'ENQ012', enquiryId: 'PX-1012', status: 'Active', statusClass: 'status-badge status-active', sponsorName: 'BioMedX', sponsorInitial: 'BX', projectName: 'Mu Clinical', projectDetails: 'Renal disease study', hasDocument: true, hsAllocated: 'Emory Healthcare', dateCreated: '2025-10-13', lastUpdated: '2025-11-13' },
        { id: 'ENQ013', enquiryId: 'PX-1013', status: 'Completed', statusClass: 'status-badge status-completed', sponsorName: 'LifeCure', sponsorInitial: 'LC', projectName: 'Nu Discovery', projectDetails: 'Cancer immunotherapy trial', hasDocument: true, hsAllocated: 'UCLA Health', dateCreated: '2025-10-06', lastUpdated: '2025-11-06' },
        { id: 'ENQ014', enquiryId: 'PX-1014', status: 'Inactive', statusClass: 'status-badge status-inactive', sponsorName: 'BioAxis', sponsorInitial: 'BA', projectName: 'Xi Research', projectDetails: 'Genetic disorder study', hasDocument: false, hsAllocated: '-', dateCreated: '2025-10-02', lastUpdated: '2025-11-02' },
        { id: 'ENQ015', enquiryId: 'PX-1015', status: 'Active', statusClass: 'status-badge status-active', sponsorName: 'MedCore', sponsorInitial: 'MC', projectName: 'Omicron Trial', projectDetails: 'Dermatology clinical study', hasDocument: true, hsAllocated: 'Tampa General', dateCreated: '2025-09-28', lastUpdated: '2025-10-28' },
        { id: 'ENQ016', enquiryId: 'PX-1016', status: 'Active', statusClass: 'status-badge status-active', sponsorName: 'NextStep Labs', sponsorInitial: 'NS', projectName: 'Rho Clinical', projectDetails: 'Ophthalmology research', hasDocument: false, hsAllocated: 'Albany Medical', dateCreated: '2025-10-04', lastUpdated: '2025-11-04' },
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
        // Initialize filter options
        this.initializeFilterOptions();
        
        // Load initial data - can be replaced with Apex calls
        console.log('PipelineMaster component loaded');
        console.log('Health Systems:', this.healthSystemsData.length);
        console.log('Sponsors:', this.sponsorsData.length);
        console.log('Enquiries:', this.enquiriesData.length);
        console.log('Projects:', this.projectsData.length);
    }

    initializeFilterOptions() {
        // Status options will be set dynamically based on active tab
        this.updateStatusOptions();

        // Use the same canonical State and City lists as `sponsers` component
        this.stateOptions = [
            { label: 'Telangana', value: 'Telangana', checked: false },
            { label: 'Delhi', value: 'Delhi', checked: false },
            { label: 'Maharashtra', value: 'Maharashtra', checked: false },
            { label: 'Karnataka', value: 'Karnataka', checked: false }
        ];

        this.cityOptions = [
            { label: 'Hyderabad', value: 'Hyderabad', checked: false },
            { label: 'Delhi', value: 'Delhi', checked: false },
            { label: 'Mumbai', value: 'Mumbai', checked: false },
            { label: 'Bangalore', value: 'Bangalore', checked: false }
        ];
    }

    updateStatusOptions() {
        // Set status options based on active tab
        if (this.activeTab === 'enquiries') {
            // Enquiries: Active, Inactive, Completed
            this.statusOptions = [
                { label: 'Active', value: 'Active', checked: false },
                { label: 'Inactive', value: 'Inactive', checked: false },
                { label: 'Completed', value: 'Completed', checked: false }
            ];
        } else if (this.activeTab === 'healthSystems' || this.activeTab === 'sponsors') {
            // Health Systems and Sponsors: Prospects, Partner
            this.statusOptions = [
                { label: 'Prospects', value: 'Prospect', checked: false },
                { label: 'Partner', value: 'Partner', checked: false }
            ];
        } else {
            // Default: build from all datasets
            const allStatuses = new Set();
            this.healthSystemsData.forEach(item => item.status && allStatuses.add(item.status));
            this.sponsorsData.forEach(item => item.status && allStatuses.add(item.status));
            this.enquiriesData.forEach(item => item.status && allStatuses.add(item.status));
            this.projectsData.forEach(item => item.status && allStatuses.add(item.status));
            this.statusOptions = Array.from(allStatuses).map(s => ({ label: s, value: s, checked: false }));
        }
    }

    // Filter dropdown classes
    get statusDropdownClass() { 
        return this.statusDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; 
    }
    
    get cityDropdownClass() { 
        return this.cityDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; 
    }
    
    get stateDropdownClass() { 
        return this.stateDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; 
    }

    // Filter display text
    get statusDisplayText() { 
        const count = this.statusOptions.filter(o => o.checked).length; 
        return count > 0 ? count + ' selected' : 'Select'; 
    }
    
    get cityDisplayText() { 
        const count = this.cityOptions.filter(o => o.checked).length; 
        return count > 0 ? count + ' selected' : 'Select'; 
    }
    
    get stateDisplayText() { 
        const count = this.stateOptions.filter(o => o.checked).length; 
        return count > 0 ? count + ' selected' : 'Select'; 
    }

    // Form dropdown classes and helpers
    get formStateDropdownClass() { return this.formStateDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get formCityDropdownClass() { return this.formCityDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get formFilteredStateOptions() { return this.formStateSearch ? this.stateOptions.filter(opt => opt.label.toLowerCase().includes(this.formStateSearch.toLowerCase())) : this.stateOptions; }
    get formFilteredCityOptions() { return this.formCitySearch ? this.cityOptions.filter(opt => opt.label.toLowerCase().includes(this.formCitySearch.toLowerCase())) : this.cityOptions; }
    get formStateDisplay() { return this.formState || 'Select State'; }
    get formCityDisplay() { return this.formCity || 'Select City'; }

    toggleFormStateDropdown() { this.formStateDropdownOpen = !this.formStateDropdownOpen; if (this.formStateDropdownOpen) this.formCityDropdownOpen = false; }
    toggleFormCityDropdown() { this.formCityDropdownOpen = !this.formCityDropdownOpen; if (this.formCityDropdownOpen) this.formStateDropdownOpen = false; }
    handleFormStateSearchInput(event) { this.formStateSearch = event.target.value; }
    handleFormCitySearchInput(event) { this.formCitySearch = event.target.value; }
    selectFormState(event) { const val = event.currentTarget.dataset.value; if (val) { this.formState = val; } this.formStateDropdownOpen = false; }
    selectFormCity(event) { const val = event.currentTarget.dataset.value; if (val) { this.formCity = val; } this.formCityDropdownOpen = false; }

    // Toggle dropdown methods
    toggleStatusDropdown() { 
        this.statusDropdownOpen = !this.statusDropdownOpen; 
        this.closeOtherDropdowns('status'); 
    }
    
    toggleCityDropdown() { 
        this.cityDropdownOpen = !this.cityDropdownOpen; 
        this.closeOtherDropdowns('city'); 
    }
    
    toggleStateDropdown() { 
        this.stateDropdownOpen = !this.stateDropdownOpen; 
        this.closeOtherDropdowns('state'); 
    }

    closeOtherDropdowns(except) {
        if (except !== 'status') this.statusDropdownOpen = false;
        if (except !== 'city') this.cityDropdownOpen = false;
        if (except !== 'state') this.stateDropdownOpen = false;
    }

    // Checkbox change handlers
    handleStatusCheckboxChange(event) { 
        const value = event.target.value; 
        const checked = event.target.checked; 
        this.statusOptions = this.statusOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); 
    }
    
    handleCityCheckboxChange(event) { 
        const value = event.target.value; 
        const checked = event.target.checked; 
        this.cityOptions = this.cityOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); 
    }
    
    handleStateCheckboxChange(event) { 
        const value = event.target.value; 
        const checked = event.target.checked; 
        this.stateOptions = this.stateOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); 
    }

    // Filter actions
    clearAllFilters() {
        this.statusOptions = this.statusOptions.map(opt => ({ ...opt, checked: false }));
        this.cityOptions = this.cityOptions.map(opt => ({ ...opt, checked: false }));
        this.stateOptions = this.stateOptions.map(opt => ({ ...opt, checked: false }));
        this.selectedStatus = [];
        this.selectedCity = [];
        this.selectedState = [];
    }

    closeFilter() {
        this.showFilters = false;
        this.closeOtherDropdowns('');
    }

    closeAddModal() { this.showAddModal = false; }
    closeEditModal() { this.showEditModal = false; }

    applyFilter() {
        this.selectedStatus = this.statusOptions.filter(o => o.checked).map(o => o.value);
        this.selectedCity = this.cityOptions.filter(o => o.checked).map(o => o.value);
        this.selectedState = this.stateOptions.filter(o => o.checked).map(o => o.value);
        this.closeOtherDropdowns('');
        this.pageIndex = 0;
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
            statusClass,
            // promotion availability: only allow promote when status is exactly 'prospect'
            canPromote: s === 'prospect',
            promoteDisabled: s !== 'prospect'
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
        // Update status options based on new active tab
        this.updateStatusOptions();
        // Reset filter selections
        this.selectedStatus = [];
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
        this.editRecordId = '';
        this.formName = '';
        this.formCity = '';
        this.formState = '';
        this.formContact = '';
        this.formEmail = '';
        this.formPhone = '';
        this.formEnquiryStatus = 'Active';
        this.formEnquirySponsorName = '';
        this.formEnquiryProjectName = '';
        this.formEnquiryProjectDetails = '';
        this.formEnquiryDocName = '';
        this.showAddModal = true;
    }

    handleFilter() {
        this.showFilters = !this.showFilters;
    }

    handleUpload() {
        // Implement upload functionality
        console.log('Upload clicked');
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        if (name && Object.prototype.hasOwnProperty.call(this, name)) {
            this[name] = value;
        }
    }

    handleDocChange(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
            this.formEnquiryDocName = files[0].name;
        }
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
        if (!recordId) return;
        let rec;
        if (this.isHealthSystems) {
            rec = this.healthSystemsData.find(r => r.id === recordId);
            if (rec) {
                this.formName = rec.name || '';
                this.formCity = rec.city || '';
                this.formState = rec.state || '';
                this.formContact = rec.contact || '';
                this.formEmail = rec.email || '';
                this.formPhone = rec.phone || '';
            }
        } else if (this.isSponsors) {
            rec = this.sponsorsData.find(r => r.id === recordId);
            if (rec) {
                this.formName = rec.name || '';
                this.formCity = rec.city || '';
                this.formState = rec.state || '';
                this.formContact = rec.contact || '';
                this.formEmail = rec.email || '';
                this.formPhone = rec.phone || '';
            }
        } else if (this.isEnquiries) {
            rec = this.enquiriesData.find(r => r.id === recordId);
            if (rec) {
                this.formEnquiryStatus = rec.status || 'Active';
                this.formEnquirySponsorName = rec.sponsorName || '';
                this.formEnquiryProjectName = rec.projectName || rec.enquiryName || '';
                this.formEnquiryProjectDetails = rec.projectDetails || '';
                this.formEnquiryDocName = rec.projectScopingDoc || '';
            }
        }
        if (!rec) return;
        this.editRecordId = recordId;
        this.showEditModal = true;
    }

    handleDelete(event) {
        const recordId = event.currentTarget.dataset.id;
        console.log('Delete clicked for:', recordId);
        // Implement delete functionality
    }

    // Promote handlers
    openPromoteModal(event) {
        const recordId = event && event.currentTarget ? event.currentTarget.dataset.id : null;
        if (!recordId) return;
        // find in current active dataset
        let rec = null;
        if (this.isHealthSystems) rec = this.healthSystemsData.find(r => r.id === recordId);
        else if (this.isSponsors) rec = this.sponsorsData.find(r => r.id === recordId);
        if (!rec) return;
        const statusLower = (rec.status || '').toLowerCase();
        if (statusLower !== 'prospect') return; // only allow when prospect
        this.promoteRecordId = recordId;
        this.promoteRecordName = rec.name || rec.sponsorName || '';
        this.showPromoteModal = true;
    }

    closePromoteModal() {
        this.showPromoteModal = false;
        this.promoteRecordId = '';
        this.promoteRecordName = '';
    }

    confirmPromote() {
        const id = this.promoteRecordId;
        if (!id) return this.closePromoteModal();
        // update in whichever dataset contains the id
        let idx = this.healthSystemsData.findIndex(r => r.id === id);
        if (idx !== -1) {
            const updated = { ...this.healthSystemsData[idx], status: 'Partner', lastUpdated: new Date().toISOString().slice(0,10) };
            this.healthSystemsData = [...this.healthSystemsData.slice(0, idx), updated, ...this.healthSystemsData.slice(idx + 1)];
            this.closePromoteModal();
            return;
        }
        idx = this.sponsorsData.findIndex(r => r.id === id);
        if (idx !== -1) {
            const updated = { ...this.sponsorsData[idx], status: 'Partner', lastUpdated: new Date().toISOString().slice(0,10) };
            this.sponsorsData = [...this.sponsorsData.slice(0, idx), updated, ...this.sponsorsData.slice(idx + 1)];
            this.closePromoteModal();
            return;
        }
        this.closePromoteModal();
    }

    // Save handlers for Add/Edit
    saveAdd() {
        if (this.isHealthSystems) {
            const id = `HS${Date.now()}`;
            const newRec = {
                id,
                name: this.formName,
                status: 'Prospect',
                city: this.formCity,
                state: this.formState,
                contact: this.formContact,
                email: this.formEmail,
                phone: this.formPhone,
                lastUpdated: new Date().toISOString().slice(0,10)
            };
            this.healthSystemsData = [newRec, ...this.healthSystemsData];
        } else if (this.isSponsors) {
            const id = `SP${Date.now()}`;
            const newRec = {
                id,
                name: this.formName,
                status: 'Prospect',
                city: this.formCity,
                state: this.formState,
                contact: this.formContact,
                email: this.formEmail,
                phone: this.formPhone,
                lastUpdated: new Date().toISOString().slice(0,10)
            };
            this.sponsorsData = [newRec, ...this.sponsorsData];
        } else if (this.isEnquiries) {
            const id = `ENQ${Date.now()}`;
            const newRec = {
                id,
                enquiryId: id,
                status: this.formEnquiryStatus,
                statusClass: this.getStatusClassForEnquiry(this.formEnquiryStatus),
                sponsorName: this.formEnquirySponsorName,
                sponsorInitial: this.getInitials(this.formEnquirySponsorName),
                projectName: this.formEnquiryProjectName,
                projectDetails: this.formEnquiryProjectDetails,
                projectScopingDoc: this.formEnquiryDocName,
                hasDocument: !!this.formEnquiryDocName,
                hsAllocated: '-',
                dateCreated: new Date().toISOString().slice(0,10),
                lastUpdated: new Date().toISOString().slice(0,10)
            };
            this.enquiriesData = [newRec, ...this.enquiriesData];
        }
        this.showAddModal = false;
    }

    saveEdit() {
        if (!this.editRecordId) { this.showEditModal = false; return; }
        if (this.isHealthSystems) {
            const idx = this.healthSystemsData.findIndex(r => r.id === this.editRecordId);
            if (idx !== -1) {
                const updated = { ...this.healthSystemsData[idx] };
                updated.name = this.formName;
                updated.city = this.formCity;
                updated.state = this.formState;
                updated.contact = this.formContact;
                updated.email = this.formEmail;
                updated.phone = this.formPhone;
                updated.lastUpdated = new Date().toISOString().slice(0,10);
                this.healthSystemsData = [...this.healthSystemsData.slice(0, idx), updated, ...this.healthSystemsData.slice(idx + 1)];
            }
        } else if (this.isSponsors) {
            const idx = this.sponsorsData.findIndex(r => r.id === this.editRecordId);
            if (idx !== -1) {
                const updated = { ...this.sponsorsData[idx] };
                updated.name = this.formName;
                updated.city = this.formCity;
                updated.state = this.formState;
                updated.contact = this.formContact;
                updated.email = this.formEmail;
                updated.phone = this.formPhone;
                updated.lastUpdated = new Date().toISOString().slice(0,10);
                this.sponsorsData = [...this.sponsorsData.slice(0, idx), updated, ...this.sponsorsData.slice(idx + 1)];
            }
        } else if (this.isEnquiries) {
            const idx = this.enquiriesData.findIndex(r => r.id === this.editRecordId);
            if (idx !== -1) {
                const updated = { ...this.enquiriesData[idx] };
                updated.status = this.formEnquiryStatus;
                updated.statusClass = this.getStatusClassForEnquiry(this.formEnquiryStatus);
                updated.sponsorName = this.formEnquirySponsorName;
                updated.sponsorInitial = this.getInitials(this.formEnquirySponsorName);
                updated.projectName = this.formEnquiryProjectName;
                updated.projectDetails = this.formEnquiryProjectDetails;
                updated.projectScopingDoc = this.formEnquiryDocName;
                updated.hasDocument = !!this.formEnquiryDocName;
                updated.lastUpdated = new Date().toISOString().slice(0,10);
                this.enquiriesData = [...this.enquiriesData.slice(0, idx), updated, ...this.enquiriesData.slice(idx + 1)];
            }
        }
        this.showEditModal = false;
    }

    getStatusClassForEnquiry(status) {
        const s = (status || '').toLowerCase();
        if (s === 'active') return 'status-badge status-active';
        if (s === 'inactive') return 'status-badge status-inactive';
        if (s === 'completed') return 'status-badge status-completed';
        return 'status-badge status-default';
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