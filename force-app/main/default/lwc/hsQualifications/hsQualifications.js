import { LightningElement } from 'lwc';

export default class HsQualifications extends LightningElement {
    // Facilities Available
    facilitiesAvailable = [
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
    ];

    // Therapeutic Area of Focus
    therapeuticAreas = [
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
        { id: 'ta14', label: "Men's Health", checked: true }
    ];

    // Innovation Format Interest
    innovationFormats = [
        { id: 'if1', label: 'HCP efficacy', checked: true },
        { id: 'if2', label: 'Mobile health app', checked: true },
        { id: 'if3', label: 'AI algorithm', checked: true },
        { id: 'if4', label: 'Wearable device', checked: true },
        { id: 'if5', label: 'Web application', checked: true },
        { id: 'if6', label: 'Digital diagnostics', checked: true },
        { id: 'if7', label: 'Other', checked: true }
    ];

    // Innovation End User Focus
    innovationEndUsers = [
        { id: 'eu1', label: 'Providers', checked: true },
        { id: 'eu2', label: 'Patients/Consumers', checked: true },
        { id: 'eu3', label: 'Health Systems', checked: true },
        { id: 'eu4', label: 'Researchers', checked: true },
        { id: 'eu5', label: 'Administrators', checked: true },
        { id: 'eu6', label: 'Payers', checked: true },
        { id: 'eu7', label: 'Pharma', checked: false },
        { id: 'eu8', label: 'Other', checked: false }
    ];
}