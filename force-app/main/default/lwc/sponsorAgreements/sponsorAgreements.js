import { LightningElement, track } from 'lwc';

export default class SponsorAgreements extends LightningElement {
    selectedType = 'mNDA';

    @track agreementTypes = [
        { name: 'mNDA', className: 'step-item active' },
        { name: 'LOI', className: 'step-item' },
        { name: 'ESA', className: 'step-item' },
        { name: 'MSA', className: 'step-item' }
    ];

    agreementData = {
        mNDA: [
            { id: 'mnda1', version: 'v1.0', status: 'Completed', initiatedBy: 'Legal Team', hsName: 'Mayo Clinic', sponsorName: 'Pharma Inc', dxName: 'datosX', dueDate: '2025-11-10' },
            { id: 'mnda2', version: 'v1.1', status: 'Pending', initiatedBy: 'Sponsor Review', hsName: 'Cleveland Clinic', sponsorName: 'BioCorp', dxName: 'Project Ops', dueDate: '2025-11-15' }
        ],
        LOI: [
            { id: 'loi1', version: 'v1.0', status: 'Draft', initiatedBy: 'Business Dev', hsName: 'Stanford Health', sponsorName: 'MedTech Inc', dxName: 'datosX', dueDate: '2025-11-20' }
        ],
        ESA: [
            { id: 'esa1', version: 'v1.0', status: 'In Review', initiatedBy: 'Legal Team', hsName: 'UCLA Health', sponsorName: 'HealthCo', dxName: 'datosX', dueDate: '2025-11-25' }
        ],
        MSA: [
            { id: 'msa1', version: 'v2.0', status: 'Active', initiatedBy: 'Operations', hsName: 'Mass General', sponsorName: 'BioGenix', dxName: 'datosX', dueDate: '2025-12-01' }
        ]
    };

    get currentRows() {
        return this.agreementData[this.selectedType] || [];
    }

    handleTypeClick(event) {
        const typeName = event.currentTarget.dataset.type;
        this.selectedType = typeName;
        this.agreementTypes = this.agreementTypes.map(type => ({
            ...type,
            className: type.name === typeName ? 'step-item active' : 'step-item'
        }));
    }

    handleEdit(event) { console.log('Edit agreement:', event.currentTarget.dataset.id); }
    handleDelete(event) { console.log('Delete agreement:', event.currentTarget.dataset.id); }
    handleExecute(event) { console.log('Execute agreement:', event.currentTarget.dataset.id); }
}