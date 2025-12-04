// Apply SITE_CONFIG (colors, typography, texts)
function applySiteConfig() {
    const cfg = window.SITE_CONFIG;
    if (!cfg) return;

    const root = document.documentElement;
    const c = cfg.colors;
    if (c) {
        root.style.setProperty('--primary-color', c.primary);
        root.style.setProperty('--secondary-color', c.text);
        root.style.setProperty('--accent-color', c.accent);
        root.style.setProperty('--white', c.background);
        root.style.setProperty('--light-bg', c.surface);
        root.style.setProperty('--text-dark', c.text);
        root.style.setProperty('--text-light', c.mutedText);
        root.style.setProperty('--peach', c.surface);
        root.style.setProperty('--berry', c.text);
        root.style.setProperty('--pig', c.primary);
        root.style.setProperty('--moss', c.accent);
        root.style.setProperty('--border-color', c.border);
        // regenerate gradients:
        // - gradient-1: primary -> text (Pig -> Berry) for primary buttons/backgrounds
        root.style.setProperty('--gradient-1', `linear-gradient(135deg, ${c.primary} 0%, ${c.text} 100%)`);
        // expose a primary hover color and keep gradient-2 removed per request
        root.style.setProperty('--primary-hover', c.primaryHover || c.primary);
    }

    const t = cfg.typography;
    if (t) {
        root.style.setProperty('--base-font-size', t.baseSize);
        document.body.style.fontFamily = t.fontFamily;
    }

    // Data-driven text binding
    const bindText = (key, value) => {
        document.querySelectorAll(`[data-config="${key}"]`).forEach(el => {
            el.textContent = value;
        });
    };

    // Brand
    if (cfg.brand) {
        bindText('brand.name', cfg.brand.name);
        bindText('brand.tagline', cfg.brand.tagline);
        bindText('brand.logoText', cfg.brand.logoText);
    }

    // Hero
    if (cfg.content) {
        bindText('hero.title', cfg.content.heroTitle);
        bindText('hero.subtitle', cfg.content.heroSubtitle);
        // Pricing intro
        if (cfg.content.pricingIntro) bindText('pricing.intro', cfg.content.pricingIntro);
        // Bind CTA copy keys (cta.main, cta.demo, cta.headline, etc.)
        if (cfg.content.cta && typeof cfg.content.cta === 'object') {
            Object.keys(cfg.content.cta).forEach(k => {
                const val = cfg.content.cta[k];
                // Handle button objects with text and href
                if (typeof val === 'object' && val.text) {
                    bindText(`cta.${k}`, val.text);
                    const btn = document.querySelector(`[data-config="cta.${k}"]`);
                    if (btn && val.href) {
                        btn.setAttribute('href', val.href);
                    }
                } else {
                    bindText(`cta.${k}`, val);
                }
            });
        }
        // Bind pricing preview texts
        if (cfg.content.pricingPreview && typeof cfg.content.pricingPreview === 'object') {
            Object.keys(cfg.content.pricingPreview).forEach(k => {
                bindText(`pricingPreview.${k}`, cfg.content.pricingPreview[k]);
            });
        }
        const heroPrimary = document.querySelector('[data-config="hero.cta.primary"]');
        const heroSecondary = document.querySelector('[data-config="hero.cta.secondary"]');
        if (heroPrimary && cfg.content.heroCTA?.primary) {
            heroPrimary.textContent = cfg.content.heroCTA.primary.text;
            let href = cfg.content.heroCTA.primary.href || '#';
            // If href is a page anchor and we're not on index, point to index.html#anchor
            if (href.startsWith('#')) {
                const path = window.location.pathname.split('/').pop();
                const onIndex = path === '' || path === 'index.html';
                if (!onIndex) href = `index.html${href}`;
            }
            heroPrimary.setAttribute('href', href);
        }
        if (heroSecondary && cfg.content.heroCTA?.secondary) {
            heroSecondary.textContent = cfg.content.heroCTA.secondary.text;
            let href = cfg.content.heroCTA.secondary.href || '#';
            if (href.startsWith('#')) {
                const path = window.location.pathname.split('/').pop();
                const onIndex = path === '' || path === 'index.html';
                if (!onIndex) href = `index.html${href}`;
            }
            heroSecondary.setAttribute('href', href);
        }
        // Wire pricing plan texts and numeric values if present in config
        if (cfg.content.pricingPlans) {
            const formatter = new Intl.NumberFormat('de-DE');
            Object.keys(cfg.content.pricingPlans).forEach(planKey => {
                const plan = cfg.content.pricingPlans[planKey];

                // Bind textual pieces by data-config keys if present
                if (plan.title) bindText(`pricing.${planKey}.title`, plan.title);
                if (plan.subtitle) bindText(`pricing.${planKey}.subtitle`, plan.subtitle);
                if (plan.description) bindText(`pricing.${planKey}.description`, plan.description);
                if (plan.cta) bindText(`pricing.${planKey}.cta`, plan.cta);

                // Find pricing card by data-plan attribute and set data attributes + visible amount
                const card = document.querySelector(`.pricing-card[data-plan="${planKey}"]`);
                if (card) {
                    const amountEl = card.querySelector('.amount');
                    if (amountEl) {
                        // Store raw numbers in data attributes
                        amountEl.setAttribute('data-monthly', String(plan.monthly));
                        amountEl.setAttribute('data-yearly', String(plan.yearly));

                        // If billing switch exists, choose display accordingly, else default to monthly
                        const billingSwitchEl = document.getElementById('billing-switch');
                        const isYearly = billingSwitchEl ? billingSwitchEl.checked : false;
                        const displayPrice = isYearly ? plan.yearly : plan.monthly;
                        amountEl.textContent = formatter.format(displayPrice);
                    }

                    // Ensure setup fee is present on the card element (for support totals)
                    if (plan.setup !== undefined) {
                        card.setAttribute('data-setup', String(plan.setup));
                    }

                    // Render plan-specific setup bullets and features into the pricing card
                    const featuresEl = card.querySelector('.pricing-features');
                    if (featuresEl) {
                        // Build rich markup: headings, SVG check icons, divider, and muted styling for advanced items
                        const makeIcon = () => `
                            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

                        const makeXIcon = () => `
                            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

                        const isMutedFeature = (text) => {
                            const key = text.toLowerCase();
                            return key.includes('advanced') || key.includes('api') || key.includes('multi-site') || key.includes('multi site');
                        };

                        let items = [];

                        if (Array.isArray(plan.setupBullets) && plan.setupBullets.length) {
                            items.push(`<li class="section-heading">Setup & Migration:</li>`);
                            plan.setupBullets.forEach(b => {
                                const safe = String(b);
                                items.push(`<li class="feature-item">${makeIcon()}<span class="feature-text">${safe}</span></li>`);
                            });
                            items.push(`<li class="divider-line" aria-hidden="true"></li>`);
                        }

                        if (Array.isArray(plan.features) && plan.features.length) {
                            items.push(`<li class="section-heading">Subscription:</li>`);

                            const includedFeatures = [];
                            const excludedFeatures = [];

                            plan.features.forEach(f => {
                                let text = '';
                                let included = true;
                                if (typeof f === 'object' && f !== null) {
                                    text = String(f.text || '');
                                    if (f.included === false) included = false;
                                } else {
                                    text = String(f);
                                    const low = text.toLowerCase().trim();
                                    if (low.startsWith('x ') || low.startsWith('✗ ') || low.startsWith('not ') || low.includes('nicht') || low.includes('not included')) {
                                        included = false;
                                    }
                                }

                                if (included) includedFeatures.push(text); else excludedFeatures.push(text);
                            });

                            // render included features first
                            includedFeatures.forEach(fText => {
                                const muted = isMutedFeature(fText) ? 'muted-feature' : '';
                                items.push(`<li class="feature-item ${muted}">${makeIcon()}<span class="feature-text">${fText}</span></li>`);
                            });

                            // render excluded features at the end, separated and using X icon
                            if (excludedFeatures.length) {
                                items.push(`<li class="divider-line" aria-hidden="true"></li>`);
                                excludedFeatures.forEach(fText => {
                                    items.push(`<li class="feature-item excluded-feature muted-feature">${makeXIcon()}<span class="feature-text">${fText.replace(/^x\s+|^✗\s+/i, '')}</span></li>`);
                                });
                            }

                            // Debug: log included/excluded arrays for this plan (use info so it's visible)
                            try { console.info('Pricing render for', planKey, { included: includedFeatures, excluded: excludedFeatures }); } catch (e) {}
                        }

                        featuresEl.innerHTML = items.join('');
                    }
                }
            });
        }
    }
}

// Build/version marker for debugging (update on edits)
const SCRIPT_BUILD = '2025-12-03T12:00:00Z';

// Confirm script loaded early
try { console.log('script.js loaded'); } catch (e) {}

// Initialize badge scroll with seamless loop
function initBadgeScroll() {
    const container = document.getElementById('badgeScrollContent');
    if (!container) return;
    
    // Configuration: adjust these values to customize the scroll behavior
    const SCROLL_SPEED = 4;    // pixels per second (higher = faster)
    const LOOP_COUNT = 20;        // number of times to duplicate content (1 = double, 2 = triple, etc.)
    
    // Clone children for seamless loop
    const children = Array.from(container.children);
    for (let i = 0; i < LOOP_COUNT; i++) {
        children.forEach(child => {
            const clone = child.cloneNode(true);
            container.appendChild(clone);
        });
    }
    
    // Calculate width and set animation duration based on content
    const totalWidth = container.scrollWidth / (LOOP_COUNT + 1);
    const duration = totalWidth / SCROLL_SPEED;
    container.style.animationDuration = `${duration}s`;
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.info('[CoCoCo] script DOMContentLoaded', { scriptBuild: SCRIPT_BUILD });
        const pig = getComputedStyle(document.documentElement).getPropertyValue('--pig') || '(unset)';
        console.info('[CoCoCo] CSS variable --pig:', pig.trim());
        console.info('[CoCoCo] SITE_CONFIG present:', Boolean(window.SITE_CONFIG));
    } catch (e) { /* ignore logging errors */ }
    highlightCurrentNav();
    initBadgeScroll();
});

// Also ensure config is applied after all resources load (covers race conditions)
window.addEventListener('load', () => {
    try {
        if (typeof applySiteConfig === 'function') applySiteConfig();
    } catch (e) {}
});

// Highlight the current navigation tab based on the page path
function highlightCurrentNav() {
    const links = document.querySelectorAll('.nav-menu a');
    if (!links || links.length === 0) return;

    // Determine current page basename (treat empty as index.html)
    const currentPageRaw = window.location.pathname.split('/').pop();
    const currentPage = (currentPageRaw === '' || currentPageRaw === undefined) ? 'index.html' : currentPageRaw;

    links.forEach(a => {
        a.classList.remove('active');
        
        // Skip dropdown toggles (they don't link to pages)
        if (a.classList.contains('dropdown-toggle')) return;
        
        const href = a.getAttribute('href') || '';
        try {
            const resolved = new URL(href, window.location.href);
            const targetPageRaw = resolved.pathname.split('/').pop();
            const targetPage = (targetPageRaw === '' || targetPageRaw === undefined) ? 'index.html' : targetPageRaw;
            if (targetPage === currentPage) {
                a.classList.add('active');
            }
        } catch (e) {
            // On invalid URL (shouldn't happen), skip
        }
    });
}

// --- Back to Top button: create, show on scroll, smooth-scroll to top ---
function createBackToTop() {
    if (document.getElementById('back-to-top')) return;

    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    // Use a clean, modern SVG chevron (inherits button color via currentColor)
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    document.body.appendChild(btn);

    const threshold = 240;
    const onScroll = () => {
        if (window.scrollY > threshold) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Create the button once DOM is ready (and after partials injection happens)
document.addEventListener('DOMContentLoaded', () => {
    // slight timeout to allow header/footer injection and layout to settle
    setTimeout(createBackToTop, 120);
});

// Ensure anchors that are page-local (e.g. "#pricing") navigate to index.html when clicked from other pages
document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;

    // If href is a hash-only anchor and we are not on index, redirect to index.html#anchor
    if (href.startsWith('#')) {
        const path = window.location.pathname.split('/').pop();
        const onIndex = path === '' || path === 'index.html';
        if (!onIndex) {
            e.preventDefault();
            window.location.href = `index.html${href}`;
        }
    }
});

// If we land on a page with a hash (e.g., index.html#pricing), perform a smooth scroll with offset after content is ready
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        // small timeout to ensure layout (images, injected partials) have settled
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }, 80);
    }
});

// Load header and footer partials into placeholders
document.addEventListener('DOMContentLoaded', async () => {
    const headerEl = document.getElementById('site-header');
    const footerEl = document.getElementById('site-footer');
    try {
        if (headerEl) {
            const res = await fetch('partials/header.html');
            headerEl.innerHTML = await res.text();
        }
        if (footerEl) {
            const res = await fetch('partials/footer.html');
            footerEl.innerHTML = await res.text();
        }
        // Re-bind config after injection so data-config gets applied
        if (typeof applySiteConfig === 'function') {
            applySiteConfig();
        }
        // Highlight current nav item now that header exists
        if (typeof highlightCurrentNav === 'function') {
            highlightCurrentNav();
        }
        // Re-bind navigation toggles after header injected
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }
        // Initialize pricing interactions if present
        try {
            initPricingInteractions();
        } catch (e) {
            // ignore if not present
        }
    } catch (e) {
        console.error('Failed to load header/footer partials', e);
    }
});

// Mobile Navigation Toggle (guarded for partial-injected header)
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and pricing cards
document.querySelectorAll('.feature-card, .pricing-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        alert('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.');
        
        // Reset form
        contactForm.reset();
    });
}

// Add animation to hero badge (scrolling text effect)
const heroBadge = document.querySelector('.hero-badge');
if (heroBadge) {
    let scrollAmount = 0;
    setInterval(() => {
        scrollAmount += 1;
        if (scrollAmount > 100) {
            scrollAmount = 0;
        }
        heroBadge.style.transform = `translateX(-${scrollAmount}px)`;
    }, 50);
}

// Pricing card hover effect
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        if (card.classList.contains('featured')) {
            card.style.transform = 'scale(1.05)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Add parallax effect to hero decoration
window.addEventListener('scroll', () => {
    const decoration = document.querySelector('.hero-decoration');
    if (decoration) {
        const scrolled = window.pageYOffset;
        decoration.style.transform = `translate(${scrolled * 0.5}px, ${scrolled * 0.3}px)`;
    }
});

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString('de-DE');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString('de-DE');
        }
    };
    
    updateCounter();
};

// Observe stats cards and animate when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const h3 = entry.target.querySelector('h3');
            const text = h3.textContent;
            
            if (text.includes('+')) {
                animateCounter(h3, 10000, 2000);
                h3.textContent = h3.textContent.replace('10000', '10,000');
            }
            
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-card').forEach(card => {
    statsObserver.observe(card);
});

// Pricing Billing Toggle (Monthly/Yearly)
const billingSwitch = document.getElementById('billing-switch');
const monthlyLabel = document.getElementById('monthly-label');
const yearlyLabel = document.getElementById('yearly-label');

if (billingSwitch) {
    // Set initial state
    monthlyLabel.classList.add('active');
    
    billingSwitch.addEventListener('change', function() {
        const isYearly = this.checked;
        const priceElements = document.querySelectorAll('.amount');
        const periodElements = document.querySelectorAll('.period');
        
        // Update labels
        if (isYearly) {
            monthlyLabel.classList.remove('active');
            yearlyLabel.classList.add('active');
        } else {
            monthlyLabel.classList.add('active');
            yearlyLabel.classList.remove('active');
        }
        
        // Update prices and savings
        priceElements.forEach(element => {
            const monthlyPrice = element.getAttribute('data-monthly');
            const yearlyPrice = element.getAttribute('data-yearly');
            
            if (monthlyPrice && yearlyPrice) {
                const monthly = Number(monthlyPrice);
                const yearly = Number(yearlyPrice);
                if (isYearly) {
                    element.textContent = formatNumber(yearly);
                } else {
                    element.textContent = formatNumber(monthly);
                }
            }
        });
        
        // Update savings display
        document.querySelectorAll('.pricing-card').forEach(card => {
            const amountEl = card.querySelector('.amount');
            const savingsEl = card.querySelector('.price-savings');
            if (!amountEl || !savingsEl) return;
            
            const monthly = Number(amountEl.getAttribute('data-monthly') || 0);
            const yearly = Number(amountEl.getAttribute('data-yearly') || 0);
            
            if (isYearly && monthly > 0 && yearly > 0) {
                const fullPrice = monthly * 12;
                const savings = fullPrice - yearly;
                savingsEl.innerHTML = `<span class="strikethrough">€${formatNumber(fullPrice)}</span> Save one month (also on Support)`;
                savingsEl.classList.remove('hidden');
            } else {
                savingsEl.classList.add('hidden');
            }
        });
        
        // Update period text
        periodElements.forEach(element => {
            if (isYearly) {
                element.textContent = '/year';
            } else {
                element.textContent = '/month';
            }
        });
    });
}

// --- Pricing interactions (select plan -> show support panel + setup & migration) ---
const PRICE_STATE_KEY = 'cococo_pricing_state_v1';
// Default fallback support prices (overridden by `SITE_CONFIG.supportPackages` when present)
const DEFAULT_SUPPORT_PRICES = { basic: 0, bronze: 99, silver: 299, gold: 499 };

function loadPriceState() {
    try {
        const raw = localStorage.getItem(PRICE_STATE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

function savePriceState(state) {
    try { localStorage.setItem(PRICE_STATE_KEY, JSON.stringify(state)); } catch (e) {}
}

const PRICE_APP = {
    isAnnual: false,
    selectedPlan: null,
    supportLevels: { grow: 'basic', professional: 'basic', enterprise: 'gold' }
};

function getConfigPlan(planKey) {
    if (window.SITE_CONFIG && SITE_CONFIG.content && SITE_CONFIG.content.pricingPlans) {
        return SITE_CONFIG.content.pricingPlans[planKey] || null;
    }
    return null;
}

function formatNumber(n) { try { return new Intl.NumberFormat('de-DE').format(Math.round(n)); } catch (e) { return String(n); } }

function renderSupportPanel(cardEl, planKey) {
    removeSupportPanel(cardEl);
    const state = PRICE_APP;
    const planCfg = getConfigPlan(planKey) || {};
    const setup = Number(cardEl.getAttribute('data-setup') || planCfg.setup || 0);
    const supportLevel = state.supportLevels[planKey] || 'basic';
    const isYearly = document.getElementById('billing-switch') ? document.getElementById('billing-switch').checked : false;

    // Pull plan-specific copy from the central config (if available)
    const bullets = (planCfg.setupBullets && Array.isArray(planCfg.setupBullets)) ? planCfg.setupBullets : [];
    const features = (planCfg.features && Array.isArray(planCfg.features)) ? planCfg.features : [];
    // Pull global support package definitions (editable from config.js)
    const supportPackages = (window.SITE_CONFIG && window.SITE_CONFIG.content && Array.isArray(window.SITE_CONFIG.content.supportPackages)) ? window.SITE_CONFIG.content.supportPackages : null;
    const panel = document.createElement('div');
    panel.className = 'support-panel';
    // Build the selectable support boxes using config or fallback
    let supportHtml = '';
    if (supportPackages && supportPackages.length) {
        supportHtml += '<div class="support-options support-options-stacked">';
        supportPackages.forEach(pkg => {
            const price = Number(pkg.priceMonthly || DEFAULT_SUPPORT_PRICES[pkg.key] || 0);
            const priceLabel = price > 0 ? `+€${formatNumber(price)}/mo` : 'included';
            const checked = (pkg.key === supportLevel) ? 'checked' : '';
            supportHtml += `<label class="support-option card-support ${checked ? 'selected' : ''}" data-support-key="${pkg.key}">`;
            supportHtml += `<input type="radio" name="support-${planKey}" value="${pkg.key}" ${checked} aria-hidden="true">`;
            supportHtml += `<div class="support-main-row">`;
            supportHtml += `<div class="support-title-row"><span class="support-title">${pkg.title}</span><span class="support-price">${priceLabel}</span></div>`;
            supportHtml += `<div class="support-desc">${pkg.description}</div>`;
            supportHtml += `</div>`;
            supportHtml += `</label>`;
        });
        supportHtml += '</div>';
    } else {
        // fallback simple selector (shouldn't happen when config present)
        supportHtml += '<div class="support-options support-options-stacked">';
        ['basic','bronze','silver','gold'].forEach(k => {
            const price = DEFAULT_SUPPORT_PRICES[k] || 0;
            const priceLabel = price > 0 ? `+€${formatNumber(price)}/mo` : 'included';
            const checked = (k === supportLevel) ? 'checked' : '';
            supportHtml += `<label class="support-option card-support ${checked ? 'selected' : ''}" data-support-key="${k}">`;
            supportHtml += `<input type="radio" name="support-${planKey}" value="${k}" ${checked} aria-hidden="true">`;
            supportHtml += `<div class="support-main-row"><div class="support-title-row"><span class="support-title">${k}</span><span class="support-price">${priceLabel}</span></div><div class="support-desc">—</div></div>`;
            supportHtml += `</label>`;
        });
        supportHtml += '</div>';
    }

    const supportHeaderText = isYearly ? 'Choose Your Support Level <span class="support-save-hint">(Save one month)</span>' : 'Choose Your Support Level';
    panel.innerHTML = `
        <div class="support-header"><h4 class="support-title">${supportHeaderText}</h4></div>
        <div class="support-options-container">
            ${supportHtml}
        </div>
        <div class="support-totals-box">
            <div class="totals-row"><span>Subscription ${isYearly ? '(annual)' : '(monthly)'}</span> <span class="support-subscription">-</span></div>
            <div class="totals-row"><span>Setup Fee (one-time)</span> <span class="support-setup">-</span></div>
            <div class="totals-row support-support hidden"><span>Support ${isYearly ? '(annual)' : '(monthly)'}</span> <span class="support-support-amount">-</span></div>
            <div class="totals-row support-total"><span class="total-label">Total First Year</span> <span class="support-total-amount">-</span></div>
            <div class="totals-row support-year2 hidden"><span class="support-year2-amount">-</span></div>
        </div>
        <button class="btn btn-primary support-cta">Proceed to Checkout</button>
    `;

    // insert panel after the card body
    cardEl.appendChild(panel);

    // set up click/change handlers for the support-option boxes
    const optionLabels = panel.querySelectorAll('.card-support');
    optionLabels.forEach(label => {
        const radio = label.querySelector('input[type="radio"]');
        const key = label.getAttribute('data-support-key');
        // reflect initial selection
        if (key === supportLevel) label.classList.add('selected'); else label.classList.remove('selected');
        // click selects
        label.addEventListener('click', (e) => {
            e.preventDefault();
            // unselect others
            optionLabels.forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
            if (radio) radio.checked = true;
            PRICE_APP.supportLevels[planKey] = key;
            savePriceState(PRICE_APP);
            updateSupportTotals(panel, cardEl, planKey);
        });
    });

    panel.querySelector('.support-cta').addEventListener('click', () => {
        // Placeholder: proceed to checkout flow (left to integrate with server)
        alert('Proceed to checkout - server integration not configured');
    });

    updateSupportTotals(panel, cardEl, planKey);
}

function updateSupportTotals(panel, cardEl, planKey) {
    const isYearly = document.getElementById('billing-switch') ? document.getElementById('billing-switch').checked : false;
    const planCfg = getConfigPlan(planKey) || {};
    const monthly = Number(planCfg.monthly || 0);
    const yearly = Number(planCfg.yearly || 0);
    const planAmount = isYearly ? yearly : monthly;
    const setup = Number(cardEl.getAttribute('data-setup') || planCfg.setup || 0);
    const supportLevel = PRICE_APP.supportLevels[planKey] || 'basic';
    // Resolve support price from config if available
    let supportPrice = DEFAULT_SUPPORT_PRICES[supportLevel] || 0;
    try {
        const pkgs = (window.SITE_CONFIG && window.SITE_CONFIG.content && Array.isArray(window.SITE_CONFIG.content.supportPackages)) ? window.SITE_CONFIG.content.supportPackages : null;
        if (pkgs) {
            const found = pkgs.find(p => p.key === supportLevel);
            if (found) supportPrice = Number(found.priceMonthly || supportPrice);
        }
    } catch (e) {}

    const subTextEl = panel.querySelector('.support-subscription');
    const setupEl = panel.querySelector('.support-setup');
    const supportElWrap = panel.querySelector('.support-support');
    const supportAmtEl = panel.querySelector('.support-support-amount');
    const totalLabelEl = panel.querySelector('.total-label');
    const totalEl = panel.querySelector('.support-total-amount');
    const year2Wrap = panel.querySelector('.support-year2');
    const year2AmtEl = panel.querySelector('.support-year2-amount');

    // Update total label based on billing period
    if (totalLabelEl) {
        totalLabelEl.textContent = isYearly ? 'Total First Year' : 'Total First Month';
    }

    // Update display values (format depends on billing cadence)
    subTextEl.textContent = `€${formatNumber(planAmount)} ${isYearly ? '/yr' : '/mo'}`;
    setupEl.textContent = `€${formatNumber(setup)}`;
    if (supportPrice > 0) {
        supportElWrap.classList.remove('hidden');
        // Annual: 11 months pricing (1 month free), Monthly: normal price
        const supportAnnual = supportPrice * 11;
        supportAmtEl.textContent = isYearly ? `€${formatNumber(supportAnnual)} /yr` : `€${formatNumber(supportPrice)} /mo`;
    } else {
        supportElWrap.classList.add('hidden');
    }

    // Calculate totals
    const supportAnnual = supportPrice * 11; // 11 months = 1 month free
    const total = isYearly ? (setup + planAmount + supportAnnual) : (setup + planAmount + supportPrice);
    totalEl.textContent = `€${formatNumber(total)}`;

    // Show year 2 onwards for annual, ongoing monthly for monthly billing
    if (isYearly) {
        year2Wrap.classList.remove('hidden');
        const year2Total = planAmount + supportAnnual; // no setup fee from year 2
        year2AmtEl.textContent = `Then from year 2: €${formatNumber(year2Total)}/year`;
    } else {
        year2Wrap.classList.remove('hidden');
        const ongoingMonthly = planAmount + supportPrice; // monthly ongoing (no setup)
        year2AmtEl.textContent = `€${formatNumber(ongoingMonthly)}/month ongoing`;
    }
}

function removeSupportPanel(cardEl) {
    const panel = cardEl.querySelector('.support-panel');
    if (panel) panel.remove();
}

function selectPlanFromCard(planKey, cardEl) {
    // Enterprise plan: open email instead of support panel
    if (planKey === 'enterprise') {
        const subject = encodeURIComponent('Enterprise Plan Inquiry - CoCoCo Platform');
        const body = encodeURIComponent('Hello,\n\nI am interested in the CoCoCo Platform Enterprise Plan and would like to discuss:\n\n- Number of sites/locations\n- Expected number of integrations\n- Specific requirements\n- Custom implementation needs\n\nBest regards');
        window.location.href = `mailto:sales@wearecococo.com?subject=${subject}&body=${body}`;
        return;
    }
    
    // Toggle selection
    if (PRICE_APP.selectedPlan === planKey) {
        PRICE_APP.selectedPlan = null;
        removeSupportPanel(cardEl);
    } else {
        // Close all other support panels first
        document.querySelectorAll('.pricing-card').forEach(card => {
            if (card !== cardEl) {
                removeSupportPanel(card);
            }
        });
        
        PRICE_APP.selectedPlan = planKey;
        // ensure support level set
        PRICE_APP.supportLevels[planKey] = PRICE_APP.supportLevels[planKey] || 'basic';
        renderSupportPanel(cardEl, planKey);
        // scroll into view for better UX
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    savePriceState(PRICE_APP);
}

function initPricingInteractions() {
    // restore state
    const saved = loadPriceState();
    if (saved) Object.assign(PRICE_APP, saved);

    // wire buttons inside pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        const plan = card.getAttribute('data-plan');
        // Prefer an explicit CTA button (data-config) or .btn; fall back to first button
        let selectBtn = null;
        if (plan) selectBtn = card.querySelector(`[data-config="pricing.${plan}.cta"]`);
        if (!selectBtn) selectBtn = card.querySelector('.btn');
        if (!selectBtn) selectBtn = card.querySelector('button');
        if (plan && selectBtn) {
            // Add debug info for wiring
            try { console.debug('Wiring pricing select button for plan', plan, selectBtn); } catch (e) {}
            selectBtn.addEventListener('click', (e) => {
                try { e.preventDefault(); } catch (err) {}
                try { selectPlanFromCard(plan, card); } catch (err) { console.error('selectPlanFromCard error', err); }
            });
        } else if (plan) {
            try { console.warn('No select button found for pricing card', plan, card); } catch (e) {}
        }
        // if previously selected, re-open panel
        if (plan && PRICE_APP.selectedPlan === plan) {
            renderSupportPanel(card, plan);
        }
    });

    // update when billing toggle changes
    const bill = document.getElementById('billing-switch');
    if (bill) {
        bill.addEventListener('change', () => {
            document.querySelectorAll('.support-panel').forEach(p => {
                const card = p.closest('.pricing-card');
                if (card) {
                    const plan = card.getAttribute('data-plan');
                    // Re-render the entire panel to update header text
                    renderSupportPanel(card, plan);
                }
            });
        });
    }
}

// initialize pricing interactions at load (will be safe if called multiple times)
document.addEventListener('DOMContentLoaded', () => {
    try { initPricingInteractions(); } catch (e) { /* ignore */ }
});

// Delegated click fallback: ensure clicks on pricing-card buttons open the support panel
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pricing-card .btn, .pricing-card button, .pricing-card [data-config^="pricing."]');
    if (!btn) return;
    const card = btn.closest('.pricing-card');
    if (!card) return;
    const plan = card.getAttribute('data-plan');
    if (!plan) return; // nothing we can do
    try { console.debug('Delegated click detected for plan', plan); } catch (e) {}
    try { e.preventDefault(); } catch (e) {}
    try { selectPlanFromCard(plan, card); } catch (err) { console.error('Delegated selectPlanFromCard error', err); }
});

// Log for debugging
console.log('CoCoCo Platform Website initialized successfully!');
