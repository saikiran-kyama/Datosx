import { LightningElement, track } from 'lwc';
import getCurrentUserProfileName from '@salesforce/apex/DatxDemoController.getCurrentUserProfileName';
import getCurrentUserName from '@salesforce/apex/DatxDemoController.getCurrentUserName';
import getCurrentSponsor from '@salesforce/apex/SponsorsGridController.getCurrentSponsor';
import upsertProject from '@salesforce/apex/ProjectsController.upsertProject';
import getProjects from '@salesforce/apex/ProjectsController.getProjects';
import getCurrentHealthSystem from '@salesforce/apex/HealthSystemsGridController.getCurrentHealthSystem';
import updateUserAndHealthSystem from '@salesforce/apex/HealthSystemsGridController.updateUserAndHealthSystem';
import getStates from '@salesforce/apex/MasterDataController.getStates';
import getCities from '@salesforce/apex/MasterDataController.getCities';
import getSpecialities from '@salesforce/apex/MasterDataController.getSpecialities';
import getEnquiriesForCurrentSponsor from '@salesforce/apex/EnquiryController.getEnquiriesForCurrentSponsor';
import getAllActiveEnquiries from '@salesforce/apex/EnquiryController.getAllActiveEnquiries';
import getInterestedMatches from '@salesforce/apex/EnquiryController.getInterestedMatches';
import upsertEnquiry from '@salesforce/apex/EnquiryController.upsertEnquiry';
import deleteEnquiry from '@salesforce/apex/EnquiryController.deleteEnquiry';
import markInterest from '@salesforce/apex/EnquiryController.markInterest';
import updateUserAndSponsor from '@salesforce/apex/SponsorsGridController.updateUserAndSponsor';
import updateUserStatus from '@salesforce/apex/SponsorsGridController.updateUserStatus';

export default class ProjectDashboard extends LightningElement {
    @track isLoaded = false;
    @track profileName = '';
    @track userName = '';
    @track isHealth = false;
    @track isSponsor = false;
    @track activeTab = 'Projects';
    @track modalVisible = false;
    @track modalType = '';
    @track modalMode = 'add';
    @track modalData = {};

    // Combobox options for Status
    statusOptions = [
        { label: 'Ongoing', value: 'Ongoing' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' }
    ];

    // Enquiry status options (used only in edit modal)
    enquiryStatusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    // Specialities options for enquiry multiselect
    reqOptions = [
        { label: 'Cardiology', value: 'Cardiology', checked: false },
        { label: 'Oncology', value: 'Oncology', checked: false },
        { label: 'Neurology', value: 'Neurology', checked: false },
        { label: 'Pediatrics', value: 'Pediatrics', checked: false },
        { label: 'Radiology', value: 'Radiology', checked: false }
    ];

    showReqDropdown = false;

    get reqDropdownClass() {
        return this.showReqDropdown ? 'dropdown-menu show' : 'dropdown-menu';
    }

    get reqDisplayText() {
        const len = Array.isArray(this.modalData.req) ? this.modalData.req.length : (this.modalData.req ? String(this.modalData.req).split(',').filter(Boolean).length : 0);
        return len > 0 ? `${len} selected` : 'Select';
    }

    // Profile specialities multiselect (separate options from enquiry reqOptions)
    specialityOptions = [
        { label: 'Cardiology', value: 'Cardiology', checked: false },
        { label: 'Oncology', value: 'Oncology', checked: false },
        { label: 'Neurology', value: 'Neurology', checked: false },
        { label: 'Pediatrics', value: 'Pediatrics', checked: false },
        { label: 'Radiology', value: 'Radiology', checked: false }
    ];

    showSpecialitiesDropdown = false;

    get specialitiesDropdownClass() {
        return this.showSpecialitiesDropdown ? 'dropdown-menu show' : 'dropdown-menu';
    }

    get specialitiesDisplayText() {
        const s = this.modalData && this.modalData.specialities;
        const len = Array.isArray(s) ? s.length : (s ? String(s).split(',').filter(Boolean).length : 0);
        return len > 0 ? `${len} selected` : 'Select';
    }

    toggleSpecialitiesDropdown() {
        this.showSpecialitiesDropdown = !this.showSpecialitiesDropdown;
    }

    handleSpecialityCheckboxChange(event) {
        const val = event.target.value;
        const checked = event.target.checked;
        this.specialityOptions = this.specialityOptions.map(o => o.value === val ? { ...o, checked } : o);
        const current = new Set(Array.isArray(this.modalData.specialities) ? this.modalData.specialities : (this.modalData.specialities ? String(this.modalData.specialities).split(',').map(s=>s.trim()).filter(Boolean) : []));
        if (checked) current.add(val); else current.delete(val);
        this.modalData = { ...this.modalData, specialities: Array.from(current) };
    }

    selectAllSpecialities() {
        this.specialityOptions = this.specialityOptions.map(o => ({ ...o, checked: true }));
        this.modalData = { ...this.modalData, specialities: this.specialityOptions.map(o => o.value) };
    }

    clearAllSpecialities() {
        this.specialityOptions = this.specialityOptions.map(o => ({ ...o, checked: false }));
        this.modalData = { ...this.modalData, specialities: [] };
    }

    syncSpecialitiesOptionsWithModal() {
        const selected = Array.isArray(this.modalData.specialities) ? this.modalData.specialities : (this.modalData.specialities ? String(this.modalData.specialities).split(',').map(s=>s.trim()).filter(Boolean) : []);
        this.specialityOptions = this.specialityOptions.map(o => ({ ...o, checked: selected.includes(o.value) }));
    }

    // State and City combobox options (loaded from master data)
    stateMasterOptions = [];
    cityMasterOptions = [];

    get stateOptions(){
        return this.stateMasterOptions;
    }

    get cityOptions(){
        return this.filteredCitiesByState(this.modalData.state);
    }

    toggleReqDropdown() {
        this.showReqDropdown = !this.showReqDropdown;
    }

    // user menu / logout
    showUserMenu = false;

    get userMenuClass() {
        return this.showUserMenu ? 'user-menu show' : 'user-menu';
    }

    toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
    }

    get profileHeading() {
        if (this.isHealth) return 'Health System';
        if (this.isSponsor) return 'Sponsor';
        return 'Dashboard';
    }

    logout() {
    this.showUserMenu = false;

    window.location.href =
        'https://orgfarm-4f811fcf7a-dev-ed.develop.my.salesforce.com/secur/logout.jsp' +
        '?retUrl=' +
        encodeURIComponent(
            'https://orgfarm-4f811fcf7a-dev-ed.develop.my.site.com/datx/login'
        );
}




    handleReqCheckboxChange(event) {
        const val = event.target.value;
        const checked = event.target.checked;
        this.reqOptions = this.reqOptions.map(o => o.value === val ? { ...o, checked } : o);
        const current = new Set(Array.isArray(this.modalData.req) ? this.modalData.req : (this.modalData.req ? String(this.modalData.req).split(',').map(s=>s.trim()).filter(Boolean) : []));
        if (checked) current.add(val); else current.delete(val);
        this.modalData = { ...this.modalData, req: Array.from(current) };
    }

    selectAllReq() {
        this.reqOptions = this.reqOptions.map(o => ({ ...o, checked: true }));
        this.modalData = { ...this.modalData, req: this.reqOptions.map(o => o.value) };
    }

    clearAllReq() {
        this.reqOptions = this.reqOptions.map(o => ({ ...o, checked: false }));
        this.modalData = { ...this.modalData, req: [] };
    }

    syncReqOptionsWithModal() {
        const selected = Array.isArray(this.modalData.req) ? this.modalData.req : (this.modalData.req ? String(this.modalData.req).split(',').map(s=>s.trim()).filter(Boolean) : []);
        this.reqOptions = this.reqOptions.map(o => ({ ...o, checked: selected.includes(o.value) }));
    }

    // Data collections
    projects = [];
    profile = {};
    possibilities = [];
    enquiries = [];

    // viewer modal for lists
    isListModalOpen = false;
    listModalTitle = '';
    listModalItems = [];
    listModalType = ''; // 'req' or 'interested'
    listModalSourceId = '';

    openReqList(event) {
        const id = event.currentTarget.dataset.id;
        const item = this.enquiries.find(e => e.id === id);
        if (!item) return;
        const list = Array.isArray(item.req) ? item.req : (item.req ? String(item.req).split(',').map(s=>s.trim()).filter(Boolean) : []);
        this.listModalType = 'req';
        this.listModalItems = list;
        this.listModalTitle = `Req Specialities`;
        this.isListModalOpen = true;
    }

    // Open profile specialities list (used in My Profile HS table)
    openProfileSpecialities() {
        const list = Array.isArray(this.profile.specialities) ? this.profile.specialities : (this.profile.specialities ? String(this.profile.specialities).split(',').map(s=>s.trim()).filter(Boolean) : []);
        this.listModalType = 'req';
        this.listModalItems = list;
        this.listModalTitle = `${this.profile.id || 'Profile'} — Specialities`;
        this.isListModalOpen = true;
    }

    async openInterestedList(event) {
        const id = event.currentTarget.dataset.id;
        const item = this.enquiries.find(e => e.id === id);
        if (!item) return;
        this.listModalType = 'interested';
        this.listModalTitle = `Interested HS`;
        this.listModalSourceId = id;
        this.isListModalOpen = true;

        // default render while we fetch live matching
        const list = Array.isArray(item.interested) ? item.interested : (item.interested ? String(item.interested).split(',').map(s=>s.trim()).filter(Boolean) : []);
        this.listModalItems = list.map((name, i) => {
            let displayName = name || '';
            let matching = `${60 + ((i * 13) % 31)}%`;
            try {
                const m = String(name).trim().match(/^(.*)\s*\((\d+)%\)\s*$/);
                if (m) {
                    displayName = (m[1] || '').trim();
                    matching = (m[2] ? m[2].trim() + '%' : matching);
                }
            } catch (e) {
                // ignore parse errors and fall back to defaults
            }
            return { selected: false, name: displayName, matching };
        });

        // refresh matching % against latest Req Specialities
        try {
            const rows = await getInterestedMatches({ enquiryId: id });
            if (rows && rows.length > 0) {
                this.listModalItems = rows.map(r => ({
                    selected: false,
                    name: r.name || '',
                    matching: (r.matchingPct != null ? `${r.matchingPct}%` : '--')
                }));
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('getInterestedMatches failed', err);
        }
    }

    closeListModal() {
        this.isListModalOpen = false;
        this.listModalItems = [];
        this.listModalTitle = '';
        this.listModalType = '';
        this.listModalSourceId = '';
    }

    // toggle checkbox selection inside Interested list modal
    toggleListItemSelected(event) {
        const idx = Number(event.target.dataset.index);
        if (Number.isNaN(idx)) return;
        const copy = this.listModalItems.slice();
        copy[idx] = { ...copy[idx], selected: event.target.checked };
        this.listModalItems = copy;
    }

    confirmInterestedSelection() {
        if (!this.listModalSourceId) {
            this.closeListModal();
            return;
        }
        const selectedNames = (this.listModalItems || []).filter(it => it.selected).map(it => it.name);
        const enquiryId = this.listModalSourceId;
        // Update enquiries locally
        this.enquiries = this.enquiries.map(e => e.id === enquiryId ? { ...e, interested: selectedNames, status: (selectedNames && selectedNames.length>0) ? 'Completed' : e.status } : e);

        // If sponsor confirmed at least one interested HS, create a Project entry and persist enquiry status
        if (selectedNames && selectedNames.length > 0) {
            const enquiry = this.enquiries.find(e => e.id === enquiryId) || {};
            // persist enquiry status and interested list via Apex upsertEnquiry
            const payload = {
                id: enquiryId,
                status: 'Completed',
                interested: selectedNames
            };
            // debug: log payloads
            // eslint-disable-next-line no-console
            console.log('confirmInterestedSelection: selectedNames, payload', selectedNames, payload);
            upsertEnquiry({ payload })
                .then(saved => {
                    // update local enquiry with any server-normalized fields
                    const mapped = this.mapEnquiryFromServer(saved);
                    this.enquiries = this.enquiries.map(e => e.id === mapped.id ? mapped : e);
                    // create Project__c server-side using ProjectsController.upsertProject
                    const now = new Date().toISOString().slice(0,10);
                    const projectPayload = {
                        Name: mapped.product || ('Project from ' + (mapped.id || enquiryId)),
                        Status__c: 'Ongoing',
                        Start_Date__c: now,
                        ETA__c: null,
                        End_Date__c: null,
                        Sponsor_Name__c: this.profile && this.profile.name ? this.profile.name : null,
                        // Associate the selected Health System so HS users can see the project
                        Health_System_Name__c: (selectedNames && selectedNames.length>0) ? selectedNames[0] : null,
                        Project_Details__c: mapped.details || ''
                    };
                    // eslint-disable-next-line no-console
                    console.log('confirmInterestedSelection: calling upsertProject with', projectPayload);
                    return upsertProject({ project: projectPayload });
                })
                .then(savedProject => {
                    // eslint-disable-next-line no-console
                    console.log('confirmInterestedSelection: upsertProject returned', savedProject);
                    if (savedProject) {
                        const sp = savedProject;
                        const projRow = {
                            id: sp.Id,
                            status: sp.Status__c || 'Ongoing',
                            name: sp.Name || (sp.Project_Id__c || ''),
                            details: sp.Project_Details__c || enquiry.details || '',
                            partner: this.isSponsor ? (sp.Health_System_Name__c || sp.Sponsor_Name__c || (this.profile && this.profile.name) || '') : (sp.Sponsor_Name__c || sp.Health_System_Name__c || ''),
                            start: sp.Start_Date__c || new Date().toISOString().slice(0,10),
                            eta: sp.ETA__c || '',
                            end: sp.End_Date__c || '',
                            updated: sp.Last_Updated__c || new Date().toISOString().slice(0,10)
                        };
                        this.projects = [projRow, ...this.projects];
                    }
                })
                .catch(err => {
                    // eslint-disable-next-line no-console
                    console.error('upsertEnquiry/upsertProject (confirmInterestedSelection) failed', err);
                    // fallback: still update local project UI
                    const now = new Date().toISOString().slice(0,10);
                    const proj = {
                        id: this._genId('P'),
                        status: 'Ongoing',
                        name: enquiry.product || ('Project from ' + (enquiry.id || enquiryId)),
                        details: enquiry.details || '',
                        partner: (selectedNames && selectedNames.length>0) ? selectedNames[0] : (this.profile && this.profile.name ? this.profile.name : ''),
                        start: now,
                        eta: '',
                        end: '',
                        updated: now
                    };
                    this.projects = [proj, ...this.projects];
                });
        }

        this.closeListModal();
    }

    get isReqList() {
        return this.listModalType === 'req';
    }

    get isInterestedList() {
        return this.listModalType === 'interested';
    }

    // Possibilities helpers: compute render rows with counts and matching %
    get possibilitiesForRender() {
        return (this.possibilities || []).map(p => {
            const reqList = Array.isArray(p.req) ? p.req : (p.req ? String(p.req).split(',').map(s=>s.trim()).filter(Boolean) : []);
            const matchingList = Array.isArray(p.matching) ? p.matching : (p.matching ? String(p.matching).split(',').map(s=>s.trim()).filter(Boolean) : []);
            const matched = reqList.filter(r => matchingList.includes(r));
            const reqCount = reqList.length;
            const matchingCount = matchingList.length;
            const pct = reqCount > 0 ? Math.round((matched.length / reqCount) * 100) : 0;
            // determine if this HS (current profile) is marked interested for this possibility
            let interestedChecked = false;
            if (p.interested) {
                if (Array.isArray(p.interested)) {
                    // stored entries may include matching pct like "HS Name (72%)"; detect by startsWith
                    interestedChecked = p.interested.some(it => String(it).startsWith((this.profile && this.profile.name) || ''));
                } else {
                    const v = String(p.interested).toLowerCase();
                    interestedChecked = v === 'yes' || v === 'true' || (this.profile && String(p.interested).startsWith(this.profile.name));
                }
            }
            const status = p.status || (interestedChecked ? 'Interested' : 'Active');
            return { ...p, reqCount, matchingCount, matchingPct: pct, reqList, matchingList, enquiryId: p.enquiryId || '12344', interestedChecked, status };
        });
    }

    // Confirm-interest modal state
    confirmInterestModalOpen = false;
    confirmInterestTargetId = '';
    confirmInterestDesired = false;

    // User clicked the Interested checkbox; open confirm modal (prevent immediate toggle)
    openConfirmInterest(event) {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        const item = this.possibilities.find(p => p.id === id) || {};
        let currentChecked = false;
        if (item.interested) {
            if (Array.isArray(item.interested)) currentChecked = item.interested.includes(this.profile && this.profile.name);
            else currentChecked = String(item.interested).toLowerCase() === 'yes' || String(item.interested).toLowerCase() === 'true';
        }
        this.confirmInterestTargetId = id;
        this.confirmInterestDesired = !currentChecked; // user intends to toggle
        this.confirmInterestModalOpen = true;
    }

    closeConfirmInterest() {
        this.confirmInterestModalOpen = false;
        this.confirmInterestTargetId = '';
        this.confirmInterestDesired = false;
    }

    async confirmInterestYes() {
        if (!this.confirmInterestTargetId) {
            this.closeConfirmInterest();
            return;
        }
        const id = this.confirmInterestTargetId;
        const item = this.possibilities.find(p => p.id === id) || {};
        const matchingPct = item.matchingPct || (item.matching ? Math.round((Array.isArray(item.matching)?item.matching.length: String(item.matching).split(',').filter(Boolean).length) / (Array.isArray(item.req)?item.req.length: (item.req?String(item.req).split(',').filter(Boolean).length:1)) * 100) : 0);
        try{
            const updated = await markInterest({ enquiryId: id, hsName: this.profile && this.profile.name ? this.profile.name : this.profile.id, matchingPct: matchingPct, markInterested: this.confirmInterestDesired });
            const interested = (updated && Array.isArray(updated.interested)) ? updated.interested : ((updated && updated.interested) ? String(updated.interested).split(',').map(s=>s.trim()).filter(Boolean) : []);
            this.possibilities = this.possibilities.map(p => p.id === id ? { ...p, interested: interested, status: this.confirmInterestDesired ? 'Interested' : 'Active' } : p);
        }catch(err){
            // eslint-disable-next-line no-console
            console.error('markInterest failed', err);
            // fallback to local toggle
            this.possibilities = this.possibilities.map(p => p.id === id ? { ...p, interested: this.confirmInterestDesired ? 'Yes' : 'No' } : p);
        } finally {
            this.closeConfirmInterest();
        }
    }

    // Open req list for a possibility row
    openPossibilityReqList(event) {
        const id = event.currentTarget.dataset.id;
        const item = this.possibilities.find(p => p.id === id) || {};
        const list = Array.isArray(item.req) ? item.req : (item.req ? String(item.req).split(',').map(s=>s.trim()).filter(Boolean) : []);
        this.listModalType = 'req';
        this.listModalItems = list;
        this.listModalTitle = `Req Specialities`;
        this.isListModalOpen = true;
    }

    // Open matching list for a possibility row
    openPossibilityMatchingList(event) {
        const id = event.currentTarget.dataset.id;
        const item = this.possibilities.find(p => p.id === id) || {};
        const list = Array.isArray(item.matching) ? item.matching : (item.matching ? String(item.matching).split(',').map(s=>s.trim()).filter(Boolean) : []);
        this.listModalType = 'req';
        this.listModalItems = list;
        this.listModalTitle = ` Matching Specialities`;
        this.isListModalOpen = true;
    }

    connectedCallback() {
        // run async init without blocking lifecycle
        void this.initData();
    }

    async initData(){
        try{
            await Promise.all([
                this.loadSpecialities(),
                this.loadStatesAndCities()
            ]);
            const [profileName, userName] = await Promise.all([getCurrentUserProfileName(), getCurrentUserName()]);
            this.profileName = profileName || '';
            this.userName = userName || '';
            const n = (this.profileName || '').toLowerCase();
            this.isHealth = n.includes('health') || n.includes('health system');
            this.isSponsor = n.includes('sponsor') || n.includes('sponsors');
            // debug
            // eslint-disable-next-line no-console
            console.log('initData profileName,isHealth,isSponsor', this.profileName, this.isHealth, this.isSponsor);

            if (this.isSponsor) {
                await this.loadCurrentSponsorProfile();
                await this.loadEnquiriesFromServer();
                await this.loadProjectsForProfile();
            } else if (this.isHealth) {
                await this.loadCurrentHealthProfile();
                await this.loadPossibilitiesForHealth();
                await this.loadProjectsForProfile();
            } else {
                this.setupDummyData();
            }
            this.isLoaded = true;
        }catch(err){
            // fallback: treat as Health for demo
            // eslint-disable-next-line no-console
            console.error('Profile lookup failed', err);
            this.profileName = '';
            this.userName = '';
            this.isHealth = true;
            this.setupDummyData();
            this.isLoaded = true;
        }
    }

    async loadSpecialities(){
        try{
            const specs = await getSpecialities();
            const opts = (specs || []).map(sp => ({ label: sp.Name, value: sp.Name, checked: false }));
            this.reqOptions = opts.map(o => ({ ...o }));
            this.specialityOptions = opts.map(o => ({ ...o }));
        }catch(err){
            // eslint-disable-next-line no-console
            console.error('loadSpecialities failed, using defaults', err);
        }
    }

    async loadStatesAndCities(){
        try{
            const [states, cities] = await Promise.all([getStates(), getCities()]);
            this.stateMasterOptions = (states || []).map(s => ({ label: s.Name, value: s.Name }));
            this.cityMasterOptions = (cities || []).map(c => ({ label: c.Name, value: c.Name, stateName: (c.State__r && c.State__r.Name) ? c.State__r.Name : '' }));
        }catch(err){
            // eslint-disable-next-line no-console
            console.error('loadStatesAndCities failed', err);
        }
    }

    async loadCurrentSponsorProfile(){
        try{
            const s = await getCurrentSponsor();
            if(!s) return;
            this.profile = {
                id: s.id || '',
                userId: s.userId || null,
                name: s.name || '',
                username: s.username || s.email || '',
                firstName: s.firstName || '',
                lastName: s.lastName || '',
                contactPerson: s.contact || '',
                email: s.email || '',
                phone: s.phone || '',
                city: s.city || '',
                state: s.state || '',
                specialities: s.specialities || [],
                updated: new Date().toISOString().slice(0,10)
            };
        }catch(err){
            // eslint-disable-next-line no-console
            console.error('loadCurrentSponsorProfile failed', err);
        }
    }

    async loadCurrentHealthProfile(){
        try{
            const h = await getCurrentHealthSystem();
            if(!h) return;
            this.profile = {
                id: h.id || '',
                userId: h.userId || null,
                name: h.name || '',
                username: h.username || h.email || '',
                firstName: h.firstName || '',
                lastName: h.lastName || '',
                contactPerson: h.contact || '',
                email: h.email || '',
                phone: h.phone || '',
                city: h.city || '',
                state: h.state || '',
                specialities: h.specialities || [],
                updated: new Date().toISOString().slice(0,10)
            };
            this.ensureCityForState(this.profile.state);
        }catch(err){
            // eslint-disable-next-line no-console
            console.error('loadCurrentHealthProfile failed', err);
        }
    }

    async loadEnquiriesFromServer(){
        if(!this.isSponsor) return;
        try{
            const list = await getEnquiriesForCurrentSponsor();
            this.enquiries = (list || []).map(e => ({
                ...this.mapEnquiryFromServer(e)
            }));
        }catch(err){
            // eslint-disable-next-line no-console
            console.error('loadEnquiriesFromServer failed', err);
        }
    }

    // Load projects for the current sponsor from server and map into UI shape
    async loadProjectsForProfile(){
        if(!this.isSponsor && !this.isHealth) return;
        try{
            // eslint-disable-next-line no-console
            console.log('loadProjectsForProfile: fetching projects for profile', this.profile && this.profile.name, 'isHealth', this.isHealth, 'isSponsor', this.isSponsor);
            const records = await getProjects({ searchKey: null, statuses: [], industries: [], sortField: 'Last_Updated__c', sortOrder: 'desc' });
            // eslint-disable-next-line no-console
            console.log('loadProjectsForProfile: getProjects returned', (records || []).length);
            const profileName = this.profile && this.profile.name ? this.profile.name : null;
            const profileNameNorm = profileName ? String(profileName).trim().toLowerCase() : null;
            const keyField = this.isSponsor ? 'Sponsor_Name__c' : 'Health_System_Name__c';
            // inspect distinct values for keyField to help diagnose mismatches
            const distinct = new Set();
            // Collect and log raw values safely to handle Proxy/Array cases from Locker
            (records || []).slice(0,50).forEach((r, i) => {
                try {
                    const raw = r[keyField];
                    let v = '';
                    if (Array.isArray(raw)) {
                        v = raw.join(',');
                    } else if (raw && typeof raw === 'object') {
                        // try to stringify safe
                        try { v = JSON.stringify(raw); } catch (e) { v = String(raw); }
                    } else {
                        v = raw == null ? '' : String(raw).trim();
                    }
                    distinct.add(v);
                    // eslint-disable-next-line no-console
                    console.log('loadProjectsForProfile: record', i, 'rawType', Array.isArray(raw) ? 'array' : typeof raw, 'rawValue', raw, 'normalized', v);
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.warn('loadProjectsForProfile: failed to inspect record', i, e);
                }
            });
            // eslint-disable-next-line no-console
            console.log('loadProjectsForProfile: sample distinct values for', keyField, Array.from(distinct).slice(0,20));
            if(!profileName){
                this.projects = this.projects || [];
                return;
            }
            const rows = (records || []).map(r => {
                // build a normalized candidate string list from possible shapes
                const candidates = [];
                try {
                    const raw = r[keyField];
                    if (Array.isArray(raw)) {
                        raw.forEach(it => candidates.push(it == null ? '' : String(it)));
                    } else if (raw && typeof raw === 'object') {
                        try { candidates.push(JSON.stringify(raw)); } catch(e) { candidates.push(String(raw)); }
                    } else if (raw != null) {
                        candidates.push(String(raw));
                    }
                } catch(e) {
                    // ignore
                }
                // also try common alternate fields to be safe
                if (r.Sponsor_Name__c) candidates.push(String(r.Sponsor_Name__c));
                if (r.Health_System_Name__c) candidates.push(String(r.Health_System_Name__c));
                if (r.Health_System__c) candidates.push(String(r.Health_System__c));
                if (r.Health_System__r && r.Health_System__r.Name) candidates.push(String(r.Health_System__r.Name));

                // normalize candidates: trim, strip trailing matching pct like ' (72%)'
                const normCandidates = candidates.map(c => (c || '').replace(/\s*\(\d+%\)$/, '').trim().toLowerCase()).filter(Boolean);
                const matches = profileNameNorm && normCandidates.some(nc => nc === profileNameNorm || nc.startsWith(profileNameNorm));
                return matches ? r : null;
            }).filter(Boolean).map(r => ({
                id: r.Id,
                status: r.Status__c || 'Ongoing',
                name: r.Name || (r.Project_Id__c || ''),
                details: r.Project_Details__c || '',
                partner: this.isSponsor ? (r.Health_System_Name__c || r.Sponsor_Name__c || '') : (r.Sponsor_Name__c || r.Health_System_Name__c || ''),
                start: r.Start_Date__c || '',
                eta: r.ETA__c || '',
                end: r.End_Date__c || '',
                updated: r.Last_Updated__c || (new Date().toISOString().slice(0,10))
            }));
            // eslint-disable-next-line no-console
            console.log('loadProjectsForProfile: matched rows count', rows.length, 'keyField', keyField, 'profileName', profileName);
            this.projects = [...rows, ...(this.projects || []).filter(p => !rows.some(r => r.id === p.id))];
        }catch(err){
            // eslint-disable-next-line no-console
            console.error('loadProjectsForProfile failed', err);
        }
    }

    async loadPossibilitiesForHealth(){
        if(!this.isHealth) return;
        try{
            const list = await getAllActiveEnquiries();
            const profileSpecs = Array.isArray(this.profile.specialities) ? this.profile.specialities : (this.profile.specialities ? String(this.profile.specialities).split(',').map(s=>s.trim()).filter(Boolean) : []);
            const out = [];
            for(const e of (list || [])){
                const reqList = Array.isArray(e.req) ? e.req : (e.req ? String(e.req).split(',').map(s=>s.trim()).filter(Boolean) : []);
                const matching = reqList.filter(r => profileSpecs.includes(r));
                if(matching.length === 0) continue; // only include if at least one match
                const pct = reqList.length > 0 ? Math.round((matching.length / reqList.length) * 100) : 0;
                out.push({
                    id: e.id,
                    sponsor: e.sponsorName || 'Sponsor',
                    enquiryId: e.id,
                    status: e.status || 'Active',
                    product: e.product || '',
                    details: e.details || '',
                    req: reqList,
                    matching: matching,
                    interested: Array.isArray(e.interested) ? e.interested : (e.interested ? String(e.interested).split(',').map(s=>s.trim()).filter(Boolean) : []),
                    matchingPct: pct
                });
            }
            this.possibilities = out;
        }catch(err){
            // eslint-disable-next-line no-console
            console.error('loadPossibilitiesForHealth failed', err);
        }
    }

    mapEnquiryFromServer(e){
        return {
            id: e && e.id,
            status: (e && e.status) || 'Active',
            product: (e && e.product) || '',
            details: (e && e.details) || '',
            req: e && Array.isArray(e.req) ? e.req : [],
            interested: e && Array.isArray(e.interested) ? e.interested : [],
            updated: (e && e.lastUpdated) || new Date().toISOString().slice(0,10)
        };
    }

    /* Modal helpers */
    openAdd(event) {
        const type = event.currentTarget.dataset.type;
        this.modalType = type || 'project';
        this.modalMode = 'add';
        // init modalData with sensible defaults
        if (this.modalType === 'project') {
            this.modalData = { id: '', status: 'Ongoing', name: '', details: '', partner: '', start: '', eta: '', end: '', updated: '' };
        } else if (this.modalType === 'profile') {
            this.modalData = { id: '', name: '', username: '', specialities: [], state: '', city: '', contactPerson: '', email: '', phone: '', updated: '' };
        } else if (this.modalType === 'possibility') {
            this.modalData = { id: '', sponsor: '', product: '', details: '', req: '', matching: '', interested: '' };
        } else if (this.modalType === 'enquiry') {
            this.modalData = { id: '', product: '', details: '', req: [], status: 'Active' };
        }
        this.modalVisible = true;
        // sync req options
        if (this.modalType === 'enquiry') this.syncReqOptionsWithModal();
        if (this.modalType === 'profile') this.syncSpecialitiesOptionsWithModal();
    }

    // Open edit modal for a specific item
    openEdit(type, id) {
        this.modalType = type;
        this.modalMode = 'edit';
        let item = {};
        if (type === 'project') {
            item = this.projects.find((p) => p.id === id) || {};
        } else if (type === 'possibility') {
            item = this.possibilities.find((p) => p.id === id) || {};
        } else if (type === 'enquiry') {
            item = this.enquiries.find((e) => e.id === id) || {};
        } else if (type === 'profile') {
            item = this.profile || {};
        }
        this.modalData = { ...item };
        // ensure enquiry has status and req array shape when editing
        if (this.modalType === 'enquiry') {
            const status = this.modalData.status || 'Active';
            const req = Array.isArray(this.modalData.req) ? this.modalData.req : (this.modalData.req ? String(this.modalData.req).split(',').map(s=>s.trim()).filter(Boolean) : []);
            this.modalData = { ...this.modalData, req, status };
            this.syncReqOptionsWithModal();
        }
        // ensure profile has username and specialities in array shape when editing
        if (this.modalType === 'profile') {
            const username = this.modalData.username || this.modalData.email || '';
            const specialities = Array.isArray(this.modalData.specialities) ? this.modalData.specialities : (this.modalData.specialities ? String(this.modalData.specialities).split(',').map(s=>s.trim()).filter(Boolean) : []);
            this.modalData = { ...this.modalData, username, specialities };
            this.syncSpecialitiesOptionsWithModal();
            this.ensureCityForState(this.modalData.state);
        }
        this.modalVisible = true;
    }

    closeModal() {
        this.modalVisible = false;
        this.modalType = '';
        this.modalData = {};
    }

    stopModalPropagation(event) {
        event.stopPropagation();
    }

    handleInputChange(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;
        if (field) {
            // assign to reactive object
            this.modalData = { ...this.modalData, [field]: value };
            if(field === 'state'){
                this.ensureCityForState(value);
            }
        }
    }

    async saveModal() {
        const now = new Date().toISOString().slice(0, 10);
        if (this.modalMode === 'edit') {
            // update existing item
            if (this.modalType === 'project') {
                // Persist project edits to server
                try {
                    const payload = {
                        Id: this.modalData.id,
                        Name: this.modalData.name,
                        Status__c: this.modalData.status,
                        Project_Details__c: this.modalData.details,
                        Start_Date__c: this.modalData.start,
                        ETA__c: this.modalData.eta,
                        End_Date__c: this.modalData.end
                    };
                    // set partner fields according to current profile type
                    if (this.isSponsor) {
                        // as sponsor editing, partner is HS name
                        payload.Sponsor_Name__c = this.profile && this.profile.name ? this.profile.name : payload.Sponsor_Name__c;
                        payload.Health_System_Name__c = this.modalData.partner || payload.Health_System_Name__c;
                    } else if (this.isHealth) {
                        payload.Health_System_Name__c = this.profile && this.profile.name ? this.profile.name : payload.Health_System_Name__c;
                        payload.Sponsor_Name__c = this.modalData.partner || payload.Sponsor_Name__c;
                    } else {
                        // fallback: preserve existing partner mapping
                        if (this.modalData.partner) {
                            payload.Sponsor_Name__c = this.modalData.partner;
                        }
                    }
                    // eslint-disable-next-line no-console
                    console.log('saveModal: upserting project', payload);
                    const saved = await upsertProject({ project: payload });
                    if (saved) {
                        const sp = saved;
                        const projRow = {
                            id: sp.Id,
                            status: sp.Status__c || this.modalData.status || 'Ongoing',
                            name: sp.Name || this.modalData.name || '',
                            details: sp.Project_Details__c || this.modalData.details || '',
                            partner: this.isSponsor ? (sp.Health_System_Name__c || this.modalData.partner || '') : (sp.Sponsor_Name__c || this.modalData.partner || ''),
                            start: sp.Start_Date__c || this.modalData.start || '',
                            eta: sp.ETA__c || this.modalData.eta || '',
                            end: sp.End_Date__c || this.modalData.end || '',
                            updated: sp.Last_Updated__c || now
                        };
                        this.projects = this.projects.map((p) => p.id === projRow.id ? projRow : p);
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error('upsertProject (edit) failed', err);
                    // fallback to local update
                    this.projects = this.projects.map((p) => p.id === this.modalData.id ? { ...p, ...this.modalData, updated: now } : p);
                }
            } else if (this.modalType === 'profile') {
                this.profile = { ...this.profile, ...this.modalData, updated: now };
                // persist profile changes for Sponsor users
                if (this.isSponsor) {
                    const payload = {};
                    if (this.profile.userId) payload.userId = this.profile.userId;
                    if (this.profile.id) payload.sponsorId = this.profile.id;
                    if (this.profile.firstName != null) payload.firstName = this.profile.firstName;
                    if (this.profile.lastName != null) payload.lastName = this.profile.lastName;
                    if (this.profile.email != null) payload.email = this.profile.email;
                    if (this.profile.phone != null) payload.phone = this.profile.phone;
                    if (this.profile.name != null) payload.name = this.profile.name;
                    if (this.profile.city != null) payload.city = this.profile.city;
                    if (this.profile.state != null) payload.state = this.profile.state;
                    if (this.profile.contactPerson != null) payload.contact = this.profile.contactPerson;
                    if (this.profile.specialities != null) payload.specialities = this.profile.specialities;
                    // If a User record exists and a status is present, ensure User.IsActive is updated
                    if (payload.userId && (payload.status != null || this.profile && this.profile.status != null)) {
                        try {
                            const st = payload.status != null ? payload.status : (this.profile && this.profile.status ? this.profile.status : null);
                            const isActive = (st || '').toString().toLowerCase() !== 'inactive';
                            updateUserStatus({ userId: payload.userId, isActive: isActive, sponsorId: payload.sponsorId, status: st })
                                .catch(err => { console.error('updateUserStatus failed', err); });
                        } catch (e) {
                            console.error('updateUserStatus call failed', e);
                        }
                    }

                    updateUserAndSponsor({ payload })
                            .then(() => {
                                // success — Apex queues sponsor update; UI already updated
                            })
                            .catch(err => {
                                // eslint-disable-next-line no-console
                                console.error('updateUserAndSponsor failed', err);
                            });
                } else if (this.isHealth) {
                    const payload = {};
                    if (this.profile.userId) payload.userId = this.profile.userId;
                    if (this.profile.id) payload.healthSystemId = this.profile.id;
                    if (this.profile.name != null) payload.name = this.profile.name;
                    if (this.profile.email != null) payload.email = this.profile.email;
                    if (this.profile.phone != null) payload.phone = this.profile.phone;
                    if (this.profile.city != null) payload.city = this.profile.city;
                    if (this.profile.state != null) payload.state = this.profile.state;
                    if (this.profile.contactPerson != null) payload.contact = this.profile.contactPerson;
                    if (this.profile.specialities != null) payload.specialities = this.profile.specialities;
                    updateUserAndHealthSystem({ payload })
                        .then(() => {
                            // success — Apex queues HS update; UI already updated
                        })
                        .catch(err => {
                            // eslint-disable-next-line no-console
                            console.error('updateUserAndHealthSystem failed', err);
                        });
                }
            } else if (this.modalType === 'possibility') {
                this.possibilities = this.possibilities.map((p) => p.id === this.modalData.id ? { ...p, ...this.modalData } : p);
            } else if (this.modalType === 'enquiry') {
                const payload = {
                    id: this.modalData.id,
                    status: this.modalData.status || 'Active',
                    product: this.modalData.product,
                    details: this.modalData.details,
                    req: this.modalData.req,
                    interested: this.modalData.interested
                };
                try{
                    const saved = await upsertEnquiry({ payload });
                    const mapped = this.mapEnquiryFromServer(saved);
                    this.enquiries = this.enquiries.map((e) => e.id === mapped.id ? mapped : e);
                }catch(err){
                    // eslint-disable-next-line no-console
                    console.error('upsertEnquiry (edit) failed', err);
                }
            }
        } else {
            // add new item
            if (this.modalType === 'project') {
                const item = { ...this.modalData, updated: now };
                if (!item.id) item.id = this._genId('P');
                this.projects = [item, ...this.projects];
            } else if (this.modalType === 'profile') {
                this.profile = { ...this.profile, ...this.modalData, updated: now };
            } else if (this.modalType === 'possibility') {
                const item = { ...this.modalData, id: this.modalData.id || this._genId('POS') };
                this.possibilities = [item, ...this.possibilities];
            } else if (this.modalType === 'enquiry') {
                const payload = {
                    status: this.modalData.status || 'Active',
                    product: this.modalData.product,
                    details: this.modalData.details,
                    req: this.modalData.req,
                    interested: this.modalData.interested
                };
                try{
                    const saved = await upsertEnquiry({ payload });
                    const mapped = this.mapEnquiryFromServer(saved);
                    this.enquiries = [mapped, ...this.enquiries];
                }catch(err){
                    // eslint-disable-next-line no-console
                    try{ console.error('upsertEnquiry (add) failed', err, err?.body, err?.body?.message); }catch(e){ console.error('upsertEnquiry (add) failed (could not stringify error)', err); }
                    // surface a user-friendly message in UI later if needed
                }
            }
        }
        this.closeModal();
    }

    get isProjectModal() {
        return this.modalType === 'project';
    }

    get isProfileModal() {
        return this.modalType === 'profile';
    }

    get isPossibilityModal() {
        return this.modalType === 'possibility';
    }

    get isEnquiryModal() {
        return this.modalType === 'enquiry';
    }

    get isEnquiryEditMode() {
        return this.isEnquiryModal && this.modalMode === 'edit';
    }

    get modalTitle() {
        const base = (function(type, isHealth) {
            switch (type) {
                case 'project': return 'Project';
                case 'profile': return isHealth ? 'Health Profile' : 'Sponsor Profile';
                case 'possibility': return 'Possibility';
                case 'enquiry': return 'Enquiry';
                default: return '';
            }
        })(this.modalType, this.isHealth);
        return (this.modalMode === 'edit' ? 'Edit ' : 'Add ') + base;
    }

    _genId(prefix) {
        return `${prefix}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }

    filteredCitiesByState(stateValue){
        const normalized = (stateValue || '').trim().toLowerCase();
        return (this.cityMasterOptions || []).filter(c => {
            if(!normalized) return true;
            return (c.stateName || '').trim().toLowerCase() === normalized;
        });
    }

    ensureCityForState(stateValue){
        const filtered = this.filteredCitiesByState(stateValue);
        const currentCity = (this.modalData && this.modalData.city) ? this.modalData.city : '';
        const hasCurrent = filtered.some(c => c.value === currentCity);
        const nextCity = hasCurrent ? currentCity : (filtered[0]?.value || '');
        this.modalData = { ...this.modalData, city: nextCity };
    }

    setupDummyData() {
        if (this.isHealth) {
            this.projects = [
                { id: 'HS-P-001', status: 'Active', name: 'Hospital Outreach', details: 'Outreach program details', partner: 'Sponsor A', start: '2025-01-10', eta: '2025-04-10', end: '2025-04-10', updated: '2025-12-01' },
                { id: 'HS-P-002', status: 'Planned', name: 'Telehealth Pilot', details: 'Pilot for remote consultations', partner: 'Sponsor B', start: '2026-02-01', eta: '2026-05-01', end: '2026-05-01', updated: '2025-11-20' }
            ];

            this.profile = {
                id: 'HS-100',
                name: 'Health System Alpha',
                specialities: 'Cardiology, Oncology',
                city: 'Austin',
                state: 'TX',
                contactPerson: 'Dr. Jane Doe',
                email: 'contact@hs-alpha.org',
                phone: '+1-512-555-0100',
                updated: '2025-11-30'
            };

            this.possibilities = [
                { id: 'P-1', sponsor: 'Sponsor A', product: 'Product X', details: 'Clinical trial kit', req: 'Oncology', matching: 'Oncology', interested: 'No', enquiryId: 'E-101', status: 'Active' },
                { id: 'P-2', sponsor: 'Sponsor C', product: 'Product Y', details: 'Remote monitoring', req: 'Cardiology', matching: 'Cardiology', interested: 'Yes', enquiryId: 'E-102', status: 'Interested' },
                { id: 'P-3', sponsor: 'Sponsor B', product: 'Product Z', details: 'New diagnostic tool', req: 'Radiology,Neurology', matching: 'Radiology', interested: 'Yes', enquiryId: 'E-103', status: 'Completed' }
            ];
        }

        if (this.isSponsor) {
            this.projects = [
                { id: 'SP-P-100', status: 'Ongoing', name: 'Device Trial', details: 'Sponsor-led device evaluation', partner: 'HS Central', start: '2025-03-15', eta: '2025-03-15', end: '2025-06-15', updated: '2025-12-06' }
            ];

            this.profile = {
                id: 'SP-50',
                name: 'Sponsor Beta',
                specialities: '',
                city: 'San Diego',
                state: 'CA',
                contactPerson: 'John Smith',
                email: 'info@sponsorbeta.com',
                phone: '+1-619-555-0200',
                updated: '2025-12-02'
            };

            this.enquiries = [
                { id: 'E-900', product: 'Product X', details: 'Looking for oncology sites', req: ['Oncology'], interested: ['HS North'], status: 'Active' }
            ];
        }

        // If neither matched, provide generic demo data
        if (!this.isHealth && !this.isSponsor) {
            this.projects = [
                { id: 'P-000', status: 'Draft', name: 'Demo Project', details: 'Demo project details', partner: 'Partner Demo', start: '2025-12-01', eta: 'N/A', end: '2026-01-01', updated: '2025-12-01' }
            ];

            this.profile = {
                id: 'U-0',
                name: 'Demo User',
                specialities: '-',
                city: '-',
                state: '-',
                contactPerson: 'Demo Contact',
                email: '-',
                phone: '-',
                updated: '2025-12-01'
            };
        }
    }

    handleTabClick(event) {
        const tab = event.currentTarget.dataset.tab;
        if (tab) this.activeTab = tab;
    }

    get projectsTabClass() {
        return this.activeTab === 'Projects' ? 'tab active' : 'tab';
    }

    get myProfileTabClass() {
        return this.activeTab === 'MyProfile' ? 'tab active' : 'tab';
    }

    get possibilitiesTabClass() {
        return this.activeTab === 'Possibilities' ? 'tab active' : 'tab';
    }

    get enquiriesTabClass() {
        return this.activeTab === 'Enquiries' ? 'tab active' : 'tab';
    }

    get showProjects() {
        return this.activeTab === 'Projects';
    }

    get showMyProfile() {
        return this.activeTab === 'MyProfile';
    }

    get showPossibilities() {
        return this.activeTab === 'Possibilities' && this.isHealth;
    }

    get showEnquiries() {
        return this.activeTab === 'Enquiries' && this.isSponsor;
    }

    // Number of specialities for profile (used in My Profile count button)
    get profileSpecialitiesCount() {
        const s = this.profile && this.profile.specialities;
        if (!s) return 0;
        if (Array.isArray(s)) return s.length;
        return String(s).split(',').map(x => x.trim()).filter(Boolean).length;
    }

    get partnerHeader() {
        return this.isHealth ? 'Sponsor Name' : 'HS Name';
    }

    handleAction(event) {
        const id = event.currentTarget.dataset.id;
        const action = event.currentTarget.dataset.action;
        if (action === 'edit') {
            if (this.showProjects) {
                this.openEdit('project', id);
            } else if (this.showEnquiries) {
                this.openEdit('enquiry', id);
            } else if (this.showPossibilities) {
                this.openEdit('possibility', id);
            } else {
                this.openEdit('project', id);
            }
            return;
        }

        if (action === 'delete') {
            if (this.showProjects) {
                this.projects = this.projects.filter((p) => p.id !== id);
            } else if (this.showEnquiries) {
                deleteEnquiry({ enquiryId: id })
                    .catch(err => {
                        // eslint-disable-next-line no-console
                        console.error('deleteEnquiry failed', err);
                    })
                    .finally(() => {
                        this.enquiries = this.enquiries.filter((e) => e.id !== id);
                    });
            } else if (this.showPossibilities) {
                this.possibilities = this.possibilities.filter((p) => p.id !== id);
            }
            return;
        }
    }

    handleProfileAction(event) {
        const action = event.currentTarget.dataset.action;
        if (action === 'editProfile') {
            this.openEdit('profile');
        }
    }
}
