// ═══════════════════════════════════════════════
//  AI AVATAR — Animated girl with Web Speech API
// ═══════════════════════════════════════════════

let avatarState = { speaking: false, blinkInterval: null, speakInterval: null };
let summaryText = '';

function initAvatar(name, lang) {
  const container = document.getElementById('avatar-container');
  container.innerHTML = buildAvatarSVG();
  startBlinking();

  const greeting = lang === 'en'
    ? `Hello, ${name}! I've analyzed your questionnaire. Tap the button below to hear the key findings from our expert team.`
    : `Привет, ${name}! Я изучила твою анкету. Нажми кнопку ниже, чтобы услышать главные выводы от нашей команды экспертов.`;

  setAvatarText(greeting);
}

function buildAvatarSVG() {
  return `
  <svg id="avatar-svg" viewBox="0 0 120 160" width="90" height="120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FDDCAB"/>
        <stop offset="100%" stop-color="#F5C28A"/>
      </radialGradient>
      <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2D1B69"/>
        <stop offset="100%" stop-color="#7C3AED"/>
      </linearGradient>
      <linearGradient id="dressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7C3AED"/>
        <stop offset="100%" stop-color="#EC4899"/>
      </linearGradient>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#FCD34D"/>
      </linearGradient>
    </defs>

    <!-- Shadow -->
    <ellipse cx="60" cy="158" rx="30" ry="5" fill="rgba(124,58,237,0.2)"/>

    <!-- Body / Dress -->
    <path d="M30 105 Q20 130 22 155 L98 155 Q100 130 90 105 Q75 120 60 118 Q45 120 30 105Z"
          fill="url(#dressGrad)" opacity="0.95"/>

    <!-- Neck -->
    <rect x="52" y="88" width="16" height="20" rx="6" fill="url(#skinGrad)"/>

    <!-- Arms -->
    <path d="M32 108 Q18 115 16 130 Q18 132 20 131 Q25 118 35 114Z" fill="url(#skinGrad)"/>
    <path d="M88 108 Q102 115 104 130 Q102 132 100 131 Q95 118 85 114Z" fill="url(#skinGrad)"/>

    <!-- Collar / Neckline -->
    <path d="M40 105 Q60 112 80 105 L75 95 Q60 102 45 95Z" fill="rgba(255,255,255,0.2)"/>

    <!-- Head -->
    <ellipse id="avatar-head" cx="60" cy="60" rx="32" ry="36" fill="url(#skinGrad)"/>

    <!-- Hair back -->
    <path d="M28 55 Q30 20 60 18 Q90 20 92 55 Q88 48 60 46 Q32 48 28 55Z"
          fill="url(#hairGrad)"/>

    <!-- Hair sides -->
    <path d="M28 55 Q24 70 28 90 Q32 85 32 75 Q30 65 32 55Z" fill="url(#hairGrad)"/>
    <path d="M92 55 Q96 70 92 90 Q88 85 88 75 Q90 65 88 55Z" fill="url(#hairGrad)"/>

    <!-- Hair top -->
    <path d="M30 52 Q60 15 90 52 Q75 40 60 38 Q45 40 30 52Z" fill="url(#hairGrad)"/>

    <!-- Ears -->
    <ellipse cx="28" cy="62" rx="5" ry="7" fill="url(#skinGrad)"/>
    <ellipse cx="92" cy="62" rx="5" ry="7" fill="url(#skinGrad)"/>

    <!-- Eye whites -->
    <ellipse id="eye-l-white" cx="47" cy="62" rx="9" ry="10" fill="white"/>
    <ellipse id="eye-r-white" cx="73" cy="62" rx="9" ry="10" fill="white"/>

    <!-- Iris left -->
    <g id="eye-l-iris">
      <ellipse cx="47" cy="64" rx="6" ry="7" fill="#4F46E5"/>
      <ellipse cx="47" cy="64" rx="4" ry="5" fill="#1E1B4B"/>
      <ellipse cx="45" cy="62" rx="1.5" ry="1.5" fill="white"/>
      <ellipse cx="49" cy="65" rx="1" ry="1" fill="rgba(255,255,255,0.6)"/>
    </g>

    <!-- Iris right -->
    <g id="eye-r-iris">
      <ellipse cx="73" cy="64" rx="6" ry="7" fill="#4F46E5"/>
      <ellipse cx="73" cy="64" rx="4" ry="5" fill="#1E1B4B"/>
      <ellipse cx="71" cy="62" rx="1.5" ry="1.5" fill="white"/>
      <ellipse cx="75" cy="65" rx="1" ry="1" fill="rgba(255,255,255,0.6)"/>
    </g>

    <!-- Eyelids (for blinking) -->
    <rect id="lid-l" x="38" y="52" width="18" height="0" rx="4" fill="url(#skinGrad)"/>
    <rect id="lid-r" x="64" y="52" width="18" height="0" rx="4" fill="url(#skinGrad)"/>

    <!-- Eyebrows -->
    <path d="M38 52 Q47 48 56 52" stroke="#2D1B69" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M64 52 Q73 48 82 52" stroke="#2D1B69" stroke-width="2" fill="none" stroke-linecap="round"/>

    <!-- Blush -->
    <ellipse cx="37" cy="72" rx="8" ry="5" fill="#FFB3C6" opacity="0.5"/>
    <ellipse cx="83" cy="72" rx="8" ry="5" fill="#FFB3C6" opacity="0.5"/>

    <!-- Nose -->
    <ellipse cx="60" cy="74" rx="3" ry="2" fill="rgba(200,150,100,0.3)"/>

    <!-- Mouth closed -->
    <path id="mouth-closed" d="M52 82 Q60 88 68 82" stroke="#E07070" stroke-width="2.5" fill="none" stroke-linecap="round"/>

    <!-- Mouth open (speaking) -->
    <g id="mouth-open" style="display:none">
      <path d="M51 81 Q60 86 69 81" stroke="#C05050" stroke-width="1.5" fill="none"/>
      <ellipse cx="60" cy="85" rx="9" ry="5" fill="#B03060"/>
      <ellipse cx="60" cy="83" rx="7" ry="2" fill="#FF8FAB"/>
    </g>

    <!-- Hair highlights -->
    <path d="M38 22 Q48 18 55 24" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none" stroke-linecap="round"/>

    <!-- Stars floating around -->
    <text id="star1" x="8" y="25" font-size="12" fill="url(#starGrad)" opacity="0.8"
      style="animation: floatStar1 3s ease-in-out infinite">✦</text>
    <text id="star2" x="98" y="35" font-size="8" fill="url(#starGrad)" opacity="0.6"
      style="animation: floatStar2 4s ease-in-out infinite 1s">★</text>
    <text id="star3" x="5" y="80" font-size="6" fill="#C4B5FD" opacity="0.7"
      style="animation: floatStar1 5s ease-in-out infinite 0.5s">✦</text>

    <!-- Earrings -->
    <circle cx="23" cy="70" r="3" fill="#F59E0B"/>
    <circle cx="97" cy="70" r="3" fill="#F59E0B"/>

    <!-- Book/magic wand accessory -->
    <g transform="translate(96, 120) rotate(-20)">
      <rect x="0" y="0" width="18" height="24" rx="2" fill="#F59E0B" opacity="0.9"/>
      <rect x="2" y="4" width="14" height="1.5" rx="1" fill="rgba(0,0,0,0.3)"/>
      <rect x="2" y="8" width="12" height="1.5" rx="1" fill="rgba(0,0,0,0.3)"/>
      <rect x="2" y="12" width="10" height="1.5" rx="1" fill="rgba(0,0,0,0.3)"/>
      <text x="4" y="22" font-size="8" fill="rgba(0,0,0,0.5)">✦</text>
    </g>
  </svg>
  <style>
    @keyframes floatStar1 {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-6px) rotate(20deg); }
    }
    @keyframes floatStar2 {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(5px) rotate(-15deg); }
    }
    @keyframes avatarBob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    #avatar-svg { animation: avatarBob 3s ease-in-out infinite; }
  </style>`;
}

// ─── Blinking animation ────────────────────────────
function startBlinking() {
  if (avatarState.blinkInterval) clearInterval(avatarState.blinkInterval);
  avatarState.blinkInterval = setInterval(() => {
    blink();
  }, 3000 + Math.random() * 2000);
}

function blink() {
  const lidL = document.getElementById('lid-l');
  const lidR = document.getElementById('lid-r');
  if (!lidL) return;

  let h = 0;
  const openH = 20;
  const down = setInterval(() => {
    h += 4;
    if (h >= openH) { clearInterval(down); setTimeout(closeEye, 100); }
    lidL.setAttribute('height', h);
    lidR.setAttribute('height', h);
    lidL.setAttribute('y', 52);
    lidR.setAttribute('y', 52);
  }, 15);

  function closeEye() {
    const up = setInterval(() => {
      h -= 4;
      if (h <= 0) { h = 0; clearInterval(up); }
      lidL.setAttribute('height', h);
      lidR.setAttribute('height', h);
    }, 15);
  }
}

// ─── Speaking animation ────────────────────────────
function startSpeakAnimation() {
  const mClosed = document.getElementById('mouth-closed');
  const mOpen = document.getElementById('mouth-open');
  if (!mClosed) return;
  avatarState.speakInterval = setInterval(() => {
    const isOpen = mOpen.style.display !== 'none';
    mClosed.style.display = isOpen ? 'block' : 'none';
    mOpen.style.display = isOpen ? 'none' : 'block';
  }, 150);
}

function stopSpeakAnimation() {
  clearInterval(avatarState.speakInterval);
  const mClosed = document.getElementById('mouth-closed');
  const mOpen = document.getElementById('mouth-open');
  if (mClosed) mClosed.style.display = 'block';
  if (mOpen) mOpen.style.display = 'none';
}

// ─── Text bubble ─────────────────────────────────
function setAvatarText(text) {
  const el = document.getElementById('avatar-text');
  if (el) el.textContent = text;
}

// ─── Speech synthesis ─────────────────────────────
function prepareAvatarSummary(fullText, lang) {
  const lines = fullText.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  const excerpt = lines.slice(0, 15).join(' ').substring(0, 600);

  const intro = lang === 'en'
    ? `Analysis complete! Here are the main findings from your expert team. `
    : `Анализ завершён! Вот главные выводы от команды экспертов. `;

  summaryText = intro + excerpt + (lang === 'en' ? ' ... See full analysis below.' : ' ... Смотри полный анализ ниже.');

  const bubble = lang === 'en'
    ? 'Analysis ready! Press the button to hear the summary.'
    : 'Анализ готов! Нажми кнопку, чтобы услышать резюме.';
  setAvatarText(bubble);
}

function speakSummary() {
  if (!window.speechSynthesis) {
    alert('Ваш браузер не поддерживает синтез речи.');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(summaryText);

  // Choose voice language
  utterance.lang = state.lang === 'en' ? 'en-US' : 'ru-RU';
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  utterance.volume = 1;

  // Try to find a good Russian/English female voice
  const voices = window.speechSynthesis.getVoices();
  const targetLang = state.lang === 'en' ? 'en' : 'ru';
  const femaleVoice = voices.find(v =>
    v.lang.toLowerCase().startsWith(targetLang) &&
    (v.name.includes('Female') || v.name.includes('female') || v.name.includes('Милена') ||
     v.name.includes('Алёна') || v.name.includes('Victoria') || v.name.includes('Samantha') ||
     v.name.includes('Google') || v.name.includes('Microsoft') || v.gender === 'female')
  ) || voices.find(v => v.lang.toLowerCase().startsWith(targetLang));

  if (femaleVoice) utterance.voice = femaleVoice;

  utterance.onstart = () => {
    isSpeaking = true;
    startSpeakAnimation();
    document.getElementById('btn-speak').classList.add('speaking');
    document.getElementById('txt-speak').textContent = UI[state.lang].stopSpeak;
    setAvatarText(summaryText.substring(0, 120) + '...');
  };

  utterance.onend = () => {
    isSpeaking = false;
    stopSpeakAnimation();
    document.getElementById('btn-speak').classList.remove('speaking');
    document.getElementById('txt-speak').textContent = UI[state.lang].speak;
    const done = state.lang === 'en'
      ? 'I\'ve finished reading. Scroll down to see the full analysis!'
      : 'Я закончила. Прокрути вниз, чтобы увидеть полный анализ!';
    setAvatarText(done);
  };

  utterance.onerror = (e) => {
    isSpeaking = false;
    stopSpeakAnimation();
    document.getElementById('btn-speak').classList.remove('speaking');
  };

  window.speechSynthesis.speak(utterance);
}

// Preload voices on page load
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
