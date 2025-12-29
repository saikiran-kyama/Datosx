# Preclinic Theme - Color Reference Guide

## Primary Colors

### Primary Green
- **Hex**: `#3A7A63`
- **Usage**: Primary buttons, active states, links, checkboxes
- **Hover**: `#2d6150` (darker shade)

### Secondary Teal
- **Hex**: `#00D3C7`
- **Usage**: Secondary accents, highlights
- **Description**: Bright teal/cyan color for secondary elements

## Neutral Colors

### Light Backgrounds
- **Light**: `#F5F6F8` - Main background color
- **White**: `#FFFFFF` - Card backgrounds, form inputs

### Gray Scale (Most Used)
- **Gray-900**: `#0A1B39` - Headings, primary text
- **Gray-600**: `#545F74` - Secondary text
- **Gray-500**: `#6C7688` - Body text, default text color
- **Gray-400**: `#858D9C` - Muted text
- **Border**: `#E7E8EB` - Borders, dividers

## Status Colors

### Success
- **Hex**: `#27AE60`
- **Usage**: Success messages, positive actions

### Info
- **Hex**: `#2F80ED`
- **Usage**: Information messages, info badges

### Warning
- **Hex**: `#E2B93B`
- **Usage**: Warning messages, caution states

### Danger
- **Hex**: `#EF1E1E`
- **Usage**: Error messages, delete actions, forgot password link

## Box Shadows (Preclinic Standard)

### Default Shadow
```css
box-shadow: 0px 0px 35px 0px rgba(104, 134, 177, 0.15);
```
**Usage**: Cards, major containers

### Small Shadow
```css
box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.05);
```
**Usage**: Headers, navigation bars

### Large Shadow
```css
box-shadow: 0 0 45px 0 rgba(108, 118, 136, 0.2);
```
**Usage**: Modals, major dialogs

## Typography

### Font Family
```css
font-family: 'Inter', sans-serif;
```

### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Font Sizes
- **Base**: 0.875rem (14px)
- **Small**: 0.75rem (12px)
- **Large**: 1rem (16px)
- **Heading**: 1.5rem (24px)

## Border Radius

### Standard Radius
- **Small**: `0.25rem` (4px) - Checkboxes
- **Default**: `0.375rem` (6px) - Buttons, inputs
- **Medium**: `0.75rem` (12px) - Cards
- **Large**: `50%` - Pills, circular elements

## Spacing Scale

### Padding/Margin
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

## Interactive States

### Links
- **Default**: `#3A7A63` (primary)
- **Hover**: `#3A7A63` with underline
- **Danger Link**: `#EF1E1E`
- **Danger Link Hover**: `#b02a37`

### Buttons
- **Primary Background**: `#3A7A63`
- **Primary Hover**: `#2d6150` with translateY(-1px)
- **Secondary Background**: `#545F74`
- **Secondary Hover**: `#3B4961`

### Form Inputs
- **Border**: `#E7E8EB`
- **Focus Border**: `#3A7A63`
- **Focus Shadow**: `0 0 0 0.25rem rgba(58, 122, 99, 0.25)`
- **Placeholder**: `#6C7688` at 60% opacity

### Navigation
- **Default Text**: `#6C7688`
- **Hover Background**: `#F5F6F8`
- **Hover Text**: `#3A7A63`
- **Active Text**: `#3A7A63`
- **Active Border**: 3px bottom border in `#3A7A63`

## Usage Examples

### Primary Button
```css
.custom-button {
    background-color: #3A7A63;
    color: #FFFFFF;
    font-weight: 600;
    padding: 0.7rem 1rem;
    border-radius: 0.375rem;
}

.custom-button:hover {
    background-color: #2d6150;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
```

### Card Container
```css
.card {
    background: #FFFFFF;
    border: 1px solid #E7E8EB;
    border-radius: 0.75rem;
    box-shadow: 0px 0px 35px 0px rgba(104, 134, 177, 0.15);
}
```

### Input Field
```css
.form-control {
    border: 1px solid #E7E8EB;
    color: #0A1B39;
    border-radius: 0.375rem;
}

.form-control:focus {
    border-color: #3A7A63;
    box-shadow: 0 0 0 0.25rem rgba(58, 122, 99, 0.25);
}
```

## Gradient Examples (Used in Overview Dashboard)

### Purple Gradient
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Pink Gradient
```css
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### Blue Gradient
```css
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

---

**Note**: All colors and styles are based on the Preclinic Angular template design system. This ensures visual consistency across the entire DX platform.
