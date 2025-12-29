# DatosX Platform - Complete Implementation Guide

## 🎯 Overview

This implementation provides a **custom HTML-based application** with role-based login and navigation, hosted inside Salesforce Experience Cloud using the **Static Resource + iframe approach**.

### ✅ What's Included

- ✅ Custom login page with 2 user types (Health System & Sponsor)
- ✅ Role-based navigation (different menu items per role)
- ✅ Modern, responsive UI with smooth animations
- ✅ Iframe-based architecture (fully functional navigation)
- ✅ LWC wrapper component for Experience Cloud integration
- ✅ PostMessage API for iframe ↔ Salesforce communication

---

## 📁 Project Structure

```
force-app/main/default/
├── staticresources/
│   ├── dxApp/
│   │   ├── index.html      # Main HTML page
│   │   ├── app.js          # Application logic
│   │   └── styles.css      # Styling
│   ├── dxApp.resource      # Zipped static resource (auto-generated)
│   └── dxApp.resource-meta.xml
├── lwc/
│   └── dxAppContainer/     # LWC wrapper for iframe
│       ├── dxAppContainer.html
│       ├── dxAppContainer.js
│       ├── dxAppContainer.css
│       └── dxAppContainer.js-meta.xml
```

---

## 🚀 Setup Instructions

### Step 1: Package Static Resource

Run the setup script to create the zip file:

```powershell
.\setup-dx-app.ps1
```

This will create `dxApp.resource` from the `dxApp` folder.

### Step 2: Deploy to Salesforce

```bash
# Push to scratch org or sandbox
sfdx force:source:push

# Or deploy to production
sfdx force:source:deploy -p force-app/main/default
```

### Step 3: Add to Experience Cloud Site

1. Open **Experience Builder**
2. Navigate to the page where you want to add the app
3. Add the **DX App Container** component from the component list
4. Publish the site

### Step 4: Test Login

Navigate to your Experience Cloud site and test with these credentials:

| User Type      | Username       | Password      |
|----------------|----------------|---------------|
| Health System  | healthsystem   | datosx@2025   |
| Sponsor        | sponsor        | datosx@2025   |

---

## 🎨 User Experience

### Login Page
- Clean, modern login form
- Dropdown to select account type (Health System or Sponsor)
- Error handling with shake animation
- Demo credentials displayed for convenience

### Health System Dashboard

**Navigation Menu:**
- 📊 Overview
- ⚡ Capabilities
- 🎯 Matches
- 📁 Projects
- 💬 Messaging
- 📄 Documents
- ⚖️ Legal

### Sponsor Dashboard

**Navigation Menu:**
- 📊 Overview
- ⚡ Capabilities
- ❓ Enquires (different from Health System)
- 📁 Projects
- 💬 Messaging
- 📄 Documents
- ⚖️ Legal

---

## 🔧 Technical Details

### Architecture

```
┌─────────────────────────────────────┐
│   Experience Cloud Page (LWR)       │
│  ┌───────────────────────────────┐  │
│  │  DX App Container (LWC)       │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  <iframe>               │  │  │
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │ Static Resource   │  │  │  │
│  │  │  │ - index.html      │  │  │  │
│  │  │  │ - app.js          │  │  │  │
│  │  │  │ - styles.css      │  │  │  │
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Communication Flow

**iframe → Parent (Salesforce):**
```javascript
// Inside iframe (app.js)
window.parent.postMessage({ 
    action: 'login', 
    data: { username, role } 
}, '*');
```

**Parent → iframe:**
```javascript
// Inside LWC (dxAppContainer.js)
iframe.contentWindow.postMessage({ 
    action: 'checkAuth' 
}, '*');
```

### Session Management

- Uses `sessionStorage` for session persistence
- Survives page refreshes
- Clears on browser close
- Format: `{ username: 'healthsystem', role: 'healthsystem' }`

---

## 🎯 Navigation System

### Page Routing

All navigation happens **inside the iframe** without page reloads:

```javascript
// Router switches between pages
Router.showPage('dashboardPage');

// Content area updates dynamically
Dashboard.loadContent('overview');
```

### Role-Based Navigation

```javascript
const CONFIG = {
    navigation: {
        healthsystem: [...],
        sponsor: [...]
    }
};

// Different menus rendered based on role
const navItems = CONFIG.navigation[AppState.currentRole];
```

---

## 🔐 Security Notes

### Authentication
- **Current**: Client-side validation (demo purposes)
- **Production**: Replace with Salesforce OAuth or custom Apex authentication

### Credential Storage
- Stored in `sessionStorage` (client-side only)
- Not secure for production
- Recommend: Use Salesforce session/cookies

### iframe Communication
- Currently allows all origins (`'*'`)
- **Recommended**: Validate `event.origin` in production

```javascript
// Secure version
window.addEventListener('message', (event) => {
    if (event.origin !== 'https://yourdomain.force.com') return;
    // Process message
});
```

---

## 🎨 Customization Guide

### Adding New Pages

1. **Update Navigation Config** (`app.js`):
```javascript
const CONFIG = {
    navigation: {
        healthsystem: [
            // ... existing items
            { id: 'newpage', label: 'New Page', icon: '🆕' }
        ]
    }
};
```

2. **Add Page Template**:
```javascript
const templates = {
    newpage: `
        <div class="page-content">
            <div class="page-header">
                <h2>🆕 New Page</h2>
                <p>Description</p>
            </div>
            <p>Your content here</p>
        </div>
    `
};
```

### Styling

All styles are in `styles.css`. Key CSS variables for quick theming:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Colors */
--primary: #667eea;
--text-dark: #333;
--text-light: #666;
```

### Changing Credentials

Update in `app.js`:
```javascript
const CONFIG = {
    credentials: {
        healthsystem: 'your-password',
        sponsor: 'your-password'
    }
};
```

---

## 🚀 Advanced Features

### 1. Navigate to Salesforce Records

**From iframe:**
```javascript
window.parent.postMessage({ 
    action: 'goToRecord', 
    data: { recordId: '001...' } 
}, '*');
```

**LWC Handler:**
```javascript
navigateToRecord(recordId) {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: { recordId, actionName: 'view' }
    });
}
```

### 2. Load LWC Components (Lightning Out)

Add to `index.html`:
```html
<script src="/lightning/lightning.out.js"></script>
<script>
    $Lightning.use("c:myLightningOutApp", function() {
        $Lightning.createComponent(
            "c:myComponent",
            { recordId: "123" },
            "componentContainer",
            function(cmp) {
                console.log("Component created!");
            }
        );
    });
</script>
```

### 3. API Calls to Salesforce

```javascript
// Using session from parent
const sessionId = // get from parent postMessage
fetch('/services/data/v62.0/query?q=SELECT...', {
    headers: {
        'Authorization': `Bearer ${sessionId}`
    }
});
```

---

## 🐛 Troubleshooting

### Issue: Iframe shows blank page
- Check browser console for errors
- Verify static resource is deployed
- Check `iframeSrc` path in LWC

### Issue: Credentials not working
- Verify username/password in `app.js` CONFIG
- Check browser console for authentication errors

### Issue: Navigation not working
- Verify JavaScript is loading (check Network tab)
- Check for console errors
- Ensure `app.js` is included in static resource

### Issue: Styles not loading
- Verify `styles.css` is in the zip
- Check static resource is properly packaged
- Clear browser cache

---

## 📊 Testing Checklist

- [ ] Login page loads correctly
- [ ] Health System credentials work
- [ ] Sponsor credentials work
- [ ] Invalid credentials show error
- [ ] Dashboard loads after login
- [ ] Correct navigation items show per role
- [ ] Navigation between pages works
- [ ] Logout returns to login page
- [ ] Session persists on refresh
- [ ] Responsive design works on mobile

---

## 🎯 Next Steps

### Phase 1: Basic Functionality ✅
- [x] Login page
- [x] Role-based navigation
- [x] Basic dashboard UI
- [x] Session management

### Phase 2: Real Data Integration
- [ ] Connect to Salesforce data
- [ ] Load real projects/messages
- [ ] Implement search/filters
- [ ] Add CRUD operations

### Phase 3: Advanced Features
- [ ] Real-time messaging
- [ ] Document upload/download
- [ ] Notifications
- [ ] User profile management

---

## 📚 Resources

- [Lightning Out Documentation](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/lightning_out.htm)
- [Static Resources Guide](https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_resources.htm)
- [postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

---

## 🤝 Support

For questions or issues:
1. Check the troubleshooting section
2. Review browser console logs
3. Verify deployment steps

---

**Built with ❤️ for DatosX Platform**
