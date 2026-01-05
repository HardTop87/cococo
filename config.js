// Simple site configuration: colors, typography, and copy
// Edit values below to customize the homepage without touching HTML/CSS.

window.SITE_CONFIG = {
  // site version: update this string (e.g. 1.0.0 or timestamp) on every deploy to bust cache
  version: "1.0.7",
  
  // NOTE: The following brand config was used for dynamic content replacement via data-config attributes.
  // This feature is NOT currently implemented in script.js, so these values are not used.
  // TODO: Remove this section if dynamic config replacement is never implemented.
  /*
  brand: {
    name: "CoCoCo Platform",
    tagline: "The pioneering open platform for print",
    logoText: "CoCoCo Platform",
  },
  */
  colors: {
    primary: "#FF79C9",      // Pig
    primaryHover: "#e86ab3",  // Slightly darker pig
    accent: "#1E4947",        // Moss
    background: "#FFFFFF",    // White
    surface: "#FFEFF8",       // Peach
    text: "#4D2B41",          // Berry
    mutedText: "#1E4947",     // Moss
    border: "#E2E8F0",        // Borders/dividers
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    baseSize: "16px",
    headingWeight: 700,
    textWeight: 400,
  },
  content: {
    heroTitle: "CoCoCo Platform",
    heroSubtitle: "Complexity Solved. The Pioneering Open Platform that Unifies, Automates, and Simplifies Every Beat of Your Print Operation.",
    heroCTA: {
      primary: { text: "Start Now", href: "pricing.html#pricing" },
      secondary: { text: "Find Out More", href: "#features" },
    },
    features: [
      { title: "Automatisierung", text: "Wiederkehrende Aufgaben werden zuverlässig erledigt." },
      { title: "Integration", text: "Nahtlos in Ihre Tools eingebunden." },
      { title: "Sicherheit", text: "Datenschutz und Compliance an erster Stelle." },
    ],
    // Small-site CTAs and preview texts
    cta: {
      main: { text: 'Start now', href: 'pricing.html' },
      demo: { text: 'Book a Demo', href: 'https://meetings-eu1.hubspot.com/andreas-aplien/round-robin-salesteam' },
      headline: 'Ready to revolutionize your printing processes?',
      lead: 'Start today with the CoCoCo Platform and experience seamless data flow and data availability like never before. Our team will support you every step of the way.',
      note: ''
    },
    
    // Centralized pricing plan texts and numeric values used by the pricing page
    // Multi-currency support: Define prices for each currency
    pricingPlans: {
      setupNote: 'Need more? We build custom integrations for legacy machines and software on request..',
      grow: {
        title: 'Grow',
        subtitle: 'Full power, priced for small teams (≤ 10 employees)',
        // Prices by currency
        prices: {
          EUR: { monthly: 499, yearly: 5489, setup: 2500 },
          USD: { monthly: 749, yearly: 8239, setup: 2500 },
          GBP: { monthly: 499, yearly: 5489, setup: 2500 },
          CHF: { monthly: 649, yearly: 7139, setup: 2500 }
        },
        // Legacy fields for backward compatibility (EUR prices)
        monthly: 499,
        yearly: 5489,
        setup: 2500,
        cta: 'Configure Plan',
        applyUrl: 'https://2dztun.share-eu1.hsforms.com/2Roz4Vr1gQAmdQ-qgvm9SAw',
        // Plan-specific copy for detailed support panel
        setupBullets: [
          'Includes Full Professional Plan Onboarding Package'
        ],
        features: [
          { text: 'All Professional Plan Features included', included: true},
          { text: 'Multi-site support', included: false },
          { text: 'No custom SLA', included: false },
        ]
      },
      professional: {
        title: 'Professional',
        subtitle: 'The operating system for modern print production',
        // Prices by currency
        prices: {
          EUR: { monthly: 999, yearly: 10989, setup: 2500 },
          USD: { monthly: 1499, yearly: 16489, setup: 2500 },
          GBP: { monthly: 999, yearly: 10989, setup: 2500 },
          CHF: { monthly: 1299, yearly: 14289, setup: 2500 }
        },
        // Legacy fields for backward compatibility (EUR prices)
        monthly: 999,
        yearly: 10989,
        setup: 2500,
        cta: 'Configure Plan',
        applyUrl: 'https://2dztun.share-eu1.hsforms.com/2_kgrHlj0ST-nrcFK803BkA',
        setupBullets: [
          'Guided Setup & Onboarding',
          'Setup of all available Integration Kits',
          'Data Migration Assistance',
          'Team Training (Web Session)',
          'Priority Support during Onboarding'
        ],
        features: [
          { text: 'Unlimited Users', included: true },
          { text: 'All available Integration Kits', included: true },
          { text: 'CoCoCo Data Model', included: true },
          { text: 'Custom Apps', included: true },
          { text: 'Full API Access', included: true },
          { text: 'No Limitations in Automation or Integration', included: true },
          { text: 'Multi-Site Support', included: false },
          { text: 'No Custom SLA', included: false },
        ]
      },
      enterprise: {
        title: 'Enterprise',
        subtitle: 'For multi-site operations with mission-critical security & compliance needs',
        // Prices by currency (0 = contact sales)
        prices: {
          EUR: { monthly: 0, yearly: 0, setup: 0 },
          USD: { monthly: 0, yearly: 0, setup: 0 },
          GBP: { monthly: 0, yearly: 0, setup: 0 },
          CHF: { monthly: 0, yearly: 0, setup: 0 }
        },
        // Legacy fields for backward compatibility
        monthly: 0,
        yearly: 0,
        setup: 0,
        cta: 'Contact Sales',
        setupBullets: [
          'Named Implementation Manager & PM',
          'Legacy System Migration & Integration Support',
          'On-site Training Available Where Needed',
          'SLA-backed Premium Support During Onboarding'
        ],
        features: [
          { text: 'Everything in Professional', included: true },
          { text: 'Multi-site support', included: true },
          { text: 'Enterprise-grade security & compliance', included: true },
          { text: 'Dedicated account manager', included: true },
          { text: 'Dedicated support & SLAs', included: true },
          { text: 'Custom SLAs and professional services', included: true }
        ]
      }
    },
    // Support package definitions (editable in one place)
    // Multi-currency support: Define prices for each currency
    supportPackages: [
      {
        key: 'basic',
        title: 'Basic',
        prices: {
          EUR: { monthly: 0 },
          USD: { monthly: 0 },
          GBP: { monthly: 0 },
          CHF: { monthly: 0 }
        },
        priceMonthly: 0, // Legacy field for backward compatibility (EUR)
        description: [
          'Response Time: 48h',
          'Channels: Email & Ticketing',
          'Mo-Fr 8-5 working hours (CET)',
          'Knowledge Base Access'
        ],
      },
      {
        key: 'bronze',
        title: 'Bronze',
        prices: {
          EUR: { monthly: 99 },
          USD: { monthly: 119 },
          GBP: { monthly: 99 },
          CHF: { monthly: 109 }
        },
        priceMonthly: 99, // Legacy field for backward compatibility (EUR)
        description: [
          '<strong>Response Time: 24h</strong>',
          'Channels: Email & Ticketing',
          'Mo-Fr 8-5 working hours (CET)',
          'Knowledge Base Access'
        ],
      },
      {
        key: 'silver',
        title: 'Silver',
        prices: {
          EUR: { monthly: 299 },
          USD: { monthly: 339 },
          GBP: { monthly: 299 },
          CHF: { monthly: 319 }
        },
        priceMonthly: 299, // Legacy field for backward compatibility (EUR)
        description: [
          '<strong>Response Time: 6h</strong>',
          'Channels: Email, Ticketing & <strong>Chat (per invite)</strong>',
          '<strong>Mo-Fr 8-8 working hours (CET)</strong>',
          'Knowledge Base Access'
        ],
      },
      {
        key: 'gold',
        title: 'Gold',
        prices: {
          EUR: { monthly: 499 },
          USD: { monthly: 579 },
          GBP: { monthly: 499 },
          CHF: { monthly: 539 }
        },
        priceMonthly: 499, // Legacy field for backward compatibility (EUR)
        description: [
          '<strong>Response Time: 2h</strong>',
          'Channels: Email, Ticketing & Chat (per invite)',
          'Mo-Fr 8-8 working hours (CET)',
          '<strong>Dedicated Customer Success Manager</strong>',
          '<strong>Priority Support Queue</strong>',
        ],
      }
    ],
    // Deployment options (hosting/deployment)
    deploymentOptions: [
      {
        key: 'self-hosted',
        title: 'Self-Hosted',
        prices: {
          EUR: { monthly: 0 },
          USD: { monthly: 0 },
          GBP: { monthly: 0 },
          CHF: { monthly: 0 }
        },
        priceMonthly: 0, // Legacy field for backward compatibility (EUR)
        description: 'You host and manage the platform on your infrastructure',
      },
      {
        key: 'cloud',
        title: 'Cloud Hosting',
        prices: {
          EUR: { monthly: 100 },
          USD: { monthly: 130 },
          GBP: { monthly: 100 },
          CHF: { monthly: 115 }
        },
        priceMonthly: 100, // Legacy field for backward compatibility (EUR)
        description: 'We manage hosting, updates, backups, and infrastructure for you',
      }
    ],
  },
  // Stripe integration is disabled for now. To enable, replace `null` with
  // your stripe config object (example commented below).
  stripe: null,
  /*
  // Stripe integration placeholders:
  // - Replace the price IDs with the actual Stripe Price IDs for each plan and support package.
  // - Set `checkoutEndpoint` to your server endpoint that creates a Stripe Checkout Session and returns
  //   the session URL (e.g. POST /create-checkout-session).
  stripe: {
    checkoutEndpoint: '/create-checkout-session', // your server-side endpoint
    prices: {
      starter: { monthly: '', yearly: '' },
      professional: { monthly: '', yearly: '' },
      enterprise: { monthly: '', yearly: '' },
      support: { basic: '', bronze: '', silver: '', gold: '' }
    }
  }
  */
};

// Global Currency Detection based on visitor location
// This can be used across the site (pricing, ROI calculator, etc.)
window.detectUserCurrency = async function() {
  try {
    // Try to detect currency from browser timezone/locale first
    const locale = navigator.language || 'en-US';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Extract country code from locale (e.g., "CA" from "en-CA" or "fr-CA")
    let localeCountry = locale.includes('-') ? locale.split('-')[1].toUpperCase() : null;
    
    // Country-to-currency mapping with region sniffing strategy
    const currencyMap = {
      // USD: USA, Kanada, Mexiko, restliches Nord-/Südamerika
      'US': 'USD',
      'CA': 'USD',
      'MX': 'USD',
      'AR': 'USD',  // Argentinien
      'BR': 'USD',  // Brasilien
      'CL': 'USD',  // Chile
      'CO': 'USD',  // Kolumbien
      'PE': 'USD',  // Peru
      'VE': 'USD',  // Venezuela
      
      // GBP: Vereinigtes Königreich
      'GB': 'GBP',
      
      // CHF: Schweiz und Liechtenstein
      'CH': 'CHF',
      'LI': 'CHF',
      
      // EUR: Rest von Europa
      'DE': 'EUR',  // Deutschland
      'AT': 'EUR',  // Österreich
      'FR': 'EUR',  // Frankreich
      'IT': 'EUR',  // Italien
      'ES': 'EUR',  // Spanien
      'PT': 'EUR',  // Portugal
      'NL': 'EUR',  // Niederlande
      'BE': 'EUR',  // Belgien
      'LU': 'EUR',  // Luxemburg
      'IE': 'EUR',  // Irland
      'FI': 'EUR',  // Finnland
      'GR': 'EUR',  // Griechenland
      'PL': 'EUR',  // Polen
      'CZ': 'EUR',  // Tschechien
      'HU': 'EUR',  // Ungarn
      'RO': 'EUR',  // Rumänien
      'SE': 'EUR',  // Schweden
      'DK': 'EUR',  // Dänemark
      'NO': 'EUR',  // Norwegen
      'SK': 'EUR',  // Slowakei
      'SI': 'EUR',  // Slowenien
      'EE': 'EUR',  // Estland
      'LV': 'EUR',  // Lettland
      'LT': 'EUR',  // Litauen
      'HR': 'EUR',  // Kroatien
      'BG': 'EUR',  // Bulgarien
    };
    
    // 1. Check country code from locale (e.g., CA from en-CA)
    if (localeCountry && currencyMap[localeCountry]) {
      return currencyMap[localeCountry];
    }
    
    // 2. NEW: Timezone Tie-Breaker if no region in locale (e.g., just "de" or "en")
    if (!localeCountry && timezone) {
      // Check specific timezone keywords to determine region
      if (timezone.includes('Zurich')) {
        localeCountry = 'CH';
      } else if (timezone.includes('London') || timezone === 'Europe/Belfast') {
        localeCountry = 'GB';
      } else if (timezone.startsWith('America/')) {
        localeCountry = 'US';
      } else if (timezone.startsWith('Europe/')) {
        // Generic European timezone (not Zurich/London) -> default to Germany/EUR
        localeCountry = 'DE';
      }
      
      // Map the tie-breaker region to currency
      if (localeCountry && currencyMap[localeCountry]) {
        return currencyMap[localeCountry];
      }
    }
    
    // 3. Fallback: try IP-based geolocation API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('https://ipapi.co/json/', { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      // Use country code from IP API
      if (data.country_code && currencyMap[data.country_code]) {
        return currencyMap[data.country_code];
      }
      
      // Fallback to currency from API if country not in our map
      if (data.currency) {
        const supportedCurrencies = ['USD', 'GBP', 'EUR', 'CHF'];
        if (supportedCurrencies.includes(data.currency)) {
          return data.currency;
        }
      }
    } catch (apiError) {
      console.log('IP geolocation API failed, using locale/timezone-based detection');
    }
    
    // 4. Final fallback: EUR (most common for European visitors)
    return 'EUR';
  } catch (error) {
    console.error('Currency detection failed:', error);
    return 'EUR'; // Default fallback
  }
};
