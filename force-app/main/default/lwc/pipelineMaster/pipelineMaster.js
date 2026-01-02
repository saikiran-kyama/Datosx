import { LightningElement, track } from 'lwc';

export default class PipelineMaster extends LightningElement {
    @track activeTab = 'healthSystems';
    @track sortBy = '';
    @track sortDirection = 'asc';
    @track pageIndex = 0;
    @track pageSize = 10;
    @track pageSizeOptions = [5, 10, 25, 50, 100];
    @track showFilters = false;

    // Mock data - replace with actual Apex calls
    @track healthSystemsData = [
        { id: 'HS001', name: 'Memorial Hospital', status: 'Partner', city: 'New York', state: 'NY', contact: 'John Doe', email: 'john@memorial.com', phone: '555-0101', lastUpdated: '2025-12-15' },
        { id: 'HS002', name: 'City Medical Center', status: 'Prospect', city: 'Los Angeles', state: 'CA', contact: 'Jane Smith', email: 'jane@citymed.com', phone: '555-0102', lastUpdated: '2025-12-20' }
    ];

    @track sponsorsData = [
        { id: 'SP001', name: 'PharmaCorp Inc', status: 'Partner', city: 'Boston', state: 'MA', contact: 'Mike Johnson', email: 'mike@pharmacorp.com', phone: '555-0201', lastUpdated: '2025-12-18' },
        { id: 'SP002', name: 'BioTech Solutions', status: 'Prospect', city: 'San Francisco', state: 'CA', contact: 'Sarah Williams', email: 'sarah@biotech.com', phone: '555-0202', lastUpdated: '2025-12-22' }
    ];

    @track enquiriesData = [
        { id: 'ENQ001', sponsorName: 'PharmaCorp Inc', status: 'Active', projectScoping: 'view', requirements: 5, hsMatches: 12, projectName: 'Clinical Trial Alpha', trialDetails: 'Phase III Study', contact: 'Mike Johnson', email: 'mike@pharmacorp.com', phone: '555-0201', lastUpdated: '2025-12-25' },
        { id: 'ENQ002', sponsorName: 'BioTech Solutions', status: 'Completed', projectScoping: 'view', requirements: 8, hsMatches: 7, projectName: 'Research Beta', trialDetails: 'Phase II Study', contact: 'Sarah Williams', email: 'sarah@biotech.com', phone: '555-0202', lastUpdated: '2025-12-28' }
    ];

    getInitials(name) {
        if (!name) return '';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    enrichRecordData(record) {
        const status = record.status || '';
        const s = status.toLowerCase();
        
        // Compute inline style for status column (text color + border color)
        let statusStyle = '';
        if (s === 'partner') {
            statusStyle = 'color: #2e844a; border: 1px solid #2e844a; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        } else if (s === 'prospect' || s === 'onboarding') {
            statusStyle = 'color: #0176d3; border: 1px solid #0176d3; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        } else if (s === 'active') {
            statusStyle = 'color: #0176d3; border: 1px solid #0176d3; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        } else if (s === 'inactive') {
            statusStyle = 'color: #c23934; border: 1px solid #c23934; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        } else if (s === 'completed') {
            statusStyle = 'color: #706e6b; border: 1px solid #706e6b; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        } else {
            statusStyle = 'color: #706e6b; border: 1px solid #706e6b; background-color: transparent; padding: 0.2rem 0.6rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;';
        }

        return {
            ...record,
            nameInitial: this.getInitials(record.name),
            sponsorInitial: this.getInitials(record.sponsorName),
            contactInitial: this.getInitials(record.contact),
            statusLower: s,
            statusStyle
        };
    }

    get isHealthSystems() {
        return this.activeTab === 'healthSystems';
    }

    get isSponsors() {
        return this.activeTab === 'sponsors';
    }

    get isEnquiries() {
        return this.activeTab === 'enquiries';
    }

    get healthSystemsClass() {
        return this.activeTab === 'healthSystems' ? 'tab-item active' : 'tab-item';
    }

    get sponsorsClass() {
        return this.activeTab === 'sponsors' ? 'tab-item active' : 'tab-item';
    }

    get enquiriesClass() {
        return this.activeTab === 'enquiries' ? 'tab-item active' : 'tab-item';
    }

    get totalSize() {
        if (this.isHealthSystems) {
            return this.healthSystemsData.length;
        } else if (this.isSponsors) {
            return this.sponsorsData.length;
        } else if (this.isEnquiries) {
            return this.enquiriesData.length;
        }
        return 0;
    }

    get currentData() {
        let data = [];
        if (this.isHealthSystems) {
            data = this.healthSystemsData;
        } else if (this.isSponsors) {
            data = this.sponsorsData;
        } else if (this.isEnquiries) {
            data = this.enquiriesData;
        }
        const paginatedData = this.getPaginatedData(data);
        return paginatedData.map(record => this.enrichRecordData(record));
    }

    get sortIcon() {
        return this.sortDirection === 'asc' ? '↑' : '↓';
    }

    handleTabClick(event) {
        this.activeTab = event.currentTarget.dataset.tab;
        this.pageIndex = 0;
        this.sortBy = '';
        this.sortDirection = 'asc';
    }

    handleSort(event) {
        const field = event.currentTarget.dataset.field;
        if (this.sortBy === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = field;
            this.sortDirection = 'asc';
        }
        this.sortData();
    }

    sortData() {
        let dataToSort = [];
        if (this.isHealthSystems) {
            dataToSort = [...this.healthSystemsData];
        } else if (this.isSponsors) {
            dataToSort = [...this.sponsorsData];
        } else if (this.isEnquiries) {
            dataToSort = [...this.enquiriesData];
        }

        dataToSort.sort((a, b) => {
            let aVal = a[this.sortBy] || '';
            let bVal = b[this.sortBy] || '';
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        if (this.isHealthSystems) {
            this.healthSystemsData = dataToSort;
        } else if (this.isSponsors) {
            this.sponsorsData = dataToSort;
        } else if (this.isEnquiries) {
            this.enquiriesData = dataToSort;
        }
    }

    getPaginatedData(data) {
        const startIndex = this.pageIndex * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return data.slice(startIndex, endIndex);
    }

    handlePageChange(event) {
        this.pageIndex = event.detail.pageIndex;
        this.pageSize = event.detail.pageSize;
    }

    handleAdd() {
        // Implement add functionality
        console.log('Add clicked for:', this.activeTab);
    }

    handleFilter() {
        this.showFilters = !this.showFilters;
    }

    handleUpload() {
        // Implement upload functionality
        console.log('Upload clicked');
    }

    handleDownload() {
        // Implement download functionality
        console.log('Download clicked');
    }

    handleDownloadTemplate() {
        // Implement download template functionality
        console.log('Download template clicked');
    }

    handleEdit(event) {
        const recordId = event.currentTarget.dataset.id;
        console.log('Edit clicked for:', recordId);
        // Implement edit functionality
    }

    handleDelete(event) {
        const recordId = event.currentTarget.dataset.id;
        console.log('Delete clicked for:', recordId);
        // Implement delete functionality
    }
}