const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let intentosNo = 0;

// Sonidos Arcade
function playBip() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

function playWinSound() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.15);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 0.15);
    });
}

// Lluvia de corazones
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let hearts = [];
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

class Heart {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 10 + 10;
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = ['#ff4d6d', '#ff758f', '#c9184a'][Math.floor(Math.random()*3)];
    }
    update() { this.y += this.speed; if (this.y > canvas.height) this.reset(); }
    draw() { ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color; ctx.font = `${this.size}px Arial`; ctx.fillText('❤', this.x, this.y); }
}

for (let i = 0; i < 80; i++) hearts.push(new Heart());
function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); hearts.forEach(h => { h.update(); h.draw(); }); requestAnimationFrame(animate); }
animate(); // Inicia inmediatamente

// Lógica de pantallas e interacción
const splash = document.getElementById('splash-screen');
const mainUI = document.getElementById('main-ui');
const btnNo = document.getElementById('btn-no');
const emojis = ['😢', '💔', '❌', '👎', '🥺'];

function iniciar() { 
    if (audioCtx.state === 'suspended') audioCtx.resume(); 
    splash.style.opacity = '0'; 
    setTimeout(() => { splash.classList.add('hidden'); mainUI.classList.remove('hidden'); }, 600); 
}
window.addEventListener('keydown', iniciar);
window.addEventListener('click', iniciar);

// URL Params
const urlParams = new URLSearchParams(window.location.search);
const from = urlParams.get('From') || 'Carlitos';
const to = urlParams.get('to') || 'Georgea';
document.getElementById('names-display').innerText = `P1: ${from.toUpperCase()} | P2: ${to.toUpperCase()}`;

// Efecto botón NO
const moverBoton = (e) => {
    intentosNo++;
    if (intentosNo === 3) alert("ahhh, no quieres no ?");

    playBip();
    const emoji = document.createElement('span');
    emoji.className = 'cursor-emoji';
    emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    const cx = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const cy = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    emoji.style.left = cx + 'px';
    emoji.style.top = cy + 'px';
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1000);

    btnNo.style.position = "fixed";
    const x = Math.random() * (window.innerWidth - btnNo.offsetWidth - 40) + 20;
    const y = Math.random() * (window.innerHeight - btnNo.offsetHeight - 40) + 20;
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
};

btnNo.addEventListener('mouseenter', moverBoton);
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); moverBoton(e); });

// Botón SÍ
document.getElementById('btn-yes').addEventListener('click', () => {
    playWinSound();
    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('success-screen').classList.remove('hidden');
    for (let i = 0; i < 200; i++) hearts.push(new Heart());
});