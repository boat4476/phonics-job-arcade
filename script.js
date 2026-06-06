// ข้อมูลอาชีพ (Day 3 Vocabularies & Simple Sentences)
const occupations = [
    { id: 'teacher', nameEn: 'teacher', nameTh: 'ครู', sentence: 'I want to be a teacher.' },
    { id: 'doctor', nameEn: 'doctor', nameTh: 'หมอ', sentence: 'He is a doctor.' },
    { id: 'nurse', nameEn: 'nurse', nameTh: 'พยาบาล', sentence: 'She is a nurse.' },
    { id: 'police', nameEn: 'police officer', nameTh: 'ตำรวจ', sentence: 'He is a police officer.' },
    { id: 'firefighter', nameEn: 'firefighter', nameTh: 'นักดับเพลิง', sentence: 'I want to be a firefighter.' },
    { id: 'chef', nameEn: 'chef', nameTh: 'เชฟ', sentence: 'She is a chef.' },
    { id: 'pilot', nameEn: 'pilot', nameTh: 'นักบิน', sentence: 'I want to be a pilot.' },
    { id: 'dentist', nameEn: 'dentist', nameTh: 'หมอฟัน', sentence: 'She is a dentist.' },
    { id: 'farmer', nameEn: 'farmer', nameTh: 'ชาวนา', sentence: 'He is a farmer.' },
    { id: 'artist', nameEn: 'artist', nameTh: 'ศิลปิน', sentence: 'She is an artist.' },
    { id: 'singer', nameEn: 'singer', nameTh: 'นักร้อง', sentence: 'She is a singer.' },
    { id: 'dancer', nameEn: 'dancer', nameTh: 'นักเต้น', sentence: 'She is a dancer.' },
    { id: 'vet', nameEn: 'vet', nameTh: 'สัตวแพทย์', sentence: 'She is a vet.' },
    { id: 'driver', nameEn: 'driver', nameTh: 'คนขับรถ', sentence: 'He is a driver.' },
    { id: 'baker', nameEn: 'baker', nameTh: 'คนทำขนมปัง', sentence: 'She is a baker.' },
    { id: 'actor', nameEn: 'actor', nameTh: 'นักแสดง', sentence: 'He is an actor.' },
    { id: 'waiter', nameEn: 'waiter', nameTh: 'พนักงานเสิร์ฟ', sentence: 'He is a waiter.' },
    { id: 'mail_carrier', nameEn: 'mail carrier', nameTh: 'คนส่งจดหมาย', sentence: 'He is a mail carrier.' },
    { id: 'soccer_player', nameEn: 'soccer player', nameTh: 'นักฟุตบอล', sentence: 'He is a soccer player.' },
    { id: 'barber', nameEn: 'barber', nameTh: 'ช่างตัดผม', sentence: 'He is a barber.' }
];

// สถานะหลักของระบบ (Main Application State)
let gameState = {
    // ข้อมูลผู้เล่น
    player1: { 
        name: 'น้องอันดา', 
        score: 0, 
        coins: 10, // เริ่มให้คนละ 10 เหรียญเอาขวัญถุง
        activeBadge: '', 
        unlockedBadges: [], 
        activeSound: 'standard', 
        unlockedSounds: ['standard'] 
    },
    player2: { 
        name: 'พี่อชิ', 
        score: 0, 
        coins: 10, 
        activeBadge: '', 
        unlockedBadges: [], 
        activeSound: 'standard', 
        unlockedSounds: ['standard'] 
    },
    currentPlayer: 'X', // สำหรับ XO: 'X' หรือ 'O' / สำหรับ Memory: 'P1' หรือ 'P2'
    
    // คลังของรางวัลในอาเขต
    storeItems: [
        { id: 'badge_crown', type: 'badge', icon: '👑', name: 'มงกุฎราชา', cost: 15 },
        { id: 'badge_rainbow', type: 'badge', icon: '🌈', name: 'สายรุ้งสดใส', cost: 15 },
        { id: 'badge_fire', type: 'badge', icon: '🔥', name: 'ลูกไฟร้อนแรง', cost: 20 },
        { id: 'badge_diamond', type: 'badge', icon: '💎', name: 'เพชรวิบวับ', cost: 25 },
        { id: 'sound_duck', type: 'sound', icon: '🦆', name: 'เสียงเป็ดก๊าบๆ', cost: 30 },
        { id: 'sound_cat', type: 'sound', icon: '🐱', name: 'เสียงแมวเหมียว', cost: 30 },
        { id: 'sound_dino', type: 'sound', icon: '🦖', name: 'เสียงไดโนเสาร์', cost: 40 },
        { id: 'sound_laser', type: 'sound', icon: '🚀', name: 'เสียงยานอวกาศ', cost: 40 }
    ],
    
    // ตั้งค่าเสียง
    soundEnabled: true,
    audioCtx: null,
    
    // หน้าจอที่กำลังแสดงอยู่
    currentScreen: 'setup-screen',
    
    // --- สถานะย่อยของเกม XO ---
    xo: {
        board: Array(9).fill(null),
        boardOccupations: [],
        score1: 0,
        score2: 0,
        active: false
    },
    
    // --- สถานะย่อยของเกมจับคู่ Memory Match ---
    memory: {
        mode: 'versus', // 'versus' หรือ 'solo'
        cards: [],
        firstCard: null,
        secondCard: null,
        lockBoard: false,
        score1: 0,
        score2: 0,
        // สำหรับ Solo Mode
        moves: 0,
        matchesFound: 0,
        timer: 0,
        timerInterval: null
    },
    
    // --- สถานะย่อยของเกมสะกดคำ Word Builder ---
    spelling: {
        score: 0,
        currentWordIndex: 0,
        currentJob: null,
        typedWord: [], // ตัวสะกดที่ป้อนเข้าไปแล้ว
        targetWord: '', // คำศัพท์เป้าหมาย
        scrambledLetters: [], // ตัวอักษรปนกัน
        completedCount: 0
    },
    
    // --- สถานะย่อยของเกมจับคู่ความเร็ว Speed Tap ---
    // --- สถานะย่อยของเกมจับคู่ความเร็ว Speed Tap ---
    tap: {
        score1: 0,
        score2: 0,
        targetJob: null,
        choices: [],
        p1Locked: false,
        p2Locked: false,
        active: false
    },
    
    // --- สถานะย่อยของเกมหนีผีหลอก Spooky Phonics Escape ---
    spooky: {
        playerPos: 30,
        ghostPos: 0,
        active: false,
        currentWordIndex: 0,
        currentJob: null,
        targetWord: '',
        typedWord: [],
        scrambledLetters: [],
        threatCountdown: 6,
        threatInterval: null,
        success: false
    }
};

// ตำแหน่งคู่ที่ชนะใน XO
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // แนวนอน
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // แนวตั้ง
    [0, 4, 8], [2, 4, 6]             // แนวทแยง
];

// --- [เชื่อมต่อ DOM Elements] ---
const screens = {
    'setup-screen': document.getElementById('setup-screen'),
    'arcade-screen': document.getElementById('arcade-screen'),
    'xo-screen': document.getElementById('xo-screen'),
    'memory-screen': document.getElementById('memory-screen'),
    'spelling-screen': document.getElementById('spelling-screen'),
    'tap-screen': document.getElementById('tap-screen'),
    'store-screen': document.getElementById('store-screen'),
    'embed-screen': document.getElementById('embed-screen'),
    'spooky-screen': document.getElementById('spooky-screen')
};

// ข้อมูลหน้ากรอกผู้เล่น
const p1NameInput = document.getElementById('p1-name');
const p2NameInput = document.getElementById('p2-name');
const startBtn = document.getElementById('start-btn');

// หน้าต่างสะกดคำ
const spellImg = document.getElementById('spell-image');
const spellHintTh = document.getElementById('spell-hint-th');
const spellSlots = document.getElementById('letter-slots');
const spellBank = document.getElementById('letter-bank');
const spellScoreEl = document.getElementById('spell-score');
const spellProgressEl = document.getElementById('spell-progress');

// Win Modal
const winModal = document.getElementById('win-modal');
const winTitle = document.getElementById('win-title');
const winSubtitle = document.getElementById('win-subtitle');
const modalNextBtn = document.getElementById('modal-next-btn');
const modalHomeBtn = document.getElementById('modal-home-btn');

// Speed Tap DOM elements
const tapP1ScoreEl = document.getElementById('tap-p1-score');
const tapP2ScoreEl = document.getElementById('tap-p2-score');
const tapP1StatusEl = document.getElementById('tap-p1-status');
const tapP2StatusEl = document.getElementById('tap-p2-status');
const tapP1ChoicesEl = document.getElementById('tap-p1-choices');
const tapP2ChoicesEl = document.getElementById('tap-p2-choices');
const tapP1PromptEl = document.getElementById('tap-p1-prompt');
const tapP2PromptEl = document.getElementById('tap-p2-prompt');
const tapSpeakBtn = document.getElementById('tap-speak-btn');
const tapP1PanelContainer = document.getElementById('tap-p1-panel');
const tapP2PanelContainer = document.getElementById('tap-p2-panel');

// Store and Embed DOM elements
const p1CoinsDisplay = document.getElementById('p1-coins-display');
const p2CoinsDisplay = document.getElementById('p2-coins-display');
const storeP1Coins = document.getElementById('store-p1-coins');
const storeP2Coins = document.getElementById('store-p2-coins');
const storeP1Items = document.getElementById('store-p1-items');
const storeP2Items = document.getElementById('store-p2-items');
const embedGameSelect = document.getElementById('embed-game-select');
const embedIframe = document.getElementById('embed-iframe');
const embedClaimCoinsBtn = document.getElementById('embed-claim-coins-btn');

// Spooky Escape DOM elements
const spookyGhostMarker = document.getElementById('spooky-ghost-marker');
const spookyPlayerMarker = document.getElementById('spooky-player-marker');
const spookyDistanceStatus = document.getElementById('spooky-distance-status');
const spookyHintImg = document.getElementById('spooky-hint-img');
const spookyHintTh = document.getElementById('spooky-hint-th');
const spookyTimerCountdown = document.getElementById('spooky-timer-countdown');
const spookySlots = document.getElementById('spooky-slots');
const spookyBank = document.getElementById('spooky-bank');
const spookyBooOverlay = document.getElementById('spooky-boo-overlay');
const spookyRetryBtn = document.getElementById('spooky-retry-btn');

// --- [ระบบบันทึกข้อมูลและโหลดข้อมูล LocalStorage (Persistence)] ---
function saveGameState() {
    try {
        const dataToSave = {
            player1: {
                name: gameState.player1.name,
                coins: gameState.player1.coins,
                activeBadge: gameState.player1.activeBadge,
                unlockedBadges: gameState.player1.unlockedBadges,
                activeSound: gameState.player1.activeSound,
                unlockedSounds: gameState.player1.unlockedSounds
            },
            player2: {
                name: gameState.player2.name,
                coins: gameState.player2.coins,
                activeBadge: gameState.player2.activeBadge,
                unlockedBadges: gameState.player2.unlockedBadges,
                activeSound: gameState.player2.activeSound,
                unlockedSounds: gameState.player2.unlockedSounds
            }
        };
        localStorage.setItem('arcade_game_state', JSON.stringify(dataToSave));
    } catch (e) {
        console.error("Failed to save game state to LocalStorage: ", e);
    }
}

function loadGameState() {
    try {
        const saved = localStorage.getItem('arcade_game_state');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.player1) {
                gameState.player1.name = data.player1.name || 'น้องอันดา';
                gameState.player1.coins = typeof data.player1.coins === 'number' ? data.player1.coins : 10;
                gameState.player1.activeBadge = data.player1.activeBadge || '';
                gameState.player1.unlockedBadges = Array.isArray(data.player1.unlockedBadges) ? data.player1.unlockedBadges : [];
                gameState.player1.activeSound = data.player1.activeSound || 'standard';
                gameState.player1.unlockedSounds = Array.isArray(data.player1.unlockedSounds) ? data.player1.unlockedSounds : ['standard'];
            }
            if (data.player2) {
                gameState.player2.name = data.player2.name || 'พี่อชิ';
                gameState.player2.coins = typeof data.player2.coins === 'number' ? data.player2.coins : 10;
                gameState.player2.activeBadge = data.player2.activeBadge || '';
                gameState.player2.unlockedBadges = Array.isArray(data.player2.unlockedBadges) ? data.player2.unlockedBadges : [];
                gameState.player2.activeSound = data.player2.activeSound || 'standard';
                gameState.player2.unlockedSounds = Array.isArray(data.player2.unlockedSounds) ? data.player2.unlockedSounds : ['standard'];
            }
            
            // อัปเดตช่องกรอกชื่อในหน้า Setup
            if (p1NameInput) p1NameInput.value = gameState.player1.name;
            if (p2NameInput) p2NameInput.value = gameState.player2.name;
            
            // อัปเดตการแสดงผลชื่อและเหรียญ
            updateDisplayNames();
            updateCoinsUI();
        }
    } catch (e) {
        console.error("Failed to load game state from LocalStorage: ", e);
    }
}

// --- [ระบบสลับหน้าจอ - Router] ---
function showScreen(screenId) {
    // ซ่อนทุกหน้าจอ
    Object.keys(screens).forEach(id => {
        screens[id].classList.remove('active');
    });
    
    // อัปเดตคลาสหน้าปัจจุบัน
    gameState.currentScreen = screenId;
    screens[screenId].classList.add('active');
    
    // เคลียร์ค่าตัวจับเวลาของ Memory Solo หากย้ายหน้าจอ
    if (screenId !== 'memory-screen' && gameState.memory.timerInterval) {
        clearInterval(gameState.memory.timerInterval);
        gameState.memory.timerInterval = null;
    }
    
    // เคลียร์ค่าตัวจับเวลาของ Spooky Escape หากย้ายหน้าจอ
    if (screenId !== 'spooky-screen' && gameState.spooky.threatInterval) {
        clearInterval(gameState.spooky.threatInterval);
        gameState.spooky.threatInterval = null;
    }
}

// --- [ระบบเสียงสังเคราะห์ Web Audio API & TTS] ---

function initAudio() {
    if (!gameState.audioCtx) {
        gameState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (gameState.audioCtx.state === 'suspended') {
        gameState.audioCtx.resume();
    }
}

function playTone(freq, type, duration, volume = 0.15) {
    if (!gameState.soundEnabled || !gameState.audioCtx) return;
    try {
        const ctx = gameState.audioCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        console.error("Audio error: ", e);
    }
}

function playCustomSound(packId, type) {
    initAudio();
    const ctx = gameState.audioCtx;
    if (!ctx) return;

    if (packId === 'sound_duck') {
        if (type === 'correct') {
            playTone(850, 'triangle', 0.08, 0.12);
            setTimeout(() => playTone(880, 'triangle', 0.12, 0.12), 70);
        } else if (type === 'wrong') {
            playTone(280, 'sawtooth', 0.3, 0.15);
        } else if (type === 'win') {
            playTone(700, 'triangle', 0.1, 0.1);
            setTimeout(() => playTone(850, 'triangle', 0.1, 0.1), 100);
            setTimeout(() => playTone(1000, 'triangle', 0.25, 0.1), 200);
        } else {
            playTone(600, 'triangle', 0.1, 0.12);
        }
    } else if (packId === 'sound_cat') {
        if (type === 'correct') {
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.quadraticRampToValueAtTime(1100, ctx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            } catch (e){}
        } else if (type === 'wrong') {
            playTone(130, 'sawtooth', 0.4, 0.15);
        } else if (type === 'win') {
            playTone(900, 'sine', 0.15, 0.1);
            setTimeout(() => playTone(1100, 'sine', 0.25, 0.1), 120);
        } else {
            playTone(700, 'sine', 0.15, 0.1);
        }
    } else if (packId === 'sound_dino') {
        if (type === 'correct') {
            playTone(180, 'sawtooth', 0.3, 0.18);
            setTimeout(() => playTone(250, 'sawtooth', 0.2, 0.15), 100);
        } else if (type === 'wrong') {
            playTone(90, 'sawtooth', 0.5, 0.2);
        } else if (type === 'win') {
            playTone(150, 'sawtooth', 0.2);
            setTimeout(() => playTone(200, 'sawtooth', 0.2), 150);
            setTimeout(() => playTone(300, 'sawtooth', 0.4), 300);
        } else {
            playTone(140, 'triangle', 0.15);
        }
    } else if (packId === 'sound_laser') {
        if (type === 'correct' || type === 'win') {
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(1500, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            } catch(e){}
        } else if (type === 'wrong') {
            playTone(110, 'sawtooth', 0.3, 0.15);
        } else {
            playTone(900, 'sine', 0.08, 0.1);
        }
    }
}

function playSound(type, playerNum) {
    if (!gameState.soundEnabled) return;
    initAudio();

    // ดึงเสียงเสริมประจำตัวผู้เล่น
    let activeSoundPack = 'standard';
    if (playerNum === 1) {
        activeSoundPack = gameState.player1.activeSound;
    } else if (playerNum === 2) {
        activeSoundPack = gameState.player2.activeSound;
    } else if (gameState.currentPlayer === 'X' || gameState.currentPlayer === 'P1') {
        activeSoundPack = gameState.player1.activeSound;
    } else if (gameState.currentPlayer === 'O' || gameState.currentPlayer === 'P2') {
        activeSoundPack = gameState.player2.activeSound;
    }

    if (activeSoundPack && activeSoundPack !== 'standard') {
        playCustomSound(activeSoundPack, type);
        return;
    }

    if (type === 'click') {
        playTone(600, 'sine', 0.1);
    } else if (type === 'flip') {
        playTone(400, 'triangle', 0.15);
    } else if (type === 'correct') {
        playTone(750, 'sine', 0.12, 0.1);
        setTimeout(() => playTone(950, 'sine', 0.15, 0.1), 80);
    } else if (type === 'wrong') {
        playTone(180, 'sawtooth', 0.25, 0.12);
    } else if (type === 'win') {
        setTimeout(() => playTone(523.25, 'triangle', 0.15), 0); // C5
        setTimeout(() => playTone(659.25, 'triangle', 0.15), 100); // E5
        setTimeout(() => playTone(783.99, 'triangle', 0.15), 200); // G5
        setTimeout(() => playTone(1046.50, 'triangle', 0.35), 300); // C6
    } else if (type === 'draw') {
        setTimeout(() => playTone(392, 'sawtooth', 0.2), 0); // G4
        setTimeout(() => playTone(311.13, 'sawtooth', 0.3), 150); // Eb4
    }
}

// โหลดคลังเสียงในระบบ
let speechVoices = [];
function loadVoices() {
    if ('speechSynthesis' in window) {
        speechVoices = window.speechSynthesis.getVoices();
    }
}
if ('speechSynthesis' in window) {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
}

function speakEnglish(text) {
    if (!gameState.soundEnabled) return;
    if ('speechSynthesis' in window) {
        try {
            // ป้องกัน iOS Safari แฮงก์: เราจะไม่ใช้ cancel() บนระบบ iOS/iPadOS
            // เพราะการกด cancel รัวๆ บน Webkit จะส่งผลให้คิวเสียงล็อกค้างถาวร
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            
            if (!isIOS && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.82;
            utterance.pitch = 1.05;
            
            // ค้นหาเสียงภาษาอังกฤษคุณภาพสูงเพื่อการประเมินเสียงที่ชัดเจน
            if (speechVoices.length === 0) {
                loadVoices();
            }
            const englishVoices = speechVoices.filter(v => v.lang.startsWith('en-'));
            if (englishVoices.length > 0) {
                const selectedVoice = englishVoices.find(v => v.name.includes('Google') && v.lang.includes('US')) ||
                                      englishVoices.find(v => v.name.includes('Samantha')) ||
                                      englishVoices.find(v => v.lang.includes('US')) ||
                                      englishVoices[0];
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
            }
            
            utterance.onerror = (e) => console.log("SpeechSynthesis error: ", e);
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.error("TTS Failed: ", e);
        }
    }
}

// สุ่มสับตำแหน่งอาเรย์ (Fisher-Yates)
function shuffleArray(arr) {
    const list = [...arr];
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

// --- [ 🎮 เกมที่ 1: Phonics Job XO ] ---

const xoBoardGrid = document.getElementById('xo-board-grid');
const xoP1ScoreEl = document.getElementById('xo-p1-score');
const xoP2ScoreEl = document.getElementById('xo-p2-score');
const xoP1Panel = document.getElementById('xo-p1-panel');
const xoP2Panel = document.getElementById('xo-p2-panel');
const xoTurnBanner = document.getElementById('xo-turn-banner');
const xoCurrentTurnName = document.getElementById('xo-current-turn-name');

function initXO() {
    gameState.xo.board = Array(9).fill(null);
    gameState.xo.active = true;
    gameState.currentPlayer = 'X';
    hideWinModal();
    
    // อัปเดตรายชื่อคะแนน
    document.querySelectorAll('.display-p1-name-txt').forEach(el => el.textContent = gameState.player1.name);
    document.querySelectorAll('.display-p2-name-txt').forEach(el => el.textContent = gameState.player2.name);
    
    xoP1ScoreEl.textContent = gameState.xo.score1;
    xoP2ScoreEl.textContent = gameState.xo.score2;
    
    // สับตัวเลือกอาชีพ
    gameState.xo.boardOccupations = shuffleArray(occupations);
    
    // วาดบอร์ด XO
    xoBoardGrid.innerHTML = '';
    gameState.xo.board.forEach((cell, index) => {
        const job = gameState.xo.boardOccupations[index];
        
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');
        cellEl.setAttribute('data-index', index);
        
        const imgEl = document.createElement('img');
        imgEl.classList.add('cell-image');
        imgEl.src = `images/${job.id}.png`;
        imgEl.alt = job.nameEn;
        
        const textEl = document.createElement('span');
        textEl.classList.add('cell-vocab');
        textEl.textContent = job.nameEn;
        
        const markOverlay = document.createElement('div');
        markOverlay.classList.add('mark-overlay');
        
        cellEl.appendChild(imgEl);
        cellEl.appendChild(textEl);
        cellEl.appendChild(markOverlay);
        
        cellEl.addEventListener('click', () => handleXOCellClick(index, cellEl));
        xoBoardGrid.appendChild(cellEl);
    });
    
    updateXOTurnUI();
}

function updateXOTurnUI() {
    if (gameState.currentPlayer === 'X') {
        xoP1Panel.classList.add('active');
        xoP2Panel.classList.remove('active');
        xoCurrentTurnName.textContent = gameState.player1.name + ' (X)';
        xoCurrentTurnName.className = 'p1-text';
    } else {
        xoP1Panel.classList.remove('active');
        xoP2Panel.classList.add('active');
        xoCurrentTurnName.textContent = gameState.player2.name + ' (O)';
        xoCurrentTurnName.className = 'p2-text';
    }
}

function handleXOCellClick(index, cellEl) {
    if (!gameState.xo.active || gameState.xo.board[index] !== null) return;
    
    initAudio();
    const job = gameState.xo.boardOccupations[index];
    const mark = gameState.currentPlayer;
    
    // บันทึกสถานะหมาก
    gameState.xo.board[index] = mark;
    cellEl.classList.add('marked');
    
    if (mark === 'X') {
        cellEl.classList.add('marked-x');
        cellEl.querySelector('.mark-overlay').textContent = 'X';
    } else {
        cellEl.classList.add('marked-o');
        cellEl.querySelector('.mark-overlay').textContent = 'O';
    }
    
    // ออกเสียงสะกดและเสียงคลิก
    speakEnglish(job.nameEn);
    playSound('click');
    
    // ตรวจสอบสถานะการแพ้ชนะ
    checkXOResult();
}

function checkXOResult() {
    let won = false;
    let combo = null;
    
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState.xo.board[a] && gameState.xo.board[a] === gameState.xo.board[b] && gameState.xo.board[a] === gameState.xo.board[c]) {
            won = true;
            combo = winningConditions[i];
            break;
        }
    }
    
    if (won) {
        gameState.xo.active = false;
        
        // ไฮไลต์แถวที่ชนะ
        combo.forEach(idx => xoBoardGrid.children[idx].classList.add('winning-cell'));
        
        const winnerMark = gameState.xo.board[combo[0]];
        let winnerName = "";
        let sentence = "";
        
        if (winnerMark === 'X') {
            gameState.xo.score1++;
            xoP1ScoreEl.textContent = gameState.xo.score1;
            winnerName = getPlayerDisplayName(1);
            addCoins(1, 10);
        } else {
            gameState.xo.score2++;
            xoP2ScoreEl.textContent = gameState.xo.score2;
            winnerName = getPlayerDisplayName(2);
            addCoins(2, 10);
        }
        
        // สุ่มหยิบประโยคพูดของคำในชุดชนะมาทบทวนสะกดภาษาอังกฤษ
        const randomWinIdx = combo[Math.floor(Math.random() * combo.length)];
        const job = gameState.xo.boardOccupations[randomWinIdx];
        sentence = job.sentence;
        
        playSound('win');
        setTimeout(() => {
            speakEnglish(`${winnerName} wins! ${sentence}`);
            showCelebrationModal(`🏆 ${winnerName} ชนะเกมส์ XO! 🏆`, sentence, 'xo');
        }, 500);
        return;
    }
    
    // ผลเสมอ
    if (!gameState.xo.board.includes(null)) {
        gameState.xo.active = false;
        playSound('draw');
        addCoins(1, 5);
        addCoins(2, 5);
        setTimeout(() => {
            showCelebrationModal("🤝 เล่นได้ดีมาก! เสมอกันแล้ว 🤝", "Try another match!", 'xo');
        }, 500);
        return;
    }
    
    // สลับตาเล่นต่อ
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    updateXOTurnUI();
}

// --- [ 🧠 เกมที่ 2: Job Memory Match ] ---

const memoryBoardGrid = document.getElementById('memory-board-grid');
const memP1ScoreEl = document.getElementById('mem-p1-score');
const memP2ScoreEl = document.getElementById('mem-p2-score');
const memP1Panel = document.getElementById('mem-p1-panel');
const memP2Panel = document.getElementById('mem-p2-panel');
const memTurnBanner = document.getElementById('mem-turn-banner');
const memCurrentTurnName = document.getElementById('mem-current-turn-name');
const memVSScoreboard = document.getElementById('mem-scoreboard-vs');
const memSoloInfo = document.getElementById('mem-solo-info');
const memTimerEl = document.getElementById('mem-timer');
const memMovesEl = document.getElementById('mem-moves');

function initMemory() {
    hideWinModal();
    gameState.memory.firstCard = null;
    gameState.memory.secondCard = null;
    gameState.memory.lockBoard = false;
    gameState.memory.matchesFound = 0;
    gameState.memory.moves = 0;
    
    if (gameState.memory.timerInterval) {
        clearInterval(gameState.memory.timerInterval);
    }
    
    // โหมด Versus (แข่งคู่) หรือ Solo (เล่นเดี่ยว)
    if (gameState.memory.mode === 'versus') {
        memVSScoreboard.style.display = 'flex';
        memSoloInfo.style.display = 'none';
        memTurnBanner.style.display = 'block';
        
        gameState.memory.score1 = 0;
        gameState.memory.score2 = 0;
        memP1ScoreEl.textContent = '0';
        memP2ScoreEl.textContent = '0';
        
        gameState.currentPlayer = 'P1'; // น้องอันดาเริ่มก่อน
        updateMemoryTurnUI();
    } else {
        memVSScoreboard.style.display = 'none';
        memSoloInfo.style.display = 'flex';
        memTurnBanner.style.display = 'none';
        
        gameState.memory.timer = 0;
        memTimerEl.textContent = '0';
        memMovesEl.textContent = '0';
        
        // สตาร์ทเวลานับถอยหลัง / วินาทีสะสม
        gameState.memory.timerInterval = setInterval(() => {
            gameState.memory.timer++;
            memTimerEl.textContent = gameState.memory.timer;
        }, 1000);
    }
    
    // สุ่มเลือก 6 อาชีพจาก 9 เพื่อมาทำคู่การ์ด 12 ใบ
    const selectedJobs = shuffleArray(occupations).slice(0, 6);
    
    // สร้างสำรับ 12 ใบ: ใบภาพ 6 และ ใบตัวอักษร 6
    let cardDeck = [];
    selectedJobs.forEach(job => {
        // การ์ดแบบภาพ
        cardDeck.push({
            id: job.id,
            type: 'image',
            content: `images/${job.id}.png`,
            job: job
        });
        // การ์ดแบบคำศัพท์อังกฤษ
        cardDeck.push({
            id: job.id,
            type: 'text',
            content: job.nameEn,
            job: job
        });
    });
    
    // สับไพ่ในมือ
    cardDeck = shuffleArray(cardDeck);
    gameState.memory.cards = cardDeck;
    
    // วาดการ์ดลงบอร์ด
    memoryBoardGrid.innerHTML = '';
    cardDeck.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('memory-card');
        cardEl.setAttribute('data-index', index);
        cardEl.setAttribute('data-id', card.id);
        
        const innerEl = document.createElement('div');
        innerEl.classList.add('memory-card-inner');
        
        // หน้าหลังการ์ด (คว่ำอยู่)
        const backEl = document.createElement('div');
        backEl.classList.add('memory-card-back');
        backEl.textContent = '❔';
        
        // หน้าแรกการ์ด (หงายขึ้น)
        const frontEl = document.createElement('div');
        frontEl.classList.add('memory-card-front');
        
        if (card.type === 'image') {
            const img = document.createElement('img');
            img.classList.add('memory-card-img');
            img.src = card.content;
            img.alt = card.id;
            frontEl.appendChild(img);
        } else {
            const word = document.createElement('span');
            word.classList.add('memory-card-word');
            word.textContent = card.content;
            frontEl.appendChild(word);
        }
        
        innerEl.appendChild(backEl);
        innerEl.appendChild(frontEl);
        cardEl.appendChild(innerEl);
        
        cardEl.addEventListener('click', () => handleMemoryCardClick(cardEl, index));
        memoryBoardGrid.appendChild(cardEl);
    });
}

function updateMemoryTurnUI() {
    if (gameState.currentPlayer === 'P1') {
        memP1Panel.classList.add('active');
        memP2Panel.classList.remove('active');
        memCurrentTurnName.textContent = gameState.player1.name;
        memCurrentTurnName.className = 'p1-text';
    } else {
        memP1Panel.classList.remove('active');
        memP2Panel.classList.add('active');
        memCurrentTurnName.textContent = gameState.player2.name;
        memCurrentTurnName.className = 'p2-text';
    }
}

function handleMemoryCardClick(cardEl, index) {
    if (gameState.memory.lockBoard) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
    
    initAudio();
    const cardData = gameState.memory.cards[index];
    
    // พลิกการ์ด
    cardEl.classList.add('flipped');
    playSound('flip');
    
    // ออกเสียงคำอังกฤษหากหงายเจอใบคำศัพท์
    if (cardData.type === 'text') {
        speakEnglish(cardData.content);
    } else {
        speakEnglish(cardData.id);
    }
    
    if (!gameState.memory.firstCard) {
        gameState.memory.firstCard = { el: cardEl, data: cardData };
    } else {
        gameState.memory.secondCard = { el: cardEl, data: cardData };
        gameState.memory.moves++;
        if (gameState.memory.mode === 'solo') {
            memMovesEl.textContent = gameState.memory.moves;
        }
        
        checkForMemoryMatch();
    }
}

function checkForMemoryMatch() {
    gameState.memory.lockBoard = true;
    const card1 = gameState.memory.firstCard;
    const card2 = gameState.memory.secondCard;
    
    const isMatch = card1.data.id === card2.data.id;
    
    if (isMatch) {
        // แมตช์คู่กันสำเร็จ!
        setTimeout(() => {
            card1.el.classList.add('matched');
            card2.el.classList.add('matched');
            playSound('correct');
            
            // อ่านทวนเสียงประโยค Kumon ประจำอาชีพนั้น
            speakEnglish(card1.data.job.sentence);
            
            gameState.memory.matchesFound++;
            
            // อัปเดตคะแนน
            if (gameState.memory.mode === 'versus') {
                if (gameState.currentPlayer === 'P1') {
                    gameState.memory.score1++;
                    memP1ScoreEl.textContent = gameState.memory.score1;
                    addCoins(1, 3);
                } else {
                    gameState.memory.score2++;
                    memP2ScoreEl.textContent = gameState.memory.score2;
                    addCoins(2, 3);
                }
            }
            
            resetMemorySelection();
            
            // ตรวจสอบบอร์ดจับคู่เสร็จสิ้นทั้งหมด (6 คู่)
            if (gameState.memory.matchesFound === 6) {
                handleMemoryEndGame();
            } else {
                gameState.memory.lockBoard = false;
                // ในโหมด Versus: แตะคู่ได้คะแนน จะมีสิทธิ์ได้แตะเล่นต่ออีกครั้งในรอบนั้น
            }
        }, 500);
    } else {
        // แตะการ์ดสองใบแล้วไม่เข้าคู่กัน
        setTimeout(() => {
            card1.el.classList.remove('flipped');
            card2.el.classList.remove('flipped');
            playSound('wrong');
            
            resetMemorySelection();
            
            // ในโหมด Versus: สลับเทิร์นตาของผู้เล่นถัดไป
            if (gameState.memory.mode === 'versus') {
                gameState.currentPlayer = gameState.currentPlayer === 'P1' ? 'P2' : 'P1';
                updateMemoryTurnUI();
            }
            gameState.memory.lockBoard = false;
        }, 1200);
    }
}

function resetMemorySelection() {
    gameState.memory.firstCard = null;
    gameState.memory.secondCard = null;
}

function handleMemoryEndGame() {
    if (gameState.memory.timerInterval) {
        clearInterval(gameState.memory.timerInterval);
    }
    
    playSound('win');
    
    setTimeout(() => {
        if (gameState.memory.mode === 'versus') {
            const p1 = gameState.memory.score1;
            const p2 = gameState.memory.score2;
            let title = "";
            let phrase = "Great teamwork in matching all jobs!";
            
            if (p1 > p2) {
                title = `🏆 ${getPlayerDisplayName(1)} ชนะการ์ดจับคู่! (${p1} คะแนน) 🏆`;
                addCoins(1, 10);
            } else if (p2 > p1) {
                title = `🏆 ${getPlayerDisplayName(2)} ชนะการ์ดจับคู่! (${p2} คะแนน) 🏆`;
                addCoins(2, 10);
            } else {
                title = "🤝 เสมอกัน! คว้าจับคู่ไปคนละ 3 คะแนน 🤝";
                addCoins(1, 5);
                addCoins(2, 5);
            }
            showCelebrationModal(title, phrase, 'memory');
        } else {
            addCoins(1, 15);
            showCelebrationModal(
                "🎉 ยินดีด้วย! จับคู่ครบทั้งหมด 6 อาชีพ 🎉", 
                `ใช้เวลาสะสม ${gameState.memory.timer} วินาที (คลิกพลิกไพ่ ${gameState.memory.moves} ครั้ง)`, 
                'memory'
            );
        }
    }, 600);
}

// --- [ ✏️ เกมที่ 3: Phonics Word Builder ] ---

function initSpelling() {
    hideWinModal();
    // สุ่มหยิบอาชีพขึ้นมาทีละคำตามด่านสะกดคำ
    gameState.spelling.currentJob = occupations[gameState.spelling.currentWordIndex];
    gameState.spelling.targetWord = gameState.spelling.currentJob.nameEn;
    gameState.spelling.typedWord = [];
    
    // แสดงข้อมูลในหน้าจอ (HUD)
    spellScoreEl.textContent = gameState.spelling.score;
    spellProgressEl.textContent = `${gameState.spelling.currentWordIndex + 1} / ${occupations.length}`;
    
    // ปรับรูปและคำใบ้ภาษาไทย
    spellImg.src = `images/${gameState.spelling.currentJob.id}.png`;
    spellImg.alt = gameState.spelling.targetWord;
    spellHintTh.textContent = `ความหมาย: ${gameState.spelling.currentJob.nameTh}`;
    
    // ออกเสียงคำสั่งศัพท์ภาษาอังกฤษตั้งด่านเริ่มแรก
    speakEnglish(gameState.spelling.targetWord);
    
    // สร้างช่องวางคำตอบ [ ] [ ] [ ]
    spellSlots.innerHTML = '';
    const lettersCount = gameState.spelling.targetWord.replace(/\s+/g, '').length; // นับอักษรไม่รวมเว้นวรรค
    
    for (let i = 0; i < gameState.spelling.targetWord.length; i++) {
        const char = gameState.spelling.targetWord[i];
        const slot = document.createElement('div');
        
        if (char === ' ') {
            // ดัดแปลงช่องว่างเว้นวรรคระหว่างคำศัพท์ (เช่น police officer)
            slot.style.width = '24px';
            slot.style.border = 'none';
            slot.style.background = 'transparent';
        } else {
            slot.classList.add('letter-slot');
        }
        spellSlots.appendChild(slot);
    }
    
    // ผสมปนอักษรเพื่อวางบนแผงปุ่ม
    // ดึงอักษรเป้าหมายมาสับสลับ เช่น teacher -> t, e, a, c, h, e, r
    let letterList = gameState.spelling.targetWord.replace(/\s+/g, '').split('');
    letterList = shuffleArray(letterList);
    
    // วาดปุ่มตัวอักษรกลมๆ พาสเทล
    spellBank.innerHTML = '';
    
    // อาเรย์เก็บโทนสีสลับพาสเทลให้เด็กกระตุ้นสายตา
    const colorBgs = ['#fee2e2', '#e0f2fe', '#e0fdf4', '#fef9c3', '#f3e8ff', '#ffe4e6'];
    
    letterList.forEach((letter, index) => {
        const btn = document.createElement('div');
        btn.classList.add('letter-bubble');
        btn.textContent = letter;
        
        // สุ่มใส่โทนสีพาสเทลอ่อนบนปุ่มอักษร
        btn.style.backgroundColor = colorBgs[index % colorBgs.length];
        
        btn.addEventListener('click', () => handleLetterClick(letter, btn));
        spellBank.appendChild(btn);
    });
    
    // รีเซ็ตปุ่มข้าม/ถัดไปให้เป็นโหมดข้ามคำศัพท์
    const skipBtn = document.getElementById('spell-skip-btn');
    if (skipBtn) {
        skipBtn.textContent = "⏭️ ข้ามคำนี้ (Skip)";
        skipBtn.className = "btn btn-secondary";
    }
    gameState.spelling.success = false;
}

function handleLetterClick(letter, btn) {
    initAudio();
    const target = gameState.spelling.targetWord;
    const currentIndex = gameState.spelling.typedWord.length;
    
    // เช็คอักษรเป้าหมาย (รองรับข้ามช่องว่างเว้นวรรคอัตโนมัติ)
    let expectedLetter = target[currentIndex];
    
    // ถ้าตัวอักษรถัดไปเป็นเว้นวรรค ให้ข้ามไปเติมตัวถัดไปในอักษรเปรียบเทียบ
    if (expectedLetter === ' ') {
        gameState.spelling.typedWord.push(' ');
        expectedLetter = target[currentIndex + 1];
    }
    
    if (letter.toLowerCase() === expectedLetter.toLowerCase()) {
        // กดถูก!
        gameState.spelling.typedWord.push(letter);
        
        // อัปเดตช่องแสดงอักษร Slot
        const activeIndex = gameState.spelling.typedWord.length - 1;
        const targetSlot = spellSlots.children[activeIndex];
        targetSlot.textContent = letter;
        targetSlot.classList.add('filled');
        
        // ซ่อนปุ่มจาง
        btn.classList.add('hidden');
        playSound('correct');
        speakEnglish(letter); // อ่านเสียงพยัญชนะสะกด
        
        // เช็คการสะกดคำครบสมบูรณ์
        if (gameState.spelling.typedWord.length === target.length) {
            setTimeout(() => {
                handleSpellingSuccess();
            }, 1000); // ดีเลย์ 1 วินาที เพื่อให้ออกเสียงอักษรตัวสุดท้ายจบสมบูรณ์ก่อนเสียงชนะและเอฟเฟกต์ประโยค
        }
    } else {
        // กดผิดอักษร!
        btn.classList.add('shake');
        playSound('wrong');
        speakEnglish(letter); // พูดอักษรที่เด็กจิ้มผิดให้เรียนรู้เสียง
        
        setTimeout(() => {
            btn.classList.remove('shake');
        }, 400);
    }
}

function handleSpellingSuccess() {
    gameState.spelling.score += 10;
    spellScoreEl.textContent = gameState.spelling.score;
    addCoins(1, 5);
    
    playSound('win');
    
    // พลุฉลองใบสั้น
    startConfetti();
    
    const job = gameState.spelling.currentJob;
    
    // ดีเลย์ 1.2 วินาทีเพื่อเปิดโอกาสให้เสียงอ่านพยัญชนะสุดท้ายเล่นจบชัดเจนก่อนเล่นประโยคหลัก
    setTimeout(() => {
        speakEnglish(`${job.nameEn}. ${job.sentence}`);
    }, 1200);
    
    // ปรับเปลี่ยนลักษณะปุ่ม ข้าม -> คำถัดไป เพื่อให้ผู้ใช้กดเองแถมเปลี่ยนเป็นสีน้ำเงินเด่นชัด
    const skipBtn = document.getElementById('spell-skip-btn');
    if (skipBtn) {
        skipBtn.textContent = "คำถัดไป (Next Word) ⏭️";
        skipBtn.className = "btn btn-primary";
    }
    gameState.spelling.success = true;
}

// --- [ ⚡ เกมที่ 4: Phonics Speed Tap ] ---

function initSpeedTap() {
    hideWinModal();
    gameState.tap.score1 = 0;
    gameState.tap.score2 = 0;
    gameState.tap.p1Locked = false;
    gameState.tap.p2Locked = false;
    gameState.tap.active = true;

    tapP1ScoreEl.textContent = '0';
    tapP2ScoreEl.textContent = '0';

    nextSpeedTapRound();
}

function nextSpeedTapRound() {
    if (!gameState.tap.active) return;

    // ล้างล็อกเอาต์
    gameState.tap.p1Locked = false;
    gameState.tap.p2Locked = false;
    tapP1PanelContainer.classList.remove('locked');
    tapP2PanelContainer.classList.remove('locked');
    tapP1StatusEl.textContent = 'เตรียมกด!';
    tapP2StatusEl.textContent = 'เตรียมกด!';
    tapP1StatusEl.style.color = '';
    tapP2StatusEl.style.color = '';

    // สุ่มเลือก 1 อาชีพที่เป็นโจทย์ (Target)
    const availableJobs = occupations;
    const targetIdx = Math.floor(Math.random() * availableJobs.length);
    gameState.tap.targetJob = availableJobs[targetIdx];

    // สุ่มดึงตัวเลือกหลอกอีก 3 อาชีพมารวมกันเป็น 4 ตัวเลือก
    let distractors = occupations.filter(job => job.id !== gameState.tap.targetJob.id);
    distractors = shuffleArray(distractors).slice(0, 3);

    // รวมโจทย์และตัวเลือกหลอก จากนั้นสับตำแหน่งอีกรอบเพื่อความยุติธรรม
    const choices = shuffleArray([gameState.tap.targetJob, ...distractors]);
    gameState.tap.choices = choices;

    // อัปเดตตัวหนังสือโจทย์ตรงกลางจอ
    const jobTh = gameState.tap.targetJob.nameTh;
    const jobEn = gameState.tap.targetJob.nameEn;
    tapP1PromptEl.textContent = `จิ้มหาคำว่า: ${jobEn.toUpperCase()} (${jobTh})`;
    tapP2PromptEl.textContent = `Find: ${jobEn.toUpperCase()} (${jobTh})`;

    // ออกเสียงคำอังกฤษ
    speakEnglish(jobEn);

    // วาดปุ่มตัวเลือกฝั่งผู้เล่น 1 (น้องอันดา - ด้านล่าง)
    drawSpeedTapChoices(1, tapP1ChoicesEl);

    // วาดปุ่มตัวเลือกฝั่งผู้เล่น 2 (พี่อชิ - ด้านบน)
    drawSpeedTapChoices(2, tapP2ChoicesEl);
}

function drawSpeedTapChoices(playerNum, containerEl) {
    containerEl.innerHTML = '';
    gameState.tap.choices.forEach((choice, index) => {
        const btn = document.createElement('div');
        btn.classList.add('tap-choice-btn');

        const img = document.createElement('img');
        img.classList.add('tap-choice-img');
        img.src = `images/${choice.id}.png`;
        img.alt = choice.nameEn;

        btn.appendChild(img);

        btn.addEventListener('click', () => handleTapChoice(playerNum, choice, btn));
        containerEl.appendChild(btn);
    });
}

function handleTapChoice(playerNum, choice, btnEl) {
    if (!gameState.tap.active) return;

    // ตรวจสอบสถานะล็อกเอาต์ของคนกด
    if (playerNum === 1 && gameState.tap.p1Locked) return;
    if (playerNum === 2 && gameState.tap.p2Locked) return;

    const isCorrect = choice.id === gameState.tap.targetJob.id;

    if (isCorrect) {
        // แตะถูก! ให้หยุดบอร์ดทันที ป้องกันอีกคนแย่งกด
        gameState.tap.active = false;
        
        btnEl.classList.add('correct');
        playSound('correct');

        // เพิ่มคะแนน
        if (playerNum === 1) {
            gameState.tap.score1++;
            tapP1ScoreEl.textContent = gameState.tap.score1;
            tapP1StatusEl.textContent = 'เก่งมาก! +1';
            tapP1StatusEl.style.color = '#10b981';
            addCoins(1, 3);
            speakEnglish(`${gameState.player1.name} correct! ${gameState.tap.targetJob.sentence}`);
        } else {
            gameState.tap.score2++;
            tapP2ScoreEl.textContent = gameState.tap.score2;
            tapP2StatusEl.textContent = 'เก่งมาก! +1';
            tapP2StatusEl.style.color = '#10b981';
            addCoins(2, 3);
            speakEnglish(`${gameState.player2.name} correct! ${gameState.tap.targetJob.sentence}`);
        }

        // เช็คคะแนนรวมว่าใครถึง 5 ก่อน
        setTimeout(() => {
            if (gameState.tap.score1 >= 5 || gameState.tap.score2 >= 5) {
                const winnerName = gameState.tap.score1 >= 5 ? getPlayerDisplayName(1) : getPlayerDisplayName(2);
                const winnerNum = gameState.tap.score1 >= 5 ? 1 : 2;
                addCoins(winnerNum, 10);
                playSound('win');
                showCelebrationModal(`🏆 ${winnerName} ชนะศึกบัสเซอร์ความเร็ว! 🏆`, `คะแนนรวม ${gameState.tap.score1} ต่อ ${gameState.tap.score2}`, 'tap');
            } else {
                gameState.tap.active = true;
                nextSpeedTapRound();
            }
        }, 2000); // ดีเลย์ 2 วินาทีให้เห็นเอฟเฟกต์เฉลยและฟังประโยคภาษาอังกฤษ

    } else {
        // แตะผิด! ล็อกเอาต์ผู้เล่นคนนี้ 1.5 วินาที
        playSound('wrong');
        btnEl.classList.add('wrong');
        
        if (playerNum === 1) {
            gameState.tap.p1Locked = true;
            tapP1PanelContainer.classList.add('locked');
            tapP1StatusEl.textContent = 'ล็อก 1.5 วิ! ❌';
            tapP1StatusEl.style.color = '#ef4444';
            setTimeout(() => {
                btnEl.classList.remove('wrong');
                if (gameState.tap.active) {
                    gameState.tap.p1Locked = false;
                    tapP1PanelContainer.classList.remove('locked');
                    tapP1StatusEl.textContent = 'กดได้แล้ว!';
                    tapP1StatusEl.style.color = '';
                }
            }, 1500);
        } else {
            gameState.tap.p2Locked = true;
            tapP2PanelContainer.classList.add('locked');
            tapP2StatusEl.textContent = 'ล็อก 1.5 วิ! ❌';
            tapP2StatusEl.style.color = '#ef4444';
            setTimeout(() => {
                btnEl.classList.remove('wrong');
                if (gameState.tap.active) {
                    gameState.tap.p2Locked = false;
                    tapP2PanelContainer.classList.remove('locked');
                    tapP2StatusEl.textContent = 'กดได้แล้ว!';
                    tapP2StatusEl.style.color = '';
                }
            }, 1500);
        }
    }
}

// --- [ ระบบการสะสมเหรียญ & ร้านค้ารางวัล (Coins & Store Engine) ] ---

function getPlayerDisplayName(playerNum) {
    if (playerNum === 1) {
        const badge = gameState.player1.activeBadge ? ' ' + gameState.player1.activeBadge : '';
        return gameState.player1.name + badge;
    } else {
        const badge = gameState.player2.activeBadge ? ' ' + gameState.player2.activeBadge : '';
        return gameState.player2.name + badge;
    }
}

function updateDisplayNames() {
    document.querySelectorAll('.display-p1-name-txt').forEach(el => {
        el.textContent = getPlayerDisplayName(1);
    });
    document.querySelectorAll('.display-p2-name-txt').forEach(el => {
        el.textContent = getPlayerDisplayName(2);
    });
}

function updateCoinsUI() {
    if (p1CoinsDisplay) p1CoinsDisplay.textContent = gameState.player1.coins;
    if (p2CoinsDisplay) p2CoinsDisplay.textContent = gameState.player2.coins;
    if (storeP1Coins) storeP1Coins.textContent = gameState.player1.coins;
    if (storeP2Coins) storeP2Coins.textContent = gameState.player2.coins;
}

function addCoins(playerNum, amount) {
    initAudio();
    if (playerNum === 1) {
        gameState.player1.coins += amount;
    } else {
        gameState.player2.coins += amount;
    }
    updateCoinsUI();
    saveGameState();
    // เล่นเสียงเหรียญ
    playTone(987.77, 'sine', 0.08, 0.08); // B5
    setTimeout(() => playTone(1318.51, 'sine', 0.2, 0.08), 80); // E6
}

function initStore() {
    renderStoreForPlayer(1, storeP1Items);
    renderStoreForPlayer(2, storeP2Items);
    updateCoinsUI();
}

function renderStoreForPlayer(playerNum, containerEl) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    
    const player = playerNum === 1 ? gameState.player1 : gameState.player2;
    
    gameState.storeItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('store-item-card');
        
        const isUnlocked = item.type === 'badge' 
            ? player.unlockedBadges.includes(item.icon)
            : player.unlockedSounds.includes(item.id);
            
        const isEquipped = item.type === 'badge'
            ? player.activeBadge === item.icon
            : player.activeSound === item.id;
            
        if (isEquipped) {
            itemCard.classList.add('equipped');
        } else if (isUnlocked) {
            itemCard.classList.add('unlocked');
        }
        
        const iconEl = document.createElement('div');
        iconEl.classList.add('store-item-icon');
        iconEl.textContent = item.icon;
        
        const nameEl = document.createElement('div');
        nameEl.classList.add('store-item-name');
        nameEl.textContent = item.name;
        
        const actionBtn = document.createElement('button');
        actionBtn.classList.add('store-item-btn');
        
        if (isEquipped) {
            actionBtn.classList.add('equipped-btn');
            actionBtn.textContent = 'ใช้งานอยู่';
        } else if (isUnlocked) {
            actionBtn.textContent = 'สวมใส่';
            actionBtn.addEventListener('click', () => {
                equipStoreItem(playerNum, item);
            });
        } else {
            actionBtn.classList.add('buyable');
            actionBtn.textContent = `🪙 ${item.cost}`;
            actionBtn.addEventListener('click', () => {
                buyStoreItem(playerNum, item);
            });
        }
        
        itemCard.appendChild(iconEl);
        itemCard.appendChild(nameEl);
        itemCard.appendChild(actionBtn);
        
        containerEl.appendChild(itemCard);
    });
}

function buyStoreItem(playerNum, item) {
    initAudio();
    const player = playerNum === 1 ? gameState.player1 : gameState.player2;
    
    if (player.coins >= item.cost) {
        player.coins -= item.cost;
        
        if (item.type === 'badge') {
            player.unlockedBadges.push(item.icon);
            player.activeBadge = item.icon;
        } else {
            player.unlockedSounds.push(item.id);
            player.activeSound = item.id;
        }
        
        playSound('correct');
        initStore();
        updateDisplayNames();
        saveGameState();
    } else {
        playSound('wrong');
        alert('เหรียญทองไม่พอครับ! ไปเล่นเกมสะสมเหรียญเพิ่มก่อนนะ');
    }
}

function equipStoreItem(playerNum, item) {
    const player = playerNum === 1 ? gameState.player1 : gameState.player2;
    
    if (item.type === 'badge') {
        player.activeBadge = player.activeBadge === item.icon ? '' : item.icon;
    } else {
        player.activeSound = player.activeSound === item.id ? 'standard' : item.id;
    }
    
    playSound('click');
    initStore();
    updateDisplayNames();
    saveGameState();
}

// --- [ ระบบเชื่อมต่อเกมภายนอก (Embedded Games Loader) ] ---

let embedClaimedThisSession = false;

function initEmbedScreen() {
    embedClaimedThisSession = false;
    embedClaimCoinsBtn.classList.add('highlight-btn');
    embedClaimCoinsBtn.textContent = '🪙 รับโบนัสเล่นเกม! (+20)';
    
    // โหลดเกมแรกในตัวเลือกขึ้น iframe
    const selectedUrl = embedGameSelect.value;
    embedIframe.src = selectedUrl;
}

// --- [ หน้าต่างประกาศชัยชนะ Winner Modal Controller ] ---

let currentWinModalGame = 'xo';

function showCelebrationModal(title, subtitle, gameType) {
    currentWinModalGame = gameType;
    winTitle.textContent = title;
    winSubtitle.textContent = subtitle;
    winModal.classList.add('active');
    startConfetti();
}

function hideWinModal() {
    winModal.classList.remove('active');
    stopConfetti();
}

// คลิกเริ่มเล่นใหม่จากใน Modal
modalNextBtn.addEventListener('click', () => {
    hideWinModal();
    if (currentWinModalGame === 'xo') {
        initXO();
    } else if (currentWinModalGame === 'memory') {
        initMemory();
    } else if (currentWinModalGame === 'spelling') {
        gameState.spelling.currentWordIndex = 0;
        gameState.spelling.score = 0;
        initSpelling();
    } else if (currentWinModalGame === 'tap') {
        initSpeedTap();
    } else if (currentWinModalGame === 'spooky') {
        initSpookyEscape();
    }
});

// คลิกกลับหน้าแรกจากใน Modal
modalHomeBtn.addEventListener('click', () => {
    hideWinModal();
    showScreen('arcade-screen');
});

// --- [ การควบคุมเชื่อมหน้าจอนำทาง (Navbar Navigation) ] ---

// กดเริ่มต้นคลังเกมจากหน้าลงชื่อแรกสุด
startBtn.addEventListener('click', () => {
    const p1 = p1NameInput.value.trim();
    const p2 = p2NameInput.value.trim();
    
    gameState.player1.name = p1 !== "" ? p1 : "น้องอันดา";
    gameState.player2.name = p2 !== "" ? p2 : "พี่อชิ";
    
    // ทักทายในเมนูหลักอาเขต
    updateDisplayNames();
    updateCoinsUI();
    saveGameState();
    
    initAudio();
    playSound('click');
    showScreen('arcade-screen');
});

// แถบเปลี่ยนชื่อในหน้าตั้งค่าใหม่
document.getElementById('arcade-back-btn').addEventListener('click', () => {
    playSound('click');
    showScreen('setup-screen');
});

// ปุ่มคลิกเลือกเกมในเมนูหน้าอาเขตหลัก
document.getElementById('play-xo-card').addEventListener('click', () => {
    initAudio();
    playSound('click');
    showScreen('xo-screen');
    updateDisplayNames();
    initXO();
});

document.getElementById('play-memory-card').addEventListener('click', () => {
    initAudio();
    playSound('click');
    showScreen('memory-screen');
    updateDisplayNames();
    initMemory();
});

document.getElementById('play-spelling-card').addEventListener('click', () => {
    initAudio();
    playSound('click');
    showScreen('spelling-screen');
    updateDisplayNames();
    gameState.spelling.currentWordIndex = 0;
    gameState.spelling.score = 0;
    initSpelling();
});

document.getElementById('play-tap-card').addEventListener('click', () => {
    initAudio();
    playSound('click');
    showScreen('tap-screen');
    updateDisplayNames();
    initSpeedTap();
});

document.getElementById('play-store-card').addEventListener('click', () => {
    initAudio();
    playSound('click');
    showScreen('store-screen');
    updateDisplayNames();
    initStore();
});

document.getElementById('play-embed-card').addEventListener('click', () => {
    initAudio();
    playSound('click');
    showScreen('embed-screen');
    updateDisplayNames();
    initEmbedScreen();
});

document.getElementById('play-spooky-card').addEventListener('click', () => {
    initAudio();
    playSound('click');
    showScreen('spooky-screen');
    updateDisplayNames();
    initSpookyEscape();
});

// ปุ่มกดกากบาทสีมุมซ้ายบนเพื่อย้อนกลับเมนูหลักอาเขตคลังเกมส์
document.querySelectorAll('.btn-back-menu').forEach(btn => {
    btn.addEventListener('click', () => {
        playSound('click');
        showScreen('arcade-screen');
        // รีเซ็ต iframe เมื่อย้ายหน้าออก
        embedIframe.src = "about:blank";
    });
});

// จัดการเลือกเกมภายนอก
embedGameSelect.addEventListener('change', () => {
    playSound('click');
    embedIframe.src = embedGameSelect.value;
});

// จัดการรับเหรียญเล่นเกมภายนอก
embedClaimCoinsBtn.addEventListener('click', () => {
    if (embedClaimedThisSession) {
        playSound('wrong');
        alert('คุณพ่อรับโบนัสของรอบนี้ไปแล้วครับ! ลองสลับเลือกด่านเกมอื่นแล้วกลับมากดใหม่นะ');
        return;
    }
    
    embedClaimedThisSession = true;
    embedClaimCoinsBtn.classList.remove('highlight-btn');
    embedClaimCoinsBtn.textContent = '🪙 รับเหรียญสำเร็จ! (+20)';
    
    // มอบเหรียญ 20 เหรียญให้ผู้เล่นทั้งสองคนแบ่งกันคนละ 10 เหรียญ
    addCoins(1, 10);
    addCoins(2, 10);
    playSound('correct');
});

// สลับเปิด/ปิดปิดเสียงทับทุกหน้าจอ
document.querySelectorAll('.mute-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        gameState.soundEnabled = !gameState.soundEnabled;
        
        document.querySelectorAll('.mute-toggle-btn').forEach(b => {
            if (gameState.soundEnabled) {
                b.textContent = '🔊 มีเสียง';
                b.classList.remove('btn-outline');
            } else {
                b.textContent = '🔇 ปิดเสียง';
                b.classList.add('btn-outline');
            }
        });
    });
});

// ควบคุมปุ่มล้างข้อมูลสะสมทั้งหมด
document.getElementById('reset-all-data-btn').addEventListener('click', () => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะล้างข้อมูลเหรียญทองและของรางวัลที่ปลดล็อกทั้งหมด?')) {
        localStorage.removeItem('arcade_game_state');
        
        // Reset gameState
        gameState.player1.name = 'น้องอันดา';
        gameState.player1.coins = 10;
        gameState.player1.activeBadge = '';
        gameState.player1.unlockedBadges = [];
        gameState.player1.activeSound = 'standard';
        gameState.player1.unlockedSounds = ['standard'];
        
        gameState.player2.name = 'พี่อชิ';
        gameState.player2.coins = 10;
        gameState.player2.activeBadge = '';
        gameState.player2.unlockedBadges = [];
        gameState.player2.activeSound = 'standard';
        gameState.player2.unlockedSounds = ['standard'];
        
        if (p1NameInput) p1NameInput.value = gameState.player1.name;
        if (p2NameInput) p2NameInput.value = gameState.player2.name;
        
        updateDisplayNames();
        updateCoinsUI();
        initAudio();
        playSound('click');
        alert('ล้างข้อมูลสะสมเรียบร้อยแล้วครับ!');
    }
});

// ควบคุมปุ่มเริ่มใหม่ของเกม XO
document.getElementById('xo-reset-board-btn').addEventListener('click', initXO);
document.getElementById('xo-reset-scores-btn').addEventListener('click', () => {
    gameState.xo.score1 = 0;
    gameState.xo.score2 = 0;
    initXO();
});

// สวิตช์โหมดการจับคู่การ์ดความจำ (Versus <-> Solo)
document.getElementById('mem-mode-vs').addEventListener('click', (e) => {
    if (gameState.memory.mode === 'versus') return;
    document.getElementById('mem-mode-vs').classList.add('active');
    document.getElementById('mem-mode-solo').classList.remove('active');
    gameState.memory.mode = 'versus';
    initMemory();
});

document.getElementById('mem-mode-solo').addEventListener('click', (e) => {
    if (gameState.memory.mode === 'solo') return;
    document.getElementById('mem-mode-solo').classList.add('active');
    document.getElementById('mem-mode-vs').classList.remove('active');
    gameState.memory.mode = 'solo';
    initMemory();
});

// ควบคุมรีเซ็ตการ์ดความจำ
document.getElementById('mem-reset-btn').addEventListener('click', initMemory);

// ควบคุมปุ่มหน้าสะกดคำ
document.getElementById('spell-speak-btn').addEventListener('click', () => {
    initAudio();
    speakEnglish(gameState.spelling.targetWord);
});

// ควบคุมปุ่มกดฟังเสียงอีกครั้งของเกม Speed Tap
document.getElementById('tap-speak-btn').addEventListener('click', () => {
    if (gameState.tap.active && gameState.tap.targetJob) {
        initAudio();
        speakEnglish(gameState.tap.targetJob.nameEn);
    }
});

document.getElementById('spell-skip-btn').addEventListener('click', () => {
    playSound('click');
    stopConfetti(); // หยุดเอฟเฟกต์พลุกระดาษเมื่อข้ามหรือกดไปต่อ
    
    gameState.spelling.currentWordIndex++;
    if (gameState.spelling.currentWordIndex < occupations.length) {
        initSpelling();
    } else {
        speakEnglish("All occupations completed! Excellent spelling!");
        showCelebrationModal(
            "🎉 เล่นทบทวนสะกดคำศัพท์เสร็จสิ้น 🎉",
            `คุณได้รับคะแนนรวมทั้งหมด ${gameState.spelling.score} คะแนน!`,
            'spelling'
        );
    }
});

// --- [ ระบบเอฟเฟกต์พลุกระดาษ Confetti System ] ---

const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let animationFrameId = null;
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

class ConfettiParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 6;
        this.color = `hsl(${Math.random() * 360}, 90%, 65%)`;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 + 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
            this.speedY = Math.random() * 3 + 2;
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function startConfetti() {
    resizeCanvas();
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new ConfettiParticle());
    }
    animateConfetti();
}

function stopConfetti() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Bind Spooky Escape Retry button
spookyRetryBtn.addEventListener('click', () => {
    playSound('click');
    initSpookyEscape();
});

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    animationFrameId = requestAnimationFrame(animateConfetti);
}

// --- [ 👻 เกมที่ 5: Spooky Phonics Escape ] ---

function initSpookyEscape() {
    hideWinModal();
    spookyBooOverlay.classList.remove('active');
    
    // รีเซ็ตตำแหน่งระยะทาง
    gameState.spooky.playerPos = 30;
    gameState.spooky.ghostPos = 0;
    gameState.spooky.active = true;
    gameState.spooky.success = false;
    gameState.spooky.currentWordIndex = Math.floor(Math.random() * occupations.length); // สุ่มจับขึ้นมาคำแรก
    
    updateSpookyTrackUI();
    
    // ตั้งค่าคำถามแรก
    nextSpookyWord();
    
    // เริ่มระบบเตือนและขยับตัวผี
    startSpookyThreatTimer();
}

function updateSpookyTrackUI() {
    // อัปเดตตำแหน่งไอคอนผีและผู้เล่นทาง CSS Left
    spookyGhostMarker.style.left = `${gameState.spooky.ghostPos}%`;
    spookyPlayerMarker.style.left = `${gameState.spooky.playerPos}%`;
    
    // คำนวณระยะห่าง
    const distance = Math.max(0, Math.floor((gameState.spooky.playerPos - gameState.spooky.ghostPos)));
    spookyDistanceStatus.textContent = `ผีอยู่ห่างจากน้องๆ: ${distance} เมตร! (ทางออกอยู่ที่ 100 เมตร)`;
}

function nextSpookyWord() {
    gameState.spooky.currentJob = occupations[gameState.spooky.currentWordIndex];
    gameState.spooky.targetWord = gameState.spooky.currentJob.nameEn;
    gameState.spooky.typedWord = [];
    
    spookyHintImg.src = `images/${gameState.spooky.currentJob.id}.png`;
    spookyHintImg.alt = gameState.spooky.targetWord;
    spookyHintTh.textContent = `ความหมาย: ${gameState.spooky.currentJob.nameTh}`;
    
    speakEnglish(gameState.spooky.targetWord);
    
    // วาดช่องคำตอบ
    spookySlots.innerHTML = '';
    for (let i = 0; i < gameState.spooky.targetWord.length; i++) {
        const char = gameState.spooky.targetWord[i];
        const slot = document.createElement('div');
        if (char === ' ') {
            slot.style.width = '20px';
            slot.style.border = 'none';
            slot.style.background = 'transparent';
        } else {
            slot.classList.add('letter-slot');
        }
        spookySlots.appendChild(slot);
    }
    
    // วาดธนาคารตัวอักษรปนกัน
    let letterList = gameState.spooky.targetWord.replace(/\s+/g, '').split('');
    letterList = shuffleArray(letterList);
    
    spookyBank.innerHTML = '';
    letterList.forEach((letter) => {
        const btn = document.createElement('div');
        btn.classList.add('letter-bubble');
        btn.textContent = letter;
        btn.addEventListener('click', () => handleSpookyLetterClick(letter, btn));
        spookyBank.appendChild(btn);
    });
}

function handleSpookyLetterClick(letter, btn) {
    if (!gameState.spooky.active || gameState.spooky.success) return;
    initAudio();
    
    const target = gameState.spooky.targetWord;
    const currentIndex = gameState.spooky.typedWord.length;
    let expectedLetter = target[currentIndex];
    
    if (expectedLetter === ' ') {
        gameState.spooky.typedWord.push(' ');
        expectedLetter = target[currentIndex + 1];
    }
    
    if (letter.toLowerCase() === expectedLetter.toLowerCase()) {
        // ถูกต้อง!
        gameState.spooky.typedWord.push(letter);
        
        const activeIndex = gameState.spooky.typedWord.length - 1;
        const targetSlot = spookySlots.children[activeIndex];
        targetSlot.textContent = letter;
        targetSlot.classList.add('filled');
        
        btn.classList.add('hidden');
        playSound('correct');
        speakEnglish(letter);
        
        if (gameState.spooky.typedWord.length === target.length) {
            handleSpookyWordSuccess();
        }
    } else {
        // ผิดตัวอักษร! ขยับผีใกล้เข้ามาทันทีเป็นโทษ!
        btn.classList.add('shake');
        playSound('wrong');
        speakEnglish(letter);
        
        // ผีพุ่งกระโจนเข้าหา
        gameState.spooky.ghostPos = Math.min(gameState.spooky.playerPos, gameState.spooky.ghostPos + 6);
        updateSpookyTrackUI();
        triggerSpookyScreenShake();
        
        setTimeout(() => {
            btn.classList.remove('shake');
        }, 400);
        
        checkSpookyStatus();
    }
}

function triggerSpookyScreenShake() {
    const screenEl = document.getElementById('spooky-screen');
    if (screenEl) {
        screenEl.classList.add('screen-shake-effect');
        setTimeout(() => {
            screenEl.classList.remove('screen-shake-effect');
        }, 400);
    }
}

function handleSpookyWordSuccess() {
    gameState.spooky.success = true;
    
    // ผู้เล่นวิ่งหนีห่างออกไป! (+15 เมตร)
    gameState.spooky.playerPos = Math.min(100, gameState.spooky.playerPos + 15);
    updateSpookyTrackUI();
    
    playSound('win');
    startConfetti();
    
    const job = gameState.spooky.currentJob;
    setTimeout(() => {
        speakEnglish(`${job.nameEn}. ${job.sentence}`);
    }, 1000);
    
    // สุ่มด่านถัดไปหลังจากพักเหนื่อย 2 วินาที
    setTimeout(() => {
        if (!gameState.spooky.active) return;
        stopConfetti();
        
        if (gameState.spooky.playerPos >= 100) {
            handleSpookyEscapeWin();
        } else {
            gameState.spooky.success = false;
            // สุ่มอาชีพถัดไป
            gameState.spooky.currentWordIndex = Math.floor(Math.random() * occupations.length);
            nextSpookyWord();
        }
    }, 2200);
}

function startSpookyThreatTimer() {
    if (gameState.spooky.threatInterval) {
        clearInterval(gameState.spooky.threatInterval);
    }
    
    gameState.spooky.threatCountdown = 6;
    spookyTimerCountdown.textContent = gameState.spooky.threatCountdown;
    
    gameState.spooky.threatInterval = setInterval(() => {
        if (!gameState.spooky.active || gameState.spooky.success) return;
        
        gameState.spooky.threatCountdown--;
        spookyTimerCountdown.textContent = gameState.spooky.threatCountdown;
        
        if (gameState.spooky.threatCountdown <= 0) {
            // ผีคืบคลานเข้าหา 1 ก้าว (+8 เมตร)
            gameState.spooky.ghostPos = Math.min(gameState.spooky.playerPos, gameState.spooky.ghostPos + 8);
            updateSpookyTrackUI();
            
            // เล่นเสียงขยับตัวผีหลอก
            playSpookySound('howl');
            triggerSpookyScreenShake();
            
            // รีเซ็ตเวลานับถอยหลัง
            gameState.spooky.threatCountdown = 6;
            spookyTimerCountdown.textContent = gameState.spooky.threatCountdown;
            
            checkSpookyStatus();
        }
    }, 1000);
}

function checkSpookyStatus() {
    // ถ้าผีวิ่งกวดตามทันน้อง
    if (gameState.spooky.ghostPos >= gameState.spooky.playerPos) {
        handleSpookyCaught();
    }
}

function handleSpookyCaught() {
    gameState.spooky.active = false;
    if (gameState.spooky.threatInterval) {
        clearInterval(gameState.spooky.threatInterval);
    }
    
    // เสียงเสียงแฮ่ผีขำๆ และแสดงม่านหน้ากาก Boo!
    playSpookySound('boo');
    setTimeout(() => {
        playSpookySound('laugh');
    }, 250);
    
    spookyBooOverlay.classList.add('active');
    
    // ปลอบใจ มอบ 5 เหรียญ (คนละ 2-3 เหรียญ)
    addCoins(1, 2);
    addCoins(2, 3);
}

function handleSpookyEscapeWin() {
    gameState.spooky.active = false;
    if (gameState.spooky.threatInterval) {
        clearInterval(gameState.spooky.threatInterval);
    }
    
    playSound('win');
    // ชนะหลบหนีได้ +20 เหรียญทองแบ่งคนละ 10
    addCoins(1, 10);
    addCoins(2, 10);
    
    showCelebrationModal(
        "🎉 ยินดีด้วย! หนีออกจากปราสาทร้างสำเร็จ! 🎉",
        "น้องอันดาและพี่อชิเก่งมากเลย ช่วยกันสะกดหนีผีร้ายทันเวลา!",
        "spooky"
    );
}

function playSpookySound(type) {
    if (!gameState.soundEnabled) return;
    initAudio();
    const ctx = gameState.audioCtx;
    if (!ctx) return;
    
    try {
        if (type === 'howl') {
            // เสียงลมพัดหวีดหวิว / เลื่อนความถี่
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(120, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.6);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.2);
            
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.2);
        } else if (type === 'laugh') {
            // เสียงผีหัวเราะ คีย์ต่ำๆ คลื่น Sawtooth
            const now = ctx.currentTime;
            [220, 190, 160, 130].forEach((freq, idx) => {
                const playTime = now + (idx * 0.15);
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, playTime);
                gain.gain.setValueAtTime(0.1, playTime);
                gain.gain.exponentialRampToValueAtTime(0.001, playTime + 0.25);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(playTime);
                osc.stop(playTime + 0.25);
            });
        } else if (type === 'boo') {
            // เสียงกระโชกสะดุ้งขำๆ
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(280, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.6);
            
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        }
    } catch(e) {
        console.error("Spooky sound error: ", e);
    }
}

// โหลดข้อมูลจาก LocalStorage ตอนเริ่มต้นรันสคริปต์
loadGameState();
