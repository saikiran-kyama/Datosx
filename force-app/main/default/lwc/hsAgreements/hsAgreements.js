import { LightningElement, track } from 'lwc';

export default class HsAgreements extends LightningElement {
    selectedType = 'mNDA';

    @track agreementTypes = [
        { name: 'mNDA', className: 'step-item active' },
        { name: 'LOI', className: 'step-item' },
        { name: 'ESA', className: 'step-item' },
        { name: 'MSA', className: 'step-item' }
    ];

    // Agreement data by type
    agreementData = {
        mNDA: [
            {
                id: 'mnda1',
                version: 'v1.0',
                status: 'Completed',
                initiatedBy: 'Legal Team',
                hsAvatar: '',
                hsName: 'Mayo Clinic',
                sponsorAvatar: '',
                sponsorName: 'Pharma Inc',
                dxAvatar: '',
                dxName: 'datosX',
                dueDate: '2025-11-10'
            },
            {
                id: 'mnda2',
                version: 'v1.1',
                status: 'Pending',
                initiatedBy: 'Sponsor Review',
                hsAvatar: '',
                hsName: 'Cleveland Clinic',
                sponsorAvatar: '',
                sponsorName: 'BioCorp',
                dxAvatar: '',
                dxName: 'Project Ops',
                dueDate: '2025-11-15'
            },
            {
                id: 'mnda3',
                version: 'v2.0',
                status: 'Pending',
                initiatedBy: 'Counterparty',
                hsAvatar: '',
                hsName: 'Johns Hopkins',
                sponsorAvatar: '',
                sponsorName: 'Global Pharma',
                dxAvatar: '',
                dxName: 'Project Lead',
                dueDate: '2025-11-17'
            }
        ],
        LOI: [
            {
                id: 'loi1',
                version: 'v1.0',
                status: 'Draft',
                initiatedBy: 'Business Dev',
                hsAvatar: '',
                hsName: 'Stanford Health',
                sponsorAvatar: '',
                sponsorName: 'MedTech Inc',
                dxAvatar: '',
                dxName: 'datosX',
                dueDate: '2025-11-20'
            }
        ],
        ESA: [
            {
                id: 'esa1',
                version: 'v1.0',
                status: 'In Review',
                initiatedBy: 'Legal Team',
                hsAvatar: '',
                hsName: 'UCLA Health',
                sponsorAvatar: '',
                sponsorName: 'HealthCo',
                dxAvatar: '',
                dxName: 'datosX',
                dueDate: '2025-11-25'
            }
        ],
        MSA: [
            {
                id: 'msa1',
                version: 'v2.0',
                status: 'Active',
                initiatedBy: 'Operations',
                hsAvatar: '',
                hsName: 'Mass General',
                sponsorAvatar: '',
                sponsorName: 'BioGenix',
                dxAvatar: '',
                dxName: 'datosX',
                dueDate: '2025-12-01'
            }
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

    handleEdit(event) {
        const id = event.currentTarget.dataset.id;
        console.log('Edit agreement:', id);
    }

    handleDelete(event) {
        const id = event.currentTarget.dataset.id;
        console.log('Delete agreement:', id);
    }

    handleExecute(event) {
        const id = event.currentTarget.dataset.id;
        console.log('Execute agreement:', id);
    }
}