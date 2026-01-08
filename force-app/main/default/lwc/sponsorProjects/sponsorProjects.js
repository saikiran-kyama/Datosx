import { LightningElement, track } from 'lwc';

export default class SponsorProjects extends LightningElement {
    @track projectsData = [
        {
            id: 'proj1',
            projectId: 'PRJ-001',
            projectName: 'Cerebro DX',
            status: 'Active',
            statusClass: 'status-badge status-active',
            completion: 75,
            sponsorName: 'Pharma Inc',
            sponsorPhoto: '',
            sponsorInitials: 'PI',
            documents: 5,
            notes: 12,
            messages: 8,
            state: 'California',
            city: 'San Francisco',
            contact: 'Dr. Sarah Chen',
            contactPhoto: '',
            contactInitials: 'SC',
            email: 'sarah.chen@pharmainc.com',
            phone: '+1 415-555-0101',
            lastUpdated: '2025-11-01'
        },
        {
            id: 'proj2',
            projectId: 'PRJ-002',
            projectName: 'CardioScan Pro',
            status: 'Pending',
            statusClass: 'status-badge status-pending',
            completion: 30,
            sponsorName: 'MedTech Inc',
            sponsorPhoto: '',
            sponsorInitials: 'MT',
            documents: 3,
            notes: 5,
            messages: 2,
            state: 'New York',
            city: 'New York',
            contact: 'Dr. John Miller',
            contactPhoto: '',
            contactInitials: 'JM',
            email: 'john.miller@medtech.com',
            phone: '+1 212-555-0202',
            lastUpdated: '2025-10-28'
        },
        {
            id: 'proj3',
            projectId: 'PRJ-003',
            projectName: 'NeuroPath AI',
            status: 'Completed',
            statusClass: 'status-badge status-completed',
            completion: 100,
            sponsorName: 'BioCorp',
            sponsorPhoto: '',
            sponsorInitials: 'BC',
            documents: 10,
            notes: 20,
            messages: 15,
            state: 'Massachusetts',
            city: 'Boston',
            contact: 'Dr. Emily White',
            contactPhoto: '',
            contactInitials: 'EW',
            email: 'emily.white@biocorp.com',
            phone: '+1 617-555-0303',
            lastUpdated: '2025-10-15'
        }
    ];

    handleEdit(event) {
        const id = event.currentTarget.dataset.id;
        console.log('Edit project:', id);
    }

    handleDelete(event) {
        const id = event.currentTarget.dataset.id;
        console.log('Delete project:', id);
    }

    handleProjectClick(event) {
        const id = event.currentTarget.dataset.id;
        console.log('View project:', id);
        // Dispatch event to parent for navigation
        this.dispatchEvent(new CustomEvent('projectclick', {
            detail: { projectId: id }
        }));
    }
}