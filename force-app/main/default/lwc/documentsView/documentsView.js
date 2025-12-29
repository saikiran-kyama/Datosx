import { LightningElement, track } from 'lwc';

const DOCUMENT_SIDEBAR_SECTIONS = [
    {
        id: 'regulatory-compliance',
        label: 'Regulatory & Compliance',
        options: [
            { id: 'regulatory-compliance-1', label: 'IRB/IEC Approval Letter' },
            { id: 'regulatory-compliance-2', label: 'Regulatory Submission Forms' },
            { id: 'regulatory-compliance-3', label: 'Ethics Committee Correspondence' },
            { id: 'regulatory-compliance-4', label: 'Sponsor Compliance Certificates' }
        ]
    },
    {
        id: 'study-setup',
        label: 'Study Setup & Initiation',
        options: [
            { id: 'study-setup-1', label: 'Study Protocol' },
            { id: 'study-setup-2', label: 'Protocol Amendments' },
            { id: 'study-setup-3', label: 'Investigator Brochure' },
            { id: 'study-setup-4', label: 'Site Qualification Questionnaire' }
        ]
    },
    {
        id: 'training-certification',
        label: 'Training & Certification',
        options: [
            { id: 'training-certification-1', label: 'GCP Training Certificates' },
            { id: 'training-certification-2', label: 'Protocol Training Documents' },
            { id: 'training-certification-3', label: 'Device/Product Training Completion' }
        ]
    },
    {
        id: 'product-validation',
        label: 'Product/Device Validation',
        options: [
            { id: 'product-validation-1', label: 'Device Installation Report' },
            { id: 'product-validation-2', label: 'Product Setup Verification' },
            { id: 'product-validation-3', label: 'Calibration Certificates' }
        ]
    },
    {
        id: 'monitoring-audit',
        label: 'Monitoring & Audit',
        options: [
            { id: 'monitoring-audit-1', label: 'Pre-Monitoring Checklist' },
            { id: 'monitoring-audit-2', label: 'Monitoring Visit Report' },
            { id: 'monitoring-audit-3', label: 'Audit Findings' }
        ]
    },
    {
        id: 'closeout',
        label: 'Closeout & Final Report',
        options: [
            { id: 'closeout-1', label: 'Study Closeout Checklist' },
            { id: 'closeout-2', label: 'Final Study Report' }
        ]
    }
];

export default class DocumentsView extends LightningElement {
    @track isCardView = false;
    @track showFilter = false;
    @track isPostVisit = true;
    @track selectedCategory = 'All';
    @track filterKeyword = '';
    @track filterFromDate = '';
    @track filterToDate = '';
    @track filterDocumentType = '';
    @track docTypeDropdownOpen = false;
    @track filterDocumentCategory = '';
    @track sidebarSections = [];
    
    // Add Document Modal state
    @track isAddDocumentOpen = false;
    @track addFormDocCategory = '';
    @track addFormDocType = '';
    @track addFormDocTitle = '';
    @track uploadedFile = null;

    // Sample documents data
    documents = [
        {
            id: '1',
            documentType: 'Medical Records',
            documentTitle: 'Audit Report - Q1',
            sponsorId: '12345678',
            hsId: '87654321',
            hsChecked: true,
            sponsorChecked: true,
            taskId: '23456789',
            patientName: 'John Doe',
            locationName: 'Location A',
            providerName: 'Dr. Smith',
            uploadedDate: '10-Dec-2024',
            uploadedBy: 'Corey Williams',
            remarks: 'Reviewed and approved.'
        },
        {
            id: '2',
            documentType: 'Billing Records',
            documentTitle: 'Inspection Checklist',
            sponsorId: '23456789',
            hsId: '98765432',
            hsChecked: true,
            sponsorChecked: true,
            taskId: '34567890',
            patientName: 'Jane Smith',
            locationName: 'Location B',
            providerName: 'Dr. Johnson',
            uploadedDate: '08-Dec-2024',
            uploadedBy: 'Alex Johnson',
            remarks: 'Pending final review.'
        },
        {
            id: '3',
            documentType: 'Letter of Protection',
            documentTitle: 'Compliance Summary',
            sponsorId: '34567890',
            hsId: '65432109',
            hsChecked: false,
            sponsorChecked: false,
            taskId: '45678901',
            patientName: 'Tom Hanks',
            locationName: 'Location C',
            providerName: 'Dr. White',
            uploadedDate: '05-Dec-2024',
            uploadedBy: 'Sophia Brown',
            remarks: 'Submitted for approval.'
        },
        {
            id: '4',
            documentType: 'Medical Records',
            documentTitle: 'Patient Chart',
            sponsorId: '45678901',
            hsId: '76543210',
            hsChecked: false,
            sponsorChecked: true,
            taskId: '56789012',
            patientName: 'Lucy Liu',
            locationName: 'Location D',
            providerName: 'Dr. Green',
            patientName: 'Lucy Liu',
            locationName: 'Location D',
            providerName: 'Dr. Green',
            uploadedDate: '08-Dec-2024',
            uploadedBy: 'Alex Johnson',
            remarks: 'Pending final review.'
        },
        {
            id: '5',
            documentType: 'Billing Records',
            documentTitle: 'Invoice Summary',
            sponsorId: '56789012',
            hsId: '87654321',
            hsChecked: false,
            sponsorChecked: false,
            taskId: '67890123',
            patientName: 'Emma Watson',
            locationName: 'Location E',
            providerName: 'Dr. Black',
            uploadedDate: '05-Dec-2024',
            uploadedBy: 'Sophia Brown',
            remarks: 'Submitted for approval.'
        }
    ];

    get categoryOptions() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Medical', value: 'Medical' },
            { label: 'Billing', value: 'Billing' },
            { label: 'Imaging', value: 'Imaging' }
        ];
    }

    // Multi-select document category options (tracks checked state)
    @track documentCategoryOptions = [
        { label: 'Medical', value: 'Medical', checked: false },
        { label: 'Billing', value: 'Billing', checked: false },
        { label: 'Imaging', value: 'Imaging', checked: false },
        { label: 'Legal', value: 'Legal', checked: false },
        { label: 'Administrative', value: 'Administrative', checked: false }
    ];

    @track docCategoryDropdownOpen = false;

    get filterDocumentCategoryDisplay() {
        const selected = this.documentCategoryOptions.filter(opt => opt.checked).map(opt => opt.label);
        if (selected.length === 0) return 'Select Document Category';
        if (selected.length === 1) return selected[0];
        return `${selected.length} selected`;
    }

    get docCategoryDropdownClass() {
        return this.docCategoryDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu';
    }

    get documentTypeOptionsForAdd() {
        return [
            { label: 'Medical Records', value: 'Medical Records' },
            { label: 'Billing Records', value: 'Billing Records' },
            { label: 'Letter of Protection', value: 'Letter of Protection' },
            { label: 'Lab Results', value: 'Lab Results' },
            { label: 'Prescription', value: 'Prescription' },
            { label: 'Invoice', value: 'Invoice' }
        ];
    }

    get contextOptions() {
        return [
            { label: 'Patient', value: 'Patient' },
            { label: 'Cases', value: 'Cases' },
            { label: 'Claims', value: 'Claims' },
            { label: 'Visits', value: 'Visits' }
        ];
    }

    // Multi-select document type options (tracks checked state)
    @track documentTypeOptions = [
        { label: 'Medical Records', value: 'Medical Records', checked: false },
        { label: 'Billing Records', value: 'Billing Records', checked: false },
        { label: 'Letter of Protection', value: 'Letter of Protection', checked: false }
    ];

    get filterDocumentTypeDisplay() {
        const selected = this.documentTypeOptions.filter(opt => opt.checked).map(opt => opt.label);
        if (selected.length === 0) return 'Select Document Type';
        if (selected.length === 1) return selected[0];
        return `${selected.length} selected`;
    }

    get docTypeDropdownClass() {
        return this.docTypeDropdownOpen ? 'dropdown-menu show' : 'dropdown-menu';
    }

    get postVisitVariant() {
        return this.isPostVisit ? 'brand' : 'neutral';
    }

    get preVisitVariant() {
        return !this.isPostVisit ? 'brand' : 'neutral';
    }

    get viewButtonLabel() {
        return this.isCardView ? 'Grid View' : 'Card View';
    }

    get viewButtonIcon() {
        return this.isCardView ? 'utility:table' : 'utility:apps';
    }

    handlePostVisit() {
        this.isPostVisit = true;
    }

    handlePreVisit() {
        this.isPostVisit = false;
    }

    toggleView() {
        this.isCardView = !this.isCardView;
    }

    toggleFilter() {
        this.showFilter = !this.showFilter;
    }

    handleCategoryChange(event) {
        this.selectedCategory = event.detail.value;
    }

    handleFilterChange(event) {
        // Handle filter changes by input name
        const name = event.target ? event.target.name : undefined;
        const value = event.detail && event.detail.value !== undefined ? event.detail.value : event.target && event.target.value !== undefined ? event.target.value : undefined;
        if (name === 'keyword') {
            this.filterKeyword = value;
        } else if (name === 'fromDate') {
            this.filterFromDate = value;
        } else if (name === 'toDate') {
            this.filterToDate = value;
        } else if (name === 'documentType') {
            this.filterDocumentType = value;
        } else if (name === 'documentCategory') {
            this.filterDocumentCategory = value;
        } else if (name === 'category') {
            this.selectedCategory = value;
        } else {
            // fallback log
            // console.log('Unhandled filter change', name, value);
        }
    }

    clearAllFilters() {
        this.filterKeyword = '';
        this.filterFromDate = '';
        this.filterToDate = '';
        this.filterDocumentType = '';
    }

    applyFilter() {
        // Build selected document types array
        const selectedTypes = this.documentTypeOptions.filter(opt => opt.checked).map(opt => opt.value);
        const selectedCategories = this.documentCategoryOptions.filter(opt => opt.checked).map(opt => opt.value);
        console.log('Applying filters:', {
            keyword: this.filterKeyword,
            fromDate: this.filterFromDate,
            toDate: this.filterToDate,
            documentTypes: selectedTypes
            , documentCategories: selectedCategories
        });
        // close filter panel after applying
        this.showFilter = false;
        this.docTypeDropdownOpen = false;
        this.docCategoryDropdownOpen = false;
    }

    toggleDocTypeDropdown() {
        this.docTypeDropdownOpen = !this.docTypeDropdownOpen;
    }

    // Handler for HS checkbox change in grid
    handleHSCheckboxChange(event) {
        const id = event.target.dataset.id;
        const checked = event.target.checked;
        if (!id) return;
        this.documents = this.documents.map(d => d.id === id ? { ...d, hsChecked: checked } : d);
    }

    // Handler for Sponsor checkbox change in grid
    handleSponsorCheckboxChange(event) {
        const id = event.target.dataset.id;
        const checked = event.target.checked;
        if (!id) return;
        this.documents = this.documents.map(d => d.id === id ? { ...d, sponsorChecked: checked } : d);
    }

    toggleDocCategoryDropdown() {
        this.docCategoryDropdownOpen = !this.docCategoryDropdownOpen;
    }

    handleDocTypeCheckboxChange(event) {
        const val = event.target ? event.target.value : undefined;
        const checked = event.target ? event.target.checked : false;
        if (!val) return;
        // find and update option
        const opt = this.documentTypeOptions.find(o => o.value === val);
        if (opt) {
            opt.checked = checked;
            // force reactivity by reassigning the array reference (safer)
            this.documentTypeOptions = this.documentTypeOptions.slice();
        }
    }

    handleDocCategoryCheckboxChange(event) {
        const val = event.target ? event.target.value : undefined;
        const checked = event.target ? event.target.checked : false;
        if (!val) return;
        const opt = this.documentCategoryOptions.find(o => o.value === val);
        if (opt) {
            opt.checked = checked;
            this.documentCategoryOptions = this.documentCategoryOptions.slice();
        }
    }

    scrollLeft() {
        const container = this.template.querySelector('.table-container');
        if (container) {
            container.scrollBy({ left: -210, behavior: 'smooth' });
        }
    }

    scrollRight() {
        const container = this.template.querySelector('.table-container');
        if (container) {
            container.scrollBy({ left: 210, behavior: 'smooth' });
        }
    }

    // Add Document Modal handlers
    openAddDocumentPopup() {
        this.isAddDocumentOpen = true;
        this.addFormDocCategory = '';
        this.addFormDocType = '';
        this.addFormDocTitle = '';
        this.uploadedFile = null;
    }

    closeAddDocumentPopup() {
        this.isAddDocumentOpen = false;
    }

    handleModalOverlayClick(event) {
        if (event.target.classList.contains('modal-overlay')) {
            this.closeAddDocumentPopup();
        }
    }

    stopPropagation(event) {
        event.stopPropagation();
    }

    handleAddFormDocCategoryChange(event) {
        this.addFormDocCategory = event.target.value;
    }

    handleAddFormDocTypeChange(event) {
        this.addFormDocType = event.target.value;
    }

    handleAddFormDocTitleChange(event) {
        this.addFormDocTitle = event.target.value;
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.uploadedFile = file;
            console.log('File uploaded:', file.name);
        }
    }

    saveAddDocument() {
        console.log('Saving document:', {
            category: this.addFormDocCategory,
            type: this.addFormDocType,
            title: this.addFormDocTitle,
            file: this.uploadedFile
        });
        // Add your save logic here
        this.closeAddDocumentPopup();
    }

    connectedCallback() {
        this.sidebarSections = DOCUMENT_SIDEBAR_SECTIONS.map((section, index) => ({
            ...section,
            isOpen: index === 0,
            // ensure options include a selected flag for UI binding
            // mark IRB/IEC Approval Letter selected by default
            options: (section.options || []).map(opt => ({ ...opt, selected: opt.id === 'regulatory-compliance-1' }))
        }));
    }

    toggleSidebarSection(event) {
        const sectionId = event?.currentTarget?.dataset?.id;
        if (!sectionId) {
            return;
        }
        this.sidebarSections = this.sidebarSections.map((section) => (
            section.id === sectionId ? { ...section, isOpen: !section.isOpen } : section
        ));
    }

    // Handle click on a sidebar option (mark selected and emit event)
    handleSidebarOptionClick(event) {
        const sectionId = event?.currentTarget?.dataset?.section;
        const optionId = event?.currentTarget?.dataset?.optionid;
        if (!sectionId || !optionId) return;

        this.sidebarSections = this.sidebarSections.map(section => {
            if (section.id !== sectionId) return section;
            const newOptions = (section.options || []).map(opt => ({ ...opt, selected: opt.id === optionId }));
            return { ...section, options: newOptions };
        });

        // find the label for the selected option
        const section = this.sidebarSections.find(s => s.id === sectionId);
        const selectedOpt = section && section.options ? section.options.find(o => o.id === optionId) : null;

        // Emit an event so parent components can react (e.g., filter the document list)
        this.dispatchEvent(new CustomEvent('sidebarselect', {
            detail: {
                sectionId,
                optionId,
                label: selectedOpt ? selectedOpt.label : undefined
            }
        }));
    }
}
