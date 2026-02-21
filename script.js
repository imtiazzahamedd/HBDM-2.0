// Intro Sequence Animation
const introSequence = document.getElementById('intro-sequence');
const mainContent = document.getElementById('main-content');
const skipBtn = document.getElementById('skip-intro');
const introTrigger = document.getElementById('intro-trigger');
let introTimeouts = [];

// Define all 12 sequence steps - Fresh cinematic messages
const introTexts = [
    { id: 'intro-text-1', duration: 2500 },
    { id: 'intro-text-2', duration: 3000 },
    { id: 'intro-text-3', duration: 5000 },
    { id: 'intro-text-4', duration: 2000 },
    { id: 'intro-text-5', duration: 3000 },
    { id: 'intro-text-6', duration: 3500 },
    { id: 'intro-text-7', duration: 3500 },
    { id: 'intro-text-8', duration: 3000 },
    { id: 'intro-text-9', duration: 2000 },
    { id: 'intro-text-10', duration: 3500 },
    { id: 'intro-text-11', duration: 3500 },
    { id: 'intro-text-12', duration: 4000 }
];

// Initialize sequence
function startIntro() {
    if (!introSequence) return;

    // Lock scrolling
    document.body.style.overflow = 'hidden';

    let currentDelay = 800;

    introTexts.forEach((text, index) => {
        const t1 = setTimeout(() => {
            const element = document.getElementById(text.id);
            if (element) {
                element.classList.add('intro-text-premium', 'active');

                const t2 = setTimeout(() => {
                    element.classList.remove('active');
                }, text.duration);
                introTimeouts.push(t2);
            }
        }, currentDelay);
        introTimeouts.push(t1);

        currentDelay += text.duration + 800;
    });

    // End intro
    const tEnd = setTimeout(() => {
        finishIntro();
    }, currentDelay);
    introTimeouts.push(tEnd);
}

function finishIntro() {
    if (introSequence) {
        introSequence.style.opacity = '0';
        introSequence.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)';

        setTimeout(() => {
            introSequence.style.display = 'none';
            if (mainContent) {
                mainContent.style.opacity = '1';
                document.body.style.overflow = 'auto';
            }
        }, 1500);
    }
}

function skipIntro() {
    // Clear all scheduled timeouts
    introTimeouts.forEach(t => clearTimeout(t));

    // Jump to the end animation state
    if (introSequence) {
        introSequence.style.opacity = '0';
        introSequence.style.transition = 'opacity 0.8s ease-out';

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
        introTrigger.style.opacity = '0';
        introTrigger.style.pointerEvents = 'none';
        setTimeout(() => {
            introTrigger.style.display = 'none';
            startIntro();
        }, 500);
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

    const daysEl = document.getElementById('days-count');
    const hoursEl = document.getElementById('hours-count');
    const minutesEl = document.getElementById('minutes-count');

    if (daysEl) daysEl.textContent = days.toLocaleString();
    if (hoursEl) hoursEl.textContent = hours.toLocaleString();
    if (minutesEl) minutesEl.textContent = minutes.toLocaleString();
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
    "You're the best thing that ever happened to me! 🎁"
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

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('anni-days');
    const hoursEl = document.getElementById('anni-hours');
    const minutesEl = document.getElementById('anni-minutes');
    const secondsEl = document.getElementById('anni-seconds');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
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
    "🫂 Sending endless hugs your way! 💕"
];

function sendVirtualHug() {
    const hugEmoji = document.getElementById('hug-emoji');
    const hugMessage = document.getElementById('hug-message');
    const hugCountEl = document.getElementById('hug-count');

    // Increment counter
    hugCount++;
    if (hugCountEl) hugCountEl.textContent = hugCount;

    // Animate emoji
    hugEmoji.style.transform = 'scale(1.5) rotate(360deg)';

    setTimeout(() => {
        hugEmoji.style.transform = 'scale(1) rotate(0deg)';
    }, 500);

    // Show random message
    const randomMessage = hugMessages[Math.floor(Math.random() * hugMessages.length)];
    hugMessage.innerHTML = `<p class="text-2xl font-bold text-amber-400 animate-fade-in">${randomMessage}</p>`;

    // Add confetti effect
    const confetti = document.getElementById('confetti');
    if (confetti) {
        confetti.classList.remove('hidden');
        setTimeout(() => {
            confetti.classList.add('hidden');
        }, 3000);
    }
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

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('next-bday-days');
    const hoursEl = document.getElementById('next-bday-hours');
    const minutesEl = document.getElementById('next-bday-minutes');
    const secondsEl = document.getElementById('next-bday-seconds');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
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
    ctx.fillText('SCRATCH HERE ✨', width/2, height/2 + 8);
    
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
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; e.preventDefault(); }, {passive: false});
    window.addEventListener('mouseup', () => isDrawing = false);
    window.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', (e) => { scratch(e); e.preventDefault(); }, {passive: false});
}

// Call init on load
window.addEventListener('load', initScratchCard);

// Love Wheel Logic
const reasons = [
    "Your beautiful smile 😊",
    "The way you care for me ❤️",
    "How you make me laugh 😂",
    "Your incredible strength 💪",
    "The kindness in your heart ✨",
    "Your morning grumpy face 😴",
    "Everything about you! ♾️"
];

let isWheelSpinning = false;
function spinLoveWheel() {
    if (isWheelSpinning) return;
    isWheelSpinning = true;
    
    const wheel = document.getElementById('love-wheel');
    const resultDiv = document.getElementById('wheel-result');
    const resultText = document.getElementById('wheel-text');
    
    const randomRotation = Math.floor(1800 + Math.random() * 1800);
    wheel.style.transform = `rotate(${randomRotation}deg)`;
    
    setTimeout(() => {
        isWheelSpinning = false;
        const index = Math.floor(Math.random() * reasons.length);
        resultText.textContent = reasons[index];
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
