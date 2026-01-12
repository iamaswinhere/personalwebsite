// Custom Cursor Logic
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

// Magnetic Buttons
const buttons = document.querySelectorAll(".btn, .social-link, .project-link");
buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Magnet strength
        const strength = 10;

        gsap.to(btn, {
            x: x / strength,
            y: y / strength,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
});


window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Update Time
function updateTime() {
    const timeDisplay = document.getElementById("local-time");
    if (timeDisplay) {
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        const timeString = new Date().toLocaleTimeString([], options);
        timeDisplay.textContent = timeString;
    }
}
setInterval(updateTime, 1000);
updateTime();

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Reveal Grid items
gsap.utils.toArray('.bento-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: i * 0.1 // Stagger effect
    });
});

// Horizontal Scroll for Text (if stack-scroller wasn't CSS only)
// But we have CSS animation for stack, let's keep it lightweight.

// Vanilla Tilt Init
VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    scale: 1.02
});

// Playground Logic & Analytics
const playgroundCard = document.querySelector('.playground-card');
const counterDisplay = document.querySelector('.counter-display');
const timeDisplay = document.getElementById('time-display');

// Initialize from LocalStorage
let count = parseInt(localStorage.getItem('userClickCount')) || 0;
let timeSpent = parseInt(localStorage.getItem('userTimeSpent')) || 0;

if (counterDisplay) {
    counterDisplay.textContent = count;
}

// Global Click Counting
if (counterDisplay) {
    document.addEventListener('click', (e) => {
        count++;
        counterDisplay.textContent = count;
        localStorage.setItem('userClickCount', count);

        // Pulse effect
        gsap.fromTo(counterDisplay, { scale: 1.5 }, { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.3)" });

        // If the click is inside the playground card, trigger particles there
        if (playgroundCard && playgroundCard.contains(e.target)) {
            createParticle(e.clientX, e.clientY);
        }
    });
}

// Time Tracking
function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
}

if (timeDisplay) {
    timeDisplay.textContent = formatTime(timeSpent);

    setInterval(() => {
        timeSpent++;
        timeDisplay.textContent = formatTime(timeSpent);
        localStorage.setItem('userTimeSpent', timeSpent);
    }, 1000);
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    const colors = ['#6c5ce7', '#ff7675', '#55efc4', '#ffeaa7'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Position relative to card if possible, but for simplicity relative to viewport with fixed pos
    // Better: append to body or specific container. Let's use body for simpler absolute positioning or container relative.
    // The container .particles-container is in the card, so coordinates need to be relative to the card.

    // Let's use a simpler "confetti" visual inside the card for now to avoid complexity with coordinates.
    // Just a burst inside the card center.

    const cardRect = playgroundCard.getBoundingClientRect();
    const relX = x - cardRect.left;
    const relY = y - cardRect.top;

    const size = Math.random() * 8 + 4;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;
    particle.style.position = 'absolute';
    particle.style.left = `${relX}px`;
    particle.style.top = `${relY}px`;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';

    const container = document.getElementById('particles');
    container.appendChild(particle);

    // Animate away
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 50 + 20;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    gsap.to(particle, {
        x: tx,
        y: ty,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => particle.remove()
    });
}



// EmailJS Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    // State to track initialization
    let emailConfig = null;
    let isInitialized = false;

    // Function to initialize EmailJS
    const tryInitEmailJS = () => {
        const env = window.env || (typeof CONFIG !== 'undefined' ? CONFIG.EMAILJS : null);
        if (typeof emailjs !== 'undefined' && env && !isInitialized) {
            const publicKey = env.EMAILJS_PUBLIC_KEY || env.PUBLIC_KEY;
            emailjs.init(publicKey);
            emailConfig = env;
            isInitialized = true;
            console.log('EmailJS initialized successfully');
        }
    };

    // Try init immediately, or wait for env
    if (window.env) tryInitEmailJS();
    window.addEventListener('env-ready', tryInitEmailJS);

    // Attach listener IMMEDIATELY to prevent reload
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // This must run synchronously!

        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;

        // Verify initialization
        if (!isInitialized || !emailConfig) {
            // Try one last time just in case
            tryInitEmailJS();

            if (!isInitialized || !emailConfig) {
                console.error('EmailJS not initialized. Check .env configuration.');
                btn.innerHTML = 'Config Error';
                btn.style.backgroundColor = '#ef4444';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                }, 2000);
                return;
            }
        }

        btn.innerHTML = 'Sending...';

        const serviceId = emailConfig.EMAILJS_SERVICE_ID || emailConfig.SERVICE_ID;
        const templateId = emailConfig.EMAILJS_TEMPLATE_ID || emailConfig.TEMPLATE_ID;

        emailjs.sendForm(serviceId, templateId, this)
            .then(function () {
                btn.innerHTML = 'Sent! <i class="bx bx-check"></i>';
                btn.style.backgroundColor = '#4ade80'; // Success green
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                }, 3000);
            }, function (error) {
                console.error('FAILED...', error);
                btn.innerHTML = 'Error <i class="bx bx-error"></i>';
                btn.style.backgroundColor = '#ef4444'; // Error red

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                }, 3000);
            });
    });
}


// ... (previous code)

// Make Project Cards Clickable
document.querySelectorAll('.project-card').forEach(card => {
    // ... (existing logic)
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.project-link')) {
            const link = card.querySelector('.project-link');
            if (link) {
                window.open(link.href, link.target || '_blank');
            }
        }
    });
});

// 1. Entrance Animation (on page load)
// Removed page transition logic

// 2. Exit Animation (link clicks)
// Removed page transition logic
