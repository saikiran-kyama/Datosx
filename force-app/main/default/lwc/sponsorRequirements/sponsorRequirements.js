import { LightningElement } from 'lwc';

export default class SponsorRequirements extends LightningElement {
    get displayCapabilityGroups() {
        return [
            {
                id: 'g1',
                title: 'Facilities Available',
                headerStyle: 'background-color:#425b63;color:white;padding:10px;font-weight:700;',
                bodyClass: 'capability-body',
                items: [
                    { id: 'f1', label: 'Academic Medical Center', projectNeeds: true },
                    { id: 'f2', label: 'Ambulatory Surgical Center', projectNeeds: true },
                    { id: 'f3', label: 'Center of Excellence', projectNeeds: true },
                    { id: 'f4', label: 'Community Health Clinic', projectNeeds: true },
                    { id: 'f5', label: 'Diagnostic Imaging Center', projectNeeds: true },
                    { id: 'f6', label: 'Emergency Room / Urgent Care', projectNeeds: true },
                    { id: 'f7', label: 'Hospice', projectNeeds: false },
                    { id: 'f8', label: 'Nursing Home', projectNeeds: false },
                    { id: 'f9', label: 'Outpatient Clinic', projectNeeds: true },
                    { id: 'f10', label: 'Rehab Center', projectNeeds: false },
                    { id: 'f11', label: 'Research Institution', projectNeeds: true },
                    { id: 'f12', label: 'Other', projectNeeds: false }
                ]
            },
            {
                id: 'g2',
                title: 'Therapeutic Area of Focus',
                headerStyle: 'background-color:#425b63;color:white;padding:10px;font-weight:700;',
                bodyClass: 'capability-body therapeutic-body',
                items: [
                    { id: 't1', label: 'Allergy and Immunology', projectNeeds: true },
                    { id: 't2', label: 'Cardiovascular', projectNeeds: true },
                    { id: 't3', label: 'Chronic Diseases', projectNeeds: true },
                    { id: 't4', label: 'Dental', projectNeeds: false },
                    { id: 't5', label: 'Dermatology', projectNeeds: false },
                    { id: 't6', label: 'Diagnostic Radiology', projectNeeds: true },
                    { id: 't7', label: 'Emergency Department', projectNeeds: true },
                    { id: 't8', label: 'Endocrinology', projectNeeds: true },
                    { id: 't9', label: 'Gastroenterology', projectNeeds: false },
                    { id: 't10', label: 'Genetic Medicine', projectNeeds: false },
                    { id: 't11', label: 'Hematology', projectNeeds: true },
                    { id: 't12', label: 'Infectious Disease', projectNeeds: true }
                ]
            },
            {
                id: 'g3',
                title: 'Innovation Format Interest',
                headerStyle: 'background-color:#c6a317;color:#1a1a1a;padding:10px;font-weight:700;',
                bodyClass: 'capability-body innovation-body',
                items: [
                    { id: 'i1', label: 'HCP efficacy', projectNeeds: true },
                    { id: 'i2', label: 'Mobile health app', projectNeeds: true },
                    { id: 'i3', label: 'AI algorithm', projectNeeds: true },
                    { id: 'i4', label: 'Wearable device', projectNeeds: true },
                    { id: 'i5', label: 'Web application', projectNeeds: true },
                    { id: 'i6', label: 'Digital diagnostics', projectNeeds: true },
                    { id: 'i7', label: 'Other', projectNeeds: false }
                ]
            },
            {
                id: 'g4',
                title: 'Innovation End User Focus',
                headerStyle: 'background-color:#c6a317;color:#1a1a1a;padding:10px;font-weight:700;',
                bodyClass: 'capability-body enduser-body',
                items: [
                    { id: 'e1', label: 'Providers', projectNeeds: true },
                    { id: 'e2', label: 'Patients/Consumers', projectNeeds: true },
                    { id: 'e3', label: 'Health Systems', projectNeeds: true },
                    { id: 'e4', label: 'Researchers', projectNeeds: true },
                    { id: 'e5', label: 'Administrators', projectNeeds: false },
                    { id: 'e6', label: 'Payers', projectNeeds: false },
                    { id: 'e7', label: 'Pharma', projectNeeds: false },
                    { id: 'e8', label: 'Other', projectNeeds: false }
                ]
            }
        ];
    }
}