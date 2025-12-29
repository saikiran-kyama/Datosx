import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

import APEXCHARTS from '@salesforce/resourceUrl/apexcharts';
import HIGHCHARTS from '@salesforce/resourceUrl/highcharts';

export default class MySiteContainer extends LightningElement {
    rendered = false;

    // auth/navigation state
    user = null;
    role = null;
    currentPage = 'overview';

    renderedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        // Load chart libraries (used later if you render charts). Non-blocking for header/login.
        Promise.all([
            loadStyle(this, APEXCHARTS + '/apexcharts.css'),
            loadScript(this, APEXCHARTS + '/apexcharts.min.js'),
            loadScript(this, HIGHCHARTS + '/highcharts.js'),
            loadScript(this, HIGHCHARTS + '/exporting.js')
        ]).catch((err) => {
            // eslint-disable-next-line no-console
            console.warn('Chart libraries failed to load (non-fatal):', err);
        });

        // restore session if present
        try {
            const raw = sessionStorage.getItem('dx_user');
            if (raw) {
                const obj = JSON.parse(raw);
                this.user = obj.username;
                this.role = obj.role;
            }
        } catch (e) {
            // ignore
        }
    }

    // header events
    handleLogin(e) {
        const { username, role } = e.detail || {};
        this.user = username;
        this.role = role;
        this.currentPage = 'overview';
    }

    handleLogout() {
        this.user = null;
        this.role = null;
        this.currentPage = 'overview';
    }

    handleNavigate(e) {
        const { page } = e.detail || {};
        if (page) this.currentPage = page;
    }

    get isAuthenticated() {
        return !!this.user;
    }

    // content page helpers
    get isOverview() { return this.currentPage === 'overview'; }
    get isCapabilities() { return this.currentPage === 'capabilities'; }
    get isMatches() { return this.currentPage === 'matches'; }
    get isProjects() { return this.currentPage === 'projects'; }
    get isMessaging() { return this.currentPage === 'messaging'; }
    get isDocuments() { return this.currentPage === 'documents'; }
    get isLegal() { return this.currentPage === 'legal'; }
    get isEnquires() { return this.currentPage === 'enquires'; }
}
