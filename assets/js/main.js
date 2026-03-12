// Loading screen functionality
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <h2>Loading JavaScript Frameworks</h2>
            <p>Preparing your experience...</p>
        </div>
    `;
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
                document.body.classList.add('loaded');
            }, 500);
        }, 1000);
    });
});

// Card flip functionality
document.addEventListener('DOMContentLoaded', function() {
    const frameworkCards = document.querySelectorAll('.framework-card');
    
    frameworkCards.forEach(card => {
        // Single click handler to prevent conflicts
        card.addEventListener('click', function(e) {
            // Allow navigation for both front and back "Check it out!" buttons
            if (e.target.classList.contains('check-it-out-btn') || 
                e.target.classList.contains('view-cases-btn')) {
                // Let the link navigate normally, don't prevent default
                return;
            }
            
            // Only flip the card if clicking elsewhere
            e.preventDefault();
            this.classList.toggle('flipped');
        });
    });
    
    // Close cards when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.framework-card-container')) {
            frameworkCards.forEach(card => {
                card.classList.remove('flipped');
            });
        }
    });
    
    // Keyboard accessibility for card flipping
    frameworkCards.forEach(card => {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('flipped');
            }
            if (e.key === 'Escape') {
                this.classList.remove('flipped');
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
    });
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced page animations
window.addEventListener('load', function() {
    // Animate framework cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all framework cards
    document.querySelectorAll('.framework-card-container').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Smooth parallax effect with requestAnimationFrame
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-section');
    if (parallax) {
        // Reduced parallax intensity for smoother effect
        parallax.style.transform = `translateY(${scrolled * 0.02}px)`;
    }
    ticking = false;
}

// Optimized scroll handler using requestAnimationFrame
window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});
