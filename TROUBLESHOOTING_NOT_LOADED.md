# 🔧 DatosX Platform - Troubleshooting "Not Loaded" Issue

## Problem: Component shows "not loaded" icon when dragged to Experience Cloud page

---

## ✅ Solution Applied

The following fixes have been implemented:

### 1. **Added Loading State**
- Shows spinner while iframe loads
- Provides user feedback

### 2. **Added Error Handling**
- Catches iframe load failures
- Shows detailed error message
- Includes retry button

### 3. **Fixed Height Issue**
- Changed from `100vh` to fixed `800px` height
- Experience Cloud doesn't always handle viewport height correctly
- Added min-height for better responsiveness

### 4. **Added Cache Buster**
- Appends timestamp to URL
- Prevents cached/stale content issues

### 5. **Added Debug Logging**
- Console logs to help identify issues
- Shows resource URL path

---

## 🚀 Deployment Steps

### Step 1: Deploy Updated Component

```bash
# Deploy the updated LWC component
sfdx force:source:push

# OR with force override
sfdx force:source:push --forceoverwrite
```

### Step 2: Refresh Experience Builder

1. Open Experience Builder
2. **Hard refresh** the page (Ctrl+Shift+R)
3. Remove the old component (if already added)
4. Re-add "DX App Container" component
5. Save and Publish

### Step 3: Clear Cache

```bash
# In browser:
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
```

---

## 🔍 Verification Checklist

### Check Static Resource is Deployed

```bash
# Verify file exists locally
Test-Path "force-app\main\default\staticresources\dxApp.resource"

# Check deployment status
sfdx force:source:status

# Deploy static resource if needed
sfdx force:source:deploy -p force-app/main/default/staticresources/dxApp.resource
sfdx force:source:deploy -p force-app/main/default/staticresources/dxApp.resource-meta.xml
```

### Check in Salesforce Org

1. Go to **Setup** → **Static Resources**
2. Find **dxApp** in the list
3. Verify:
   - ✅ Last Modified Date is recent
   - ✅ Size is ~5-6 KB
   - ✅ Cache Control is "Public"

### Test Direct Access

Try accessing the static resource directly:

```
# Replace YOUR_DOMAIN with your actual domain
https://YOUR_DOMAIN.force.com/resource/dxApp/index.html

# In Experience Cloud:
https://YOUR_COMMUNITY_URL/resource/dxApp/index.html
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Not Loaded" Icon Persists

**Possible Causes:**
- Static resource not deployed
- Wrong static resource name
- Cache issue

**Solutions:**
```bash
# 1. Re-deploy static resource
sfdx force:source:deploy -p force-app/main/default/staticresources --forceoverwrite

# 2. Verify resource name matches
# In LWC: import dxAppResource from '@salesforce/resourceUrl/dxApp';
# Static Resource API Name must be: dxApp

# 3. Clear Salesforce cache
# Setup → Session Settings → Clear Cache
```

### Issue 2: Blank iframe After Loading

**Check Browser Console:**
1. Open DevTools (F12)
2. Look for errors
3. Check Network tab for failed requests

**Common Errors:**
- **404 on index.html**: Static resource not properly packaged
- **CORS errors**: Normal for development, should work in production
- **CSP errors**: Content Security Policy blocking content

**Solution:**
```bash
# Re-package static resource
Compress-Archive -Path "force-app\main\default\staticresources\dxApp\*" -DestinationPath "force-app\main\default\staticresources\dxApp.zip" -Force
Rename-Item "force-app\main\default\staticresources\dxApp.zip" "dxApp.resource" -Force

# Deploy
sfdx force:source:push --forceoverwrite
```

### Issue 3: Component Not Showing in Experience Builder

**Check Meta XML:**
Verify `dxAppContainer.js-meta.xml` has:
```xml
<isExposed>true</isExposed>
<target>lightningCommunity__Page</target>
<target>lightningCommunity__Default</target>
```

**Solution:**
```bash
# Deploy meta file
sfdx force:source:deploy -p force-app/main/default/lwc/dxAppContainer

# Refresh Experience Builder (hard refresh)
```

### Issue 4: Height Too Small or Too Large

**Adjust in CSS:**
Edit `dxAppContainer.css`:
```css
.dx-iframe {
    height: 800px;  /* Change this value */
    min-height: 800px;
}
```

**Or Make Dynamic:**
Add to `dxAppContainer.js-meta.xml`:
```xml
<property name="height" type="Integer" default="800" label="Height (px)" />
```

### Issue 5: Works in Scratch Org But Not Production

**Check:**
1. Static resource deployed to production
2. LWC component deployed to production
3. Experience Cloud site published
4. User has access permissions

**Deploy to Production:**
```bash
sfdx force:source:deploy -p force-app/main/default -u production-alias
```

---

## 🔍 Debug Mode

Add this to your component for detailed debugging:

Edit `dxAppContainer.js`:

```javascript
renderedCallback() {
    console.log('=== DX App Container Debug ===');
    console.log('Resource URL:', dxAppResource);
    console.log('iframe src:', this.iframeSrc);
    console.log('isLoaded:', this.isLoaded);
    console.log('hasError:', this.hasError);
    
    const iframe = this.template.querySelector('iframe');
    if (iframe) {
        console.log('iframe element:', iframe);
        console.log('iframe.src:', iframe.src);
    }
}
```

---

## 📝 Deployment Verification Script

Save as `verify-deployment.ps1`:

```powershell
Write-Host "🔍 Verifying DatosX Platform Deployment..." -ForegroundColor Cyan

# Check local files
Write-Host "`n📁 Checking Local Files..." -ForegroundColor Yellow
$staticResource = Test-Path "force-app\main\default\staticresources\dxApp.resource"
$lwcJs = Test-Path "force-app\main\default\lwc\dxAppContainer\dxAppContainer.js"
$lwcHtml = Test-Path "force-app\main\default\lwc\dxAppContainer\dxAppContainer.html"

Write-Host "Static Resource: $staticResource" -ForegroundColor $(if($staticResource){"Green"}else{"Red"})
Write-Host "LWC JavaScript: $lwcJs" -ForegroundColor $(if($lwcJs){"Green"}else{"Red"})
Write-Host "LWC HTML: $lwcHtml" -ForegroundColor $(if($lwcHtml){"Green"}else{"Red"})

# Check deployment status
Write-Host "`n📦 Checking Deployment Status..." -ForegroundColor Yellow
sfdx force:source:status

Write-Host "`n✅ Verification Complete!" -ForegroundColor Green
Write-Host "Next: Run 'sfdx force:source:push' to deploy" -ForegroundColor Cyan
```

Run with:
```powershell
.\verify-deployment.ps1
```

---

## 🎯 Quick Fix Checklist

If component shows "not loaded":

- [ ] Run `sfdx force:source:push --forceoverwrite`
- [ ] Hard refresh Experience Builder (Ctrl+Shift+R)
- [ ] Remove and re-add component to page
- [ ] Publish Experience Cloud site
- [ ] Clear browser cache
- [ ] Check browser console for errors (F12)
- [ ] Verify static resource in Setup → Static Resources
- [ ] Try accessing `/resource/dxApp/index.html` directly

---

## 🆘 Still Not Working?

### Detailed Debug Steps:

1. **Check Browser Console:**
   ```
   F12 → Console tab
   Look for errors in red
   ```

2. **Check Network Tab:**
   ```
   F12 → Network tab
   Filter: "dxApp"
   Look for 404 or 500 errors
   ```

3. **Verify Resource URL:**
   ```javascript
   // Should see in console:
   DX App Resource URL: /resource/1731825785000/dxApp
   Full iframe src: /resource/1731825785000/dxApp/index.html?t=...
   ```

4. **Test Static Resource Directly:**
   ```
   Navigate to: https://YOUR-DOMAIN/resource/dxApp/index.html
   Should show login page
   ```

5. **Check Salesforce Setup:**
   ```
   Setup → Static Resources → dxApp
   Click "View File" - should download ZIP
   Extract and verify index.html, app.js, styles.css exist
   ```

---

## 📞 Emergency Rebuild

If nothing works, rebuild from scratch:

```powershell
# 1. Remove old resource
Remove-Item "force-app\main\default\staticresources\dxApp.resource"

# 2. Re-package
Compress-Archive -Path "force-app\main\default\staticresources\dxApp\*" -DestinationPath "force-app\main\default\staticresources\dxApp.zip" -Force
Rename-Item "force-app\main\default\staticresources\dxApp.zip" "dxApp.resource" -Force

# 3. Deploy everything
sfdx force:source:deploy -p force-app/main/default --forceoverwrite

# 4. Wait 2 minutes for platform cache to clear

# 5. Hard refresh Experience Builder
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Component loads without "not loaded" icon
2. ✅ Shows loading spinner briefly
3. ✅ iframe displays login page
4. ✅ Console shows: "DX App iframe loaded successfully"
5. ✅ No errors in browser console
6. ✅ Can interact with login form

---

**After deploying the fixes, follow the steps above to resolve the issue!**

Run: `sfdx force:source:push --forceoverwrite`
