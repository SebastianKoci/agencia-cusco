document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       WHATSAPP NUMBER CONFIGURATION
       ========================================================================== */
    // Change this number to the agency's actual WhatsApp phone number (with country code, e.g. 51 = Peru)
    const WHATSAPP_PHONE = '51999999999';

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
            // Checks if scroll position is within the current section (offset by 150px for header cushion)
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
    handleScroll(); // Trigger on load in case page is loaded mid-scroll


    /* ==========================================================================
       TOUR CATEGORY FILTER
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tourCards = document.querySelectorAll('.tour-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            tourCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    // Show matching cards
                    card.style.display = 'flex';
                    // Trigger a tiny animation trigger
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    }, 50);
                } else {
                    // Hide non-matching cards
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

            // Collapse all other active accordion items first (optional, makes it cleaner)
            faqTriggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
                    otherTrigger.setAttribute('aria-expanded', 'false');
                    otherTrigger.nextElementSibling.style.maxHeight = null;
                    otherTrigger.nextElementSibling.style.opacity = 0;
                }
            });

            // Toggle current item
            if (isExpanded) {
                trigger.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
                content.style.opacity = 0;
            } else {
                trigger.setAttribute('aria-expanded', 'true');
                // Calculate real height of inner contents for transition
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
            
            // Build direct message
            const baseText = `Hola Killa Cusco Tours! 🌟 Quisiera cotizar y reservar el tour: *${tourName}*. ¿Me podrían dar disponibilidad y más información? ¡Muchas gracias!`;
            const encodedText = encodeURIComponent(baseText);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

            // Open in new tab
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

            // Extract values
            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const tour = document.getElementById('form-tour').value;
            const message = document.getElementById('form-message').value.trim();

            // Form validation check
            if (!name || !phone || !message) {
                alert('Por favor, rellene todos los campos requeridos.');
                return;
            }

            // Build detailed formatted message
            const messageText = `*NUEVA CONSULTA - WEB KILLA CUSCO TOURS*\n\n` +
                                `👤 *Nombre:* ${name}\n` +
                                `📱 *WhatsApp:* ${phone}\n` +
                                `🗺️ *Tour de interés:* ${tour}\n\n` +
                                `💬 *Consulta:* ${message}`;

            const encodedMessage = encodeURIComponent(messageText);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

            // Open whatsapp link
            window.open(whatsappUrl, '_blank');

            // Reset form for UI satisfaction
            contactForm.reset();
        });
    }
});
