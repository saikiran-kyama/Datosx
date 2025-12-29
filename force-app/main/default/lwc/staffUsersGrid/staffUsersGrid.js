import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProfiles from '@salesforce/apex/StaffUsersGridController.getProfiles';
import getRoles from '@salesforce/apex/StaffUsersGridController.getRoles';
import getLicenses from '@salesforce/apex/StaffUsersGridController.getLicenses';
import getStaffUsers from '@salesforce/apex/StaffUsersGridController.getStaffUsers';
import createUserWithStaff from '@salesforce/apex/StaffUsersGridController.createUserWithStaff';
import updateUserStatus from '@salesforce/apex/StaffUsersGridController.updateUserStatus';
import updateUserAndStaff from '@salesforce/apex/StaffUsersGridController.updateUserAndStaff';
import sendPasswordReset from '@salesforce/apex/StaffUsersGridController.sendPasswordReset';

export default class StaffUsersGrid extends LightningElement {
    rows = [];

    // modal state
    isModalOpen = false;
    modalMode = 'add';
    modalForm = {
        id: null,
        status: 'Active',
        profileId: null,
        roleId: null,
        licenseId: null,
        profileName: '',
        roleName: '',
        licenseName: '',
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        alias: '',
        username: '',
        phone: ''
    };

    statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    connectedCallback() {
        this.loadProfiles();
        this.loadRoles();
        this.loadLicenses();
        this.loadStaffUsers();
    }

    // --- option helpers ---
    get profileOptions() {
        return (this.profiles || []).map(p => ({
            label: this.formatProfileLabel(p),
            value: p.id,
            disabled: p.availableCount !== null && p.availableCount === 0
        }));
    }

    get roleOptions() {
        return (this.roles || []).map(r => ({ label: r.Name, value: r.Id }));
    }

    get licenseOptions() {
        return (this.licenses || []).map(l => ({
            label: this.formatLicenseLabel(l),
            value: l.id,
            disabled: l.availableCount !== null && l.availableCount === 0
        }));
    }

    formatProfileLabel(p) {
        const lic = p.licenseName ? ` (${p.licenseName}` : '';
        const counts = (p.availableCount !== null && p.totalLicenses !== null)
            ? ` — ${p.availableCount} of ${p.totalLicenses} available`
            : '';
        const suffix = p.licenseName ? ')' : '';
        return `${p.name}${lic}${counts}${suffix}`;
    }

    formatLicenseLabel(l) {
        const counts = (l.availableCount !== null && l.totalLicenses !== null)
            ? ` — ${l.availableCount} of ${l.totalLicenses} available`
            : '';
        return `${l.name}${counts}`;
    }

    get isEditMode() {
        return this.modalMode === 'edit';
    }

    get modalTitle() {
        return this.modalMode === 'add' ? 'Add Staff User' : 'Edit Staff User';
    }

    openAddModal() {
        const defaultProfile = this.profileOptions.find(o => !o.disabled) || this.profileOptions[0];
        const defaultRole = this.roleOptions[0];
        const defaultLicense = this.licenseOptions.find(o => !o.disabled) || this.licenseOptions[0];
        this.modalMode = 'add';
        this.modalForm = {
            id: null,
            status: 'Active',
            profileId: defaultProfile ? defaultProfile.value : null,
            roleId: defaultRole ? defaultRole.value : null,
            licenseId: defaultLicense ? defaultLicense.value : null,
            profileName: defaultProfile ? this.getProfileNameById(defaultProfile.value) : '',
            roleName: defaultRole ? defaultRole.label : '',
            licenseName: defaultLicense ? this.getLicenseNameById(defaultLicense.value) : '',
            name: '',
            firstName: '',
            lastName: '',
            email: '',
            alias: '',
            username: '',
            phone: ''
        };
        this.isModalOpen = true;
    }

    openEditModalById(id) {
        const rec = this.rows.find(r => r.id === id);
        if (!rec) return;
        this.modalMode = 'edit';
        this.modalForm = {
            ...rec,
            profileId: this.getProfileIdByName(rec.profileName),
            roleId: this.getRoleIdByName(rec.roleName),
            licenseId: this.getLicenseIdByName(rec.licenseName),
            username: rec.username || rec.email,
            status: rec.status || 'Active'
        };
        this.isModalOpen = true;
    }

    closeModal() { this.isModalOpen = false; }

    handleModalOverlayClick() { this.closeModal(); }

    stopModalPropagation(event) { event.stopPropagation(); }

    handleModalInputChange(event) {
        const name = event.currentTarget.name || event.target.name;
        let value = event.detail && Object.prototype.hasOwnProperty.call(event.detail, 'value')
            ? event.detail.value
            : event.currentTarget.value;
        this.modalForm = { ...this.modalForm, [name]: value };

        if(name === 'profileId'){
            const prof = this.profiles?.find(p => p.id === value);
            this.modalForm.profileName = prof ? prof.name : '';
            this.modalForm.licenseName = prof ? prof.licenseName : this.modalForm.licenseName;
        }
        if(name === 'roleId'){
            const role = this.roles?.find(r => r.Id === value);
            this.modalForm.roleName = role ? role.Name : '';
        }
        if(name === 'licenseId'){
            const lic = this.licenses?.find(l => l.id === value);
            this.modalForm.licenseName = lic ? lic.name : this.modalForm.licenseName;
        }
    }

    saveModal() {
        if (this.modalMode === 'add') {
            const profileId = this.modalForm.profileId;
            if(!profileId){
                this.showToast('Validation', 'Select a profile', 'warning');
                return;
            }
            const profile = this.profiles?.find(p => p.id === profileId);
            const role = this.roles?.find(r => r.Id === this.modalForm.roleId);
            const license = this.licenses?.find(l => l.id === this.modalForm.licenseId);

            const lastName = this.modalForm.name || 'StaffUser';
            const userInput = {
                    firstName: this.modalForm.firstName || '',
                    lastName: this.modalForm.lastName || lastName,
                email: this.modalForm.email || `${Date.now()}@example.com`,
                username: this.modalForm.username || `${Date.now()}_${(this.modalForm.email||'staff').replace(/\s+/g,'')}`,
                alias: this.modalForm.alias || lastName.replace(/\s+/g,'').substring(0,8),
                communityNickname: this.modalForm.username || this.modalForm.email,
                profileId: profile ? profile.id : null,
                roleId: role ? role.Id : null,
                isActive: true
            };

            const staffInput = {
                name: ((this.modalForm.firstName || '') + ' ' + (this.modalForm.lastName || this.modalForm.name || '')).trim(),
                    profileName: profile ? profile.name : '',
                roleName: role ? role.Name : '',
                licenseName: license ? license.name : (profile ? profile.licenseName : ''),
                status: this.modalForm.status,
                phone: this.modalForm.phone,
                email: this.modalForm.email,
                alias: this.modalForm.alias
            };

            createUserWithStaff({ userInput, staffInput })
                .then(res => {
                    const userId = res.userId;
                    const staffId = res.staffUserId;
                    const id = `SU-${Date.now().toString().slice(-4)}`;
                    const newRec = {
                        ...this.modalForm,
                        id,
                        userId,
                        staffUserId: staffId,
                        profileName: staffInput.profileName,
                        roleName: staffInput.roleName,
                        licenseName: staffInput.licenseName,
                        status: staffInput.status,
                        updated: new Date().toISOString().slice(0,10),
                            firstName: userInput.firstName,
                            lastName: userInput.lastName,
                    };
                    this.rows = [...this.rows, newRec];

                    if(staffId){
                        this.showToast('Success', 'User created', 'success');
                    } else {
                        this.showToast('Success', 'User created. Staff record creation queued.', 'success');
                        this.pollForStaff(userId);
                    }

                    sendPasswordReset({ userId })
                        .then(msg => this.showToast('Password Email', msg, 'success'))
                        .catch(err => this.showToast('Password Email Failed', this.normalizeError(err), 'warning'));

                    this.closeModal();
                })
                .catch(error => {
                    this.showToast('Error creating user', this.normalizeError(error), 'error');
                });

        } else if (this.modalMode === 'edit') {
            const payload = {
                userId: this.modalForm.userId || null,
                staffUserId: this.modalForm.staffUserId || this.modalForm.id || null,
                firstName: this.modalForm.firstName || null,
                lastName: this.modalForm.lastName || null,
                name: this.modalForm.name || null,
                status: this.modalForm.status || null,
                phone: this.modalForm.phone || null,
                email: this.modalForm.email || null,
                alias: this.modalForm.alias || null,
                profileName: this.modalForm.profileName || null,
                roleName: this.modalForm.roleName || null,
                licenseName: this.modalForm.licenseName || null
            };

            // If editing an existing User and status was provided, update IsActive on the User record
            if (payload.userId && payload.status != null) {
                try {
                    const isActive = (payload.status || '').toLowerCase() !== 'inactive';
                    updateUserStatus({ userId: payload.userId, isActive: isActive, staffUserId: payload.staffUserId, status: payload.status })
                        .catch(err => this.showToast('Error updating user status', this.normalizeError(err), 'warning'));
                } catch (e) {
                    // ignore
                }
            }

            updateUserAndStaff({ payload })
                .then(() => {
                    this.showToast('Success', 'Saved', 'success');
                    this.loadStaffUsers();
                })
                .catch(err => this.showToast('Error saving', this.normalizeError(err), 'error'));

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
    }

    // --- data loaders ---
    loadProfiles() {
        getProfiles()
            .then(result => { this.profiles = result; })
            .catch(error => { this.showToast('Error', this.normalizeError(error), 'error'); });
    }

    loadRoles() {
        getRoles()
            .then(result => { this.roles = result; })
            .catch(error => { this.showToast('Error', this.normalizeError(error), 'error'); });
    }

    loadLicenses(){
        getLicenses()
            .then(result => { this.licenses = result; })
            .catch(error => { this.showToast('Error', this.normalizeError(error), 'error'); });
    }

    loadStaffUsers(){
        getStaffUsers()
            .then(result => {
                this.rows = result.map(r => ({
                    id: r.id,
                    status: r.status || 'Active',
                    profileName: r.profileName,
                    licenseName: r.licenseName,
                    roleName: r.roleName,
                    name: r.name,
                    firstName: r.firstName || '',
                    lastName: r.lastName || '',
                    email: r.email,
                    alias: r.alias,
                    username: r.username,
                    phone: r.phone,
                    userId: r.userId,
                    staffUserId: r.id,
                    updated: new Date().toISOString().slice(0,10)
                }));
            })
            .catch(error => { this.showToast('Error', this.normalizeError(error), 'error'); });
    }

    pollForStaff(userId, attempts = 0){
        if(!userId) return;
        const max = 10;
        const delay = 2000;
        const check = () => {
            getStaffUsers()
                .then(result => {
                    const found = result.find(r => r.userId === userId);
                    if(found){
                        this.rows = this.rows.map(row => row.userId === userId ? ({
                            ...row,
                            id: found.id,
                            staffUserId: found.id,
                            profileName: found.profileName,
                            roleName: found.roleName,
                            licenseName: found.licenseName,
                            firstName: found.firstName || row.firstName,
                            lastName: found.lastName || row.lastName,
                            email: found.email || row.email,
                            alias: found.alias || row.alias,
                            username: found.username || row.username,
                            phone: found.phone || row.phone,
                            updated: new Date().toISOString().slice(0,10)
                        }) : row);
                    } else if(attempts < max){
                        setTimeout(() => this.pollForStaff(userId, attempts+1), delay);
                    }
                })
                .catch(() => {
                    if(attempts < max) setTimeout(() => this.pollForStaff(userId, attempts+1), delay);
                });
        };
        setTimeout(check, delay);
    }

    getProfileNameById(id){
        const p = this.profiles?.find(x => x.id === id);
        return p ? p.name : '';
    }

    getRoleIdByName(name){
        const r = this.roles?.find(x => x.Name === name);
        return r ? r.Id : null;
    }

    getProfileIdByName(name){
        const p = this.profiles?.find(x => x.name === name);
        return p ? p.id : null;
    }

    getLicenseIdByName(name){
        const l = this.licenses?.find(x => x.name === name);
        return l ? l.id : null;
    }

    getLicenseNameById(id){
        const l = this.licenses?.find(x => x.id === id);
        return l ? l.name : '';
    }

    showToast(title, message, variant){
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    normalizeError(error){
        if(!error) return 'Unknown error';
        if(error.body && error.body.message) return error.body.message;
        if(error.message) return error.message;
        try{ return JSON.stringify(error); } catch(e){ return 'Unknown error'; }
    }
}
