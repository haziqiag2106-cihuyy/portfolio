const audio = document.getElementById('bgm');
const toggleBtn = document.getElementById('musik');

const TARGET_VOLUME = 0.3; // Volume akhir yang diinginkan (30%)
const FADE_DURATION = 2000; // Durasi fade-in dalam milidetik (2000 ms = 2 detik)

let isPlaying = false;
let fadeInterval = null;

// Fungsi untuk menaikkan volume secara halus (fade-in)
function fadeInAudio() {
    clearInterval(fadeInterval);
  audio.volume = 0; // Mulai dari senyap

  const stepTime = 50; // Interval kenaikan tiap 50ms
    const stepVolume = TARGET_VOLUME / (FADE_DURATION / stepTime);

    fadeInterval = setInterval(() => {
    if (audio.volume + stepVolume < TARGET_VOLUME) {
    audio.volume += stepVolume;
    } else {
    audio.volume = TARGET_VOLUME;
    clearInterval(fadeInterval);
    }
}, stepTime);
}

// Update teks tombol
function updateButtonUI(playing) {
    toggleBtn.textContent = playing ? 'Pause' : 'Start';
}

// Handler pemutaran audio dengan fade-in
function playWithFadeIn() {
    audio.play().then(() => {
    isPlaying = true;
    updateButtonUI(true);
    fadeInAudio();
    }).catch(() => {
    isPlaying = false;
    updateButtonUI(false);

    // Fallback jika autoplay ditahan kebijakan browser
    const enableAudioOnFirstClick = () => {
        audio.play().then(() => {
        isPlaying = true;
        updateButtonUI(true);
        fadeInAudio();
        }).catch(() => {});

        document.removeEventListener('click', enableAudioOnFirstClick);
        document.removeEventListener('touchstart', enableAudioOnFirstClick);
    };

    document.addEventListener('click', enableAudioOnFirstClick, { once: true });
    document.addEventListener('touchstart', enableAudioOnFirstClick, { once: true });
    });
}

// Inisialisasi awal saat dimuat
playWithFadeIn();

// Toggle manual lewat tombol Start / Pause
toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (isPlaying) {
    clearInterval(fadeInterval);
    audio.pause();
    isPlaying = false;
    updateButtonUI(false);
    } else {
    playWithFadeIn();
    }
});