import { LightningElement, track } from 'lwc';
import LOGO_URL from '@salesforce/resourceUrl/dxPlatformAssets';
import BACKGROUND_URL from '@salesforce/resourceUrl/dxPlatformAssets';

// Configuration
const CREDENTIALS = {
    'navin@optionmatrix.com': 'datosx@2025',
    'contact@optionmatrix.com': 'datosx@2025',
};

const NAVIGATION = {
    healthsystem: [
        { id: 'overview', label: 'Overview' },
        { id: 'capabilities', label: 'Capabilities' },
        { id: 'matches', label: 'Matches'},
        { id: 'projects', label: 'Projects'},
        { id: 'messaging', label: 'Messaging' },
        // { id: 'documents', label: 'Documents'},
        { id: 'legal', label: 'Legal' }
    ],
    sponsor: [
        { id: 'overview', label: 'Overview' },
        // { id: 'capabilities', label: 'Capabilities' },
        { id: 'enquires', label: 'Enquiries' },
        { id: 'projects', label: 'Projects' },
        { id: 'messaging', label: 'Messaging' },
        { id: 'documents', label: 'Legal' },
        // { id: 'legal', label: 'Legal' }
    ],
};

const PAGE_CONTENT = {
    healthsystem: {
        overview: `
            <div class="page-content">
                <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">📊 Overview</h2>
                <p style="color: #666; margin-bottom: 25px;">Welcome to your Health System dashboard</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; color: white;">
                        <h3 style="font-size: 18px; margin-bottom: 10px;">Active Projects</h3>
                        <p style="font-size: 36px; font-weight: bold; margin: 0;">12</p>
                    </div>
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 10px; color: white;">
                        <h3 style="font-size: 18px; margin-bottom: 10px;">Messages</h3>
                        <p style="font-size: 36px; font-weight: bold; margin: 0;">24</p>
                    </div>
                    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 10px; color: white;">
                        <h3 style="font-size: 18px; margin-bottom: 10px;">Documents</h3>
                        <p style="font-size: 36px; font-weight: bold; margin: 0;">48</p>
                    </div>
                </div>
            </div>
        `,
        // capabilities: `
        //     <div class="page-content">
        //         <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">⚡ Capabilities</h2>
        //         <p style="color: #666; margin-bottom: 20px;">Manage your Health System capabilities</p>
        //         <p style="color: #999;">This is where you can manage and view your organizational capabilities, expertise areas, and service offerings.</p>
        //     </div>
        // `,
        matches: `
            <div class="page-content">
                <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">🎯 Matches</h2>
                <p style="color: #666; margin-bottom: 20px;">View your potential matches</p>
                <p style="color: #999;">Discover potential collaboration opportunities and matching sponsors.</p>
            </div>
        `,
        // projects: `
        //     <div class="page-content">
        //         <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">📁 Projects</h2>
        //         <p style="color: #666; margin-bottom: 20px;">Manage your Health System projects</p>
        //         <p style="color: #999;">View, create, and manage all your ongoing and completed projects.</p>
        //     </div>
        // `,
        // messaging: `
        //     <div class="page-content">
        //         <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">💬 Messaging</h2>
        //         <p style="color: #666; margin-bottom: 20px;">Your messages and conversations</p>
        //         <p style="color: #999;">Communicate with your partners and collaborators.</p>
        //     </div>
        // `,
        // documents: `
        //     <div class="page-content">
        //         <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">📄 Documents</h2>
        //         <p style="color: #666; margin-bottom: 20px;">Manage your documents</p>
        //         <p style="color: #999;">Store, organize, and share important documents securely.</p>
        //     </div>
        // `,
        // legal: `
        //     <div class="page-content">
        //         <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">⚖️ Legal</h2>
        //         <p style="color: #666; margin-bottom: 20px;">Legal documents and agreements</p>
        //         <p style="color: #999;">Access contracts, agreements, and legal documentation.</p>
        //     </div>
        // `
    },
    sponsor: {
        overview: `
            <div class="page-content">
                <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">📊 Overview</h2>
                <p style="color: #666; margin-bottom: 25px;">Welcome to your Sponsor dashboard</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; color: white;">
                        <h3 style="font-size: 18px; margin-bottom: 10px;">Active Projects</h3>
                        <p style="font-size: 36px; font-weight: bold; margin: 0;">12</p>
                    </div>
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 10px; color: white;">
                        <h3 style="font-size: 18px; margin-bottom: 10px;">Messages</h3>
                        <p style="font-size: 36px; font-weight: bold; margin: 0;">24</p>
                    </div>
                    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 10px; color: white;">
                        <h3 style="font-size: 18px; margin-bottom: 10px;">Enquires</h3>
                        <p style="font-size: 36px; font-weight: bold; margin: 0;">36</p>
                    </div>
                </div>
            </div>
        `,
        capabilities: `
            <div class="page-content">
                <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">⚡ Capabilities</h2>
                <p style="color: #666; margin-bottom: 20px;">Manage your Sponsor capabilities</p>
                <p style="color: #999;">This is where you can manage and view your organizational capabilities and service offerings.</p>
            </div>
        `,
        // enquires: `
        //     <div class="page-content">
        //         <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">❓ Enquires</h2>
        //         <p style="color: #666; margin-bottom: 20px;">Manage your enquiries</p>
        //         <p style="color: #999;">View and respond to enquiries from potential partners.</p>
        //     </div>
        // `,
        projects: `
            <div class="page-content">
                <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">📁 Projects</h2>
                <p style="color: #666; margin-bottom: 20px;">Manage your Sponsor projects</p>
                <p style="color: #999;">View, create, and manage all your ongoing and completed projects.</p>
            </div>
        `,
        // messaging: `
        //     <div class="page-content">
        //         <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">💬 Messaging</h2>
        //         <p style="color: #666; margin-bottom: 20px;">Your messages and conversations</p>
        //         <p style="color: #999;">Communicate with your partners and collaborators.</p>
        //     </div>
        // `,
        documents: `
            <div class="page-content">
                <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">📄 Documents</h2>
                <p style="color: #666; margin-bottom: 20px;">Manage your documents</p>
                <p style="color: #999;">Store, organize, and share important documents securely.</p>
            </div>
        `,
        legal: `
            <div class="page-content">
                <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">⚖️ Legal</h2>
                <p style="color: #666; margin-bottom: 20px;">Legal documents and agreements</p>
                <p style="color: #999;">Access contracts, agreements, and legal documentation.</p>
            </div>
        `
    }
};

export default class DxPlatform extends LightningElement {
    @track username = '';
    @track password = '';
    @track errorMessage = '';
    @track isAuthenticated = false;
    @track currentRole = '';
    @track currentPage = 'overview';
    @track passwordClass = false; // For password visibility toggle
    @track rememberMe = false; // For remember me checkbox
    logoUrl = LOGO_URL + '/om_logo-rem.png';
    backgroundUrl = BACKGROUND_URL + '/Datcover.jpeg';

    // Computed property for password input type
    get passwordInputType() {
        return this.passwordClass ? 'text' : 'password';
    }

    get accountTypeOptions() {
        return [
            { label: 'Select Account Type', value: '' },
            { label: 'Health System', value: 'healthsystem' },
            { label: 'Sponsor', value: 'sponsor' }
        ];
    }

    connectedCallback() {
        // Set CSS variable for background image
        this.template.host.style.setProperty('--background-image', `url(${this.backgroundUrl})`);
        
        // Check if user is already logged in (sessionStorage)
        const stored = sessionStorage.getItem('dx_user');
        if (stored) {
            try {
                const userData = JSON.parse(stored);
                this.username = userData.username;
                this.currentRole = userData.role;
                this.isAuthenticated = true;
            } catch (e) {
                // Invalid data, ignore
            }
        }
    }

    get dashboardTitle() {
        if (this.currentRole === 'healthsystem' || this.currentRole === 'health-system') {
            return 'Health System Dashboard';
        } else if (this.currentRole === 'sponsor') {
            return 'Sponsor Dashboard';
        }
        return 'Dashboard';
    }

    get userDisplayName() {
        if (this.currentRole === 'healthsystem' || this.currentRole === 'health-system') {
            return 'Health System';
        } else if (this.currentRole === 'sponsor') {
            return 'Sponsor';
        }
        return 'User';
    }

    get navigationItems() {
        const navKey = this.currentRole === 'health-system' ? 'healthsystem' : this.currentRole;
        const items = NAVIGATION[navKey] || NAVIGATION['healthsystem'] || [];
        return items.map((item, index) => ({
            ...item,
            class: item.id === this.currentPage ? 'nav-item active' : 'nav-item'
        }));
    }

    get isOverviewPage() {
        return this.currentPage === 'overview';
    }

    get isProjectsPage(){
        return this.currentPage === 'projects';
    }

    get showHealthSystemProjects() {
        return this.isProjectsPage && (this.currentRole === 'healthsystem' || this.currentRole === 'health-system');
    }

    get showSponsorProjects() {
        return this.isProjectsPage && this.currentRole === 'sponsor';
    }

    get isMatchesPage() {
        return this.currentPage === 'matches';
    }

    get isDocumentsPage() {
        return this.currentPage === 'documents';
    }

    get isCapabilitiesPage() {
        return this.currentPage === 'capabilities';
    }

    get isMessagingPage() {
        return this.currentPage === 'messaging';
    }

    get isLegalPage() {
        return this.currentPage === 'legal';
    }

    get isEnquiresPage() {
        return this.currentPage === 'enquires';
    }



    get currentPageContent() {
        const navKey = this.currentRole === 'health-system' ? 'healthsystem' : this.currentRole;
        return PAGE_CONTENT[navKey]?.[this.currentPage] ;
        //|| '<p>Page not found</p>'
    }

    // Toggle password visibility
    togglePassword() {
        this.passwordClass = !this.passwordClass;
    }

    handleRememberMeChange(event) {
        this.rememberMe = event.target.checked;
    }

    handleUsernameChange(event) {
        this.username = event.target.value;
        this.errorMessage = '';
    }

    handleAccountTypeChange(event) {
        this.username = event.detail.value;
        this.errorMessage = '';
        console.log('Account Type Selected:', this.username);
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
        this.errorMessage = '';
    }

    handleLogin(event) {
        event.preventDefault();
        
        console.log('Login attempt:', {
            username: this.username,
            password: this.password,
            expectedPassword: CREDENTIALS[this.username]
        });
        
        // Validate inputs
        if (!this.username || !this.password) {
            this.errorMessage = 'Please enter username and password.';
            return;
        }
        
        // Validate credentials
        if (CREDENTIALS[this.username] && CREDENTIALS[this.username] === this.password) {
            // Success - Map email to role
            let role = '';
            if (this.username === 'navin@optionmatrix.com') {
                role = 'healthsystem';
            } else if (this.username === 'contact@optionmatrix.com') {
                role = 'sponsor';
            }
            
            console.log('Login successful!');
            this.isAuthenticated = true;
            this.currentRole = role;
            this.currentPage = 'overview';
            this.errorMessage = '';
            
            // Save to sessionStorage
            sessionStorage.setItem('dx_user', JSON.stringify({
                username: this.username,
                role: this.currentRole
            }));
        } else {
            // Error
            console.error('Login failed - Invalid credentials');
            this.errorMessage = 'Invalid username or password';
        }
    }

    handleLogout() {
        this.isAuthenticated = false;
        this.username = '';
        this.password = '';
        this.currentRole = '';
        this.currentPage = 'overview';
        this.errorMessage = '';
        this.passwordClass = false;
        
        // Clear sessionStorage
        sessionStorage.removeItem('dx_user');
    }

    handleNavClick(event) {
        const navItem = event.currentTarget;
        const pageId = navItem.dataset.page;
        
        if (pageId) {
            this.currentPage = pageId;
        }
    }

    get showHealthSystems() {
        return this.currentRole === 'healthsystem' && this.isOverviewPage;
    }

    get showSponsor() {
        return this.currentRole === 'sponsor' && this.isOverviewPage;
    }

    


    
}
