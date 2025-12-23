// Mobile dropdown toggle function
window.toggleMobileDropdown = function(toggle) {
    if (window.innerWidth <= 1000) {
        const dropdown = toggle.closest('.dropdown');
        const megaMenu = dropdown.querySelector('.dropdown-menu');
        
        // Toggle active class
        megaMenu.classList.toggle('active');
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu !== megaMenu) {
                menu.classList.remove('active');
            }
        });
    } else {
        // Desktop: Navigate to page
        const desktopHref = toggle.getAttribute('data-desktop-href');
        if (desktopHref && desktopHref !== '') {
            window.location.href = desktopHref;
        }
    }
};

// Load HTML partials (header, footer)
function loadPartial(url, targetId) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${url}`);
            }
            return response.text();
        })
        .then(html => {
            const target = document.getElementById(targetId);
            if (target) {
                target.innerHTML = html;
                
                // Initialize navigation after header is loaded
                if (targetId === 'site-header') {
                    initMobileNavigation();
                }
            }
        })
        .catch(error => {
            console.error('Error loading partial:', error);
        });
}

// Mobile Navigation Initialization
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        // Hamburger toggle
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link (but not dropdown-toggle)
        document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                // Close all dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('active');
                });
            });
        });
    }
}

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
                // Skip setupNote, it's not a plan
                if (planKey === 'setupNote') return;
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
                        // Get currency-specific prices or fallback to legacy fields (EUR)
                        const currency = window.currentPricingCurrency || 'EUR';
                        let monthly, yearly, setup;
                        
                        if (plan.prices && plan.prices[currency]) {
                            monthly = plan.prices[currency].monthly;
                            yearly = plan.prices[currency].yearly;
                            setup = plan.prices[currency].setup;
                        } else {
                            monthly = plan.monthly;
                            yearly = plan.yearly;
                            setup = plan.setup;
                        }
                        
                        // Store raw numbers in data attributes
                        amountEl.setAttribute('data-monthly', String(monthly));
                        amountEl.setAttribute('data-yearly', String(yearly));
                        amountEl.setAttribute('data-currency', currency);

                        // If billing switch exists, choose display accordingly, else default to monthly
                        const billingSwitchEl = document.getElementById('billing-switch');
                        const isYearly = billingSwitchEl ? billingSwitchEl.checked : false;
                        const displayPrice = isYearly ? yearly : monthly;
                        amountEl.textContent = formatter.format(displayPrice);
                    }

                    // Ensure setup fee is present on the card element (for support totals)
                    if (plan.setup !== undefined || (plan.prices && plan.prices[window.currentPricingCurrency || 'EUR'])) {
                        const currency = window.currentPricingCurrency || 'EUR';
                        const setup = (plan.prices && plan.prices[currency]) ? plan.prices[currency].setup : plan.setup;
                        
                        card.setAttribute('data-setup', String(setup));
                        
                        // Update setup fee display in the card
                        const setupAmountEl = card.querySelector('.setup-amount');
                        if (setupAmountEl && setup > 0) {
                            const currencySymbol = (currencySymbols && currencySymbols[currency]) || '€';
                            setupAmountEl.textContent = `${currencySymbol}${formatter.format(setup)}`;
                        }
                    }

                    // Render plan-specific setup bullets and features into the pricing card
                    const featuresEl = card.querySelector('.pricing-features');
                    if (featuresEl) {
                        // Build rich markup: headings, SVG check icons, divider, and muted styling for advanced items
                        const makeIcon = () => `
                            <svg class="pricing-feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

                        const makeXIcon = () => `
                            <svg class="pricing-feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

                        const isMutedFeature = (text) => {
                            const key = text.toLowerCase();
                            return key.includes('xyz');
                        };

                        let items = [];

                        if (Array.isArray(plan.setupBullets) && plan.setupBullets.length) {
                            items.push(`<li class="section-heading">Setup & Migration:</li>`);
                            plan.setupBullets.forEach(b => {
                                const safe = String(b);
                                items.push(`<li class="pricing-feature-item">${makeIcon()}<span class="pricing-feature-text">${safe}</span></li>`);
                            });
                            // Add setup note if defined in config
                            const setupNote = window.SITE_CONFIG?.content?.pricingPlans?.setupNote;
                            if (setupNote) {
                                items.push(`<li class="pricing-note">${setupNote}</li>`);
                            }
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
                                items.push(`<li class="pricing-feature-item ${muted}">${makeIcon()}<span class="pricing-feature-text">${fText}</span></li>`);
                            });

                            // render excluded features at the end, separated and using X icon
                            if (excludedFeatures.length) {
                                items.push(`<li class="divider-line" aria-hidden="true"></li>`);
                                excludedFeatures.forEach(fText => {
                                    items.push(`<li class="pricing-feature-item excluded-feature muted-feature">${makeXIcon()}<span class="pricing-feature-text">${fText.replace(/^x\s+|^✗\s+/i, '')}</span></li>`);
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
    initDetailToggles();
    initPartnersCarousel();
    initGlobalModal();
    initCTALaunch();
    initFeatureThumbnails();
});

// Initialize CTA rocket launch interaction (single-run liftoff and particle burst)
function initCTALaunch() {
    const visuals = document.querySelectorAll('.cta-visual');
    if (!visuals || visuals.length === 0) return;
    visuals.forEach(visual => {
        const wrapper = visual.querySelector('.cta-rocket-wrap');
        if (!wrapper) return;
        const rocket = wrapper.querySelector('.cta-rocket');
        if (!rocket) return;
        let launched = false;
        const launch = () => {
            if (launched) return;
            launched = true;
            // add prelaunch class for shaking handled by CSS
            wrapper.classList.add('prelaunch');
            // ensure button is disabled to prevent re-tries
            const btn = visual.querySelector('.cta-launch-btn');
            if (btn) btn.disabled = true;
            // short shake duration then liftoff
            setTimeout(() => {
                wrapper.classList.remove('prelaunch');
                wrapper.classList.add('launching');
                rocket.addEventListener('animationend', () => {
                    wrapper.classList.remove('launching');
                    wrapper.classList.add('launched');
                    wrapper.style.visibility = 'hidden';
                }, { once: true });
            }, 400);
        };

        // Button based launch with countdown
        let btn = visual.querySelector('.cta-launch-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cta-launch-btn btn btn-secondary';
            btn.textContent = 'Launch';
            visual.insertAdjacentElement('beforeend', btn);
        }
        // Create countdown overlay
        let countdownEl = wrapper.querySelector('.cta-countdown');
        if (!countdownEl) {
            countdownEl = document.createElement('div');
            countdownEl.className = 'cta-countdown';
            countdownEl.setAttribute('aria-hidden', 'true');
            wrapper.appendChild(countdownEl);
        }

        const startCountdown = () => {
            if (launched) return;
            let n = 3;
            countdownEl.textContent = n;
            countdownEl.setAttribute('aria-hidden', 'false');
            countdownEl.classList.add('visible');
            btn.disabled = true;
            const tick = () => {
                n -= 1;
                if (n > 0) {
                    countdownEl.textContent = n;
                    setTimeout(tick, 1000);
                } else {
                    countdownEl.textContent = 'Go!';
                    setTimeout(() => {
                        countdownEl.setAttribute('aria-hidden', 'true');
                        countdownEl.classList.remove('visible');
                        launch();
                    }, 500);
                }
            };
            setTimeout(tick, 1000);
        };

        btn.addEventListener('click', (e) => { e.preventDefault(); startCountdown(); });
        btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startCountdown(); }});
    });
}

// Create a single, global modal for all carousels
function initGlobalModal() {
        if (document.getElementById('carousel-modal')) return;
        const html = `
        <div id="carousel-modal" class="carousel-modal" aria-hidden="true" role="dialog" aria-modal="true">
            <div class="carousel-modal-content">
                <button class="modal-close" aria-label="Close">✕</button>
                <div class="modal-image-wrap"><img class="modal-img" src="" alt="" /></div>
                <div class="modal-controls"><button class="modal-zoom-in" aria-label="Zoom In">+</button><button class="modal-zoom-out" aria-label="Zoom Out">−</button></div>
            </div>
        </div>`;
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        document.body.appendChild(tmp.firstElementChild);

        // Attach close events and full transform-based pan/zoom
        const modal = document.getElementById('carousel-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const imgWrap = modal.querySelector('.modal-image-wrap');
        const modalImg = modal.querySelector('.modal-img');
        const zoomInBtn = modal.querySelector('.modal-zoom-in');
        const zoomOutBtn = modal.querySelector('.modal-zoom-out');
        let scale = 1;
        let panX = 0;
        let panY = 0;
        let isPanning = false;
        let startX = 0;
        let startY = 0;
        const minScale = 1;
        const maxScale = 4;
        const updateTransform = () => {
            // Reset pan to center when zooming back to 1x
            if (scale <= 1) {
                panX = 0;
                panY = 0;
            }
            // Use translate3d for hardware acceleration and smooth panning
            modalImg.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`;
            if (scale > 1) {
                modalImg.classList.add('zoomed');
            } else {
                modalImg.classList.remove('zoomed');
            }
        };
        const resetTransform = () => { scale = 1; panX = 0; panY = 0; updateTransform(); modalImg.style.width = ''; };

        const closeModal = () => {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            resetTransform();
            // cleanup gesture state
            pointers.clear();
            isPanning = false;
            initialPinchDistance = 0;
            initialPinchScale = scale;
        };
        const openModal = (src, alt, fallbackSrc) => {
            modalImg.src = src;
            // We'll try fallback if full variant fails
            modalImg.onerror = () => {
                if (fallbackSrc && modalImg.src !== fallbackSrc) {
                    modalImg.onerror = null;
                    modalImg.src = fallbackSrc;
                }
            };
            modalImg.alt = alt || '';
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            resetTransform();
        };
        // Expose open/close functions so other modules can call them
        window.openCarouselModal = openModal;
        window.closeCarouselModal = closeModal;

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => {
            const m = document.getElementById('carousel-modal');
            if (!m || m.getAttribute('aria-hidden') === 'true') return;
            // when modal is visible, handle keys
            if (e.key === 'Escape') closeModal();
            if (e.key === '+' || e.key === '=') { scale = Math.min(maxScale, scale + 0.5); updateTransform(); }
            if (e.key === '-') { scale = Math.max(minScale, scale - 0.5); if (scale <= 1) { panX = 0; panY = 0; } updateTransform(); }
            if (e.key === 'ArrowLeft') { panX -= 50; updateTransform(); }
            if (e.key === 'ArrowRight') { panX += 50; updateTransform(); }
            if (e.key === 'ArrowUp') { panY -= 50; updateTransform(); }
            if (e.key === 'ArrowDown') { panY += 50; updateTransform(); }
        });
        // Zoom controls
        zoomInBtn.addEventListener('click', () => { scale = Math.min(maxScale, scale + 0.5); updateTransform(); });
        zoomOutBtn.addEventListener('click', () => { 
            scale = Math.max(minScale, scale - 0.5); 
            if (scale <= 1) { panX = 0; panY = 0; }
            updateTransform(); 
        });
        // Multi-pointer support: panning on desktop and pinch-to-zoom on touch devices
        const pointers = new Map();
        let initialPinchDistance = 0;
        let initialPinchScale = 1;
        let pinchAnchor = { x: 0, y: 0, px: 0, py: 0 };
        let lastTap = 0;

        const getDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
        const getMidpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

        const onPointerDownModal = (e) => {
            if (modal.getAttribute('aria-hidden') === 'true') return;
            if (e.cancelable) e.preventDefault();
            // Accept mouse left-button and touch/pen pointers
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            pointers.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY });
            // Track double-tap / double-click for toggling zoom
            const now = Date.now();
            if (now - lastTap < 300) {
                // double tap/click: toggle zoom
                if (scale <= 1) {
                    // zoom to 2x centered on tap location
                    const rect = modalImg.getBoundingClientRect();
                    const px = (e.clientX - rect.left - panX) / scale;
                    const py = (e.clientY - rect.top - panY) / scale;
                    scale = 2; // target
                    panX = e.clientX - rect.left - px * scale;
                    panY = e.clientY - rect.top - py * scale;
                } else {
                    // zoom out: center image
                    scale = 1; 
                    panX = 0; 
                    panY = 0;
                }
                updateTransform();
                lastTap = 0;
                return;
            }
            lastTap = now;

            if (pointers.size === 2) {
                // start pinch
                const [p1, p2] = Array.from(pointers.values());
                initialPinchDistance = getDistance(p1, p2);
                initialPinchScale = scale;
                const midpoint = getMidpoint(p1, p2);
                // compute anchor point inside image local coords
                const rect = modalImg.getBoundingClientRect();
                const px = (midpoint.x - rect.left - panX) / scale;
                const py = (midpoint.y - rect.top - panY) / scale;
                pinchAnchor = { x: midpoint.x, y: midpoint.y, px, py };
            } else if (pointers.size === 1 && scale > 1) {
                // single pointer panning (mouse or touch)
                isPanning = { active: true, rafPending: false };
                startX = e.clientX - panX;
                startY = e.clientY - panY;
                modalImg.setPointerCapture && modalImg.setPointerCapture(e.pointerId);
                modalImg.classList.add('grabbing');
            }
        };

        const onPointerMoveModal = (e) => {
            if (e.cancelable) e.preventDefault();
            if (modal.getAttribute('aria-hidden') === 'true') return;
            if (!pointers.has(e.pointerId)) return;
            pointers.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY });
            if (pointers.size >= 2) {
                // pinch gesture
                const [p1, p2] = Array.from(pointers.values());
                const newDistance = getDistance(p1, p2);
                if (initialPinchDistance > 0) {
                    const newScale = Math.max(minScale, Math.min(maxScale, initialPinchScale * newDistance / initialPinchDistance));
                    // maintain anchor point stable
                    const rect = modalImg.getBoundingClientRect();
                    const px = pinchAnchor.px;
                    const py = pinchAnchor.py;
                    panX = pinchAnchor.x - rect.left - px * newScale;
                    panY = pinchAnchor.y - rect.top - py * newScale;
                    scale = newScale;
                    updateTransform();
                }
            } else if (isPanning) {
                // smooth panning with direct coordinate update
                panX = e.clientX - startX;
                panY = e.clientY - startY;
                // Use requestAnimationFrame for smooth rendering
                if (!isPanning.rafPending) {
                    isPanning.rafPending = true;
                    requestAnimationFrame(() => {
                        updateTransform();
                        isPanning.rafPending = false;
                    });
                }
            }
        };

        const onPointerUpModal = (e) => {
            if (modal.getAttribute('aria-hidden') === 'true') return;
            if (pointers.has(e.pointerId)) pointers.delete(e.pointerId);
            if (isPanning && isPanning.active) {
                isPanning = false;
                modalImg.releasePointerCapture && modalImg.releasePointerCapture(e.pointerId);
                modalImg.classList.remove('grabbing');
            }
            // reset pinch state when fewer than 2 pointers remain
            if (pointers.size < 2) {
                initialPinchDistance = 0;
                initialPinchScale = scale;
            }
        };

        // Attach modal pointer events
        modalImg.addEventListener('pointerdown', onPointerDownModal);
        window.addEventListener('pointermove', onPointerMoveModal);
        window.addEventListener('pointerup', onPointerUpModal);
        // Touch fallbacks
        modalImg.addEventListener('touchstart', (e) => {}, { passive: false });
}

// Partners Carousel: responsive, touch-friendly, arrows on desktop, dots on mobile
function initPartnersCarousel() {
    const carousels = document.querySelectorAll('.partners-carousel');
    if (!carousels || carousels.length === 0) return;

    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children); // initial slides (will include clones after setup)
        const realSlides = slides.slice(); // keep the originals for cloning and index mapping
        const btnPrev = carousel.querySelector('.carousel-btn.prev');
        const btnNext = carousel.querySelector('.carousel-btn.next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        const announcer = carousel.querySelector('.carousel-announcer');
        let slidesPerView = 3; // default to 3 as requested
        let pageIndex = 0; // used for page-based dots
        let currentIndex = 0; // current absolute index (includes clones)
        let pageCount = 1;
        let startX = 0;
        let currentTranslateX = 0;
        let isDragging = false;
        let didDrag = false; // track if a pointer move exceeded threshold (for click suppression)
        let isAnimating = false; // lock during transition

        const getSlidesPerView = () => {
            const width = carousel.clientWidth;
            if (width >= 1100) return 3; // keep 3 on larger screens
            if (width >= 768) return 3;
            if (width >= 420) return 2;
            return 1;
        };

        // Rebuild layout with infinite clones and calculate sizes
        const updateLayout = () => {
            slidesPerView = getSlidesPerView();
            // remove existing clones if any
            const existingClones = track.querySelectorAll('.clone');
            existingClones.forEach(c => c.remove());

            // number of clones to create on each side to allow smooth infinite
            const cloneCount = slidesPerView;
            // clone last N to beginning
            for (let i = realSlides.length - cloneCount; i < realSlides.length; i++) {
                const clone = realSlides[i].cloneNode(true);
                clone.classList.add('clone');
                track.insertBefore(clone, track.firstChild);
            }
            // clone first N to end
            for (let i = 0; i < cloneCount; i++) {
                const clone = realSlides[i].cloneNode(true);
                clone.classList.add('clone');
                track.appendChild(clone);
            }

            // compute new list of slides including clones
            const allSlides = Array.from(track.children);
            const realCount = realSlides.length;
            // set initial currentIndex to the center of the first page
            const centerOffset = Math.floor(slidesPerView / 2);
            currentIndex = cloneCount + centerOffset;
            pageCount = Math.max(1, Math.ceil(realCount / slidesPerView));
            pageIndex = Math.floor((currentIndex - cloneCount) / slidesPerView);
            renderDots();
            updateTrackPosition(false);
            updateCenterClass();
            // attach click to open lightbox for all slides (including clones)
            allSlides.forEach(slide => {
                const img = slide.querySelector('img');
                if (!img) return;
                if (slide.dataset.clickBound) return; // avoid duplicate handlers
                slide.dataset.clickBound = '1';
                slide.addEventListener('click', (e) => {
                    // if the user was dragging, don't treat as click
                    if (didDrag || isDragging) return;
                    e.preventDefault();
                    openLightbox(img);
                });
                // also bind directly on the image in case the slide click doesn't fire
                if (!img.dataset.clickBound) {
                    img.dataset.clickBound = '1';
                    img.addEventListener('click', (e) => {
                        if (didDrag || isDragging) return;
                        e.preventDefault();
                        openLightbox(img);
                    });
                }
            });
            // update center class
            updateCenterClass();
        };

        // compute slide width (including gap) and set track translation for currentIndex
        const updateTrackPosition = (smooth = true) => {
            const allSlides = Array.from(track.children);
            if (!allSlides.length) return;
            const slideEl = allSlides[0];
            // measure the slide width without transforms: use offsetWidth instead of getBoundingClientRect to ignore transforms
            const slideWidth = slideEl.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 0);
            // compute target center as the viewport center relative to the carousel container
            const carouselRect = carousel.getBoundingClientRect();
            const viewportCenter = window.innerWidth / 2;
            const targetRelativeToCarousel = viewportCenter - carouselRect.left;
            // slide center position (relative to track left)
            const slideCenter = slideWidth * currentIndex + slideWidth / 2;
            const offset = slideCenter - targetRelativeToCarousel;
            track.style.transition = smooth ? 'transform 400ms cubic-bezier(.22,.9,.42,1)' : 'none';
            track.style.transform = `translateX(-${offset}px)`;

            // Update derived paging info
            const cloneCount = slidesPerView;
            const realCount = realSlides.length;
            const realIndex = ((currentIndex - cloneCount) % realCount + realCount) % realCount; // safe modulo
            pageIndex = Math.floor(realIndex / slidesPerView);
            updateActiveDots();
        };

        const updateCenterClass = () => {
            const allSlides = Array.from(track.children);
            const total = allSlides.length;
            const centerIndex = ((currentIndex % total) + total) % total; // safe modulo
            const leftIndex = ((centerIndex - 1) % total + total) % total;
            const rightIndex = ((centerIndex + 1) % total + total) % total;
            const left2Index = ((centerIndex - 2) % total + total) % total;
            const right2Index = ((centerIndex + 2) % total + total) % total;

            allSlides.forEach((s, i) => {
                s.classList.toggle('is-center', i === centerIndex);
                s.classList.toggle('is-left', i === leftIndex);
                s.classList.toggle('is-right', i === rightIndex);
                s.classList.toggle('is-left-2', i === left2Index);
                s.classList.toggle('is-right-2', i === right2Index);
                // remove other adjacent classes from non-matching slides
                if (i !== centerIndex && i !== leftIndex && i !== rightIndex && i !== left2Index && i !== right2Index) {
                    s.classList.remove('is-center', 'is-left', 'is-right', 'is-left-2', 'is-right-2');
                }
            });
        };

        const onTransitionEnd = () => {
            if (!isAnimating) return; // guard against duplicate calls
            const cloneCount = slidesPerView;
            const realCount = realSlides.length;
            if (currentIndex >= cloneCount + realCount) {
                currentIndex -= realCount;
                updateTrackPosition(false);
                updateCenterClass();
            } else if (currentIndex < cloneCount) {
                currentIndex += realCount;
                updateTrackPosition(false);
                updateCenterClass();
            }
            isAnimating = false;
        };

        const renderDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            for (let i = 0; i < pageCount; i++) {
                const d = document.createElement('button');
                d.className = 'carousel-dot';
                d.setAttribute('aria-label', `Show partners ${i + 1}`);
                d.type = 'button';
                if (i === pageIndex) d.classList.add('active');
                d.setAttribute('aria-pressed', i === pageIndex ? 'true' : 'false');
                if (i === pageIndex) d.setAttribute('aria-current', 'true');
                d.addEventListener('click', () => moveToPage(i));
                dotsContainer.appendChild(d);
            }
        };

        // Move by pages (for dot navigation)
        const moveToPage = (idx, smooth = true) => {
            if (isAnimating) return; // prevent simultaneous transitions
            isAnimating = true;
            pageIndex = Math.max(0, Math.min(idx, pageCount - 1));
            // set currentIndex to center of that page
            const cloneCount = slidesPerView;
            const realCount = realSlides.length;
            const centerOffset = Math.floor(slidesPerView / 2);
            currentIndex = cloneCount + pageIndex * slidesPerView + centerOffset;
            updateTrackPosition(smooth);
            track.removeEventListener('transitionend', onTransitionEnd);
            if (smooth) {
                track.addEventListener('transitionend', onTransitionEnd, { once: true });
            } else {
                isAnimating = false;
            }
            updateActiveDots();
            // update button state
            // For infinite carousel there are no disabled states
            if (btnPrev) btnPrev.disabled = false;
            if (btnNext) btnNext.disabled = false;
            if (btnPrev) btnPrev.setAttribute('aria-disabled', 'false');
            if (btnNext) btnNext.setAttribute('aria-disabled', 'false');
            // mark slides visible/hidden for screen readers
            const allSlides = Array.from(track.children);
            if (allSlides && allSlides.length) {
                const start = pageIndex * slidesPerView + slidesPerView; // account for clones
                const end = start + slidesPerView - 1;
                allSlides.forEach((s, i) => s.setAttribute('aria-hidden', (i < start || i > end) ? 'true' : 'false'));
            }
        };

        const updateActiveDots = () => {
            if (!dotsContainer) return;
            const dots = Array.from(dotsContainer.children);
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === pageIndex);
                d.setAttribute('aria-pressed', i === pageIndex ? 'true' : 'false');
                if (i === pageIndex) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
            });
            if (announcer) announcer.textContent = `Page ${pageIndex + 1} of ${pageCount}`;
        };

        const prev = () => moveBy(-1);
        const next = () => moveBy(1);

        const moveBy = (delta, smooth = true) => {
            if (isAnimating) return; // prevent stacking transitions
            isAnimating = true;
            const allSlides = Array.from(track.children);
            const total = allSlides.length;
            currentIndex += delta;
            updateTrackPosition(smooth);
            updateCenterClass();
            // if we moved into clones, reset after transition
            track.removeEventListener('transitionend', onTransitionEnd);
            if (smooth) {
                track.addEventListener('transitionend', onTransitionEnd, { once: true });
            } else {
                isAnimating = false;
            }
        };

        // Pointer / touch support
        const onPointerDown = (e) => {
            // Disable mouse-based dragging (desktop): only allow touch/pen pointer dragging
            if (e.pointerType === 'mouse') return;
            isDragging = true;
            didDrag = false;
            startX = (e.touches ? e.touches[0].clientX : e.clientX);
            const slideEl = track.querySelector('.carousel-slide');
            const slideWidth = slideEl ? (slideEl.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0)) : carousel.clientWidth;
            const centerOffset = Math.floor(slidesPerView / 2);
            currentTranslateX = -(currentIndex - centerOffset) * slideWidth;
            track.style.transition = 'none';
            if (e.pointerId && track.setPointerCapture) {
                try { track.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
            }
            carousel.classList.add('is-dragging');
        };
        const onPointerMove = (e) => {
            if (!isDragging) return;
            const x = (e.touches ? e.touches[0].clientX : e.clientX);
            const dx = x - startX;
            if (Math.abs(dx) > 6) didDrag = true; // small threshold to indicate was dragging
            track.style.transform = `translateX(${currentTranslateX + dx}px)`;
        };
        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;
            const x = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
            const dx = x - startX;
            const threshold = Math.max(22, carousel.clientWidth * 0.07); // proportional threshold
            if (dx > threshold) moveBy(-1);
            else if (dx < -threshold) moveBy(1);
            else moveToPage(pageIndex);
            if (e.pointerId && track.releasePointerCapture) {
                try { track.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
            }
            carousel.classList.remove('is-dragging');
            // Reset didDrag once click handlers have had a chance to run
            setTimeout(() => { didDrag = false; }, 80);
        };

        // Keyboard support
        const onKeyDown = (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'Enter' || e.key === ' ') {
                // open modal for current center slide
                const allSlides = Array.from(track.children);
                const total = allSlides.length;
                const centerIndex = ((currentIndex % total) + total) % total;
                const centerSlide = allSlides[centerIndex];
                if (centerSlide) {
                    const img = centerSlide.querySelector('img');
                    if (img) openLightbox(img);
                }
            }
        };

        // Attach events
        // mouse/pointer
        track.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        // touch fallback (older devices)
        track.addEventListener('touchstart', onPointerDown, { passive: true });
        track.addEventListener('touchmove', onPointerMove, { passive: true });
        track.addEventListener('touchend', onPointerUp);

        // buttons
        btnPrev?.addEventListener('click', prev);
        btnNext?.addEventListener('click', next);

        // keyboard
        carousel.addEventListener('keydown', onKeyDown);

        // Resize handling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateLayout, 120);
        });

        // init
        updateLayout();
        // Allow focus for keyboard navigation
        carousel.setAttribute('tabindex', '0');

        // Handle wheel scrolling: allow vertical scroll, intercept horizontal wheel to navigate carousel
        carousel.addEventListener('wheel', (e) => {
            const modal = document.getElementById('carousel-modal');
            if (modal && modal.getAttribute('aria-hidden') === 'false') {
                return; // let modal handle wheel for zoom
            }
            const absX = Math.abs(e.deltaX);
            const absY = Math.abs(e.deltaY);
            // only intercept horizontal scrolls or large shift+wheel gestures
            if (absX > absY || e.shiftKey) {
                e.preventDefault();
                if (e.deltaX > 0 || e.deltaY > 0) next(); else prev();
            }
            // otherwise, allow default vertical scrolling
        }, { passive: false });
    });
}

// Lightbox - open image fullscreen and allow zoom/pan
function openLightbox(img) {
    if (!img) return;
    const originalSrc = img.getAttribute('src');
    const fullSrc = img.getAttribute('data-full-src') || originalSrc;
    const alt = img.alt || '';
    if (window.openCarouselModal) {
        window.openCarouselModal(fullSrc, alt, originalSrc);
    } else {
        // Fallback if modal wasn't initialized: create a quick inline modal
        const tempModal = document.getElementById('carousel-modal');
        if (tempModal) {
            const modalImg = tempModal.querySelector('.modal-img');
            modalImg.src = fullSrc;
            modalImg.alt = alt;
            tempModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }
}

// Detail Toggle (Mobile Accordion) - show/hide detail-content on small screens
function initDetailToggles() {
    const toggles = document.querySelectorAll('.detail-toggle');
    toggles.forEach(btn => {
        const controls = btn.getAttribute('aria-controls');
        const content = document.getElementById(controls);
        if (!content) return;
        const parent = btn.closest('.cocore-details');
        const setClosed = () => {
            parent.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = 'Show more';
            // remove inline max-height to allow CSS to handle collapsed
            content.style.maxHeight = '';
        };
        const setOpen = () => {
            parent.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            btn.textContent = 'Show less';
            // set explicit maxHeight to content's scrollHeight for smooth animation
            content.style.maxHeight = `${content.scrollHeight}px`;
        };
        // initialize closed
        setClosed();
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // toggle
            if (parent.classList.contains('open')) setClosed(); else setOpen();
        });
        // If the window is resized and is > 767px, ensure we reset styles
        window.addEventListener('resize', () => {
                if (window.innerWidth > 767) {
                // clear mobile-specific open/collapse behaviour
                parent.classList.remove('open');
                content.style.maxHeight = '';
                btn.setAttribute('aria-expanded', 'false');
                    btn.textContent = 'Show more';
            }
        });
    });
}

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
                // Skip dropdown toggles entirely
                if (link.classList.contains('dropdown-toggle') || link.closest('.dropdown')) return;
                link.addEventListener('click', (e) => {
                    // Close mobile navigation by default
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');

                    // Try to smooth scroll anchors on the same page instead of reloading
                    try {
                        const href = link.getAttribute('href') || '';
                        const resolved = new URL(href, window.location.href);

                        // If the link points to another origin, do nothing special
                        if (resolved.origin !== window.location.origin) return;

                        const targetHash = resolved.hash; // includes '#' if any
                        const basename = (p) => { const s = p.split('/').pop(); return (s === '' || s === undefined) ? 'index.html' : s; };
                        const currentBase = basename(window.location.pathname);
                        const targetBase = basename(resolved.pathname);

                        if (targetHash) {
                            // Only handle smooth scroll when target resolves to the same page
                            if (targetBase === currentBase || (targetBase === 'index.html' && currentBase === 'index.html') || (targetBase === 'index.html' && currentBase === '')) {
                                const el = document.querySelector(targetHash);
                                if (el) {
                                    e.preventDefault();
                                    const headerEl = document.querySelector('.navbar');
                                    const offset = headerEl ? headerEl.offsetHeight + 12 : 80;
                                    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                                    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                                        window.scrollTo(0, top);
                                    } else {
                                        window.scrollTo({ top, behavior: 'smooth' });
                                    }
                                }
                            }
                        }
                        else {
                            // If the link points to the same page (e.g., pricing.html => pricing.html), scroll to top instead of reloading
                            if (targetBase === currentBase) {
                                e.preventDefault();
                                const headerEl = document.querySelector('.navbar');
                                const offset = headerEl ? headerEl.offsetHeight + 12 : 0;
                                const top = 0 - 0; // We want to scroll to the top of page
                                if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                                    window.scrollTo(0, 0);
                                } else {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }
                        }
                    } catch (err) {
                        // On invalid URL resolution, silently proceed to normal navigation
                    }
                });
            });
                // If logo clicked and we're currently on the homepage, scroll to top smoothly instead of reloading
                const logoLink = document.querySelector('.logo-link');
                if (logoLink) {
                    logoLink.addEventListener('click', (e) => {
                        const path = window.location.pathname.split('/').pop();
                        const onIndex = (path === '' || path === 'index.html');
                        if (onIndex) {
                            e.preventDefault();
                            // close mobile nav if open
                            navMenu.classList.remove('active');
                            hamburger.classList.remove('active');
                            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                                window.scrollTo(0, 0);
                            } else {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }
                    });
                }
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

// Mobile Navigation wird jetzt in initMobileNavigation() initialisiert (siehe oben)

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only handle if it's actually a hash link (not just # or full URL)
        if (!href || href === '#' || !href.startsWith('#') || href.includes('://')) return;
        
        e.preventDefault();
        try {
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        } catch (err) {
            // Invalid selector, ignore
            console.warn('Invalid hash selector:', href);
        }
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

// Observe all feature cards and pricing cards (but NOT faq-items, they have their own logic)
document.querySelectorAll('.feature-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
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

            // Also add a general handler for anchor links across the document (a[href^="#"] and index-based hashes)
            const addGlobalAnchorSmoothScroll = () => {
                const selector = 'a[href^="#"], a[href*="#index.html#"], a[href*="/#"]';
                document.querySelectorAll(selector).forEach(a => {
                    a.addEventListener('click', (e) => {
                        try {
                            const href = a.getAttribute('href') || '';
                            const resolved = new URL(href, window.location.href);
                            if (resolved.origin !== window.location.origin) return;
                            const targetHash = resolved.hash;
                            if (!targetHash) return;
                            const basename = (p) => { const s = p.split('/').pop(); return (s === '' || s === undefined) ? 'index.html' : s; };
                            const currentBase = basename(window.location.pathname);
                            const targetBase = basename(resolved.pathname);
                            if (!(targetBase === currentBase || (targetBase === 'index.html' && (currentBase === 'index.html' || currentBase === '')))) return;
                            const el = document.querySelector(targetHash);
                            if (!el) return; // let browser navigate if target missing
                            e.preventDefault();
                            // scroll with offset matching header height
                            const headerEl = document.querySelector('.navbar');
                            const offset = headerEl ? headerEl.offsetHeight + 12 : 80;
                            const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                                window.scrollTo(0, top);
                            } else {
                                window.scrollTo({ top, behavior: 'smooth' });
                            }
                        } catch (err) {
                            // ignore and allow default navigation if any error
                        }
                    });
                });
            };
            // Run on initial injection
            addGlobalAnchorSmoothScroll();
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
    supportLevels: { grow: 'basic', professional: 'basic', enterprise: 'gold' },
    deployment: 'self-hosted' // 'self-hosted' (0€) or 'cloud' (100€/mo)
};

function getConfigPlan(planKey) {
    if (window.SITE_CONFIG && SITE_CONFIG.content && SITE_CONFIG.content.pricingPlans) {
        const plan = SITE_CONFIG.content.pricingPlans[planKey];
        if (!plan) return null;
        
        // Clone the plan object to avoid mutating the config
        const planCopy = { ...plan };
        
        // Get currency-specific prices if available
        const currency = window.currentPricingCurrency || 'EUR';
        if (plan.prices && plan.prices[currency]) {
            planCopy.monthly = plan.prices[currency].monthly;
            planCopy.yearly = plan.prices[currency].yearly;
            planCopy.setup = plan.prices[currency].setup;
        }
        
        return planCopy;
    }
    return null;
}

function formatNumber(n) { try { return new Intl.NumberFormat('de-DE').format(Math.round(n)); } catch (e) { return String(n); } }

// Get support package price for current currency
function getSupportPrice(supportKey) {
    const currency = window.currentPricingCurrency || 'EUR';
    try {
        const pkgs = window.SITE_CONFIG?.content?.supportPackages;
        if (pkgs && Array.isArray(pkgs)) {
            const found = pkgs.find(p => p.key === supportKey);
            if (found) {
                // Try currency-specific price first
                if (found.prices && found.prices[currency]) {
                    return Number(found.prices[currency].monthly || 0);
                }
                // Fallback to legacy priceMonthly field
                return Number(found.priceMonthly || 0);
            }
        }
    } catch (e) {}
    // Fallback to default prices
    return DEFAULT_SUPPORT_PRICES[supportKey] || 0;
}

// Get deployment option price for current currency
function getDeploymentPrice(deploymentKey) {
    const currency = window.currentPricingCurrency || 'EUR';
    try {
        const deployments = window.SITE_CONFIG?.content?.deploymentOptions;
        if (deployments && Array.isArray(deployments)) {
            const found = deployments.find(d => d.key === deploymentKey);
            if (found) {
                // Try currency-specific price first
                if (found.prices && found.prices[currency]) {
                    return Number(found.prices[currency].monthly || 0);
                }
                // Fallback to legacy priceMonthly field
                return Number(found.priceMonthly || 0);
            }
        }
    } catch (e) {}
    // Hardcoded fallback
    return deploymentKey === 'cloud' ? 100 : 0;
}

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
            
            // Handle description as array (bullet points) or string (legacy)
            let descHtml = '';
            if (Array.isArray(pkg.description)) {
                descHtml = '<ul class="support-desc-list">';
                pkg.description.forEach(item => {
                    descHtml += `<li>${item}</li>`;
                });
                descHtml += '</ul>';
            } else {
                descHtml = `<div class="support-desc">${pkg.description}</div>`;
            }
            
            supportHtml += `<label class="support-option card-support ${checked ? 'selected' : ''}" data-support-key="${pkg.key}">`;
            supportHtml += `<input type="radio" name="support-${planKey}" value="${pkg.key}" ${checked} aria-hidden="true">`;
            supportHtml += `<div class="support-main-row">`;
            supportHtml += `<div class="support-title-row"><span class="support-title">${pkg.title}</span><span class="support-price">${priceLabel}</span></div>`;
            supportHtml += descHtml;
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
            <div class="totals-row"><span>Onboarding (one-time)</span> <span class="support-setup">-</span></div>
            <div class="totals-row support-support hidden"><span>Support ${isYearly ? '(annual)' : '(monthly)'}</span> <span class="support-support-amount">-</span></div>
            <div class="totals-row support-deployment hidden"><span>Deployment (Cloud)</span> <span class="support-deployment-amount">-</span></div>
            <div class="totals-row support-total"><span class="total-label">Total First Year</span> <span class="support-total-amount">-</span></div>
            <div class="totals-row support-year2 hidden"><span class="support-year2-amount">-</span></div>
        </div>
        <a href="${planCfg.applyUrl || '#'}" class="btn btn-primary support-cta" data-plan="${planKey}" target="_blank" rel="noopener noreferrer">Apply for Plan</a>
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
    // Get currency-aware support price
    const supportPrice = getSupportPrice(supportLevel);

    const subTextEl = panel.querySelector('.support-subscription');
    const setupEl = panel.querySelector('.support-setup');
    const supportElWrap = panel.querySelector('.support-support');
    const supportAmtEl = panel.querySelector('.support-support-amount');
    const deploymentElWrap = panel.querySelector('.support-deployment');
    const deploymentAmtEl = panel.querySelector('.support-deployment-amount');
    const totalLabelEl = panel.querySelector('.total-label');
    const totalEl = panel.querySelector('.support-total-amount');
    const year2Wrap = panel.querySelector('.support-year2');
    const year2AmtEl = panel.querySelector('.support-year2-amount');

    // Get currency-aware deployment cost
    const deployment = PRICE_APP.deployment || 'self-hosted';
    const deploymentCost = getDeploymentPrice(deployment);

    // Update total label based on billing period
    if (totalLabelEl) {
        totalLabelEl.textContent = isYearly ? 'Total First Year' : 'Total First Month';
    }

    // Get currency symbol
    const currency = window.currentPricingCurrency || 'EUR';
    const currencySymbol = currencySymbols[currency] || '€';
    
    // Update display values (format depends on billing cadence)
    subTextEl.textContent = `${currencySymbol}${formatNumber(planAmount)} ${isYearly ? '/yr' : '/mo'}`;
    setupEl.textContent = `${currencySymbol}${formatNumber(setup)}`;
    if (supportPrice > 0) {
        supportElWrap.classList.remove('hidden');
        // Annual: 11 months pricing (1 month free), Monthly: normal price
        const supportAnnual = supportPrice * 11;
        supportAmtEl.textContent = isYearly ? `${currencySymbol}${formatNumber(supportAnnual)} /yr` : `${currencySymbol}${formatNumber(supportPrice)} /mo`;
    } else {
        supportElWrap.classList.add('hidden');
    }

    // Update deployment display
    if (deploymentCost > 0) {
        deploymentElWrap.classList.remove('hidden');
        const deploymentAnnual = deploymentCost * 11; // 11 months = 1 month free
        deploymentAmtEl.textContent = isYearly ? `${currencySymbol}${formatNumber(deploymentAnnual)} /yr` : `${currencySymbol}${formatNumber(deploymentCost)} /mo`;
    } else {
        deploymentElWrap.classList.add('hidden');
    }

    // Calculate totals including deployment
    const supportAnnual = supportPrice * 11; // 11 months = 1 month free
    const deploymentAnnual = deploymentCost * 11; // 11 months = 1 month free
    const total = isYearly ? (setup + planAmount + supportAnnual + deploymentAnnual) : (setup + planAmount + supportPrice + deploymentCost);
    totalEl.textContent = `${currencySymbol}${formatNumber(total)}`;

    // Show year 2 onwards for annual, ongoing monthly for monthly billing
    if (isYearly) {
        year2Wrap.classList.remove('hidden');
        const year2Total = planAmount + supportAnnual + deploymentAnnual; // no setup fee from year 2
        year2AmtEl.textContent = `Then from year 2: ${currencySymbol}${formatNumber(year2Total)}/year`;
    } else {
        year2Wrap.classList.remove('hidden');
        const ongoingMonthly = planAmount + supportPrice + deploymentCost; // monthly ongoing (no setup)
        year2AmtEl.textContent = `${currencySymbol}${formatNumber(ongoingMonthly)}/month ongoing`;
    }

    // Update Apply for Plan link with support_plan and billing_period parameters
    const ctaLink = panel.querySelector('.support-cta');
    if (ctaLink) {
        const planCfg = getConfigPlan(planKey) || {};
        let url = planCfg.applyUrl || '#';
        
        // Add support_plan parameter to the URL
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}support_plan=${encodeURIComponent(supportLevel)}`;
        
        // Add billing_period parameter (monthly or annual)
        const billingPeriod = isYearly ? 'annual' : 'monthly';
        url = `${url}&billing_period=${encodeURIComponent(billingPeriod)}`;
        
        // Add deployment parameter
        url = `${url}&deployment=${encodeURIComponent(PRICE_APP.deployment)}`;
        
        ctaLink.href = url;
    }
}

function removeSupportPanel(cardEl) {
    const panel = cardEl.querySelector('.support-panel');
    if (panel) panel.remove();
}

function selectPlanFromCard(planKey, cardEl) {
    // Enterprise plan: open email instead of modal
    if (planKey === 'enterprise') {
        const subject = encodeURIComponent('Enterprise Plan Inquiry - CoCoCo Platform');
        const body = encodeURIComponent('Hello,\n\nI am interested in the CoCoCo Platform Enterprise Plan and would like to discuss:\n\n- Number of sites/locations\n- Expected number of integrations\n- Specific requirements\n- Custom implementation needs\n\nBest regards');
        window.location.href = `mailto:sales@wearecococo.com?subject=${subject}&body=${body}`;
        return;
    }
    
    // NEW: Open Modal for Grow and Professional plans
    PRICE_APP.selectedPlan = planKey;
    PRICE_APP.supportLevels[planKey] = PRICE_APP.supportLevels[planKey] || 'basic';
    savePriceState(PRICE_APP);
    openPricingModal(planKey);
    
    /* OLD CODE - FLAGGED FOR REMOVAL: Support panel logic (replaced by modal)
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
        // scroll into view for better UX, keep top edge visible
        setTimeout(() => {
            const cardRect = cardEl.getBoundingClientRect();
            const cardTop = cardRect.top + window.scrollY;
            const cardHeight = cardRect.height;
            const viewportHeight = window.innerHeight;
            
            // Get header height to account for fixed navbar
            const header = document.querySelector('.navbar');
            const headerHeight = header ? header.offsetHeight : 0;
            
            // Calculate position to center the card (accounting for header)
            const availableHeight = viewportHeight - headerHeight;
            let scrollTarget = cardTop - headerHeight - (availableHeight / 2) + (cardHeight / 2);
            
            // Ensure the top edge is always visible (header height + 20px padding)
            const minScrollTarget = cardTop - headerHeight - 20;
            scrollTarget = Math.max(minScrollTarget, scrollTarget);
            
            window.scrollTo({ 
                top: scrollTarget, 
                behavior: 'smooth' 
            });
        }, 100);
    }
    savePriceState(PRICE_APP);
    END OLD CODE */
}

function initPricingInteractions() {
    // restore state
    const saved = loadPriceState();
    if (saved) Object.assign(PRICE_APP, saved);

    // wire buttons inside pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        const plan = card.getAttribute('data-plan');
        // Prefer an explicit CTA button (data-config) or .btn; fall back to first button
        // But skip the support-cta link (Apply for Plan button)
        let selectBtn = null;
        if (plan) selectBtn = card.querySelector(`[data-config="pricing.${plan}.cta"]`);
        if (!selectBtn) selectBtn = card.querySelector('.btn:not(.support-cta)');
        if (!selectBtn) selectBtn = card.querySelector('button:not(.support-cta)');
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
        /* OLD CODE - FLAGGED FOR REMOVAL: Auto-reopen support panel on page load
        // if previously selected, re-open panel
        if (plan && PRICE_APP.selectedPlan === plan) {
            renderSupportPanel(card, plan);
        }
        END OLD CODE */
    });

    // update when billing toggle changes
    const bill = document.getElementById('billing-switch');
    if (bill) {
        bill.addEventListener('change', () => {
            PRICE_APP.isAnnual = bill.checked;
            savePriceState(PRICE_APP);
            
            /* OLD CODE - FLAGGED FOR REMOVAL: Update support panels on main page
            document.querySelectorAll('.support-panel').forEach(p => {
                const card = p.closest('.pricing-card');
                if (card) {
                    const plan = card.getAttribute('data-plan');
                    // Re-render the entire panel to update header text
                    renderSupportPanel(card, plan);
                }
            });
            END OLD CODE */
        });
    }

    // Wire deployment card selection
    document.querySelectorAll('.deployment-card').forEach(card => {
        card.addEventListener('click', () => {
            const deploymentType = card.getAttribute('data-deployment');
            
            // Update selection state
            document.querySelectorAll('.deployment-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Update radio button
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            
            // Update app state
            PRICE_APP.deployment = deploymentType;
            savePriceState(PRICE_APP);
            
            // Update any open support panels with new totals
            document.querySelectorAll('.support-panel').forEach(p => {
                const pricingCard = p.closest('.pricing-card');
                if (pricingCard) {
                    const plan = pricingCard.getAttribute('data-plan');
                    updateSupportTotals(p, pricingCard, plan);
                }
            });
        });
    });

    // Restore deployment selection from saved state
    if (PRICE_APP.deployment) {
        const savedCard = document.querySelector(`.deployment-card[data-deployment="${PRICE_APP.deployment}"]`);
        if (savedCard) {
            document.querySelectorAll('.deployment-card').forEach(c => c.classList.remove('selected'));
            savedCard.classList.add('selected');
            const radio = savedCard.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        }
    }
}

// initialize pricing interactions at load (will be safe if called multiple times)
document.addEventListener('DOMContentLoaded', () => {
    try { initPricingInteractions(); } catch (e) { /* ignore */ }
});

// Delegated click fallback: ensure clicks on pricing-card buttons open the support panel
// But skip the support-cta link (Apply for Plan button) to allow navigation
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pricing-card .btn, .pricing-card button, .pricing-card [data-config^="pricing."]');
    if (!btn) return;
    
    // Skip the support-cta link - let it navigate normally
    if (btn.classList.contains('support-cta')) return;
    
    const card = btn.closest('.pricing-card');
    if (!card) return;
    const plan = card.getAttribute('data-plan');
    if (!plan) return; // nothing we can do
    try { console.debug('Delegated click detected for plan', plan); } catch (e) {}
    try { e.preventDefault(); } catch (e) {}
    try { selectPlanFromCard(plan, card); } catch (err) { console.error('Delegated selectPlanFromCard error', err); }
});

// Initialize feature thumbnails to open in global modal
function initFeatureThumbnails() {
    const thumbnails = document.querySelectorAll('.feature-thumbnail');
    if (!thumbnails || thumbnails.length === 0) return;
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card expansion toggle
            const fullSrc = thumb.getAttribute('data-full') || thumb.src;
            const alt = thumb.alt || 'Feature Image';
            
            // Use global modal if available
            if (typeof window.openCarouselModal === 'function') {
                window.openCarouselModal(fullSrc, alt, thumb.src);
            }
        });
    });
    
    // Add click event to feature cards to toggle expansion
    const featureCards = document.querySelectorAll('.expandable-feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't toggle if clicking on a thumbnail
            if (e.target.classList.contains('feature-thumbnail')) return;
            
            const isCurrentlyExpanded = card.classList.contains('expanded');
            
            // Close other cards first and wait for their collapse animation
            const otherExpandedCards = Array.from(featureCards).filter(
                otherCard => otherCard !== card && otherCard.classList.contains('expanded')
            );
            
            otherExpandedCards.forEach(otherCard => {
                otherCard.classList.remove('expanded');
            });
            
            // If we're expanding this card
            const isExpanding = !isCurrentlyExpanded;
            
            if (isExpanding) {
                // Wait for other cards to collapse before expanding this one
                const collapseDelay = otherExpandedCards.length > 0 ? 300 : 0;
                
                setTimeout(() => {
                    card.classList.add('expanded');
                    
                    // Wait for expansion animation to complete, then scroll
                    setTimeout(() => {
                        const cardRect = card.getBoundingClientRect();
                        const cardTop = cardRect.top + window.scrollY;
                        const cardHeight = cardRect.height;
                        const viewportHeight = window.innerHeight;
                        
                        // Get header height to account for fixed navbar
                        const header = document.querySelector('.navbar');
                        const headerHeight = header ? header.offsetHeight : 0;
                        
                        // Calculate position to center the card (accounting for header)
                        const availableHeight = viewportHeight - headerHeight;
                        let scrollTarget = cardTop - headerHeight - (availableHeight / 2) + (cardHeight / 2);
                        
                        // Ensure the top edge is always visible (header height + 20px padding)
                        const minScrollTarget = cardTop - headerHeight - 20;
                        scrollTarget = Math.max(minScrollTarget, scrollTarget);
                        
                        window.scrollTo({ 
                            top: scrollTarget, 
                            behavior: 'smooth' 
                        });
                    }, 300);
                }, collapseDelay);
            } else {
                // Just collapse this card
                card.classList.remove('expanded');
            }
        });
    });
}

// Initialize typewriter animation for problem items on about_us page
function initTypewriterAnimation() {
    const problemItems = document.querySelectorAll('.problem-item');
    if (problemItems.length === 0) return;

    // Start animation shortly after page load (300ms delay)
    setTimeout(() => {
        problemItems.forEach(item => {
            const delay = parseFloat(item.getAttribute('data-delay') || 0) * 1000;
            
            setTimeout(() => {
                item.classList.add('visible');
                const typewriterWord = item.querySelector('.typewriter-word');
                if (typewriterWord) {
                    typewriterWord.classList.add('typing');
                    setTimeout(() => {
                        typewriterWord.classList.remove('typing');
                        typewriterWord.classList.add('typed');
                    }, 1200);
                }
            }, delay);
        });
    }, 300);
}

// Initialize typewriter on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initTypewriterAnimation();
    initConnectionDiagramScroll();
});

// Connection Diagram Scroll Animation
function initConnectionDiagramScroll() {
    const diagram = document.getElementById('connectionDiagram');
    if (!diagram) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of diagram is visible (center of viewport)
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add expanded class when diagram reaches center
                diagram.classList.add('expanded');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(diagram);
}

// Language Cycler with fast-flip effect
function initLanguageCycler() {
    const cycler = document.getElementById('languageCycler');
    if (!cycler) return;

    // Get the default/current language text from data attribute or content
    const defaultText = cycler.getAttribute('data-i18n-default') || 'Your Language';
    
    // Language variations (excluding the default which will be first and last)
    const languages = [
        defaultText,           // Start with current language
        'Deine Sprache',       // German
        'Ta Langue',           // French
        'La Tua Lingua',       // Italian
        'あなたの言語',         // Japanese
        'Tu Idioma',           // Spanish
        'Je Taal',             // Dutch
        defaultText            // End with current language
    ];

    let currentIndex = 0;
    let isAnimating = false;

    async function cycleLanguage() {
        if (isAnimating || currentIndex >= languages.length - 1) return;
        
        isAnimating = true;
        currentIndex++;
        
        // Flip out
        cycler.classList.add('flip-out');
        
        // Wait for flip-out animation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Change text
        cycler.textContent = languages[currentIndex] + '.';
        
        // Remove flip-out, add flip-in
        cycler.classList.remove('flip-out');
        cycler.classList.add('flip-in');
        
        // Wait for flip-in animation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Clean up
        cycler.classList.remove('flip-in');
        isAnimating = false;
    }

    // Start cycling after initial delay
    setTimeout(async () => {
        // Cycle through all languages with 400ms between each
        const totalCycles = languages.length - 1;
        for (let i = 0; i < totalCycles; i++) {
            await cycleLanguage();
            if (i < totalCycles - 1) {
                await new Promise(resolve => setTimeout(resolve, 400));
            }
        }
    }, 600); // Start after 0.6 second delay
}

// Initialize language cycler on page load
document.addEventListener('DOMContentLoaded', () => {
    try { initLanguageCycler(); } catch (e) { console.error('Language cycler error:', e); }
});

// Connecting Split Animation (for integration.html hero)
function initConnectingSplit() {
    const el = document.getElementById('connectingSplit');
    if (!el) return;
    
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReduced) {
        // Skip animation for users who prefer reduced motion
        return;
    }
    
    // Start animation after brief delay (hero is visible on load)
    setTimeout(() => {
        el.classList.add('animating');
        
        // Remove animating class after animation completes (1.2s duration)
        setTimeout(() => {
            el.classList.remove('animating');
        }, 1200);
    }, 600); // Start after 0.6 second delay
}

// Initialize connecting split animation on page load
document.addEventListener('DOMContentLoaded', () => {
    try { initConnectingSplit(); } catch (e) { console.error('Connecting split error:', e); }
});

// Mirror Text Animation (for custom_apps.html hero)
function initMirrorText() {
    const el = document.getElementById('mirrorText');
    if (!el) return;
    
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReduced) {
        // Skip animation for users who prefer reduced motion
        el.classList.add('final-state');
        return;
    }
    
    // Start animation after brief delay (hero is visible on load)
    setTimeout(() => {
        el.classList.add('animating');
        
        // Add final-state class after animation completes to keep text in normal orientation
        setTimeout(() => {
            el.classList.remove('animating');
            el.classList.add('final-state');
        }, 1000); // Animation duration
    }, 1200); // Start after 1.2 second delay
}

// Initialize mirror text animation on page load
document.addEventListener('DOMContentLoaded', () => {
    try { initMirrorText(); } catch (e) { console.error('Mirror text error:', e); }
});

/* ============================================
   NEW HOMEPAGE - INTERACTIVE FEATURE ACCORDION
   ============================================ */

function initFeatureAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    const featureContents = document.querySelectorAll('.feature-content');
    const featureDescriptions = document.querySelectorAll('.feature-description');
    
    if (accordionItems.length === 0) return;
    
    accordionItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetFeature = item.dataset.accordion;
            
            // If clicking already active item, do nothing (keep it open)
            if (item.classList.contains('active')) return;
            
            // Remove active class from all items
            accordionItems.forEach(i => i.classList.remove('active'));
            featureContents.forEach(c => c.classList.remove('active'));
            featureDescriptions.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked item and corresponding content
            item.classList.add('active');
            
            const targetContent = document.querySelector(`[data-feature="${targetFeature}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            const targetDescription = document.querySelector(`[data-description="${targetFeature}"]`);
            if (targetDescription) {
                targetDescription.classList.add('active');
            }
        });
    });
}

// Initialize feature accordion on page load
document.addEventListener('DOMContentLoaded', () => {
    try { initFeatureAccordion(); } catch (e) { console.error('Feature accordion error:', e); }
});

/* ============================================
   IMAGE ZOOM FUNCTIONALITY
   ============================================ */

function initImageZoom() {
    const imageContainer = document.getElementById('imageZoomContainer');
    if (!imageContainer) return;
    
    let isZoomed = false;
    
    imageContainer.addEventListener('click', (e) => {
        // Only zoom if clicking on the image itself
        if (e.target.classList.contains('zoomable-image')) {
            if (!isZoomed) {
                // Zoom in
                imageContainer.classList.add('zoomed');
                isZoomed = true;
            } else {
                // Zoom out
                imageContainer.classList.remove('zoomed');
                isZoomed = false;
            }
        }
    });
    
    // Close zoom on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isZoomed) {
            imageContainer.classList.remove('zoomed');
            isZoomed = false;
        }
    });
}

// Initialize image zoom on page load
document.addEventListener('DOMContentLoaded', () => {
    try { initImageZoom(); } catch (e) { console.error('Image zoom error:', e); }
});

/* ============================================
   3D WIREFRAME NETWORK CANVAS
   ============================================ */

const CANVAS_PALETTE = {
    Berry: '#4D2B41',
    Pig: '#FF79C9',
    Peach: '#FFEFF8'
};

const project3D = (x, y, z, centerX, centerY, scale) => {
    const fl = 400;
    const perspective = fl / (fl + z);
    return {
        x: centerX + x * perspective * scale,
        y: centerY + y * perspective * scale,
        scale: perspective
    };
};

const rotateX = (x, y, z, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { y: y * cos - z * sin, z: z * cos + y * sin };
};

const rotateY = (x, y, z, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { x: x * cos - z * sin, z: z * cos + x * sin };
};

const t = (1 + Math.sqrt(5)) / 2;
const ICOSAHEDRON_VERTS = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
];

const CUBE_VERTS = [
    [-1,-1,-1], [1,-1,-1], [1, 1,-1], [-1, 1,-1],
    [-1,-1, 1], [1,-1, 1], [1, 1, 1], [-1, 1, 1]
];
const CUBE_EDGES = [
    [0,1], [1,2], [2,3], [3,0], [4,5], [5,6], [6,7], [7,4], [0,4], [1,5], [2,6], [3,7]
];

class Shape3D {
    constructor(type, x, y, size) {
        this.baseX = x;
        this.baseY = y;
        this.size = size;
        this.angleX = Math.random() * Math.PI;
        this.angleY = Math.random() * Math.PI;
        this.rotationSpeedX = (Math.random() - 0.5) * 0.005;
        this.rotationSpeedY = (Math.random() - 0.5) * 0.005;
        
        if (type === 'core') {
            this.vertices = ICOSAHEDRON_VERTS.map(v => ({x: v[0], y: v[1], z: v[2]}));
            this.edges = this.generateIcosahedronEdges();
            this.isCore = true;
        } else {
            this.vertices = CUBE_VERTS.map(v => ({x: v[0], y: v[1], z: v[2]}));
            this.edges = CUBE_EDGES;
            this.isCore = false;
        }
        this.projectedPoints = [];
    }

    generateIcosahedronEdges() {
        const edges = [];
        for(let i=0; i<this.vertices.length; i++) {
            for(let j=i+1; j<this.vertices.length; j++) {
                const v1 = this.vertices[i];
                const v2 = this.vertices[j];
                const dist = Math.sqrt(Math.pow(v1.x-v2.x, 2) + Math.pow(v1.y-v2.y, 2) + Math.pow(v1.z-v2.z, 2));
                if (dist < 2.1 && dist > 1.9) edges.push([i, j]);
            }
        }
        return edges;
    }

    update() {
        this.angleX += this.rotationSpeedX;
        this.angleY += this.rotationSpeedY;
        this.projectedPoints = this.vertices.map(v => {
            let r = rotateY(v.x, v.y, v.z, this.angleY);
            r = {...r, ...rotateX(r.x, v.y, r.z, this.angleX)};
            return project3D(r.x, r.y, r.z, this.baseX, this.baseY, this.size * 30);
        });
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = CANVAS_PALETTE.Pig;
        ctx.lineWidth = this.isCore ? 1.2 : 0.6;
        ctx.globalAlpha = this.isCore ? 0.8 : 0.4;

        this.edges.forEach(edge => {
            const p1 = this.projectedPoints[edge[0]];
            const p2 = this.projectedPoints[edge[1]];
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
        });
        ctx.stroke();

        ctx.globalAlpha = 1;
        this.projectedPoints.forEach(p => {
            ctx.beginPath();
            ctx.fillStyle = CANVAS_PALETTE.Pig;
            const dotSize = (this.isCore ? 2.0 : 1.2) * p.scale;
            ctx.arc(p.x, p.y, Math.max(0, dotSize), 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

class Pulse {
    constructor(startObj, endObj) {
        this.startObj = startObj;
        this.endObj = endObj;
        this.progress = 0;
        this.speed = 0.005 + Math.random() * 0.01;
        this.history = [];
    }

    update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
            this.progress = 0;
            this.history = [];
        }
    }

    draw(ctx) {
        const x = this.startObj.baseX + (this.endObj.baseX - this.startObj.baseX) * this.progress;
        const y = this.startObj.baseY + (this.endObj.baseY - this.startObj.baseY) * this.progress;

        this.history.push({x, y});
        if (this.history.length > 20) this.history.shift();

        ctx.beginPath();
        ctx.strokeStyle = CANVAS_PALETTE.Pig;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        if (this.history.length > 1) {
            ctx.moveTo(this.history[0].x, this.history[0].y);
            for(let point of this.history) {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.globalAlpha = 0.6 * (1 - this.progress);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.fillStyle = CANVAS_PALETTE.Pig;
        ctx.globalAlpha = 1;
        ctx.arc(x, y, 2.5, 0, Math.PI*2);
        ctx.fill();
    }
}

class NetworkScene {
    constructor() {
        this.canvas = document.getElementById('wireframe-network');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.shapes = [];
        this.pulses = [];
        this.mouse = { x: 0, y: 0 };
        
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            const centerX = this.width * 0.5;
            const centerY = this.height * 0.4;
            this.mouse.x = (e.clientX - centerX) * 0.0001;
            this.mouse.y = (e.clientY - centerY) * 0.0001;
        });
    }

    resize() {
        const wrapper = document.getElementById('hero-canvas-wrapper');
        if (!wrapper) return;
        
        this.width = wrapper.offsetWidth;
        this.height = wrapper.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.init();
    }

    init() {
        this.shapes = [];
        this.pulses = [];

        const coreX = this.width * 0.5;
        const coreY = this.height * 0.4;
        const coreSize = Math.min(this.width, this.height) * 0.001;
        
        const core = new Shape3D('core', coreX, coreY, coreSize * 1.5);
        this.shapes.push(core);

        const satelliteCount = 7;
        for(let i=0; i<satelliteCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const minDistance = 120;
            const maxDistance = Math.min(this.width, this.height) * 0.25;
            const distance = minDistance + Math.random() * (maxDistance - minDistance);
            
            const satX = coreX + Math.cos(angle) * distance;
            const satY = coreY + Math.sin(angle) * distance;
            
            const sat = new Shape3D('cube', satX, satY, coreSize * 0.6);
            this.shapes.push(sat);
            this.pulses.push(new Pulse(sat, core));
        }
    }

    drawConnections(core) {
        this.ctx.lineWidth = 1;
        this.shapes.forEach(shape => {
            if (shape === core) return;
            this.ctx.beginPath();
            const dist = Math.hypot(core.baseX - shape.baseX, core.baseY - shape.baseY);
            const opacity = Math.max(0.1, 1 - (dist / (this.width * 0.5)));
            
            this.ctx.strokeStyle = CANVAS_PALETTE.Berry;
            this.ctx.globalAlpha = opacity * 0.2;
            
            this.ctx.moveTo(core.baseX, core.baseY);
            this.ctx.lineTo(shape.baseX, shape.baseY);
            this.ctx.stroke();
        });
    }

    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        const core = this.shapes[0];

        this.shapes.forEach(shape => {
            shape.rotationSpeedX += (this.mouse.y - shape.rotationSpeedX) * 0.05;
            shape.rotationSpeedY += (this.mouse.x - shape.rotationSpeedY) * 0.05;
            shape.update();
        });

        this.drawConnections(core);
        this.pulses.forEach(p => { p.update(); p.draw(this.ctx); });
        this.shapes.forEach(shape => { shape.draw(this.ctx); });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize canvas network on page load
document.addEventListener('DOMContentLoaded', () => {
    try { new NetworkScene(); } catch (e) { console.error('Canvas network error:', e); }
});

/* ============================================
   CUSTOM APPS IFRAME LAZY LOADING
   ============================================ */

function initCustomAppsIframe() {
    const iframe = document.querySelector('.custom-apps-iframe');
    if (!iframe) return;
    
    // Store original src and remove it initially
    const originalSrc = iframe.getAttribute('src');
    iframe.removeAttribute('src');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Start loading iframe when 60% is visible
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                iframe.setAttribute('src', originalSrc);
                observer.unobserve(iframe); // Stop observing once loaded
            }
        });
    }, {
        threshold: 0.6 // Trigger when 60% of iframe is visible
    });
    
    observer.observe(iframe);
}

/* ============================================
   FAQ ACCORDION
   ============================================ */

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('FAQ Accordion: Found', faqItems.length, 'items');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', (e) => {
                console.log('Click on item', index);
                e.preventDefault();
                e.stopPropagation();
                
                const isCurrentlyActive = item.classList.contains('active');
                console.log('Currently active:', isCurrentlyActive);
                
                // Close all items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                console.log('All items closed');
                
                // If clicked item wasn't active, open it
                if (!isCurrentlyActive) {
                    item.classList.add('active');
                    console.log('Item', index, 'opened');
                } else {
                    console.log('Item', index, 'closed');
                }
            });
        }
    });
}

// ========================================
// PRICING MODAL FUNCTIONS
// ========================================

function initializeSupportCards() {
    const container = document.querySelector('.modal-support-cards-container');
    if (!container) return;
    
    const supportPackages = window.SITE_CONFIG?.content?.supportPackages;
    if (!supportPackages || !Array.isArray(supportPackages)) return;
    
    // Get current currency
    const currency = window.currentPricingCurrency || 'EUR';
    const currencySymbol = currencySymbols[currency] || '€';
    
    // Clear existing content
    container.innerHTML = '';
    
    // Generate cards from config
    supportPackages.forEach((pkg, index) => {
        const label = document.createElement('label');
        label.className = 'modal-card';
        label.setAttribute('data-modal-support', pkg.key);
        
        // First card is selected by default
        if (index === 0) {
            label.classList.add('selected');
        }
        
        // Get currency-specific price
        let priceMonthly = 0;
        if (pkg.prices && pkg.prices[currency]) {
            priceMonthly = pkg.prices[currency].monthly;
        } else {
            priceMonthly = pkg.priceMonthly || 0;
        }
        
        const priceDisplay = priceMonthly === 0 
            ? 'Included' 
            : `+ ${currencySymbol}${priceMonthly} /mo`;
        
        // Handle description as array (bullet points) or string (legacy)
        let descHtml = '';
        if (Array.isArray(pkg.description)) {
            descHtml = '<ul class="modal-support-desc-list">';
            pkg.description.forEach(item => {
                descHtml += `<li>${item}</li>`;
            });
            descHtml += '</ul>';
        } else {
            descHtml = `<p class="modal-card-description">${pkg.description}</p>`;
        }
        
        const checkedAttr = index === 0 ? 'checked' : '';
        
        label.innerHTML = `
            <input type="radio" name="modal-support" value="${pkg.key}" ${checkedAttr} aria-hidden="true">
            <div class="modal-card-content">
                <h4 class="modal-card-title">${pkg.title}</h4>
                <div class="modal-card-price">${priceDisplay}</div>
                ${descHtml}
            </div>
        `;
        
        container.appendChild(label);
    });
}

// Update deployment pricing in modal based on currency
function updateModalDeploymentPricing(currency) {
    const currencySymbol = currencySymbols[currency] || '€';
    const cloudPrice = getDeploymentPrice('cloud');
    
    // Update cloud deployment card price
    const cloudPriceDisplay = document.querySelector('.cloud-price-display');
    if (cloudPriceDisplay) {
        const currencySpan = cloudPriceDisplay.querySelector('.currency-symbol');
        if (currencySpan) {
            currencySpan.textContent = currencySymbol;
        }
        // Update the price number
        cloudPriceDisplay.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('/mo')) {
                node.textContent = ` ${cloudPrice} /mo`;
            }
        });
    }
    
    // Update deployment price text in description
    const deploymentPriceText = document.querySelector('.deployment-price-text');
    if (deploymentPriceText) {
        deploymentPriceText.textContent = `+${currencySymbol}${cloudPrice}/mo`;
    }
}

function openPricingModal(planKey) {
    const modal = document.getElementById('pricing-modal');
    if (!modal) return;
    
    const planCfg = getConfigPlan(planKey) || {};
    const isYearly = PRICE_APP.isAnnual;
    
    // Update modal header
    const titleEl = modal.querySelector('.modal-plan-title');
    const priceEl = modal.querySelector('.modal-price-amount');
    const periodEl = modal.querySelector('.modal-price-period');
    
    if (titleEl) titleEl.textContent = planCfg.title || planKey;
    if (priceEl) {
        const amount = isYearly ? planCfg.yearly : planCfg.monthly;
        priceEl.textContent = `€${formatNumber(amount)}`;
    }
    if (periodEl) periodEl.textContent = isYearly ? '/year' : '/month';
    
    // Sync billing toggle with main page
    const modalBillingSwitch = modal.querySelector('#modal-billing-switch');
    const modalMonthlyLabel = modal.querySelector('#modal-monthly-label');
    const modalYearlyLabel = modal.querySelector('#modal-yearly-label');
    
    if (modalBillingSwitch) {
        modalBillingSwitch.checked = isYearly;
        
        // Update label active states
        if (isYearly) {
            modalMonthlyLabel?.classList.remove('active');
            modalYearlyLabel?.classList.add('active');
        } else {
            modalMonthlyLabel?.classList.add('active');
            modalYearlyLabel?.classList.remove('active');
        }
    }
    
    // Restore selections from state
    const deployment = PRICE_APP.deployment || 'self-hosted';
    const support = PRICE_APP.supportLevels[planKey] || 'basic';
    
    // Update deployment selection
    modal.querySelectorAll('.modal-card[data-modal-deployment]').forEach(card => {
        const cardDeployment = card.getAttribute('data-modal-deployment');
        if (cardDeployment === deployment) {
            card.classList.add('selected');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        } else {
            card.classList.remove('selected');
        }
    });
    
    // Update support selection
    modal.querySelectorAll('.modal-card[data-modal-support]').forEach(card => {
        const cardSupport = card.getAttribute('data-modal-support');
        if (cardSupport === support) {
            card.classList.add('selected');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        } else {
            card.classList.remove('selected');
        }
    });
    
    // Update totals
    updateModalTotals(planKey);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePricingModal() {
    const modal = document.getElementById('pricing-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateModalTotals(planKey) {
    const modal = document.getElementById('pricing-modal');
    if (!modal) return;
    
    const planCfg = getConfigPlan(planKey) || {};
    const isYearly = modal.querySelector('#modal-billing-switch')?.checked || false;
    const monthly = Number(planCfg.monthly || 0);
    const yearly = Number(planCfg.yearly || 0);
    const planAmount = isYearly ? yearly : monthly;
    const setup = Number(planCfg.setup || 0);
    
    // Get currency-aware deployment cost
    const deployment = PRICE_APP.deployment || 'self-hosted';
    const deploymentCost = getDeploymentPrice(deployment);
    
    // Get currency-aware support cost
    const supportLevel = PRICE_APP.supportLevels[planKey] || 'basic';
    const supportPrice = getSupportPrice(supportLevel);
    
    // Update display elements
    const subLabelEl = modal.querySelector('.modal-subscription-label');
    const subEl = modal.querySelector('.modal-total-subscription');
    const setupEl = modal.querySelector('.modal-total-setup');
    const supportRowEl = modal.querySelector('.modal-total-support-row');
    const supportLabelEl = modal.querySelector('.modal-support-label');
    const supportEl = modal.querySelector('.modal-total-support');
    const deploymentRowEl = modal.querySelector('.modal-total-deployment-row');
    const deploymentLabelEl = modal.querySelector('.modal-deployment-label');
    const deploymentEl = modal.querySelector('.modal-total-deployment');
    const totalLabelEl = modal.querySelector('.modal-total-label');
    const totalEl = modal.querySelector('.modal-total-amount');
    const ongoingEl = modal.querySelector('.modal-total-ongoing-text');
    
    // Get currency symbol
    const currency = window.currentPricingCurrency || 'EUR';
    const currencySymbol = currencySymbols[currency] || '€';
    
    // Update subscription label and value
    if (subLabelEl) subLabelEl.textContent = `Subscription (${isYearly ? 'annual' : 'monthly'})`;
    if (subEl) subEl.textContent = `${currencySymbol}${formatNumber(planAmount)} ${isYearly ? '/yr' : '/mo'}`;
    if (setupEl) setupEl.textContent = `${currencySymbol}${formatNumber(setup)}`;
    
    // Always show support row (included or paid)
    if (supportRowEl) supportRowEl.classList.remove('hidden');
    // Capitalize first letter of support level
    const supportName = supportLevel.charAt(0).toUpperCase() + supportLevel.slice(1);
    if (supportLabelEl) supportLabelEl.textContent = `Support: ${supportName} (${isYearly ? 'annual' : 'monthly'})`;
    if (supportEl) {
        if (supportPrice > 0) {
            const supportAnnual = supportPrice * 11;
            supportEl.textContent = isYearly ? `${currencySymbol}${formatNumber(supportAnnual)} /yr` : `${currencySymbol}${formatNumber(supportPrice)} /mo`;
        } else {
            supportEl.textContent = 'Included';
        }
    }
    
    // Always show deployment row (included or paid)
    if (deploymentRowEl) deploymentRowEl.classList.remove('hidden');
    const deploymentName = deployment === 'cloud' ? 'Cloud' : 'Self-Hosted';
    if (deploymentLabelEl) deploymentLabelEl.textContent = `Deployment: ${deploymentName} (${isYearly ? 'annual' : 'monthly'})`;
    if (deploymentEl) {
        if (deploymentCost > 0) {
            const deploymentAnnual = deploymentCost * 11;
            deploymentEl.textContent = isYearly ? `${currencySymbol}${formatNumber(deploymentAnnual)} /yr` : `${currencySymbol}${formatNumber(deploymentCost)} /mo`;
        } else {
            deploymentEl.textContent = 'Included';
        }
    }
    
    // Calculate totals
    const supportAnnual = supportPrice * 11;
    const deploymentAnnual = deploymentCost * 11;
    const total = isYearly ? (setup + planAmount + supportAnnual + deploymentAnnual) : (setup + planAmount + supportPrice + deploymentCost);
    
    if (totalLabelEl) totalLabelEl.textContent = isYearly ? 'Total First Year' : 'Total First Month';
    if (totalEl) totalEl.textContent = `${currencySymbol}${formatNumber(total)}`;
    
    // Ongoing costs
    if (ongoingEl) {
        if (isYearly) {
            const year2Total = planAmount + supportAnnual + deploymentAnnual;
            ongoingEl.textContent = `Then from year 2: ${currencySymbol}${formatNumber(year2Total)}/year`;
        } else {
            const ongoingMonthly = planAmount + supportPrice + deploymentCost;
            ongoingEl.textContent = `${currencySymbol}${formatNumber(ongoingMonthly)}/month ongoing`;
        }
    }
    
    // Update CTA button
    updateModalCTA(planKey);
}

function updateModalCTA(planKey) {
    const modal = document.getElementById('pricing-modal');
    if (!modal) return;
    
    const planCfg = getConfigPlan(planKey) || {};
    const ctaBtn = modal.querySelector('#modal-apply-button');
    if (!ctaBtn) return;
    
    // Different button text per plan
    const buttonTexts = {
        'grow': 'Proceed with Grow Plan Configuration',
        'professional': 'Proceed with Professional Plan Configuration',
        'enterprise': 'Contact Sales'
    };
    ctaBtn.textContent = buttonTexts[planKey] || 'Apply for Plan';
    
    // Build URL with parameters
    let url = planCfg.applyUrl || '#';
    
    // Only add parameters if we have a valid URL (not just '#')
    if (url && url !== '#') {
        const supportLevel = PRICE_APP.supportLevels[planKey] || 'basic';
        const deployment = PRICE_APP.deployment || 'self-hosted';
        const isYearly = modal.querySelector('#modal-billing-switch')?.checked || false;
        const billingPeriod = isYearly ? 'annual' : 'monthly';
        
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}support_plan=${encodeURIComponent(supportLevel)}`;
        url = `${url}&billing_period=${encodeURIComponent(billingPeriod)}`;
        url = `${url}&deployment=${encodeURIComponent(deployment)}`;
    }
    
    ctaBtn.href = url;
    console.log('Modal CTA updated:', planKey, url);
}

function initPricingModal() {
    const modal = document.getElementById('pricing-modal');
    if (!modal) return;
    
    // Initialize support cards from config
    initializeSupportCards();
    
    // Initialize deployment pricing
    updateModalDeploymentPricing(window.currentPricingCurrency || 'EUR');
    
    // Close button
    const closeBtn = modal.querySelector('.pricing-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePricingModal);
    }
    
    // Close on overlay click
    const overlay = modal.querySelector('.pricing-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closePricingModal);
    }
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closePricingModal();
        }
    });
    
    // Modal billing toggle
    const modalBillingSwitch = modal.querySelector('#modal-billing-switch');
    const modalMonthlyLabel = modal.querySelector('#modal-monthly-label');
    const modalYearlyLabel = modal.querySelector('#modal-yearly-label');
    
    if (modalBillingSwitch) {
        modalBillingSwitch.addEventListener('change', () => {
            PRICE_APP.isAnnual = modalBillingSwitch.checked;
            
            // Update modal labels
            if (modalBillingSwitch.checked) {
                modalMonthlyLabel?.classList.remove('active');
                modalYearlyLabel?.classList.add('active');
            } else {
                modalMonthlyLabel?.classList.add('active');
                modalYearlyLabel?.classList.remove('active');
            }
            
            // Update main page billing toggle
            const mainBillingSwitch = document.getElementById('billing-switch');
            if (mainBillingSwitch) mainBillingSwitch.checked = modalBillingSwitch.checked;
            
            // Update modal display
            const planKey = PRICE_APP.selectedPlan;
            if (planKey) {
                const planCfg = getConfigPlan(planKey) || {};
                const priceEl = modal.querySelector('.modal-price-amount');
                const periodEl = modal.querySelector('.modal-price-period');
                const amount = modalBillingSwitch.checked ? planCfg.yearly : planCfg.monthly;
                if (priceEl) priceEl.textContent = `€${formatNumber(amount)}`;
                if (periodEl) periodEl.textContent = modalBillingSwitch.checked ? '/year' : '/month';
                
                updateModalTotals(planKey);
            }
            
            savePriceState(PRICE_APP);
        });
    }
    
    // Deployment card selection
    modal.querySelectorAll('.modal-card[data-modal-deployment]').forEach(card => {
        card.addEventListener('click', () => {
            const deployment = card.getAttribute('data-modal-deployment');
            
            // Update selection state
            modal.querySelectorAll('.modal-card[data-modal-deployment]').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Update radio button
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            
            // Update app state
            PRICE_APP.deployment = deployment;
            savePriceState(PRICE_APP);
            
            // Update totals
            if (PRICE_APP.selectedPlan) {
                updateModalTotals(PRICE_APP.selectedPlan);
            }
        });
    });
    
    // Support card selection - use event delegation since cards are dynamically generated
    const supportContainer = modal.querySelector('.modal-support-cards-container');
    if (supportContainer) {
        supportContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.modal-card[data-modal-support]');
            if (!card) return;
            
            const support = card.getAttribute('data-modal-support');
            const planKey = PRICE_APP.selectedPlan;
            if (!planKey) return;
            
            // Update selection state
            modal.querySelectorAll('.modal-card[data-modal-support]').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Update radio button
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            
            // Update app state
            PRICE_APP.supportLevels[planKey] = support;
            savePriceState(PRICE_APP);
            
            // Update totals
            updateModalTotals(planKey);
        });
    }
}

// Consolidated DOMContentLoaded initialization
document.addEventListener('DOMContentLoaded', () => {
    // Custom Apps iframe
    if (document.querySelector('.custom-apps-iframe')) {
        try { initCustomAppsIframe(); } catch (e) { console.error('Custom Apps iframe error:', e); }
    }
    
    // FAQ Accordion
    if (document.querySelector('.faq-item')) {
        try { initFAQAccordion(); } catch (e) { console.error('FAQ accordion error:', e); }
    }
    
    // Pricing Modal
    if (document.getElementById('pricing-modal')) {
        try { initPricingModal(); } catch (e) { console.error('Pricing modal error:', e); }
    }
    
    // Auto-detect currency and update pricing if on pricing page
    if (document.querySelector('.pricing-card')) {
        try { initPricingCurrencyDetection(); } catch (e) { console.error('Pricing currency detection error:', e); }
    }
});

// Global state for current currency
window.currentPricingCurrency = 'EUR';

// Currency symbols mapping
const currencySymbols = {
    'EUR': '€',
    'USD': '$',
    'GBP': '£',
    'CHF': 'CHF'
};

// Initialize pricing with automatic currency detection
async function initPricingCurrencyDetection() {
    // Detect user currency
    if (typeof window.detectUserCurrency === 'function') {
        try {
            const detectedCurrency = await window.detectUserCurrency();
            window.currentPricingCurrency = detectedCurrency;
            
            // Update all pricing displays
            updatePricingDisplay(detectedCurrency);
        } catch (error) {
            console.log('Currency auto-detection failed, using default EUR');
            updatePricingDisplay('EUR');
        }
    } else {
        updatePricingDisplay('EUR');
    }
}

// Update pricing display based on currency
function updatePricingDisplay(currency) {
    if (!window.SITE_CONFIG?.content?.pricingPlans) return;
    
    const formatter = new Intl.NumberFormat('de-DE');
    const currencySymbol = currencySymbols[currency] || '€';
    
    // Update all currency symbols on the page
    document.querySelectorAll('.currency-symbol').forEach(el => {
        el.textContent = currencySymbol;
    });
    
    Object.keys(window.SITE_CONFIG.content.pricingPlans).forEach(planKey => {
        if (planKey === 'setupNote') return;
        
        const plan = window.SITE_CONFIG.content.pricingPlans[planKey];
        const card = document.querySelector(`.pricing-card[data-plan="${planKey}"]`);
        
        if (!card) return;
        
        // Get prices for the current currency
        let monthly, yearly, setup;
        
        if (plan.prices && plan.prices[currency]) {
            monthly = plan.prices[currency].monthly;
            yearly = plan.prices[currency].yearly;
            setup = plan.prices[currency].setup;
        } else {
            // Fallback to legacy fields (EUR)
            monthly = plan.monthly;
            yearly = plan.yearly;
            setup = plan.setup;
        }
        
        // Update amount element
        const amountEl = card.querySelector('.amount');
        if (amountEl) {
            // Update data attributes
            amountEl.setAttribute('data-monthly', String(monthly));
            amountEl.setAttribute('data-yearly', String(yearly));
            amountEl.setAttribute('data-currency', currency);
            
            // Update displayed price
            const billingSwitchEl = document.getElementById('billing-switch');
            const isYearly = billingSwitchEl ? billingSwitchEl.checked : false;
            const displayPrice = isYearly ? yearly : monthly;
            amountEl.textContent = formatter.format(displayPrice);
        }
        
        // Update currency symbol in period text
        const periodEl = card.querySelector('.period');
        if (periodEl) {
            const periodText = periodEl.textContent;
            // Replace any existing currency symbol with the new one
            periodEl.textContent = periodText.replace(/[€$£]|CHF/, currencySymbol);
        }
        
        // Update setup fee
        if (setup !== undefined) {
            card.setAttribute('data-setup', String(setup));
            
            const setupAmountEl = card.querySelector('.setup-amount');
            if (setupAmountEl && setup > 0) {
                setupAmountEl.textContent = `${currencySymbol}${formatter.format(setup)}`;
            }
        }
    });
    
    // Update modal if it exists and has been initialized
    if (window.pricingModalState && window.pricingModalState.selectedPlan) {
        updateModalPricing(currency);
    }
    
    // Update modal deployment pricing
    updateModalDeploymentPricing(currency);
    
    // Reinitialize support cards with new currency
    if (document.querySelector('.modal-support-cards-container')) {
        initializeSupportCards();
    }
}

// Update modal pricing based on currency
function updateModalPricing(currency) {
    const formatter = new Intl.NumberFormat('de-DE');
    const currencySymbol = currencySymbols[currency] || '€';
    
    // Update all currency symbols in modal
    document.querySelectorAll('#pricing-modal .currency-symbol').forEach(el => {
        el.textContent = currencySymbol;
    });
    
    // Recalculate and update totals
    if (typeof updateModalTotal === 'function') {
        updateModalTotal();
    }
}

// ========================================
// Solution Cards Interactive Demo Switcher
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const solutionCards = document.querySelectorAll('.solution-card');
    const demoContents = document.querySelectorAll('.demo-content');

    if (solutionCards.length === 0) return;

    solutionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get the demo type from data attribute
            const demoType = card.getAttribute('data-demo');

            // Remove active class from all cards
            solutionCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');

            // Hide all demo contents
            demoContents.forEach(demo => demo.classList.remove('active'));

            // Show the corresponding demo
            const targetDemo = document.getElementById(`demo-${demoType}`);
            if (targetDemo) {
                targetDemo.classList.add('active');
                
                // Lazy load iframe if it has data-src attribute
                const iframe = targetDemo.querySelector('iframe[data-src]');
                if (iframe && !iframe.hasAttribute('src')) {
                    iframe.src = iframe.getAttribute('data-src');
                    iframe.removeAttribute('data-src');
                }
            }
        });
    });
});