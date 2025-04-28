// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    initParticles();
    
    // Set up event listeners for filter buttons
    setupOrderFilters();
    
    // Set up event listeners for order action buttons
    setupOrderActions();
    
    // Set up event listeners for quick action buttons
    setupQuickActions();
    
    // Set up user dropdown functionality
    setupUserDropdown();
    
    // Set up main navigation buttons
    setupNavigation();
    
    // Load user data (simulated)
    loadUserData();
});

// Initialize particles.js for background effect
function initParticles() {
    particlesJS('particles-js', {
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
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
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
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
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
                        opacity: 0.8
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// Set up order filter functionality
function setupOrderFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const orderCards = document.querySelectorAll('.order-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide order cards based on filter
            orderCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-status') === filter) {
                    card.style.display = 'block';
                    // Add animation for smooth appearance
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Set up order action buttons
function setupOrderActions() {
    // Track buttons
    const trackButtons = document.querySelectorAll('.track-btn');
    trackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderCard = this.closest('.order-card');
            const orderId = orderCard.querySelector('h3').textContent.split('#')[1];
            alert(`Tracking order #${orderId}. You will be redirected to the tracking page.`);
            // In a real application, this would redirect to a tracking page
        });
    });
    
    // Details buttons
    const detailsButtons = document.querySelectorAll('.details-btn');
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderCard = this.closest('.order-card');
            const orderId = orderCard.querySelector('h3').textContent.split('#')[1];
            alert(`Viewing details for order #${orderId}. You will be redirected to the order details page.`);
            // In a real application, this would redirect to an order details page
        });
    });
    
    // Reorder buttons
    const reorderButtons = document.querySelectorAll('.reorder-btn');
    reorderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderCard = this.closest('.order-card');
            const orderId = orderCard.querySelector('h3').textContent.split('#')[1];
            const orderType = orderCard.querySelector('.order-type').textContent;
            alert(`Reordering ${orderType} from order #${orderId}. You will be redirected to the order form.`);
            // In a real application, this would redirect to an order form prefilled with the previous order details
        });
    });
    
    // Pay now buttons
    const payButtons = document.querySelectorAll('.pay-btn');
    payButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderCard = this.closest('.order-card');
            const orderId = orderCard.querySelector('h3').textContent.split('#')[1];
            alert(`Proceeding to payment for order #${orderId}. You will be redirected to the payment page.`);
            // In a real application, this would redirect to a payment page
        });
    });
    
    // View history button
    const viewHistoryButton = document.querySelector('.view-history');
    if (viewHistoryButton) {
        viewHistoryButton.addEventListener('click', function() {
            alert('Redirecting to order history page.');
            // In a real application, this would redirect to an order history page
        });
    }
}

// Set up quick action buttons
function setupQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const actionType = this.closest('.action-card').querySelector('h3').textContent;
            
            switch(actionType) {
                case 'New Order':
                    alert('Starting a new order. You will be redirected to the order form.');
                    // In a real application, this would redirect to an order form
                    break;
                case 'Templates':
                    alert('Browsing templates. You will be redirected to the templates page.');
                    // In a real application, this would redirect to a templates page
                    break;
                case 'Support':
                    alert('Contacting support. You will be redirected to the support page.');
                    // In a real application, this would redirect to a support page
                    break;
                case 'Analytics':
                    alert('Viewing analytics. You will be redirected to the analytics page.');
                    // In a real application, this would redirect to an analytics page
                    break;
                default:
                    alert('Action not recognized.');
            }
        });
    });
}

// Set up user dropdown functionality
function setupUserDropdown() {
    const userIcon = document.querySelector('.user-icon');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    if (userIcon && dropdownContent) {
        userIcon.addEventListener('click', function() {
            dropdownContent.classList.toggle('show');
        });
        
        // Close dropdown when clicking elsewhere
        window.addEventListener('click', function(event) {
            if (!event.target.matches('.user-icon')) {
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            }
        });
    }
}

// Set up main navigation buttons
function setupNavigation() {
    const orderBtn = document.querySelector('.order-btn');
    const homeBtn = document.querySelector('.home-btn');
    
    if (orderBtn) {
        orderBtn.addEventListener('click', function() {
            alert('Redirecting to order page.');
            // In a real application, this would redirect to an order page
        });
    }
    
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            alert('Redirecting to home page.');
            // In a real application, this would redirect to the home page
        });
    }
}

// Load user data (simulated)
function loadUserData() {
    // In a real application, this would fetch user data from a server
    // For demonstration, we'll use hardcoded data
    const userData = {
        name: 'John Doe',
        ordersActive: 5,
        ordersCompleted: 12,
        ordersPending: 2
    };
    
    // Update user name
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = userData.name;
    }
    
    // Update order stats (already set in HTML for this demo)
    // In a real application, you would update these dynamically
    
    // Add animation to stats
    animateStats();
}

// Animate statistics with a counting effect
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(statEl => {
        const finalValue = parseInt(statEl.textContent);
        animateValue(statEl, 0, finalValue, 1000);
    });
}

// Helper function for animating numbers
function animateValue(element, start, end, duration) {
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Add CSS for dropdown functionality
(function addDropdownStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .dropdown-content {
            display: none;
            position: absolute;
            right: 0;
            background-color: rgba(29, 120, 70, 0.95);
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
            border-radius: 10px;
            margin-top: 10px;
            overflow: hidden;
        }
        
        .dropdown-content a {
            color: #d7d4b6;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            font-size: 0.9rem;
            transition: background-color 0.3s;
        }
        
        .dropdown-content a:hover {
            background-color: rgba(45, 160, 100, 0.7);
        }
        
        .show {
            display: block;
            animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .user-icon {
            cursor: pointer;
            transition: transform 0.3s;
            font-size: 1.5rem;
        }
        
        .user-icon:hover {
            transform: scale(1.1);
        }
        
        .order-card {
            opacity: 1;
            transition: opacity 0.3s, transform 0.3s;
        }
    `;
    document.head.appendChild(style);
})();

// Add window resize handler for responsive adjustments
window.addEventListener('resize', function() {
    // Handle responsive adjustments if needed
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Adjust UI for mobile if needed
    } else {
        // Adjust UI for desktop if needed
    }
});