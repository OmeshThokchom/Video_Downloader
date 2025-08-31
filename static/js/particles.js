// Particle Animation System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.mouseRadius = 150;
        this.particleCount = 100;
        this.connectionDistance = 150;
        
        this.init();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        this.resize();
        
        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor(),
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    getRandomColor() {
        const colors = [
            '#06b6d4', // cyan
            '#3b82f6', // blue
            '#8b5cf6', // purple
            '#10b981', // emerald
            '#f59e0b'  // amber
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = 0;
            this.mouse.y = 0;
        });
        
        // Add touch support for mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.mouse.x = 0;
            this.mouse.y = 0;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouseRadius && this.mouse.x !== 0) {
                const angle = Math.atan2(dy, dx);
                const force = (this.mouseRadius - distance) / this.mouseRadius;
                
                particle.vx -= Math.cos(angle) * force * 0.02;
                particle.vy -= Math.sin(angle) * force * 0.02;
                
                // Increase size and opacity when near mouse
                particle.size = Math.min(particle.size + 0.1, 4);
                particle.opacity = Math.min(particle.opacity + 0.01, 0.8);
            } else {
                // Return to normal size and opacity
                particle.size = Math.max(particle.size - 0.05, 1);
                particle.opacity = Math.max(particle.opacity - 0.005, 0.2);
            }
            
            // Pulse animation
            particle.pulse += 0.05;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Pulse effect
            const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5;
            
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            
            // Create gradient for particles
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, pulseSize
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (this.connectionDistance - distance) / this.connectionDistance;
                    this.ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.3})`;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawMouseEffect() {
        if (this.mouse.x !== 0 && this.mouse.y !== 0) {
            this.ctx.save();
            
            // Create ripple effect
            const gradient = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, this.mouseRadius
            );
            gradient.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, this.mouseRadius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        this.drawMouseEffect();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});

// Add interactive effects to UI elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            // Create particle burst effect
            createParticleBurst(e.clientX, e.clientY);
        });
    });
    
    // Add hover effects to input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            createParticleBurst(e.clientX, e.clientY, 5);
        });
    });
});

// Particle burst effect for UI interactions
function createParticleBurst(x, y, count = 10) {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const velocity = 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        // Create temporary particle
        const particle = {
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: Math.random() * 3 + 1,
            opacity: 1,
            color: '#06b6d4',
            life: 30
        };
        
        // Animate the burst particle
        function animateBurst() {
            if (particle.life > 0) {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.opacity = particle.life / 30;
                particle.size *= 0.95;
                particle.life--;
                
                ctx.save();
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                
                requestAnimationFrame(animateBurst);
            }
        }
        
        animateBurst();
    }
}
