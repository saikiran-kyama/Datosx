import { LightningElement } from 'lwc';

export default class HsPossibilities extends LightningElement {
    // Possibilities data for HS view
    possibilitiesData = [
        {
            id: 'enq1',
            enquiryId: 'ENQ-2024-001',
            sponsorName: 'Pharma Global Inc',
            sponsorInitials: 'PG',
            productName: 'CardioHealth Plus',
            productDetails: 'Advanced cardiovascular health monitoring solution for clinical trials',
            productScopingDoc: 'View',
            requirements: 12,
            matchingPercentage: 85,
            interested: false
        },
        {
            id: 'enq2',
            enquiryId: 'ENQ-2024-002',
            sponsorName: 'BioMed Solutions',
            sponsorInitials: 'BS',
            productName: 'NeuroTrack AI',
            productDetails: 'AI-powered neurological disorder tracking and analysis platform',
            productScopingDoc: 'View',
            requirements: 18,
            matchingPercentage: 92,
            interested: false
        },
        {
            id: 'enq3',
            enquiryId: 'ENQ-2024-003',
            sponsorName: 'MediCare Research',
            sponsorInitials: 'MR',
            productName: 'OncoMonitor Pro',
            productDetails: 'Comprehensive oncology patient monitoring and data management system',
            productScopingDoc: 'View',
            requirements: 15,
            matchingPercentage: 78,
            interested: true
        },
        {
            id: 'enq4',
            enquiryId: 'ENQ-2024-004',
            sponsorName: 'HealthTech Innovations',
            sponsorInitials: 'HT',
            productName: 'DiabetesWatch',
            productDetails: 'Real-time diabetes management and glucose monitoring solution',
            productScopingDoc: 'View',
            requirements: 10,
            matchingPercentage: 88,
            interested: false
        }
    ];

    // Confirmation modal state for Interested checkbox
    isInterestedConfirmOpen = false;
    selectedEnquiryId = null;
    pendingInterestedValue = false;

    // Requirements modal state
    isRequirementsModalOpen = false;
    selectedRequirementTab = 'facilities';

    // Requirements groups data
    requirementGroups = [
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

    // Handle interested checkbox change
    handleInterestedChange(event) {
        const id = event.currentTarget.dataset.id;
        const checked = event.target.checked;
        
        // If checking, show confirmation modal
        if (checked) {
            this.selectedEnquiryId = id;
            this.pendingInterestedValue = true;
            this.isInterestedConfirmOpen = true;
            // Revert the checkbox (modal will confirm)
            event.target.checked = false;
        } else {
            // If unchecking, just update directly
            this.possibilitiesData = this.possibilitiesData.map(row => 
                row.id === id ? { ...row, interested: false } : row
            );
        }
    }

    // Close interested confirmation modal
    closeInterestedModal() {
        this.isInterestedConfirmOpen = false;
        this.selectedEnquiryId = null;
        this.pendingInterestedValue = false;
    }

    // Confirm interested
    confirmInterested() {
        if (this.selectedEnquiryId) {
            this.possibilitiesData = this.possibilitiesData.map(row => 
                row.id === this.selectedEnquiryId ? { ...row, interested: this.pendingInterestedValue } : row
            );
        }
        this.closeInterestedModal();
    }

    // Handle requirements click
    handleRequirementsClick(event) {
        const id = event.currentTarget.dataset.id;
        this.selectedEnquiryId = id;
        this.selectedRequirementTab = 'facilities';
        this.isRequirementsModalOpen = true;
    }

    // Close requirements modal
    closeRequirementsModal() {
        this.isRequirementsModalOpen = false;
        this.selectedEnquiryId = null;
    }

    // Handle requirement tab click
    handleRequirementTabClick(event) {
        const tab = event.currentTarget.dataset.tab;
        if (tab) {
            this.selectedRequirementTab = tab;
        }
    }

    // Get requirement tabs with active state
    get requirementTabsWithState() {
        return this.requirementGroups.map(group => ({
            id: group.id,
            title: group.title,
            className: group.id === this.selectedRequirementTab ? 'req-tab-btn active' : 'req-tab-btn'
        }));
    }

    // Get active requirement group
    get activeRequirementGroup() {
        return this.requirementGroups.find(g => g.id === this.selectedRequirementTab);
    }

    // Stop modal propagation
    stopModalPropagation(event) {
        event.stopPropagation();
    }
}