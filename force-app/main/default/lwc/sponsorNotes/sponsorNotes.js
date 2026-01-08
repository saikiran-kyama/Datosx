import { LightningElement, track } from 'lwc';

export default class SponsorNotes extends LightningElement {
    messageText = '';
    showMore = false;
    filterToggle = false;

    @track notes = [
        { id: 'note1', dateFormatted: 'Dec 25, 2024, 10:30 AM', postedBy: 'Dr. Smith', message: 'Patient is responding well to treatment. Blood pressure has stabilized.', context: 'Medical Review', hasDocument: true, hsVisible: true, sponsorVisible: false },
        { id: 'note2', dateFormatted: 'Dec 28, 2024, 03:45 PM', postedBy: 'Nurse Johnson', message: 'Follow-up appointment scheduled for next week.', context: 'Patient Care', hasDocument: false, hsVisible: false, sponsorVisible: true },
        { id: 'note3', dateFormatted: 'Dec 27, 2024, 09:15 AM', postedBy: 'Dr. Wilson', message: 'Initial assessment completed. Recommending additional tests.', context: 'Diagnosis', hasDocument: true, hsVisible: true, sponsorVisible: true }
    ];

    get showMoreLabel() { return this.showMore ? 'Less' : 'More'; }

    handleMessageChange(event) { this.messageText = event.target.value; }
    handleAttach() { console.log('Attach file clicked'); }
    handleSend() { if (this.messageText) { console.log('Sending:', this.messageText); this.messageText = ''; } }
    handleToggleShowMore() { this.showMore = !this.showMore; }
    toggleSort() { console.log('Toggle sort'); }
    toggleFilter() { this.filterToggle = !this.filterToggle; }
    handleViewDocument(event) { console.log('View document:', event.currentTarget.dataset.id); }
    handleHSVisibilityChange(event) {
        const id = event.currentTarget.dataset.id;
        this.notes = this.notes.map(n => n.id === id ? { ...n, hsVisible: event.target.checked } : n);
    }
    handleSponsorVisibilityChange(event) {
        const id = event.currentTarget.dataset.id;
        this.notes = this.notes.map(n => n.id === id ? { ...n, sponsorVisible: event.target.checked } : n);
    }
    handleEdit(event) { console.log('Edit note:', event.currentTarget.dataset.id); }
    handleDelete(event) { console.log('Delete note:', event.currentTarget.dataset.id); }
}