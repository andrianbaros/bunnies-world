import React, { useRef, useEffect } from 'react';

export default function MagneticCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 45;
    const maxDistance = 180; // Distance of attraction
    
    // Mouse state
    const mouse = {
      x: null,
      y: null,
      radius: 200, // Attraction radius
      charge: 2.5 // Strength of mouse magnet
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2.5 + 0.8;
        
        // Magnet properties
        this.polarity = Math.random() > 0.5 ? 1 : -1; // 1 = North (+), -1 = South (-)
        this.mass = this.size * 1.5;
        this.charge = Math.random() * 1.2 + 0.5;
        this.color = this.polarity === 1 ? 'rgba(255, 183, 213,' : 'rgba(139, 240, 255,';
      }

      update() {
        // Friction / drag (to prevent infinite acceleration)
        this.vx *= 0.985;
        this.vy *= 0.985;

        // Apply forces from mouse magnet
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          if (dist < mouse.radius) {
            // Magnetic force formula: F = (charge1 * charge2) / distance^2
            // For smooth visualization, we use a spring-attraction falloff
            const force = (mouse.radius - dist) / mouse.radius;
            
            // Particles are attracted to mouse (Magnetic pull)
            const acceleration = (force * mouse.charge * this.charge) / this.mass;
            this.vx += (dx / dist) * acceleration;
            this.vy += (dy / dist) * acceleration;
          }
        }

        // Apply forces from other particles (inter-particle polarity forces)
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p === this) continue;

          const dx = p.x - this.x;
          const dy = p.y - this.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 1500 && distSq > 4) { // only apply if relatively close
            const dist = Math.sqrt(distSq);
            const force = (35 - dist) / 35;
            
            // Opposite polarities attract, same polarities repel!
            const polarityMultiplier = (this.polarity === p.polarity) ? -0.4 : 0.8;
            const acceleration = (force * this.charge * p.charge * polarityMultiplier) / this.mass;
            
            this.vx += (dx / dist) * acceleration;
            this.vy += (dy / dist) * acceleration;
          }
        }

        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Screen boundary collisions (bounce)
        if (this.x < 0) {
          this.x = 0;
          this.vx *= -1;
        } else if (this.x > canvas.width) {
          this.x = canvas.width;
          this.vx *= -1;
        }
        
        if (this.y < 0) {
          this.y = 0;
          this.vy *= -1;
        } else if (this.y > canvas.height) {
          this.y = canvas.height;
          this.vy *= -1;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Pulse opacity based on velocity
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const opacity = Math.min(Math.max(0.15, speed * 0.25), 0.75).toFixed(2);
        
        ctx.fillStyle = `${this.color}${opacity})`;
        ctx.shadowBlur = this.size * 2.5;
        ctx.shadowColor = this.polarity === 1 ? 'rgba(255, 183, 213, 0.4)' : 'rgba(139, 240, 255, 0.4)';
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0; // reset shadows

      // Connect near opposite particles with light energy magnetic lines
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Connect only if they are close, and have OPPOSITE polarity (flux lines!)
          if (distance < 75 && particles[a].polarity !== particles[b].polarity) {
            const opacity = ((75 - distance) / 75) * 0.18;
            ctx.strokeStyle = `rgba(203, 158, 255, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
}
