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
                            <svg class="pricing-feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

                        const makeXIcon = () => `
                            <svg class="pricing-feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

                        const isMutedFeature = (text) => {
                            const key = text.toLowerCase();
                            return key.includes('advanced') || key.includes('api') || key.includes('multi-site') || key.includes('multi site');
                        };

                        let items = [];

                        if (Array.isArray(plan.setupBullets) && plan.setupBullets.length) {
                            items.push(`<li class="section-heading">Setup & Migration:</li>`);
                            plan.setupBullets.forEach(b => {
                                const safe = String(b);
                                items.push(`<li class="pricing-feature-item">${makeIcon()}<span class="pricing-feature-text">${safe}</span></li>`);
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
        'ta langue',           // French
        'la tua lingua',       // Italian
        'あなたの言語',         // Japanese
        'tu idioma',           // Spanish
        'je taal',             // Dutch
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
        return;
    }
    
    // Start animation after brief delay (hero is visible on load)
    setTimeout(() => {
        el.classList.add('animating');
        
        // Remove animating class after animation completes (1s duration)
        setTimeout(() => {
            el.classList.remove('animating');
        }, 4000);
    }, 1200); // Start after 1.2 second delay
}

// Initialize mirror text animation on page load
document.addEventListener('DOMContentLoaded', () => {
    try { initMirrorText(); } catch (e) { console.error('Mirror text error:', e); }
});
