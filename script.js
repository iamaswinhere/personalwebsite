window.addEventListener('scroll', function() {
    let parallax = document.querySelectorAll('.parallax');
    let scrollPosition = window.pageYOffset;

    parallax.forEach(function(element) {
        let speed = parseFloat(element.dataset.speed) || 0.5;
        let scale = 1 + (scrollPosition * 0.0001 * speed);

        element.style.transform = `translateY(${scrollPosition * speed}px) scale(${scale})`;
    });
});

function reveal() {
    let reveals = document.querySelectorAll('.reveal');

    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let revealTop = reveals[i].getBoundingClientRect().top;
        let revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('active');
        }
    }
}

window.addEventListener('scroll', reveal);

function typeWriter(text, element, speed) {
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}

let heroHeadline = document.querySelector('.hero-content h1');
if (heroHeadline) {
    typeWriter("Aswinraj J", heroHeadline, 100);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function isMouseInside(x, y, element) {
    const rect = element.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function handleCursorActivation(element, activate, state) {
    if (activate) {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            if (state) {
                cursor.classList.add(state);
            }
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            if (state) {
                cursor.classList.remove(state);
            }
        });
    }
}

const interactiveElements = document.querySelectorAll('a, button');
const projectItems = document.querySelectorAll('.project-item');
const socialButtons = document.querySelectorAll('.social-button');

interactiveElements.forEach((element) => {
    handleCursorActivation(element, true);
});

projectItems.forEach((element) => {
    handleCursorActivation(element, true, 'hover-project');
});

socialButtons.forEach((element) => {
    handleCursorActivation(element, true, 'hover-social');
});

particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 100,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#555"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
        },
        "opacity": {
            "value": 0.5,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#333",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 3,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "repulse": {
                "distance": 100,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            }
        }
    },
    "retina_detect": true
});