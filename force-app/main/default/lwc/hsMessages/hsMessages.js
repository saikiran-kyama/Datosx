import { LightningElement, track } from 'lwc';

export default class HsMessages extends LightningElement {
    activeTab = 'sponsors';
    sponsorsCount = 8;
    healthSystemsCount = 6;
    inboxCount = 6;

    @track contacts = [
        {
            id: 'c1',
            name: 'Mark Smith',
            initials: 'MS',
            avatar: '',
            subject: 'Arrive at your goals faster with new learning resources.',
            preview: 'Get from where you are to where you\'re going.',
            time: 'Wed 2:39 AM',
            unread: 0,
            active: true,
            itemClass: 'message-item active'
        },
        {
            id: 'c2',
            name: 'Eugene Sikora',
            initials: 'ES',
            avatar: '',
            subject: 'Arrive at your goals faster with new learning resources.',
            preview: 'Get from where you are to where you\'re going.',
            time: 'Wed 2:39 AM',
            unread: 5,
            active: false,
            itemClass: 'message-item'
        },
        {
            id: 'c3',
            name: 'Robert Fassett',
            initials: 'RF',
            avatar: '',
            subject: 'Arrive at your goals faster with new learning resources.',
            preview: 'Get from where you are to where you\'re going.',
            time: 'Wed 2:39 AM',
            unread: 3,
            active: false,
            itemClass: 'message-item'
        }
    ];

    selectedContact = null;

    get selectedContactName() {
        return this.selectedContact ? this.selectedContact.name : 'Mark Smith';
    }

    get sponsorsTabClass() {
        return this.activeTab === 'sponsors' ? 'tab-btn active' : 'tab-btn';
    }

    get healthSystemsTabClass() {
        return this.activeTab === 'healthSystems' ? 'tab-btn active' : 'tab-btn';
    }

    handleTabClick(event) {
        this.activeTab = event.currentTarget.dataset.tab;
    }

    handleContactClick(event) {
        const contactId = event.currentTarget.dataset.id;
        this.contacts = this.contacts.map(contact => ({
            ...contact,
            active: contact.id === contactId,
            itemClass: contact.id === contactId ? 'message-item active' : 'message-item'
        }));
        this.selectedContact = this.contacts.find(c => c.id === contactId);
    }

    connectedCallback() {
        // Set initial selected contact
        this.selectedContact = this.contacts[0];
    }
}