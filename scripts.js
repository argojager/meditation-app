let audioElement;
let currentInterval;

// Mappa delle frequenze ai file audio
const audioFiles = {
    'theta': 'audio/theta_meditation.mp3',
    'alpha': 'audio/alpha_relaxation.mp3',
    'beta': 'audio/beta_focus.mp3',
    'gamma': 'audio/gamma_awareness.mp3'
};
function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

function saveProfile() {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        alert('Profilo salvato!');
    } else {
        alert('Per favore, inserisci un nome utente.');
    }
}

function showFrequencyOptions() {
    document.querySelector('.session-select').classList.add('hidden');
    document.getElementById('frequency-select').classList.remove('hidden');
}

function startSession() {
    const sessionSelect = document.getElementById('session');
    const frequencySelect = document.getElementById('frequency');
    const selectedTime = sessionSelect.value;
    const selectedFrequency = frequencySelect.options[frequencySelect.selectedIndex].text;
    const frequencyValue = frequencySelect.value;

    document.getElementById('frequency-select').classList.add('hidden');
    document.getElementById('session-display').classList.remove('hidden');

    const sessionTimeDisplay = document.getElementById('session-time');
    sessionTimeDisplay.textContent = `Meditazione di ${selectedTime} minuti iniziata!`;

    const frequencyTypeDisplay = document.getElementById('frequency-type');
    frequencyTypeDisplay.textContent = `Frequenza selezionata: ${selectedFrequency}`;

    startAudio(frequencyValue);
    startTimer(selectedTime);
}

function startAudio(frequency) {
    if (audioElement) {
        audioElement.pause();
    }
    audioElement = new Audio(audioFiles[frequency]);
    audioElement.loop = true;
    audioElement.play();
}

function startTimer(minutes) {
    let seconds = minutes * 60;
    const timerDisplay = document.getElementById('timer');

    if (currentInterval) {
        clearInterval(currentInterval);
    }

    currentInterval = setInterval(() => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        seconds--;

        if (seconds < 0) {
            clearInterval(currentInterval);
            alert(`La sessione di meditazione di ${minutes} minuti è terminata.`);
            endSession();
        }
    }, 1000);
}

function endSession() {
    document.querySelector('.session-select').classList.remove('hidden');
    document.getElementById('session-display').classList.add('hidden');
    document.getElementById('timer').textContent = '';
    document.getElementById('frequency-type').textContent = '';

    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }

    if (currentInterval) {
        clearInterval(currentInterval);
    }

    updateStatistics();
}

function updateStatistics() {
    let completedSessions = parseInt(localStorage.getItem('completedSessions') || '0');
    completedSessions++;
    localStorage.setItem('completedSessions', completedSessions);

    const statsDisplay = document.getElementById('stats');
    statsDisplay.textContent = `Sessioni completate: ${completedSessions}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
    }
    showSection('meditation');
    updateStatistics();
});