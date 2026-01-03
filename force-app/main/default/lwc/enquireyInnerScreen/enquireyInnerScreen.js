import { LightningElement, api, track } from 'lwc';

export default class EnquireyInnerScreen extends LightningElement {
    @api enquiryId; // Public property to receive the enquiry ID
    @track enquiryData;

    connectedCallback() {
        // Load enquiry data when component loads
        if (this.enquiryId) {
            this.loadEnquiryData();
        }
    }

    loadEnquiryData() {
        console.log('Loading data for enquiry:', this.enquiryId);
        // TODO: Add logic to fetch enquiry details from Apex or wire service
        // For now, just logging the ID
    }

    handleBack() {
        // Dispatch event to parent component to go back
        const backEvent = new CustomEvent('back', {
            detail: { enquiryId: this.enquiryId }
        });
        this.dispatchEvent(backEvent);
    }
}