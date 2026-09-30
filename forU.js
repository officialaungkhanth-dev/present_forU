// --- Parallax Elements ---
let intro = document.getElementById('intro');
let background = document.getElementById('background');
let mountain = document.getElementById('mountain');
let tree3 = document.getElementById('tree3');
let tree2 = document.getElementById('tree2');
let tree1 = document.getElementById('tree1');
let groundtree = document.getElementById('groundtree');

// --- Playlist Configuration ---
const playlist = [
    {
        title: "Ed Sheeran - Photograph",
        cover: "./images/song-cover-1.jpeg",
        src: "./audio/Ed Sheeran - Photograph.mp3"
    },

    {
        title: "Powfu - Days we had",
        cover: "./images/song-cover-2.jpg",
        src: "./audio/Days We Had.mp3"
    },

    {
        title: "Isak Danielson - Always",
        cover: "./images/song-cover.jpeg",
        src: "./audio/Isak Danielson - Always (official video).mp3"
    },

    {
        title: "Powfu - The fire in your eyes keeps me warm",
        cover: "./images/song-cover-2.jpg",
        src: "./audio/Powfu, sleep.ing, Arvnd - the fire in your eyes keeps me warm (Official Audio) .mp3"
    },

    {
        title: "Pamungkas - To the bone",
        cover: "./images/song-cover-3.jpg",
        src: "./audio/Pamungkas - To the bone (lyrics).mp3"
    },

    {
        title: "Powfu - Running through the rain",
        cover: "./images/song-cover-2.jpg",
        src: "./audio/Powfu - running through the rain.mp3"
    },

    {
        title: "Boywithuke - Tired of wanting you",
        cover: "./images/song-cover-4.jpeg",
        src: "./audio/Tired of Wanting You.mp3"
    },

    {
        title: "Rush B - Dandelions",
        cover: "./images/song-cover-5.jpg",
        src: "./audio/Ruth B. - Dandelions (Audio).mp3"
    },

];

let currentTrackIndex = 0;

// --- Music Player Elements ---
const titleTrack = document.querySelector('.song-title-track');
const audio = document.getElementById('timelineAudio');
const playBtn = document.getElementById('masterPlayBtn');
const playIcon = document.getElementById('playBtnIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const albumArt = document.querySelector('.album-art-square');
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

// --- ANIMATION CALCULATOR FOR OVERFLOWING TITLES ---
function updateTitleAnimation() {
    const metaContainer = document.querySelector('.player-meta-info');
    const titleTrack = document.querySelector('.song-title-track');

    if (!metaContainer || !titleTrack) return;

    // Reset state to accurately calculate width
    titleTrack.classList.remove('is-scrolling');
    titleTrack.style.transform = 'translateX(0)';

    const overflowDistance = titleTrack.scrollWidth - metaContainer.clientWidth;

    // Only enable animation if text extends beyond visible box
    if (overflowDistance > 2) {
        const moveDistance = -(overflowDistance + 10); // 10px extra padding
        const duration = Math.max(5, overflowDistance / 18); // Dynamic speed scaling

        titleTrack.style.setProperty('--scroll-distance', `${moveDistance}px`);
        titleTrack.style.setProperty('--scroll-duration', `${duration}s`);
        
        titleTrack.classList.add('is-scrolling');
    }
}

// --- 3. TRACK & PLAYLIST LOADER ---
function loadTrack(index) {
    const track = playlist[index];
    if (!track) return;

    // 1. Update Audio File
    audio.src = track.src;

    // 2. Update Album Art
    if (albumArt) {
        albumArt.style.backgroundImage = `url('${track.cover}')`;
    }

    // 3. Update Song Title Text
    const titleSpans = document.querySelectorAll('.player-label');
    titleSpans.forEach(span => {
        span.textContent = track.title;
    });

    // 4. Recalculate title scroll distance for new track name
    updateTitleAnimation();

    // 5. Reset Timeline UI
    slider.value = 0;
    if (progressTrack) progressTrack.style.width = '0%';
    currentTimeText.textContent = "0:00";
}


// --- 4. PLAYER INTERFACE UI STATES ---

function setPlayState() {
    if (playIcon) {
        playIcon.innerHTML = `<path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
        const svg = playBtn.querySelector('svg');
        if (svg) svg.style.marginLeft = "0px";
    }
    playBtn.classList.add('playing');
    
    // Resume song title animation via CSS class
    if (playerWidget) playerWidget.classList.add('playing');
}

function setPauseState() {
    if (playIcon) {
        playIcon.innerHTML = `<path fill="currentColor" d="M8 5v14l11-7z"/>`;
        const svg = playBtn.querySelector('svg');
        if (svg) svg.style.marginLeft = "2px";
    }
    playBtn.classList.remove('playing');
    
    // Pause song title animation via CSS class
    if (playerWidget) playerWidget.classList.remove('playing');
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    const isPlaying = !audio.paused;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().catch(e => console.log("Playback error:", e));
    }
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    const isPlaying = !audio.paused;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().catch(e => console.log("Playback error:", e));
    }
}


// Native audio media events
audio.addEventListener('play', setPlayState);
audio.addEventListener('pause', setPauseState);

// Auto-advance to next song when current track ends
audio.addEventListener('ended', () => {
    nextTrack();
    audio.play().catch(e => console.log("Auto-play error:", e));
});

// --- 5. UNIFIED ENTRANCE & AUDIO INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('entrance-overlay');
    const enterBtn = document.getElementById('enter-btn');
    const heartBtn = document.querySelector('.heart-btn');

    // Initialize first track
    loadTrack(currentTrackIndex);
    setPauseState();

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            if (overlay) overlay.classList.add('hidden');
            if (playerWidget) playerWidget.classList.add('show');

            // Play initial track
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

// --- 6. CONTROLS & TIMELINE SCRUBBING ---

// Manual play/pause button
playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

// Skip buttons
if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextTrack();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevTrack();
    });
}

// Live Progress Tracking Sync
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

// User scrubbing timeline handle
slider.addEventListener('input', () => {
    userIsAdjustingSlider = true;
    const currentPercentage = slider.value;
    if (progressTrack) progressTrack.style.width = `${currentPercentage}%`;

    if (audio.duration) {
        const targetTime = (currentPercentage / 100) * audio.duration;
        currentTimeText.textContent = formatTimeStrings(targetTime);
    }
});

// Releasing timeline handle
slider.addEventListener('change', () => {
    if (audio.duration) {
        audio.currentTime = (slider.value / 100) * audio.duration;
    }
    userIsAdjustingSlider = false;
});
