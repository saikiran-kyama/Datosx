import { LightningElement } from 'lwc';
import AVATARS from '@salesforce/resourceUrl/avatars';

export default class Projects extends LightningElement {
    // Filters
    showFilters = false;
    searchKey = '';
    statusDropdownOpen = false;
    sponsorDropdownOpen = false;
    healthDropdownOpen = false;

    selectedStatus = [];
    selectedSponsor = [];
    selectedHealth = [];

    // Sorting
    sortField = '';
    sortOrder = 'asc'; // 'asc' or 'desc'

    // Sample Data for Projects (updated to match requested columns)
     data = [
    // --- Existing 5 Records You Provided ---
    { 
        id: '1', 
        projectId: 'New1455', 
        projectName: 'CDS Project', 
        status: 'Study ongoing', 
        completion: 76,
        sponsorName: 'Sample Sponsor', 
        sponsorPhoto: `${AVATARS}/ODF1.png`, 
        healthSystemName: 'St. Mary Hospital', 
        healthPhoto: `${AVATARS}/HS1.png`,
        documents: 3,
        notes: 2,
        messages: 28,
        lastUpdated: '2025-11-15',
        state: 'California',
        city: 'San Francisco',
        contact: 'Dr. John Smith',
        contactPhoto: `${AVATARS}/1.svg.jpg`,
        email: 'john.smith@stmary.com',
        phone: '+1-415-555-0100',
        twoPager: 'Study Two-pager',
        description: '',
        history: '',
        ownerName: 'datosX primary contact',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },
    { id: '2', projectId: 'PX-1002', projectName: 'Beta Trial', status: 'Deep Dive Call', completion: 45, sponsorName: 'BioHealth Ltd', sponsorPhoto: `${AVATARS}/ODF2.png`, healthSystemName: 'Green Valley Clinic', healthPhoto: `${AVATARS}/HS2.png`, documents: 3, notes: 2, messages: 28, lastUpdated: '2025-11-10', state: 'Texas', city: 'Houston', contact: 'Dr. Lisa Chen', contactPhoto: `${AVATARS}/2.svg.jpg`, email: 'lisa.chen@greenvalley.com', phone: '+1-713-555-0200', twoPager: '', description: '', history: '', ownerName: 'Dr. Chen', trialDetails: '', plannedSiteCount: '', primaryObjective: '', informationType: '', studyObjectives: '', statAnalysis: '', populationCriteria: '', timeline: '', exclusions: '', isHealthSystemChosen: '', enrollmentTarget: '', submittedBy: '' },
    { id: '3', projectId: 'PX-1003', projectName: 'Gamma Research', status: 'Protocol Draft 1 creation', completion: 62, sponsorName: 'MedSolutions', sponsorPhoto: `${AVATARS}/ODF3.png`, healthSystemName: 'Northside Medical Center', healthPhoto: `${AVATARS}/HS3.png`, documents: 3, notes: 2, messages: 28, lastUpdated: '2025-11-08', state: 'New York', city: 'New York', contact: 'Dr. Michael Kim', contactPhoto: `${AVATARS}/3.svg.jpg`, email: 'michael.kim@northside.com', phone: '+1-212-555-0300', twoPager: 'View Document', description: 'Phase II trial', history: 'Created Q1 2025', ownerName: 'Dr. Kim', trialDetails: 'Multi-site study', plannedSiteCount: '5', primaryObjective: 'Efficacy assessment', informationType: 'RCT', studyObjectives: 'Secondary endpoints', statAnalysis: 'Yes', populationCriteria: 'Adults 18-65', timeline: '12 months', exclusions: 'Pregnancy', isHealthSystemChosen: 'Yes', enrollmentTarget: '200', submittedBy: 'John Doe' },
    { id: '4', projectId: 'PX-1004', projectName: 'Delta Study', status: 'Study Ongoing', completion: 88, sponsorName: 'Global Trials', sponsorPhoto: `${AVATARS}/ODF.png`, healthSystemName: 'St. Mary Hospital', healthPhoto: `${AVATARS}/HS4.png`, documents: 3, notes: 2, messages: 28, lastUpdated: '2025-11-12', state: 'Illinois', city: 'Chicago', contact: 'Dr. Raj Patel', contactPhoto: `${AVATARS}/4.svg.jpg`, email: 'raj.patel@stmary.com', phone: '+1-312-555-0400', twoPager: '', description: '', history: '', ownerName: 'Dr. Patel', trialDetails: '', plannedSiteCount: '', primaryObjective: '', informationType: '', studyObjectives: '', statAnalysis: '', populationCriteria: '', timeline: '', exclusions: '', isHealthSystemChosen: '', enrollmentTarget: '', submittedBy: '' },
    { id: '5', projectId: 'PX-1005', projectName: 'Epsilon Pilot', status: 'Project On Hold', completion: 30, sponsorName: 'Acme Pharma', sponsorPhoto: `${AVATARS}/ODF1.png`, healthSystemName: 'Green Valley Clinic', healthPhoto: `${AVATARS}/HS5.png`, documents: 3, notes: 2, messages: 28, lastUpdated: '2025-10-25', state: 'Florida', city: 'Miami', contact: 'Dr. Sarah Lee', contactPhoto: `${AVATARS}/5.svg.jpg`, email: 'sarah.lee@greenvalley.com', phone: '+1-305-555-0500', twoPager: 'View Document', description: '', history: '', ownerName: 'Dr. Lee', trialDetails: '', plannedSiteCount: '', primaryObjective: '', informationType: '', studyObjectives: '', statAnalysis: '', populationCriteria: '', timeline: '', exclusions: '', isHealthSystemChosen: '', enrollmentTarget: '', submittedBy: '' },

    // --- Additional Records 6 - 20 (Your Request) ---

    {
        id: '6',
        projectId: 'PX-1006',
        projectName: 'Zeta Analysis',
        status: 'Initial Review',
        completion: 20,
        sponsorName: 'NextGen Pharma',
        sponsorPhoto: `${AVATARS}/ODF2.png`,
        healthSystemName: 'Houston Health Center',
        healthPhoto: `${AVATARS}/HS2.png`,
        documents: 1,
        notes: 1,
        messages: 12,
        lastUpdated: '2025-11-05',
        state: 'Texas',
        city: 'Dallas',
        contact: 'Dr. Kevin Brown',
        contactPhoto: `${AVATARS}/1.svg.jpg`,
        email: 'kevin.brown@houstonhealth.com',
        phone: '+1-214-555-1000',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Brown',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '7',
        projectId: 'PX-1007',
        projectName: 'Theta Clinical Study',
        status: 'Feasibility Check',
        completion: 52,
        sponsorName: 'Alpha Bio',
        sponsorPhoto: `${AVATARS}/ODF3.png`,
        healthSystemName: 'Orlando Care Center',
        healthPhoto: `${AVATARS}/HS5.png`,
        documents: 2,
        notes: 3,
        messages: 14,
        lastUpdated: '2025-10-30',
        state: 'Florida',
        city: 'Orlando',
        contact: 'Dr. Emily Clark',
        contactPhoto: `${AVATARS}/2.svg.jpg`,
        email: 'emily.clark@orlandohealth.com',
        phone: '+1-407-555-2000',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Clark',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '8',
        projectId: 'PX-1008',
        projectName: 'Omega Trial',
        status: 'Study Ongoing',
        completion: 74,
        sponsorName: 'TriCore Labs',
        sponsorPhoto: `${AVATARS}/ODF.png`,
        healthSystemName: 'San Diego Health',
        healthPhoto: `${AVATARS}/HS1.png`,
        documents: 3,
        notes: 1,
        messages: 18,
        lastUpdated: '2025-11-14',
        state: 'California',
        city: 'San Diego',
        contact: 'Dr. Peter Adams',
        contactPhoto: `${AVATARS}/3.svg.jpg`,
        email: 'peter.adams@sandiegohealth.com',
        phone: '+1-619-555-3000',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Adams',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '9',
        projectId: 'PX-1009',
        projectName: 'Sigma Research',
        status: 'Protocol Review',
        completion: 60,
        sponsorName: 'BioVantage',
        sponsorPhoto: `${AVATARS}/ODF1.png`,
        healthSystemName: 'Chicago General',
        healthPhoto: `${AVATARS}/HS4.png`,
        documents: 3,
        notes: 3,
        messages: 22,
        lastUpdated: '2025-11-09',
        state: 'Illinois',
        city: 'Chicago',
        contact: 'Dr. Anna White',
        contactPhoto: `${AVATARS}/4.svg.jpg`,
        email: 'anna.white@cggeneral.com',
        phone: '+1-312-555-4000',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. White',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '10',
        projectId: 'PX-1010',
        projectName: 'Lambda Study',
        status: 'Kickoff Meeting',
        completion: 10,
        sponsorName: 'OptimaBio',
        sponsorPhoto: `${AVATARS}/ODF2.png`,
        healthSystemName: 'Houston Health Center',
        healthPhoto: `${AVATARS}/HS2.png`,
        documents: 0,
        notes: 1,
        messages: 8,
        lastUpdated: '2025-11-01',
        state: 'Texas',
        city: 'Austin',
        contact: 'Dr. Jake Donovan',
        contactPhoto: `${AVATARS}/5.svg.jpg`,
        email: 'jake.donovan@houstonhealth.com',
        phone: '+1-512-555-5000',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Donovan',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '11',
        projectId: 'PX-1011',
        projectName: 'Kappa Trial',
        status: 'Deep Dive Call',
        completion: 48,
        sponsorName: 'HealthWave',
        sponsorPhoto: `${AVATARS}/ODF3.png`,
        healthSystemName: 'Northside Medical Center',
        healthPhoto: `${AVATARS}/HS3.png`,
        documents: 3,
        notes: 1,
        messages: 10,
        lastUpdated: '2025-11-11',
        state: 'New York',
        city: 'Buffalo',
        contact: 'Dr. Laura Jones',
        contactPhoto: `${AVATARS}/1.svg.jpg`,
        email: 'laura.jones@nmc.com',
        phone: '+1-716-555-6000',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Jones',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },


    {
        id: '12',
        projectId: 'PX-1012',
        projectName: 'Mu Clinical Study',
        status: 'Study Ongoing',
        completion: 70,
        sponsorName: 'BioMedX',
        sponsorPhoto: `${AVATARS}/ODF1.png`,
        healthSystemName: 'Miami Medical Center',
        healthPhoto: `${AVATARS}/HS5.png`,
        documents: 4,
        notes: 2,
        messages: 30,
        lastUpdated: '2025-11-13',
        state: 'Florida',
        city: 'Tampa',
        contact: 'Dr. Henry Ford',
        contactPhoto: `${AVATARS}/2.svg.jpg`,
        email: 'henry.ford@miamimed.com',
        phone: '+1-813-555-7000',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Ford',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '13',
        projectId: 'PX-1013',
        projectName: 'Nu Discovery',
        status: 'Protocol Draft 1 Creation',
        completion: 57,
        sponsorName: 'LifeCure',
        sponsorPhoto: `${AVATARS}/ODF.png`,
        healthSystemName: 'St. Mary Hospital',
        healthPhoto: `${AVATARS}/HS1.png`,
        documents: 3,
        notes: 1,
        messages: 18,
        lastUpdated: '2025-11-06',
        state: 'California',
        city: 'Los Angeles',
        contact: 'Dr. Samuel Green',
        contactPhoto: `${AVATARS}/3.svg.jpg`,
        email: 'sam.green@stmary.com',
        phone: '+1-213-555-7100',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Green',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '14',
        projectId: 'PX-1014',
        projectName: 'Xi Research',
        status: 'Project On Hold',
        completion: 22,
        sponsorName: 'BioAxis',
        sponsorPhoto: `${AVATARS}/ODF2.png`,
        healthSystemName: 'Houston Health Center',
        healthPhoto: `${AVATARS}/HS2.png`,
        documents: 1,
        notes: 1,
        messages: 6,
        lastUpdated: '2025-11-02',
        state: 'Texas',
        city: 'San Antonio',
        contact: 'Dr. Karen Wells',
        contactPhoto: `${AVATARS}/4.svg.jpg`,
        email: 'karen.wells@houstonhealth.com',
        phone: '+1-210-555-7200',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Wells',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },


    {
        id: '15',
        projectId: 'PX-1015',
        projectName: 'Omicron Trial',
        status: 'Feasibility Check',
        completion: 40,
        sponsorName: 'MedCore',
        sponsorPhoto: `${AVATARS}/ODF3.png`,
        healthSystemName: 'Orlando Care Center',
        healthPhoto: `${AVATARS}/HS5.png`,
        documents: 2,
        notes: 2,
        messages: 11,
        lastUpdated: '2025-10-28',
        state: 'Florida',
        city: 'Jacksonville',
        contact: 'Dr. Olivia Reed',
        contactPhoto: `${AVATARS}/1.svg.jpg`,
        email: 'olivia.reed@orlandohealth.com',
        phone: '+1-904-555-7300',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Reed',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },


    {
        id: '16',
        projectId: 'PX-1016',
        projectName: 'Rho Clinical',
        status: 'Kickoff Meeting',
        completion: 12,
        sponsorName: 'NextStep Labs',
        sponsorPhoto: `${AVATARS}/ODF1.png`,
        healthSystemName: 'Northside Medical Center',
        healthPhoto: `${AVATARS}/HS3.png`,
        documents: 0,
        notes: 1,
        messages: 5,
        lastUpdated: '2025-11-04',
        state: 'New York',
        city: 'Albany',
        contact: 'Dr. Robert Miller',
        contactPhoto: `${AVATARS}/2.svg.jpg`,
        email: 'rob.miller@nmc.com',
        phone: '+1-518-555-7400',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Miller',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '17',
        projectId: 'PX-1017',
        projectName: 'Tau Study',
        status: 'Study Ongoing',
        completion: 65,
        sponsorName: 'GenMed',
        sponsorPhoto: `${AVATARS}/ODF.png`,
        healthSystemName: 'St. Mary Hospital',
        healthPhoto: `${AVATARS}/HS1.png`,
        documents: 3,
        notes: 2,
        messages: 24,
        lastUpdated: '2025-11-07',
        state: 'California',
        city: 'Sacramento',
        contact: 'Dr. Daniel Carter',
        contactPhoto: `${AVATARS}/3.svg.jpg`,
        email: 'daniel.carter@stmary.com',
        phone: '+1-916-555-7500',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Carter',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '18',
        projectId: 'PX-1018',
        projectName: 'Chi Research',
        status: 'Protocol Review',
        completion: 55,
        sponsorName: 'BioNova',
        sponsorPhoto: `${AVATARS}/ODF2.png`,
        healthSystemName: 'Chicago General',
        healthPhoto: `${AVATARS}/HS4.png`,
        documents: 2,
        notes: 2,
        messages: 17,
        lastUpdated: '2025-10-31',
        state: 'Illinois',
        city: 'Springfield',
        contact: 'Dr. Megan Scott',
        contactPhoto: `${AVATARS}/4.svg.jpg`,
        email: 'megan.scott@cggeneral.com',
        phone: '+1-217-555-7600',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Scott',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '19',
        projectId: 'PX-1019',
        projectName: 'Psi Pilot',
        status: 'Initial Review',
        completion: 18,
        sponsorName: 'MedPrime',
        sponsorPhoto: `${AVATARS}/ODF3.png`,
        healthSystemName: 'Orlando Care Center',
        healthPhoto: `${AVATARS}/HS5.png`,
        documents: 1,
        notes: 1,
        messages: 9,
        lastUpdated: '2025-10-29',
        state: 'Florida',
        city: 'St. Petersburg',
        contact: 'Dr. Nina Harris',
        contactPhoto: `${AVATARS}/1.svg.jpg`,
        email: 'nina.harris@orlandohealth.com',
        phone: '+1-727-555-7700',
        twoPager: '',
        description: '',
        history: '',
        ownerName: 'Dr. Harris',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    },

    {
        id: '20',
        projectId: 'PX-1020',
        projectName: 'Omega-2 Trial',
        status: 'Study Ongoing',
        completion: 80,
        sponsorName: 'NextGen Bio',
        sponsorPhoto: `${AVATARS}/ODF1.png`,
        healthSystemName: 'Houston Health Center',
        healthPhoto: `${AVATARS}/HS2.png`,
        documents: 3,
        notes: 2,
        messages: 26,
        lastUpdated: '2025-11-14',
        state: 'Texas',
        city: 'Houston',
        contact: 'Dr. Paul Rivera',
        contactPhoto: `${AVATARS}/5.svg.jpg`,
        email: 'paul.rivera@houstonhealth.com',
        phone: '+1-713-555-7800',
        twoPager: 'Two-pager',
        description: '',
        history: '',
        ownerName: 'Dr. Rivera',
        trialDetails: '',
        plannedSiteCount: '',
        primaryObjective: '',
        informationType: '',
        studyObjectives: '',
        statAnalysis: '',
        populationCriteria: '',
        timeline: '',
        exclusions: '',
        isHealthSystemChosen: '',
        enrollmentTarget: '',
        submittedBy: ''
    }
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
        'Protocol Draft 3 creation',
        'Final Protocol Review',
        'Final Protocol provided',
        'Agreements Finalization',
        'Project Management Setup',
        'Study Ongoing',
        'Alignment on long-term data storage',
        'NPS Shared',
        'Project Wrap Up',
        'Project Closed',
        'Project On Hold',
        'Project Cancelled'
    ].map(v => ({ label: v, value: v, checked: false }));

    sponsorOptions = []; // built from data
    healthOptions = []; // built from data

    get statusDropdownClass() { return this.statusDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get sponsorDropdownClass() { return this.sponsorDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }
    get healthDropdownClass() { return this.healthDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu'; }

    toggleStatusDropdown() { this.statusDropdownOpen = !this.statusDropdownOpen; this.closeOtherDropdowns('status'); }
    toggleSponsorDropdown() { this.sponsorDropdownOpen = !this.sponsorDropdownOpen; this.closeOtherDropdowns('sponsor'); }
    toggleHealthDropdown() { this.healthDropdownOpen = !this.healthDropdownOpen; this.closeOtherDropdowns('health'); }

    closeOtherDropdowns(except) {
        if (except !== 'status') this.statusDropdownOpen = false;
        if (except !== 'sponsor') this.sponsorDropdownOpen = false;
        if (except !== 'health') this.healthDropdownOpen = false;
    }

    get statusDisplayText() { const count = this.statusOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get sponsorDisplayText() { const count = this.sponsorOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }
    get healthDisplayText() { const count = this.healthOptions.filter(o => o.checked).length; return count > 0 ? count + ' selected' : 'Select'; }

    toggleFilters() { this.showFilters = !this.showFilters; }
    closeFilter() { this.showFilters = false; this.closeOtherDropdowns(''); }

    handleStatusCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.statusOptions = this.statusOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleSponsorCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.sponsorOptions = this.sponsorOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }
    handleHealthCheckboxChange(event) { const value = event.target.value; const checked = event.target.checked; this.healthOptions = this.healthOptions.map(opt => opt.value === value ? { ...opt, checked } : opt); }

    handleSearchChange(event) { this.searchKey = event.target.value; this.pageIndex = 0; }

    resetStatusFilter() { this.statusOptions = this.statusOptions.map(opt => ({ ...opt, checked: false })); this.selectedStatus = []; }
    resetSponsorFilter() { this.sponsorOptions = this.sponsorOptions.map(opt => ({ ...opt, checked: false })); this.selectedSponsor = []; }
    resetHealthFilter() { this.healthOptions = this.healthOptions.map(opt => ({ ...opt, checked: false })); this.selectedHealth = []; }
    clearAllFilters() { this.resetStatusFilter(); this.resetSponsorFilter(); this.resetHealthFilter(); }

    applyFilter() {
        this.selectedStatus = this.statusOptions.filter(o => o.checked).map(o => o.value);
        this.selectedSponsor = this.sponsorOptions.filter(o => o.checked).map(o => o.value);
        this.selectedHealth = this.healthOptions.filter(o => o.checked).map(o => o.value);
        this.closeOtherDropdowns('');
        this.pageIndex = 0;
    }

    // Filtering
    get filteredData() {
        let temp = [...this.data];
        if (this.selectedStatus.length > 0) temp = temp.filter(i => this.selectedStatus.includes(i.status));
        if (this.selectedSponsor.length > 0) temp = temp.filter(i => this.selectedSponsor.includes(i.sponsorName));
        if (this.selectedHealth.length > 0) temp = temp.filter(i => this.selectedHealth.includes(i.healthSystemName));
        if (this.searchKey && this.searchKey.trim() !== '') {
            const key = this.searchKey.trim().toLowerCase();
            temp = temp.filter(i =>
                (i.projectName && i.projectName.toLowerCase().includes(key)) ||
                (i.projectId && i.projectId.toLowerCase().includes(key)) ||
                (i.sponsorName && i.sponsorName.toLowerCase().includes(key)) ||
                (i.healthSystemName && i.healthSystemName.toLowerCase().includes(key)) ||
                (i.contact && i.contact.toLowerCase().includes(key)) ||
                (i.email && i.email.toLowerCase().includes(key)) ||
                (i.phone && i.phone.toLowerCase().includes(key)) ||
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

    connectedCallback() {
        // build sponsor & health options from data
        const sponsors = Array.from(new Set(this.data.map(d => d.sponsorName))).map(s => ({ label: s, value: s, checked: false }));
        const healths = Array.from(new Set(this.data.map(d => d.healthSystemName))).map(h => ({ label: h, value: h, checked: false }));
        this.sponsorOptions = sponsors;
        this.healthOptions = healths;

        // compute initials & status classes for sponsor and health system and contact
        this.data = this.data.map((row, idx) => {
            const sponsorInitials = (row.sponsorName || '').split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
            const healthInitials = (row.healthSystemName || '').split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
            const contactInitials = (row.contact || '').split(' ').map(n => n && n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
            return {
                ...row,
                sponsorInitials,
                sponsorPhoto: row.sponsorPhoto || '',
                healthInitials,
                healthPhoto: row.healthPhoto || '',
                contactInitials,
                contactPhoto: row.contactPhoto || '',
                statusClass: this.getStatusClass(row.status)
            };
        });
    }

    // map status -> class (reuse sponsor badges style)
    getStatusClass(status) {
        if (!status) return 'badge-soft-info border border-info';
        const successStates = ['Study Ongoing', 'Project Closed', 'Final Protocol provided', 'Agreements Finalization', 'NPS Shared'];
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
        { label: 'Discovery', value: 'Discovery' },
        { label: 'Deep Dive Call', value: 'Deep Dive Call' },
        { label: 'Protocol Draft', value: 'Protocol Draft' },
        { label: 'Study Ongoing', value: 'Study Ongoing' }
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
    }

    get isSortedBy() {
        return {
            projectId: this.sortField === 'projectId',
            projectName: this.sortField === 'projectName',
            status: this.sortField === 'status',
            completion: this.sortField === 'completion',
            sponsorName: this.sortField === 'sponsorName',
            healthSystemName: this.sortField === 'healthSystemName',
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

    // Placeholder edit/delete handlers
    handleEdit(event) { const id = event.currentTarget.dataset.id; this.dispatchEvent(new CustomEvent('edit', { detail: { id } })); }
    handleDelete(event) { const id = event.currentTarget.dataset.id; this.dispatchEvent(new CustomEvent('delete', { detail: { id } })); }

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
        return this.isAddTabLast ? 'Submit' : 'Save & Next';
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
}