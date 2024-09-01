const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 4 + 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.velocityX = Math.random() * 6 - 3;
        this.velocityY = Math.random() * -6 - 3;
        this.gravity = 0.05;
        this.opacity = 1;
        this.explode();
    }

    explode() {
        this.particles = [];
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            const particle = {
                x: this.x,
                y: this.y,
                radius: Math.random() * 2,
                color: this.color,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                gravity: 0.02,
                opacity: 1
            };
            this.particles.push(particle);
        }
    }

    draw() {
        for (let particle of this.particles) {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += particle.gravity;
            particle.opacity -= 0.01;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.hexToRgb(particle.color)}, ${particle.opacity})`;
            ctx.fill();
        }
    }

    hexToRgb(hsl) {
        const h = parseInt(hsl.slice(4, 7), 10);
        const s = parseInt(hsl.slice(9, 12), 10);
        const l = parseInt(hsl.slice(14, 17), 10);

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hueToRgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hueToRgb(p, q, h + 1 / 3);
            g = hueToRgb(p, q, h);
            b = hueToRgb(p, q, h - 1 / 3);
        }
        return `${r * 255}, ${g * 255}, ${b * 255}`;
    }
}

function createFirework() {
    const firework = new Firework(Math.random() * canvas.width, canvas.height);
    fireworks.push(firework);
}

function updateFireworks() {
    fireworks.forEach((firework, index) => {
        firework.draw();
        if (firework.particles[0].opacity <= 0) {
            fireworks.splice(index, 1);
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateFireworks();
    requestAnimationFrame(animate);
}

setInterval(createFirework, 800);
animate();
