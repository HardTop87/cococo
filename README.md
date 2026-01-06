# Triple C Labs Marketing Website

**Modern, GDPR-compliant marketing website with advanced cookie consent management, Google Analytics 4 integration, and HubSpot forms.**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Cookie Consent System](#cookie-consent-system)
- [Google Analytics Integration](#google-analytics-integration)
- [HubSpot Forms Integration](#hubspot-forms-integration)
- [Responsive Design](#responsive-design)
- [Deployment](#deployment)
- [Testing](#testing)
- [Compliance](#compliance)
- [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

This is a static marketing website for Triple C Labs, an Integration Platform as a Service (iPaaS) provider. The site features:

- **GDPR-compliant cookie consent** with Silktide framework
- **Google Analytics 4** with Consent Mode v2
- **HubSpot forms** for lead generation
- **Responsive design** optimized for desktop, tablet, and mobile
- **Modern UI/UX** with CoCoCo branding (Berry & Pig colors)

**Live URL:** `https://wearecococo.com` (when deployed)  
**Test Environment:** Localhost or GitHub Pages

---

## 🛠 Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **HTML5** | Structure | - |
| **CSS3** | Styling with CSS Variables | - |
| **Vanilla JavaScript** | Interactivity & Cookie Management | ES6+ |
| **Silktide Consent Manager** | Cookie Banner Framework | Custom |
| **Google Analytics 4** | Web Analytics | GA4 (gtag.js) |
| **HubSpot** | Forms & CRM | Portal: 144439007 |
| **GitHub Pages** | Hosting (optional) | - |

**No build tools required** - Pure static HTML/CSS/JS for maximum simplicity and performance.

---

## 📁 Project Structure

```
/
├── ========== MAIN PAGES ==========
├── index.html                          # Homepage
├── about_us.html                       # About/Company page
├── platform.html                       # Platform overview
├── features.html                       # Features list
├── pricing.html                        # Pricing plans (VAT modal)
├── contact.html                        # Contact form (HubSpot)
├── newsletter.html                     # Newsletter signup
├── careers.html / jobs.html            # Career pages
├── faq.html                            # FAQ page
│
├── ========== SOLUTIONS ==========
├── solutions_developers.html           # Developer solutions
├── solutions_production.html           # Production overview
├── solutions_production-livedashboard.html  # Live dashboard
├── solutions_workflow.html             # Workflow automation
├── solutions_leadership.html           # Leadership overview
├── solutions_leadership-oee.html       # OEE tracking
├── solutions_leadership-pl.html        # Production line mgmt
├── solutions_leadership-scalability.html  # Scalability
├── solutions_oem.html                  # OEM solutions
├── solutions_partners.html             # Partner solutions
│
├── ========== TECHNICAL/FEATURES ==========
├── integration.html                    # Integration capabilities
├── automation.html                     # Automation features
├── data_model.html                     # Data model
├── custom_apps.html                    # Custom applications
├── custom_apps_simulation.html         # App simulation
├── dashboard.html                      # Dashboard features
├── upcoming_features.html              # Roadmap
│
├── ========== DEMOS/INTERACTIVE ==========
├── openinfra_demo.html                 # OpenInfra demo
├── openinfra_globe.html                # Interactive globe
├── platform_whitelabel_demo.html       # White-label demo
├── data_flow_animation.html            # Data flow animation
├── hero-widget.html                    # Hero widget demo
├── developer_pipeline.html             # Pipeline visualization
├── approval_app.html                   # Approval workflow
├── imposition_inspector.html           # Imposition tool
│
├── ========== LEGAL/COMPLIANCE ==========
├── privacy.html                        # Privacy Policy (GDPR)
├── terms.html                          # Terms of Service
├── imprint.html                        # Legal imprint
│
├── ========== STYLES & SCRIPTS ==========
├── style.css                           # Main stylesheet (Sofia Sans, Pig/Berry theme)
├── script.js                           # Global JS (navigation, modals)
├── config.js                           # Site configuration
│
├── ========== COOKIE & ANALYTICS ==========
├── silktide-consent-manager.js        # Cookie framework (827 lines)
├── silktide-consent-manager.css       # Cookie styling (728 lines)
├── cookie-init.js                     # Cookie config + GA4 + HubSpot (352 lines)
│
├── ========== ASSETS ==========
├── site.webmanifest                   # PWA manifest
├── images/
│   ├── icons/                         # Favicons, logos, SVGs
│   ├── screenshots/                   # Product screenshots
│   ├── team/                          # Team photos
│   ├── banners/                       # Hero banners
│   ├── hero/                          # Hero images
│   └── tabs/                          # Tab/section images
│
├── partials/
│   ├── header.html                    # Global header (loaded dynamically)
│   ├── footer.html                    # Global footer (loaded dynamically)
│   └── global-modal.html              # Reusable modal (loaded dynamically)
│
├── ========== DOCUMENTATION ==========
├── README.md                          # This file (comprehensive guide)
├── GOOGLE_ANALYTICS_SETUP.md          # GA4 implementation guide
├── GA_EINWILLIGUNGSMODUS_CHECKLISTE.md  # Consent Mode checklist (DE)
├── GOOGLE_SIGNALE_PRIVACY_TEXT.md     # Privacy text for Google Signals (DE)
├── HUBSPOT_TROUBLESHOOTING.md         # HubSpot 403 solutions
└── COOKIE_BANNER_README.md            # Cookie banner documentation
```

---

## ✨ Features

### 🎨 Design System

**Brand Colors:**
- **White:** `#FFFFFF` - Pure white
- **Peach:** `#FFEFF8` - Light background, soft accent
- **Pig (Pink):** `#FF79C9` - Primary color, main accent
- **Berry (Purple):** `#4D2B41` - Secondary color, dark text
- **Moss (Dark Green):** `#1E4947` - Accent color, alternative text
- **Black:** `#000000` - Dark backgrounds

**Color Usage:**
- **Primary:** Pig (#FF79C9) - Buttons, highlights, interactive elements
- **Secondary:** Berry (#4D2B41) - Headings, dark text, secondary buttons
- **Accent:** Moss (#1E4947) - Alternative accents, lighter text
- **Backgrounds:** White (main), Peach (sections), Black (dark sections)
- **Gradient:** `linear-gradient(135deg, #FF79C9 0%, #4D2B41 100%)` - Pig to Berry

**Typography:**
- **Primary Font:** 'Sofia Sans' (Google Font)
- **Fallback Stack:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Weight:** 400 (normal), 600 (semi-bold), 700 (bold)
- **Line Height:** 1.6

**Responsive Breakpoints:**
- Desktop: `> 768px`
- Tablet: `≤ 768px`
- Mobile: `≤ 480px`

### 🍪 Cookie Categories

1. **Necessary** (always active)
   - LocalStorage for cookie preferences
   - Session management
   - Security features

2. **Marketing** (opt-in)
   - HubSpot forms and tracking
   - CRM integration

3. **Analytics** (opt-in)
   - Google Analytics 4
   - Google Signals (cross-device tracking)

### 📄 Pages Overview

**Main Pages:**
- `index.html` - Homepage with hero, features, platform overview
- `about_us.html` - Company information and team
- `platform.html` - Main platform overview
- `features.html` - Detailed feature list
- `pricing.html` - Pricing plans with VAT disclosure modal
- `contact.html` - Contact form with HubSpot integration
- `newsletter.html` - Newsletter signup
- `careers.html` / `jobs.html` - Career opportunities
- `faq.html` - Frequently asked questions

**Solutions Pages:**
- `solutions_developers.html` - Solutions for developers
- `solutions_production.html` - Production solutions overview
- `solutions_production-livedashboard.html` - Live dashboard features
- `solutions_workflow.html` - Workflow automation
- `solutions_leadership.html` - Leadership solutions overview
- `solutions_leadership-oee.html` - OEE tracking for leadership
- `solutions_leadership-pl.html` - Production line management
- `solutions_leadership-scalability.html` - Scalability solutions
- `solutions_oem.html` - OEM solutions
- `solutions_partners.html` - Partner solutions

**Technical/Feature Pages:**
- `integration.html` - Integration capabilities
- `automation.html` - Automation features
- `data_model.html` - Data model explanation
- `custom_apps.html` - Custom applications
- `custom_apps_simulation.html` - App simulation demo
- `dashboard.html` - Dashboard overview
- `upcoming_features.html` - Roadmap and upcoming features

**Demo/Interactive Pages:**
- `openinfra_demo.html` - OpenInfra demo
- `openinfra_globe.html` - Interactive globe demo
- `platform_whitelabel_demo.html` - White-label platform demo
- `data_flow_animation.html` - Animated data flow
- `hero-widget.html` - Hero section widget demo
- `developer_pipeline.html` - Developer pipeline visualization
- `approval_app.html` - Approval workflow demo
- `imposition_inspector.html` - Imposition inspector tool

**Legal/Compliance:**
- `privacy.html` - Privacy Policy with GDPR compliance and GA disclosure
- `terms.html` - Terms of Service
- `imprint.html` - Legal imprint

**Test/Backup Files:**
- `test.html` - Testing page
- `index copy.html` - Homepage backup
- `hero-bg.html` - Hero background test
- Various `_OLD_UK.html` files - Legacy UK versions

**Total:** 50+ HTML pages covering all aspects of the platform

---

## 🍪 Cookie Consent System

### Architecture

The cookie consent system is built on **Silktide's framework** with extensive customizations for GDPR compliance and optimal UX.

### Implementation Files

1. **`silktide-consent-manager.js`** (827 lines)
   - Core consent framework
   - Banner logic and state management
   - LocalStorage persistence
   - Event callbacks

2. **`silktide-consent-manager.css`** (728 lines)
   - Cookie banner styling
   - Modal design (card-based, modern)
   - Cookie icon (bottom-left, Berry/Pig colors)
   - Responsive optimizations

3. **`cookie-init.js`** (352 lines)
   - Configuration and initialization
   - Google Analytics integration
   - HubSpot forms integration
   - Consent Mode v2 setup

### Key Features

#### 1. **LocalStorage-Based Consent**

The system uses localStorage to remember user choices across sessions:

```javascript
// Stored keys:
silktideCookieChoice_necessary    // Always 'true'
silktideCookieChoice_marketing    // 'true' or 'false'
silktideCookieChoice_analytics    // 'true' or 'false'
silktideCookieBanner_InitialChoice // '1' (choice made) or '0' (not made)
```

**Why localStorage?**
- Persists across sessions (no expiry unless user clears browser data)
- No HTTP cookies needed for consent state
- Faster than cookie parsing
- GDPR-friendly (local-only storage)

#### 2. **Cookie Banner UI**

**Visual Design:**
- **Position:** Bottom-center overlay
- **Width:** 850px (responsive)
- **Background:** Blurred Pig color (`rgba(255, 121, 201, 0.4)` + 10px blur)
- **Border Radius:** 12px with subtle shadow
- **Typography:** Modern hierarchy (32px headings, 14px body)

**Cookie Icon:**
- **Size:** 48x48px (desktop), 56px (tablet), 52px (mobile)
- **Position:** Bottom-left, 24px from edges
- **Colors:** Berry symbol (#4D2B41) on Pig background (#FF79C9)
- **Z-index:** 2000 (matches back-to-top button)
- **Interaction:** Scale 1.05 on hover, smooth transitions

**Modal Preferences:**
- **Card-based design** with individual fieldsets for each cookie type
- **Toggle switches** with Pink glow when enabled
- **Legends** in Berry color (16px, bold)
- **Descriptions** compact (14px → 12px mobile)
- **Mobile-optimized:** 16px padding, aggressive size reductions

#### 3. **Consent Flow**

```
User Visits Site (First Time)
    ↓
Banner Appears Automatically
    ↓
User Clicks "Accept All" or "Manage Preferences"
    ↓
Choice Saved to localStorage
    ↓
Callbacks Triggered:
    - Marketing: Load/Block HubSpot
    - Analytics: Load/Block Google Analytics
    ↓
Banner Closes
    ↓
User Returns Later
    ↓
localStorage Checked (500ms delay)
    ↓
Previous Choice Applied Automatically
    - Marketing accepted? → Load HubSpot forms
    - Analytics accepted? → Load Google Analytics
    - Denied? → Keep blocked
```

#### 4. **Cookie Categories Configuration**

**Location:** `cookie-init.js` lines 161-283

```javascript
initializeCookieBanner({
    background: 'rgba(255, 121, 201, 0.4)',
    backdropBlur: '10px',
    iconPosition: 'bottomLeft',
    
    cookieTypes: [
        {
            id: 'necessary',
            label: 'Necessary Cookies',
            description: 'Essential for website functionality...',
            required: true,  // Cannot be disabled
            defaultValue: true,
            onAccept: () => {
                console.log('✅ Necessary cookies accepted (always active)');
            }
        },
        {
            id: 'marketing',
            label: 'Marketing Cookies',
            description: 'We use HubSpot to manage contact forms...',
            required: false,
            defaultValue: false,
            onAccept: () => {
                // Update Google Consent Mode
                gtag('consent', 'update', {
                    ad_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted'
                });
                
                // Fire DataLayer event
                dataLayer.push({ event: 'consent_accepted_marketing' });
                
                // Load HubSpot forms
                loadHubSpotForms();
            },
            onReject: () => {
                // Update consent to denied
                gtag('consent', 'update', {
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied'
                });
                
                // Remove HubSpot forms
                document.querySelectorAll('.hubspot-form-container').forEach(container => {
                    container.innerHTML = '';
                });
                
                // Show placeholder
                showHubSpotPlaceholder();
            }
        },
        {
            id: 'analytics',
            label: 'Analytics Cookies',
            description: 'We use Google Analytics with Google Signals...',
            required: false,
            defaultValue: false,
            onAccept: () => {
                // Update Google Consent Mode
                gtag('consent', 'update', {
                    analytics_storage: 'granted'
                });
                
                // Fire DataLayer event
                dataLayer.push({ event: 'consent_accepted_analytics' });
                
                // Load Google Analytics
                loadGoogleAnalytics();
            },
            onReject: () => {
                gtag('consent', 'update', {
                    analytics_storage: 'denied'
                });
            }
        }
    ]
});
```

#### 5. **HubSpot Form Placeholder**

When Marketing cookies are rejected, HubSpot forms are replaced with a styled placeholder:

**Visual Design:**
- Berry cookie icon (28px)
- "Cookie Consent Required" heading
- Explanation text
- Gradient button (Berry → Pig)
- Clicking opens cookie preferences modal

**Implementation:** `cookie-init.js` lines 124-159

#### 6. **Opening Cookie Preferences Programmatically**

**Global function:** `window.openCookiePreferences()`

```javascript
window.openCookiePreferences = function() {
    if (window.silktideCookieBannerManager && 
        window.silktideCookieBannerManager.instance) {
        window.silktideCookieBannerManager.instance.toggleModal(true);
    }
};
```

---

## 📊 Google Analytics Integration

### Overview

**Property ID:** `G-45K2K9Z2WZ`  
**Implementation:** Direct gtag.js (not Google Tag Manager)  
**Compliance:** GDPR-compliant with Consent Mode v2

### Key Features

1. **Consent Mode v2** - All 4 required parameters
2. **Google Signals** - Cross-device tracking with demographic data
3. **IP Anonymization** - GA4 default (IPs not stored)
4. **Region-Specific Defaults** - EWR countries explicitly defined
5. **LocalStorage-Based Defaults** - Respects returning visitors
6. **URL Passthrough** - Cookieless conversion tracking
7. **DataLayer Events** - Explicit consent tracking

### Implementation Details

#### 1. **Consent Mode v2 Setup**

**Location:** `cookie-init.js` lines 73-92

```javascript
// Initialize DataLayer
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// URL Passthrough (for cookieless tracking)
gtag('set', 'url_passthrough', true);

// Default Consent for EWR Countries
gtag('consent', 'default', {
    ad_storage: localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
    ad_user_data: localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
    ad_personalization: localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
    analytics_storage: localStorage.getItem('silktideCookieChoice_analytics') === 'true' ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
    region: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 
             'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 
             'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO']
});

// Default Consent for Non-EWR Countries (fallback)
gtag('consent', 'default', {
    ad_storage: localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
    ad_user_data: localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
    ad_personalization: localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
    analytics_storage: localStorage.getItem('silktideCookieChoice_analytics') === 'true' ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
});

gtag('js', new Date());
```

**Why this approach?**
- **localStorage checks:** Returning visitors see their previous choice respected immediately
- **EWR region array:** 30 countries with stricter GDPR defaults
- **Two gtag calls:** EWR-specific + fallback for rest of world
- **wait_for_update:** Prevents data loss if cookie banner loads slowly
- **URL passthrough:** Cookieless conversion tracking via URL parameters

#### 2. **Testing Google Analytics**

**DataLayer Inspection:**
```javascript
// In Chrome DevTools Console:
dataLayer

// Expected (no consent):
// analytics_storage: "denied"

// After accepting:
// analytics_storage: "granted"
// event: "consent_accepted_analytics"
```

**Debug Mode:**
```
Open: http://localhost:5500/?debug_mode=1
Go to: GA4 → Admin → DebugView
See events in real-time
```

#### 3. **Google Analytics Admin Setup**

**Required steps in GA4 UI:**

1. **Activate Consent Mode:**
   - Admin → Property → Data Settings → Data Collection
   - Click "Einwilligungseinstellungen" (Consent Settings)
   - Activate "Use Consent Mode" → Select "Advanced"
   - Save

2. **Set Data Retention:**
   - Admin → Data Settings → Data Retention
   - Set to **14 months** (GDPR-recommended)
   - Enable "Reset user data on new activity": ON
   - Save

3. **Activate Google Signals (optional):**
   - Admin → Data Settings → Data Collection
   - "Google Signals data collection" → Get Started
   - Confirm you've informed users (Privacy Policy must be live!)
   - Activate

---

## 📝 HubSpot Forms Integration

### Overview

**Portal ID:** `144439007`  
**Implementation:** Dynamic form loading with cookie consent  
**Forms:** Contact form, Newsletter signup

### Form IDs

| Form | ID | Page |
|------|-----|------|
| Contact Form | `f35467d7-46f0-4cd1-8b4d-e76d13b93f08` | `contact.html` |
| Newsletter | `6550da89-9cc0-4dec-9ceb-621b0006afff` | Footer (all pages) |

### Implementation

**Location:** `cookie-init.js` lines 1-70

```javascript
window.loadHubSpotForms = function() {
    const containers = document.querySelectorAll('.hubspot-form-container');
    
    if (containers.length === 0) return;
    
    // Load HubSpot script if not already loaded
    if (!window.hbspt && !document.querySelector('script[src*="forms.hubspot.com"]')) {
        const script = document.createElement('script');
        script.src = '//js.hsforms.net/forms/embed/v2.js';
        script.onload = () => setTimeout(() => createForms(), 100);
        document.body.appendChild(script);
    } else if (window.hbspt) {
        createForms();
    }
    
    function createForms() {
        containers.forEach(container => {
            const formId = container.dataset.formId;
            if (formId && container.dataset.formLoaded !== 'true') {
                window.hbspt.forms.create({
                    region: 'eu1',
                    portalId: '144439007',
                    formId: formId,
                    target: `#${container.id}`
                });
                container.dataset.formLoaded = 'true';
            }
        });
    }
};
```

### Troubleshooting 403 Errors

**Solution:** Add domain to HubSpot Security settings
1. HubSpot Portal → Settings → Security & Privacy → Form Security
2. Add: `localhost`, `127.0.0.1`, `*.github.io`, `wearecococo.com`
3. Check individual form settings for restrictions
4. Wait 5-10 minutes for propagation

---

## 📱 Responsive Design

### Breakpoints

```css
/* Desktop: > 768px (default) */
/* Tablet: ≤ 768px */
/* Mobile: ≤ 480px */
```

### Cookie Banner Responsive

| Device | Width | Padding | Font Sizes |
|--------|-------|---------|------------|
| Desktop | 850px | 40px | 32px (h1), 14px (p) |
| Tablet | 90% | 20px | 22px (h1), 13px (p) |
| Mobile | 95% | 16px | 20px (h1), 12px (p) |

### Cookie Icon Responsive

| Device | Size | Position |
|--------|------|----------|
| Desktop | 48x48px | 24px from bottom-left |
| Tablet | 56px | 24px from bottom-left |
| Mobile | 52px | 24px from bottom-left |

---

## 🚀 Deployment

### GitHub Pages (Test)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/[username]/[repo].git
git push -u origin main

# Enable in: Settings → Pages → Deploy from main
# Access: https://[username].github.io/[repo]/
```

### Custom Domain (Production)

1. DNS: Point A record to GitHub IP or hosting provider
2. GitHub Pages: Settings → Custom domain → `wearecococo.com`
3. Enforce HTTPS: ✅
4. Update GA4 Data Stream with production domain

---

## 🧪 Testing

### Cookie Consent Testing

**Test 1: First Visit**
```
1. Incognito window
2. Check Console: analytics_storage = "denied"
3. No GA requests in Network tab
4. Banner appears automatically
```

**Test 2: Accept Analytics**
```
1. Accept cookies
2. Console: analytics_storage = "granted"
3. Event: consent_accepted_analytics
4. GA script loads
5. localStorage: silktideCookieChoice_analytics = "true"
```

**Test 3: Persistence**
```
1. Navigate to other page
2. Consent persists (localStorage)
3. Banner does NOT reappear
```

### Google Analytics Testing

```javascript
// Console check:
dataLayer

// Expected structure after acceptance:
[
    { 0: "set", 1: "url_passthrough", 2: true },
    { 0: "consent", 1: "default", 2: { analytics_storage: "denied", ... } },
    { 0: "consent", 1: "update", 2: { analytics_storage: "granted" } },
    { event: "consent_accepted_analytics" },
    { 0: "config", 1: "G-45K2K9Z2WZ", 2: { anonymize_ip: true } }
]
```

**Debug Mode:**
```
1. Open: http://localhost:5500/?debug_mode=1
2. Accept Analytics cookies
3. GA4 → Admin → DebugView
4. See events in real-time
```

---

## ⚖️ Compliance

### GDPR Requirements Met

✅ **Opt-in Consent:** No tracking without explicit consent  
✅ **Granular Control:** Separate toggles for Marketing/Analytics  
✅ **Transparency:** Detailed descriptions in banner + Privacy Policy  
✅ **Right to Withdraw:** Cookie icon accessible on every page  
✅ **Data Minimization:** IP anonymization, 14-month retention  
✅ **Third-Party Processors:** DPA with Google mentioned  
✅ **Regional Defaults:** EWR countries explicitly handled

### Consent Mode v2 Parameters

| Parameter | Default (EWR) | Analytics | Marketing |
|-----------|---------------|-----------|-----------|
| `ad_storage` | denied | denied | **granted** |
| `ad_user_data` | denied | denied | **granted** |
| `ad_personalization` | denied | denied | **granted** |
| `analytics_storage` | denied | **granted** | denied |

---

## 🔧 Troubleshooting

### Cookie Banner Not Appearing
- Check scripts loaded: Network tab
- Check Console for errors
- Clear localStorage: `localStorage.clear()`
- Reload page

### Google Analytics Not Tracking
- **Domain mismatch:** Add domain to GA4 Data Stream
- **Consent not granted:** Check `dataLayer` in Console
- **Script blocked:** Check ad-blocker/extensions
- **Wait 24-48 hours:** Main reports have delay

### HubSpot Forms 403 Error
- **Domain not whitelisted:** HubSpot → Security → Form Security
- **Add domains:** localhost, *.github.io, wearecococo.com
- **Wait 5-10 minutes** for propagation

### localStorage Not Persisting
- **Private browsing:** localStorage disabled in Incognito
- **Browser settings:** Check if storage allowed
- **Clear old data:** Storage quota may be full

---

## 📚 Additional Resources

**Documentation Files:**
- `GOOGLE_ANALYTICS_SETUP.md` - GA4 implementation guide
- `GA_EINWILLIGUNGSMODUS_CHECKLISTE.md` - Consent Mode checklist (German)
- `GOOGLE_SIGNALE_PRIVACY_TEXT.md` - Privacy Policy text (German)
- `HUBSPOT_TROUBLESHOOTING.md` - HubSpot 403 solutions

**External Resources:**
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent)
- [HubSpot Forms API](https://developers.hubspot.com/docs/api/marketing/forms)
- [GDPR Official Text](https://gdpr-info.eu/)

---

## 🎯 Quick Start

**For Developers:**
```bash
# Start local server
python -m http.server 5500

# Open browser
http://localhost:5500

# Test cookie banner
localStorage.clear()  # In Console
# Reload page → Banner appears
```

**For Non-Developers:**
1. Upload files to web hosting
2. Configure domain
3. Enable SSL/HTTPS
4. Test cookies and forms

---

## 📝 Changelog

### Version 1.0.9 (2026-01-06)

**Added:**
- ✅ Google Analytics 4 with Consent Mode v2
- ✅ Google Signals cross-device tracking
- ✅ LocalStorage-based consent defaults
- ✅ Region-specific EWR consent
- ✅ Privacy Policy section 2.5

**Improved:**
- ✅ Cookie banner UI (modern card design)
- ✅ Cookie icon responsive sizing
- ✅ Mobile optimization
- ✅ Error handling and logging

---

## 👥 Contributors

- **Armin Rohrmoser** - Project Owner, Triple C Labs
- **AI Assistant** - Implementation, Documentation

---

## 📄 License

© 2026 Triple C Labs GmbH i.G. All rights reserved.

---

## 🆘 Support

**Email:** [corporate@wearecococo.com](mailto:corporate@wearecococo.com)  
**Website:** [wearecococo.com](https://wearecococo.com)

---

**Last Updated:** January 6, 2026  
**Version:** 1.0.9  
**Status:** ✅ Production Ready
