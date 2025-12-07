<script>
	import { onMount, onDestroy } from 'svelte';

	let canvas;
	let ctx;
	let animationId;
	let isHeartAnimating = false;
	let cvWidth = 0;
	let cvHeight = 0;
	let time = 0;
	let heartAudio;
	let whooshAudio;

	// Settings
	const settings = {
		particles: {
			length: 800,
			duration: 2.5,
			velocity: 120,
			effect: -0.75,
			size: 35
		}
	};

	// Point class
	class Point {
		constructor(x = 0, y = 0) {
			this.x = x;
			this.y = y;
		}
		clone() {
			return new Point(this.x, this.y);
		}
		length(len) {
			if (len === undefined) {
				return Math.sqrt(this.x * this.x + this.y * this.y);
			}
			this.normalize();
			this.x *= len;
			this.y *= len;
			return this;
		}
		normalize() {
			const len = this.length();
			if (len > 0) {
				this.x /= len;
				this.y /= len;
			}
			return this;
		}
	}

	// Particle class
	class Particle {
		constructor() {
			this.position = new Point();
			this.velocity = new Point();
			this.acceleration = new Point();
			this.age = 0;
			this.active = false;
		}
		initialize(x, y, dx, dy) {
			this.position.x = x;
			this.position.y = y;
			this.velocity.x = dx;
			this.velocity.y = dy;
			this.acceleration.x = dx * settings.particles.effect;
			this.acceleration.y = dy * settings.particles.effect;
			this.age = 0;
			this.active = true;
		}
		update(deltaTime) {
			if (!this.active) return;
			this.position.x += this.velocity.x * deltaTime;
			this.position.y += this.velocity.y * deltaTime;
			this.velocity.x += this.acceleration.x * deltaTime;
			this.velocity.y += this.acceleration.y * deltaTime;
			this.age += deltaTime;
			if (this.age >= settings.particles.duration) {
				this.active = false;
			}
		}
		draw(context, image) {
			if (!this.active) return;
			const ease = (t) => (--t) * t * t + 1;
			const size = image.width * ease(this.age / settings.particles.duration);
			context.globalAlpha = 1 - this.age / settings.particles.duration;
			context.drawImage(
				image,
				this.position.x - size / 2,
				this.position.y - size / 2,
				size,
				size
			);
		}
	}

	// Particle pool
	let particles = [];
	let particleIndex = 0;

	function initParticlePool() {
		particles = [];
		for (let i = 0; i < settings.particles.length; i++) {
			particles.push(new Particle());
		}
		particleIndex = 0;
	}

	function addParticle(x, y, dx, dy) {
		particles[particleIndex].initialize(x, y, dx, dy);
		particleIndex++;
		if (particleIndex >= particles.length) particleIndex = 0;
	}

	// Heart shape
	function pointOnHeart(t) {
		return new Point(
			160 * Math.pow(Math.sin(t), 3),
			130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
		);
	}

	// Create heart particle image
	let heartImage;
	function createHeartImage() {
		const size = settings.particles.size;
		const offCanvas = document.createElement('canvas');
		const offCtx = offCanvas.getContext('2d');
		offCanvas.width = size;
		offCanvas.height = size;

		function to(t) {
			const point = pointOnHeart(t);
			return new Point(
				size / 2 + (point.x * size) / 350,
				size / 2 - (point.y * size) / 350
			);
		}

		// Draw heart shape
		offCtx.beginPath();
		let t = -Math.PI;
		let point = to(t);
		offCtx.moveTo(point.x, point.y);
		while (t < Math.PI) {
			t += 0.01;
			point = to(t);
			offCtx.lineTo(point.x, point.y);
		}
		offCtx.closePath();

		// Gradient fill
		const gradient = offCtx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
		gradient.addColorStop(0, '#ff6b9d');
		gradient.addColorStop(0.5, '#ea80b0');
		gradient.addColorStop(1, '#c44569');
		offCtx.fillStyle = gradient;
		offCtx.shadowColor = '#ff6b9d';
		offCtx.shadowBlur = 10;
		offCtx.fill();

		heartImage = new Image();
		heartImage.src = offCanvas.toDataURL();
	}

	// Background + Mouse trail particles
	let mouseSprites = [];
	let backgroundSprites = [];
	// Brighter, more golden/warm colors with glow
	const PARTICLE_COLORS = [
		{ center: 'rgba(255,223,130,0.9)', mid: 'rgba(255,200,80,0.4)', edge: 'rgba(255,180,50,0)' },  // Golden
		{ center: 'rgba(255,180,220,0.85)', mid: 'rgba(255,130,180,0.35)', edge: 'rgba(255,100,150,0)' }, // Pink
		{ center: 'rgba(180,255,255,0.85)', mid: 'rgba(100,230,230,0.35)', edge: 'rgba(80,200,200,0)' },  // Cyan
		{ center: 'rgba(255,255,200,0.9)', mid: 'rgba(255,240,150,0.4)', edge: 'rgba(255,220,100,0)' },  // Light Yellow
		{ center: 'rgba(220,180,255,0.8)', mid: 'rgba(180,130,255,0.3)', edge: 'rgba(150,100,220,0)' }   // Lavender
	];

	function createGlowTexture(size, colorIdx) {
		const offCanvas = document.createElement('canvas');
		const offCtx = offCanvas.getContext('2d');
		offCanvas.width = size;
		offCanvas.height = size;
		
		const colors = PARTICLE_COLORS[colorIdx % PARTICLE_COLORS.length];
		const gradient = offCtx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
		gradient.addColorStop(0, colors.center);
		gradient.addColorStop(0.15, colors.mid);
		gradient.addColorStop(0.5, colors.edge);
		gradient.addColorStop(1, 'rgba(0,0,0,0)');
		
		offCtx.fillStyle = gradient;
		offCtx.fillRect(0, 0, size, size);
		return offCanvas;
	}

	// Create background particles spread across the screen
	function initBackgroundSprites() {
		backgroundSprites = [];
		const count = 80; // Number of background particles
		for (let i = 0; i < count; i++) {
			const size = 20 + Math.random() * 50;
			backgroundSprites.push({
				x: Math.random() * cvWidth,
				y: Math.random() * cvHeight,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				size,
				alpha: 0.3 + Math.random() * 0.5,
				texture: createGlowTexture(size, Math.floor(Math.random() * 5)),
				pulseSpeed: 0.5 + Math.random() * 1.5,
				pulseOffset: Math.random() * Math.PI * 2
			});
		}
	}

	function updateBackgroundSprites(dt, currentTime) {
		for (const s of backgroundSprites) {
			// Gentle floating movement
			s.x += s.vx;
			s.y += s.vy;
			
			// Wrap around edges
			if (s.x < -s.size) s.x = cvWidth + s.size;
			if (s.x > cvWidth + s.size) s.x = -s.size;
			if (s.y < -s.size) s.y = cvHeight + s.size;
			if (s.y > cvHeight + s.size) s.y = -s.size;
			
			// Pulsing alpha for glow effect
			s.alpha = 0.3 + 0.4 * Math.sin(currentTime * s.pulseSpeed + s.pulseOffset);
		}
	}

	function drawBackgroundSprites() {
		for (const s of backgroundSprites) {
			ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha * 0.6));
			ctx.drawImage(s.texture, s.x - s.size/2, s.y - s.size/2, s.size, s.size);
		}
	}

	function addMouseSprite(x, y) {
		const size = 25 + Math.random() * 45;
		const angle = Math.random() * Math.PI * 2;
		const speed = 0.8 + Math.random() * 2.5;
		mouseSprites.push({
			x, y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			size,
			alpha: 1,
			texture: createGlowTexture(size, Math.floor(Math.random() * 5)),
			life: 1.5 + Math.random() * 1.5
		});
		// Limit
		while (mouseSprites.length > 200) mouseSprites.shift();
	}

	function updateMouseSprites(dt) {
		for (let i = mouseSprites.length - 1; i >= 0; i--) {
			const s = mouseSprites[i];
			s.x += s.vx;
			s.y += s.vy;
			s.vy += 0.02;
			s.life -= dt;
			s.alpha = Math.max(0, s.life);
			if (s.life <= 0) mouseSprites.splice(i, 1);
		}
	}

	function drawMouseSprites() {
		for (const s of mouseSprites) {
			ctx.globalAlpha = s.alpha * 0.8;
			ctx.drawImage(s.texture, s.x - s.size/2, s.y - s.size/2, s.size, s.size);
		}
	}

	// Heart animation
	let heartAnimationTime = 0;
	const HEART_DURATION = 2.5; // Reduced to ~3 seconds total with fade
	let isHeartFadingOut = false;

	function renderHeartAnimation(deltaTime) {
		if (!heartImage || !heartImage.complete) return;

		heartAnimationTime += deltaTime;
		const particleRate = settings.particles.length / settings.particles.duration;
		const amount = particleRate * deltaTime;

		// Add new particles from heart edge
		for (let i = 0; i < amount; i++) {
			const t = Math.PI - 2 * Math.PI * Math.random();
			const pos = pointOnHeart(t);
			const dir = pos.clone().length(settings.particles.velocity);
			addParticle(
				cvWidth / 2 + pos.x,
				cvHeight / 2 - pos.y,
				dir.x,
				-dir.y
			);
		}

		// Update and draw particles
		for (const p of particles) {
			p.update(deltaTime);
			p.draw(ctx, heartImage);
		}

		// After duration, stop adding new particles but let existing ones fade out
		if (heartAnimationTime >= HEART_DURATION && !isHeartFadingOut) {
			isHeartFadingOut = true;
			// Wait for particles to fully fade out before resetting
			setTimeout(() => {
				isHeartAnimating = false;
				isHeartFadingOut = false;
				heartAnimationTime = 0;
				initParticlePool();
			}, 1500);
		}
	}
	
	// Continue rendering fading particles
	function renderFadingParticles(deltaTime) {
		if (!heartImage || !heartImage.complete) return;
		for (const p of particles) {
			p.update(deltaTime);
			p.draw(ctx, heartImage);
		}
	}

	function resizeCanvas() {
		if (!canvas || !canvas.parentElement) return;
		cvWidth = canvas.parentElement.clientWidth;
		cvHeight = canvas.parentElement.clientHeight;
		canvas.width = cvWidth;
		canvas.height = cvHeight;
	}

	function render() {
		if (!ctx) {
			animationId = requestAnimationFrame(render);
			return;
		}

		const now = Date.now() / 1000;
		const deltaTime = time ? now - time : 0.016;
		time = now;

		ctx.clearRect(0, 0, cvWidth, cvHeight);

		// Draw background particles (always visible)
		updateBackgroundSprites(deltaTime, now);
		drawBackgroundSprites();

		// Draw mouse trail
		updateMouseSprites(deltaTime);
		drawMouseSprites();

		// Draw heart animation if active or fading out
		if (isHeartAnimating || isHeartFadingOut) {
			if (isHeartFadingOut && !isHeartAnimating) {
				renderFadingParticles(deltaTime);
			} else {
				renderHeartAnimation(deltaTime);
			}
		}

		ctx.globalAlpha = 1;
		animationId = requestAnimationFrame(render);
	}

	function handleMouseMove(e) {
		if (isHeartAnimating || !canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		// Only add particles if mouse is over the canvas area
		if (x >= 0 && x <= cvWidth && y >= 0 && y <= cvHeight) {
			for (let i = 0; i < 2; i++) {
				addMouseSprite(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
			}
		}
	}

	function handleKeyClick(e) {
		// Only trigger on Ctrl+Click, don't prevent default
		if (e.ctrlKey && !isHeartAnimating) {
			triggerHeartAnimation();
		}
		// Don't prevent default - let map handle clicks
	}

	function triggerHeartAnimation() {
		if (isHeartAnimating) return;
		isHeartAnimating = true;
		heartAnimationTime = 0;
		initParticlePool();

		// Play both sounds - reset and play fresh each time
		try {
			if (heartAudio) {
				heartAudio.pause();
				heartAudio.currentTime = 0;
				heartAudio.play().catch(() => {});
			}
			if (whooshAudio) {
				whooshAudio.pause();
				whooshAudio.currentTime = 0;
				whooshAudio.play().catch(() => {});
			}
			// Stop sounds after 3 seconds
			setTimeout(() => {
				try {
					if (heartAudio) {
						heartAudio.pause();
						heartAudio.currentTime = 0;
					}
					if (whooshAudio) {
						whooshAudio.pause();
						whooshAudio.currentTime = 0;
					}
				} catch (e) { /* ignore */ }
			}, 3000);
		} catch (e) { /* ignore */ }
	}

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext('2d');
		resizeCanvas();
		createHeartImage();
		initParticlePool();
		initBackgroundSprites();

		// Create audio elements (optional - won't break if files missing)
		try {
			heartAudio = new Audio('/sounds/heartbeat.mp3');
			heartAudio.volume = 0.6;
			heartAudio.load();
			
			whooshAudio = new Audio('/sounds/whoosh.mp3');
			whooshAudio.volume = 0.5;
			whooshAudio.load();
		} catch (e) {
			console.log('Sound files not available');
		}

		window.addEventListener('resize', resizeCanvas);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('click', handleKeyClick);

		render();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('click', handleKeyClick);
		};
	});

	onDestroy(() => {
		if (animationId) cancelAnimationFrame(animationId);
	});
</script>

<canvas
	bind:this={canvas}
	class="absolute inset-0 pointer-events-none"
	style="z-index: 2;"
></canvas>
