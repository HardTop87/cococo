// Simple site configuration: colors, typography, and copy
// Edit values below to customize the homepage without touching HTML/CSS.

window.SITE_CONFIG = {
  // site version: update this string (e.g. 1.0.0 or timestamp) on every deploy to bust cache
  version: "1.0.0",
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
    pricingPreview: {
      title: 'Fair Pricing',
      description: 'Flexible Preismodelle für jedes Unternehmen'
    },
    // Centralized pricing plan texts and numeric values used by the pricing page
    pricingPlans: {
      grow: {
        title: 'Grow',
        subtitle: 'Our fair pricing to support small manufacturers',
        monthly: 500,
        yearly: 5500,
        setup: 2500,
        cta: 'Select Plan',
        description: 'Basisfunktionen, schnelle Integration und E-Mail-Support.'
        ,
        // Plan-specific copy for detailed support panel
        setupBullets: [
          'Guided setup & onboarding (2 weeks)',
          'Data migration assistance',
          'team training sessions (web meeting)',
          '2 months silver support included'
        ],
        features: [
          { text: 'CoCoCo Integration Backbone', included: true },
          { text: 'Unlimited users', included: true },
          { text: 'Custom apps', included: true },
          { text: 'Feature 1', included: true },
          { text: 'Feature 2', included: true },
          { text: 'Feature 3', included: true },
          { text: 'Multi-site support', included: false },
          { text: 'ABC', included: false },
          { text: 'QRS', included: false }
        ]
      },
      professional: {
        title: 'Professional',
        subtitle: 'For full production operations',
        monthly: 1000,
        yearly: 11000,
        setup: 2500,
        cta: 'Select Plan',
        description: 'Erweiterte Integrationen, SLA und dedizierter Support.'
        ,
        setupBullets: [
          'Dedicated onboarding specialist (4 weeks)',
          'Data migration and mapping support',
          'First custom workflow configuration',
          '3× training sessions',
          '60 days priority email support'
        ],
        features: [
          { text: 'Everything in Grow', included: true },
          { text: 'SLA & priority support', included: true },
          { text: 'Custom reporting', included: true },
          { text: '5 connected systems', included: true },
          { text: 'Role-based access controls', included: true }
        ]
      },
      enterprise: {
        title: 'Enterprise',
        subtitle: 'For big customers, multi-plant operations and custom solutions',
        monthly: 0,
        yearly: 0,
        setup: 0,
        cta: 'Contact Sales',
        description: 'Individuelle Angebote, Onboarding und Integrationssupport.'
        ,
        setupBullets: [
          'Named implementation manager & PM',
          'Complex data migration & integration support',
          'On-site training available where needed',
          'SLA-backed 24/7 premium support (90 days)',
          'Custom reporting & export setup'
        ],
        features: [
          { text: 'Everything in Professional', included: true },
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
