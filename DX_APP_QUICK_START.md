# 🚀 DatosX Platform - Quick Start Guide

## ✅ What You Got

A complete **iframe-based custom application** with:

✅ **Login Page** with 2 user types  
✅ **Role-Based Dashboards** (Health System & Sponsor)  
✅ **Different Navigation Menus** per role  
✅ **Modern, Responsive UI**  
✅ **Session Management**  
✅ **LWC Wrapper Component** for Experience Cloud  

---

## 🎯 Login Credentials

| User Type      | Username       | Password      |
|----------------|----------------|---------------|
| **Health System** | `healthsystem` | `datosx@2025` |
| **Sponsor**       | `sponsor`      | `datosx@2025` |

---

## 📋 Navigation Menus

### Health System Dashboard
- 📊 Overview
- ⚡ Capabilities
- 🎯 **Matches** (unique to HS)
- 📁 Projects
- 💬 Messaging
- 📄 Documents
- ⚖️ Legal

### Sponsor Dashboard
- 📊 Overview
- ⚡ Capabilities
- ❓ **Enquires** (unique to Sponsor)
- 📁 Projects
- 💬 Messaging
- 📄 Documents
- ⚖️ Legal

---

## 🚀 Deployment Steps

### Step 1: Deploy to Salesforce

```bash
# Deploy to scratch org or sandbox
sfdx force:source:push

# OR deploy to specific org
sfdx force:source:deploy -p force-app/main/default -u your-org-alias
```

### Step 2: Add to Experience Cloud

1. Open **Experience Builder**
2. Go to any page (or create a new one)
3. From component list, drag **"DX App Container"**
4. Place it on the page (recommend full-width layout)
5. **Publish** the site

### Step 3: Test

1. Navigate to your Experience Cloud site
2. You'll see the login page
3. Select account type and enter password
4. Explore the different dashboards!

---

## 📁 What Was Created

```
force-app/main/default/
├── staticresources/
│   ├── dxApp.resource          ✅ Zipped HTML app
│   ├── dxApp.resource-meta.xml ✅ Metadata
│   └── dxApp/                  📁 Source files
│       ├── index.html          🌐 Main page
│       ├── app.js              ⚙️ Logic
│       └── styles.css          🎨 Styling
├── lwc/
│   └── dxAppContainer/         🔧 LWC wrapper
│       ├── dxAppContainer.html
│       ├── dxAppContainer.js
│       ├── dxAppContainer.css
│       └── dxAppContainer.js-meta.xml
```

---

## 🎨 How It Works

### Architecture

```
Experience Cloud Page
    └─► DX App Container (LWC)
         └─► <iframe>
              └─► Static Resource (HTML + JS + CSS)
                   ├─► Login Page
                   └─► Dashboard (Role-based)
```

### Navigation Flow

1. **Login** → Select user type → Enter password
2. **Validation** → Client-side check (can be replaced with Apex)
3. **Dashboard** → Loads role-specific navigation
4. **Pages** → Click menu items → Content updates (no reload!)
5. **Logout** → Returns to login page

### Session Management

- Uses `sessionStorage` to persist login
- Survives page refresh
- Clears on browser close
- Secure for demo, can be upgraded for production

---

## 🔄 Updating Content

### To Add a New Page

1. **Edit** `force-app/main/default/staticresources/dxApp/app.js`

2. **Add navigation item**:
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

3. **Add page template**:
```javascript
const templates = {
    newpage: `
        <div class="page-content">
            <div class="page-header">
                <h2>🆕 New Page</h2>
            </div>
            <p>Your content here</p>
        </div>
    `
};
```

4. **Re-zip and deploy**:
```powershell
Compress-Archive -Path "force-app\main\default\staticresources\dxApp\*" -DestinationPath "force-app\main\default\staticresources\dxApp.zip" -Force
Rename-Item -Path "force-app\main\default\staticresources\dxApp.zip" -NewName "dxApp.resource" -Force
sfdx force:source:push
```

---

## 🎯 Key Features

### ✅ Fully Functional iframe Navigation
- All page changes happen inside iframe
- No page reloads
- Smooth transitions
- Browser back/forward works within iframe

### ✅ PostMessage Communication
The iframe can communicate with Salesforce:

```javascript
// From iframe → Send message to parent
window.parent.postMessage({ 
    action: 'navigate', 
    data: { page: 'overview' } 
}, '*');

// In LWC → Receive message
handleMessage(event) {
    const { action, data } = event.data;
    console.log('Received:', action, data);
}
```

### ✅ Navigate to Salesforce Records
From within the iframe, you can trigger navigation to Salesforce records:

```javascript
// In iframe
window.parent.postMessage({ 
    action: 'goToRecord', 
    data: { recordId: '001...' } 
}, '*');

// LWC automatically handles it!
```

---

## 🔐 Security Considerations

### Current Implementation (Demo)
- ✅ Client-side credential validation
- ✅ SessionStorage for session
- ✅ Perfect for demos and prototypes

### For Production
- 🔒 Replace with Salesforce OAuth
- 🔒 Use Apex for authentication
- 🔒 Validate iframe origins
- 🔒 Use HttpOnly cookies for sessions

---

## 🐛 Troubleshooting

### Iframe shows blank page
```bash
# Check if static resource deployed
sfdx force:source:status

# Verify resource URL
/resource/dxApp/index.html
```

### Login not working
- Check browser console (F12)
- Verify credentials in `app.js` CONFIG
- Ensure JavaScript is loading

### Changes not showing
```powershell
# Clear cache and re-deploy
Remove-Item "force-app\main\default\staticresources\dxApp.resource"
Compress-Archive -Path "force-app\main\default\staticresources\dxApp\*" -DestinationPath "force-app\main\default\staticresources\dxApp.zip" -Force
Rename-Item "force-app\main\default\staticresources\dxApp.zip" "dxApp.resource"
sfdx force:source:push --forceoverwrite
```

---

## 📚 Documentation

For complete details, see:
- **DX_APP_IMPLEMENTATION_GUIDE.md** - Full technical documentation
- **setup-dx-app.ps1** - Automated setup script

---

## 🎉 What's Next?

### Phase 1: ✅ COMPLETED
- [x] Login page
- [x] Role-based navigation  
- [x] Dashboard UI
- [x] Session management

### Phase 2: Connect Real Data
- [ ] Load projects from Salesforce
- [ ] Display real messages
- [ ] Connect to Apex controllers
- [ ] Add CRUD operations

### Phase 3: Advanced Features
- [ ] Real-time messaging
- [ ] File upload/download
- [ ] Push notifications
- [ ] User profiles

---

## 💡 Tips

1. **Edit in VSCode** - All files in `dxApp/` folder can be edited directly
2. **Live Preview** - Open `index.html` in browser for quick testing
3. **Chrome DevTools** - Use F12 to debug iframe content
4. **Session Persist** - Login survives page refresh!

---

## 🤝 Need Help?

1. Check **DX_APP_IMPLEMENTATION_GUIDE.md** for detailed docs
2. Review browser console for errors
3. Verify deployment with `sfdx force:source:status`

---

**🎯 You're all set! Deploy and test your new platform!**

**Built with ❤️ for DatosX**
