import { LightningElement } from 'lwc';

export default class MessagesDatosx extends LightningElement {
	currentTab = 'Messaging';
	messagingActiveTab = 'sponsors';
	selectedContact = null;
	messagingContacts = [];

	connectedCallback() {
		this.initializeMessagingData();
	}

	initializeMessagingData() {
		this.messagingContacts = [
			{ id: 'c1', name: 'Mark Smith', avatar: '/resource/avatars/ODF.png', type: 'sponsors', active: false, unread: 0, itemClass: 'messaging-contact-item' },
			{ id: 'c2', name: 'Eugene Sikora', avatar: '/resource/avatars/ODF1.png', type: 'sponsors', active: false, unread: 5, itemClass: 'messaging-contact-item' },
			{ id: 'c3', name: 'Robert Fassett', avatar: '/resource/avatars/ODF2.png', type: 'sponsors', active: false, unread: 5, itemClass: 'messaging-contact-item' },
			{ id: 'c4', name: 'Andrew Fletcher', avatar: '/resource/avatars/sponsor-acme.svg', type: 'sponsors', active: false, unread: 0, itemClass: 'messaging-contact-item' },
			{ id: 'c5', name: 'Tyron Derby', avatar: '/resource/avatars/sponsor-novo.svg', type: 'sponsors', active: false, unread: 0, itemClass: 'messaging-contact-item' },
			{ id: 'c11', name: 'BioGenix', avatar: '/resource/avatars/sponsor-biogenix.svg', type: 'sponsors', active: false, unread: 2, itemClass: 'messaging-contact-item' },
			{ id: 'c6', name: 'Mayo Clinic', avatar: '/resource/avatars/HS1.png', type: 'healthSystems', active: false, unread: 0, itemClass: 'messaging-contact-item' },
			{ id: 'c7', name: 'Cleveland Clinic', avatar: '/resource/avatars/HS2.png', type: 'healthSystems', active: false, unread: 2, itemClass: 'messaging-contact-item' },
			{ id: 'c8', name: 'Johns Hopkins', avatar: '/resource/avatars/HS3.png', type: 'healthSystems', active: false, unread: 0, itemClass: 'messaging-contact-item' },
			{ id: 'c9', name: 'Mass General', avatar: '/resource/avatars/HS4.png', type: 'healthSystems', active: false, unread: 3, itemClass: 'messaging-contact-item' },
			{ id: 'c10', name: 'UCLA Medical', avatar: '/resource/avatars/HS5.png', type: 'healthSystems', active: false, unread: 0, itemClass: 'messaging-contact-item' },
			{ id: 'c12', name: 'Stanford Health', avatar: '/resource/avatars/HS-stanford.svg', type: 'healthSystems', active: false, unread: 1, itemClass: 'messaging-contact-item' }
		];

		const firstContact = this.messagingContacts.find(c => c.type === 'sponsors');
		if (firstContact) {
			firstContact.active = true;
			firstContact.itemClass = 'messaging-contact-item active';
			this.selectedContact = firstContact;
		}
	}

	get sponsorsTabClass() {
		return this.messagingActiveTab === 'sponsors' ? 'btn btn-primary btn-sm' : 'btn btn-outline-primary btn-sm';
	}

	get healthSystemsTabClass() {
		return this.messagingActiveTab === 'healthSystems' ? 'btn btn-primary btn-sm' : 'btn btn-outline-primary btn-sm';
	}

	get visibleMessagingContacts() {
		return this.messagingContacts.filter(c => c.type === this.messagingActiveTab);
	}

	get sponsorsCount() {
		return this.messagingContacts.filter(c => c.type === 'sponsors').length;
	}

	get healthSystemsCount() {
		return this.messagingContacts.filter(c => c.type === 'healthSystems').length;
	}

	handleMessagingTabClick(event) {
		const tab = event.target.dataset.tab;
		if (!tab) return;
		this.messagingActiveTab = tab;
	}

	handleMessagingContactClick(event) {
		const contactId = event.currentTarget.dataset.id;
		if (!contactId) return;
		this.messagingContacts = this.messagingContacts.map(c => ({
			...c,
			active: c.id === contactId,
			itemClass: c.id === contactId ? 'messaging-contact-item active' : 'messaging-contact-item'
		}));
		const contact = this.messagingContacts.find(c => c.id === contactId);
		if (contact) {
			this.selectedContact = contact;
		}
	}
}