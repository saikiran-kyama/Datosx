import { LightningElement } from 'lwc';

const NAVS = {
    healthsystem: [
        { id: 'overview', label: 'Overview' },
        { id: 'capabilities', label: 'Capabilities' },
        { id: 'matches', label: 'Matches' },
        { id: 'projects', label: 'Projects' },
        { id: 'messaging', label: 'Messaging' },
        { id: 'documents', label: 'Documents' },
        { id: 'legal', label: 'Legal' }
    ],
    sponsor: [
        { id: 'overview', label: 'Overview' },
        { id: 'capabilities', label: 'Capabilities' },
        { id: 'enquires', label: 'Enquires' },
        { id: 'projects', label: 'Projects' },
        { id: 'messaging', label: 'Messaging' },
        { id: 'documents', label: 'Documents' },
        { id: 'legal', label: 'Legal' }
    ]
};

const CREDENTIALS = {
    healthsystem: 'datosx@2025',
    sponsor: 'datosx@2025'
};

export default class Header extends LightningElement {
    user = null;
    role = null;

    connectedCallback() {
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

    get isAuthenticated() {
        return !!this.user;
    }

    get navItems() {
        const items = NAVS[this.role] || [];
        // attach class for first item active by default
        return items.map((it, idx) => ({ ...it, class: idx === 0 ? 'active' : '' }));
    }

    onSubmit(event) {
        event.preventDefault();
        const username = this.template.querySelector('#username').value.trim();
        const password = this.template.querySelector('#password').value;
        const errEl = this.template.querySelector('[data-id="loginError"]');
        if (!username || !password) return;

        // simple client-side check for demo
        if (CREDENTIALS[username] && CREDENTIALS[username] === password) {
            this.user = username;
            this.role = username;
            sessionStorage.setItem('dx_user', JSON.stringify({ username: this.user, role: this.role }));
            if (errEl) { errEl.hidden = true; errEl.textContent = ''; }
            this.dispatchEvent(new CustomEvent('login', { detail: { username: this.user, role: this.role } }));
        } else {
            if (errEl) {
                errEl.hidden = false;
                errEl.textContent = 'Invalid username or password';
            }
            // small shake animation on the form
            const card = this.template.querySelector('.login-form');
            if (card) {
                card.classList.remove('shake');
                void card.offsetWidth;
                card.classList.add('shake');
            }
        }
    }

    onLogout() {
        sessionStorage.removeItem('dx_user');
        this.user = null;
        this.role = null;
        this.dispatchEvent(new CustomEvent('logout'));
    }

    onNavClick(e) {
        const li = e.target.closest('li[data-page]');
        if (!li) return;
        const page = li.getAttribute('data-page');
        // update active state visually
        this.template.querySelectorAll('li[data-page]').forEach(n => n.classList.remove('active'));
        li.classList.add('active');
        this.dispatchEvent(new CustomEvent('navigate', { detail: { page } }));
    }
}
