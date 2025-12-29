import { LightningElement } from 'lwc';
import getProjects from '@salesforce/apex/ProjectsController.getProjects';
import upsertProject from '@salesforce/apex/ProjectsController.upsertProject';

export default class ProjectsGridLite extends LightningElement {
    rows = [];

    // Modal state for edit
    isModalOpen = false;
    modalForm = { Id: null, Status__c: '', Start_Date__c: '', ETA__c: '', End_Date__c: '' };

    statusOptions = [
        { label: 'Ongoing', value: 'Ongoing' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' }
    ];

    connectedCallback() {
        this.loadProjects();
    }

    async loadProjects() {
        try {
            const records = await getProjects({ searchKey: null, statuses: [], industries: [], sortField: 'Last_Updated__c', sortOrder: 'desc' });
            this.rows = (records || []).map(r => ({
                id: r.Id,
                status: r.Status__c || '',
                name: r.Name || '',
                hsName: r.Health_System_Name__c || '',
                sponsorName: r.Sponsor_Name__c || '',
                start: r.Start_Date__c || '',
                eta: r.ETA__c || '',
                end: r.End_Date__c || '',
                updated: r.Last_Updated__c || (r.LastModifiedDate || ''),
                _raw: r // keep raw server object for updates
            }));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('loadProjects failed', err);
        }
    }

    openEditModalById(id) {
        const rec = this.rows.find(r => r.id === id);
        if (!rec) return;
        // prepare modal form with API field names
        this.modalForm = {
            Id: rec.id,
            Status__c: rec.status,
            Start_Date__c: rec.start,
            ETA__c: rec.eta,
            End_Date__c: rec.end
        };
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleModalOverlayClick() {
        this.closeModal();
    }

    stopModalPropagation(event) {
        event.stopPropagation();
    }

    handleModalInputChange(event) {
        const name = event.currentTarget.name || event.target.name;
        let value = undefined;
        if (event.detail && Object.prototype.hasOwnProperty.call(event.detail, 'value')) {
            value = event.detail.value;
        } else {
            value = event.currentTarget.value;
        }
        this.modalForm = { ...this.modalForm, [name]: value };
    }

    async saveModal() {
        try {
            // call server to persist
            const payload = {
                Id: this.modalForm.Id,
                Status__c: this.modalForm.Status__c,
                Start_Date__c: this.modalForm.Start_Date__c,
                ETA__c: this.modalForm.ETA__c,
                End_Date__c: this.modalForm.End_Date__c
            };
            // eslint-disable-next-line no-console
            console.log('upsertProject payload', payload);
            const saved = await upsertProject({ project: payload });
            if (saved) {
                const sp = saved;
                const updatedRow = {
                    id: sp.Id,
                    status: sp.Status__c || '',
                    name: sp.Name || '',
                    hsName: sp.Health_System_Name__c || '',
                    sponsorName: sp.Sponsor_Name__c || '',
                    start: sp.Start_Date__c || '',
                    eta: sp.ETA__c || '',
                    end: sp.End_Date__c || '',
                    updated: sp.Last_Updated__c || (new Date().toISOString().slice(0,10)),
                    _raw: sp
                };
                this.rows = this.rows.map(r => r.id === updatedRow.id ? updatedRow : r);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('saveModal upsert failed', err);
            // optimistic local update fallback
            this.rows = this.rows.map(r => r.id === this.modalForm.Id ? { ...r, status: this.modalForm.Status__c, start: this.modalForm.Start_Date__c, eta: this.modalForm.ETA__c, end: this.modalForm.End_Date__c, updated: new Date().toISOString().slice(0,10) } : r);
        } finally {
            this.closeModal();
        }
    }

    handleAction(event) {
        const action = event.currentTarget.dataset.action;
        const id = event.currentTarget.dataset.id;
        if (action === 'edit') {
            this.openEditModalById(id);
            return;
        }
        if (action === 'delete') {
            this.rows = this.rows.filter(r => r.id !== id);
            return;
        }
        // eslint-disable-next-line no-console
        console.log(`${action} clicked for ${id}`);
    }
}
