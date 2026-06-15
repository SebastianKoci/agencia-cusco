document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       WHATSAPP NUMBER CONFIGURATION
       ========================================================================== */
    // Change this number to the agency's actual WhatsApp phone number (with country code, e.g. 51 = Peru)
    const WHATSAPP_PHONE = '51999999999';

    /* ==========================================================================
       LANGUAGE SWITCHER & TRANSLATION SYSTEM
       ========================================================================== */
    const langSwitcher = document.getElementById('lang-switcher');
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const langActiveLabel = document.getElementById('lang-active-label');
    const langOptions = document.querySelectorAll('.lang-option');

    // Map Spanish tour name to translations key
    const tourKeyMap = {
        "Machu Picchu en Tren": "tour1_title",
        "Valle Sagrado de los Incas": "tour2_title",
        "Montaña de 7 Colores": "tour3_title",
        "City Tour Cusco": "tour4_title"
    };

    // Toggle dropdown visibility
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langSwitcher.classList.toggle('open');
        langDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langSwitcher.classList.remove('open');
        langDropdown.classList.remove('active');
    });

    // Translate DOM elements
    const setLanguage = (lang) => {
        if (!TRANSLATIONS[lang]) return;
        
        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;
        langActiveLabel.textContent = lang.toUpperCase();

        // Update active class on dropdown options
        langOptions.forEach(opt => {
            if (opt.getAttribute('data-lang') === lang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });

        // Translate text elements with data-i18n attribute
        const translatableElements = document.querySelectorAll('[data-i18n]');
        translatableElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang][key]) {
                if (key === 'about_lead' || key === 'hero_title_part1' || key === 'hero_title_span') {
                    el.innerHTML = TRANSLATIONS[lang][key];
                } else {
                    el.textContent = TRANSLATIONS[lang][key];
                }
            }
        });

        // Translate placeholders with data-i18n-placeholder attribute
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (TRANSLATIONS[lang][key]) {
                el.placeholder = TRANSLATIONS[lang][key];
            }
        });

        // Update Document Title and Meta Description
        if (TRANSLATIONS[lang].doc_title) {
            document.title = TRANSLATIONS[lang].doc_title;
        }
        const metaDesc = document.querySelector('meta[data-i18n-meta="doc_meta_desc"]');
        if (metaDesc && TRANSLATIONS[lang].doc_meta_desc) {
            metaDesc.setAttribute('content', TRANSLATIONS[lang].doc_meta_desc);
        }

        // Update static WhatsApp URLs
        const updateStaticWAUrl = (id, messageKey) => {
            const element = document.getElementById(id);
            if (element && TRANSLATIONS[lang][messageKey]) {
                element.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(TRANSLATIONS[lang][messageKey])}`;
            }
        };

        updateStaticWAUrl('nav-cta-btn', 'wa_nav_cta');
        updateStaticWAUrl('nav-cta-mobile-btn', 'wa_nav_cta');
        updateStaticWAUrl('hero-whatsapp-btn', 'wa_hero_cta');
        updateStaticWAUrl('banner-whatsapp-btn', 'wa_banner_cta');
        updateStaticWAUrl('contact-method-wa', 'wa_nav_cta');
        updateStaticWAUrl('floating-whatsapp-btn', 'wa_floating_cta');

        // Update footer main tours WhatsApp links
        const footerTourLinks = document.querySelectorAll('.footer-tour-link');
        footerTourLinks.forEach(link => {
            const tourKey = link.getAttribute('data-tour-name');
            const i18nKey = link.getAttribute('data-i18n');
            const translatedTourName = TRANSLATIONS[lang][i18nKey] || tourKey;
            
            const message = TRANSLATIONS[lang].wa_tour_prefix +
                            translatedTourName +
                            TRANSLATIONS[lang].wa_tour_suffix;
                            
            link.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
        });
    };

    // Handle language selection click
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });

    // Detect browser language or get saved language
    const getInitialLanguage = () => {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && TRANSLATIONS[savedLang]) return savedLang;

        const browserLang = navigator.language.substring(0, 2).toLowerCase();
        if (TRANSLATIONS[browserLang]) return browserLang;

        return 'es';
    };

    // Initialize switcher
    setLanguage(getInitialLanguage());

    /* ==========================================================================
       MOBILE NAVIGATION MENU
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    /* ==========================================================================
       STICKY NAVBAR & ACTIVE SCROLL LINK
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active menu link according to scroll position
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();


    /* ==========================================================================
       TOUR CATEGORY FILTER
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tourCards = document.querySelectorAll('.tour-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            tourCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    /* ==========================================================================
       FAQ ACCORDION ANIMATION
       ========================================================================== */
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            faqTriggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
                    otherTrigger.setAttribute('aria-expanded', 'false');
                    otherTrigger.nextElementSibling.style.maxHeight = null;
                    otherTrigger.nextElementSibling.style.opacity = 0;
                }
            });

            if (isExpanded) {
                trigger.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
                content.style.opacity = 0;
            } else {
                trigger.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = 1;
            }
        });
    });


    /* ==========================================================================
       DYNAMIC WHATSAPP BOOKING LINKS
       ========================================================================== */
    const bookingButtons = document.querySelectorAll('.btn-whatsapp-booking');

    bookingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tourName = button.getAttribute('data-tour');
            const lang = localStorage.getItem('preferredLanguage') || 'es';
            
            const tourKey = tourKeyMap[tourName] || 'tour1_title';
            const translatedTourName = TRANSLATIONS[lang][tourKey] || tourName;
            
            const prefix = TRANSLATIONS[lang].wa_tour_prefix;
            const suffix = TRANSLATIONS[lang].wa_tour_suffix;
            const baseText = `${prefix}${translatedTourName}${suffix}`;
            
            const encodedText = encodeURIComponent(baseText);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

            window.open(whatsappUrl, '_blank');
        });
    });


    /* ==========================================================================
       CONTACT FORM SUBMITTER (WHATSAPP REDIRECT)
       ========================================================================== */
    const contactForm = document.getElementById('consultation-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const message = document.getElementById('form-message').value.trim();
            
            const lang = localStorage.getItem('preferredLanguage') || 'es';
            const t = TRANSLATIONS[lang];

            if (!name || !phone || !message) {
                const alertMsg = lang === 'en' ? 'Please fill in all required fields.' : 
                                 lang === 'it' ? 'Si prega di compilare tutti i campi obbligatori.' : 
                                 'Por favor, rellene todos los campos requeridos.';
                alert(alertMsg);
                return;
            }

            const tourSelect = document.getElementById('form-tour');
            const selectedOptionText = tourSelect.options[tourSelect.selectedIndex].text;

            const messageText = `${t.wa_form_header}` +
                                `${t.wa_form_name}${name}\n` +
                                `${t.wa_form_phone}${phone}\n` +
                                `${t.wa_form_tour}${selectedOptionText}\n\n` +
                                `${t.wa_form_msg}${message}`;

            const encodedMessage = encodeURIComponent(messageText);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');

            contactForm.reset();
        });
    }
});
