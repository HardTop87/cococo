// Simple site configuration: colors, typography, and copy
// Edit values below to customize the homepage without touching HTML/CSS.

window.SITE_CONFIG = {
  // site version: update this string (e.g. 1.0.0 or timestamp) on every deploy to bust cache
  version: "1.0.6",
  brand: {
    name: "CoCoCo Platform",
    tagline: "The pioneering open platform for print",
    logoText: "CoCoCo Platform",
  },
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
    pricingPlans: {
      setupNote: 'Need more? We build custom integrations for legacy machines and software on request..',
      grow: {
        title: 'Grow',
        subtitle: 'Full power, priced for small teams (≤ 10 employees)',
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
    supportPackages: [
      {
        key: 'basic',
        title: 'Basic Support',
        priceMonthly: 0,
        description: 'Email & Ticketing (48h response, Mo-Fr 8-5 working hours, CET), Knowledge Base',
      },
      {
        key: 'bronze',
        title: 'Bronze Support',
        priceMonthly: 99,
        description: 'Basic + 24h response (Mo-Fr 8-5 working hours, CET)',
      },
      {
        key: 'silver',
        title: 'Silver Support',
        priceMonthly: 299,
        description: 'Bronze + 6h response (Mo-Fr 8-8 working hours, CET)\n- incl. Chat (per invite)',
      },
      {
        key: 'gold',
        title: 'Gold Support',
        priceMonthly: 499,
        description: 'Silver + 2h response, dedicated CSM, quarterly reviews',
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
