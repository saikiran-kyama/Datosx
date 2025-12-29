# Health Systems LWC - Bootstrap Filter Implementation

## Overview
This implementation replaces the previous overlay-style filter with a Bootstrap-based inline filter panel that includes dropdown selections with checkboxes, search functionality, and a modern design.

## What's Changed

### 1. **HTML Template** (`healthSystems.html`)
- Replaced overlay filter with inline Bootstrap filter panel
- Added dropdown menus with checkbox selections
- Implemented search functionality for State and City filters
- Added individual "Reset" links for each filter
- Added "Clear All" and "Close" buttons
- Filter panel appears below the search bar when toggled

### 2. **JavaScript Controller** (`healthSystems.js`)
- Added checkbox state management for all filter options
- Implemented search filtering for State and City dropdowns
- Added individual reset functions for each filter
- Added "Clear All" functionality
- Filter options now track checked state
- Display text shows count of selected items

### 3. **CSS Styles** (`healthSystems.css`)
- Added Bootstrap-compatible filter panel styles
- Removed overlay and modal styles
- Added inline filter panel with border and shadow
- Styled filter header, body, and footer sections

### 4. **Bootstrap Static Resource**
- Created static resource structure for Bootstrap files
- Component loads Bootstrap CSS and JS dynamically when filter is shown

## File Structure
```
force-app/main/default/
├── lwc/
│   └── healthSystems/
│       ├── healthSystems.html         ✓ Updated
│       ├── healthSystems.js           ✓ Updated
│       ├── healthSystems.css          ✓ Updated
│       └── healthSystems.js-meta.xml
└── staticresources/
    ├── bootstrap/                     ✓ New
    │   ├── bootstrap/
    │   │   ├── bootstrap.min.css      → Add this file
    │   │   └── bootstrap.bundle.min.js → Add this file
    │   └── README.md
    ├── bootstrap.resource-meta.xml    ✓ New
    └── setup-bootstrap.ps1            ✓ New (Helper script)
```

## Setup Instructions

### Option 1: Automatic Setup (Recommended)

1. **Run the PowerShell script:**
   ```powershell
   cd force-app\main\default\staticresources
   .\setup-bootstrap.ps1
   ```

2. **Deploy to Salesforce:**
   ```bash
   sf project deploy start --source-dir force-app/main/default
   ```

### Option 2: Manual Setup

1. **Download Bootstrap:**
   - Go to https://getbootstrap.com/docs/5.3/getting-started/download/
   - Click "Download" under "Compiled CSS and JS"
   - Extract the ZIP file

2. **Copy Files:**
   - Copy `bootstrap.min.css` from `css` folder
   - Copy `bootstrap.bundle.min.js` from `js` folder
   - Place both in: `force-app\main\default\staticresources\bootstrap\bootstrap\`

3. **Deploy to Salesforce:**
   ```bash
   sf project deploy start --source-dir force-app/main/default
   ```

## Features

### Filter Panel Features:
✓ **Inline Display** - Filter appears below search bar (no overlay)
✓ **Dropdown Filters** - Each filter has its own dropdown with checkboxes
✓ **Multi-Select** - Select multiple options per filter
✓ **Search in Dropdowns** - State and City filters have search boxes
✓ **Selection Count** - Shows "X selected" when items are chosen
✓ **Individual Reset** - Each filter has its own reset link
✓ **Clear All** - Button to clear all filters at once
✓ **Apply Filter** - Button to apply selected filters
✓ **Close Button** - Hide the filter panel

### Available Filters:
- **Status** (Prospect, Partner)
- **State** (with search)
- **City** (with search)
- **mNDA** (Completed, Pending, Not Started)
- **LOI** (Completed, Pending, Not Started)
- **MSA** (Completed, Pending, Not Started)

## Usage

1. Click the "Filters" button to show/hide the filter panel
2. Click on any filter dropdown to see options
3. Check/uncheck options to select filters
4. Use search boxes in State/City to find specific values
5. Click "Select" to close dropdown (filters not applied yet)
6. Click "Filter" button at bottom to apply all selected filters
7. Click "Reset" next to any filter to clear just that filter
8. Click "Clear All" to reset all filters
9. Click "Close" to hide the filter panel

## Testing

1. **Deploy the component:**
   ```bash
   sf project deploy start --source-dir force-app/main/default
   ```

2. **Add to a Lightning page:**
   - Open Lightning App Builder
   - Add the `healthSystems` component
   - Save and activate

3. **Test the filters:**
   - Click "Filters" button
   - Select various filter options
   - Click "Filter" to apply
   - Verify data is filtered correctly
   - Test "Reset" and "Clear All" functions

## Troubleshooting

### Bootstrap not loading?
1. Verify files exist at correct path:
   - `staticresources/bootstrap/bootstrap/bootstrap.min.css`
   - `staticresources/bootstrap/bootstrap/bootstrap.bundle.min.js`
2. Check Static Resources in Salesforce Setup
3. Verify the static resource is named exactly `bootstrap`

### Dropdowns not working?
1. Ensure Bootstrap JS is loaded (check browser console)
2. Verify `bootstrap.bundle.min.js` includes Popper.js
3. Check for JavaScript errors in console

### Filters not applying?
1. Make sure to click the "Filter" button after selecting options
2. Check that data exists matching the filter criteria
3. Verify JavaScript filter logic in browser console

## Customization

### Add More Filter Options:
1. Add option to the array in JS (e.g., `statusOptions`)
2. HTML will automatically render the new option

### Change Filter Layout:
- Modify grid classes in HTML (`col-sm-6 col-lg-4`)
- Adjust in CSS for spacing and styling

### Add More Filters:
1. Create new options array in JS
2. Add new dropdown section in HTML
3. Add checkbox handler in JS
4. Update filter logic in `filteredData` getter

## Notes

- Bootstrap is loaded **only when filter panel is open** (performance optimization)
- Filter selections are **not persisted** on page reload
- Search in dropdowns is **case-insensitive**
- Multiple filters work with **AND logic** (all conditions must match)

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are deployed correctly
3. Ensure Bootstrap static resource is properly configured
4. Review Salesforce debug logs for server-side issues
