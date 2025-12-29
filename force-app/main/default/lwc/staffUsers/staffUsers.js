import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProfiles from '@salesforce/apex/StaffUserController.getProfiles';
import getRoles from '@salesforce/apex/StaffUserController.getRoles';
import createUser from '@salesforce/apex/StaffUserController.createUser';
import sendPasswordReset from '@salesforce/apex/StaffUserController.sendPasswordReset';

export default class StaffUsers extends LightningElement {
    profileOptions = [];
    roleOptions = [];
    user = {};
    hiddenProfilesCount = 0;
    allowContentProfiles = false;

    connectedCallback() {
        this.loadProfiles();
        this.loadRoles();
    }

    loadProfiles() {
        getProfiles()
            .then(result => {
                // result contains ProfileInfo objects with license availability
                // Filter by availability and (by default) exclude profiles that require Content feature
                const filtered = result.filter(p => {
                    const hasAvail = p.available === true || (p.availableCount && p.availableCount > 0);
                    const contentOk = this.allowContentProfiles ? true : !(p.requiresContent === true);
                    return hasAvail && contentOk;
                });
                this.profileOptions = filtered.map(p => ({ label: `${p.name} — ${p.licenseName} (${p.availableCount || 0} available)`, value: p.id }));
                // expose count of hidden profiles for UI note
                this.hiddenProfilesCount = Math.max(0, result.length - filtered.length);
            })
            .catch(error => {
                this.showToast('Error', error.body ? error.body.message : error.message, 'error');
            });
    }

    loadRoles() {
        getRoles()
            .then(result => {
                this.roleOptions = result.map(r => ({ label: r.Name, value: r.Id }));
            })
            .catch(error => {
                this.showToast('Error', error.body ? error.body.message : error.message, 'error');
            });
    }

    handleChange(event) {
        const key = event.target.dataset.key;
        if (!key) return;
        if (event.target.type === 'checkbox') {
            this.user[key] = event.target.checked;
        } else {
            this.user[key] = event.target.value;
        }
    }

    handleAllowContentToggle(event){
        this.allowContentProfiles = event.target.checked;
        // reload profiles to reapply filter
        this.loadProfiles();
    }

    handleCreate() {
        if (!this.user.lastName || !this.user.email || !this.user.username || !this.user.profileId) {
            this.showToast('Validation', 'Please provide Last Name, Email, Username and Profile.', 'warning');
            return;
        }

        if (!this.user.alias) {
            const ln = this.user.lastName || '';
            this.user.alias = (ln.substring(0, 7) || 'staff').replace(/\s+/g, '').substring(0,8);
        }

        if (!this.user.communityNickname) this.user.communityNickname = this.user.username;

        createUser({ userInput: this.user })
            .then(resultId => {
                this.showToast('Success', 'User created: ' + resultId, 'success');
                // attempt to send password reset email
                sendPasswordReset({ userId: resultId })
                    .then(msg => {
                        this.showToast('Password Email', msg, 'success');
                    })
                    .catch(err => {
                        const em = err.body && err.body.message ? err.body.message : (err.message || JSON.stringify(err));
                        this.showToast('Password Email Failed', em, 'warning');
                    });
                this.handleReset();
            })
            .catch(error => {
                const msg = error.body && error.body.message ? error.body.message : (error.message || JSON.stringify(error));
                this.showToast('Error creating user', msg, 'error');
            });
    }

    handleReset() {
        this.user = {};
        const inputs = this.template.querySelectorAll('lightning-input, lightning-combobox');
        inputs.forEach(i => {
            if (i.type === 'checkbox') i.checked = false;
            else i.value = null;
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    get hasHiddenProfiles(){
        return this.hiddenProfilesCount && this.hiddenProfilesCount > 0;
    }
}
