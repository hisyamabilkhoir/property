/* ============================================
   LUXURY PROPERTY AGENT — MAIN SCRIPT
   Enhanced with 3D Tilt, Particles & Glow Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // PRELOADER
    // ========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 1200);
        });
    }

    // Fallback - hide preloader after 4s max
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }
    }, 4000);

    // ========================================
    // PARTICLE SYSTEM — Floating Gold Particles
    // ========================================
    const particleCanvas = document.getElementById('particleCanvas');
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        let animFrameId;

        function resizeCanvas() {
            const hero = document.querySelector('.hero');
            particleCanvas.width = hero.offsetWidth;
            particleCanvas.height = hero.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.3 - 0.15;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
                this.fadeSpeed = Math.random() * 0.008 + 0.002;
                this.golden = Math.random() > 0.3;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeDirection * this.fadeSpeed;

                if (this.opacity >= 0.7) this.fadeDirection = -1;
                if (this.opacity <= 0.05) this.fadeDirection = 1;

                if (this.x < -10 || this.x > particleCanvas.width + 10 ||
                    this.y < -10 || this.y > particleCanvas.height + 10) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                if (this.golden) {
                    ctx.fillStyle = `rgba(201, 169, 110, ${this.opacity})`;
                    ctx.shadowColor = 'rgba(201, 169, 110, 0.5)';
                    ctx.shadowBlur = this.size * 4;
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
                    ctx.shadowBlur = this.size * 2;
                }
                ctx.fill();
                ctx.restore();
            }
        }

        function initParticles() {
            resizeCanvas();
            particles = [];
            const count = Math.min(80, Math.floor(particleCanvas.width * particleCanvas.height / 15000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animFrameId = requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
        window.addEventListener('resize', () => {
            resizeCanvas();
        });
    }

    // ========================================
    // 3D TILT EFFECT — Cards & Agent Photo
    // ========================================
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
        const maxTilt = el.classList.contains('agent-photo-wrapper') ? 12 : 6;
        const perspective = 800;
        const glareEnabled = !el.classList.contains('agent-photo-wrapper');

        // Add glare overlay for cards
        if (glareEnabled) {
            const glare = document.createElement('div');
            glare.classList.add('tilt-glare');
            glare.style.cssText = `
                position: absolute;
                inset: 0;
                border-radius: inherit;
                pointer-events: none;
                z-index: 10;
                opacity: 0;
                transition: opacity 0.3s ease;
                background: linear-gradient(
                    135deg,
                    rgba(201, 169, 110, 0.15) 0%,
                    transparent 40%,
                    transparent 60%,
                    rgba(201, 169, 110, 0.08) 100%
                );
            `;
            el.style.position = 'relative';
            el.appendChild(glare);
        }

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease-out';
        });

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;

            el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Update glare position
            if (glareEnabled) {
                const glare = el.querySelector('.tilt-glare');
                if (glare) {
                    const glareX = (x / rect.width) * 100;
                    const glareY = (y / rect.height) * 100;
                    glare.style.opacity = '1';
                    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(201, 169, 110, 0.15) 0%, transparent 60%)`;
                }
            }
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)';
            el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

            if (glareEnabled) {
                const glare = el.querySelector('.tilt-glare');
                if (glare) glare.style.opacity = '0';
            }
        });
    });

    // ========================================
    // CURSOR GLOW — Custom Glow Follower
    // ========================================
    const cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursorGlow';
    cursorGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(201, 169, 110, 0.06) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(cursorGlow);

    let cursorX = 0, cursorY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    function updateCursorGlow() {
        glowX += (cursorX - glowX) * 0.1;
        glowY += (cursorY - glowY) * 0.1;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(updateCursorGlow);
    }
    updateCursorGlow();

    // ========================================
    // NAVBAR — Scroll Effect & Active State
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleNavScroll);

    // Mobile Menu Toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // HERO — Fade In on Load
    // ========================================
    const heroFadeIns = document.querySelectorAll('.hero .fade-in');
    heroFadeIns.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 300 + (i * 200));
    });

    // ========================================
    // SCROLL ANIMATIONS — Intersection Observer
    // ========================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ========================================
    // COUNTER ANIMATION — Stats Numbers
    // ========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countStarted = false;

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const duration = 2000;
            const startTime = Date.now();

            function updateCount() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                stat.textContent = Math.floor(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            }

            updateCount();
        });
    }

    // Trigger counter when hero stats come into view
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countStarted) {
                    countStarted = true;
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ========================================
    // PROPERTY FILTER — Listings
    // ========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const listingCards = document.querySelectorAll('.listing-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards with animation
            listingCards.forEach((card, index) => {
                const type = card.dataset.type;
                const shouldShow = filter === 'all' || type === filter;

                if (shouldShow) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'perspective(800px) rotateX(10deg) translateY(30px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)';
                        card.style.opacity = '1';
                        card.style.transform = 'perspective(800px) rotateX(0deg) translateY(0)';
                    }, index * 100);
                } else {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // ========================================
    // CONTACT FORM — Validation & Submission
    // ========================================
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const phone = document.getElementById('formPhone').value.trim();
        const subject = document.getElementById('formSubject');
        const subjectText = subject.options[subject.selectedIndex].text;
        const message = document.getElementById('formMessage').value.trim();

        if (!name || !email || !message) {
            shakeElement(contactForm.querySelector('.btn-submit'));
            return;
        }

        // Build WhatsApp message
        let waMessage = `Halo Hisyam! 👋\n\n`;
        waMessage += `*Nama:* ${name}\n`;
        waMessage += `*Email:* ${email}\n`;
        if (phone) waMessage += `*Telepon:* ${phone}\n`;
        if (subject.value) waMessage += `*Subject:* ${subjectText}\n`;
        waMessage += `\n*Pesan:*\n${message}`;

        const waURL = `https://wa.me/6285973729267?text=${encodeURIComponent(waMessage)}`;
        window.open(waURL, '_blank');

        // Show success state
        const successHTML = `
            <div class="form-success">
                <div class="form-success-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                </div>
                <h3>Redirecting to WhatsApp!</h3>
                <p>Thank you, ${name}. Your message is being sent via WhatsApp.</p>
            </div>
        `;

        contactForm.innerHTML = successHTML;
    });

    function shakeElement(el) {
        el.style.animation = 'shake 0.4s ease';
        el.addEventListener('animationend', () => {
            el.style.animation = '';
        }, { once: true });
    }

    // Add shake keyframes dynamically
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            50% { transform: translateX(8px); }
            75% { transform: translateX(-4px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // ========================================
    // CHATBOT — Simulated Conversation
    // ========================================
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quickReplies = document.querySelectorAll('.quick-reply');

    let chatInitialized = false;

    // Chatbot Responses
    const botResponses = {
        greetings: [
            "Hello! 👋 Welcome to Abilkhoir Property. I'm here to help you find your perfect property. What are you looking for today?",
        ],
        buy: [
            "Wonderful! 🏡 I have an exclusive collection of luxury properties available for purchase. Our listings range from oceanfront villas in Malibu to penthouses in Manhattan. What's your preferred location and budget range?",
            "I'd love to help you find your dream home! We specialize in properties starting from $1M. Could you tell me more about what you're looking for — number of bedrooms, preferred neighborhood, or any specific features?",
        ],
        sell: [
            "Great decision! 💰 Selling your property through Abilkhoir Property means your listing gets premium exposure to high-net-worth buyers worldwide. I'd be happy to provide a free market valuation. What type of property are you looking to sell?",
            "I can definitely help with that! We offer comprehensive selling services including professional staging, premium photography, and access to our global buyer network. Would you like to schedule a property assessment?",
        ],
        investment: [
            "Smart choice! 📈 Real estate investment continues to be one of the best wealth-building strategies. I offer personalized portfolio advice, ROI analysis, and access to off-market opportunities. What's your investment budget range?",
            "Excellent! Investment properties are my specialty. Whether you're looking for rental yields or capital appreciation, I can identify the best opportunities. Are you interested in residential or commercial investments?",
        ],
        viewing: [
            "Perfect! 📅 I'd be happy to arrange private viewings. Our available viewing times are Monday through Saturday, 9 AM to 6 PM. Which property interests you, and what time works best?",
            "Absolutely! I recommend scheduling viewings in advance so I can prepare all relevant property information. Would you prefer weekday mornings, afternoons, or weekend viewings?",
        ],
        default: [
            "Thank you for your interest! I'd be happy to help you with that. For more detailed assistance, feel free to contact me via WhatsApp at +62 859-7372-9267 or use the contact form on this page. Is there anything else I can help with?",
            "That's a great question! I'd love to discuss this further. You can reach me directly via WhatsApp or schedule a consultation through the contact form. How else can I assist you today?",
            "I appreciate your message! For personalized guidance, I recommend we schedule a brief consultation. You can reach me at hisyam@abilkhoirproperty.com or through WhatsApp. What else would you like to know?",
        ],
        price: [
            "Our current portfolio ranges from $1.5M to $12M, with properties in premium locations across the US. I can help narrow down options based on your specific budget. What price range are you considering?",
        ],
        location: [
            "We specialize in premium locations including Beverly Hills, Malibu, Manhattan, Aspen, Miami Beach, and more. Each market has unique characteristics and opportunities. Which area interests you most?",
        ],
    };

    function getKeywords(message) {
        const msg = message.toLowerCase();
        if (msg.includes('buy') || msg.includes('purchase') || msg.includes('looking to buy')) return 'buy';
        if (msg.includes('sell') || msg.includes('selling') || msg.includes('list my')) return 'sell';
        if (msg.includes('invest') || msg.includes('roi') || msg.includes('return')) return 'investment';
        if (msg.includes('view') || msg.includes('visit') || msg.includes('tour') || msg.includes('schedule') || msg.includes('appointment')) return 'viewing';
        if (msg.includes('price') || msg.includes('cost') || msg.includes('budget') || msg.includes('afford') || msg.includes('how much')) return 'price';
        if (msg.includes('location') || msg.includes('area') || msg.includes('where') || msg.includes('neighborhood')) return 'location';
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good')) return 'greetings';
        return 'default';
    }

    function getRandomResponse(category) {
        const responses = botResponses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.classList.add('chat-message', type);
        msg.textContent = text;
        chatbotMessages.appendChild(msg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.classList.add('chat-typing');
        typing.id = 'chatTyping';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(typing);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('chatTyping');
        if (typing) typing.remove();
    }

    function botReply(userMessage) {
        showTyping();
        const category = getKeywords(userMessage);
        const response = getRandomResponse(category);
        const delay = 800 + Math.random() * 1200;

        setTimeout(() => {
            removeTyping();
            addMessage(response, 'bot');
        }, delay);
    }

    function initChat() {
        if (!chatInitialized) {
            chatInitialized = true;
            addMessage(botResponses.greetings[0], 'bot');
        }
    }

    // Toggle Chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('open');
        if (chatbotContainer.classList.contains('open')) {
            initChat();
            chatbotInput.focus();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('open');
    });

    // Send Message
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatbotInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatbotInput.value = '';
        botReply(message);
    });

    // Quick Replies
    quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.dataset.message;
            addMessage(message, 'user');
            botReply(message);
        });
    });

    // ========================================
    // SMOOTH SCROLL — Enhanced
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // PARALLAX — Subtle Background Effect
    // ========================================
    const heroBgImg = document.querySelector('.hero-bg-img');

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (heroBgImg && scrolled < window.innerHeight) {
                    heroBgImg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // ========================================
    // REVEAL ON SCROLL — Stagger Children with 3D
    // ========================================
    const grids = document.querySelectorAll('.featured-grid, .services-grid, .testimonials-grid, .listings-grid');

    grids.forEach(grid => {
        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.children;
                    Array.from(cards).forEach((card, i) => {
                        card.style.opacity = '0';
                        card.style.transform = 'perspective(800px) rotateX(8deg) translateY(40px)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.03, 0.98, 0.52, 0.99)';
                            card.style.opacity = '1';
                            card.style.transform = 'perspective(800px) rotateX(0deg) translateY(0)';
                        }, i * 150);
                    });
                    gridObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        gridObserver.observe(grid);
    });

    // ========================================
    // MAGNETIC HOVER — Buttons
    // ========================================
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline, .whatsapp-float, .chatbot-toggle');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)';
        });
    });

    // ========================================
    // SECTION DIVIDER GLOW — Animate on scroll
    // ========================================
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        const divider = document.createElement('div');
        divider.style.cssText = `
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--gold), transparent);
            opacity: 0.3;
            pointer-events: none;
        `;
        section.appendChild(divider);
    });

    // ========================================
    // SCROLL PROGRESS BAR
    // ========================================
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    }

    window.addEventListener('scroll', updateScrollProgress);

    // ========================================
    // SCROLL TO TOP BUTTON
    // ========================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    function toggleScrollTopBtn() {
        if (window.scrollY > 600) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleScrollTopBtn);

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========================================
    // MODAL SYSTEM — Gallery & Listings
    // ========================================
    const modal = document.getElementById('infoModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    window.openModal = function (data) {
        if (!modal) return;

        // Fill data
        document.getElementById('modalImage').src = data.image;
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalTag').textContent = data.tag || 'Luxury Property';
        document.getElementById('modalPrice').textContent = data.price || '';
        document.getElementById('modalDesc').textContent = data.desc || 'Experience unparalleled luxury in this meticulously designed estate. Every detail has been curated to provide an extraordinary living experience.';

        const metaContainer = document.getElementById('modalMeta');
        metaContainer.innerHTML = '';
        if (data.meta && data.meta.length > 0) {
            data.meta.forEach(stat => {
                const span = document.createElement('span');
                span.textContent = stat;
                metaContainer.appendChild(span);
            });
        }

        // Custom Button Text
        const modalBtn = modal.querySelector('.modal-actions .btn');
        if (modalBtn) {
            modalBtn.textContent = data.buttonText || 'Schedule Viewing';
        }

        // Show modal
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
    };

    window.closeModal = function () {
        if (!modal) return;
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 500);
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // LISTING CARD CLICKS
    document.querySelectorAll('.property-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.property-card');
            const data = {
                image: card.querySelector('img').src,
                title: card.querySelector('.property-name').textContent,
                price: card.querySelector('.property-price').textContent,
                tag: card.querySelector('.property-badge').textContent,
                meta: Array.from(card.querySelectorAll('.property-meta span')).map(s => s.textContent),
                desc: "This exceptional residence offers a blend of sophisticated design and modern comfort. Located in a prime neighborhood, it features high-end finishes, spacious living areas, and breathtaking views."
            };
            openModal(data);
        });
    });

    // GALLERY CLICKS
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const data = {
                image: item.querySelector('img').src,
                title: item.querySelector('h3').textContent,
                tag: item.querySelector('.gallery-cat').textContent,
                price: 'Interior Design',
                meta: ['Handcrafted', 'Luxury Finishes', 'Custom Detail'],
                desc: "Explore the intricate details of our interior masterpieces. This space exemplifies our commitment to architectural excellence and boutique luxury living.",
                buttonText: "Inquire Now"
            };
            openModal(data);
        });
    });

    // AWARD CARD CLICKS
    document.querySelectorAll('.award-card').forEach(card => {
        card.addEventListener('click', () => {
            const awardName = card.querySelector('.award-name').textContent;
            const awardYear = card.querySelector('.award-year').textContent;
            const awardOrg = card.querySelector('.award-org').textContent;
            const data = {
                image: card.querySelector('img').src,
                title: awardName,
                tag: `Award ${awardYear}`,
                price: awardOrg,
                meta: ['Global Recognition', 'Professional Excellence', 'Industry Leader'],
                desc: `This prestigious award recognizes ${awardName} for outstanding achievement and excellence. Presented by ${awardOrg} in ${awardYear}, it reflects our unwavering commitment to the highest standards in luxury real estate.`,
                buttonText: "Connect with Hisyam"
            };
            openModal(data);
        });
    });

    // ========================================
    // NAVBAR INIT
    // ========================================
    handleNavScroll();
    updateScrollProgress();
});
