import { LightningElement, track } from 'lwc';

export default class SponsorEnquiries extends LightningElement {
    @track enquiriesData = [
        {
            id: 'enq1',
            enquiryId: 'ENQ-001',
            status: 'Active',
            statusClass: 'status-badge status-active',
            projectName: 'Cerebro DX',
            projectDetails: 'AI-powered diagnostic platform',
            hasDocument: true,
            hsAllocated: '5 Health Systems',
            dateCreated: '2025-10-15',
            lastUpdated: '2025-11-01'
        },
        {
            id: 'enq2',
            enquiryId: 'ENQ-002',
            status: 'Pending',
            statusClass: 'status-badge status-pending',
            projectName: 'CardioScan Pro',
            projectDetails: 'Cardiac monitoring solution',
            hasDocument: true,
            hsAllocated: '3 Health Systems',
            dateCreated: '2025-10-20',
            lastUpdated: '2025-10-28'
        },
        {
            id: 'enq3',
            enquiryId: 'ENQ-003',
            status: 'Completed',
            statusClass: 'status-badge status-completed',
            projectName: 'NeuroPath AI',
            projectDetails: 'Neurology assessment tool',
            hasDocument: false,
            hsAllocated: '8 Health Systems',
            dateCreated: '2025-09-05',
            lastUpdated: '2025-10-15'
        }
    ];

    handleSort(event) {
        const field = event.currentTarget.dataset.field;
        console.log('Sorting by:', field);
    }

    handleEdit(event) {
        const id = event.currentTarget.dataset.id;
        console.log('Edit enquiry:', id);
    }

    handleDelete(event) {
        const id = event.currentTarget.dataset.id;
        console.log('Delete enquiry:', id);
    }

    handleEnquiryClick(event) {
        const id = event.currentTarget.dataset.id;
        console.log('View enquiry:', id);
    }
}