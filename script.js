const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const volumeSlider = document.getElementById('volume');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const disc = document.getElementById('disc');
const trackTitle = document.getElementById('track-title');
const togglePlaylistBtn = document.getElementById('togglePlaylistBtn');
const playlistEl = document.getElementById('playlist');
const themeSwitcher = document.getElementById('themeSwitcher');

let rotation = 0;
let rotationInterval = null;
let isPlaying = false;
let currentIndex = 0;
let isShuffle = false;

const tracks = [{
        title: "Electronic Groove",
        src: "assets/songs/track1.mp3",
        cover: "assets/images/disc.png"
    },
    {
        title: "Jazz in the Night",
        src: "assets/songs/track2.mp3",
        cover: "assets/images/disc1.jpg"
    },
    {
        title: "Chill Beats",
        src: "https://cdn.pixabay.com/download/audio/2021/10/19/audio_7f038020b2.mp3?filename=chill-beats-5757.mp3",
        cover: "https://cdn.pixabay.com/photo/2015/10/22/12/44/headphones-1006204_1280.jpg"
    }
];

function loadTrack(index) {
    currentIndex = index;
    audio.src = tracks[index].src;
    trackTitle.textContent = tracks[index].title;
    disc.src = tracks[index].cover;
    resetRotation();
    updatePlaylistHighlight();
}

function playTrack() {
    audio.play();
    isPlaying = true;
    playBtn.textContent = '⏸️';
    startRotation();
}

function pauseTrack() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = '▶️';
    stopRotation();
}

function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function resetRotation() {
    rotation = 0;
    disc.style.transform = `rotate(0deg)`;
    stopRotation();
}

function startRotation() {
    if (rotationInterval) return; // prevent multiple intervals
    rotationInterval = setInterval(() => {
        rotation = (rotation + 1) % 360;
        disc.style.transform = `rotate(${rotation}deg)`;
    }, 20);
}

function stopRotation() {
    clearInterval(rotationInterval);
    rotationInterval = null;
}

playBtn.addEventListener('click', togglePlay);

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentIndex);
    playTrack();
});

nextBtn.addEventListener('click', () => {
    if (isShuffle) {
        playRandomTrack();
    } else {
        currentIndex = (currentIndex + 1) % tracks.length;
        loadTrack(currentIndex);
        playTrack();
    }
});

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active-shuffle', isShuffle);
});

volumeSlider.addEventListener('input', e => {
    audio.volume = e.target.value;
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

progress.addEventListener('input', () => {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

audio.addEventListener('ended', () => {
    nextBtn.click();
});

function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return `${min}:${secRemain < 10 ? "0" : ""}${secRemain}`;
}

togglePlaylistBtn.addEventListener('click', () => {
    playlistEl.classList.toggle('hidden');
    togglePlaylistBtn.textContent = playlistEl.classList.contains('hidden') ?
        "🎶 Show Playlist" :
        "🎶 Hide Playlist";
});

themeSwitcher.addEventListener('change', () => {
    document.body.classList.toggle('light', themeSwitcher.checked);
});

function generatePlaylist() {
    playlistEl.innerHTML = "";
    tracks.forEach((track, index) => {
        const li = document.createElement("li");
        li.textContent = track.title;
        li.addEventListener("click", () => {
            loadTrack(index);
            playTrack();
        });
        playlistEl.appendChild(li);
    });
}

function updatePlaylistHighlight() {
    Array.from(playlistEl.children).forEach((li, idx) => {
        li.classList.toggle("active", idx === currentIndex);
    });
}

function playRandomTrack() {
    let next;
    do {
        next = Math.floor(Math.random() * tracks.length);
    } while (next === currentIndex);
    loadTrack(next);
    playTrack();
}

// Initialize
generatePlaylist();
loadTrack(0);
audio.volume = 1;