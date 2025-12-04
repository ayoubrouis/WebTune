// welcome.js - Enhanced with particles, mouse trail, and 3D interactions

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initMouseTrail();
  initCardTiltEffects();
  initScrollAnimations();
  initCTAButton();
});

// Create floating particles
function createParticles() {
  const container = document.getElementById('particles');
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 15) + 's';
    particle.style.opacity = 0.1 + Math.random() * 0.3;
    particle.style.width = (4 + Math.random() * 6) + 'px';
    particle.style.height = particle.style.width;
    
    // Navy/teal palette colors
    const colors = ['rgba(29, 84, 108, 0.6)', 'rgba(59, 142, 165, 0.6)', 'rgba(90, 175, 202, 0.6)', 'rgba(244, 244, 244, 0.4)'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(particle);
  }
}

// Mouse trail effect
function initMouseTrail() {
  const canvas = document.getElementById('mouseTrail');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#1D546C', '#3B8EA5', '#5AAFCA'];
  
  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 4;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.life = 1;
      this.decay = 0.02 + Math.random() * 0.02;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size *= 0.97;
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  let mouseX = 0;
  let mouseY = 0;
  let isMoving = false;
  let moveTimeout;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    
    // Add particles on movement
    if (Math.random() > 0.5) {
      particles.push(new TrailParticle(mouseX, mouseY));
    }
    
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 100);
  });
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      
      if (particles[i].life <= 0 || particles[i].size <= 0.5) {
        particles.splice(i, 1);
      }
    }
    
    // Limit particles
    if (particles.length > 100) {
      particles.splice(0, particles.length - 100);
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// 3D tilt effect for cards
function initCardTiltEffects() {
  const cards = document.querySelectorAll('.feature-card, .step');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
  
  // Hero card parallax
  const heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.clientX) / 50;
      const y = (window.innerHeight / 2 - e.clientY) / 50;
      
      heroCard.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
    
    document.addEventListener('mouseleave', () => {
      heroCard.style.transform = '';
    });
  }
}

// Scroll-triggered animations
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) rotateX(0)';
        
        // Add stagger delay for children
        const children = entry.target.querySelectorAll('.feature-card, .step');
        children.forEach((child, index) => {
          child.style.transitionDelay = `${index * 0.1}s`;
        });
      }
    });
  }, observerOptions);
  
  // Observe sections
  document.querySelectorAll('.features-section, .steps-section, .cta-section').forEach(section => {
    observer.observe(section);
  });
}

// CTA Button interaction
function initCTAButton() {
  const ctaButton = document.getElementById('ctaButton');
  
  if (ctaButton) {
    // Magnetic effect
    ctaButton.addEventListener('mousemove', (e) => {
      const rect = ctaButton.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      ctaButton.style.transform = `
        translateY(-8px) 
        scale(1.05) 
        rotateX(${y / 10}deg) 
        rotateY(${x / 10}deg)
        translate(${x / 8}px, ${y / 8}px)
      `;
    });
    
    ctaButton.addEventListener('mouseleave', () => {
      ctaButton.style.transform = '';
    });
    
    // Click handler with explosion effect
    ctaButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Create explosion particles
      createExplosion(e.clientX, e.clientY);
      
      // Pulse animation
      ctaButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        ctaButton.style.transform = '';
      }, 100);
      
      // Close after animation
      setTimeout(() => {
        window.close();
      }, 800);
    });
  }
}

// Explosion particle effect with navy/teal palette
function createExplosion(x, y) {
  const colors = ['#0C2B4E', '#1A3D64', '#1D546C', '#3B8EA5', '#5AAFCA', '#F4F4F4'];
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const angle = (i / particleCount) * Math.PI * 2;
    const velocity = 3 + Math.random() * 5;
    const size = 6 + Math.random() * 8;
    
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      box-shadow: 0 0 10px currentColor;
    `;
    
    document.body.appendChild(particle);
    
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    let posX = x;
    let posY = y;
    let opacity = 1;
    let scale = 1;
    
    function animateParticle() {
      posX += vx;
      posY += vy + 0.5; // gravity
      opacity -= 0.02;
      scale *= 0.98;
      
      particle.style.left = posX + 'px';
      particle.style.top = posY + 'px';
      particle.style.opacity = opacity;
      particle.style.transform = `scale(${scale})`;
      
      if (opacity > 0) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    }
    
    requestAnimationFrame(animateParticle);
  }
}

// Add smooth scroll behavior
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

// Animate logo on load with extra flair
setTimeout(() => {
  const logo = document.querySelector('.logo-3d');
  if (logo) {
    logo.style.animation = 'none';
    logo.offsetHeight; // Trigger reflow
    logo.style.animation = 'logo3D 6s ease-in-out infinite';
  }
}, 1000);
