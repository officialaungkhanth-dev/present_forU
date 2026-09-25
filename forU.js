// --- Parallax Elements ---
let intro = document.getElementById('intro');
let background = document.getElementById('background');
let mountain = document.getElementById('mountain');
let tree3 = document.getElementById('tree3');
let tree2 = document.getElementById('tree2');
let tree1 = document.getElementById('tree1');
let groundtree = document.getElementById('groundtree');

// --- Music Player Elements ---
const audio = document.getElementById('timelineAudio');
const playBtn = document.getElementById('masterPlayBtn');
const playIcon = document.getElementById('playBtnIcon');
const slider = document.getElementById('audioTimelineSlider');
const progressTrack = document.getElementById('customProgressTrack');
const currentTimeText = document.getElementById('currentTimeDisplay');
const durationTimeText = document.getElementById('durationTimeDisplay');
const playerWidget = document.querySelector('.custom-music-player');

let userIsAdjustingSlider = false;

// --- 1. PARALLAX SCROLLING ENGINE ---
window.addEventListener('scroll', () => {
    let value = window.scrollY;

    // Vertical Movements (Y-Axis)
    if (intro) intro.style.transform = `translate(-50%, calc(-50% + ${value * 2.5}px))`;
    if (background) background.style.transform = `translateY(${value * -1.5}px)`;
    if (mountain) mountain.style.transform = `translateY(${value * 1.5}px)`;

    // Horizontal Movements (X-Axis)
    if (tree3) tree3.style.transform = `translateX(${value * -1.5}px)`; // Moves Left
    if (tree2) tree2.style.transform = `translateX(${value * 1.0}px)`;  // Moves Right
    if (tree1) tree1.style.transform = `translateX(${value * -1.0}px)`; // Moves Left
});

// --- 2. TIME FORMATTING HELPER ---
function formatTimeStrings(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// --- 3. PLAYER INTERFACE UI STATES ---

// Fired automatically when audio plays (Swaps icon to PAUSE ||)
function setPlayState() {
    if (playIcon) {
        playIcon.innerHTML = `<path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
        const svg = playBtn.querySelector('svg');
        if (svg) svg.style.marginLeft = "0px";
    }
    playBtn.classList.add('playing');
}

// Fired automatically when audio pauses or ends (Swaps icon to PLAY ▶)
function setPauseState() {
    if (playIcon) {
        playIcon.innerHTML = `<path fill="currentColor" d="M8 5v14l11-7z"/>`;
        const svg = playBtn.querySelector('svg');
        if (svg) svg.style.marginLeft = "2px";
    }
    playBtn.classList.remove('playing');
}

// Bind native audio media events directly to the UI functions
audio.addEventListener('play', setPlayState);
audio.addEventListener('pause', setPauseState);
audio.addEventListener('ended', setPauseState);

// --- 4. UNIFIED ENTRANCE & AUDIO INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('entrance-overlay');
    const enterBtn = document.getElementById('enter-btn');
    const heartBtn = document.querySelector('.heart-btn');

    // Force track reset to start
    audio.currentTime = 0;
    setPauseState();

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            if (overlay) overlay.classList.add('hidden');
            if (playerWidget) playerWidget.classList.add('show');

            // Play audio (native 'play' event will fire setPlayState automatically)
            audio.play().catch(e => console.log("Playback error encountered:", e));
        });
    }

    if (heartBtn) {
        heartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            heartBtn.classList.toggle('active');
            console.log(heartBtn.classList.contains('active') ? "Track Liked! ❤️" : "Track Unliked 💔");
        });
    }
});

// --- 5. AUDIO EVENT TRACKING MECHANICS ---

// Live Tracking Progress Sync
audio.addEventListener('timeupdate', () => {
    if (!userIsAdjustingSlider && audio.duration) {
        const percentage = (audio.currentTime / audio.duration) * 100;
        slider.value = percentage;
        if (progressTrack) progressTrack.style.width = `${percentage}%`;
        currentTimeText.textContent = formatTimeStrings(audio.currentTime);
    }
});

// Catch metadata load lengths
audio.addEventListener('loadedmetadata', () => {
    durationTimeText.textContent = formatTimeStrings(audio.duration);
});

// Input Sync: User scrubbing adjustments live
slider.addEventListener('input', () => {
    userIsAdjustingSlider = true;
    const currentPercentage = slider.value;
    if (progressTrack) progressTrack.style.width = `${currentPercentage}%`;

    if (audio.duration) {
        const targetTime = (currentPercentage / 100) * audio.duration;
        currentTimeText.textContent = formatTimeStrings(targetTime);
    }
});

// Change Sync: Releasing timeline handles
slider.addEventListener('change', () => {
    if (audio.duration) {
        audio.currentTime = (slider.value / 100) * audio.duration;
    }
    userIsAdjustingSlider = false;
});

// Manual play widget control button click
playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});