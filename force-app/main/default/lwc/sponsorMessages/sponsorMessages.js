import { LightningElement, track } from 'lwc';

export default class SponsorMessages extends LightningElement {
    activeTab = 'sponsors';
    sponsorsCount = 8;
    healthSystemsCount = 6;
    inboxCount = 6;

    @track contacts = [
        { id: 'c1', name: 'Mark Smith', initials: 'MS', subject: 'Project update', preview: 'Get from where you are...', time: 'Wed 2:39 AM', unread: 0, active: true, itemClass: 'message-item active' },
        { id: 'c2', name: 'Eugene Sikora', initials: 'ES', subject: 'New resources', preview: 'Get from where you are...', time: 'Wed 2:39 AM', unread: 5, active: false, itemClass: 'message-item' },
        { id: 'c3', name: 'Robert Fassett', initials: 'RF', subject: 'Follow up', preview: 'Get from where you are...', time: 'Wed 2:39 AM', unread: 3, active: false, itemClass: 'message-item' }
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
        this.contacts = this.contacts.map(c => ({
            ...c,
            active: c.id === contactId,
            itemClass: c.id === contactId ? 'message-item active' : 'message-item'
        }));
        this.selectedContact = this.contacts.find(c => c.id === contactId);
    }

    connectedCallback() {
        this.selectedContact = this.contacts[0];
    }
}