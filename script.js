// Intro Sequence Animation
const introSequence = document.getElementById('intro-sequence');
const mainContent = document.getElementById('main-content');
const skipBtn = document.getElementById('skip-intro');
const introTrigger = document.getElementById('intro-trigger');
let introTimeouts = [];

// Define all 12 sequence steps
const introTexts = [
    { id: 'intro-text-1',  duration: 2500 },
    { id: 'intro-text-2',  duration: 3000 },
    { id: 'intro-text-3',  duration: 5000 },
    { id: 'intro-text-4',  duration: 2000 },
    { id: 'intro-text-5',  duration: 3200 },
    { id: 'intro-text-6',  duration: 3500 },
    { id: 'intro-text-7',  duration: 3500 },
    { id: 'intro-text-cake', duration: 4500 },
    { id: 'intro-text-8',  duration: 3000 },
    { id: 'intro-text-9',  duration: 2000 },
    { id: 'intro-text-10', duration: 3500 },
    { id: 'intro-text-11', duration: 3500 },
    { id: 'intro-text-12', duration: 4500 }
];

// Spawn floating heart particles
function spawnParticles(count = 8) {
    const container = document.getElementById('intro-particles');
    if (!container) return;
    const symbols = ['💛', '✨', '✦', '💝', '⭐', '🌟', '💫', '🔥'];
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'intro-particle';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        const x = Math.random() * 100;
        const dx = (Math.random() - 0.5) * 200;
        const dur = 3 + Math.random() * 3;
        const del = Math.random() * 1.5;
        p.style.cssText = `left:${x}%;--dx:${dx}px;--dur:${dur}s;--del:${del}s;font-size:${0.8 + Math.random()}rem;`;
        container.appendChild(p);
        setTimeout(() => p.remove(), (dur + del + 0.5) * 1000);
    }
}

// Initialize sequence
function startIntro() {
    if (!introSequence) return;

    // Lock scrolling
    document.body.style.overflow = 'hidden';

    // Start particles
    spawnParticles(12);
    const particleInterval = setInterval(() => spawnParticles(4), 2500);
    introTimeouts.push({ type: 'interval', ref: particleInterval });

    let currentDelay = 500;

    introTexts.forEach((text, index) => {
        // Show panel
        const t1 = setTimeout(() => {
            const el = document.getElementById(text.id);
            if (!el) return;
            el.style.opacity = '1';
            el.classList.remove('panel-exit');
            el.classList.add('panel-active');
        }, currentDelay);
        introTimeouts.push({ type: 'timeout', ref: t1 });

        // Exit panel (600ms before next panel arrives)
        const exitDelay = currentDelay + text.duration;
        const t2 = setTimeout(() => {
            const el = document.getElementById(text.id);
            if (!el) return;
            el.classList.remove('panel-active');
            el.classList.add('panel-exit');
            setTimeout(() => { if (el) el.style.opacity = '0'; }, 600);

            // Spawn extra particles on birthday panel
            if (text.id === 'intro-text-5') spawnParticles(20);
        }, exitDelay);
        introTimeouts.push({ type: 'timeout', ref: t2 });

        currentDelay += text.duration + 600;
    });

    // End intro
    const tEnd = setTimeout(() => {
        clearInterval(particleInterval);
        finishIntro();
    }, currentDelay);
    introTimeouts.push({ type: 'timeout', ref: tEnd });
}

function finishIntro() {
    if (introSequence) {
        // Stop intro music
        const introAudio = document.getElementById('intro-audio');
        if (introAudio) {
            // Fade out
            const fadeInterval = setInterval(() => {
                if (introAudio.volume > 0.1) {
                    introAudio.volume -= 0.1;
                } else {
                    introAudio.pause();
                    introAudio.currentTime = 0;
                    clearInterval(fadeInterval);
                }
            }, 100);
        }

        introSequence.classList.add('intro-finishing');
        setTimeout(() => {
            introSequence.style.display = 'none';
            if (mainContent) {
                mainContent.style.opacity = '1';
                document.body.style.overflow = 'auto';
            }
        }, 1200);
    }
}

function skipIntro() {
    // Clear all scheduled timeouts and intervals
    introTimeouts.forEach(item => {
        if (item && typeof item === 'object') {
            if (item.type === 'interval') clearInterval(item.ref);
            else clearTimeout(item.ref);
        } else {
            clearTimeout(item);
        }
    });
    introTimeouts = [];

    if (introSequence) {
        // Stop intro music immediately on skip
        const introAudio = document.getElementById('intro-audio');
        if (introAudio) {
            introAudio.pause();
            introAudio.currentTime = 0;
        }

        introSequence.classList.add('intro-finishing');
        setTimeout(() => {
            introSequence.style.display = 'none';
            if (mainContent) {
                mainContent.style.opacity = '1';
                document.body.style.overflow = 'auto';
            }
        }, 800);
    }
}

// Event Listeners
if (skipBtn) {
    skipBtn.addEventListener('click', skipIntro);
}

if (introTrigger) {
    introTrigger.addEventListener('click', () => {
        console.log("Intro trigger clicked");
        // Play intro music on tap
        const introAudio = document.getElementById('intro-audio');
        if (introAudio) {
            console.log("Intro audio element found, attempting to play...");
            introAudio.volume = 1;
            introAudio.play()
                .then(() => console.log("Intro music playing successfully"))
                .catch(e => console.error("Intro music play failed:", e));
        } else {
            console.error("Intro audio element NOT found!");
        }

        // Burst particles on tap
        spawnParticles(25);
        const heart = introTrigger.querySelector('.intro-hero-heart');
        if (heart) {
            heart.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
            heart.style.transform = 'scale(2)';
        }
        introTrigger.style.transition = 'opacity 0.6s ease';
        introTrigger.style.opacity = '0';
        introTrigger.style.pointerEvents = 'none';
        setTimeout(() => {
            introTrigger.style.display = 'none';
            startIntro();
        }, 600);
    });
}

// Generate starry background
function createStars() {
    const container = document.querySelector('.stars-container');
    if (!container) return;

    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // Random size (0.5px to 2px)
        const size = 0.5 + Math.random() * 1.5;

        // Random duration and delay
        const duration = 2 + Math.random() * 4;
        const delay = Math.random() * 5;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--delay', `${delay}s`);

        container.appendChild(star);
    }
}

createStars();


// Scroll to surprise function
function scrollToSurprise() {
    const surprise = document.getElementById('surprise');
    const confetti = document.getElementById('confetti');

    // Toggle surprise section visibility
    if (surprise.classList.contains('hidden')) {
        // Show surprise
        surprise.classList.remove('hidden');
        surprise.classList.add('flex');

        // Show confetti
        if (confetti) confetti.classList.remove('hidden');

        // Scroll to surprise section
        setTimeout(() => {
            surprise.scrollIntoView({ behavior: 'smooth' });
        }, 100);

    } else {
        // Hide surprise
        surprise.classList.add('hidden');
        surprise.classList.remove('flex');
    }
}

// Add sparkle effect on touch/click - but NOT on heart cards or interactive elements
document.addEventListener('click', (e) => {
    // Don't add sparkles if clicking on heart cards or other interactive elements
    const isHeartCard = e.target.closest('.heart-card');
    const isButton = e.target.closest('button');
    const isGiftBox = e.target.closest('.gift-box-container');

    if (!isHeartCard && !isButton && !isGiftBox) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = e.pageX + 'px';
        sparkle.style.top = e.pageY + 'px';
        sparkle.innerHTML = '✨';
        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
});

// Gift Box Opening Function
function openGiftBox() {
    const giftMessage = document.getElementById('gift-message');
    const giftBox = document.querySelector('.gift-box-container');

    if (giftMessage && giftBox) {
        // Hide the gift box
        giftBox.style.display = 'none';

        // Show the message with animation
        giftMessage.classList.remove('hidden');

        // Add confetti effect
        const confetti = document.getElementById('confetti');
        if (confetti) {
            confetti.classList.remove('hidden');
            setTimeout(() => {
                confetti.classList.add('hidden');
            }, 5000);
        }
    }
}

// Countdown Timer - Calculate time together
// Relationship started: September 3, 2024
const relationshipStart = new Date(2024, 8, 3); // September 3, 2024 (month is 0-indexed)

function updateCountdown() {
    const now = new Date();
    const diff = now - relationshipStart;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor(diff / 1000);

    const daysEl = document.getElementById('days-count');
    const hoursEl = document.getElementById('hours-count');
    const minutesEl = document.getElementById('minutes-count');
    const secondsEl = document.getElementById('seconds-count');

    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    }

    if (daysEl) daysEl.textContent = formatNumber(days);
    if (hoursEl) hoursEl.textContent = formatNumber(hours);
    if (minutesEl) minutesEl.textContent = formatNumber(minutes);
    if (secondsEl) secondsEl.textContent = formatNumber(seconds);
}

// Interactive Quiz - REMOVED

// Spin the Heart Game
const heartMessages = [
    "You're the most beautiful person I've ever met! 😍",
    "Every moment with you is a treasure! 💎",
    "You make my heart skip a beat! 💓",
    "I fall in love with you more every day! 🌹",
    "You're my dream come true! ✨",
    "Your smile lights up my world! ☀️",
    "I'm so lucky to have you! 🍀",
    "You're absolutely perfect to me! 💝",
    "My love for you is infinite! ♾️",
    "You're my everything! 💕",
    "I can't imagine life without you! 🌟",
    "You're the best thing that ever happened to me! 🎁",
    "My soul chose you, and I'll keep choosing you forever! 💍",
    "You are my favorite person to annoy and to love! 🥰",
    "In your arms is my favorite place in the world! 🏡",
    "You're the peace I found in a chaotic world! 🕊️",
    "Your happiness is my priority, always! 💖",
    "I love you more than words could ever describe! 📜",
    "You are the queen of my heart, today and always! 👑",
    "Thank you for being the highlight of my every day! ⭐",
    "You deserve all the happiness in the world, my love! 🌎",
    "I'm proud to be yours and to have you as mine! 👩‍❤️‍👨",
    "Life is better with you by my side! 🌈",
    "You are my sun, my moon, and all my stars! 🌌"
];

let isSpinning = false;

function spinHeart() {
    if (isSpinning) return;

    isSpinning = true;
    const heart = document.getElementById('spin-heart');
    const messageDiv = document.getElementById('heart-message');

    // Add spinning animation
    heart.style.transform = 'rotate(720deg) scale(1.2)';

    setTimeout(() => {
        // Reset rotation and pick random message
        heart.style.transform = 'rotate(0deg) scale(1)';
        const randomMessage = heartMessages[Math.floor(Math.random() * heartMessages.length)];

        messageDiv.innerHTML = `<p class="text-2xl font-bold text-amber-400 animate-fade-in">${randomMessage}</p>`;

        isSpinning = false;
    }, 1000);
}

// Anniversary Countdown
const weddingDate = new Date(2025, 2, 7); // March 7, 2025

function getNextAnniversary() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Try this year's anniversary
    let nextAnniversary = new Date(currentYear, weddingDate.getMonth(), weddingDate.getDate());

    // If this year's anniversary has passed, use next year
    if (nextAnniversary < now) {
        nextAnniversary = new Date(currentYear + 1, weddingDate.getMonth(), weddingDate.getDate());
    }

    return nextAnniversary;
}

function updateAnniversaryCountdown() {
    const now = new Date();
    const nextAnniversary = getNextAnniversary();
    const diff = nextAnniversary - now;

    // Calculate progress percentage
    const yearStart = new Date(nextAnniversary.getFullYear() - 1, weddingDate.getMonth(), weddingDate.getDate());
    const totalYear = nextAnniversary - yearStart;
    const elapsed = now - yearStart;
    const progress = Math.min(100, Math.max(0, (elapsed / totalYear) * 100));

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('anni-days');
    const hoursEl = document.getElementById('anni-hours');
    const minutesEl = document.getElementById('anni-minutes');
    const secondsEl = document.getElementById('anni-seconds');
    const progressEl = document.getElementById('anni-progress-bar');
    const progressTextEl = document.getElementById('anni-progress-percent');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
    
    if (progressEl) progressEl.style.width = `${progress}%`;
    if (progressTextEl) progressTextEl.textContent = `${progress.toFixed(1)}% Completed`;
}

// Virtual Hug Function
let hugCount = 0;
const hugMessages = [
    "🤗 Sending you the warmest hug! 💕",
    "🫂 Here's a big virtual hug just for you! ✨",
    "💝 Wrapped in love and hugs! 🌟",
    "🤗 A tight squeeze from me to you! 💖",
    "🫂 Hugging you through the screen! 💕",
    "💝 You're getting all my love in this hug! ✨",
    "🤗 The biggest hug for the best person! 💖",
    "🫂 Sending endless hugs your way! 💕",
    "🧸 A cozy bear hug from your partner! ❤️",
    "🦋 A hug that makes your heart flutter! ✨"
];

function spawnFloatingHearts(x, y) {
    const symbols = ['💖', '💝', '💕', '💗', '💓', '✨', '🫂'];
    for (let i = 0; i < 12; i++) {
        const span = document.createElement('span');
        span.className = 'floating-heart-particle fixed pointer-events-none z-[100] text-2xl';
        span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Random drift
        const dx = (Math.random() - 0.5) * 300;
        const dy = -200 - Math.random() * 200;
        const duration = 1.5 + Math.random() * 1;
        
        span.style.left = x + 'px';
        span.style.top = y + 'px';
        span.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}s ease-out`;
        
        document.body.appendChild(span);
        
        // Use requestAnimationFrame for smooth start
        requestAnimationFrame(() => {
            span.style.transform = `translate(${dx}px, ${dy}px) scale(${1.5 + Math.random()}) rotate(${(Math.random() - 0.5) * 180}deg)`;
            span.style.opacity = '0';
        });
        
        setTimeout(() => span.remove(), duration * 1000);
    }
}

function sendVirtualHug(event) {
    const hugEmoji = document.getElementById('hug-emoji');
    const hugMessage = document.getElementById('hug-message');
    const hugCountEl = document.getElementById('hug-count');
    const warmthBar = document.getElementById('warmth-bar');
    const warmthText = document.getElementById('warmth-percent');

    // Increment counter
    hugCount++;
    if (hugCountEl) hugCountEl.textContent = hugCount;

    // Warmth logic (gamification)
    const warmth = Math.min(100, hugCount * 5); // 5% per hug
    if (warmthBar) warmthBar.style.width = `${warmth}%`;
    if (warmthText) warmthText.textContent = `${warmth}% Warmth`;

    // Visual heart burst from click position
    if (event) {
        spawnFloatingHearts(event.clientX, event.clientY);
    } else {
        const rect = hugEmoji.getBoundingClientRect();
        spawnFloatingHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // Animate emoji
    hugEmoji.style.transform = 'scale(1.5) rotate(360deg)';
    setTimeout(() => {
        hugEmoji.style.transform = 'scale(1) rotate(0deg)';
    }, 500);

    // milestone Check: 100% Warmth
    if (warmth >= 100) {
        triggerGrandHugCelebration();
        return; // Stop normal greeting if grand celebration triggers
    }

    // Normal Show random message
    const randomMessage = hugMessages[Math.floor(Math.random() * hugMessages.length)];
    hugMessage.innerHTML = `<p class="text-3xl font-bold text-amber-400 font-dancing animate-pop-in">${randomMessage}</p>`;

    // Special milestone effects (every 10 hugs)
    if (hugCount % 10 === 0 && warmth < 100) {
        createConfetti();
        hugMessage.innerHTML = `<p class="text-4xl font-bold text-amber-400 font-dancing animate-pop-in">WOW! SUPER HUG BURST! 💖🌟💖</p>`;
    }
}

function triggerGrandHugCelebration() {
    const hugMessage = document.getElementById('hug-message');
    const hugSection = document.getElementById('section-hug');
    const rewardNote = document.getElementById('hug-reward-note');

    // 1. Massive Confetti
    for (let i = 0; i < 6; i++) {
        setTimeout(createConfetti, i * 300);
    }

    // 2. Change UI
    hugMessage.innerHTML = `<p class="text-5xl font-bold text-pink-400 font-dancing animate-bounce">♾️ INFINITY WARMTH REACHED! ♾️</p>`;
    
    if (rewardNote) {
        rewardNote.classList.remove('hidden');
        rewardNote.classList.add('animate-pop-in');
    }

    // 3. Visual "Love Wave"
    hugSection.style.transition = 'background-color 1s ease';
    hugSection.style.backgroundColor = 'rgba(244, 63, 94, 0.15)';
    setTimeout(() => {
        hugSection.style.backgroundColor = '';
    }, 2000);
}

// Next Birthday Countdown
// Mitisa's birthday is February 25
const birthdayMonth = 1; // February (0-indexed, so 1 = February)
const birthdayDay = 25;

function getNextBirthday() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Try this year's birthday
    let nextBirthday = new Date(currentYear, birthdayMonth, birthdayDay);

    // If this year's birthday has passed, use next year
    if (nextBirthday < now) {
        nextBirthday = new Date(currentYear + 1, birthdayMonth, birthdayDay);
    }

    return nextBirthday;
}

function updateNextBirthdayCountdown() {
    const now = new Date();
    const nextBirthday = getNextBirthday();
    const diff = nextBirthday - now;

    // Calculate progress percentage
    const yearStart = new Date(nextBirthday.getFullYear() - 1, birthdayMonth, birthdayDay);
    const totalYear = nextBirthday - yearStart;
    const elapsed = now - yearStart;
    const progress = Math.min(100, Math.max(0, (elapsed / totalYear) * 100));

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('next-bday-days');
    const hoursEl = document.getElementById('next-bday-hours');
    const minutesEl = document.getElementById('next-bday-minutes');
    const secondsEl = document.getElementById('next-bday-seconds');
    const progressEl = document.getElementById('bday-progress-bar');
    const progressTextEl = document.getElementById('bday-progress-percent');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;

    if (progressEl) progressEl.style.width = `${progress}%`;
    if (progressTextEl) progressTextEl.textContent = `${progress.toFixed(1)}% Completed`;
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        initScrollReveal();
        updateCountdown();
        setInterval(updateCountdown, 1000); // Update every second

        updateAnniversaryCountdown();
        setInterval(updateAnniversaryCountdown, 1000); // Update every second

        updateNextBirthdayCountdown();
        setInterval(updateNextBirthdayCountdown, 1000); // Update every second
    });
} else {
    initScrollReveal();
    updateCountdown();
    setInterval(updateCountdown, 1000);

    updateAnniversaryCountdown();
    setInterval(updateAnniversaryCountdown, 1000);

    updateNextBirthdayCountdown();
    setInterval(updateNextBirthdayCountdown, 1000);
}

// Custom Scroll-Reveal Animation System
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}


// Navigation Header Scroll Effect
const navHeader = document.querySelector('.nav-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navHeader?.classList.add('scrolled');
    } else {
        navHeader?.classList.remove('scrolled');
    }
});

// Navigation Menu Toggle (Updated for Top Header)
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navText = document.getElementById('nav-text');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.add('hidden');
            navToggle.classList.remove('active');
        });
    });
}

// Music Player Logic (Local Audio)
const audio = document.getElementById('local-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const musicDisc = document.getElementById('music-disc');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');

if (audio && playPauseBtn) {
    // Play/Pause Toggle
    const toggleAudio = () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    };

    playPauseBtn.addEventListener('click', toggleAudio);
    if (musicDisc) musicDisc.addEventListener('click', toggleAudio);

    // Update UI on Play
    audio.addEventListener('play', () => {
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');

        if (musicDisc) {
            musicDisc.classList.add('animate-disc-spin');
            musicDisc.classList.remove('pause-animation');
        }
    });

    // Update UI on Pause
    audio.addEventListener('pause', () => {
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');

        if (musicDisc) {
            musicDisc.classList.add('pause-animation');
        }
    });

    // Update Progress Bar
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            if (progressBar) progressBar.style.width = `${progressPercent}%`;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    // Set Total Time when metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
    });

    // Progress bar click to seek
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const percentage = x / width;
            audio.currentTime = audio.duration * percentage;
        });
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}



// Scratch-off Effect Implementation
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Fill with gold/lava color
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE ✨', width / 2, height / 2 + 8);

    let isDrawing = false;

    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = (e.clientX !== undefined) ? e.clientX : (e.touches ? e.touches[0].clientX : 0);
        const clientY = (e.clientY !== undefined) ? e.clientY : (e.touches ? e.touches[0].clientY : 0);

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; e.preventDefault(); }, { passive: false });
    window.addEventListener('mouseup', () => isDrawing = false);
    window.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', (e) => { scratch(e); e.preventDefault(); }, { passive: false });
}

// Call init on load
window.addEventListener('load', initScratchCard);

// Love Wheel Logic
const reasons = [
    "I Adore your magical Hasi..!! 😊",
    "I Adore the Maya in your eyes..!! ✨",
    "I Like our Bhalobasha, it's my home..!! ❤️",
    "I Like your Spondon, the way you exist in me..!! 💓",
    "I Adore the Sukh, the peace in your presence..!! 🕊️",
    "I Like our beautiful Shopno, our shared dreams..!! 🌟",
    "I Adore Everything, because love needs no reason..!! ♾️"
];

let isWheelSpinning = false;
function spinLoveWheel() {
    if (isWheelSpinning) return;
    isWheelSpinning = true;

    const wheel = document.getElementById('love-wheel');
    const resultDiv = document.getElementById('wheel-result');
    const resultText = document.getElementById('wheel-text');
    const pointer = document.querySelector('.wheel-pointer');

    if (pointer) pointer.classList.add('pointer-wiggle');

    const randomRotation = Math.floor(1800 + Math.random() * 1800);
    wheel.style.transform = `rotate(${randomRotation}deg)`;

    setTimeout(() => {
        if (pointer) pointer.classList.remove('pointer-wiggle');
        isWheelSpinning = false;
        
        // Calculate the index based on the final rotation
        // The pointer is at the top (270 degrees)
        // Angle of segment i starts at initial_offset = 0
        const segmentAngle = 360 / reasons.length;
        const actualRotation = randomRotation % 360;
        
        // Final index calculation
        // Index i is at angle: (i * segmentAngle + segmentAngle / 2)
        // After rotation Rot, it is at: (i * segmentAngle + segmentAngle / 2 + Rot) % 360
        // We want this value to be approx 270
        let winningIndex = Math.floor(((270 - actualRotation + 360) % 360) / segmentAngle);
        
        resultText.textContent = reasons[winningIndex];
        resultDiv.classList.remove('hidden');
        createConfetti();
    }, 4100);
}

// Cake Cutting Logic
let isCakeCut = false;
function cutCake() {
    if (isCakeCut) return;
    const cake = document.getElementById('birthday-cake');
    const reveal = document.getElementById('cake-reveal');
    const flame = cake.querySelector('.flame');

    cake.classList.add('cut');
    if (flame) flame.classList.add('hidden');

    setTimeout(() => {
        isCakeCut = true;
        reveal.classList.remove('hidden');
        createConfetti();
        for (let i = 0; i < 5; i++) {
            setTimeout(createConfetti, i * 300);
        }
    }, 500);
}

// Sealed Letter reveal
function openSealedLetter() {
    const envelope = document.getElementById('sealed-envelope');
    const letter = document.getElementById('opened-letter');
    if (!envelope || !letter) return;

    // Animate envelope away
    envelope.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    envelope.style.opacity = '0';
    envelope.style.transform = 'scale(0.85) translateY(20px)';

    setTimeout(() => {
        envelope.classList.add('hidden');
        letter.classList.remove('hidden');
        // Trigger confetti burst
        createConfetti();
        for (let i = 0; i < 4; i++) {
            setTimeout(createConfetti, i * 250);
        }
    }, 500);
}

// Rose Bloom Interaction Logic
const rosePatternI = [
    // === SERIF "I" ===
    { x: 42, y: 35 }, { x: 46, y: 35 }, { x: 50, y: 35 }, { x: 54, y: 35 }, { x: 58, y: 35 }, 
    { x: 50, y: 40 }, { x: 50, y: 45 }, { x: 50, y: 50 }, { x: 50, y: 55 },
    { x: 42, y: 60 }, { x: 46, y: 60 }, { x: 50, y: 60 }, { x: 54, y: 60 }, { x: 58, y: 60 }
];

const rosePatternHeart = [
    // === ELEGANT HEART ===
    { x: 50, y: 45 }, 
    { x: 42, y: 40 }, { x: 32, y: 40 }, { x: 22, y: 48 }, { x: 22, y: 58 }, { x: 32, y: 68 }, { x: 42, y: 76 },
    { x: 50, y: 84 },
    { x: 58, y: 76 }, { x: 68, y: 68 }, { x: 78, y: 58 }, { x: 78, y: 48 }, { x: 68, y: 40 }, { x: 58, y: 40 }
];

const rosePatternU = [
    // === STYLISH "U" ===
    { x: 30, y: 35 }, { x: 30, y: 50 },
    { x: 35, y: 65 }, { x: 42, y: 75 }, { x: 50, y: 80 }, { x: 58, y: 75 }, { x: 65, y: 65 },
    { x: 70, y: 50 }, { x: 70, y: 35 }
];

let currentRoseIndex = 0;
let currentStage = 0; // 0: I, 1: Heart, 2: U
const roseTrigger = document.getElementById('rose-trigger');
const roseContainer = document.getElementById('rose-pattern-container');
const roseFinalMessage = document.getElementById('rose-final-message');

if (roseTrigger && roseContainer) {
    roseTrigger.addEventListener('click', () => {
        let pattern = [];
        if (currentStage === 0) pattern = rosePatternI;
        else if (currentStage === 1) pattern = rosePatternHeart;
        else if (currentStage === 2) pattern = rosePatternU;

        if (currentRoseIndex < pattern.length) {
            bloomRose(pattern[currentRoseIndex]);
            currentRoseIndex++;

            // Pop effect on trigger
            roseTrigger.style.transform = 'scale(0.8)';
            setTimeout(() => roseTrigger.style.transform = 'scale(1)', 100);

            // If this stage is complete
            if (currentRoseIndex === pattern.length) {
                if (currentStage < 2) {
                    // Transition to next stage
                    setTimeout(() => {
                        roseContainer.style.opacity = '0';
                        roseContainer.style.transition = 'opacity 0.8s ease';
                        setTimeout(() => {
                            roseContainer.innerHTML = '';
                            roseContainer.style.opacity = '1';
                            currentStage++;
                            currentRoseIndex = 0;
                            createConfetti();
                        }, 800);
                    }, 1200);
                } else {
                    // Final reveal: fade out "U" and show text
                    setTimeout(() => {
                        roseContainer.style.opacity = '0';
                        roseContainer.style.transition = 'opacity 0.8s ease';
                        setTimeout(() => {
                            roseContainer.innerHTML = '';
                            if (roseFinalMessage) roseFinalMessage.classList.remove('hidden');
                            createConfetti();
                            for (let i = 0; i < 5; i++) {
                                setTimeout(createConfetti, i * 300);
                            }
                        }, 800);
                    }, 1200);
                }
            }
        }
    });
}

function bloomRose(pos) {
    const rose = document.createElement('div');
    rose.className = 'absolute';
    // Position using percentages based on the pattern
    rose.style.left = `${pos.x}%`;
    rose.style.top = `${pos.y}%`;
    rose.style.transform = 'translate(-50%, -50%)';

    rose.innerHTML = `
        <div class="rose-bloom-container">
            <div class="rose-glow"></div>
            <div class="rose-center"></div>
            <div class="rose-petal-container">
                <div class="rose-petal"></div>
                <div class="rose-petal"></div>
                <div class="rose-petal"></div>
                <div class="rose-petal"></div>
                <div class="rose-petal"></div>
                <div class="rose-petal"></div>
                <div class="rose-petal"></div>
                <div class="rose-petal"></div>
            </div>
        </div>
    `;

    roseContainer.appendChild(rose);
}

// === BALLOON SKY LOGIC ===
const balloonSky = document.getElementById('balloon-sky');
const wishesCountDisplay = document.getElementById('wishes-count');
let totalWishesRevealed = 0;

const balloonWishes = [
    "Always Smile 😊", "Stay Beautiful 👑", "Endless Joy ✨", "Pure Love ❤️",
    "Dream Big 🌟", "Forever Mine 💍", "Sweetest Soul 🍬", "My Everything 🌎",
    "Radiant Queen 👸", "Heart of Gold 💛", "You're Magic 🪄", "Truly Special 💎",
    "Stay Childish 🧸", "Sweetest Bacchami 🧸"
];

const balloonColors = ['#dc2626', '#db2777', '#d97706', '#9333ea', '#4f46e5', '#ca8a04'];

if (balloonSky) {
    balloonSky.addEventListener('click', (e) => {
        // Only spawn if clicking the sky directly, not an existing balloon
        if (e.target.id === 'balloon-sky' || e.target.closest('#balloon-sky')) {
            const rect = balloonSky.getBoundingClientRect();
            // Clamp x to keep balloons inside the sky (60px width for balloon)
            let x = e.clientX - rect.left;
            x = Math.max(30, Math.min(rect.width - 30, x));
            createBalloon(x);
        }
    });
}

function createBalloon(x) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon-wrapper';

    // Initial position
    balloon.style.left = `${x}px`;
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];

    balloon.innerHTML = `
        <div class="balloon-base" style="--bg-color: ${color}">
            <div class="balloon-string"></div>
        </div>
    `;

    balloonSky.appendChild(balloon);

    // Animate upward
    const duration = 3000 + Math.random() * 2000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            const y = progress * (balloonSky.offsetHeight + 200);
            balloon.style.bottom = `${y - 100}px`;
            // Slight horizontal sway
            const sway = Math.sin(progress * 10) * 20;
            balloon.style.transform = `translateX(${sway}px)`;
            requestAnimationFrame(animate);
        } else {
            if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
        }
    }
    requestAnimationFrame(animate);

    // Click to pop
    balloon.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        popBalloon(balloon, color);
    });
}

function popBalloon(balloon, color) {
    const rect = balloon.getBoundingClientRect();
    const skyRect = balloonSky.getBoundingClientRect();
    const x = rect.left - skyRect.left + rect.width / 2;
    const y = rect.top - skyRect.top + rect.height / 2;

    // Create Pop Text (Wish)
    const wishText = balloonWishes[Math.floor(Math.random() * balloonWishes.length)];
    const textEl = document.createElement('div');
    textEl.className = 'balloon-pop-text';
    textEl.textContent = wishText;
    textEl.style.left = `${x}px`;
    textEl.style.top = `${y}px`;
    textEl.style.transform = 'translate(-50%, -50%)';
    balloonSky.appendChild(textEl);

    // Update Counter
    totalWishesRevealed++;
    if (wishesCountDisplay) wishesCountDisplay.textContent = totalWishesRevealed;

    // Create Confetti
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'balloon-confetti';
        confetti.style.backgroundColor = color;
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;

        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        confetti.style.setProperty('--tx', `${tx}px`);
        confetti.style.setProperty('--ty', `${ty}px`);

        balloonSky.appendChild(confetti);
        setTimeout(() => confetti.remove(), 800);
    }

    // Remove balloon
    balloon.remove();
    setTimeout(() => textEl.remove(), 2000);
}

// === APOLOGY LETTER LOGIC ===
const apologyMessages = [
    "I am sorry for every time I made you sad. 🥀",
    "I'm sorry for the times I wasn't patient enough. 😔",
    "I'm sorry for any word that ever hurt your beautiful heart. 💔",
    "I'm sorry if I ever made you feel anything less than perfect. 👑",
    "I'm sorry for the mistakes I've made, big and small. 🥺",
    "But most of all, I'm sorry that I'm not always the man you deserve. 💛",
    "I promise to try harder. To love you better. To be your peace. ✨",
    "You are the best thing in my life, and I never want to lose you. ♾️"
];

let currentApologyIndex = 0;
const apologyLetter = document.getElementById('apology-letter');
const apologyMessage = document.getElementById('apology-message');
const apologyFinalAction = document.getElementById('apology-final-action');
const forgiveYes = document.getElementById('forgive-yes');
const forgiveNo = document.getElementById('forgive-no');
const forgivenSuccess = document.getElementById('forgiven-success');

function startApologyRotation() {
    if (!apologyMessage) return;

    const interval = setInterval(() => {
        apologyMessage.style.opacity = '0';

        setTimeout(() => {
            currentApologyIndex++;
            if (currentApologyIndex < apologyMessages.length) {
                apologyMessage.textContent = apologyMessages[currentApologyIndex];
                apologyMessage.style.opacity = '1';
                spawnApologyPetal();
            } else {
                clearInterval(interval);
                apologyMessage.innerHTML = "I Love You More Than Words Can Say. ❤️";
                apologyMessage.style.opacity = '1';
                if (apologyFinalAction) apologyFinalAction.classList.remove('hidden');
            }
        }, 800);
    }, 4000);
}

function spawnApologyPetal() {
    const container = document.getElementById('apology-petals');
    if (!container) return;

    const petal = document.createElement('div');
    petal.className = 'absolute text-2xl pointer-events-none opacity-40';
    petal.textContent = '🥀';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.top = '-20px';

    const duration = 3000 + Math.random() * 3000;
    petal.style.transition = `all ${duration}ms linear`;
    container.appendChild(petal);

    setTimeout(() => {
        petal.style.top = '110%';
        petal.style.transform = `translateX(${(Math.random() - 0.5) * 100}px) rotate(${Math.random() * 360}deg)`;
    }, 50);

    setTimeout(() => petal.remove(), duration + 100);
}

if (forgiveYes) {
    forgiveYes.addEventListener('click', () => {
        if (apologyFinalAction) apologyFinalAction.classList.add('hidden');
        if (forgivenSuccess) forgivenSuccess.classList.remove('hidden');
        createConfetti();
        // Trigger extra confetti
        for (let i = 0; i < 5; i++) setTimeout(createConfetti, i * 300);
    });
}

if (forgiveNo) {
    forgiveNo.addEventListener('click', () => {
        forgiveNo.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 100}px)`;
        setTimeout(() => {
            forgiveNo.textContent = "Please? 🥺";
        }, 300);
    });
}

// Start rotation when section is revealed
const apologySection = document.getElementById('section-apology');
if (apologySection) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startApologyRotation();
            observer.disconnect();
        }
    }, { threshold: 0.5 });
    observer.observe(apologySection);
}

// Virtual Bouquet Interaction
function revealReason(index, icon, reason) {
    const noteEl = document.getElementById('flower-note');
    const noteIcon = document.getElementById('note-icon');
    const noteText = document.getElementById('note-text');

    if (!noteEl || !noteIcon || !noteText) return;

    // Reset animation
    noteEl.style.opacity = '0';
    noteEl.style.transform = 'translateY(20px) scale(0.95)';

    setTimeout(() => {
        noteIcon.textContent = icon;
        noteText.textContent = reason;
        
        // Appear with animation
        noteEl.style.opacity = '1';
        noteEl.style.transform = 'translateY(0) scale(1)';
        
        // Add a floating heart effect from the flower
        const flowers = document.querySelectorAll('.interactive-flower');
        if (flowers[index]) {
            const rect = flowers[index].getBoundingClientRect();
            spawnFloatingHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }, 300);
}
