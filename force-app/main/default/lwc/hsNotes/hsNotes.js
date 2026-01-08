import { LightningElement, track } from 'lwc';

export default class HsNotes extends LightningElement {
    messageText = '';
    showMore = false;
    filterToggle = false;

    @track notes = [
        {
            id: 'note1',
            date: '2024-12-25T10:30:00',
            dateFormatted: 'Dec 25, 2024, 10:30 AM',
            postedBy: 'Dr. Smith',
            message: 'Patient is responding well to treatment. Blood pressure has stabilized.',
            context: 'Medical Review',
            hasDocument: true,
            hsVisible: true,
            sponsorVisible: false
        },
        {
            id: 'note2',
            date: '2024-12-28T15:45:00',
            dateFormatted: 'Dec 28, 2024, 03:45 PM',
            postedBy: 'Nurse Johnson',
            message: 'Follow-up appointment scheduled for next week. Patient education provided.',
            context: 'Patient Care',
            hasDocument: false,
            hsVisible: false,
            sponsorVisible: true
        },
        {
            id: 'note3',
            date: '2024-12-27T09:15:00',
            dateFormatted: 'Dec 27, 2024, 09:15 AM',
            postedBy: 'Dr. Wilson',
            message: 'Initial assessment completed. Recommending additional tests.',
            context: 'Diagnosis',
            hasDocument: true,
            hsVisible: true,
            sponsorVisible: true
        }
    ];

    get showMoreLabel() {
        return this.showMore ? 'Less' : 'More';
    }

    handleMessageChange(event) {
        this.messageText = event.target.value;
    }

    handleAttach() {
        console.log('Attach file clicked');
    }

    handleSend() {
        if (this.messageText) {
            console.log('Sending message:', this.messageText);
            // Add new note logic here
            this.messageText = '';
        }
    }

    handleToggleShowMore() {
        this.showMore = !this.showMore;
    }

    toggleSort() {
        console.log('Toggle sort');
    }

    toggleFilter() {
        this.filterToggle = !this.filterToggle;
    }

    handleViewDocument(event) {
        const id = event.currentTarget.dataset.id;
        console.log('View document for note:', id);
    }

    handleHSVisibilityChange(event) {
        const id = event.currentTarget.dataset.id;
        const checked = event.target.checked;
        this.notes = this.notes.map(note => 
            note.id === id ? { ...note, hsVisible: checked } : note
        );
    }

    handleSponsorVisibilityChange(event) {
        const id = event.currentTarget.dataset.id;
        const checked = event.target.checked;
        this.notes = this.notes.map(note => 
            note.id === id ? { ...note, sponsorVisible: checked } : note
        );
    }

    handleEdit(event) {
        const id = event.currentTarget.dataset.id;
        console.log('Edit note:', id);
    }

    handleDelete(event) {
        const id = event.currentTarget.dataset.id;
        console.log('Delete note:', id);
    }
}