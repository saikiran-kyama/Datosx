import { LightningElement, track } from 'lwc';

// Master Data Configuration
const MASTER_CONFIG = {
    technology: {
        label: 'Technology Master',
        icon: 'utility:connected_apps',
        columns: [{ key: 'technology', label: 'Technology', headerClass: 'th-main' }]
    },
    endUserType: {
        label: 'End User Type Master',
        icon: 'utility:user',
        columns: [{ key: 'endUserType', label: 'End User Type', headerClass: 'th-main' }]
    },
    therapeuticAreas: {
        label: 'Therapeutic Areas Master',
        icon: 'utility:heart',
        columns: [{ key: 'therapeuticArea', label: 'Therapeutic Area', headerClass: 'th-main' }]
    },
    referenceSource: {
        label: 'Reference Source Master',
        icon: 'utility:link',
        columns: [{ key: 'referenceSource', label: 'Reference Source', headerClass: 'th-main' }]
    },
    innovation: {
        label: 'Innovation Master',
        icon: 'utility:sparkle',
        columns: [{ key: 'innovation', label: 'Innovation', headerClass: 'th-main' }]
    },
    facilities: {
        label: 'Facilities Master',
        icon: 'utility:company',
        columns: [{ key: 'facilities', label: 'Facilities', headerClass: 'th-main' }]
    },
    agreements: {
        label: 'Agreements Master',
        icon: 'utility:contract',
        columns: [{ key: 'agreements', label: 'Agreements', headerClass: 'th-main' }]
    },
    documentType: {
        label: 'Document Type Master',
        icon: 'utility:file',
        columns: [
            { key: 'documentType', label: 'Document Type', headerClass: 'th-main' },
            { key: 'documentCategory', label: 'Document Category', headerClass: 'th-secondary' }
        ]
    },
    appendices: {
        label: 'Appendices Master',
        icon: 'utility:attach',
        columns: [{ key: 'appendices', label: 'Appendices', headerClass: 'th-main' }]
    },
    edc: {
        label: 'EDC Master',
        icon: 'utility:data_mapping',
        columns: [{ key: 'edc', label: 'EDC', headerClass: 'th-main' }]
    },
    ehrs: {
        label: 'EHRS Master',
        icon: 'utility:record',
        columns: [{ key: 'ehrs', label: 'EHRS', headerClass: 'th-main' }]
    },
    fundingType: {
        label: 'Funding Type Master',
        icon: 'utility:money',
        columns: [{ key: 'fundingType', label: 'Funding Type', headerClass: 'th-main' }]
    },
    companyType: {
        label: 'Company Type Master',
        icon: 'utility:company',
        columns: [{ key: 'companyType', label: 'Company Type', headerClass: 'th-main' }]
    },
    country: {
        label: 'Country Master',
        icon: 'utility:world',
        columns: [{ key: 'country', label: 'Country', headerClass: 'th-main' }]
    },
    state: {
        label: 'State Master',
        icon: 'utility:location',
        columns: [
            { key: 'state', label: 'State', headerClass: 'th-main' },
            { key: 'country', label: 'Country', headerClass: 'th-secondary' }
        ]
    },
    projectStage: {
        label: 'Project Stage Master',
        icon: 'utility:steps',
        columns: [{ key: 'projectStage', label: 'Project Stage', headerClass: 'th-main' }]
    },
    projectTask: {
        label: 'Project Task Master',
        icon: 'utility:task',
        columns: [{ key: 'projectTask', label: 'Project Task', headerClass: 'th-main' }]
    },
    estimationCategories: {
        label: 'Estimation Categories Master',
        icon: 'utility:matrix',
        columns: [
            { key: 'estimationCategory', label: 'Estimation Category', headerClass: 'th-main' },
            { key: 'description', label: 'Description', headerClass: 'th-secondary' }
        ]
    },
    estimationLineItems: {
        label: 'Estimation Line Items Master',
        icon: 'utility:list',
        columns: [{ key: 'estimationLineItems', label: 'Estimation Line Items', headerClass: 'th-main' }]
    },
    task: {
        label: 'Task Master',
        icon: 'utility:kanban',
        columns: [
            { key: 'taskName', label: 'Task Name', headerClass: 'th-main' },
            { key: 'taskType', label: 'Task Type', headerClass: 'th-secondary' },
            { key: 'duration', label: 'Duration (Days)', headerClass: 'th-secondary' }
        ]
    }
};

// Real-time data for all masters
const MASTER_DATA_JSON = {
    technology: [
        'EDC (Electronic Data Capture)', 'CTMS (Clinical Trial Management System)', 'IRT/IVRS', 
        'ePRO (Electronic Patient Reported Outcomes)', 'EHR Integration', 'Imaging Systems',
        'Laboratory Information Management System', 'eTMF (Electronic Trial Master File)',
        'Patient Recruitment Platform', 'Adverse Event Reporting System', 'Randomization System',
        'Data Analytics Platform', 'Mobile Health Apps', 'Wearable Device Integration'
    ],
    endUserType: [
        'Principal Investigator', 'Clinical Research Coordinator', 'Study Monitor',
        'Data Manager', 'Medical Monitor', 'Regulatory Affairs Specialist',
        'Biostatistician', 'Medical Writer', 'Site Administrator', 'Quality Assurance Manager',
        'Pharmacovigilance Officer', 'Laboratory Technician', 'Study Nurse'
    ],
    therapeuticAreas: [
        'Oncology', 'Cardiology', 'Neurology', 'Endocrinology', 'Immunology',
        'Infectious Diseases', 'Respiratory', 'Gastroenterology', 'Rheumatology',
        'Dermatology', 'Hematology', 'Nephrology', 'Ophthalmology', 'Psychiatry'
    ],
    referenceSource: [
        'PubMed', 'ClinicalTrials.gov', 'FDA Guidelines', 'ICH Guidelines', 'EMA Guidelines',
        'WHO International Clinical Trials Registry', 'Cochrane Library', 'UpToDate',
        'Medical Journals', 'Industry Standards', 'Regulatory Documents', 'Scientific Publications'
    ],
    innovation: [
        'AI-Powered Patient Matching', 'Decentralized Clinical Trials', 'Real-World Evidence Integration',
        'Predictive Analytics', 'Blockchain for Data Integrity', 'Virtual Site Visits',
        'Digital Biomarkers', 'Adaptive Trial Designs', 'Risk-Based Monitoring',
        'Patient-Centric Trial Design', 'Synthetic Control Arms', 'Remote Patient Monitoring'
    ],
    facilities: [
        'Phase I Clinical Unit', 'Ambulatory Research Center', 'Hospital-Based Research Facility',
        'Academic Medical Center', 'Contract Research Organization (CRO)', 'Central Laboratory',
        'Imaging Center', 'Pharmacy Research Unit', 'Bioanalytical Laboratory',
        'Patient Recruitment Center', 'Data Management Center', 'Regulatory Affairs Office'
    ],
    agreements: [
        'Clinical Trial Agreement (CTA)', 'Confidentiality Agreement (CDA)', 'Material Transfer Agreement (MTA)',
        'Data Sharing Agreement', 'Site Agreement', 'Vendor Agreement', 'Consulting Agreement',
        'License Agreement', 'Quality Agreement', 'Service Level Agreement (SLA)',
        'Indemnification Agreement', 'Budget Agreement'
    ],
    appendices: [
        'Informed Consent Form', 'Protocol Amendment', 'Case Report Form', 'Laboratory Manual',
        'Pharmacy Manual', 'Investigator Brochure', 'Sample Consent Form', 'Recruitment Materials',
        'Study Procedures', 'Safety Reporting Guidelines', 'Data Management Plan', 'Monitoring Plan'
    ],
    edc: [
        'Medidata Rave', 'Oracle Clinical', 'OpenClinica', 'REDCap', 'Veeva Vault EDC',
        'IBM Clinical Development', 'Castor EDC', 'ClinCapture', 'DataTrak EDC',
        'Fortress EDC', 'Merge eClinical', 'eClinical Solutions'
    ],
    ehrs: [
        'Epic', 'Cerner', 'Allscripts', 'eClinicalWorks', 'NextGen Healthcare',
        'Meditech', 'Athenahealth', 'DrChrono', 'Practice Fusion', 'AdvancedMD',
        'GE Healthcare Centricity', 'Kareo'
    ],
    fundingType: [
        'Industry Sponsored', 'Government Grant (NIH)', 'Foundation Grant', 'Investigator Initiated',
        'Academic Institution', 'Public-Private Partnership', 'Venture Capital', 'European Commission Grant',
        'Philanthropic Donation', 'Internal Funding', 'Contract Research', 'Collaborative Funding'
    ],
    companyType: [
        'Pharmaceutical Company', 'Biotechnology Company', 'Medical Device Manufacturer', 'CRO (Contract Research Organization)',
        'Academic Research Institution', 'Hospital Network', 'Government Agency', 'Non-Profit Organization',
        'Site Management Organization (SMO)', 'Central Laboratory', 'Consulting Firm', 'Technology Vendor'
    ],
    country: [
        'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Spain', 'Italy',
        'China', 'Japan', 'India', 'Australia', 'Brazil', 'South Korea', 'Netherlands', 'Switzerland'
    ],
    projectStage: [
        'Pre-Clinical', 'Phase I', 'Phase II', 'Phase III', 'Phase IV (Post-Marketing)',
        'Protocol Development', 'Site Activation', 'Patient Enrollment', 'Data Collection',
        'Database Lock', 'Statistical Analysis', 'CSR Writing', 'Regulatory Submission', 'Study Closeout'
    ],
    projectTask: [
        'Protocol Writing', 'IRB/EC Submission', 'Investigator Meeting', 'Site Initiation',
        'Patient Screening', 'Randomization', 'Drug Dispensation', 'Study Visits',
        'Adverse Event Monitoring', 'Query Resolution', 'Source Data Verification',
        'Site Monitoring Visit', 'Interim Analysis', 'Safety Review'
    ],
    estimationLineItems: [
        'Site Initiation Fee', 'Patient Visit Cost', 'Lab Test - Hematology', 'Lab Test - Chemistry',
        'ECG Procedure', 'Radiology Imaging', 'Clinical Coordinator Time', 'Principal Investigator Time',
        'Database Setup', 'eCRF Development', 'Monitoring Visit Cost', 'SAE Reporting',
        'Drug Shipment', 'Patient Stipend', 'Screen Failure Cost', 'Regulatory Submission Fee'
    ]
};

// Sample data generator
const generateSampleData = (masterKey, count = 15) => {
    const data = [];
    const config = MASTER_CONFIG[masterKey];
    const statuses = ['Active', 'Inactive'];
    
    // Specific data for Estimation Categories
    if (masterKey === 'estimationCategories') {
        const categories = [
            { category: 'Site Costs', description: 'Costs related to site initiation and management' },
            { category: 'Patient Costs', description: 'Patient recruitment and retention expenses' },
            { category: 'Personnel Costs', description: 'Staff and personnel related expenses' },
            { category: 'Lab & Testing', description: 'Laboratory and diagnostic testing costs' },
            { category: 'Monitoring Costs', description: 'On-site and remote monitoring expenses' },
            { category: 'Data Management', description: 'Database setup and data entry costs' },
            { category: 'Medical Writing', description: 'Protocol and report writing expenses' },
            { category: 'Regulatory Costs', description: 'IRB/EC submissions and approvals' },
            { category: 'Drug Supply', description: 'Study medication and comparator costs' },
            { category: 'Insurance', description: 'Clinical trial insurance premiums' },
            { category: 'Travel & Meetings', description: 'Investigator meetings and site visits' },
            { category: 'Vendor Services', description: 'Third-party vendor and CRO costs' }
        ];
        categories.forEach((cat, i) => {
            data.push({
                id: `${masterKey}-${i + 1}`,
                status: statuses[i % 2],
                estimationCategory: cat.category,
                description: cat.description
            });
        });
        return data;
    }
    
    // Specific data for Task Master
    if (masterKey === 'task') {
        const tasks = [
            { name: 'Protocol Development', type: 'Planning', duration: '30' },
            { name: 'IRB Submission', type: 'Regulatory', duration: '45' },
            { name: 'Site Identification', type: 'Site Management', duration: '60' },
            { name: 'Site Initiation Visit', type: 'Site Management', duration: '90' },
            { name: 'Patient Screening', type: 'Recruitment', duration: '120' },
            { name: 'Patient Enrollment', type: 'Recruitment', duration: '180' },
            { name: 'Data Entry', type: 'Data Management', duration: '200' },
            { name: 'Monitoring Visit', type: 'Monitoring', duration: '150' },
            { name: 'Database Lock', type: 'Data Management', duration: '210' },
            { name: 'Statistical Analysis', type: 'Analysis', duration: '30' },
            { name: 'CSR Writing', type: 'Medical Writing', duration: '60' },
            { name: 'Final Report', type: 'Documentation', duration: '90' }
        ];
        tasks.forEach((task, i) => {
            data.push({
                id: `${masterKey}-${i + 1}`,
                status: statuses[i % 2],
                taskName: task.name,
                taskType: task.type,
                duration: task.duration
            });
        });
        return data;
    }
    
    // Specific data for Document Type (has 2 columns)
    if (masterKey === 'documentType') {
        const docTypes = [
            { type: 'Protocol', category: 'Pre-study' },
            { type: 'Informed Consent', category: 'Pre-study' },
            { type: 'Case Report Form', category: 'Pre-study' },
            { type: 'Investigator Brochure', category: 'Pre-study' },
            { type: 'Laboratory Manual', category: 'Pre-study' },
            { type: 'Monitoring Plan', category: 'Pre-study' },
            { type: 'Statistical Analysis Plan', category: 'Pre-study' },
            { type: 'Clinical Study Report', category: 'Post-study' },
            { type: 'Serious Adverse Event Report', category: 'Post-study' },
            { type: 'Final Study Report', category: 'Post-study' },
            { type: 'Regulatory Submission', category: 'Post-study' },
            { type: 'Study Closeout Report', category: 'Post-study' }
        ];
        docTypes.forEach((doc, i) => {
            data.push({
                id: `${masterKey}-${i + 1}`,
                status: statuses[i % 2],
                documentType: doc.type,
                documentCategory: doc.category
            });
        });
        return data;
    }
    
    // Specific data for State (has 2 columns)
    if (masterKey === 'state') {
        const states = [
            { state: 'California', country: 'United States' },
            { state: 'New York', country: 'United States' },
            { state: 'Texas', country: 'United States' },
            { state: 'Florida', country: 'United States' },
            { state: 'Illinois', country: 'United States' },
            { state: 'Ontario', country: 'Canada' },
            { state: 'Quebec', country: 'Canada' },
            { state: 'British Columbia', country: 'Canada' },
            { state: 'Bavaria', country: 'Germany' },
            { state: 'North Rhine-Westphalia', country: 'Germany' },
            { state: 'Île-de-France', country: 'France' },
            { state: 'New South Wales', country: 'Australia' },
            { state: 'Victoria', country: 'Australia' }
        ];
        states.forEach((st, i) => {
            data.push({
                id: `${masterKey}-${i + 1}`,
                status: statuses[i % 2],
                state: st.state,
                country: st.country
            });
        });
        return data;
    }
    
    // Use real data from JSON for single-column masters
    if (MASTER_DATA_JSON[masterKey]) {
        const realData = MASTER_DATA_JSON[masterKey];
        realData.forEach((item, i) => {
            const row = {
                id: `${masterKey}-${i + 1}`,
                status: statuses[i % 2]
            };
            
            // Set the value for the first column
            const firstCol = config.columns[0];
            row[firstCol.key] = item;
            
            data.push(row);
        });
        return data;
    }
    
    // Fallback for any remaining masters
    for (let i = 1; i <= count; i++) {
        const row = {
            id: `${masterKey}-${i}`,
            status: statuses[i % 2]
        };
        
        config.columns.forEach(col => {
            row[col.key] = `${col.label} ${i}`;
        });
        
        data.push(row);
    }
    return data;
};

export default class PageUnderConstruction extends LightningElement {
    @track selectedMaster = 'technology';
    @track searchKeyword = '';
    @track currentPage = 1;
    @track pageSize = 10;
    @track isModalOpen = false;
    @track isDeleteModalOpen = false;
    @track isEditMode = false;
    @track formData = {};
    @track deleteRecordId = null;
    
    // Master data storage
    @track masterData = {};
    
    // Status options for combobox
    statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];
    
    // Document category options
    documentCategoryOptions = [
        { label: 'Pre-study', value: 'Pre-study' },
        { label: 'Post-study', value: 'Post-study' }
    ];
    
    // Country options for State master
    countryOptions = [
        { label: 'United States', value: 'United States' },
        { label: 'United Kingdom', value: 'United Kingdom' },
        { label: 'Canada', value: 'Canada' },
        { label: 'Germany', value: 'Germany' },
        { label: 'France', value: 'France' },
        { label: 'India', value: 'India' }
    ];

    connectedCallback() {
        // Initialize sample data for all masters
        Object.keys(MASTER_CONFIG).forEach(key => {
            this.masterData[key] = generateSampleData(key);
        });
    }

    // Navigation Items
    get masterNavItems() {
        return Object.keys(MASTER_CONFIG).map(key => ({
            key,
            label: MASTER_CONFIG[key].label,
            icon: MASTER_CONFIG[key].icon,
            className: `nav-item ${this.selectedMaster === key ? 'active' : ''}`
        }));
    }

    // Selected master label
    get selectedMasterLabel() {
        return MASTER_CONFIG[this.selectedMaster]?.label || 'Master Data';
    }

    // Current columns based on selected master
    get currentColumns() {
        return MASTER_CONFIG[this.selectedMaster]?.columns || [];
    }

    // Current form fields for modal
    get currentFormFields() {
        const config = MASTER_CONFIG[this.selectedMaster];
        if (!config) return [];
        
        return config.columns.map(col => {
            let isCombobox = false;
            let options = [];
            
            if (col.key === 'documentCategory') {
                isCombobox = true;
                options = this.documentCategoryOptions;
            } else if (col.key === 'country' && this.selectedMaster === 'state') {
                isCombobox = true;
                options = this.countryOptions;
            }
            
            return {
                key: col.key,
                label: col.label,
                value: this.formData[col.key] || '',
                placeholder: `Enter ${col.label}`,
                required: true,
                isText: !isCombobox,
                isCombobox: isCombobox,
                options: options
            };
        });
    }

    // Get current master data
    get currentData() {
        return this.masterData[this.selectedMaster] || [];
    }

    // Filter rows based on search
    get filteredRows() {
        const data = this.currentData;
        if (!this.searchKeyword) return data;
        
        const keyword = this.searchKeyword.toLowerCase();
        return data.filter(row => {
            return Object.values(row).some(val => 
                String(val).toLowerCase().includes(keyword)
            );
        });
    }

    // Check if there are rows
    get hasRows() {
        return this.filteredRows.length > 0;
    }

    // Pagination calculations
    get totalRecords() {
        return this.filteredRows.length;
    }

    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize) || 1;
    }

    get startRecord() {
        if (this.totalRecords === 0) return 0;
        return (this.currentPage - 1) * this.pageSize + 1;
    }

    get endRecord() {
        const end = this.currentPage * this.pageSize;
        return end > this.totalRecords ? this.totalRecords : end;
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage >= this.totalPages;
    }

    // Paginated rows with display values
    get paginatedRows() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const rows = this.filteredRows.slice(start, end);
        
        return rows.map(row => ({
            ...row,
            statusClass: `status-badge ${row.status === 'Active' ? 'status-active' : 'status-inactive'}`,
            displayValues: this.currentColumns.map(col => ({
                key: `${row.id}-${col.key}`,
                value: row[col.key] || ''
            }))
        }));
    }

    // Modal title
    get modalTitle() {
        const action = this.isEditMode ? 'Edit' : 'Add';
        return `${action} ${this.selectedMasterLabel.replace(' Master', '')}`;
    }

    // Event Handlers
    handleNavClick(event) {
        const key = event.currentTarget.dataset.key;
        this.selectedMaster = key;
        this.currentPage = 1;
        this.searchKeyword = '';
    }

    handleSearchChange(event) {
        this.searchKeyword = event.target.value;
        this.currentPage = 1;
    }

    handleAddNew() {
        this.isEditMode = false;
        this.formData = { status: 'Active' };
        this.isModalOpen = true;
    }

    handleEditRow(event) {
        const rowId = event.target.dataset.id;
        const row = this.currentData.find(r => r.id === rowId);
        if (row) {
            this.isEditMode = true;
            this.formData = { ...row };
            this.isModalOpen = true;
        }
    }

    handleDeleteRow(event) {
        this.deleteRecordId = event.target.dataset.id;
        this.isDeleteModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.formData = {};
    }

    closeDeleteModal() {
        this.isDeleteModalOpen = false;
        this.deleteRecordId = null;
    }

    confirmDelete() {
        if (this.deleteRecordId) {
            this.masterData[this.selectedMaster] = this.currentData.filter(
                row => row.id !== this.deleteRecordId
            );
            this.masterData = { ...this.masterData };
        }
        this.closeDeleteModal();
    }

    handleStatusChange(event) {
        this.formData = { ...this.formData, status: event.detail.value };
    }

    handleFormFieldChange(event) {
        const field = event.target.dataset.field;
        const value = event.detail?.value ?? event.target.value;
        this.formData = { ...this.formData, [field]: value };
    }

    handleSave() {
        // Validate required fields
        const config = MASTER_CONFIG[this.selectedMaster];
        const isValid = config.columns.every(col => this.formData[col.key]);
        
        if (!this.formData.status || !isValid) {
            // Show validation error (in real app, use toast)
            return;
        }
        
        if (this.isEditMode) {
            // Update existing
            const index = this.currentData.findIndex(r => r.id === this.formData.id);
            if (index !== -1) {
                this.masterData[this.selectedMaster][index] = { ...this.formData };
                this.masterData = { ...this.masterData };
            }
        } else {
            // Add new
            const newId = `${this.selectedMaster}-${Date.now()}`;
            const newRecord = { ...this.formData, id: newId };
            this.masterData[this.selectedMaster] = [newRecord, ...this.currentData];
            this.masterData = { ...this.masterData };
        }
        
        this.closeModal();
    }

    // Pagination handlers
    handleFirstPage() {
        this.currentPage = 1;
    }

    handlePrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    handleLastPage() {
        this.currentPage = this.totalPages;
    }

    handlePageSizeChange(event) {
        this.pageSize = parseInt(event.target.value, 10);
        this.currentPage = 1;
    }

    // CSV handlers
    handleUploadCSV() {
        // Create file input for upload
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Process CSV file (placeholder)
                console.log('File selected:', file.name);
            }
        };
        input.click();
    }

    handleDownloadCSV() {
        const data = this.currentData;
        if (!data.length) return;
        
        const config = MASTER_CONFIG[this.selectedMaster];
        const headers = ['Status', ...config.columns.map(c => c.label)];
        const keys = ['status', ...config.columns.map(c => c.key)];
        
        let csv = headers.join(',') + '\n';
        data.forEach(row => {
            const values = keys.map(k => `"${row[k] || ''}"`);
            csv += values.join(',') + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.selectedMaster}_export.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
