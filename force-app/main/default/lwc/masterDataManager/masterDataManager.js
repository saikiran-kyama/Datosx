import { LightningElement } from 'lwc';

import getStates from '@salesforce/apex/MasterDataController.getStates';
import getCities from '@salesforce/apex/MasterDataController.getCities';
import getSpecialities from '@salesforce/apex/MasterDataController.getSpecialities';
import createState from '@salesforce/apex/MasterDataController.createState';
import updateState from '@salesforce/apex/MasterDataController.updateState';
import deleteState from '@salesforce/apex/MasterDataController.deleteState';
import createCity from '@salesforce/apex/MasterDataController.createCity';
import updateCity from '@salesforce/apex/MasterDataController.updateCity';
import deleteCity from '@salesforce/apex/MasterDataController.deleteCity';
import createSpeciality from '@salesforce/apex/MasterDataController.createSpeciality';
import updateSpeciality from '@salesforce/apex/MasterDataController.updateSpeciality';
import deleteSpeciality from '@salesforce/apex/MasterDataController.deleteSpeciality';

export default class MasterDataManager extends LightningElement {
    // Data models
    states = [];

    cities = [];

    specialities = [];

    // UI state
    activeTab = 'state';

    // modal state
    isModalOpen = false;
    modalMode = 'add'; // 'add' or 'edit'
    modalType = 'state'; // 'state' | 'city' | 'speciality'
    modalForm = { id: null, name: '', code: '', stateName: '' };

    // counters for fallback new items (not used when server creates records)
    stateCounter = 1;
    cityCounter = 4;
    specialityCounter = 4;

    connectedCallback() {
        this.loadAll();
    }

    async loadAll() {
        await Promise.all([this.loadStates(), this.loadCities(), this.loadSpecialities()]);
    }

    async loadStates(){
        try{
            const res = await getStates();
            this.states = (res || []).map(s => ({ name: s.Name, code: s.Code__c, id: s.Id }));
            if(!this.modalForm.stateName && this.states.length) this.modalForm.stateName = this.states[0].name;
        }catch(err){ console.error('getStates error', err); }
    }

    async loadCities(){
        try{
            const res = await getCities();
            this.cities = (res || []).map(c => ({ id: c.Id, name: c.Name, stateName: c.State__r ? c.State__r.Name : '' }));
        }catch(err){ console.error('getCities error', err); }
    }

    async loadSpecialities(){
        try{
            const res = await getSpecialities();
            this.specialities = (res || []).map(s => ({ id: s.Id, name: s.Name }));
        }catch(err){ console.error('getSpecialities error', err); }
    }

    // computed classes / visibility
    get showState() { return this.activeTab === 'state'; }
    get showCity() { return this.activeTab === 'city'; }
    get showSpeciality() { return this.activeTab === 'speciality'; }

    get tabClassState() { return this.activeTab === 'state' ? 'tab active' : 'tab'; }
    get tabClassCity() { return this.activeTab === 'city' ? 'tab active' : 'tab'; }
    get tabClassSpeciality() { return this.activeTab === 'speciality' ? 'tab active' : 'tab'; }

    selectTab(event) {
        const tab = event.currentTarget.dataset.tab;
        if (tab) this.activeTab = tab;
    }
    // Open Add modal
    openAddModal(event) {
        const type = event.currentTarget.dataset.type;
        this.modalType = type || 'state';
        this.modalMode = 'add';
        this.modalForm = { id: null, name: '', code: '', stateName: this.states[0]?.name || '' };
        this.isModalOpen = true;
    }

    async handleAction(event) {
        const action = event.currentTarget.dataset.action;
        // support both code and id attributes depending on table
        const id = event.currentTarget.dataset.id;
        const code = event.currentTarget.dataset.code;
        if (action === 'edit') {
            // open Edit modal for the appropriate type
            if (code) {
                this.openEditModalByCode(code);
            } else if (id) {
                this.openEditModalById(id);
            }
        } else if (action === 'delete') {
            if (code) {
                // delete state by code -> find state id by code then call server
                const st = this.states.find(s => s.code === code);
                if (st && st.id) {
                    try{
                        await deleteState({ id: st.id });
                        this.states = this.states.filter(s => s.id !== st.id);
                    }catch(e){ console.error('deleteState failed', e); this.loadStates(); }
                } else {
                    // no id available, just reload
                    await this.loadStates();
                }
            } else if (id) {
                // id corresponds to server Ids
                const recId = id;
                try{
                    await deleteCity({ id: recId });
                    this.cities = this.cities.filter(c => c.id !== recId);
                }catch(_) {
                    try{
                        await deleteSpeciality({ id: recId });
                        this.specialities = this.specialities.filter(sp => sp.id !== recId);
                    }catch(e){ console.error('delete failed', e); this.loadCities(); this.loadSpecialities(); }
                }
            }
        }
    }

    openEditModalByCode(code) {
        const rec = this.states.find(s => s.code === code);
        if (!rec) return;
        this.modalType = 'state';
        this.modalMode = 'edit';
        this.modalForm = { id: rec.id || null, name: rec.name, code: rec.code };
        this.isModalOpen = true;
    }

    openEditModalById(id) {
        const numericId = Number(id);
        const c = this.cities.find(ci => ci.id === id || ci.id === numericId);
        if (c) {
            this.modalType = 'city';
            this.modalMode = 'edit';
            this.modalForm = { id: c.id, name: c.name, stateName: c.stateName };
            this.isModalOpen = true;
            return;
        }
        const sp = this.specialities.find(s => s.id === numericId);
        if (sp) {
            this.modalType = 'speciality';
            this.modalMode = 'edit';
            this.modalForm = { id: sp.id, name: sp.name };
            this.isModalOpen = true;
            return;
        }
    }

    // modal helpers
    get modalTitle() {
        const verb = this.modalMode === 'add' ? 'Add' : 'Edit';
        const type = this.modalType === 'state' ? 'State' : this.modalType === 'city' ? 'City' : 'Speciality';
        return `${verb} ${type}`;
    }

    get isStateModal() { return this.modalType === 'state'; }
    get isCityModal() { return this.modalType === 'city'; }
    get isSpecialityModal() { return this.modalType === 'speciality'; }

    get stateOptions() {
        return this.states.map(s => ({ label: s.name, value: s.name }));
    }

    handleModalOverlayClick() { this.closeModal(); }
    stopModalPropagation(evt) { evt.stopPropagation(); }

    handleModalInputChange(event) {
        const name = event.currentTarget.name || event.target.name;
        let value = undefined;
        if (event.detail && Object.prototype.hasOwnProperty.call(event.detail, 'value')) value = event.detail.value; else value = event.currentTarget.value;
        this.modalForm = { ...this.modalForm, [name]: value };
    }

    closeModal() { this.isModalOpen = false; }

    async saveModal() {
        // perform server-side create/update depending on modal mode
        if (this.modalMode === 'add') {
            if (this.modalType === 'state') {
                try{
                    const res = await createState({ name: this.modalForm.name, code: this.modalForm.code });
                    // optimistic add to UI
                    this.states = [...this.states, { id: res.Id, name: res.Name, code: res.Code__c }];
                }catch(e){ console.error('createState failed', e); await this.loadStates(); }
            } else if (this.modalType === 'city') {
                try{
                    const stateId = this.getStateIdByName(this.modalForm.stateName);
                    const res = await createCity({ name: this.modalForm.name, stateId });
                    const stateName = this.states.find(s => s.id === stateId)?.name || this.modalForm.stateName || '';
                    this.cities = [...this.cities, { id: res.Id, name: res.Name, stateName }];
                }catch(e){ console.error('createCity failed', e); await this.loadCities(); }
            } else if (this.modalType === 'speciality') {
                try{
                    const res = await createSpeciality({ name: this.modalForm.name });
                    this.specialities = [...this.specialities, { id: res.Id, name: res.Name }];
                }catch(e){ console.error('createSpeciality failed', e); await this.loadSpecialities(); }
            }
        } else {
            // edit
            if (this.modalType === 'state') {
                try{
                    const res = await updateState({ id: this.modalForm.id, name: this.modalForm.name, code: this.modalForm.code });
                    this.states = this.states.map(s => s.id === res.Id ? { ...s, name: res.Name, code: res.Code__c } : s);
                }catch(e){ console.error('updateState failed', e); await this.loadStates(); }
            } else if (this.modalType === 'city') {
                try{
                    const stateId = this.getStateIdByName(this.modalForm.stateName);
                    const res = await updateCity({ id: this.modalForm.id, name: this.modalForm.name, stateId });
                    const stateName = this.states.find(s => s.id === stateId)?.name || this.modalForm.stateName || '';
                    this.cities = this.cities.map(c => c.id === res.Id ? { ...c, name: res.Name, stateName } : c);
                }catch(e){ console.error('updateCity failed', e); await this.loadCities(); }
            } else if (this.modalType === 'speciality') {
                try{
                    const res = await updateSpeciality({ id: this.modalForm.id, name: this.modalForm.name });
                    this.specialities = this.specialities.map(sp => sp.id === res.Id ? { ...sp, name: res.Name } : sp);
                }catch(e){ console.error('updateSpeciality failed', e); await this.loadSpecialities(); }
            }
        }
        this.closeModal();
    }

    getStateIdByName(name){
        const rec = this.states.find(s => s.name === name || s.Name === name || s.code === name);
        return rec ? rec.id : null;
    }
}
