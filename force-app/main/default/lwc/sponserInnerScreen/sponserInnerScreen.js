import { LightningElement, api } from 'lwc';
import AVATARS from '@salesforce/resourceUrl/avatars';

export default class SponserInnerScreen extends LightningElement {
  // Project detail navigation
  handleProjectClick(event) {
    const projectId = event.currentTarget.dataset.id;
    if (!projectId) return;
    const project = this.projectsData.find(p => p.id === projectId);
    if (project) {
      this.selectedProject = project;
      this.showProjectDetail = true;
    }
  }

  handleBackFromProjectDetail() {
    this.showProjectDetail = false;
    this.selectedProject = null;
  }

  // Enquiries handlers
  handleEnquirySort(event) {
    const field = event.currentTarget.dataset.field;
    if (!field) return;
    if (this.enquiriesSortField === field) {
      this.enquiriesSortDirection = this.enquiriesSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.enquiriesSortField = field;
      this.enquiriesSortDirection = 'asc';
    }
    this.enquiriesData = [...this.enquiriesData]
      .sort((a, b) => {
        const dir = this.enquiriesSortDirection === 'asc' ? 1 : -1;
        const av = (a[field] || '').toString().toLowerCase();
        const bv = (b[field] || '').toString().toLowerCase();
        if (av === bv) return 0;
        return av > bv ? dir : -dir;
      });
  }

  handleEnquiryEdit(event) {
    const id = event.currentTarget.dataset.id;
    // placeholder: hook to edit flow
    // eslint-disable-next-line no-console
    console.log('Edit enquiry', id);
  }

  handleEnquiryDelete(event) {
    const id = event.currentTarget.dataset.id;
    // placeholder: hook to delete flow
    // eslint-disable-next-line no-console
    console.log('Delete enquiry', id);
  }

  handleEnquiryClick(event) {
    const id = event.currentTarget.dataset.id;
    // placeholder: navigate/view enquiry detail
    // eslint-disable-next-line no-console
    console.log('Open enquiry', id);
  }

    @api sponsor;
    currentTab = 'Details';

    statusOptions = [
      { label: 'HS', value: 'HS', checked: false },
      { label: 'Sponsor', value: 'Sponsor', checked: false }
    ];
    statusDropdownOpen = false;
    selectedTags = [];
    
    // Study tab image
    studyImage = `${AVATARS}/pageUnderConstruction.jpeg`;
    // Protocol UI state
    selectedProtocolStep = '';
    // used to ensure we scroll the selected step into view only once per render
    hasScrolledToSelectedStep = false;
    // Add Activity modal state
    isAddActivityOpen = false;
    addFormMilestone = '';
    addFormDescription = '';
    // HS Matches state
    selectedHSId = 'hs1';
    selectedHSName = 'Mayo Clinic';
    messagingTab = 'HS'; // 'HS' or 'Sponsor'
    messageInput = '';
    // Legal state
    selectedLegalStep = '';
    legalStepsObjs = [];
    legalData = {};
    // Legal form + config
    // keep AGREEMENT_TYPES small here; hospital component uses a const, replicate values
    legalSteps = ['mNDA', 'LOI', 'ESA', 'MSA'];
    isLegalAddModalOpen = false;
    legalFormAgreementType = 'mNDA';
    legalFormVersion = '';
    legalFormInitiatedBy = '';
    legalFormHs = '';
    legalFormSponsor = '';
    legalFormDx = '';
    legalFormDueDate = '';
    legalFormDocName = '';
    legalFormStatus = 'In Process';
    legalEditingRowId = null;
    legalStatusOptions = [
      { label: 'In Process', value: 'In Process' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Rejected', value: 'Rejected' }
    ];
    // Execute modal state for Legal grid
    isExecuteOpen = false;
    selectedExecuteRowId = null;
    // Messaging state
    messagingActiveTab = 'sponsors'; // 'sponsors' or 'healthSystems'
    selectedContact = null;
    messagingInput = '';
    messagingContacts = [];
    messagingMessages = [];
    // Project detail view state
    showProjectDetail = false;
    selectedProject = null;

    // Projects data for Projects tab
    projectsData = [
      {
        id: 'p1',
        projectId: 'PRJ-001',
        projectName: 'Clinical Trial Phase III',
        status: 'Active',
        statusClass: 'project-status-badge status-active',
        completion: 75,
        sponsorName: 'Pharma Corp',
        sponsorInitials: 'PC',
        sponsorPhoto: '',
        documents: 12,
        notes: 8,
        messages: 15,
        lastUpdated: '2026-01-03',
        state: 'MN',
        city: 'Rochester',
        contact: 'John Smith',
        contactInitials: 'JS',
        contactPhoto: '',
        email: 'john.smith@mayo.edu',
        phone: '555-0101'
      },
      {
        id: 'p2',
        projectId: 'PRJ-002',
        projectName: 'Cardiovascular Study',
        status: 'Planning',
        statusClass: 'project-status-badge status-planning',
        completion: 25,
        sponsorName: 'MedTech Inc',
        sponsorInitials: 'MT',
        sponsorPhoto: '',
        documents: 5,
        notes: 3,
        messages: 7,
        lastUpdated: '2026-01-02',
        state: 'OH',
        city: 'Cleveland',
        contact: 'Sarah Johnson',
        contactInitials: 'SJ',
        contactPhoto: '',
        email: 'sarah.j@cleveland.org',
        phone: '555-0202'
      },
      {
        id: 'p3',
        projectId: 'PRJ-003',
        projectName: 'Diabetes Research',
        status: 'Completed',
        statusClass: 'project-status-badge status-completed',
        completion: 100,
        sponsorName: 'BioLife Sciences',
        sponsorInitials: 'BL',
        sponsorPhoto: '',
        documents: 25,
        notes: 18,
        messages: 42,
        lastUpdated: '2025-12-28',
        state: 'MD',
        city: 'Baltimore',
        contact: 'Michael Chen',
        contactInitials: 'MC',
        contactPhoto: '',
        email: 'm.chen@jhmi.edu',
        phone: '555-0303'
      }
    ];
    // Estimation tab navigation state
    estimationSteps = [];
    selectedEstimationSectionId = '';
    invoiceStepId = 'invoiceSchedule';

    // --- Legal handlers copied/adapted from hospitalSystemInnerScreen ---
    handleLegalStepClick(event) {
        const btn = event.target.closest('[data-legal]');
        if (!btn) return;
        const stepName = btn.dataset.legal;
        if (!stepName) return;
        this.selectedLegalStep = stepName;
        this.legalStepsObjs = this.legalStepsObjs.map(s => ({
            ...s,
            className: s.name === stepName ? 'step-item active' : 'step-item'
        }));
    }

    openLegalAddModal() {
      if (!this.selectedLegalStep && this.legalSteps && this.legalSteps.length) {
        this.selectedLegalStep = this.legalSteps[0];
      }
      this.resetLegalForm();
      this.isLegalAddModalOpen = true;
    }

    closeLegalAddModal() {
      this.isLegalAddModalOpen = false;
      this.resetLegalForm();
    }

    resetLegalForm() {
      const defaultAgreement = this.selectedLegalStep || (this.legalSteps && this.legalSteps[0]) || 'mNDA';
      this.legalFormAgreementType = defaultAgreement;
      this.legalFormVersion = '';
      this.legalFormInitiatedBy = '';
      this.legalFormHs = '';
      this.legalFormSponsor = '';
      this.legalFormDx = '';
      this.legalFormDueDate = '';
      this.legalFormDocName = '';
      this.legalFormStatus = 'In Process';
      this.legalEditingRowId = null;
    }

    handleLegalFormInputChange(event) {
      const name = event?.target?.name;
      const value = event?.detail?.value !== undefined ? event.detail.value : event?.target?.value;
      if (name && Object.prototype.hasOwnProperty.call(this, name)) {
        this[name] = value;
      }
    }

    handleLegalDocChange(event) {
      const fileList = event?.target?.files;
      this.legalFormDocName = fileList && fileList.length ? fileList[0].name : '';
    }

    saveLegalAdd() {
      const activeStep = this.selectedLegalStep || (this.legalSteps && this.legalSteps.length ? this.legalSteps[0] : null);
      if (!activeStep) {
        this.closeLegalAddModal();
        return;
      }
      const baseRow = {
        agreementType: this.legalFormAgreementType || activeStep,
        version: this.legalFormVersion || 'Draft',
        status: this.legalFormStatus || 'In Process',
        initiatedBy: this.legalFormInitiatedBy || '—',
        hsName: this.legalFormHs || '—',
        sponsorName: this.legalFormSponsor || '—',
        dxName: this.legalFormDx || '—',
        projectScopingDoc: this.legalFormDocName || 'Uploaded Document',
        dueDate: this.legalFormDueDate || new Date().toISOString().slice(0, 10)
      };
      const rows = this.legalData[activeStep] ? [...this.legalData[activeStep]] : [];
      if (this.legalEditingRowId) {
        const idx = rows.findIndex(r => r.id === this.legalEditingRowId);
        if (idx >= 0) {
          rows[idx] = { ...rows[idx], ...baseRow, id: this.legalEditingRowId };
          this.legalData = { ...this.legalData, [activeStep]: rows };
        }
      } else {
        const newRow = {
          id: `legal-${Date.now()}`,
          ...baseRow,
          hsAvatar: '',
          sponsorAvatar: '',
          dxAvatar: ''
        };
        this.legalData = { ...this.legalData, [activeStep]: [newRow, ...rows] };
      }
      this.closeLegalAddModal();
    }

    handleExecuteClick(event) {
      let id = null;
      try {
        const current = event.currentTarget;
        if (current && current.dataset && current.dataset.id) {
          id = current.dataset.id;
        } else if (event.target && event.target.closest) {
          const btn = event.target.closest('button[data-id]');
          if (btn && btn.dataset) id = btn.dataset.id;
        }
      } catch (e) {
        // ignore lookup errors
      }
      if (!id) return;
      this.selectedExecuteRowId = id;
      this.isExecuteOpen = true;
    }

    handleExecuteOverlayClick(event) {
      if (event.target.classList && event.target.classList.contains('modal-overlay')) {
        this.closeExecutePopup();
      }
    }

    closeExecutePopup() {
      this.isExecuteOpen = false;
      this.selectedExecuteRowId = null;
    }

    confirmExecute() {
      if (!this.selectedExecuteRowId) {
        this.closeExecutePopup();
        return;
      }
      const rows = this.legalData[this.selectedLegalStep] || [];
      const idx = rows.findIndex(r => r.id === this.selectedExecuteRowId);
      if (idx >= 0) {
        rows[idx] = { ...rows[idx], status: 'Completed' };
        this.legalData = { ...this.legalData };
      }
      this.closeExecutePopup();
    }

    handleLegalEdit(event) {
      const id = event.currentTarget?.dataset?.id;
      if (!id || !this.selectedLegalStep) {
        return;
      }
      const rows = this.legalData[this.selectedLegalStep] || [];
      const row = rows.find(r => r.id === id);
      if (!row) {
        return;
      }
      this.legalEditingRowId = id;
      this.legalFormAgreementType = row.agreementType || this.selectedLegalStep;
      this.legalFormVersion = row.version || '';
      this.legalFormInitiatedBy = row.initiatedBy || '';
      this.legalFormHs = row.hsName || '';
      this.legalFormSponsor = row.sponsorName || '';
      this.legalFormDx = row.dxName || '';
      this.legalFormDueDate = row.dueDate || '';
      this.legalFormDocName = row.projectScopingDoc || '';
      const hasValidStatus = this.legalStatusOptions.some(option => option.value === row.status);
      this.legalFormStatus = hasValidStatus ? row.status : 'In Process';
      this.isLegalAddModalOpen = true;
    }

    handleLegalDelete(event) {
      const id = event.currentTarget?.dataset?.id;
      if (!id || !this.selectedLegalStep) return;
      if (!confirm('Are you sure you want to delete this row?')) return;
      const rows = this.legalData[this.selectedLegalStep] || [];
      this.legalData[this.selectedLegalStep] = rows.filter(r => r.id !== id);
      this.legalData = { ...this.legalData };
    }
    
    // Intake tab state
    selectedIntakeSection = 'submitter';
    intakeSections = [
        { id: 'submitter', name: 'Submitter & Company Details', icon: 'utility:user' },
        { id: 'technology', name: 'Technology Information', icon: 'utility:connected_apps' },
        { id: 'endusers', name: 'End Users', icon: 'utility:groups' },
        { id: 'therapeutic', name: 'Therapeutic Area of Focus', icon: 'utility:heart' },
        { id: 'trials', name: 'Clinical Trials or Studies', icon: 'utility:knowledge_base' },
        { id: 'reference', name: 'Reference Sources', icon: 'utility:link' }
    ];
    // Intake combobox options
    salutationOptions = [
        { label: '--None--', value: '' },
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Dr.', value: 'Dr.' },
        { label: 'Prof.', value: 'Prof.' }
    ];
    companySizeOptions = [
        { label: '--None--', value: '' },
        { label: '1-10', value: '1-10' },
        { label: '11-50', value: '11-50' },
        { label: '51-200', value: '51-200' },
        { label: '201-500', value: '201-500' },
        { label: '501-1000', value: '501-1000' },
        { label: '1000+', value: '1000+' }
    ];
    clinicalTrialsOptions = [
        { label: '--None--', value: '' },
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
        { label: 'In Progress', value: 'In Progress' }
    ];
    
    // Notes tab state
    filterToggle = false;
    filterFromDate = '';
    filterToDate = '';
    searchKey = '';
    selectedTags = [];
    message = '';
    selectedPatientType = '';
    showMore = false;
    isNavOpen = true;
    isAscending = true;
    displayedColumns = ['date', 'postedBy', 'message', 'context', 'tags'];
    chatMessages = [];
    totalSize = 0;
    currentPage = 0;
    eventTypes = ['Emergency', 'Expedite', 'Delayed', 'Sub Acute', 'Commercial', 'High Risk', 'Pregnant', 'Minor', 'Teenager', 'Cancer', 'Diabetic', 'Hyper Tension', 'Disabled'];
    filteredPatientTypes = [];
    contextOptions = [
        { label: 'Emergency', value: 'emergency' },
        { label: 'Expedite', value: 'expedite' },
        { label: 'Delayed', value: 'delayed' },
        { label: 'Sub Acute', value: 'subacute' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'High Risk', value: 'highrisk' },
        { label: 'Pregnant', value: 'pregnant' },
        { label: 'Minor', value: 'minor' },
        { label: 'Teenager', value: 'teenager' },
        { label: 'Cancer', value: 'cancer' },
        { label: 'Diabetic', value: 'diabetic' },
        { label: 'Hyper Tension', value: 'hypertension' },
        { label: 'Disabled', value: 'disabled' }
    ];
    tagOptions = [
        { label: 'Emergency', value: 'emergency' },
        { label: 'Expedite', value: 'expedite' },
        { label: 'Delayed', value: 'delayed' },
        { label: 'Sub Acute', value: 'subacute' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'High Risk', value: 'highrisk' },
        { label: 'Pregnant', value: 'pregnant' },
        { label: 'Minor', value: 'minor' },
        { label: 'Teenager', value: 'teenager' },
        { label: 'Cancer', value: 'cancer' },
        { label: 'Diabetic', value: 'diabetic' },
        { label: 'Hyper Tension', value: 'hypertension' },
        { label: 'Disabled', value: 'disabled' }
    ];
    
    notesColumns = [
        {
            label: 'Date',
            fieldName: 'date',
            type: 'date',
            typeAttributes: {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            },
            cellAttributes: { alignment: 'left' }
        },
        {
            label: 'Posted By',
            fieldName: 'postedBy',
            type: 'text',
            cellAttributes: { alignment: 'left' }
        },
        {
            label: 'Message',
            fieldName: 'message',
            type: 'text',
            wrapText: true,
            cellAttributes: { alignment: 'left' }
        },
        {
            label: 'Context',
            fieldName: 'context',
            type: 'text',
            cellAttributes: { alignment: 'left' }
        },
        {
            label: 'Tags',
            fieldName: 'tagsDisplay',
            type: 'text',
            cellAttributes: { alignment: 'left' }
        }
    ];

      // Enquiries state
      enquiriesSortField = 'enquiryId';
      enquiriesSortDirection = 'asc';
      enquiriesData = [
        { id: 'ENQ001', enquiryId: 'New1455', status: 'Active', statusClass: 'badge-soft-success border border-success', sponsorName: 'Sample Sponsor', sponsorInitial: 'SS', projectName: 'CDS Clinical Trial', projectDetails: 'Phase III cardiovascular study', hasDocument: true, hsAllocated: 'Mayo Clinic', dateCreated: '2025-10-15', lastUpdated: '2025-11-15' },
        { id: 'ENQ002', enquiryId: 'PX-1002', status: 'Active', statusClass: 'badge-soft-success border border-success', sponsorName: 'BioHealth Ltd', sponsorInitial: 'BH', projectName: 'Beta Research', projectDetails: 'Oncology drug trial Phase II', hasDocument: true, hsAllocated: 'Cleveland Clinic', dateCreated: '2025-10-10', lastUpdated: '2025-11-10' },
        { id: 'ENQ003', enquiryId: 'PX-1003', status: 'Inactive', statusClass: 'badge-soft-danger border border-danger', sponsorName: 'MedSolutions', sponsorInitial: 'MS', projectName: 'Gamma Protocol', projectDetails: 'Neurological disorder study', hasDocument: false, hsAllocated: '-', dateCreated: '2025-10-08', lastUpdated: '2025-11-08' },
        { id: 'ENQ004', enquiryId: 'PX-1004', status: 'Active', statusClass: 'badge-soft-success border border-success', sponsorName: 'Global Trials', sponsorInitial: 'GT', projectName: 'Delta Study', projectDetails: 'Diabetes management research', hasDocument: true, hsAllocated: 'Johns Hopkins', dateCreated: '2025-10-12', lastUpdated: '2025-11-12' },
        { id: 'ENQ005', enquiryId: 'PX-1005', status: 'Inactive', statusClass: 'badge-soft-danger border border-danger', sponsorName: 'Acme Pharma', sponsorInitial: 'AP', projectName: 'Epsilon Trial', projectDetails: 'Immunology clinical trial', hasDocument: false, hsAllocated: '-', dateCreated: '2025-09-25', lastUpdated: '2025-10-25' },
        { id: 'ENQ006', enquiryId: 'PX-1006', status: 'Active', statusClass: 'badge-soft-success border border-success', sponsorName: 'NextGen Pharma', sponsorInitial: 'NP', projectName: 'Zeta Discovery', projectDetails: 'Rare disease treatment study', hasDocument: true, hsAllocated: 'Stanford Health', dateCreated: '2025-10-05', lastUpdated: '2025-11-05' },
        { id: 'ENQ007', enquiryId: 'PX-1007', status: 'Completed', statusClass: 'badge-soft-info border border-info', sponsorName: 'Alpha Bio', sponsorInitial: 'AB', projectName: 'Theta Clinical', projectDetails: 'Respiratory disease trial', hasDocument: true, hsAllocated: 'Mass General', dateCreated: '2025-09-30', lastUpdated: '2025-10-30' },
        { id: 'ENQ008', enquiryId: 'PX-1008', status: 'Active', statusClass: 'badge-soft-success border border-success', sponsorName: 'TriCore Labs', sponsorInitial: 'TL', projectName: 'Omega Research', projectDetails: 'Pain management study', hasDocument: true, hsAllocated: 'UCSF Medical', dateCreated: '2025-10-14', lastUpdated: '2025-11-14' },
        { id: 'ENQ009', enquiryId: 'PX-1009', status: 'Active', statusClass: 'badge-soft-success border border-success', sponsorName: 'BioVantage', sponsorInitial: 'BV', projectName: 'Sigma Trial', projectDetails: 'Infectious disease protocol', hasDocument: false, hsAllocated: 'Northwestern', dateCreated: '2025-10-09', lastUpdated: '2025-11-09' },
        { id: 'ENQ010', enquiryId: 'PX-1010', status: 'Inactive', statusClass: 'badge-soft-danger border border-danger', sponsorName: 'OptimaBio', sponsorInitial: 'OB', projectName: 'Lambda Study', projectDetails: 'Metabolic syndrome research', hasDocument: false, hsAllocated: '-', dateCreated: '2025-10-01', lastUpdated: '2025-11-01' },
        { id: 'ENQ011', enquiryId: 'PX-1011', status: 'Active', statusClass: 'badge-soft-success border border-success', sponsorName: 'HealthWave', sponsorInitial: 'HW', projectName: 'Kappa Protocol', projectDetails: 'Cardiovascular intervention', hasDocument: true, hsAllocated: 'Duke Health', dateCreated: '2025-10-11', lastUpdated: '2025-11-11' },
        { id: 'ENQ012', enquiryId: 'PX-1012', status: 'Active', statusClass: 'badge-soft-success border border-success', sponsorName: 'BioMedX', sponsorInitial: 'BX', projectName: 'Mu Clinical', projectDetails: 'Renal disease study', hasDocument: true, hsAllocated: 'Emory Healthcare', dateCreated: '2025-10-13', lastUpdated: '2025-11-13' },
        { id: 'ENQ013', enquiryId: 'PX-1013', status: 'Completed', statusClass: 'badge-soft-info border border-info', sponsorName: 'LifeCure', sponsorInitial: 'LC', projectName: 'Nu Discovery', projectDetails: 'Cancer immunotherapy trial', hasDocument: true, hsAllocated: 'UCLA Health', dateCreated: '2025-10-06', lastUpdated: '2025-11-06' },
        { id: 'ENQ014', enquiryId: 'PX-1014', status: 'Inactive', statusClass: 'badge-soft-danger border border-danger', sponsorName: 'BioAxis', sponsorInitial: 'BA', projectName: 'Xi Research', projectDetails: 'Genetic disorder study', hasDocument: false, hsAllocated: '-', dateCreated: '2025-10-02', lastUpdated: '2025-11-02' },
        { id: 'ENQ015', enquiryId: 'PX-1015', status: 'Active', statusClass: 'badge-soft-success border border-success', sponsorName: 'MedCore', sponsorInitial: 'MC', projectName: 'Omicron Trial', projectDetails: 'Dermatology clinical study', hasDocument: true, hsAllocated: 'Tampa General', dateCreated: '2025-09-28', lastUpdated: '2025-10-28' },
        { id: 'ENQ016', enquiryId: 'PX-1016', status: 'Active', statusClass: 'badge-soft-success border border-success', sponsorName: 'NextStep Labs', sponsorInitial: 'NS', projectName: 'Rho Clinical', projectDetails: 'Ophthalmology research', hasDocument: false, hsAllocated: 'Albany Medical', dateCreated: '2025-10-04', lastUpdated: '2025-11-04' }
      ];

    savedSearchOptions = [
        { label: 'Pending Verification', value: 'pending_verification' },
        { label: 'SCH & Pending AUTH', value: 'sch_pending_auth' },
        { label: 'Referrals this week', value: 'referrals_week' },
        { label: 'Authorized this week', value: 'authorized_week' }
    ];
    // list of milestone names (new 7-stage structure)
    milestoneNames = [
        'Trial Preparation',
        'Project Oversight & Management',
        'Data Monitoring & SDV',
        'Final Data Analysis',
        'Sponsor Final Readout',
        'Publication & Archiving',
        'Final Wrap-Up'
    ];
    protocolSteps = [];

    // protocolData will be built dynamically for each milestone (now contains activity items with checkboxes)
    protocolData = {};

    // Activity definitions for each milestone stage
    milestoneActivities = {
        'Trial Preparation': [
            { id: 'tp1', text: 'Align with Sponsor on study objectives, timelines, and KPIs.', checked: false, section: '3–6 Months Before FPFV' },
            { id: 'tp2', text: 'Develop Study Execution Plan and tracking tools (weekly reports, dashboards).', checked: false, section: '3–6 Months Before FPFV' },
            { id: 'tp3', text: 'Finalize datosX and HS research team roles/responsibilities.', checked: false, section: '3–6 Months Before FPFV' },
            { id: 'tp4', text: 'Confirm with Operations all contracts (Sponsor CTA, HS MSA, vendor agreements) are executed.', checked: false, section: '3–6 Months Before FPFV' },
            { id: 'tp5', text: 'Conduct Internal Kick-off Meeting (datosX Ops, Trial Lead, Leadership).', checked: false, section: '3–6 Months Before FPFV' },
            { id: 'tp6', text: 'Conduct Trial Kick-off Meeting (Sponsor + HS).', checked: false, section: '3–6 Months Before FPFV' },
            { id: 'tp7', text: 'Schedule IRB / Trial Preparation Meeting Series.', checked: false, section: '3–6 Months Before FPFV' },
            { id: 'tp8', text: 'Collaborate with HS to prepare and submit IRB application.', checked: false, section: '3–6 Months Before FPFV' },
            { id: 'tp9', text: 'Ensure all required IRB documents are finalized (protocol, ICF, CRF, recruitment materials, PI CV, etc.).', checked: false, section: '3–6 Months Before FPFV' },
            { id: 'tp10', text: 'Track IRB review process and coordinate modification responses.', checked: false, section: '3–6 Months Before FPFV' },
            { id: 'tp11', text: 'Set up data collection workflow and finalize EDC setup.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp12', text: 'Validate CRF versions (paper/electronic) and confirm regulatory compliance (HIPAA, 21 CFR Part 11).', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp13', text: 'Provide or arrange EDC system training for HS research team.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp14', text: 'Develop Data Monitoring and Source Data Verification (SDV) Plans.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp15', text: 'Define data entry timelines, query process, and AE/SAE tracking procedures.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp16', text: 'Define SDV visit schedule and data points for verification.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp17', text: 'Finalize Data Analysis Plan (responsible party, interim/final analyses, anonymization process).', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp18', text: 'Develop Patient Screening and Recruitment Plan.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp19', text: 'Review and approve recruitment materials before IRB submission.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp20', text: 'Support HS in outreach coordination and community engagement.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp21', text: 'Define participant visit schedule and site logistics.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp22', text: 'Confirm required supplies, equipment, and tools for site readiness.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp23', text: 'Create and circulate Site Readiness Checklist.', checked: false, section: '2–3 Months Before FPFV' },
            { id: 'tp24', text: 'Conduct site readiness visit(s) and finalize Site Readiness Checklist.', checked: false, section: '1 Month Before FPFV' },
            { id: 'tp25', text: 'Organize and/or deliver site training sessions (virtual/on-site).', checked: false, section: '1 Month Before FPFV' },
            { id: 'tp26', text: 'Verify recruitment materials and equipment are on-site and properly placed.', checked: false, section: '1 Month Before FPFV' },
            { id: 'tp27', text: 'Confirm IRB approval receipt.', checked: false, section: '1 Month Before FPFV' },
            { id: 'tp28', text: 'Re-confirm all agreements (Sponsor, HS, datosX, vendors) are executed.', checked: false, section: '1 Month Before FPFV' },
            { id: 'tp29', text: 'Confirm ClinicalTrials.gov registration completion.', checked: false, section: '1 Month Before FPFV' },
            { id: 'tp30', text: 'Finalize Go/No-Go decision with Sponsor and HS.', checked: false, section: '1 Month Before FPFV' },
            { id: 'tp31', text: 'Confirm official FPFV date.', checked: false, section: '1 Month Before FPFV' }
        ],
        'Project Oversight & Management': [
            { id: 'pom1', text: 'Provide weekly Sponsor updates on enrollment, site status, milestones.', checked: false, section: 'Trial Execution' },
            { id: 'pom2', text: 'Identify and address recruitment or operational challenges promptly.', checked: false, section: 'Trial Execution' },
            { id: 'pom3', text: 'Support HS research teams with issue resolution and data-entry troubleshooting.', checked: false, section: 'Trial Execution' },
            { id: 'pom4', text: 'Maintain cross-functional coordination with Sponsor, HS, and datosX teams.', checked: false, section: 'Trial Execution' },
            { id: 'pom5', text: 'Track meeting action items and ensure follow-up completion.', checked: false, section: 'Trial Execution' }
        ],
        'Data Monitoring & SDV': [
            { id: 'dm1', text: 'Conduct ongoing remote EDC data review for completeness and consistency.', checked: false, section: 'Trial Execution' },
            { id: 'dm2', text: 'Monitor AE/SAE reporting and protocol deviations.', checked: false, section: 'Trial Execution' },
            { id: 'dm3', text: 'Generate and track data queries; ensure timely resolution.', checked: false, section: 'Trial Execution' },
            { id: 'dm4', text: 'Develop and document a Source Data Verification (SDV) plan prior to on-site visits.', checked: false, section: 'Trial Execution' },
            { id: 'dm5', text: 'Conduct on-site SDV visits as planned (initial, mid-study, closeout).', checked: false, section: 'Trial Execution' },
            { id: 'dm6', text: 'Verify informed consent documentation and patient eligibility.', checked: false, section: 'Trial Execution' },
            { id: 'dm7', text: 'Identify and correct data discrepancies.', checked: false, section: 'Trial Execution' },
            { id: 'dm8', text: 'Provide corrective feedback to site teams.', checked: false, section: 'Trial Execution' },
            { id: 'dm9', text: 'Produce Data Quality Reports summarizing trends and findings.', checked: false, section: 'Trial Execution' },
            { id: 'dm10', text: 'Ensure corrective actions are implemented and documented.', checked: false, section: 'Trial Execution' },
            { id: 'dm11', text: 'Coordinate final SDV completion and data lock with HS and Sponsor.', checked: false, section: 'Trial Execution' },
            { id: 'dm12', text: "Support Sponsor's data team in final analysis preparation.", checked: false, section: 'Trial Execution' }
        ],
        'Final Data Analysis': [
            { id: 'fda1', text: 'Coordinate with data vendor/biostatistics team for analysis as per plan.', checked: false, section: 'Trial Close' },
            { id: 'fda2', text: 'Review preliminary findings; ensure clarity and consistency.', checked: false, section: 'Trial Close' },
            { id: 'fda3', text: 'Resolve any post-lock data issues with Sponsor and vendor.', checked: false, section: 'Trial Close' }
        ],
        'Sponsor Final Readout': [
            { id: 'sfr1', text: 'Organize and lead Final Readout Meeting with Sponsor.', checked: false, section: 'Trial Close' },
            { id: 'sfr2', text: 'Align stakeholders on interpretation of results and key lessons.', checked: false, section: 'Trial Close' },
            { id: 'sfr3', text: 'Document learnings for internal review.', checked: false, section: 'Trial Close' }
        ],
        'Publication & Archiving': [
            { id: 'pa1', text: 'Support manuscript coordination (if applicable).', checked: false, section: 'Trial Close' },
            { id: 'pa2', text: 'Compile data summaries, study documents, and regulatory materials.', checked: false, section: 'Trial Close' },
            { id: 'pa3', text: 'Ensure secure long-term archiving of all study data, reports, and documents.', checked: false, section: 'Trial Close' },
            { id: 'pa4', text: 'Confirm data retention compliance (5–15 years, as required).', checked: false, section: 'Trial Close' }
        ],
        'Final Wrap-Up': [
            { id: 'fw1', text: 'Conduct internal study debrief with datosX teams.', checked: false, section: 'Trial Close' },
            { id: 'fw2', text: 'Deliver final closeout report to Sponsor.', checked: false, section: 'Trial Close' }
        ]
    };

      // Estimation summary data based on the provided reference image
      estimationSummary = {
        header: [
          { label: 'Trial Name', field: 'projectName', value: 'XX' },
          { label: 'Trial Type', field: 'trialType', value: 'XX' },
          { label: 'Site(s)', field: 'siteCount', value: 'XX' }
        ],
        sections: [
          {
            id: 'personnel',
            title: 'Personnel',
            rows: [
              { id: 'per1', item: 'Trial Lead', dxCostPerUnit: '$100.00', pricePerUnit: '$180.00', unit: 'Hour', qty: '480', costUnadjusted: '$48,000.00', totalCost: '$86,400.00' },
              { id: 'per2', item: 'Biostatistician', dxCostPerUnit: '$175.00', pricePerUnit: '$315.00', unit: 'Hour', qty: '90', costUnadjusted: '$15,750.00', totalCost: '$28,350.00' },
              { id: 'per3', item: 'Executive Alignment and Strategy Support', dxCostPerUnit: '$150.00', pricePerUnit: '$270.00', unit: 'Hour', qty: '20', costUnadjusted: '$3,000.00', totalCost: '$5,400.00' },
              { id: 'per4', item: 'PhD Medical writer', dxCostPerUnit: '$150.00', pricePerUnit: '$270.00', unit: 'Hour', qty: '20', costUnadjusted: '$3,000.00', totalCost: '$5,400.00' },
              { id: 'per5', item: 'PI engagement', dxCostPerUnit: '$125.00', pricePerUnit: '$125.00', unit: 'Patients', qty: '90', costUnadjusted: '$11,250.00', totalCost: '$11,250.00' },
              { id: 'per6', item: 'Site coordinator FTE', dxCostPerUnit: '$60.00', pricePerUnit: '$60.00', unit: 'Patients', qty: '90', costUnadjusted: '$5,400.00', totalCost: '$5,400.00' },
              { id: 'per7', item: 'HS Data entry', dxCostPerUnit: '$75.00', pricePerUnit: '$75.00', unit: 'Patients', qty: '90', costUnadjusted: '$6,750.00', totalCost: '$6,750.00' },
              { id: 'per8', item: 'Subject recruitment / study visit', dxCostPerUnit: '$75.00', pricePerUnit: '$75.00', unit: 'Patients', qty: '90', costUnadjusted: '$6,750.00', totalCost: '$6,750.00' }
            ],
            subtotal: {
              costUnadjusted: '$99,900.00',
              totalCost: '$155,700.00'
            }
          },
          {
            id: 'facilities',
            title: 'Facilities and Administration',
            rows: [
              { id: 'fac1', item: 'Trial liability insurance', dxCostPerUnit: '$300.00', pricePerUnit: '$540.00', unit: 'Month', qty: '9', costUnadjusted: '$2,700.00', totalCost: '$4,860.00' },
              { id: 'fac2', item: 'Other F&A (legal, etc.)', dxCostPerUnit: '$—', pricePerUnit: '$—', unit: '', qty: '', costUnadjusted: '$—', totalCost: '$—' },
              { id: 'fac3', item: 'Data management platform', dxCostPerUnit: '$2,200.00', pricePerUnit: '$3,960.00', unit: 'Month', qty: '9', costUnadjusted: '$19,800.00', totalCost: '$35,640.00' },
              { id: 'fac4', item: 'Health system startup fee', dxCostPerUnit: '$18,000.00', pricePerUnit: '$18,000.00', unit: 'Fixed', qty: '1', costUnadjusted: '$18,000.00', totalCost: '$18,000.00' },
              { id: 'fac5', item: 'IRB fees', dxCostPerUnit: '$6,000.00', pricePerUnit: '$6,000.00', unit: 'Fixed', qty: '1', costUnadjusted: '$6,000.00', totalCost: '$6,000.00' }
            ],
            subtotal: {
              costUnadjusted: '$44,700.00',
              totalCost: '$46,860.00'
            }
          },
          {
            id: 'additional',
            title: 'Additional Fees',
            rows: [
              { id: 'add1', item: 'Site travel fees*', dxCostPerUnit: '$2,000.00', pricePerUnit: '$2,000.00', unit: 'Visits', qty: '1', costUnadjusted: '$2,000.00', totalCost: '$2,000.00' }
            ],
            subtotal: {
              costUnadjusted: '$2,000.00',
              totalCost: '$2,000.00'
            }
          },
          {
            id: 'reductions',
            title: 'Price reductions',
            rows: [
              { id: 'red1', item: 'Protocol writing project', dxCostPerUnit: '$2000', pricePerUnit: '$3000', unit: '1', qty: '', costUnadjusted: '$4999', totalCost: '$5000' },
              { id: 'red2', item: 'HS matching fee', dxCostPerUnit: '$2000', pricePerUnit: '$3000', unit: '1', qty: '', costUnadjusted: '$4999', totalCost: '$5000' }
            ],
            subtotal: {
              costUnadjusted: '$9998.00',
              totalCost: '$10000.00'
            }
          }
        ],
        note: '*Note: Travel fees are only charged as needed. The above describes our current estimate, however unused fees will be returned and additional costs added depending on actual utilization.',
        grandTotal: {
          costUnadjusted: '$146,600.00',
          totalCost: '$204,560.00'
        },
        invoice: {
          title: 'Invoice schedule - milestone based',
          rows: [
            { id: 'inv1', description: 'Execute contract - this is for trial prep coverage, including protocol devt', milestone: 'Milestone 1', percent: '50%', amount: '$102,280.00' },
            { id: 'inv2', description: '25% participants recruited - cover the most critical starting point', milestone: 'Milestone 2', percent: '25%', amount: '$51,140.00' },
            { id: 'inv3', description: 'Project close - final fee for project completion', milestone: 'Milestone 3', percent: '25%', amount: '$51,140.00' }
          ],
          footnotes: [
            'Extra notes: For protocol development projects - 50% due upon contract execution and 50% on project close',
            'Also we need to make sure that this schedule matches up with the HS fee schedule'
          ]
        }
      };

    handleBackClick() {
        this.dispatchEvent(new CustomEvent('back'));
    }


    get isDetails() {
        return this.currentTab === 'Details';
    }

    get isRequirements() {
      return this.currentTab === 'Requirements';
    }

    get isLegal() {
        return this.currentTab === 'Legal';
    }

    get isMessaging() {
        return this.currentTab === 'Messaging';
    }

    get isNotes() {
        return this.currentTab === 'Related';
    }

    get isEnquiries() {
      return this.currentTab === 'Enquiries';
    }

    get isProject() {
      return this.currentTab === 'Project';
    }

    get isIntake() {
        return this.currentTab === 'Intake';
    }

    // Intake section getters
    get isIntakeSubmitter() {
        return this.selectedIntakeSection === 'submitter';
    }
    get isIntakeTechnology() {
        return this.selectedIntakeSection === 'technology';
    }
    get isIntakeEndUsers() {
        return this.selectedIntakeSection === 'endusers';
    }
    get isIntakeTherapeutic() {
        return this.selectedIntakeSection === 'therapeutic';
    }
    get isIntakeTrials() {
        return this.selectedIntakeSection === 'trials';
    }
    get isIntakeReference() {
        return this.selectedIntakeSection === 'reference';
    }

    // Intake navigation items with active state
    get intakeNavItems() {
        return this.intakeSections.map((section, index) => {
            const isActive = section.id === this.selectedIntakeSection;
            const currentIndex = this.intakeSections.findIndex(s => s.id === this.selectedIntakeSection);
            const isCompleted = index < currentIndex;
            
            return {
                ...section,
                className: isActive ? 'intake-nav-item active' : 'intake-nav-item',
                statusClass: isActive ? 'intake-status-active' : (isCompleted ? 'intake-status-completed' : 'intake-status-pending'),
                statusIcon: isActive ? 'utility:check' : (isCompleted ? 'utility:check' : 'utility:record')
            };
        });
    }

    // Handle intake section click
    handleIntakeSectionClick(event) {
        const sectionId = event.currentTarget.dataset.section;
        if (sectionId) {
            this.selectedIntakeSection = sectionId;
        }
    }

    // Handle Save and Next button click
    handleSaveAndNext() {
        // Find current section index
        const currentIndex = this.intakeSections.findIndex(
            section => section.id === this.selectedIntakeSection
        );
        
        // Move to next section if not at the end
        if (currentIndex !== -1 && currentIndex < this.intakeSections.length - 1) {
            this.selectedIntakeSection = this.intakeSections[currentIndex + 1].id;
        } else if (currentIndex === this.intakeSections.length - 1) {
            // At the last section - could show a completion message or save
            console.log('All sections completed');
        }
    }

    // Back navigation for Intake
    handleIntakeBack() {
        const currentIndex = this.intakeSections.findIndex(
            section => section.id === this.selectedIntakeSection
        );
        if (currentIndex > 0) {
            this.selectedIntakeSection = this.intakeSections[currentIndex - 1].id;
        }
    }

    // Clear Intake form
    handleIntakeClear() {
        // Reset form values - implementation can be expanded as needed
        console.log('Clearing intake form');
    }

    // Getters for conditional values in Notes section
    get showMoreButtonLabel() {
        return this.showMore ? 'Less' : 'More';
    }

    get sortIconName() {
        return this.isAscending ? 'utility:arrowup' : 'utility:arrowdown';
    }

    hsMatches = [
        { id: 'hs1', name: 'Mayo Clinic', matchPercentage: 95, avatar: '/resource/avatars/HS1.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item active' },
        { id: 'hs2', name: 'Cleveland Clinic', matchPercentage: 92, avatar: '/resource/avatars/HS2.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs3', name: 'Johns Hopkins', matchPercentage: 90, avatar: '/resource/avatars/HS3.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs4', name: 'Mass General', matchPercentage: 88, avatar: '/resource/avatars/HS4.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs5', name: 'UCLA Medical', matchPercentage: 85, avatar: '/resource/avatars/HS5.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs6', name: 'UCSF Health', matchPercentage: 83, avatar: '/resource/avatars/ODF.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs7', name: 'Stanford Health', matchPercentage: 80, avatar: '/resource/avatars/ODF1.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs8', name: 'Duke Health', matchPercentage: 78, avatar: '/resource/avatars/ODF2.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs9', name: 'Northwestern', matchPercentage: 76, avatar: '/resource/avatars/ODF3.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs10', name: 'Cedars-Sinai', matchPercentage: 75, avatar: '/resource/avatars/HS1.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' }
    ];

    // Static capability groups for all Top 10 HS Matches
    staticCapabilityGroups = [
  {
    "id": "g_facilities",
    "title": "Facilities Available",
    "isOpen": true,
    "arrowClass": "dropdown-arrow",
    "items": [
      {
        "id": "fa1",
        "label": "Academic Medical Center",
        "hs": true,
        "sponsor": false,
        "weight": "1.15%",
        "projectNeeds": true,
        "score": "1.15%"
      },
      {
        "id": "fa2",
        "label": "Ambulatory Surgical Center",
        "hs": true,
        "sponsor": false,
        "weight": "0.86%",
        "projectNeeds": true,
        "score": "0.86%"
      },
      {
        "id": "fa3",
        "label": "Center of Excellence",
        "hs": false,
        "sponsor": false,
        "weight": "1%",
        "projectNeeds": true,
        "score": "0%"
      },
      {
        "id": "fa4",
        "label": "Community Health Clinic",
        "hs": true,
        "sponsor": false,
        "weight": "0.71%",
        "projectNeeds": true,
        "score": "0.71%"
      },
      {
        "id": "fa5",
        "label": "Diagnostic Imaging Center",
        "hs": true,
        "sponsor": false,
        "weight": "0.86%",
        "projectNeeds": true,
        "score": "0.86%"
      },
      {
        "id": "fa6",
        "label": "Emergency Room / Urgent Care",
        "hs": true,
        "sponsor": false,
        "weight": "1%",
        "projectNeeds": true,
        "score": "1%"
      },
      {
        "id": "fa7",
        "label": "Hospice",
        "hs": true,
        "sponsor": false,
        "weight": "0.57%",
        "projectNeeds": true,
        "score": "0.57%"
      },
      {
        "id": "fa8",
        "label": "Nursing Home",
        "hs": true,
        "sponsor": false,
        "weight": "0.71%",
        "projectNeeds": true,
        "score": "0.71%"
      },
      {
        "id": "fa9",
        "label": "Outpatient Clinic",
        "hs": true,
        "sponsor": false,
        "weight": "0.86%",
        "projectNeeds": true,
        "score": "0.86%"
      },
      {
        "id": "fa10",
        "label": "Rehab Center",
        "hs": true,
        "sponsor": false,
        "weight": "0.71%",
        "projectNeeds": true,
        "score": "0.71%"
      },
      {
        "id": "fa11",
        "label": "Research Institution",
        "hs": true,
        "sponsor": false,
        "weight": "1.14%",
        "projectNeeds": true,
        "score": "1.14%"
      },
      {
        "id": "fa12",
        "label": "Other",
        "hs": true,
        "sponsor": false,
        "weight": "0.43%",
        "projectNeeds": true,
        "score": "0.43%"
      }
    ]
  },

  {
    "id": "g6",
    "title": "Therapeutic Area of Focus",
    "isOpen": false,
    "arrowClass": "dropdown-arrow",
    "items": [
      {
        "id": "ta1",
        "label": "Allergy and Immunology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "3%",
        "score": "3%"
      },
      {
        "id": "ta2",
        "label": "Cardiovascular",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta3",
        "label": "Chronic Diseases",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.37%",
        "score": "2.37%"
      },
      {
        "id": "ta4",
        "label": "Dental",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.18%",
        "score": "1.18%"
      },
      {
        "id": "ta5",
        "label": "Dermatology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta6",
        "label": "Diagnostic Radiology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.18%",
        "score": "1.18%"
      },
      {
        "id": "ta7",
        "label": "Emergency Department (ER / ED)",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta8",
        "label": "Endocrinology (Diabetes, Thyroid)",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.37%",
        "score": "2.37%"
      },
      {
        "id": "ta9",
        "label": "ENT / Otolaryngology (Ear, Nose, Throat)",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.18%",
        "score": "1.18%"
      },
      {
        "id": "ta10",
        "label": "Gastroenterology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta11",
        "label": "Genetic Medicine",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.37%",
        "score": "2.37%"
      },
      {
        "id": "ta12",
        "label": "Hematology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.97%",
        "score": "2.97%"
      },
      {
        "id": "ta13",
        "label": "Infectious Disease",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.37%",
        "score": "2.37%"
      },
      {
        "id": "ta14",
        "label": "Men's Health",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.18%",
        "score": "1.18%"
      },
      {
        "id": "ta15",
        "label": "Musculoskeletal",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta16",
        "label": "Nephrology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta17",
        "label": "Neuroscience",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.97%",
        "score": "2.97%"
      },
      {
        "id": "ta18",
        "label": "Oncology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "3.57%",
        "score": "3.57%"
      },
      {
        "id": "ta19",
        "label": "Ophthalmology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta20",
        "label": "Pathology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.37%",
        "score": "2.37%"
      },
      {
        "id": "ta21",
        "label": "Pediatrics",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.37%",
        "score": "2.37%"
      },
      {
        "id": "ta22",
        "label": "Physical medicine and rehab",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta23",
        "label": "Population Health",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.37%",
        "score": "2.37%"
      },
      {
        "id": "ta24",
        "label": "Preventative",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta25",
        "label": "Primary Care",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.97%",
        "score": "2.97%"
      },
      {
        "id": "ta26",
        "label": "Psychiatry",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.37%",
        "score": "2.37%"
      },
      {
        "id": "ta27",
        "label": "Pulmonary",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.37%",
        "score": "2.37%"
      },
      {
        "id": "ta28",
        "label": "Respiratory",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta29",
        "label": "Rheumatology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.37%",
        "score": "2.37%"
      },
      {
        "id": "ta30",
        "label": "Surgery",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.97%",
        "score": "2.97%"
      },
      {
        "id": "ta31",
        "label": "Urology",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1.78%",
        "score": "1.78%"
      },
      {
        "id": "ta32",
        "label": "Women's Health",
        "hs": true,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "2.55%",
        "score": "2.55%"
      },
      {
        "id": "ta33",
        "label": "Other",
        "hs": false,
        "sponsor": false,
        "projectNeeds": true,
        "weight": "1%",
        "score": "0%"
      }
    ]
  },

  {
    "id": "g_format",
    "title": "Innovation format interest",
    "isOpen": false,
    "arrowClass": "dropdown-arrow",
    "items": [
      {
        "id": "if1",
        "label": "HCP efficacy",
        "hs": true,
        "sponsor": false,
        "weight": "1.17%",
        "projectNeeds": true,
        "score": "1.17%"
      },
      {
        "id": "if2",
        "label": "Mobile health app",
        "hs": false,
        "sponsor": false,
        "weight": "2%",
        "projectNeeds": true,
        "score": "0%"
      },
      {
        "id": "if3",
        "label": "AI algorithm",
        "hs": true,
        "sponsor": false,
        "weight": "1.71%",
        "projectNeeds": true,
        "score": "1.71%"
      },
      {
        "id": "if4",
        "label": "Wearable device",
        "hs": true,
        "sponsor": true,
        "weight": "1.46%",
        "projectNeeds": true,
        "score": "1.46%"
      },
      {
        "id": "if5",
        "label": "Web application",
        "hs": true,
        "sponsor": false,
        "weight": "1.22%",
        "projectNeeds": true,
        "score": "1.22%"
      },
      {
        "id": "if6",
        "label": "Digital diagnostics",
        "hs": true,
        "sponsor": false,
        "weight": "1.71%",
        "projectNeeds": true,
        "score": "1.71%"
      },
      {
        "id": "if7",
        "label": "Other",
        "hs": true,
        "sponsor": false,
        "weight": "0.73%",
        "projectNeeds": true,
        "score": "0.73%"
      }
    ]
  },

  {
    "id": "g_enduser",
    "title": "Innovation end user focus",
    "isOpen": false,
    "arrowClass": "dropdown-arrow",
    "items": [
      {
        "id": "eu1",
        "label": "Providers",
        "hs": true,
        "sponsor": false,
        "weight": "1.59%",
        "projectNeeds": true,
        "score": "1.59%"
      },
      {
        "id": "eu2",
        "label": "Patients/Consumers",
        "hs": true,
        "sponsor": false,
        "weight": "1.82%",
        "projectNeeds": true,
        "score": "1.82%"
      },
      {
        "id": "eu3",
        "label": "Health Systems",
        "hs": true,
        "sponsor": false,
        "weight": "1.36%",
        "projectNeeds": true,
        "score": "1.36%"
      },
      {
        "id": "eu4",
        "label": "Researchers",
        "hs": true,
        "sponsor": false,
        "weight": "1.14%",
        "projectNeeds": true,
        "score": "1.14%"
      },
      {
        "id": "eu5",
        "label": "Administrators",
        "hs": true,
        "sponsor": false,
        "weight": "0.91%",
        "projectNeeds": true,
        "score": "0.91%"
      },
      {
        "id": "eu6",
        "label": "Payers",
        "hs": true,
        "sponsor": false,
        "weight": "1.14%",
        "projectNeeds": true,
        "score": "1.14%"
      },
      {
        "id": "eu7",
        "label": "Pharrma",
        "hs": false,
        "sponsor": false,
        "weight": "1%",
        "projectNeeds": true,
        "score": "0%"
      },
      {
        "id": "eu8",
        "label": "Other",
        "hs": true,
        "sponsor": false,
        "weight": "1.04%",
        "projectNeeds": true,
        "score": "1.04%"
      }
    ]
  }
];


    // Always return the static groups for any HS with computed aggregate values
    get capabilityGroups() {
        // Return the groups with computed aggregates for each group
        return this.staticCapabilityGroups.map(group => {
            // Count how many items have projectNeeds=true
            const projectNeedsCount = group.items.filter(item => item.projectNeeds).length;
            // Count how many items have hs=true
            const hsCount = group.items.filter(item => item.hs).length;

                    const numericWeight = (val) => parseFloat(val.replace('%', '')) || 0;
        const numericScore = (val) => parseFloat(val.replace('%', '')) || 0;

        // Group Weight = sum of item weights
        const totalWeight = group.items.reduce(
            (sum, item) => sum + numericWeight(item.weight),
            0
        );

        // Group Score = sum of item scores
        const totalScore = group.items.reduce(
            (sum, item) => sum + numericScore(item.score),
            0
        );
            

            // Calculate weight (example: percent based on projectNeeds + hs matches per item)
            const weight = Math.round((projectNeedsCount + hsCount) / group.items.length * 100);
            // Calculate score as percent based on item score totals (assume max 10 per item)
            const sumItemScores = group.items.reduce((s, it) => s + (it.score || 0), 0);
            const maxPossible = group.items.length * 10;
            const scorePercent = maxPossible > 0 ? Math.round((sumItemScores / maxPossible) * 100) : 0;
            
            return {
                ...group,
                projectNeedsCount,
                hsCount,
                weight: totalWeight.toFixed(2) + '%',
            score: totalScore.toFixed(2) + '%'
            };
        });
    }

    // Display groups with background color mapping for Requirements tab
    get displayCapabilityGroups() {
      if (!this.staticCapabilityGroups) return [];
      return this.staticCapabilityGroups.map((g, i) => {
        // use CSS classes instead of inline style strings to avoid template parsing issues
        const className = i === 1 ? 'req-body req-body--blue' : (i === 2 ? 'req-body req-body--yellow' : 'req-body');
        return {
          ...g,
          bodyClass: className
        };
      });
    }

    // Combobox options for milestone selection in Add Activity modal
    get milestoneOptions() {
      return (this.milestoneNames || []).map(m => ({ label: m, value: m }));
    }

    // Messages data per HS and Sponsor
    messagesDataByHS = {
        hs1: {
            hs: [
                { id: 'm1', sender: 'Mayo Clinic', text: 'Hello! We are interested in your clinical trial.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/HS1.png' },
                { id: 'm2', sender: 'You', text: 'Great! Let us discuss the details.', isReceived: false, isSent: true, chatClass: 'chat-list ms-auto mb-3', avatar: '/resource/avatars/admin.png' },
                { id: 'm3', sender: 'Mayo Clinic', text: 'We have strong capabilities in Cardiology.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/HS1.png' },
                { id: 'm4', sender: 'You', text: 'Perfect! That aligns with our study requirements.', isReceived: false, isSent: true, chatClass: 'chat-list ms-auto mb-3', avatar: '/resource/avatars/admin.png' },
                { id: 'm3', sender: 'Mayo Clinic', text: 'Lets discuss this on coming Monday.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/HS1.png' },
            ],
            sponsor: [
                { id: 'sm1', sender: 'Sponsor', text: 'Please review the protocol requirements.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/ODF1.png' },
                { id: 'sm2', sender: 'You', text: 'Understood. Will review and get back.', isReceived: false, isSent: true, chatClass: 'chat-list ms-auto mb-3', avatar: '/resource/avatars/ODF.png' },
                { id: 'sm3', sender: 'Sponsor', text: 'Also, check the updated budget.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/ODF1.png' }
            ]
        },
        hs2: {
            hs: [
                { id: 'm1', sender: 'Cleveland Clinic', text: 'We would like to participate in this study.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/HS2.png' },
                { id: 'm2', sender: 'You', text: 'Excellent! What are your key specialties?', isReceived: false, isSent: true, chatClass: 'chat-list ms-auto mb-3', avatar: '/resource/avatars/ODF.png' }
            ],
            sponsor: [
                { id: 'sm1', sender: 'Sponsor', text: 'Please review the protocol requirements.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/ODF1.png' },
                { id: 'sm2', sender: 'You', text: 'Understood. Will review and get back.', isReceived: false, isSent: true, chatClass: 'chat-list ms-auto mb-3', avatar: '/resource/avatars/ODF.png' }
            ]
        }
    };

    // Returns the activities for the currently selected protocol step (for Protocol Grid)
    get currentProtocolRows() {
        if (!this.selectedProtocolStep) return [];
        return this.protocolData[this.selectedProtocolStep] || [];
    }

    // Returns the messages for the selected HS and tab (for HS Matches & Messaging)
    get currentMessages() {
        const hsId = this.selectedHSId;
        const tab = this.messagingTab === 'Sponsor' ? 'sponsor' : 'hs';
        if (!hsId || !this.messagesDataByHS[hsId]) return [];
        return this.messagesDataByHS[hsId][tab] || [];
    }

    // Returns the legal rows for the currently selected legal step (for Legal Grid)
    get currentLegalRows() {
        if (!this.selectedLegalStep) return [];
        return this.legalData[this.selectedLegalStep] || [];
    }

    handleTabClick(event) {
        try {
            event.preventDefault();
        } catch (e) { /* ignore */ }
        // find the closest element with data-tab attribute
        const el = event.target.closest('[data-tab]');
        if (!el) return;
        const tab = el.dataset.tab;
        if (!tab) return;
        this.currentTab = tab;
        // ensure Legal data is initialized when user navigates to it
        if (tab === 'Legal') {
            if (!this.legalSteps || !this.legalSteps.length) {
                this.legalSteps = ['mNDA', 'LOI', 'ESA', 'MSA'];
            }
            if (!this.selectedLegalStep) {
                this.selectedLegalStep = this.legalSteps[0];
            }
            if (!this.legalData) this.legalData = {};
        }
        // diagnostic log to help debug click
        // eslint-disable-next-line no-console
        console.log('handleTabClick: switching to tab', tab);

        // Toggle active class on tab items
        try {
            const items = this.template.querySelectorAll('.tabs__nav .tabs__item');
            items.forEach((it) => it.classList.remove('active'));
            const clicked = this.template.querySelector(`.tabs__nav [data-tab="${tab}"]`);
            if (clicked) {
                // the data-tab may be on the anchor or li; ensure li gets active
                const li = clicked.closest('.tabs__item');
                if (li) li.classList.add('active');
            }
        } catch (e) {
            // ignore DOM errors
        }

    }

    // Handle Add Contact button click
    handleAddContact() {
        // TODO: Implement add contact modal/functionality
        // eslint-disable-next-line no-console
        console.log('Add Contact clicked');
    }

    // Handle Edit DX Team button click
    handleEditDxTeam() {
        // TODO: Implement edit DX team modal/functionality
        // eslint-disable-next-line no-console
        console.log('Edit DX Team clicked');
    }

    // Handle inline edit for profile fields
    handleInlineEdit(event) {
        const field = event.currentTarget.dataset.field;
        const section = event.currentTarget.dataset.section;
        // TODO: Implement inline edit modal/functionality
        // eslint-disable-next-line no-console
        console.log('Inline edit clicked for field:', field, 'in section:', section);
    }

    // Protocol: select a step to update the right panel
    handleProtocolStepClick(event) {
        const btn = event.target.closest('[data-step]');
        if (!btn) return;
        const stepName = btn.dataset.step;
        if (!stepName) return;
        this.selectedProtocolStep = stepName;
        // update classes on steps array for template binding
        this.protocolSteps = this.protocolSteps.map(s => ({ ...s, className: s.name === stepName ? 'step-item active' : 'step-item' }));
        // scroll the clicked step to the top of the scroll container
        try {
            const el = this.template.querySelector(`[data-step="${stepName}"]`);
            const list = this.template.querySelector('.step-list');
            if (el && list) {
                // prefer scrolling the container so selected item sits at the top
                const offset = el.offsetTop - list.offsetTop;
                list.scrollTo({ top: offset, behavior: 'smooth' });
                this.hasScrolledToSelectedStep = true;
            }
        } catch (e) {
            // fallback: item.scrollIntoView
            const el = this.template.querySelector(`[data-step="${stepName}"]`);
            if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
    }

    // Legal: select an agreement type to update the right panel
    handleLegalStepClick(event) {
        const btn = event.target.closest('[data-legal]');
        if (!btn) return;
        const stepName = btn.dataset.legal;
        if (!stepName) return;
        this.selectedLegalStep = stepName;
        // update classes on legalStepsObjs array for template binding
        this.legalStepsObjs = this.legalStepsObjs.map(s => ({ 
            ...s, 
            className: s.name === stepName ? 'step-item active' : 'step-item' 
        }));
    }

    // Open execute confirmation popup for a specific legal row
    handleExecuteClick(event) {
      // Prefer event.currentTarget (the element with the onclick handler)
      // Fall back to closest button lookup in case the click target is an inner element
      let id = null;
      try {
        const current = event.currentTarget;
        if (current && current.dataset && current.dataset.id) {
          id = current.dataset.id;
        } else if (event.target && event.target.closest) {
          const btn = event.target.closest('button[data-id]');
          if (btn && btn.dataset) id = btn.dataset.id;
        }
      } catch (e) {
        // ignore lookup errors
      }
      // eslint-disable-next-line no-console
      console.log('handleExecuteClick, found id=', id);
      if (!id) return;
      this.selectedExecuteRowId = id;
      this.isExecuteOpen = true;
    }

    // Overlay click for execute modal
    handleExecuteOverlayClick(event) {
      if (event.target.classList && event.target.classList.contains('modal-overlay')) {
        this.closeExecutePopup();
      }
    }

    closeExecutePopup() {
      this.isExecuteOpen = false;
      this.selectedExecuteRowId = null;
    }

    confirmExecute() {
      if (!this.selectedExecuteRowId) {
        this.closeExecutePopup();
        return;
      }
      // Find the row in the currently selected legal step and update status
      const rows = this.legalData[this.selectedLegalStep] || [];
      const idx = rows.findIndex(r => r.id === this.selectedExecuteRowId);
      if (idx >= 0) {
        rows[idx] = { ...rows[idx], status: 'Executed' };
        // force reactivity
        this.legalData = { ...this.legalData };
      }
        this.closeExecutePopup();
    }

      // Legal: edit a legal row — open the Add/Edit modal and populate fields
      handleLegalEdit(event) {
        // Prefer event.currentTarget (element with onclick) but fall back to closest lookup
        let id = null;
        try {
          const current = event.currentTarget;
          if (current && current.dataset && current.dataset.id) {
            id = current.dataset.id;
          } else if (event.target && event.target.closest) {
            const btn = event.target.closest('[data-id]');
            if (btn && btn.dataset) id = btn.dataset.id;
          }
        } catch (e) {
          // ignore lookup errors
        }
        // eslint-disable-next-line no-console
        console.log('Legal Edit clicked for id=', id);
        if (!id || !this.selectedLegalStep) {
          return;
        }
        const rows = this.legalData[this.selectedLegalStep] || [];
        const row = rows.find(r => r.id === id);
        if (!row) return;
        this.legalEditingRowId = id;
        this.legalFormAgreementType = row.agreementType || this.selectedLegalStep;
        this.legalFormVersion = row.version || '';
        this.legalFormInitiatedBy = row.initiatedBy || '';
        this.legalFormHs = row.hsName || '';
        this.legalFormSponsor = row.sponsorName || '';
        this.legalFormDx = row.dxName || '';
        this.legalFormDueDate = row.dueDate || '';
        this.legalFormDocName = row.projectScopingDoc || '';
        const hasValidStatus = this.legalStatusOptions.some(option => option.value === row.status);
        this.legalFormStatus = hasValidStatus ? row.status : 'In Process';
        this.isLegalAddModalOpen = true;
      }

      // Legal: handle delete for a legal row
      handleLegalDelete(event) {
        const id = event.currentTarget?.dataset?.id;
        if (!id || !this.selectedLegalStep) return;
        if (!confirm('Are you sure you want to delete this row?')) return;
        const rows = this.legalData[this.selectedLegalStep] || [];
        this.legalData[this.selectedLegalStep] = rows.filter(r => r.id !== id);
        // force reactivity
        this.legalData = { ...this.legalData };
      }

    // Messaging: Initialize contacts and messages
    initializeMessagingData() {
      this.messagingContacts = [
        // Sponsors
        { id: 'c1', name: 'Mark Smith', avatar: '/resource/avatars/ODF.png', type: 'sponsors', active: false, unread: 0, itemClass: 'messaging-contact-item' },
        { id: 'c2', name: 'Eugene Sikora', avatar: '/resource/avatars/ODF1.png', type: 'sponsors', active: false, unread: 5, itemClass: 'messaging-contact-item' },
        { id: 'c3', name: 'Robert Fassett', avatar: '/resource/avatars/ODF2.png', type: 'sponsors', active: false, unread: 5, itemClass: 'messaging-contact-item' },
        { id: 'c4', name: 'Andrew Fletcher', avatar: '/resource/avatars/sponsor-acme.svg', type: 'sponsors', active: false, unread: 0, itemClass: 'messaging-contact-item' },
        { id: 'c5', name: 'Tyron Derby', avatar: '/resource/avatars/sponsor-novo.svg', type: 'sponsors', active: false, unread: 0, itemClass: 'messaging-contact-item' },
        { id: 'c11', name: 'BioGenix', avatar: '/resource/avatars/sponsor-biogenix.svg', type: 'sponsors', active: false, unread: 2, itemClass: 'messaging-contact-item' },

        // Health Systems
        { id: 'c6', name: 'Mayo Clinic', avatar: '/resource/avatars/HS1.png', type: 'healthSystems', active: false, unread: 0, itemClass: 'messaging-contact-item' },
        { id: 'c7', name: 'Cleveland Clinic', avatar: '/resource/avatars/HS2.png', type: 'healthSystems', active: false, unread: 2, itemClass: 'messaging-contact-item' },
        { id: 'c8', name: 'Johns Hopkins', avatar: '/resource/avatars/HS3.png', type: 'healthSystems', active: false, unread: 0, itemClass: 'messaging-contact-item' },
        { id: 'c9', name: 'Mass General', avatar: '/resource/avatars/HS4.png', type: 'healthSystems', active: false, unread: 3, itemClass: 'messaging-contact-item' },
        { id: 'c10', name: 'UCLA Medical', avatar: '/resource/avatars/HS5.png', type: 'healthSystems', active: false, unread: 0, itemClass: 'messaging-contact-item' },
        { id: 'c12', name: 'Stanford Health', avatar: '/resource/avatars/HS-stanford.svg', type: 'healthSystems', active: false, unread: 1, itemClass: 'messaging-contact-item' }
      ];
        // Set first sponsor contact as selected (match the messaging tab key 'sponsors')
        const firstContact = this.messagingContacts.find(c => c.type === 'sponsors');
        if (firstContact) {
            firstContact.active = true;
            firstContact.itemClass = 'messaging-contact-item active';
            this.selectedContact = firstContact;
            this.loadMessagesForContact(firstContact.id);
        }
    }

    loadMessagesForContact(contactId) {
      // Ensure we use the contact's avatar for received messages and the admin avatar for sent messages
      const contact = this.messagingContacts.find(c => c.id === contactId) || this.selectedContact;
      const contactAvatar = contact ? contact.avatar : '/resource/avatars/HS1.png';
      const adminAvatar = '/resource/avatars/admin.png';
      // Sample messages for demo
      this.messagingMessages = [
        { id: 'm1', sender: contact ? contact.name : 'Contact', text: 'Hey! Did you check out the new logo design?', isReceived: true, isSent: false, avatar: contactAvatar },
        { id: 'm2', sender: 'You', text: 'Not yet. Can you send it here?', isReceived: false, isSent: true, avatar: adminAvatar },
        { id: 'm3', sender: contact ? contact.name : 'Contact', text: 'Sure! Please check the below logo Attached!!!', isReceived: true, isSent: false, avatar: contactAvatar },
        { id: 'm4', sender: 'You', text: 'Looks clean! I like the font. Maybe try a slightly darker blue?', isReceived: false, isSent: true, avatar: adminAvatar },
        { id: 'm5', sender: contact ? contact.name : 'Contact', text: 'Perfect! That layout will work great on the landing page. 👍', isReceived: true, isSent: false, avatar: contactAvatar },
        { id: 'm6', sender: 'You', text: 'Perfect It looks Great!!!', isReceived: false, isSent: true, avatar: adminAvatar }
      ];
    }

    // Messaging: switch between Sponsors and Health Systems
    handleMessagingTabClick(event) {
        const tab = event.target.dataset.tab;
        if (!tab) return;
        this.messagingActiveTab = tab;
    }

    // Messaging: computed list of visible contacts
    get visibleMessagingContacts() {
        return this.messagingContacts.filter(c => c.type === this.messagingActiveTab);
    }

    // Dynamic counts for tabs
    get sponsorsCount() {
      return this.messagingContacts.filter(c => c.type === 'sponsors').length;
    }

    get healthSystemsCount() {
      return this.messagingContacts.filter(c => c.type === 'healthSystems').length;
    }

    get sponsorsTabClass() {
        return this.messagingActiveTab === 'sponsors' ? 'btn btn-primary btn-sm' : 'btn btn-outline-primary btn-sm';
    }

    get healthSystemsTabClass() {
        return this.messagingActiveTab === 'healthSystems' ? 'btn btn-primary btn-sm' : 'btn btn-outline-primary btn-sm';
    }

    // Messaging: select contact
    handleMessagingContactClick(event) {
        const contactId = event.currentTarget.dataset.id;
        if (!contactId) return;
        // Update active state and itemClass
        this.messagingContacts = this.messagingContacts.map(c => ({
            ...c,
            active: c.id === contactId,
            itemClass: c.id === contactId ? 'messaging-contact-item active' : 'messaging-contact-item'
        }));
        const contact = this.messagingContacts.find(c => c.id === contactId);
        if (contact) {
            this.selectedContact = contact;
            this.loadMessagesForContact(contactId);
        }
    }

    // Messaging: input change
    handleMessagingInputChange(event) {
        this.messagingInput = event.target.value;
    }

    // Messaging: send message
    sendMessagingMessage() {
        if (!this.messagingInput || !this.messagingInput.trim()) return;
        const newMsg = {
            id: 'msg_' + Date.now(),
            sender: 'You',
            text: this.messagingInput.trim(),
            isReceived: false,
            isSent: true,
        avatar: '/resource/avatars/admin.png'
        };
        this.messagingMessages = [...this.messagingMessages, newMsg];
        this.messagingInput = '';
    }    // HS Matches: select an HS to update the capability grid and chat
    handleHSSelect(event) {
        const item = event.target.closest('[data-id]');
        if (!item) return;
        const hsId = item.dataset.id;
        if (!hsId) return;
        
        // Update selected HS
        this.selectedHSId = hsId;
        const selectedHS = this.hsMatches.find(hs => hs.id === hsId);
        if (selectedHS) {
            this.selectedHSName = selectedHS.name;
        }
        
        // Update active class on HS items
        this.hsMatches = this.hsMatches.map(hs => ({
            ...hs,
            itemClass: hs.id === hsId 
                ? 'd-flex justify-content-between align-items-center mb-3 hs-match-item active'
                : 'd-flex justify-content-between align-items-center mb-3 hs-match-item'
        }));
    }

    // Toggle capability group open/closed
    toggleDropdown(event) {
        const btn = event.target.closest('[data-id]');
        if (!btn) return;
        const groupId = btn.dataset.id;
        if (!groupId) return;
        
        // Toggle the isOpen state for the clicked group
        this.staticCapabilityGroups = this.staticCapabilityGroups.map(g => {
            if (g.id === groupId) {
                return { ...g, isOpen: !g.isOpen };
            }
            return g;
        });
    }

    // Messaging: handle message input
    handleMessageInput(event) {
        this.messageInput = event.target.value;
    }

    // Messaging: send message
    sendMessage() {
        if (!this.messageInput || !this.messageInput.trim()) return;
        
        const hsId = this.selectedHSId;
        const tab = this.messagingTab === 'Sponsor' ? 'sponsor' : 'hs';
        
        if (!this.messagesDataByHS[hsId]) return;
        
        // Add new message to the appropriate array
        const newMessage = {
          id: 'm' + Date.now(),
          sender: 'You',
          text: this.messageInput.trim(),
          isReceived: false,
          isSent: true,
          chatClass: 'chat-list ms-auto mb-3',
          avatar: '/resource/avatars/admin.png'
        };
        
        this.messagesDataByHS[hsId][tab].push(newMessage);
        // Force reactivity
        this.messagesDataByHS = { ...this.messagesDataByHS };
        
        // Clear input
        this.messageInput = '';
    }

      handleEstimationStepClick(event) {
        const btn = event.target.closest('[data-estimation]');
        if (!btn) return;
        const sectionId = btn.dataset.estimation;
        if (!sectionId) return;
        this.selectedEstimationSectionId = sectionId;
        this.estimationSteps = this.estimationSteps.map(step => ({
          ...step,
          className: step.id === sectionId ? 'step-item active' : 'step-item'
        }));
      }

      // Estimation: action placeholders
      handleEstimationAdd(event) {
        const sectionId = event.currentTarget?.dataset?.section;
        // eslint-disable-next-line no-console
        console.log('Estimation Add clicked for section', sectionId);
      }

      handleEstimationEdit(event) {
        const sectionId = event.currentTarget?.dataset?.section;
        const rowId = event.currentTarget?.dataset?.rowId;
        // eslint-disable-next-line no-console
        console.log('Estimation Edit', sectionId, rowId);
      }

      handleEstimationDelete(event) {
        const sectionId = event.currentTarget?.dataset?.section;
        const rowId = event.currentTarget?.dataset?.rowId;
        // eslint-disable-next-line no-console
        console.log('Estimation Delete', sectionId, rowId);
      }

    // Protocol Activity: handle checkbox change
    handleActivityCheckboxChange(event) {
        const activityId = event.target.dataset.activityId;
        const checked = event.target.checked;
        
        if (!this.selectedProtocolStep || !activityId) return;
        
        // Update the checked state for this activity
        const activities = this.protocolData[this.selectedProtocolStep] || [];
        this.protocolData[this.selectedProtocolStep] = activities.map(act => {
            if (act.id === activityId) {
                return { ...act, checked: checked };
            }
            return act;
        });
        
        // Force reactivity
        this.protocolData = { ...this.protocolData };
    }

    // Protocol Activity: open add activity modal
    openAddActivityPopup() {
        this.isAddActivityOpen = true;
        this.addFormMilestone = this.selectedProtocolStep || this.milestoneNames[0];
        this.addFormDescription = '';
    }

    // Protocol Activity: close add activity modal
    closeAddActivityPopup() {
        this.isAddActivityOpen = false;
        this.addFormMilestone = '';
        this.addFormDescription = '';
    }

    // Protocol Activity: handle milestone change in add form
    handleAddFormMilestoneChange(event) {
      // lightning-combobox emits value in event.detail.value; fallback to target.value
      const val = event && event.detail && event.detail.value !== undefined ? event.detail.value : (event.target && event.target.value);
      this.addFormMilestone = val;
    }

    // Protocol Activity: handle description change in add form
    handleAddFormDescriptionChange(event) {
      // lightning-textarea emits value in event.detail.value; fallback to target.value
      const val = event && event.detail && event.detail.value !== undefined ? event.detail.value : (event.target && event.target.value);
      this.addFormDescription = val;
    }

    // Protocol Activity: save new activity
    saveAddActivity() {
        if (!this.addFormDescription || !this.addFormDescription.trim()) {
            alert('Please enter a description');
            return;
        }
        
        const milestone = this.addFormMilestone;
        if (!milestone) return;
        
        // Create new activity
        const newActivity = {
            id: 'custom_' + Date.now(),
            activity: this.addFormDescription.trim(),
            checked: false,
            section: 'Custom',
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        // Add to protocol data
        if (!this.protocolData[milestone]) {
            this.protocolData[milestone] = [];
        }
        this.protocolData[milestone].push(newActivity);
        
        // Force reactivity
        this.protocolData = { ...this.protocolData };
        
        // Close modal
        this.closeAddActivityPopup();
    }

    // Protocol Activity: handle edit
    handleEdit(event) {
        const activityId = event.currentTarget.dataset.id;
        // TODO: Implement edit functionality
        console.log('Edit activity:', activityId);
    }

    // Protocol Activity: handle delete
    handleDelete(event) {
        const activityId = event.currentTarget.dataset.id;
        
        if (!this.selectedProtocolStep || !activityId) return;
        
        if (!confirm('Are you sure you want to delete this activity?')) return;
        
        // Remove the activity
        const activities = this.protocolData[this.selectedProtocolStep] || [];
        this.protocolData[this.selectedProtocolStep] = activities.filter(act => act.id !== activityId);
        
        // Force reactivity
        this.protocolData = { ...this.protocolData };
    }

    // Modal: handle overlay click to close
    handleModalOverlayClick(event) {
        // Only close if clicking directly on overlay (not on modal content)
        if (event.target.classList.contains('modal-overlay')) {
            this.closeAddActivityPopup();
        }
    }

    // Modal: stop propagation to prevent overlay click
    stopPropagation(event) {
        event.stopPropagation();
    }

    renderedCallback() {
        // when the Protocol tab is first rendered (or when protocolSteps change),
        // ensure the selected milestone is scrolled to the top of the list
        if (this.isProtocol) {
          // Only perform the auto-scroll once, but do NOT return early from
          // renderedCallback — we still need the rest of the post-render
          // behaviour (e.g. applying progress widths) to run on subsequent
          // renders when the tab is re-activated.
          if (!this.hasScrolledToSelectedStep) {
            try {
              const stepName = this.selectedProtocolStep;
              if (stepName) {
                const el = this.template.querySelector(`[data-step="${stepName}"]`);
                const list = this.template.querySelector('.step-list');
                if (el && list) {
                  const offset = el.offsetTop - list.offsetTop;
                  list.scrollTo({ top: offset, behavior: 'auto' });
                  this.hasScrolledToSelectedStep = true;
                }
              }
            } catch (e) {
              // ignore errors silently
            }
          }
        }

        // Diagnostic: log when Legal panel is present in DOM
        if (this.isLegal) {
            // eslint-disable-next-line no-console
            console.log('renderedCallback: Legal panel rendered, selectedLegalStep=', this.selectedLegalStep);
        }

        // Attach scroll listeners to HS Matches and Chat panels so we can show
        // the scrollbar while the user is actively scrolling (CSS alone cannot
        // detect 'is-scrolling'). We add a temporary 'scrolling' class on scroll
        // and remove it shortly after scrolling stops.
        try {
            if (!this._scrollListenersAttached) {
                this._scrollCleanupTimers = new Map();
                this._scrollHandlers = [];

                const attachFor = (selector) => {
                    const el = this.template.querySelector(selector);
                    if (!el) return;
                    const onScroll = () => {
                        el.classList.add('scrolling');
                        // clear previously scheduled removal
                        const t = this._scrollCleanupTimers.get(el);
                        if (t) clearTimeout(t);
                        // remove 'scrolling' after 600ms of inactivity
                        const timeoutId = setTimeout(() => {
                            el.classList.remove('scrolling');
                            this._scrollCleanupTimers.delete(el);
                        }, 600);
                        this._scrollCleanupTimers.set(el, timeoutId);
                    };
                    el.addEventListener('scroll', onScroll, { passive: true });
                    this._scrollHandlers.push({ el, onScroll });
                };

                // attach to both panels if present
                attachFor('.hs-panel-body');
                attachFor('.chat-body');

                this._scrollListenersAttached = true;
            }
        } catch (e) {
            // ignore errors from DOM access
            // eslint-disable-next-line no-console
            console.warn('projectDetail: failed to attach scroll listeners', e);
        }

            // Apply progress widths from data attributes for each rendered row
            try {
              const innerBars = this.template.querySelectorAll('.progress-bar-inner');
              innerBars.forEach((el) => {
                const p = el.getAttribute('data-progress') || '0%';
                el.style.width = p;
                // ensure gradient and height set via CSS class
              });
            } catch (e) {
              // ignore DOM setting errors
            }
    }

    disconnectedCallback() {
        // Clean up scroll listeners and timers
        try {
            if (this._scrollHandlers && this._scrollHandlers.length) {
                this._scrollHandlers.forEach(({ el, onScroll }) => {
                    try { el.removeEventListener('scroll', onScroll); } catch (e) { /* ignore */ }
                });
                this._scrollHandlers = [];
            }
            if (this._scrollCleanupTimers) {
                this._scrollCleanupTimers.forEach((t) => clearTimeout(t));
                this._scrollCleanupTimers.clear();
            }
        } catch (e) {
            // ignore cleanup errors
        }
        this._scrollListenersAttached = false;
    }

    connectedCallback() {
        // initialize steps with progress percentages
        const defaultMilestone = this.milestoneNames[0];
        // Assign random progress percentages to each milestone (20-100)
        this.protocolSteps = this.milestoneNames.map((name) => ({
            name,
            className: name === defaultMilestone ? 'step-item active' : 'step-item',
            progress: Math.floor(Math.random() * 81) + 20 // 20-100%
        }));
        this.selectedProtocolStep = defaultMilestone;
        // initialize add form milestone to the selected one
        this.addFormMilestone = this.selectedProtocolStep;
        // Build protocolData from milestoneActivities
        this.protocolData = {};
        this.milestoneNames.forEach((name) => {
            const activities = this.milestoneActivities[name] || [];
            // simple date pool for dummy last-updated values
            const datePool = ['2025-11-12','2025-11-05','2025-10-28','2025-09-15','2025-08-30'];
            this.protocolData[name] = activities.map((act, i) => {
              const planDate = datePool[i % datePool.length];
              const actualDate = datePool[(i + 1) % datePool.length];
              const planFinish = '2025-12-31';
              const actualFinish = (i % 7 === 0) ? '2026-01-15' : '';
              const eta = 'Q1 2026';
              const progressPct = Math.max(0, Math.min(100, Math.floor(Math.random() * 90) + 5));
              // If actualFinish has a value we consider the activity complete => 100%
              const progress = actualFinish ? '100%' : (progressPct + '%');
              const progressStyle = `width: ${progress}; background: linear-gradient(90deg,#2e7ce4,#2e9be4); height: 10px;`;
              return {
                id: act.id,
                activity: act.text,
                // pre-check every 5th activity to have some checked boxes
                checked: act.checked || (i % 5 === 0),
                section: act.section,
                lastUpdated: datePool[(i + name.length) % datePool.length],
                planDate,
                actualDate,
                planFinish,
                actualFinish,
                eta,
                progress,
                progressStyle
              };
            });
        });

        // Initialize HS Matches state
        this.selectedHSId = 'hs1';
        this.selectedHSName = 'Mayo Clinic';

        // Initialize Messaging tab contacts
        this.initializeMessagingData();

        // Initialize Legal tab - Agreement Types with data
        const agreementTypes = ['mNDA', 'LOI', 'ESA', 'MSA'];
        this.selectedLegalStep = agreementTypes[0];
        
        // Create step objects with className for template binding
        this.legalStepsObjs = agreementTypes.map(name => ({
            name: name,
            className: name === this.selectedLegalStep ? 'step-item active' : 'step-item'
        }));
        
        // Use the same static data for all agreement types
        // Build richer legal rows including HS, Sponsor and DX avatars and names
        const staticLegalRows = [
          {
            id: 'row1',
            version: 'v1.0',
            status: 'Completed',
            initiatedBy: 'Legal Team',
            hsName: this.hsMatches && this.hsMatches[0] ? this.hsMatches[0].name : 'HS Name',
            hsAvatar: this.hsMatches && this.hsMatches[0] ? this.hsMatches[0].avatar : '/resource/avatars/HS1.png',
            sponsorName: 'Pharma Inc',
            sponsorAvatar: '/resource/avatars/ODF.png',
            dxName: 'datosX',
            dxAvatar: '/resource/avatars/1.svg.jpg',
            dueDate: '2025-11-10'
          },
          {
            id: 'row2',
            version: 'v1.1',
            status: 'Pending',
            initiatedBy: 'Sponsor Review',
            hsName: this.hsMatches && this.hsMatches[1] ? this.hsMatches[1].name : 'HS Name',
            hsAvatar: this.hsMatches && this.hsMatches[1] ? this.hsMatches[1].avatar : '/resource/avatars/HS2.png',
            sponsorName: 'BioCorp',
            sponsorAvatar: '/resource/avatars/ODF1.png',
            dxName: 'Project Ops',
            dxAvatar: '/resource/avatars/2.svg.jpg',
            dueDate: '2025-11-15'
          },
          {
            id: 'row3',
            version: 'v2.0',
            status: 'Pending',
            initiatedBy: 'Counterparty',
            hsName: this.hsMatches && this.hsMatches[2] ? this.hsMatches[2].name : 'HS Name',
            hsAvatar: this.hsMatches && this.hsMatches[2] ? this.hsMatches[2].avatar : '/resource/avatars/HS3.png',
            sponsorName: 'Global Pharma',
            sponsorAvatar: '/resource/avatars/ODF2.png',
            dxName: 'Project Lead',
            dxAvatar: '/resource/avatars/3.svg.jpg',
            dueDate: '2025-11-17'
          }
        ];
        this.legalData = {};
        agreementTypes.forEach((agreementType) => {
          // clone the rows per agreementType to avoid shared references
          this.legalData[agreementType] = staticLegalRows.map(r => ({ ...r }));
        });

        // Initialize Estimation steps panel
        this.initializeEstimationSteps();
        
        // Initialize Notes tab data
        this.initializeNotesData();
    }

      initializeEstimationSteps() {
        const steps = this.buildEstimationNavSteps();
        if (!steps.length) {
          this.estimationSteps = [];
          this.selectedEstimationSectionId = '';
          return;
        }
        const defaultId = steps[0].id;
        this.estimationSteps = steps.map((step) => ({
          ...step,
          className: step.id === defaultId ? 'step-item active' : 'step-item'
        }));
        this.selectedEstimationSectionId = defaultId;
      }

      buildEstimationNavSteps() {
        const sections = this.estimationSections;
        const steps = sections.map((section) => ({
          id: section.id,
          title: section.title,
          costUnadjusted: section?.subtotal?.costUnadjusted || '—',
          totalCost: section?.subtotal?.totalCost || '—',
          type: 'section'
        }));
        const invoice = this.estimationInvoice;
        const grand = this.estimationGrandTotal;
        if (invoice.title || (invoice.rows && invoice.rows.length)) {
          steps.push({
            id: this.invoiceStepId,
            title: invoice.title || 'Invoice Schedule',
            costUnadjusted: grand.costUnadjusted || '—',
            totalCost: grand.totalCost || '—',
            type: 'invoice'
          });
        }
        return steps;
      }


    // Calculate overall progress percentage across all milestones
    get overallProgress() {
        if (!this.protocolSteps || this.protocolSteps.length === 0) return 0;
        // Example: average progress across all protocol steps
        const total = this.protocolSteps.reduce((sum, step) => sum + (step.progress || 0), 0);
        return Math.round(total / this.protocolSteps.length);
    }

    get estimationHeaderFields() {
      const header = this.estimationSummary && this.estimationSummary.header ? this.estimationSummary.header : [];
      return header.map(item => {
        let dynamicValue = item.value || '';
        if (item.field && this.project && this.project[item.field]) {
          dynamicValue = this.project[item.field];
        }
        return {
          label: item.label,
          value: dynamicValue || '—'
        };
      });
    }

    get estimationSections() {
      return this.estimationSummary && this.estimationSummary.sections ? this.estimationSummary.sections : [];
    }

    get currentEstimationSection() {
      if (this.isInvoiceScheduleSelected) {
        return null;
      }
      const sections = this.estimationSections;
      if (!sections.length) {
        return null;
      }
      return sections.find(section => section.id === this.selectedEstimationSectionId) || sections[0];
    }

    get isInvoiceScheduleSelected() {
      return this.selectedEstimationSectionId === this.invoiceStepId;
    }

    get currentEstimationRows() {
      const section = this.currentEstimationSection;
      return section && section.rows ? section.rows : [];
    }

    get currentEstimationSubtotal() {
      const section = this.currentEstimationSection;
      if (!section || !section.subtotal) {
        return { costUnadjusted: '', totalCost: '' };
      }
      return section.subtotal;
    }

    get estimationGrandTotal() {
      if (this.estimationSummary && this.estimationSummary.grandTotal) {
        return this.estimationSummary.grandTotal;
      }
      return { costUnadjusted: '', totalCost: '' };
    }

    get estimationNote() {
      return this.estimationSummary && this.estimationSummary.note ? this.estimationSummary.note : '';
    }

    get estimationInvoice() {
      const invoice = this.estimationSummary && this.estimationSummary.invoice ? this.estimationSummary.invoice : {};
      return {
        title: invoice.title || '',
        rows: invoice.rows || [],
        footnotes: invoice.footnotes || []
      };
    }

    get totalProjectNeeds(){
        return this.staticCapabilityGroups.reduce((sum, group) => {
            return sum + group.items.filter(item => item.projectNeeds).length;
        }, 0);
    }

    get totalHS() {
        return this.staticCapabilityGroups.reduce((sum, group) => {
            return sum + group.items.filter(item => item.hs).length;
        }, 0);
    }

    // Aggregate total weight percent across all capability items
    get totalWeightPercent() {
      if (!this.staticCapabilityGroups || this.staticCapabilityGroups.length === 0) return '0%';
      let sum = 0;
      this.staticCapabilityGroups.forEach(group => {
        (group.items || []).forEach(item => {
          const raw = String(item.weight || '0').replace('%', '');
          const v = parseFloat(raw) || 0;
          sum += v;
        });
      });
      return sum.toFixed(2) + '%';
    }

    // Aggregate total score percent across all capability items
    get totalScorePercent() {
      if (!this.staticCapabilityGroups || this.staticCapabilityGroups.length === 0) return '0%';
      let sum = 0;
      this.staticCapabilityGroups.forEach(group => {
        (group.items || []).forEach(item => {
          const raw = String(item.score || '0').replace('%', '');
          const v = parseFloat(raw) || 0;
          sum += v;
        });
      });
      return sum.toFixed(2) + '%';
    }



    // Tooltip data for Trial Preparation table
    trialPrepTooltips = {
        column1: [
            'Align with Sponsor on study objectives, timelines, and KPIs.',
            'Develop Study Execution Plan and tracking tools (weekly reports, dashboards).',
            'Finalize datosX and HS research team roles/responsibilities.',
            'Confirm with Operations all contracts (Sponsor CTA, HS MSA, vendor agreements) are executed.',
            'Conduct Internal Kick-off Meeting (datosX Ops, Trial Lead, Leadership).',
            'Conduct Trial Kick-off Meeting (Sponsor + HS).',
            'Schedule IRB / Trial Preparation Meeting Series.',
            'Collaborate with HS to prepare and submit IRB application.',
            'Ensure all required IRB documents are finalized (protocol, ICF, CRF, recruitment materials, PI CV, etc.).',
            'Track IRB review process and coordinate modification responses.',
            'Additional coordination activities as needed.'
        ],
        column2: [
            'Set up data collection workflow and finalize EDC setup.',
            'Validate CRF versions (paper/electronic) and confirm regulatory compliance (HIPAA, 21 CFR Part 11).',
            'Provide or arrange EDC system training for HS research team.',
            'Develop Data Monitoring and Source Data Verification (SDV) Plans.',
            'Define data entry timelines, query process, and AE/SAE tracking procedures.',
            'Define SDV visit schedule and data points for verification.',
            'Finalize Data Analysis Plan (responsible party, interim/final analyses, anonymization process).',
            'Develop Patient Screening and Recruitment Plan.',
            'Review and approve recruitment materials before IRB submission.',
            'Support HS in outreach coordination and community engagement.',
            'Define participant visit schedule and site logistics.',
            'Confirm required supplies, equipment, and tools for site readiness.',
            'Create and circulate Site Readiness Checklist.',
            'Complete pre-study documentation and verification.'
        ],
        column3: [
            'Conduct site readiness visit(s) and finalize Site Readiness Checklist.',
            'Organize and/or deliver site training sessions (virtual/on-site).',
            'Verify recruitment materials and equipment are on-site and properly placed.',
            'Confirm IRB approval receipt.',
            'Re-confirm all agreements (Sponsor, HS, datosX, vendors) are executed.',
            'Confirm ClinicalTrials.gov registration completion.',
            'Finalize Go/No-Go decision with Sponsor and HS.',
            'Confirm official FPFV date.',
            'Final readiness verification.'
        ]
    };

    // Tooltip data for Trial Execution table
    trialExecutionTooltips = {
        column1: [
            'Provide weekly Sponsor updates on enrolment, site status, milestones.',
            'Identify and address recruitment or operational challenges promptly.',
            'Support HS research teams with issue resolution and data-entry troubleshooting.',
            'Maintain cross-functional coordination with Sponsor, HS, and datosX teams.',
            'Track meeting action items and ensure follow-up completion.'
        ],
        column2: [
            'Conduct ongoing remote EDC data review for completeness and consistency.',
            'Monitor AE/SAE reporting and protocol deviations.',
            'Generate and track data queries; ensure timely resolution.',
            'Develop and document a Source Data Verification (SDV) plan prior to on-site visits.',
            'Conduct on-site SDV visits as planned (initial, mid-study, closeout).',
            'Verify informed consent documentation and patient eligibility.',
            'Identify and correct data discrepancies.',
            'Provide corrective feedback to site teams.',
            'Produce Data Quality Reports summarizing trends and findings.',
            'Ensure corrective actions are implemented and documented.',
            'Coordinate final SDV completion and data lock with HS and Sponsor.',
            'Support Sponsor\'s data team in final analysis preparation.'
        ]
    };

    // Tooltip data for Trial Close table
    trialCloseTooltips = {
        column1: [
            'Coordinate with data vendor/biostatistics team for analysis as per plan.',
            'Review preliminary findings; ensure clarity and consistency.',
            'Resolve any post-lock data issues with Sponsor and vendor.',
            'Organize and lead Final Readout Meeting with Sponsor.',
            'Align stakeholders on interpretation of results and key lessons.',
            'Document learnings for internal review.',
            'Support manuscript coordination (if applicable).',
            'Compile data summaries, study documents, and regulatory materials.',
            'Ensure secure long-term archiving of all study data, reports, and documents.',
            'Confirm data retention compliance (5–15 years, as required).',
            'Conduct internal study debrief with datosX teams.',
            'Deliver final closeout report to Sponsor.'
        ]
    };

    tableConfig = [
        {
            label: 'Trial Preparation',
            prefix: 'TR',
            columns: 3,
            rows: 14, // Maximum rows based on column2 which has 14 items
            className: 'custom-trial-prep',
            headers: ['3–6 Months Before FPFV', '2–3 Months Before FPFV', '1 Month Before FPFV'],
            hasTooltips: true
        },
        {
            label: 'Trial Execution',
            prefix: 'TE',
            columns: 2,
            rows: 12, // Maximum rows based on column2 which has 12 items
            className: 'custom-trial-exec',
            headers: ['Project Oversight & Management', 'Data Monitoring & SDV'],
            hasTooltips: true
        },
        {
            label: 'Trial Close',
            prefix: 'TC',
            columns: 1,
            rows: 12,
            className: 'custom-trial-close',
            headers: ['Activities'],
            hasTooltips: true
        }
    ];

    get generatedTables() {
        // Helper function to get random status
        const getRandomStatus = () => {
            const statuses = ['complete', 'progress', 'pending'];
            const weights = [0.4, 0.3, 0.3]; // 40% complete, 30% in progress, 30% pending
            const random = Math.random();
            let cumulative = 0;
            for (let i = 0; i < statuses.length; i++) {
                cumulative += weights[i];
                if (random < cumulative) return statuses[i];
            }
            return 'pending';
        };

        // Status text mapping
        const statusTextMap = {
            complete: 'Completed',
            progress: 'In Progress',
            pending: 'Pending'
        };

        return this.tableConfig.map((table, tableIndex) => {
            const data = [];
            let counter = 100001;

            // Define column-specific row counts based on table type
            let columnRowCounts;
            let tooltipSource;
            
            if (table.label === 'Trial Preparation') {
                columnRowCounts = [11, 14, 9];
                tooltipSource = this.trialPrepTooltips;
            } else if (table.label === 'Trial Execution') {
                columnRowCounts = [5, 12];
                tooltipSource = this.trialExecutionTooltips;
            } else if (table.label === 'Trial Close') {
                columnRowCounts = [12];
                tooltipSource = this.trialCloseTooltips;
            } else {
                columnRowCounts = Array(table.columns).fill(table.rows);
                tooltipSource = null;
            }

            const maxRows = Math.max(...columnRowCounts);

            // Create column arrays to store cells for each column
            const columns = [];
            for (let c = 0; c < table.columns; c++) {
                const rowCount = columnRowCounts[c];
                const columnCells = [];
                for (let r = 0; r < rowCount; r++) {
                    const cellValue = `${table.prefix}-${counter++}`;
                    const tooltip = (table.hasTooltips && tooltipSource) 
                        ? tooltipSource[`column${c + 1}`][r] || ''
                        : '';
                    
                    const status = getRandomStatus();
                    
                    columnCells.push({
                        value: cellValue,
                        tooltip: tooltip,
                        hasData: true,
                        cellKey: `${table.prefix}-${c}-${r}`,
                        // Card-based properties
                        cardClass: `custom-card custom-card-${status}`,
                        statusCircleClass: `status-circle status-circle-${status}`,
                        statusBadgeClass: `status-badge status-badge-${status}`,
                        statusText: statusTextMap[status],
                        isComplete: status === 'complete'
                    });
                }
                columns.push(columnCells);
            }

            // Convert columns to row format for template (grid-based layout)
            for (let r = 0; r < maxRows; r++) {
                const rowCells = [];
                for (let c = 0; c < table.columns; c++) {
                    if (r < columns[c].length) {
                        rowCells.push(columns[c][r]);
                    } else {
                        // Push a hidden cell placeholder
                        rowCells.push({ 
                            value: `empty-${c}-${r}`, 
                            tooltip: '', 
                            hasData: false,
                            cellKey: `${table.prefix}-empty-${c}-${r}`,
                            cardClass: 'card-placeholder',
                            statusCircleClass: '',
                            statusText: '',
                            isComplete: false
                        });
                    }
                }
                
                // Only add row if at least one cell has data
                if (rowCells.some(cell => cell.hasData)) {
                    data.push({
                        rowKey: `${table.prefix}-row-${r}`,
                        cells: rowCells
                    });
                }
            }

            // Generate grid class based on column count
            const gridClassName = `custom-cards-grid-${table.columns}`;

            return {
                ...table,
                data,
                key: tableIndex,
                gridClassName
            };
        });
    }

    // Notes tab initialization and methods
    initializeNotesData() {
        this.chatMessages = [
            {
                id: 1,
                date: new Date('2024-12-29T10:30:00'),
                postedBy: 'Dr. Smith',
                message: 'Patient is responding well to treatment. Blood pressure has stabilized.',
                context: 'Medical Review',
                tags: ['emergency', 'hypertension'],
                tagsDisplay: 'emergency, hypertension',
                hsVisible: true,
                cvpVisible: false,
                hsCheckboxId: 'hs-checkbox-1',
                cvpCheckboxId: 'cvp-checkbox-1',
                hasDocument: true
            },
            {
                id: 2,
                date: new Date('2024-12-28T15:45:00'),
                postedBy: 'Nurse Johnson',
                message: 'Follow-up appointment scheduled for next week. Patient education provided.',
                context: 'Patient Care',
                tags: ['expedite'],
                tagsDisplay: 'expedite',
                hsVisible: false,
                cvpVisible: true,
                hsCheckboxId: 'hs-checkbox-2',
                cvpCheckboxId: 'cvp-checkbox-2',
                hasDocument: false
            },
            {
                id: 3,
                date: new Date('2024-12-27T09:15:00'),
                postedBy: 'Dr. Wilson',
                message: 'Initial assessment completed. Recommending additional tests.',
                context: 'Diagnosis',
                tags: ['delayed', 'diabetic'],
                tagsDisplay: 'delayed, diabetic',
                hsVisible: true,
                cvpVisible: true,
                hsCheckboxId: 'hs-checkbox-3',
                cvpCheckboxId: 'cvp-checkbox-3',
                hasDocument: true
            }
        ];
        this.totalSize = this.chatMessages.length;
    }

    // Notes event handlers
    handleTagChange(event) {
        this.selectedTags = event.detail.value;
    }

    handleMessageChange(event) {
        this.message = event.target.value;
    }

    handleToggleShowMore() {
        this.showMore = !this.showMore;
    }

    toggleSort(event) {
        event.stopPropagation();
        this.isAscending = !this.isAscending;
    }

    onSortOptionSelected(option) {
        console.log('Sort by:', option);
        // Implement sorting logic here
    }

    toggleFilter() {
        this.filterToggle = !this.filterToggle;
    }

    // Visibility dropdown helpers pulled from hospitalSystemInnerScreen
    toggleStatusDropdown() {
      this.statusDropdownOpen = !this.statusDropdownOpen;
    }

    get statusDropdownClass() {
      return this.statusDropdownOpen ? 'dropdown-options open' : 'dropdown-options';
    }

    get statusDisplayText() {
      const count = this.statusOptions.filter(o => o.checked).length;
      return count > 0 ? `${count} selected` : 'Select';
    }

    handleStatusCheckboxChange(event) {
      const { value, checked } = event.target;
      this.statusOptions = this.statusOptions.map(opt =>
        opt.value === value ? { ...opt, checked } : opt
      );
    }

    handleSearchChange(event) {
      this.searchKey = event.target.value;
    }

    handleDueDateFromChange(event) {
      this.filterFromDate = event.target.value;
    }

    handleFilterChange(event) {
      const name = event.target.name;
      const val = event.target.value;
      if (name === 'fromDate') this.filterFromDate = val;
      if (name === 'toDate') this.filterToDate = val;
    }

    clearAllFilters() {
      this.filterFromDate = '';
      this.filterToDate = '';
      this.statusOptions = this.statusOptions.map(o => ({ ...o, checked: false }));
    }

    applyFilter() {
      // placeholder: apply filters to message list
      this.filterToggle = false;
    }

    handlePatientTypeChange(event) {
        this.selectedPatientType = event.detail.value;
    }

    addMessage() {
        if (!this.message.trim()) {
            return;
        }

        const newMessage = {
            id: this.chatMessages.length + 1,
            date: new Date(),
            postedBy: 'Current User',
            message: this.message,
            context: 'User Input',
            tags: [...this.selectedTags],
            tagsDisplay: this.selectedTags.join(', '),
            hsVisible: false,
            cvpVisible: false,
            hsCheckboxId: `hs-checkbox-${this.chatMessages.length + 1}`,
            cvpCheckboxId: `cvp-checkbox-${this.chatMessages.length + 1}`,
            hasDocument: false
        };

        this.chatMessages = [...this.chatMessages, newMessage];
        this.totalSize = this.chatMessages.length;
        
        // Clear form
        this.message = '';
        this.selectedTags = [];
    }

    // Document view handler
    handleViewDocument(event) {
        const documentId = event.target.dataset.id;
        console.log('View document for message ID:', documentId);
        // Implement document viewing logic here
    }

    openfileupload() {
        // Implement file upload logic
        console.log('File upload triggered');
    }

    saveFilters() {
        console.log('Filters saved');
    }

    getTagButtonStyle(tag) {
        const colors = {
            'emergency': 'background-color: red; color: white;',
            'expedite': 'background-color: green; color: white;',
            'delayed': 'background-color: #b1ca40; color: white;',
            'hypertension': 'background-color: #ff9800; color: white;',
            'diabetic': 'background-color: #9c27b0; color: white;'
        };
        return colors[tag] || 'background-color: #b1ca40; color: white;';
    }

    // Visibility change handlers
    handleHSVisibilityChange(event) {
        const messageId = parseInt(event.target.dataset.id);
        const isChecked = event.target.checked;
        
        this.chatMessages = this.chatMessages.map(msg => {
            if (msg.id === messageId) {
                return { ...msg, hsVisible: isChecked };
            }
            return msg;
        });
    }

    handleCVPVisibilityChange(event) {
        const messageId = parseInt(event.target.dataset.id);
        const isChecked = event.target.checked;
        
        this.chatMessages = this.chatMessages.map(msg => {
            if (msg.id === messageId) {
                return { ...msg, cvpVisible: isChecked };
            }
            return msg;
        });
    }

    
    get legalAgreementOptions() {
      const steps = this.legalSteps && this.legalSteps.length ? this.legalSteps : ['mNDA', 'LOI', 'ESA', 'MSA'];
      return steps.map((type) => ({ label: type, value: type }));
    }

    get legalModalTitle() {
        return this.legalEditingRowId ? 'Edit Agreement' : 'Add Agreement';
    }

    get showLegalStatusField() {
        return !!this.legalEditingRowId;
    }

    openLegalAddModal() {
        if (!this.selectedLegalStep && this.legalSteps && this.legalSteps.length) {
            this.selectedLegalStep = this.legalSteps[0];
        }
        this.resetLegalForm();
        this.isLegalAddModalOpen = true;
    }

    closeLegalAddModal() {
        this.isLegalAddModalOpen = false;
        this.resetLegalForm();
    }

    resetLegalForm() {
        const defaultAgreement = this.selectedLegalStep || (this.legalSteps && this.legalSteps[0]) || 'mNDA';
        this.legalFormAgreementType = defaultAgreement;
        this.legalFormVersion = '';
        this.legalFormInitiatedBy = '';
        this.legalFormHs = '';
        this.legalFormSponsor = '';
        this.legalFormDx = '';
        this.legalFormDueDate = '';
        this.legalFormDocName = '';
        this.legalFormStatus = 'In Process';
        this.legalEditingRowId = null;
    }

    handleLegalFormInputChange(event) {
        const name = event?.target?.name;
        const value = event?.detail?.value !== undefined ? event.detail.value : event?.target?.value;
        if (name && Object.prototype.hasOwnProperty.call(this, name)) {
            this[name] = value;
        }
    }

    handleLegalDocChange(event) {
        const fileList = event?.target?.files;
        this.legalFormDocName = fileList && fileList.length ? fileList[0].name : '';
    }

    saveLegalAdd() {
        const activeStep = this.selectedLegalStep || (this.legalSteps && this.legalSteps.length ? this.legalSteps[0] : null);
        if (!activeStep) {
            this.closeLegalAddModal();
            return;
        }
        const baseRow = {
            agreementType: this.legalFormAgreementType || activeStep,
            version: this.legalFormVersion || 'Draft',
            status: this.legalFormStatus || 'In Process',
            initiatedBy: this.legalFormInitiatedBy || '—',
            hsName: this.legalFormHs || '—',
            sponsorName: this.legalFormSponsor || '—',
            dxName: this.legalFormDx || '—',
            projectScopingDoc: this.legalFormDocName || 'Uploaded Document',
            dueDate: this.legalFormDueDate || new Date().toISOString().slice(0, 10)
        };
        const rows = this.legalData[activeStep] ? [...this.legalData[activeStep]] : [];
        if (this.legalEditingRowId) {
            const idx = rows.findIndex(r => r.id === this.legalEditingRowId);
            if (idx >= 0) {
                rows[idx] = { ...rows[idx], ...baseRow, id: this.legalEditingRowId };
                this.legalData = { ...this.legalData, [activeStep]: rows };
            }
        } else {
            const newRow = {
                id: `legal-${Date.now()}`,
                ...baseRow,
                hsAvatar: '',
                sponsorAvatar: '',
                dxAvatar: ''
            };
            this.legalData = { ...this.legalData, [activeStep]: [newRow, ...rows] };
        }
        this.closeLegalAddModal();
    }

}