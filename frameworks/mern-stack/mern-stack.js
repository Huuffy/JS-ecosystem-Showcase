// MERN Stack showcase functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize syntax highlighting for code blocks
    initializeSyntaxHighlighting();
    
    // Add scroll animations
    initializeScrollAnimations();
    
    // Setup copy code functionality
    setupCopyCodeButtons();
});

function refreshProject(projectName) {
    const iframe = document.getElementById(`${projectName}-frame`);
    if (iframe) {
        iframe.src = iframe.src;
        
        // Add loading animation
        const refreshBtn = event.target.closest('.refresh-btn');
        refreshBtn.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 1000);
    }
}
window.refreshProject = refreshProject;

function toggleFullscreen(frameId) {
    const iframe = document.getElementById(frameId);
    if (!iframe) return;
    
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    } else {
        // Fallback: open in new tab
        window.open(iframe.src, '_blank');
    }
}
window.toggleFullscreen = toggleFullscreen;

function copyCode(codeId) {
    const codeElement = document.getElementById(codeId);
    const codeText = codeElement.textContent;
    
    navigator.clipboard.writeText(codeText).then(() => {
        // Show success feedback
        const copyBtn = event.target;
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#3fb950';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#58a6ff';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
        alert('Failed to copy code to clipboard');
    });
}
window.copyCode = copyCode;

function initializeSyntaxHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        let html = block.innerHTML;
        
        // Basic syntax highlighting patterns
        html = html.replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|from|async|await|try|catch|new)\b/g, 
            '<span class="keyword">$1</span>');
        
        html = html.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, 
            '<span class="string">$1$2$1</span>');
        
        html = html.replace(/\/\/.*$/gm, 
            '<span class="comment">$&</span>');
        
        html = html.replace(/\/\*[\s\S]*?\*\//g, 
            '<span class="comment">$&</span>');
        
        html = html.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, 
            '<span class="function">$1</span>(');
        
        block.innerHTML = html;
    });
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe use case sections
    const useCases = document.querySelectorAll('.use-case');
    useCases.forEach((useCase, index) => {
        useCase.style.opacity = '0';
        useCase.style.transform = 'translateY(30px)';
        useCase.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(useCase);
    });
}

function setupCopyCodeButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeId = this.getAttribute('onclick').match(/copyCode\('([^']+)'\)/)[1];
            copyCode(codeId);
        });
    });
}

// Add hover effects for project showcases
document.querySelectorAll('.project-showcase').forEach(showcase => {
    showcase.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    });
    
    showcase.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Add smooth scrolling for anchor links
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
