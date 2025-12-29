import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProfiles from '@salesforce/apex/HealthSystemsGridController.getProfiles';
import getRoles from '@salesforce/apex/HealthSystemsGridController.getRoles';
import createUser from '@salesforce/apex/HealthSystemsGridController.createUser';
import createUserWithHealthSystem from '@salesforce/apex/HealthSystemsGridController.createUserWithHealthSystem';
import updateUserStatus from '@salesforce/apex/HealthSystemsGridController.updateUserStatus';
import updateUserAndHealthSystem from '@salesforce/apex/HealthSystemsGridController.updateUserAndHealthSystem';
import getHealthSystems from '@salesforce/apex/HealthSystemsGridController.getHealthSystems';
import getProjects from '@salesforce/apex/ProjectsController.getProjects';
import sendPasswordReset from '@salesforce/apex/HealthSystemsGridController.sendPasswordReset';
import getStates from '@salesforce/apex/MasterDataController.getStates';
import getCities from '@salesforce/apex/MasterDataController.getCities';
import getSpecialities from '@salesforce/apex/MasterDataController.getSpecialities';

export default class HealthSystemsGrid extends LightningElement {

    // table rows
    rows = [];

    // Modal state
    isModalOpen = false;
    modalMode = 'add'; // 'add' or 'edit'
    modalForm = { id: null, name: '', firstName: '', lastName: '', alias: '', status: '', city: '', state: '', specialities: [], contact: '', email: '', phone: '' };

    // Specialities viewer modal
    isSpecModalOpen = false;
    specModalList = [];
    specModalTitle = '';

    // Options for comboboxes
    statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    // Speciality options for combobox (loaded from master data for popups)
    specialityOptions = [];

    // Master lists (loaded on-demand for popup only)
    stateMasterOptions = [];
    cityMasterOptions = [];

    // dropdown state for speciality multi-select (custom)
    showSpecialityDropdown = false;

    // derive city/state options from existing rows (simple unique list)
    get cityOptions() {
        const set = new Set(this.rows.map(r => r.city).filter(Boolean));
        return Array.from(set).map(v => ({ label: v, value: v }));
    }

    get stateOptions() {
        const set = new Set(this.rows.map(r => r.state).filter(Boolean));
        return Array.from(set).map(v => ({ label: v, value: v }));
    }

    // Options to use inside the Add/Edit popup (sourced from master data)
    get modalStateOptions() {
        return (this.stateMasterOptions || []).map(s => ({ label: s.label, value: s.value }));
    }

    get modalCityOptions() {
        return this.filteredCitiesByState(this.modalForm.state).map(c => ({ label: c.label, value: c.value }));
    }

    filteredCitiesByState(stateValue) {
        const normalized = (stateValue || '').trim().toLowerCase();
        return (this.cityMasterOptions || []).filter(c => {
            if (!normalized) return true;
            const cityState = (c.stateName || '').trim().toLowerCase();
            return cityState === normalized;
        });
    }

    ensureCityForState(stateValue) {
        const filtered = this.filteredCitiesByState(stateValue);
        const hasCurrent = filtered.some(c => c.value === this.modalForm.city);
        const nextCity = hasCurrent ? this.modalForm.city : (filtered[0]?.value || '');
        this.modalForm = { ...this.modalForm, city: nextCity };
    }

    get modalTitle() {
        return this.modalMode === 'add' ? 'Add Health System' : 'Edit Health System';
    }

    get isEditMode() {
        return this.modalMode === 'edit';
    }

    openAddModal() {
        this.modalMode = 'add';
        this.modalForm = { id: null, name: '', firstName: '', lastName: '', alias: '', username: '', status: 'Active', city: this.rows[0]?.city || '', state: this.rows[0]?.state || '', specialities: [], contact: '', email: '', phone: '', projects: 0 };
        // load master data for popup dropdowns
        this.loadMasterOptions().then(() => {
            if(!this.modalForm.state && this.stateMasterOptions.length) this.modalForm.state = this.stateMasterOptions[0].value;
            this.ensureCityForState(this.modalForm.state);
            this.syncSpecialityOptionsWithForm();
            this.isModalOpen = true;
        }).catch(() => { this.ensureCityForState(this.modalForm.state); this.isModalOpen = true; this.syncSpecialityOptionsWithForm(); });
    }

    openEditModalById(id) {
        const rec = this.rows.find(r => r.id === id);
        if (!rec) return;
        this.modalMode = 'edit';
        this.modalForm = { ...rec, username: rec.email, firstName: '', lastName: rec.name || rec.lastName || '' };
        // load master data and then open modal so dropdowns show server values
        this.loadMasterOptions().then(() => {
            if(rec.state) this.modalForm.state = rec.state;
            if(rec.city) this.modalForm.city = rec.city;
            this.ensureCityForState(this.modalForm.state);
            this.syncSpecialityOptionsWithForm();
            this.isModalOpen = true;
        }).catch(() => { this.ensureCityForState(this.modalForm.state); this.syncSpecialityOptionsWithForm(); this.isModalOpen = true; });
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
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        this.modalForm = { ...this.modalForm, [name]: value };
        if(name === 'state') {
            this.ensureCityForState(value);
        }
    }

    // --- Speciality dropdown handlers (custom multi-select) ---
    get specialityDropdownClass() {
        return this.showSpecialityDropdown ? 'dropdown-menu show' : 'dropdown-menu';
    }

    get specialityDisplayText() {
        const len = (this.modalForm && this.modalForm.specialities) ? this.modalForm.specialities.length : 0;
        return len > 0 ? `${len} selected` : 'Select';
    }

    toggleSpecialityDropdown() {
        this.showSpecialityDropdown = !this.showSpecialityDropdown;
    }

    handleSpecialityCheckboxChange(event) {
        const val = event.target.value;
        const checked = event.target.checked;
        this.specialityOptions = this.specialityOptions.map(o => o.value === val ? { ...o, checked } : o);
        const current = new Set(this.modalForm.specialities || []);
        if (checked) current.add(val); else current.delete(val);
        this.modalForm = { ...this.modalForm, specialities: Array.from(current) };
    }

    selectAllSpecialities() {
        this.specialityOptions = this.specialityOptions.map(o => ({ ...o, checked: true }));
        this.modalForm = { ...this.modalForm, specialities: this.specialityOptions.map(o => o.value) };
    }

    clearAllSpecialities() {
        this.specialityOptions = this.specialityOptions.map(o => ({ ...o, checked: false }));
        this.modalForm = { ...this.modalForm, specialities: [] };
    }

    syncSpecialityOptionsWithForm() {
        const selected = this.modalForm.specialities || [];
        this.specialityOptions = this.specialityOptions.map(o => ({ ...o, checked: selected.includes(o.value) }));
    }

    // Open specialities list modal for a row
    openSpecialities(event) {
        const id = event.currentTarget.dataset.id;
        const rec = this.rows.find(r => r.id === id);
        if (!rec) return;
        this.specModalList = Array.isArray(rec.specialities) ? rec.specialities : (rec.specialities ? [rec.specialities] : []);
        this.specModalTitle = `${rec.name} — Specialities`;
        this.isSpecModalOpen = true;
    }

    closeSpecModal() {
        this.isSpecModalOpen = false;
        this.specModalList = [];
        this.specModalTitle = '';
    }

    saveModal() {
        if (this.modalMode === 'add') {
            // Prepare user input for Apex createUser
            // Use profile 'Health System' and role 'CEO' if available
            const profileName = 'Health System';
            const roleName = 'CEO';

            const profile = (this.profiles || []).find(p => p.name === profileName);
            const role = (this.roles || []).find(r => r.Name === roleName);

            if (!profile) {
                this.showToast('Profile Missing', `Profile "${profileName}" not found in org.`, 'error');
                return;
            }

            // basic validation
            if (!this.modalForm.lastName && !this.modalForm.name) {
                this.showToast('Validation', 'Please provide a Last Name / HS Name for the user.', 'warning');
                return;
            }

            const hsLastName = this.modalForm.name || this.modalForm.lastName || this.modalForm.contact || 'HealthSystem';
            const userInput = {
                firstName: '',
                lastName: hsLastName,
                email: this.modalForm.email || `${Date.now()}@example.com`,
                username: this.modalForm.username || `${Date.now()}_${(this.modalForm.email||'user').replace(/\s+/g,'')}`,
                alias: this.modalForm.alias || (this.modalForm.name ? this.modalForm.name.replace(/\s+/g,'').substring(0,8) : 'hsuser'),
                communityNickname: this.modalForm.username || this.modalForm.email,
                profileId: profile.id,
                roleId: role ? role.Id : null,
                isActive: true
            };

            // create user and Health_System record together
            const hsInput = {
                name: this.modalForm.name,
                profileName: profile.name,
                roleName: role ? role.Name : '',
                licenseName: profile.licenseName || (profile.licenseName === undefined ? '' : profile.licenseName),
                status: this.modalForm.status,
                city: this.modalForm.city,
                state: this.modalForm.state,
                phone: this.modalForm.phone,
                contact: this.modalForm.contact,
                specialities: this.modalForm.specialities || []
            };

            createUserWithHealthSystem({ userInput, hsInput })
                .then(res => {
                    const userId = res.userId;
                    const hsId = res.healthSystemId;
                    const id = `HS-${Date.now().toString().slice(-4)}`;
                    const newRec = {
                        ...this.modalForm,
                        firstName: userInput.firstName,
                        lastName: userInput.lastName,
                        id,
                        userId,
                        healthSystemId: hsId,
                        username: userInput.username,
                        alias: userInput.alias || this.modalForm.alias || '',
                        specialities: this.modalForm.specialities || [],
                        contact: this.modalForm.contact || '',
                        profileName: profile.name,
                        roleName: role ? role.Name : '',
                        licenseName: profile.licenseName || (profile.licenseName === undefined ? '' : profile.licenseName),
                        updated: new Date().toISOString().slice(0,10)
                    };
                    this.rows = [...this.rows, newRec];
                    if(hsId) this.showToast('Success', 'User created: ' + userId, 'success');
                    else this.showToast('Success', 'User created: ' + userId + '. Health System record creation queued.', 'success');

                    // start polling for the asynchronously-created Health System record
                    if(!hsId){
                        this.pollForHealthSystem(userId);
                    }

                    sendPasswordReset({ userId })
                        .then(msg => this.showToast('Password Email', msg, 'success'))
                        .catch(err => {
                            const em = err.body && err.body.message ? err.body.message : (err.message || JSON.stringify(err));
                            this.showToast('Password Email Failed', em, 'warning');
                        });

                    this.closeModal();
                })
                .catch(error => {
                    const msg = error.body && error.body.message ? error.body.message : (error.message || JSON.stringify(error));
                    this.showToast('Error creating user', msg, 'error');
                });

        } else if (this.modalMode === 'edit') {
            // Update User (setup) and Health System (non-setup) safely
            const hsLastName = this.modalForm.name || this.modalForm.lastName || 'HealthSystem';
            const payload = {
                userId: this.modalForm.userId || null,
                healthSystemId: this.modalForm.healthSystemId || null,
                firstName: '',
                lastName: hsLastName,
                name: this.modalForm.name || null,
                status: this.modalForm.status || null,
                city: this.modalForm.city || null,
                state: this.modalForm.state || null,
                phone: this.modalForm.phone || null,
                contact: this.modalForm.contact || null,
                profileName: this.modalForm.profileName || null,
                roleName: this.modalForm.roleName || null,
                licenseName: this.modalForm.licenseName || null,
                specialities: this.modalForm.specialities || []
            };

            // If a User record exists and status was supplied, update User.IsActive
            if (payload.userId && payload.status != null) {
                try {
                    const isActive = (payload.status || '').toLowerCase() !== 'inactive';
                    updateUserStatus({ userId: payload.userId, isActive: isActive, healthSystemId: payload.healthSystemId, status: payload.status })
                        .catch(err => {
                            const em = err.body && err.body.message ? err.body.message : (err.message || JSON.stringify(err));
                            this.showToast('Error updating user status', em, 'warning');
                        });
                } catch (e) {
                    // ignore
                }
            }

            updateUserAndHealthSystem({ payload })
                .then(() => {
                    this.showToast('Success', 'Saved', 'success');
                    // refresh rows from server to reflect authoritative values
                    this.loadHealthSystems();
                })
                .catch(err => {
                    const em = err.body && err.body.message ? err.body.message : (err.message || JSON.stringify(err));
                    this.showToast('Error saving', em, 'error');
                });

            this.closeModal();
        }
    }

    connectedCallback() {
        this.loadProfiles();
        this.loadRoles();
        this.loadHealthSystems();
    }

    loadProfiles() {
        getProfiles()
            .then(result => {
                // store raw profile info for lookups
                this.profiles = result;
            })
            .catch(error => {
                this.showToast('Error', error.body ? error.body.message : error.message, 'error');
            });
    }

    loadRoles() {
        getRoles()
            .then(result => {
                this.roles = result;
            })
            .catch(error => {
                this.showToast('Error', error.body ? error.body.message : error.message, 'error');
            });
    }

    loadHealthSystems(){
        // load health systems first, then fetch projects to compute per-HS counts
        Promise.all([getHealthSystems(), getProjects({ searchKey: null, statuses: [], industries: [], sortField: 'Last_Updated__c', sortOrder: 'desc' })])
            .then(([result, projects]) => {
                // map server records into local row format
                const projectsList = projects || [];
                // build maps for counts by Health System id and by name
                const countsByHsId = new Map();
                const countsByName = new Map();
                projectsList.forEach(p => {
                    try{
                        if(p.Health_System__c) countsByHsId.set(p.Health_System__c, (countsByHsId.get(p.Health_System__c) || 0) + 1);
                    }catch(e){}
                    try{
                        // prefer Health_System_Name__c, fallback to related name; strip trailing '(NN%)' markers
                        let rawName = p.Health_System_Name__c || (p.Health_System__r && p.Health_System__r.Name) || '';
                        if(!rawName && p.Health_System__c && p.Health_System__r && p.Health_System__r.Name) rawName = p.Health_System__r.Name;
                        if(rawName) {
                            const cleaned = String(rawName).replace(/\s*\(\d+%\)\s*$/,'').trim().toLowerCase();
                            countsByName.set(cleaned, (countsByName.get(cleaned) || 0) + 1);
                        }
                    }catch(e){}
                });

                this.rows = (result || []).map(r => ({
                    id: r.id,
                        status: r.status || 'Active',
                        alias: r.name ? r.name.replace(/\s+/g,'').substring(0,8) : '',
                        name: r.name,
                        specialities: r.specialities || [],
                        city: r.city || '',
                        state: r.state || '',
                        projects: (countsByHsId.get(r.id) || countsByName.get((r.name||'').trim().toLowerCase()) || 0),
                        username: r.username || '',
                        alias: r.alias || '',
                        firstName: r.firstName || '',
                        lastName: r.lastName || '',
                        contact: (r.contact || ''),
                        email: r.email || '',
                        phone: r.phone || '',
                        updated: new Date().toISOString().slice(0,10),
                        userId: r.userId,
                        profileName: r.profileName,
                        roleName: r.roleName,
                        licenseName: r.licenseName,
                        healthSystemId: r.id
                }));
            })
            .catch(error => {
                this.showToast('Error', error.body ? error.body.message : error.message, 'error');
            });
    }

    async loadMasterOptions(){
        try{
            const [states, cities, specialities] = await Promise.all([getStates(), getCities(), getSpecialities()]);
            this.stateMasterOptions = (states || []).map(s => ({ label: s.Name, value: s.Name, id: s.Id, code: s.Code__c }));
            this.cityMasterOptions = (cities || []).map(c => ({ label: c.Name, value: c.Name, id: c.Id, stateId: c.State__c, stateName: c.State__r ? c.State__r.Name : '' }));
            this.specialityOptions = (specialities || []).map(sp => ({ label: sp.Name, value: sp.Name, id: sp.Id, checked: false }));
        }catch(err){
            console.error('loadMasterOptions error', err);
        }
    }

    pollForHealthSystem(userId, attempts = 0){
        if(!userId) return;
        const max = 10;
        const delay = 2000; // 2s
        const check = () => {
            getHealthSystems()
                .then(result => {
                    const found = result.find(r => r.userId === userId);
                    if(found){
                        // replace any row with this userId
                            this.rows = this.rows.map(row => row.userId === userId ? ({
                            ...row,
                            id: found.id,
                            healthSystemId: found.id,
                            profileName: found.profileName,
                            roleName: found.roleName,
                            licenseName: found.licenseName,
                                    username: found.username || row.username,
                                    alias: found.alias || row.alias,
                                    firstName: found.firstName || row.firstName,
                                    lastName: found.lastName || row.lastName,
                                    email: found.email || row.email,
                                    contact: (found.contact || row.contact),
                                    specialities: found.specialities || row.specialities,
                                    city: found.city || row.city,
                                    state: found.state || row.state,
                            phone: found.phone || row.phone,
                            updated: new Date().toISOString().slice(0,10)
                        }) : row);
                    } else if(attempts < max){
                        setTimeout(() => this.pollForHealthSystem(userId, attempts+1), delay);
                    }
                })
                .catch(() => {
                    if(attempts < max) setTimeout(() => this.pollForHealthSystem(userId, attempts+1), delay);
                });
        };
        check();
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    handleAction(event) {
        const action = event.currentTarget.dataset.action;
        const id = event.currentTarget.dataset.id;
        if (action === 'edit') {
            this.openEditModalById(id);
            return;
        }
        if (action === 'delete') {
            // simple delete for demo
            this.rows = this.rows.filter(r => r.id !== id);
            return;
        }
        // eslint-disable-next-line no-console
        console.log(`${action} clicked for ${id}`);
    }
}
