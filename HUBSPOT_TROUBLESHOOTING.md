# HubSpot Forms Troubleshooting Guide

## 🔴 Current Issues

### Issue 1: HubSpot 403 Forbidden Error
**Error Message:** `GET https://forms-eu1.hsforms.com/embed/v3/form/144439007/f35467d7... 403 (Forbidden)`

**What this means:** HubSpot's API is blocking the form embed request from your domain.

**Why this happens:**
- Your domain is not whitelisted in HubSpot portal settings
- Form security settings are blocking external domains
- CORS (Cross-Origin Resource Sharing) restrictions

**How to fix:**

#### Step 1: Whitelist Your Domain in HubSpot
1. Log into your HubSpot account (Portal ID: 144439007)
2. Go to **Settings** (gear icon in top right)
3. Navigate to **Security & Privacy** → **Form Security**
4. Add your domain(s) to the allowlist:
   - For production: `yourdomain.com`, `*.yourdomain.com`
   - For GitHub Pages: `*.github.io`
   - For local testing: `localhost:*`, `127.0.0.1:*`

#### Step 2: Check Form-Specific Security Settings
1. Go to **Marketing** → **Forms**
2. Find form ID `f35467d7-46f0-4cd1-8b4d-e76d13b93f08` (Contact Form)
3. Click **Actions** → **Settings**
4. Under **Security**, ensure:
   - "Allow form to be embedded on external sites" is **enabled**
   - "Require secure (HTTPS) embed" is compatible with your setup
   - No IP restrictions are blocking your requests

#### Step 3: Verify Portal Settings
1. Go to **Settings** → **Account Setup** → **Domains & URLs**
2. Make sure your primary domain is configured
3. Check **Security** settings don't have overly restrictive policies

---

### Issue 2: Missing Cookie Consent Placeholder
**Problem:** When marketing cookies are rejected, the placeholder with "Cookie Consent Required" message doesn't appear.

**Debugging Steps Added:**
- Added console logging to `cookie-init.js` to trace execution
- Functions now log when they're called and what they find

**Open Browser Console (F12) and check for:**
```
🔍 showHubSpotPlaceholder called
📦 Found containers: [number]
📋 Container 0: {id: "...", hasDataFormLoaded: false}
✅ Rendering placeholder for container 0
```

**If you DON'T see these logs:**
1. Check that `cookie-init.js` is loaded correctly
2. Verify the `onReject` callback in cookie banner config is calling `showHubSpotPlaceholder()`
3. Ensure `[data-hubspot-form]` containers exist in your HTML

**If logs appear but no placeholder visible:**
1. Check browser developer tools for CSS conflicts
2. Inspect the container element to see if innerHTML was set
3. Look for JavaScript errors that might stop execution

---

## 🧪 Testing Checklist

### Test Placeholder Display
1. Clear localStorage: `localStorage.removeItem('silktide-cookie-consent')`
2. Refresh the page
3. Cookie banner should appear
4. Click **"Reject non-essential"**
5. Check console logs:
   ```
   ❌ Marketing cookies rejected - Showing placeholders
   🔍 showHubSpotPlaceholder called
   📦 Found containers: 1
   ✅ Rendering placeholder for container 0
   ```
6. Verify placeholder appears with:
   - Cookie icon
   - "Cookie Consent Required" heading
   - Explanation text
   - "Update Cookie Preferences" button

### Test Form Loading (After HubSpot Whitelist Fix)
1. Clear localStorage: `localStorage.removeItem('silktide-cookie-consent')`
2. Refresh the page
3. Click **"Accept all"**
4. Check console logs:
   ```
   ✅ Marketing cookies accepted - Loading HubSpot forms
   🚀 loadHubSpotForms called
   📦 Found containers: 1
   📥 Loading HubSpot script for region: eu1
   ✅ HubSpot script loaded for region: eu1
   🏗️ Creating HubSpot form: {container: "hubspot-form", ...}
   ✅ hbspt.forms available, creating form...
   ✅ Form creation requested, data-form-loaded attribute set
   ```
5. HubSpot form should render (if domain is whitelisted)

---

## 🔧 Quick Fixes

### Force Reload Cookie State
```javascript
// Run in browser console
localStorage.removeItem('silktideCookieChoice_marketing');
localStorage.removeItem('silktideCookieChoice_necessary');
localStorage.removeItem('silktideCookieBanner_InitialChoice');
location.reload();
```

### Check Current Cookie State
```javascript
// Run in browser console
console.log('Marketing cookies:', localStorage.getItem('silktideCookieChoice_marketing'));
console.log('Necessary cookies:', localStorage.getItem('silktideCookieChoice_necessary'));
console.log('Initial choice made:', localStorage.getItem('silktideCookieBanner_InitialChoice'));
```

### Manually Trigger Placeholder
```javascript
// Run in browser console after rejecting cookies
showHubSpotPlaceholder();
```

### Manually Trigger Form Load
```javascript
// Run in browser console after accepting cookies
loadHubSpotForms();
```

---

## 📋 Required HTML Structure

Your form containers MUST have these data attributes:

```html
<div id="hubspot-form" 
     data-hubspot-form="f35467d7-46f0-4cd1-8b4d-e76d13b93f08"
     data-hubspot-portal="144439007"
     data-hubspot-region="eu1">
    <!-- Form will be injected here -->
</div>
```

**For newsletter.html:**
```html
<div id="hubspot-newsletter-container" 
     data-hubspot-form="6550da89-9cc0-4dec-9ceb-621b0006afff"
     data-hubspot-portal="144439007"
     data-hubspot-region="eu1">
    <!-- Form will be injected here -->
</div>
```

---

## 🌐 Alternative Solution: Direct Form Links

If HubSpot domain restrictions can't be resolved, consider using direct links instead of embedded forms:

### Contact Link
```html
<a href="https://share-eu1.hsforms.com/1f35467d7-46f0-4cd1-8b4d-e76d13b93f08" 
   target="_blank"
   class="btn btn-primary">
    Contact Us
</a>
```

### Newsletter Link
```html
<a href="https://share-eu1.hsforms.com/16550da89-9cc0-4dec-9ceb-621b0006afff" 
   target="_blank"
   class="btn btn-primary">
    Subscribe to Newsletter
</a>
```

---

## 📞 HubSpot Support

If issues persist after following this guide:
1. Contact HubSpot Support: https://help.hubspot.com/
2. Provide:
   - Portal ID: **144439007**
   - Form IDs: **f35467d7-46f0-4cd1-8b4d-e76d13b93f08** (Contact), **6550da89-9cc0-4dec-9ceb-621b0006afff** (Newsletter)
   - Error: "403 Forbidden when embedding forms on external domain"
   - Domain: [your GitHub Pages URL or production domain]

---

## ✅ Success Indicators

**Cookie Banner Working:**
- ✅ Cookie banner appears on page load (if no consent saved)
- ✅ Cookie icon visible in bottom-left corner
- ✅ Clicking icon opens preferences modal
- ✅ Choices persist across page navigations

**Placeholder Working:**
- ✅ Rejecting marketing cookies shows placeholder immediately
- ✅ Placeholder has correct styling (CoCoCo branding)
- ✅ "Update Cookie Preferences" button opens modal
- ✅ Accepting cookies after rejection removes placeholder and loads form

**HubSpot Forms Working:**
- ✅ Accepting marketing cookies loads HubSpot script
- ✅ Form renders within 1-2 seconds
- ✅ No 403 errors in browser console
- ✅ Form submissions work correctly
- ✅ Form styling matches your brand
