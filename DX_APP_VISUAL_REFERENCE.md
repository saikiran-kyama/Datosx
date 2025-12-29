# 🎨 DatosX Platform - Visual Reference

## 📱 User Interface Preview

### 1. Login Page

```
┌─────────────────────────────────────────┐
│                                         │
│         🌐 DatosX Platform             │
│         Sign in to continue             │
│                                         │
│   ┌───────────────────────────────┐    │
│   │ Account Type ▼                │    │
│   │ Select Account Type           │    │
│   └───────────────────────────────┘    │
│                                         │
│   ┌───────────────────────────────┐    │
│   │ Password                      │    │
│   │ ••••••••••                    │    │
│   └───────────────────────────────┘    │
│                                         │
│   ┌───────────────────────────────┐    │
│   │      SIGN IN                  │    │
│   └───────────────────────────────┘    │
│                                         │
│   Demo Credentials:                     │
│   Health System: datosx@2025           │
│   Sponsor: datosx@2025                 │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Gradient purple background
- White card with shadow
- Dropdown for user selection
- Password field
- Demo credentials shown
- Shake animation on error

---

### 2. Health System Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│ Health System Dashboard          🧑 Health System  [Logout]   │
├────────────────────────────────────────────────────────────────┤
│ 📊 Overview  ⚡ Capabilities  🎯 Matches  📁 Projects  💬 ...  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   📊 Overview                                                  │
│   Welcome to your Health System dashboard                      │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│   │ Active       │  │ Messages     │  │ Documents    │       │
│   │ Projects     │  │              │  │              │       │
│   │              │  │              │  │              │       │
│   │    12        │  │    24        │  │    48        │       │
│   └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                 │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Navigation Items:**
1. 📊 **Overview** - Dashboard metrics
2. ⚡ **Capabilities** - HS capabilities management
3. 🎯 **Matches** - Potential sponsor matches (unique to HS)
4. 📁 **Projects** - Project management
5. 💬 **Messaging** - Communication center
6. 📄 **Documents** - Document management
7. ⚖️ **Legal** - Legal documents

---

### 3. Sponsor Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│ Sponsor Dashboard                    🧑 Sponsor    [Logout]   │
├────────────────────────────────────────────────────────────────┤
│ 📊 Overview  ⚡ Capabilities  ❓ Enquires  📁 Projects  💬 ... │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   📊 Overview                                                  │
│   Welcome to your Sponsor dashboard                            │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│   │ Active       │  │ Messages     │  │ Documents    │       │
│   │ Projects     │  │              │  │              │       │
│   │              │  │              │  │              │       │
│   │    12        │  │    24        │  │    48        │       │
│   └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                 │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Navigation Items:**
1. 📊 **Overview** - Dashboard metrics
2. ⚡ **Capabilities** - Sponsor capabilities
3. ❓ **Enquires** - Manage enquiries (unique to Sponsor)
4. 📁 **Projects** - Project management
5. 💬 **Messaging** - Communication center
6. 📄 **Documents** - Document management
7. ⚖️ **Legal** - Legal documents

---

## 🎯 Key Differences Between Dashboards

| Feature | Health System | Sponsor |
|---------|--------------|---------|
| **Unique Menu** | 🎯 Matches | ❓ Enquires |
| **Focus** | Finding sponsors | Receiving enquiries |
| **Use Case** | Outreach | Inbound interest |

---

## 🎨 Color Scheme

### Primary Colors
```
Purple Gradient:  #667eea → #764ba2
Text Dark:        #333
Text Light:       #666
Background:       #f5f5f7
White:            #ffffff
```

### Status Colors
```
Success:  #4facfe
Warning:  #f093fb
Error:    #f5576c
Info:     #667eea
```

---

## 📐 Layout Structure

### Login Page Layout
```
┌─────────────────────────┐
│   Centered Container    │
│   ┌─────────────────┐   │
│   │   Login Card    │   │
│   │   - Max 420px   │   │
│   │   - White BG    │   │
│   │   - Rounded     │   │
│   │   - Shadow      │   │
│   └─────────────────┘   │
└─────────────────────────┘
```

### Dashboard Layout
```
┌─────────────────────────────────┐
│         Header Bar               │ ← Logo, User, Logout
├─────────────────────────────────┤
│      Navigation Tabs             │ ← Horizontal menu
├─────────────────────────────────┤
│                                  │
│      Content Area                │ ← Dynamic content
│      - White background          │
│      - Rounded corners           │
│      - Shadow                    │
│      - Padding 30px              │
│                                  │
└─────────────────────────────────┘
```

---

## 🖱️ Interactive Elements

### Buttons

**Primary Button (Login)**
```css
Background: Linear gradient (purple)
Padding: 12px
Border-radius: 6px
Hover: Lift effect (translateY -2px)
```

**Secondary Button (Logout)**
```css
Background: Gray (#6c757d)
Padding: 8px 16px
Border-radius: 6px
Hover: Darker shade
```

### Navigation Tabs
```css
Normal:   Gray text, no border
Hover:    Purple text, light background
Active:   Purple text, bottom border (3px)
```

### Form Fields
```css
Border: 1px solid #ddd
Padding: 12px 15px
Border-radius: 6px
Focus: Purple border (#667eea)
```

---

## ✨ Animations

### 1. Login Card Fade-In
```css
@keyframes fadeIn {
    from: opacity 0, translateY -20px
    to:   opacity 1, translateY 0
}
Duration: 0.5s
```

### 2. Error Shake
```css
@keyframes shake {
    0%, 100%: translateX 0
    25%:      translateX -10px
    75%:      translateX +10px
}
Duration: 0.5s
```

### 3. Content Slide-In
```css
@keyframes slideIn {
    from: opacity 0, translateX -20px
    to:   opacity 1, translateX 0
}
Duration: 0.3s
```

### 4. Button Hover
```css
Hover: translateY -2px
       box-shadow increase
Transition: 0.3s
```

---

## 📱 Responsive Design

### Desktop (> 768px)
- Full navigation horizontal
- 3-column grid for cards
- Spacious padding

### Mobile (< 768px)
- Navigation wraps
- Single column cards
- Reduced padding
- Header stacks vertically

---

## 🎭 User Experience Flow

### Login Flow
```
1. Load Login Page
   ↓
2. Select Account Type (dropdown)
   ↓
3. Enter Password
   ↓
4. Click "Sign In"
   ↓
5a. SUCCESS → Dashboard loads (fade in)
5b. ERROR → Shake animation + error message
```

### Navigation Flow
```
1. Click Menu Item
   ↓
2. Tab becomes active (purple + underline)
   ↓
3. Content area updates (slide-in animation)
   ↓
4. No page reload!
```

### Logout Flow
```
1. Click Logout
   ↓
2. Session cleared
   ↓
3. Return to Login Page
```

---

## 🔄 State Management

### Session Data Structure
```javascript
{
    username: "healthsystem" | "sponsor",
    role: "healthsystem" | "sponsor"
}
```

### Storage
- **Method**: sessionStorage
- **Key**: "dx_user"
- **Format**: JSON string
- **Persistence**: Until browser closes

---

## 📊 Content Templates

### Overview Page
- Page header (title + description)
- 3 metric cards
- Gradient backgrounds per card
- Large numbers (36px)

### Standard Page
- Page header with icon
- Description text
- Placeholder content
- Consistent spacing

---

## 🎯 Accessibility

- ✅ Semantic HTML
- ✅ Label associations
- ✅ Focus states
- ✅ Color contrast (WCAG AA)
- ✅ Keyboard navigation
- ⚠️ Screen reader support (can be improved)

---

## 🔍 Browser Compatibility

**Tested & Supported:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Features Used:**
- CSS Grid
- CSS Flexbox
- sessionStorage
- postMessage API
- ES6+ JavaScript

---

## 📏 Dimensions

### Login Card
- Max-width: 420px
- Padding: 40px
- Border-radius: 12px

### Dashboard Content
- Padding: 30px (desktop)
- Padding: 15px (mobile)
- Border-radius: 12px
- Min-height: 500px

### Navigation
- Tab padding: 18px 24px
- Font-size: 14px
- Border-bottom: 3px (active)

---

**🎨 Use this as a reference for understanding the UI/UX design!**
