/**
 * CoCoCo Cookie Consent Manager - Global Initialization
 * This file is loaded on all pages and handles cookie consent + HubSpot form loading
 */

// HubSpot Form Loader - loads forms only if marketing cookies are accepted
window.loadHubSpotForms = function() {
    console.log('🚀 loadHubSpotForms called');
    // Find all HubSpot form containers
    const formContainers = document.querySelectorAll('[data-hubspot-form]');
    console.log('📦 Found containers:', formContainers.length);
    
    formContainers.forEach((container, index) => {
        console.log(`📋 Container ${index}:`, {
            id: container.id,
            hasDataFormLoaded: container.hasAttribute('data-form-loaded')
        });
        
        if (container.hasAttribute('data-form-loaded')) {
            console.log(`⏭️ Skipping container ${index} - already loaded`);
            return; // Skip if already loaded
        }
        
        const portalId = container.getAttribute('data-hubspot-portal');
        const formId = container.getAttribute('data-hubspot-form');
        const region = container.getAttribute('data-hubspot-region') || 'eu1';
        
        console.log(`🔧 Loading form for container ${index}:`, { portalId, formId, region });
        
        // Load HubSpot embed script if not already loaded
        if (!window.hbspt && !document.querySelector('script[src*="hsforms.net"]')) {
            console.log(`📥 Loading HubSpot script for region: ${region}`);
            const script = document.createElement('script');
            script.src = `//js-${region}.hsforms.net/forms/embed/v2.js`;
            script.charset = 'utf-8';
            script.type = 'text/javascript';
            script.onload = function() {
                console.log(`✅ HubSpot script loaded for region: ${region}`);
                createForm(container, region, portalId, formId);
            };
            script.onerror = function() {
                console.error(`❌ Failed to load HubSpot script for region: ${region}`);
            };
            document.body.appendChild(script);
        } else if (window.hbspt) {
            console.log(`✅ HubSpot script already loaded, creating form...`);
            createForm(container, region, portalId, formId);
        }
    });
    
    function createForm(container, region, portalId, formId) {
        console.log('🏗️ Creating HubSpot form:', { container: container.id, region, portalId, formId });
        if (typeof hbspt !== 'undefined' && hbspt.forms) {
            console.log('✅ hbspt.forms available, creating form...');
            hbspt.forms.create({
                region: region,
                portalId: portalId,
                formId: formId,
                target: `#${container.id}`
            });
            container.setAttribute('data-form-loaded', 'true');
            console.log('✅ Form creation requested, data-form-loaded attribute set');
            // Remove placeholder
            const placeholder = container.querySelector('.cookie-consent-placeholder');
            if (placeholder) {
                console.log('🗑️ Removing placeholder');
                placeholder.remove();
            }
        } else {
            console.error('❌ hbspt or hbspt.forms not available');
        }
    }
};

// Global function to open cookie preferences modal
window.openCookiePreferences = function() {
    console.log('🍪 Opening cookie preferences modal...');
    if (window.silktideCookieBannerManager && window.silktideCookieBannerManager.instance) {
        window.silktideCookieBannerManager.instance.toggleModal(true);
    } else {
        console.error('❌ Cookie manager instance not found');
    }
};

// Show placeholder for blocked HubSpot forms
window.showHubSpotPlaceholder = function() {
    console.log('🔍 showHubSpotPlaceholder called');
    const formContainers = document.querySelectorAll('[data-hubspot-form]');
    console.log('📦 Found containers:', formContainers.length);
    
    formContainers.forEach((container, index) => {
        console.log(`📋 Container ${index}:`, {
            id: container.id,
            hasDataFormLoaded: container.hasAttribute('data-form-loaded'),
            innerHTML: container.innerHTML.substring(0, 50)
        });
        
        if (!container.hasAttribute('data-form-loaded')) {
            console.log(`✅ Rendering placeholder for container ${index}`);
            container.innerHTML = `
                <div class="cookie-consent-placeholder">
                    <div style="padding: 2rem; text-align: center; background: #f9f9f9; border: 2px dashed #FF79C9; border-radius: 8px; margin: 1rem 0;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 1rem; opacity: 0.5;">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#FF79C9"/>
                        </svg>
                        <h3 style="color: #4D2B41; font-size: 1.125rem; margin-bottom: 0.5rem; font-weight: 600;">Cookie Consent Required</h3>
                        <p style="color: #666; margin-bottom: 1rem; line-height: 1.5;">
                            To use our contact form, please accept marketing cookies. This allows us to process your inquiry through HubSpot.
                        </p>
                        <button onclick="window.openCookiePreferences()" 
                                style="padding: 10px 24px; background: #FF79C9; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 500; font-size: 1rem; transition: all 0.3s ease;"
                                onmouseover="this.style.background='#4D2B41'"
                                onmouseout="this.style.background='#FF79C9'">
                            Update Cookie Preferences
                        </button>
                    </div>
                </div>
            `;
        } else {
            console.log(`⏭️ Skipping container ${index} - already has data-form-loaded`);
        }
    });
};

// Initialize Cookie Banner with CoCoCo Branding
// Use a function that works both when DOM is already loaded and when it's still loading
function initializeCookieBanner() {
    console.log('🎯 Initializing Cookie Banner...');
    if (typeof silktideCookieBannerManager !== 'undefined') {
        silktideCookieBannerManager.updateCookieBannerConfig({
            background: {
                showBackground: true,
                backgroundColor: 'rgba(255, 121, 201, 0.4)',
                blur: '10px'
            },
            cookieIcon: {
                position: 'bottomLeft'
            },
            cookieTypes: [
                {
                    id: 'necessary',
                    name: 'Necessary Cookies',
                    description: 'These cookies are essential for the website to function properly. They enable basic features like page navigation, storing your language preferences, and remembering your selected currency and billing interval on the pricing page.<br><strong>Examples:</strong> Session cookies, preference storage (localStorage)',
                    required: true,
                    onAccept: function() {
                        console.log('✅ Necessary cookies accepted (always active)');
                    }
                },
                {
                    id: 'marketing',
                    name: 'Marketing & Analytics',
                    description: 'We use <strong>HubSpot</strong> to manage contact forms and newsletter subscriptions. This tracks form submissions, email addresses, and basic usage to improve our service and respond to inquiries.<br><a href="privacy.html" target="_blank">Privacy Policy</a>',
                    defaultValue: false,
                    onAccept: function() {
                        console.log('✅ Marketing cookies accepted - Loading HubSpot forms');
                        loadHubSpotForms();
                    },
                    onReject: function() {
                        console.log('❌ Marketing cookies rejected - Removing forms and showing placeholders');
                        // Remove loaded forms and reset containers
                        const formContainers = document.querySelectorAll('[data-hubspot-form]');
                        formContainers.forEach(container => {
                            // Remove the data-form-loaded attribute so placeholder can be shown
                            container.removeAttribute('data-form-loaded');
                            // Clear any existing form content
                            container.innerHTML = '';
                        });
                        // Show placeholders
                        showHubSpotPlaceholder();
                    }
                }
            ],
            text: {
                banner: {
                    description: '<p>We use cookies to enhance your experience on our website. Some are essential for basic functionality, while others help us understand how you use our site and improve our services. <a href="privacy.html">Learn more in our Privacy Policy</a></p>',
                    acceptAllButtonText: 'Accept all',
                    acceptAllButtonAccessibleLabel: 'Accept all cookies',
                    rejectNonEssentialButtonText: 'Reject non-essential',
                    rejectNonEssentialButtonAccessibleLabel: 'Reject non-essential cookies',
                    preferencesButtonText: 'Preferences',
                    preferencesButtonAccessibleLabel: 'Toggle cookie preferences'
                },
                preferences: {
                    title: 'Customize your cookie preferences',
                    description: 'Choose which cookies we may use. Your preferences will be saved across our entire website.',
                    creditLinkText: '',
                    creditLinkAccessibleLabel: ''
                }
            }
        });
        
        // Check if marketing cookies are rejected on page load
        setTimeout(function() {
            console.log('⏰ Checking cookie state from localStorage...');
            
            // Debug: Show ALL localStorage keys
            console.log('🔍 All localStorage keys:', Object.keys(localStorage));
            
            // Silktide stores cookie choices as separate localStorage items
            const marketingChoice = localStorage.getItem('silktideCookieChoice_marketing');
            const initialChoice = localStorage.getItem('silktideCookieBanner_InitialChoice');
            
            console.log('📊 Marketing cookie choice:', marketingChoice);
            console.log('📊 Initial choice made:', initialChoice);
            
            // Only act if user has made a choice (initialChoice exists and is truthy)
            // Silktide uses '1' for true, not 'true'
            if (initialChoice === '1' || initialChoice === 'true') {
                if (marketingChoice === 'false' || marketingChoice === '0') {
                    console.log('❌ Marketing cookies rejected - calling showHubSpotPlaceholder');
                    showHubSpotPlaceholder();
                } else if (marketingChoice === 'true' || marketingChoice === '1') {
                    console.log('✅ Marketing cookies accepted - calling loadHubSpotForms');
                    loadHubSpotForms();
                } else {
                    console.log('⚠️ Marketing cookie state unclear:', marketingChoice);
                }
            } else {
                console.log('ℹ️ No cookie consent choice found yet (banner not interacted with)');
            }
        }, 500);
    } else {
        console.error('❌ silktideCookieBannerManager not defined');
    }
}

// Call initialization immediately if DOM is already loaded, otherwise wait
if (document.readyState === 'loading') {
    console.log('📋 DOM still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initializeCookieBanner);
} else {
    console.log('✅ DOM already loaded, initializing immediately...');
    initializeCookieBanner();
}
