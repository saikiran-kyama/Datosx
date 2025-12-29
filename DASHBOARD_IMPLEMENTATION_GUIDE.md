# Dashboard Implementation Guide - Angular to LWC Conversion

## Overview
This guide explains how to convert the Angular dashboard HTML to Salesforce Lightning Web Components (LWC).

## Key Differences Between Angular and LWC

### 1. **Template Syntax**
| Angular | LWC |
|---------|-----|
| `[property]="value"` | `property={value}` |
| `(event)="handler()"` | `onevent={handler}` |
| `*ngIf="condition"` | `if:true={condition}` |
| `*ngFor="let item of items"` | `for:each={items} for:item="item"` |
| `[routerLink]="route"` | `onclick={navigationHandler}` |

### 2. **Image References in LWC**

#### Option A: Upload Individual Image Files
1. Navigate to **Setup → Static Resources**
2. Click **New**
3. Upload each background image (bg-01.svg, bg-02.svg, etc.)
4. Name them: `bg01`, `bg02`, `bg03`, `bg04`
5. In your JavaScript, import them:
```javascript
import BG_01 from '@salesforce/resourceUrl/bg01';
import BG_02 from '@salesforce/resourceUrl/bg02';
```

#### Option B: Upload as a Folder (Recommended)
1. Create a folder structure like:
```
dashboard-assets/
  └── img/
      └── bg/
          ├── bg-01.svg
          ├── bg-02.svg
          ├── bg-03.svg
          └── bg-04.svg
```
2. Zip the folder
3. Upload to Static Resources as `dashboardAssets`
4. Reference in JS:
```javascript
import ASSETS from '@salesforce/resourceUrl/dashboardAssets';

get bgImage01() {
    return ASSETS + '/img/bg/bg-01.svg';
}
```

#### Option C: Use Existing Bootstrap Static Resource
If your images are already in the bootstrap static resource:
```javascript
import BOOTSTRAP from '@salesforce/resourceUrl/bootstrap';

get bgImage01() {
    return BOOTSTRAP + '/assets/img/bg/bg-01.svg';
}
```

### 3. **Loading Bootstrap CSS in LWC**

Bootstrap cannot be loaded via `<link>` tag in LWC. Use `platformResourceLoader`:

```javascript
import { loadStyle } from 'lightning/platformResourceLoader';
import BOOTSTRAP_CSS from '@salesforce/resourceUrl/bootstrap';

connectedCallback() {
    loadStyle(this, BOOTSTRAP_CSS + '/bootstrap/bootstrap.min.css')
        .then(() => {
            console.log('Bootstrap loaded');
        })
        .catch(error => {
            console.error('Error loading Bootstrap', error);
        });
}
```

### 4. **Charts in LWC**

The Angular code uses ApexCharts. For LWC, you have several options:

#### Option A: Chart.js (Recommended)
1. Download Chart.js from https://www.chartjs.org/
2. Upload to Static Resources as `chartjs`
3. Load in component:
```javascript
import CHARTJS from '@salesforce/resourceUrl/chartjs';

renderedCallback() {
    if (this.chartInitialized) return;
    this.chartInitialized = true;
    
    loadScript(this, CHARTJS)
        .then(() => {
            this.initializeCharts();
        });
}

initializeCharts() {
    const chart1 = this.template.querySelector('[lwc:ref="chart1"]');
    if (chart1 && window.Chart) {
        new Chart(chart1, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar'],
                datasets: [{
                    data: [12, 19, 3],
                    backgroundColor: '#0d6efd'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}
```

#### Option B: Lightning Chart (Built-in)
Use `lightning-chart` component (limited features):
```html
<lightning-chart
    type="bar"
    title="Physicians Trend"
    chart-data={chartData}>
</lightning-chart>
```

#### Option C: LWC Open Source Charts
Install community packages like `c-chart` from npm.

### 5. **Navigation in LWC**

Replace Angular's `[routerLink]` with LWC Navigation:

```javascript
import { NavigationMixin } from 'lightning/navigation';

export default class Dashboard extends NavigationMixin(LightningElement) {
    navigateToDoctors() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Doctor_Grid' // Your tab API name
            }
        });
    }
    
    // Or navigate to a record page
    navigateToRecord(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }
    
    // Or navigate to a custom LWC page
    navigateToCustomPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__YourComponentName'
            }
        });
    }
}
```

## Step-by-Step Implementation

### Step 1: Upload Static Resources

1. **Bootstrap** (if not already uploaded):
   ```
   force-app/main/default/staticresources/bootstrap.resource-meta.xml
   force-app/main/default/staticresources/bootstrap/ (folder)
   ```

2. **Background Images**:
   - Create a zip file with your images
   - Upload to Static Resources

3. **Chart.js** (optional):
   - Download from https://cdn.jsdelivr.net/npm/chart.js
   - Upload to Static Resources

### Step 2: Update Component Files

Files updated:
- `dashboard.html` - Template with LWC syntax
- `dashboard.js` - Controller with imports and methods
- `dashboard.css` - Styling (Bootstrap classes replicated)

### Step 3: Configure Meta XML

Ensure `dashboard.js-meta.xml` has proper targets:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>58.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
        <target>lightning__HomePage</target>
        <target>lightning__RecordPage</target>
    </targets>
</LightningComponentBundle>
```

### Step 4: Deploy and Test

```powershell
# Deploy to your org
sfdx force:source:deploy -p force-app/main/default/lwc/dashboard -u yourOrgAlias

# Or push to scratch org
sfdx force:source:push
```

### Step 5: Add to Page

1. Go to **Setup → Lightning App Builder**
2. Edit or create a page
3. Drag the **dashboard** component onto the page
4. Save and activate

## Common Issues and Solutions

### Issue 1: Images Not Showing
**Solution**: Check the path and ensure the static resource is deployed:
```javascript
// Verify the path in browser console
console.log('Image path:', this.bgImage01);
```

### Issue 2: Bootstrap Styles Not Applied
**Solution**: 
- Ensure Bootstrap CSS is loaded before rendering
- Check browser console for loading errors
- Verify static resource name matches import

### Issue 3: Charts Not Rendering
**Solution**:
- Load Chart.js in `renderedCallback`, not `connectedCallback`
- Use `lwc:ref` to get canvas element
- Check if Chart.js is loaded: `console.log(window.Chart)`

### Issue 4: Navigation Not Working
**Solution**:
- Verify tab/page API names
- Ensure component extends `NavigationMixin`
- Check user permissions for target pages

## Best Practices

1. **Use CSS Variables**: Define colors in CSS for easy theming
2. **Lazy Load**: Load heavy libraries only when needed
3. **Error Handling**: Always add `.catch()` to promises
4. **Responsive Design**: Test on mobile devices
5. **Accessibility**: Add proper ARIA labels and alt text
6. **Performance**: Minimize chart re-renders

## Additional Resources

- [LWC Developer Guide](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
- [Static Resources](https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_resources.htm)
- [Navigation Service](https://developer.salesforce.com/docs/component-library/bundle/lightning-navigation/documentation)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

## Next Steps

1. Upload your background images to Static Resources
2. Choose and implement a charting solution
3. Configure navigation targets
4. Fetch real data from Salesforce (Apex controllers)
5. Add error handling and loading states
6. Test responsive behavior
7. Add unit tests

