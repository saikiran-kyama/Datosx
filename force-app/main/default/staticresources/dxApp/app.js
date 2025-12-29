// ============================================
// DatosX Platform - Main Application Logic
// ============================================

// Configuration
const CONFIG = {
    credentials: {
        healthsystem: 'datosx@2025',
        sponsor: 'datosx@2025'
    },
    navigation: {
        healthsystem: [
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'capabilities', label: 'Capabilities', icon: '⚡' },
            { id: 'matches', label: 'Matches', icon: '🎯' },
            { id: 'projects', label: 'Projects', icon: '📁' },
            { id: 'messaging', label: 'Messaging', icon: '💬' },
            { id: 'documents', label: 'Documents', icon: '📄' },
            { id: 'legal', label: 'Legal', icon: '⚖️' }
        ],
        sponsor: [
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'capabilities', label: 'Capabilities', icon: '⚡' },
            { id: 'enquires', label: 'Enquires', icon: '❓' },
            { id: 'projects', label: 'Projects', icon: '📁' },
            { id: 'messaging', label: 'Messaging', icon: '💬' },
            { id: 'documents', label: 'Documents', icon: '📄' },
            { id: 'legal', label: 'Legal', icon: '⚖️' }
        ]
    }
};

// State Management
const AppState = {
    currentUser: null,
    currentRole: null,
    currentPage: null,
    
    init() {
        // Try to restore session from sessionStorage
        const stored = sessionStorage.getItem('dx_user');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.currentUser = data.username;
                this.currentRole = data.role;
            } catch (e) {
                console.error('Failed to restore session', e);
            }
        }
    },
    
    login(username, role) {
        this.currentUser = username;
        this.currentRole = role;
        sessionStorage.setItem('dx_user', JSON.stringify({ username, role }));
    },
    
    logout() {
        this.currentUser = null;
        this.currentRole = null;
        this.currentPage = null;
        sessionStorage.removeItem('dx_user');
    },
    
    isAuthenticated() {
        return !!this.currentUser;
    }
};

// Page Router
const Router = {
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    },
    
    goToLogin() {
        this.showPage('loginPage');
    },
    
    goToDashboard() {
        this.showPage('dashboardPage');
        Dashboard.render();
    }
};

// Login Handler
const Login = {
    init() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    },
    
    handleSubmit(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('loginError');
        
        // Validate credentials
        if (CONFIG.credentials[username] && CONFIG.credentials[username] === password) {
            // Success
            AppState.login(username, username);
            errorEl.style.display = 'none';
            Router.goToDashboard();
            
            // Notify parent window (if in iframe)
            this.notifyParent('login', { username, role: username });
        } else {
            // Error
            errorEl.textContent = 'Invalid credentials. Please try again.';
            errorEl.style.display = 'block';
            
            // Shake animation
            const card = document.querySelector('.login-card');
            card.classList.remove('shake');
            void card.offsetWidth; // Force reflow
            card.classList.add('shake');
        }
    },
    
    notifyParent(action, data) {
        if (window.parent !== window) {
            window.parent.postMessage({ action, data }, '*');
        }
    }
};

// Dashboard Handler
const Dashboard = {
    render() {
        if (!AppState.isAuthenticated()) {
            Router.goToLogin();
            return;
        }
        
        // Update title
        const title = AppState.currentRole === 'healthsystem' 
            ? 'Health System Dashboard' 
            : 'Sponsor Dashboard';
        document.getElementById('dashboardTitle').textContent = title;
        
        // Update user display
        const userLabel = AppState.currentRole === 'healthsystem' 
            ? 'Health System' 
            : 'Sponsor';
        document.getElementById('userDisplay').textContent = userLabel;
        
        // Render navigation
        this.renderNavigation();
        
        // Setup logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    },
    
    renderNavigation() {
        const navItems = CONFIG.navigation[AppState.currentRole] || [];
        const navContainer = document.getElementById('navItems');
        navContainer.innerHTML = '';
        
        navItems.forEach((item, index) => {
            const li = document.createElement('li');
            if (index === 0) li.classList.add('active'); // First item active by default
            
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = `${item.icon} ${item.label}`;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.id, li);
            });
            
            li.appendChild(a);
            navContainer.appendChild(li);
        });
        
        // Load first page by default
        if (navItems.length > 0) {
            this.navigateTo(navItems[0].id, navContainer.querySelector('li'));
        }
    },
    
    navigateTo(pageId, navElement) {
        // Update active nav item
        document.querySelectorAll('#navItems li').forEach(li => li.classList.remove('active'));
        if (navElement) navElement.classList.add('active');
        
        // Update content
        AppState.currentPage = pageId;
        this.loadContent(pageId);
        
        // Notify parent window (if in iframe)
        if (window.parent !== window) {
            window.parent.postMessage({ 
                action: 'navigate', 
                data: { page: pageId, role: AppState.currentRole } 
            }, '*');
        }
    },
    
    loadContent(pageId) {
        const contentArea = document.getElementById('contentArea');
        
        // Generate content based on page
        const content = this.getPageContent(pageId);
        contentArea.innerHTML = content;
    },
    
    getPageContent(pageId) {
        const role = AppState.currentRole;
        const roleLabel = role === 'healthsystem' ? 'Health System' : 'Sponsor';
        
        const templates = {
            overview: `
                <div class="page-content">
                    <div class="page-header">
                        <h2>📊 Overview</h2>
                        <p>Welcome to your ${roleLabel} dashboard</p>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; color: white;">
                            <h3 style="font-size: 18px; margin-bottom: 10px;">Active Projects</h3>
                            <p style="font-size: 36px; font-weight: bold;">12</p>
                        </div>
                        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 10px; color: white;">
                            <h3 style="font-size: 18px; margin-bottom: 10px;">Messages</h3>
                            <p style="font-size: 36px; font-weight: bold;">24</p>
                        </div>
                        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 10px; color: white;">
                            <h3 style="font-size: 18px; margin-bottom: 10px;">Documents</h3>
                            <p style="font-size: 36px; font-weight: bold;">48</p>
                        </div>
                    </div>
                </div>
            `,
            capabilities: `
                <div class="page-content">
                    <div class="page-header">
                        <h2>⚡ Capabilities</h2>
                        <p>Manage your ${roleLabel} capabilities</p>
                    </div>
                    <p style="color: #666;">Content for Capabilities page will be loaded here.</p>
                    <p style="color: #999; margin-top: 20px;">This is where you can manage and view your organizational capabilities, expertise areas, and service offerings.</p>
                </div>
            `,
            matches: `
                <div class="page-content">
                    <div class="page-header">
                        <h2>🎯 Matches</h2>
                        <p>View your potential matches</p>
                    </div>
                    <p style="color: #666;">Content for Matches page will be loaded here.</p>
                    <p style="color: #999; margin-top: 20px;">Discover potential collaboration opportunities and matching sponsors.</p>
                </div>
            `,
            enquires: `
                <div class="page-content">
                    <div class="page-header">
                        <h2>❓ Enquires</h2>
                        <p>Manage your enquiries</p>
                    </div>
                    <p style="color: #666;">Content for Enquires page will be loaded here.</p>
                    <p style="color: #999; margin-top: 20px;">View and respond to enquiries from potential partners.</p>
                </div>
            `,
            projects: `
                <div class="page-content">
                    <div class="page-header">
                        <h2>📁 Projects</h2>
                        <p>Manage your ${roleLabel} projects</p>
                    </div>
                    <p style="color: #666;">Content for Projects page will be loaded here.</p>
                    <p style="color: #999; margin-top: 20px;">View, create, and manage all your ongoing and completed projects.</p>
                </div>
            `,
            messaging: `
                <div class="page-content">
                    <div class="page-header">
                        <h2>💬 Messaging</h2>
                        <p>Your messages and conversations</p>
                    </div>
                    <p style="color: #666;">Content for Messaging page will be loaded here.</p>
                    <p style="color: #999; margin-top: 20px;">Communicate with your partners and collaborators.</p>
                </div>
            `,
            documents: `
                <div class="page-content">
                    <div class="page-header">
                        <h2>📄 Documents</h2>
                        <p>Manage your documents</p>
                    </div>
                    <p style="color: #666;">Content for Documents page will be loaded here.</p>
                    <p style="color: #999; margin-top: 20px;">Store, organize, and share important documents securely.</p>
                </div>
            `,
            legal: `
                <div class="page-content">
                    <div class="page-header">
                        <h2>⚖️ Legal</h2>
                        <p>Legal documents and agreements</p>
                    </div>
                    <p style="color: #666;">Content for Legal page will be loaded here.</p>
                    <p style="color: #999; margin-top: 20px;">Access contracts, agreements, and legal documentation.</p>
                </div>
            `
        };
        
        return templates[pageId] || '<p>Page not found</p>';
    },
    
    logout() {
        AppState.logout();
        Router.goToLogin();
        
        // Notify parent window
        if (window.parent !== window) {
            window.parent.postMessage({ action: 'logout' }, '*');
        }
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    AppState.init();
    Login.init();
    
    // Check if user is already logged in
    if (AppState.isAuthenticated()) {
        Router.goToDashboard();
    } else {
        Router.goToLogin();
    }
});

// Listen for messages from parent window (if in iframe)
window.addEventListener('message', (event) => {
    // Handle messages from parent window
    if (event.data.action === 'checkAuth') {
        const response = {
            action: 'authStatus',
            data: {
                authenticated: AppState.isAuthenticated(),
                user: AppState.currentUser,
                role: AppState.currentRole
            }
        };
        event.source.postMessage(response, event.origin);
    }
});
