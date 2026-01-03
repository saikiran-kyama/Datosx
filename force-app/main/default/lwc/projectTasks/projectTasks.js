import { LightningElement, api } from 'lwc';

export default class ProjectTasks extends LightningElement {
    @api project;

    selectedProtocolStep = '';
    hasScrolledToSelectedStep = false;
    isAddActivityOpen = false;
    addFormMilestone = '';
    addFormDescription = '';
    protocolSteps = [];
    protocolData = {};

    milestoneNames = [
        'Trial Preparation',
        'Trial Execution',
        'Trial Close'
    ];

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
        'Trial Execution': [
            // project oversight activities
            { id: 'pom1', text: 'Provide weekly Sponsor updates on enrollment, site status, milestones.', checked: false, section: 'Trial Execution' },
            { id: 'pom2', text: 'Identify and address recruitment or operational challenges promptly.', checked: false, section: 'Trial Execution' },
            { id: 'pom3', text: 'Support HS research teams with issue resolution and data-entry troubleshooting.', checked: false, section: 'Trial Execution' },
            { id: 'pom4', text: 'Maintain cross-functional coordination with Sponsor, HS, and datosX teams.', checked: false, section: 'Trial Execution' },
            { id: 'pom5', text: 'Track meeting action items and ensure follow-up completion.', checked: false, section: 'Trial Execution' },

            // data monitoring & SDV activities
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
        'Trial Close': [
            // final data analysis
            { id: 'fda1', text: 'Coordinate with data vendor/biostatistics team for analysis as per plan.', checked: false, section: 'Trial Close' },
            { id: 'fda2', text: 'Review preliminary findings; ensure clarity and consistency.', checked: false, section: 'Trial Close' },
            { id: 'fda3', text: 'Resolve any post-lock data issues with Sponsor and vendor.', checked: false, section: 'Trial Close' },

            // sponsor final readout
            { id: 'sfr1', text: 'Organize and lead Final Readout Meeting with Sponsor.', checked: false, section: 'Trial Close' },
            { id: 'sfr2', text: 'Align stakeholders on interpretation of results and key lessons.', checked: false, section: 'Trial Close' },
            { id: 'sfr3', text: 'Document learnings for internal review.', checked: false, section: 'Trial Close' },

            // publication & archiving
            { id: 'pa1', text: 'Support manuscript coordination (if applicable).', checked: false, section: 'Trial Close' },
            { id: 'pa2', text: 'Compile data summaries, study documents, and regulatory materials.', checked: false, section: 'Trial Close' },
            { id: 'pa3', text: 'Ensure secure long-term archiving of all study data, reports, and documents.', checked: false, section: 'Trial Close' },
            { id: 'pa4', text: 'Confirm data retention compliance (5–15 years, as required).', checked: false, section: 'Trial Close' },

            // final wrap-up
            { id: 'fw1', text: 'Conduct internal study debrief with datosX teams.', checked: false, section: 'Trial Close' },
            { id: 'fw2', text: 'Deliver final closeout report to Sponsor.', checked: false, section: 'Trial Close' }
        ]
    };

    get milestoneOptions() {
        return (this.milestoneNames || []).map((m) => ({ label: m, value: m }));
    }

    get currentProtocolRows() {
        if (!this.selectedProtocolStep) return [];
        return this.protocolData[this.selectedProtocolStep] || [];
    }

    get overallProgress() {
        if (!this.protocolSteps || this.protocolSteps.length === 0) return 0;
        const total = this.protocolSteps.reduce((sum, step) => sum + (step.progress || 0), 0);
        return Math.round(total / this.protocolSteps.length);
    }

    connectedCallback() {
        const defaultMilestone = this.milestoneNames[0];
        this.protocolSteps = this.milestoneNames.map((name) => ({
            name,
            className: name === defaultMilestone ? 'step-item active' : 'step-item',
            progress: Math.floor(Math.random() * 81) + 20
        }));
        this.selectedProtocolStep = defaultMilestone;
        this.addFormMilestone = defaultMilestone;

        this.protocolData = {};
        const datePool = ['2025-11-12', '2025-11-05', '2025-10-28', '2025-09-15', '2025-08-30'];
        this.milestoneNames.forEach((name) => {
            const activities = this.milestoneActivities[name] || [];
            this.protocolData[name] = activities.map((act, i) => {
                const planDate = datePool[i % datePool.length];
                const actualDate = datePool[(i + 1) % datePool.length];
                const planFinish = '2025-12-31';
                const actualFinish = i % 7 === 0 ? '2026-01-15' : '';
                const eta = 'Q1 2026';
                const progressPct = Math.max(0, Math.min(100, Math.floor(Math.random() * 90) + 5));
                const progress = actualFinish ? '100%' : `${progressPct}%`;
                return {
                    id: act.id,
                    activity: act.text,
                    checked: act.checked || i % 5 === 0,
                    section: act.section,
                    lastUpdated: datePool[(i + name.length) % datePool.length],
                    planDate,
                    actualDate,
                    planFinish,
                    actualFinish,
                    eta,
                    progress,
                    progressStyle: `width: ${progress}; background: linear-gradient(90deg,#2e7ce4,#2e9be4); height: 10px;`
                };
            });
        });
    }

    renderedCallback() {
        if (!this.hasScrolledToSelectedStep && this.selectedProtocolStep) {
            try {
                const stepName = this.selectedProtocolStep;
                const el = this.template.querySelector(`[data-step="${stepName}"]`);
                const list = this.template.querySelector('.step-list');
                if (el && list) {
                    const offset = el.offsetTop - list.offsetTop;
                    list.scrollTo({ top: offset, behavior: 'auto' });
                }
            } catch (e) {
                // ignore scroll errors
            }
            this.hasScrolledToSelectedStep = true;
        }

        try {
            const innerBars = this.template.querySelectorAll('.progress-bar-inner');
            innerBars.forEach((el) => {
                const p = el.getAttribute('data-progress') || '0%';
                el.style.width = p;
            });
        } catch (e) {
            // ignore DOM setting errors
        }
    }

    handleProtocolStepClick(event) {
        const btn = event.target.closest('[data-step]');
        if (!btn) return;
        const stepName = btn.dataset.step;
        if (!stepName) return;
        this.selectedProtocolStep = stepName;
        this.protocolSteps = this.protocolSteps.map((s) => ({
            ...s,
            className: s.name === stepName ? 'step-item active' : 'step-item'
        }));
        try {
            const el = this.template.querySelector(`[data-step="${stepName}"]`);
            const list = this.template.querySelector('.step-list');
            if (el && list) {
                const offset = el.offsetTop - list.offsetTop;
                list.scrollTo({ top: offset, behavior: 'smooth' });
                this.hasScrolledToSelectedStep = true;
            }
        } catch (e) {
            // ignore scroll errors
        }
    }

    handleActivityCheckboxChange(event) {
        const activityId = event.target.dataset.activityId;
        const checked = event.target.checked;
        if (!this.selectedProtocolStep || !activityId) return;
        const activities = this.protocolData[this.selectedProtocolStep] || [];
        this.protocolData[this.selectedProtocolStep] = activities.map((act) => {
            if (act.id === activityId) {
                return { ...act, checked };
            }
            return act;
        });
        this.protocolData = { ...this.protocolData };
    }

    openAddActivityPopup() {
        this.isAddActivityOpen = true;
        this.addFormMilestone = this.selectedProtocolStep || this.milestoneNames[0];
        this.addFormDescription = '';
    }

    closeAddActivityPopup() {
        this.isAddActivityOpen = false;
        this.addFormMilestone = '';
        this.addFormDescription = '';
    }

    handleAddFormMilestoneChange(event) {
        const val = event?.detail?.value !== undefined ? event.detail.value : event?.target?.value;
        this.addFormMilestone = val;
    }

    handleAddFormDescriptionChange(event) {
        const val = event?.detail?.value !== undefined ? event.detail.value : event?.target?.value;
        this.addFormDescription = val;
    }

    saveAddActivity() {
        if (!this.addFormDescription || !this.addFormDescription.trim()) {
            alert('Please enter a description');
            return;
        }
        const milestone = this.addFormMilestone;
        if (!milestone) return;
        const newActivity = {
            id: 'custom_' + Date.now(),
            activity: this.addFormDescription.trim(),
            checked: false,
            section: 'Custom',
            lastUpdated: new Date().toISOString().split('T')[0],
            planDate: '',
            actualDate: '',
            planFinish: '',
            actualFinish: '',
            eta: '',
            progress: '0%',
            progressStyle: 'width: 0%'
        };
        if (!this.protocolData[milestone]) {
            this.protocolData[milestone] = [];
        }
        this.protocolData[milestone].push(newActivity);
        this.protocolData = { ...this.protocolData };
        this.closeAddActivityPopup();
    }

    handleEdit(event) {
        const activityId = event.currentTarget.dataset.id;
        // Placeholder for future edit behavior
        // eslint-disable-next-line no-console
        console.log('Edit activity:', activityId);
    }

    handleDelete(event) {
        const activityId = event.currentTarget.dataset.id;
        if (!this.selectedProtocolStep || !activityId) return;
        if (!confirm('Are you sure you want to delete this activity?')) return;
        const activities = this.protocolData[this.selectedProtocolStep] || [];
        this.protocolData[this.selectedProtocolStep] = activities.filter((act) => act.id !== activityId);
        this.protocolData = { ...this.protocolData };
    }

    handleModalOverlayClick(event) {
        if (event.target.classList.contains('modal-overlay')) {
            this.closeAddActivityPopup();
        }
    }

    stopPropagation(event) {
        event.stopPropagation();
    }
}
