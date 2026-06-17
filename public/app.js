// ═══════════════════════════════════════════════
//  GRADUATE ADVISOR — Main Application Logic
// ═══════════════════════════════════════════════

let state = {
  lang: 'ru',
  grade: null,
  currentSection: 0,
  answers: {},
  numerology: null
};

const UI = {
  ru: {
    back: 'Назад', prev: 'Назад', next: 'Далее', submit: '🚀 Получить анализ!',
    analyzing: 'Команда экспертов анализирует данные...',
    resultsTitle: 'Персональный анализ', print: 'Печать', restart: 'Заново', newAnalysis: 'Новый анализ',
    speak: 'Озвучить резюме', stopSpeak: 'Остановить',
    chooseGrade: 'Выберите класс:', grade9: 'класс → Колледж', grade11: 'класс → Институт',
    numerologyTitle: '🔮 Нумерологический портрет',
    lifePathLabel: 'Число жизненного пути', expressionLabel: 'Число выражения',
    zodiacLabel: 'Знак зодиака', chineseLabel: 'Китайский зодиак', personalYearLabel: 'Личный год 2026',
    masterLabel: '⭐ МАСТЕР-ЧИСЛО!',
    error: 'Произошла ошибка. Проверьте подключение к серверу.',
    required: 'Пожалуйста, введите имя и дату рождения'
  },
  en: {
    back: 'Back', prev: 'Back', next: 'Next', submit: '🚀 Get Analysis!',
    analyzing: 'Team of experts is analyzing your data...',
    resultsTitle: 'Personal Analysis', print: 'Print', restart: 'Restart', newAnalysis: 'New Analysis',
    speak: 'Read Summary', stopSpeak: 'Stop',
    chooseGrade: 'Choose grade:', grade9: 'grade → College', grade11: 'grade → University',
    numerologyTitle: '🔮 Numerological Portrait',
    lifePathLabel: 'Life Path Number', expressionLabel: 'Expression Number',
    zodiacLabel: 'Zodiac Sign', chineseLabel: 'Chinese Zodiac', personalYearLabel: 'Personal Year 2026',
    masterLabel: '⭐ MASTER NUMBER!',
    error: 'An error occurred. Check server connection.',
    required: 'Please enter name and date of birth'
  }
};

// ─── Init ───────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  generateStars();
  showPage('landing');
});

function generateStars() {
  const s1 = document.getElementById('stars');
  const s2 = document.getElementById('stars2');
  [s1, s2].forEach(el => {
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div');
      star.style.cssText = `
        position:absolute;
        width:${Math.random()*2+1}px;
        height:${Math.random()*2+1}px;
        background:rgba(255,255,255,${Math.random()*0.8+0.2});
        border-radius:50%;
        top:${Math.random()*100}%;
        left:${Math.random()*100}%;
        animation:twinkle ${Math.random()*3+2}s ease-in-out ${Math.random()*3}s infinite alternate;
      `;
      el.appendChild(star);
    }
  });
}

// ─── Language ────────────────────────────────────
function selectLang(lang) {
  state.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.getElementById('mini-ru').classList.toggle('active', lang === 'ru');
  document.getElementById('mini-en').classList.toggle('active', lang === 'en');
  const u = UI[lang];
  const set = (id, txt) => { const el = document.getElementById(id); if(el) el.textContent = txt; };
  set('txt-back', u.back); set('txt-prev', u.prev); set('txt-next', u.next);
  set('txt-analyzing', u.analyzing); set('txt-results-title', u.resultsTitle);
  set('txt-print', u.print); set('txt-restart', u.restart); set('txt-new-analysis', u.newAnalysis);
  set('txt-speak', u.speak); set('txt-choose-grade', u.chooseGrade);
  set('txt-grade9', u.grade9); set('txt-grade11', u.grade11);
  if (state.grade) renderCurrentSection();
}

// ─── Grade selection ─────────────────────────────
function selectGrade(grade) {
  state.grade = grade;
  state.currentSection = 0;
  state.answers = {};
  showPage('questionnaire');
  renderCurrentSection();
}

// ─── Navigation ──────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
}

function goBack() {
  if (state.currentSection > 0) {
    state.currentSection--;
    renderCurrentSection();
  } else {
    showPage('landing');
  }
}

function prevSection() { goBack(); }

function nextSection() {
  const sections = T[state.lang].sections;
  if (!validateSection()) return;
  collectAnswers();

  if (state.currentSection === sections.length - 1) {
    submitQuestionnaire();
  } else {
    state.currentSection++;
    // Trigger numerology after basic section
    if (sections[state.currentSection].id === 'numerology') {
      fetchNumerology();
    }
    renderCurrentSection();
  }
}

function validateSection() {
  const name = state.answers['name'] || document.querySelector('[data-id="name"]')?.value?.trim();
  const dob = state.answers['dob'] || document.querySelector('[data-id="dob"]')?.value;
  const sectionId = T[state.lang].sections[state.currentSection].id;
  if (sectionId === 'basic' && (!name || !dob)) {
    alert(UI[state.lang].required);
    return false;
  }
  return true;
}

function collectAnswers() {
  const container = document.getElementById('questions-container');
  // Text inputs
  container.querySelectorAll('[data-id]').forEach(el => {
    const id = el.dataset.id;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
      state.answers[id] = el.value;
    }
  });
  // Scale buttons
  container.querySelectorAll('.scale-btn.selected').forEach(btn => {
    state.answers[btn.dataset.qid] = btn.dataset.value;
  });
  // Radio buttons
  container.querySelectorAll('.q-option.selected').forEach(btn => {
    state.answers[btn.dataset.qid] = btn.dataset.value;
  });
  // Grade selects
  container.querySelectorAll('.grade-select-small').forEach(sel => {
    if (sel.value) state.answers[sel.dataset.id] = sel.value;
  });
}

// ─── Numerology API call ─────────────────────────
async function fetchNumerology() {
  const name = state.answers['name'] || '';
  const dob = state.answers['dob'];
  if (!dob) return;
  try {
    const res = await fetch('/api/numerology', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dob, name })
    });
    const data = await res.json();
    state.numerology = data;
    renderNumerologyBadge(data);
  } catch(e) { console.error('Numerology error:', e); }
}

function renderNumerologyBadge(data) {
  const badge = document.getElementById('astro-badge');
  const inner = document.getElementById('astro-inner');
  const u = UI[state.lang];

  inner.innerHTML = `
    <div class="astro-item">
      <span class="astro-num">${data.lifePath}</span>
      <span class="astro-label">${u.lifePathLabel}</span>
      ${data.lifePathMeaning ? `<span style="font-size:11px;color:#F59E0B;margin-top:4px;display:block">${u.masterLabel}</span>` : ''}
    </div>
    <div class="astro-item">
      <span class="astro-sign">${data.zodiac}</span>
      <span class="astro-label">${u.zodiacLabel}</span>
    </div>
    <div class="astro-item">
      <span class="astro-sign" style="font-size:14px">${data.chineseZodiac}</span>
      <span class="astro-label">${u.chineseLabel}</span>
    </div>
    <div class="astro-item">
      <span class="astro-num">${data.personalYear}</span>
      <span class="astro-label">${u.personalYearLabel}</span>
    </div>
  `;
  badge.style.display = 'block';
}

// ─── Render section ──────────────────────────────
function renderCurrentSection() {
  const sections = T[state.lang].sections;
  const section = sections[state.currentSection];
  const total = sections.length;
  const progress = ((state.currentSection + 1) / total * 100).toFixed(0);

  // Update top bar
  document.getElementById('section-name').textContent = section.title;
  document.getElementById('section-counter').textContent = `${state.currentSection + 1} / ${total}`;
  document.getElementById('progress-bar').style.width = progress + '%';

  // Show/hide astro badge
  const badge = document.getElementById('astro-badge');
  if (section.id === 'numerology' && state.numerology) {
    renderNumerologyBadge(state.numerology);
  } else if (section.id !== 'numerology') {
    badge.style.display = 'none';
  }

  // Update next button
  const btnNext = document.getElementById('btn-next');
  const isLast = state.currentSection === total - 1;
  btnNext.textContent = isLast ? UI[state.lang].submit : UI[state.lang].next + ' →';
  if (isLast) btnNext.classList.add('submit'); else btnNext.classList.remove('submit');

  // Render questions
  const container = document.getElementById('questions-container');
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'section-header';
  header.innerHTML = `
    <span class="section-icon">${section.icon}</span>
    <h2 class="section-title">${section.title}</h2>
    <p class="section-desc">${section.desc}</p>
  `;
  container.appendChild(header);

  section.questions.forEach((q, idx) => {
    const block = document.createElement('div');
    block.className = 'question-block';
    const savedVal = state.answers[q.id];

    let html = `<span class="question-num">${getQuestionNumber(idx)}</span>
                <p class="question-text">${q.text}</p>`;

    switch(q.type) {
      case 'text':
        html += `<input class="q-input" type="text" data-id="${q.id}"
                  value="${savedVal || ''}" placeholder="${q.placeholder || ''}">`;
        break;
      case 'date':
        html += `<input class="q-input" type="date" data-id="${q.id}"
                  value="${savedVal || ''}" max="${new Date().toISOString().split('T')[0]}">`;
        break;
      case 'textarea':
        html += `<textarea class="q-textarea" data-id="${q.id}"
                  placeholder="${q.placeholder || ''}">${savedVal || ''}</textarea>`;
        break;
      case 'select':
        html += `<select class="q-select" data-id="${q.id}">
          <option value="">— выбери —</option>
          ${q.options.map(o => `<option value="${o.v}" ${savedVal===o.v?'selected':''}>${o.label}</option>`).join('')}
        </select>`;
        break;
      case 'scale':
        html += `<div class="scale-labels"><span>${q.min}</span><span>${q.max}</span></div>
          <div class="q-scale">
          ${[1,2,3,4,5].map(n =>
            `<button class="scale-btn ${savedVal==n?'selected':''}" data-qid="${q.id}" data-value="${n}" onclick="selectScale(this)">${n}</button>`
          ).join('')}
          </div>`;
        break;
      case 'radio':
        html += `<div class="q-options">
          ${q.options.map(o =>
            `<button class="q-option ${savedVal===o.v?'selected':''}" data-qid="${q.id}" data-value="${o.v}" onclick="selectOption(this)">
              <span>${o.label}</span>
            </button>`
          ).join('')}
        </div>`;
        break;
      case 'grades':
        html += `<div class="grades-grid">
          ${q.subjects.map(sub => {
            const key = 'grade_' + sub.toLowerCase().replace(/\s+/g,'_').replace(/[^a-zа-я0-9_]/g,'');
            const val = state.answers[key] || '';
            return `<div class="grade-item">
              <span class="grade-subject">${sub}</span>
              <select class="grade-select-small" data-id="${key}">
                <option value="">—</option>
                ${[2,3,4,5].map(n => `<option value="${n}" ${val==n?'selected':''}>${n}</option>`).join('')}
              </select>
            </div>`;
          }).join('')}
        </div>`;
        break;
    }

    block.innerHTML = html;
    container.appendChild(block);
  });

  // EGE section for grade 11
  if (section.id === 'grades' && state.grade === '11') {
    container.appendChild(renderEGESection());
  }

  requestAnimationFrame(() => {
    const page = document.getElementById('page-questionnaire');
    if (page) page.scrollTop = 0;
  });
}

function getQuestionNumber(idx) {
  const sectionStarts = [0, 8, 13, 43, 58, 78, 83, 95];
  const start = sectionStarts[state.currentSection] || (state.currentSection * 10);
  return `Вопрос ${start + idx + 1}`;
}

function renderEGESection() {
  const div = document.createElement('div');
  div.className = 'question-block';
  const egeSubjects = state.lang === 'ru'
    ? ['Русский язык', 'Математика (база)', 'Математика (профиль)', 'Физика', 'Химия', 'Биология', 'История', 'Обществознание', 'Английский', 'Информатика', 'Литература', 'География']
    : ['Russian Language', 'Math (basic)', 'Math (profile)', 'Physics', 'Chemistry', 'Biology', 'History', 'Social Studies', 'English', 'CS', 'Literature', 'Geography'];
  const title = state.lang === 'ru' ? 'Баллы ЕГЭ (если уже сдавал(а) или планируешь)' : 'EGE/Exam scores (if taken or planned)';
  div.innerHTML = `
    <p class="question-text">📝 ${title}</p>
    <div class="grades-grid">
      ${egeSubjects.map(sub => {
        const key = 'ege_' + sub.toLowerCase().replace(/\s+/g,'_').replace(/[^a-zа-я0-9_]/g,'');
        return `<div class="grade-item">
          <span class="grade-subject">${sub}</span>
          <input class="q-input" type="number" min="0" max="100" data-id="${key}"
            value="${state.answers[key]||''}" placeholder="0–100" style="padding:6px 10px;font-size:13px">
        </div>`;
      }).join('')}
    </div>`;
  return div;
}

// ─── Option selection ─────────────────────────────
function selectScale(btn) {
  const qid = btn.dataset.qid;
  btn.closest('.q-scale').querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.answers[qid] = btn.dataset.value;
}

function selectOption(btn) {
  const qid = btn.dataset.qid;
  btn.closest('.q-options').querySelectorAll('.q-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.answers[qid] = btn.dataset.value;
}

// ─── Submit questionnaire ─────────────────────────
async function submitQuestionnaire() {
  collectAnswers();

  // Build grades object
  const grades = {};
  const ege = {};
  Object.keys(state.answers).forEach(k => {
    if (k.startsWith('grade_')) grades[k.replace('grade_', '')] = state.answers[k];
    if (k.startsWith('ege_')) ege[k.replace('ege_', '')] = state.answers[k];
  });

  // Build psychology, values, maturity objects
  const psychology = {};
  const values = {};
  const maturity = {};
  const qmap = {};
  T[state.lang].sections.forEach(s => s.questions.forEach(q => qmap[q.id] = { section: s.id, q }));

  Object.keys(state.answers).forEach(k => {
    if (!qmap[k]) return;
    const sec = qmap[k].section;
    if (sec === 'psychology') psychology[k] = state.answers[k];
    else if (sec === 'values') values[k] = state.answers[k];
    else if (sec === 'maturity') maturity[k] = state.answers[k];
  });

  const payload = {
    name: state.answers['name'],
    dob: state.answers['dob'],
    gender: state.answers['gender'],
    city: state.answers['city'],
    grade: state.grade,
    language: state.lang,
    numerology: state.numerology,
    psychology,
    values,
    maturity,
    grades,
    ege: Object.keys(ege).length ? ege : null,
    hobbies_text: state.answers['hobbies_text'],
    clubs_text: state.answers['clubs_text'],
    dream_text: state.answers['dream_text'],
    work_text: state.answers['work_text'],
    achieve_text: state.answers['achieve_text'],
    move_city: state.answers['move_city'],
    preferred_cities: state.answers['preferred_cities'],
    move_abroad: state.answers['move_abroad'],
    preferred_countries: state.answers['preferred_countries'],
    family_finance: state.answers['family_finance'],
    study_difficulty: state.answers['study_difficulty'],
    study_or_work: state.answers['study_or_work']
  };

  showPage('loading');
  startLoadingAnimation();

  // Build numerology result card
  buildNumerologyCard();

  // Start AI streaming
  await streamAnalysis(payload);
}

// ─── Loading animation ────────────────────────────
let loadingInterval;
function startLoadingAnimation() {
  const steps = ['step1','step2','step3','step4','step5'];
  let i = 0;
  loadingInterval = setInterval(() => {
    if (i > 0) document.getElementById(steps[i-1])?.classList.replace('active','done');
    if (i < steps.length) document.getElementById(steps[i])?.classList.add('active');
    i++;
    if (i > steps.length) clearInterval(loadingInterval);
  }, 1800);
}

// ─── Numerology card for results ─────────────────
function buildNumerologyCard() {
  const card = document.getElementById('numerology-card');
  const n = state.numerology;
  if (!n) { card.style.display = 'none'; return; }
  const u = UI[state.lang];

  const meanings = {
    1: state.lang==='ru' ? 'Лидер и первопроходец' : 'Leader and pioneer',
    2: state.lang==='ru' ? 'Дипломат и миротворец' : 'Diplomat and peacemaker',
    3: state.lang==='ru' ? 'Творец и коммуникатор' : 'Creator and communicator',
    4: state.lang==='ru' ? 'Строитель и организатор' : 'Builder and organizer',
    5: state.lang==='ru' ? 'Искатель приключений' : 'Adventurer and freedom-seeker',
    6: state.lang==='ru' ? 'Хранитель и опекун' : 'Nurturer and caregiver',
    7: state.lang==='ru' ? 'Мыслитель и исследователь' : 'Thinker and researcher',
    8: state.lang==='ru' ? 'Достигатор и управленец' : 'Achiever and executive',
    9: state.lang==='ru' ? 'Гуманист и мечтатель' : 'Humanist and dreamer',
    11: state.lang==='ru' ? 'Интуит и провидец ⭐' : 'Intuitive visionary ⭐',
    22: state.lang==='ru' ? 'Мастер-строитель мира ⭐' : 'Master Builder ⭐',
    33: state.lang==='ru' ? 'Мастер-учитель ⭐' : 'Master Teacher ⭐'
  };

  card.innerHTML = `
    <h2 style="font-size:18px;font-weight:700;background:linear-gradient(135deg,#F59E0B,#7C3AED);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:16px">
      ${u.numerologyTitle}
    </h2>
    <div class="num-grid">
      <div class="num-item" style="grid-column:span 2">
        <span class="num-big">${n.lifePath}</span>
        <span class="num-label">${u.lifePathLabel}</span>
        <span class="num-meaning">${meanings[n.lifePath] || ''}</span>
        ${n.lifePathMeaning ? `<span style="font-size:12px;color:#10B981;margin-top:4px;display:block">${u.masterLabel} ${n.lifePathMeaning}</span>` : ''}
      </div>
      <div class="num-item">
        <span class="num-big" style="font-size:28px">${n.zodiac}</span>
        <span class="num-label">${u.zodiacLabel}</span>
        <span class="num-meaning">${n.zodiacEn}</span>
      </div>
      <div class="num-item">
        <span class="num-big" style="font-size:24px">${n.chineseZodiac}</span>
        <span class="num-label">${u.chineseLabel}</span>
      </div>
      <div class="num-item">
        <span class="num-big">${n.expressionNumber || '—'}</span>
        <span class="num-label">${u.expressionLabel}</span>
      </div>
      <div class="num-item">
        <span class="num-big">${n.personalYear}</span>
        <span class="num-label">${u.personalYearLabel}</span>
      </div>
    </div>`;
}

// ─── Streaming AI analysis ────────────────────────
async function streamAnalysis(payload) {
  const resultContent = document.getElementById('ai-result-content');
  resultContent.innerHTML = '<div class="streaming-cursor">|</div>';

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    });

    if (!res.ok) throw new Error('Server error: ' + res.status);

    showPage('results');
    clearInterval(loadingInterval);
    initAvatar(payload.name || 'Друг', state.lang);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    resultContent.innerHTML = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') break;
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            fullText += parsed.text;
            resultContent.innerHTML = renderMarkdown(fullText) + '<span class="streaming-cursor">|</span>';
            resultContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
          if (parsed.error) {
            fullText = '⚠️ Ошибка ИИ: ' + parsed.error + '\n\nПопробуй нажать "Заново" и пройти тест ещё раз.';
            resultContent.innerHTML = `<p style="color:#EF4444;font-size:16px;line-height:1.6">${fullText}</p>`;
          }
        } catch(e) {}
      }
    }

    resultContent.innerHTML = renderMarkdown(fullText);
    window.aiResultText = fullText;
    prepareAvatarSummary(fullText, state.lang);

  } catch(e) {
    showPage('results');
    clearInterval(loadingInterval);
    resultContent.innerHTML = `<p style="color:#EF4444">⚠️ ${UI[state.lang].error}</p><pre>${e.message}</pre>`;
    initAvatar(payload.name || 'Друг', state.lang);
  }
}

// ─── Markdown renderer ─────────────────────────────
function renderMarkdown(text) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^— (.+)$/gm, '<p style="padding-left:12px;border-left:2px solid #7C3AED;margin:6px 0">— $1</p>')
    .replace(/^- (.+)$/gm, '<p style="padding-left:12px;margin:4px 0">• $1</p>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// ─── Restart ──────────────────────────────────────
function restartApp() {
  state = { lang: state.lang, grade: null, currentSection: 0, answers: {}, numerology: null };
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  showPage('landing');
}

// ─── Speech toggle ─────────────────────────────────
let isSpeaking = false;
function toggleSpeak() {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    document.getElementById('btn-speak').classList.remove('speaking');
    document.getElementById('txt-speak').textContent = UI[state.lang].speak;
  } else {
    speakSummary();
  }
}
