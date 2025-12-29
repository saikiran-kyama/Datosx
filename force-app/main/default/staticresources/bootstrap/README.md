# Bootstrap Static Resource Setup

## Instructions to Complete Setup

You need to download Bootstrap files and place them in the correct location.

### Step 1: Download Bootstrap

1. Go to https://getbootstrap.com/docs/5.3/getting-started/download/
2. Download the **Compiled CSS and JS** version (not the source files)
3. Extract the downloaded ZIP file

### Step 2: Copy Required Files

From the extracted Bootstrap folder, copy these two files:
- `bootstrap.min.css` (from the `css` folder)
- `bootstrap.bundle.min.js` (from the `js` folder)

### Step 3: Place Files in Static Resource

Copy both files to this location:
```
force-app/main/default/staticresources/bootstrap/bootstrap/
```

Your final structure should look like:
```
staticresources/
  ├── bootstrap/
  │   ├── bootstrap/
  │   │   ├── bootstrap.min.css
  │   │   └── bootstrap.bundle.min.js
  │   └── README.md
  └── bootstrap.resource-meta.xml
```

### Step 4: Deploy to Salesforce

After placing the files, you need to:

1. **Create a ZIP file** named `bootstrap.zip` containing the `bootstrap` folder
2. **Upload to Salesforce**:
   - Go to Setup → Static Resources → New
   - Name: `bootstrap`
   - Upload the `bootstrap.zip` file
   - Cache Control: Public
   - Click Save

OR use Salesforce CLI:
```bash
sf project deploy start --source-dir force-app/main/default/staticresources
```

### Alternative: Quick Setup with CDN (Development Only)

If you want to test quickly without downloading, you can temporarily modify the component to use CDN links, but this is NOT recommended for production.

## Verification

After deployment, your LWC component will load Bootstrap CSS and JS when the filter panel is opened.
