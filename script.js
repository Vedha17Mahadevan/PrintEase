// Enhanced Particles.js Configuration with Dust Effect
document.addEventListener('DOMContentLoaded', function() {
  // Initialize particles for all sections
  particlesJS('particles-js', getParticlesConfig());
  particlesJS('features-particles', getParticlesConfig());
  particlesJS('testimonials-particles', getParticlesConfig());
  particlesJS('assistance-particles', getParticlesConfig());

  // Check authentication status and update UI
  const token = localStorage.getItem('token');
  const dashboardLink = document.getElementById('dashboard-link');
  const loginLink = document.getElementById('login-link');
  const signupLink = document.getElementById('signup-link');
  const logoutLink = document.getElementById('logout-link');
  const orderBtns = document.querySelectorAll('#hero-order-btn');

  if (token) {
    // User is logged in
    dashboardLink.style.display = 'block';
    logoutLink.style.display = 'block';
    loginLink.style.display = 'none';
    signupLink.style.display = 'none';

    // Add click event to order buttons
    orderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = 'order.html';
      });
    });

    // Add logout functionality
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'index.html';
    });
  } else {
    // User is not logged in
    dashboardLink.style.display = 'none';
    logoutLink.style.display = 'none';
    loginLink.style.display = 'block';
    signupLink.style.display = 'block';

    // Redirect to login for order attempts
    orderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = 'login.html';
      });
    });
  }
});

// Particles configuration function
function getParticlesConfig() {
  return {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#d7d4b6'
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        }
      },
      opacity: {
        value: 0.3,
        random: false,
        anim: {
          enable: false
        }
      },
      size: {
        value: 3,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#d7d4b6',
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  };
}
// Function to create additional dust particles at the top of the hero section
function createHeroTopDustEffect() {
  // Create a new div for the hero top dust particles
  const heroTopDust = document.createElement('div');
  heroTopDust.id = 'hero-top-dust';
  heroTopDust.style.position = 'absolute';
  heroTopDust.style.top = '0';
  heroTopDust.style.left = '0';
  heroTopDust.style.width = '100%';
  heroTopDust.style.height = '40%'; // Only cover the top portion of hero
  heroTopDust.style.zIndex = '1';
  heroTopDust.style.pointerEvents = 'none';
  
  // Append to hero section
  document.querySelector('.hero').appendChild(heroTopDust);
  
  // Initialize particles for this specific area
  particlesJS('hero-top-dust', {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 600
        }
      },
      "color": {
        "value": ["#ffffff", "#d7d4b6", "#e8e6d2"]
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 0.4,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 0.8,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 2.5,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false
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
          "particles_nb": 10
        }
      }
    },
    "retina_detect": true
  });
}

// Add navigation functionality
document.getElementById('dashboard-btn').addEventListener('click', () => {
  window.location.href = 'dashboard.html'; // Change to your dashboard URL
});

document.getElementById('hero-order-btn').addEventListener('click', () => {
  window.location.href = 'order.html'; // Change to your order page URL
});

// Assistance Centre Form Submission
function submitAssistance() {
  let email = document.getElementById("assistance-email").value;
  if (email === "") {
    alert("Please enter your email address.");
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }
  
  alert("Thank you! We will get back to you soon.");
  document.getElementById("assistance-email").value = "";
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Add animation on scroll
window.addEventListener('load', () => {
  const featureItems = document.querySelectorAll('.feature-item');
  const testimonials = document.querySelectorAll('.testimonial');
  
  // Simple animation when elements come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  // Set initial state and observe elements
  featureItems.forEach((item, index) => {
    item.style.opacity = 0;
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });
  
  testimonials.forEach((item, index) => {
    item.style.opacity = 0;
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });
});