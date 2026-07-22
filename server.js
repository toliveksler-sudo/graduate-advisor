require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── AI Provider Priority: Claude → DeepSeek → Grok → Groq → YandexGPT → Ollama ──
const USE_CLAUDE   = !!process.env.ANTHROPIC_API_KEY;
const USE_DEEPSEEK = !USE_CLAUDE && !!process.env.DEEPSEEK_API_KEY;
const USE_GROK     = !USE_CLAUDE && !USE_DEEPSEEK && !!process.env.XAI_API_KEY;
const USE_GROQ     = !USE_CLAUDE && !USE_DEEPSEEK && !USE_GROK && !!process.env.GROQ_API_KEY;
const USE_YANDEX   = !USE_CLAUDE && !USE_DEEPSEEK && !USE_GROK && !USE_GROQ && !!process.env.YANDEX_API_KEY;
const USE_OLLAMA   = !USE_CLAUDE && !USE_DEEPSEEK && !USE_GROK && !USE_GROQ && !USE_YANDEX;

const OLLAMA_HOST    = process.env.OLLAMA_HOST  || 'localhost';
const OLLAMA_PORT    = process.env.OLLAMA_PORT  || 11434;
const OLLAMA_MODEL   = process.env.OLLAMA_MODEL || 'mistral';
const GROQ_MODEL     = process.env.GROQ_MODEL   || 'llama-3.3-70b-versatile';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const GROK_MODEL     = process.env.GROK_MODEL   || 'grok-3';
const YANDEX_FOLDER  = process.env.YANDEX_FOLDER_ID || '';

let anthropicClient = null;
if (USE_CLAUDE) {
  const Anthropic = require('@anthropic-ai/sdk');
  anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// Numerology calculation
app.post('/api/numerology', (req, res) => {
  const { dob, name } = req.body;
  if (!dob) return res.status(400).json({ error: 'DOB required' });

  function reduce(n) {
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
      n = String(n).split('').reduce((s, d) => s + parseInt(d), 0);
    }
    return n;
  }

  const [year, month, day] = dob.split('-').map(Number);
  const lifePath = reduce(reduce(day) + reduce(month) + reduce(
    String(year).split('').reduce((s, d) => s + parseInt(d), 0)
  ));

  // Pythagorean chart for expression number
  const chart = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 };
  const nameClean = (name || '').toLowerCase().replace(/[^a-zа-яё]/g, '');
  const cyrToLat = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'j',з:'z',и:'i',й:'i',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'c',ч:'c',ш:'s',щ:'s',ъ:'',ы:'i',ь:'',э:'e',ю:'u',я:'ya' };
  let nameSum = 0;
  for (const ch of nameClean) {
    const lat = cyrToLat[ch] || ch;
    nameSum += chart[lat] || 0;
  }
  const expressionNumber = reduce(nameSum);

  function getZodiac(m, d) {
    const dates = [[1,20,'Водолей'],[2,19,'Рыбы'],[3,21,'Овен'],[4,20,'Телец'],[5,21,'Близнецы'],[6,21,'Рак'],[7,23,'Лев'],[8,23,'Дева'],[9,23,'Весы'],[10,23,'Скорпион'],[11,22,'Стрелец'],[12,22,'Козерог']];
    for (const [sm, sd, sign] of dates) {
      if (m === sm && d >= sd) return sign;
    }
    for (const [sm, sd, sign] of dates) {
      if (m === sm - 1 || (m === 12 && sm === 1)) return sign;
    }
    return 'Козерог';
  }

  const zodiac = getZodiac(month, day);
  const zodiacEn = { 'Водолей':'Aquarius','Рыбы':'Pisces','Овен':'Aries','Телец':'Taurus','Близнецы':'Gemini','Рак':'Cancer','Лев':'Leo','Дева':'Virgo','Весы':'Libra','Скорпион':'Scorpio','Стрелец':'Sagittarius','Козерог':'Capricorn' };

  const chineseZodiacs = ['Крыса','Бык','Тигр','Кролик','Дракон','Змея','Лошадь','Коза','Обезьяна','Петух','Собака','Свинья'];
  const chineseZodiac = chineseZodiacs[(year - 4) % 12];

  const personalYear = reduce(reduce(day) + reduce(month) + reduce(2 + 0 + 2 + 6));

  const masterNumbers = { 11: 'Интуит и провидец', 22: 'Мастер-строитель мира', 33: 'Мастер-учитель' };

  res.json({
    lifePath,
    lifePathMeaning: masterNumbers[lifePath] || null,
    expressionNumber,
    zodiac,
    zodiacEn: zodiacEn[zodiac],
    chineseZodiac,
    personalYear,
    birthDay: day, birthMonth: month, birthYear: year
  });
});

// Main AI analysis with streaming
app.post('/api/analyze', async (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: 'Data required' });
  console.log(`📊 Analyze request: grade=${data.grade}, name=${data.name}, city=${data.city}`);

  const isEn = data.language === 'en';
  const lang = isEn ? 'English' : 'русский язык';

  const hardStudy = data.study_difficulty === 'Очень тяжело' || data.study_difficulty === 'Very hard' || data.study_or_work === 'Работать' || data.study_or_work === 'Work';
  const abroadReady = data.move_abroad === 'Да' || data.move_abroad === 'Yes' || data.move_abroad === 'Рассматриваю' || data.move_abroad === 'Considering';

  // Calculate average grade and EGE sum
  const gradesObj = data.grades || {};
  const gradeVals = Object.values(gradesObj).map(Number).filter(v => v >= 2 && v <= 5);
  const avgGrade = gradeVals.length ? (gradeVals.reduce((a,b) => a+b,0) / gradeVals.length).toFixed(1) : 'не указан';
  const gradesList = Object.entries(gradesObj).filter(([,v])=>v).map(([k,v])=>`${k.replace('grade_','').replace(/_/g,' ')}:${v}`).join(' ');

  const egeObj = data.ege || {};
  const egeList = Object.entries(egeObj).filter(([,v])=>v).map(([k,v])=>`${k.replace('ege_','').replace(/_/g,' ')}:${v}`).join(' ');
  const egeSum = Object.values(egeObj).map(Number).filter(v=>v>0).reduce((a,b)=>a+b,0);

  const mat = data.maturity || {};
  const psy = data.psychology || {};
  const mobilitySignals = [
    mat.m8 === 'Готов(а)' ? 'быт:ОК' : mat.m8 === 'Частично' ? 'быт:частично' : 'быт:НЕТ',
    `самост:${mat.m19||0}/5`,
    mat.m16 === 'Хорошо' ? 'стресс:ОК' : mat.m16 === 'Нормально' ? 'стресс:норм' : 'стресс:плохо',
    `самооценка:${mat.m18||'?'}`,
    `эмоции:${mat.m9||0}/5`
  ].join(' ');

  const prompt = `Ты профессиональный советник по образованию и карьере для выпускников школ России. Отвечай на ${lang}.

━━━━━━━ АНКЕТА УЧЕНИКА ━━━━━━━
Имя: ${data.name||'?'} | ${data.grade} класс | ${data.gender||'?'} | Город: ${data.city||'?'}
Финансы семьи: ${data.family_finance||'?'} | Учёба даётся: ${data.study_difficulty||'?'}

ОЦЕНКИ (средний ${avgGrade}/5): ${gradesList||'не заполнены'}
${data.grade==='11' && egeList ? `ЕГЭ (сумма ${egeSum} баллов): ${egeList}` : ''}
Любимые предметы: "${data.fav_subject||'не указано'}"
Трудные предметы: "${data.hard_subject||'не указано'}"

ПИСЬМЕННЫЕ ОТВЕТЫ УЧЕНИКА (ВАЖНО — анализируй каждый подробно):
— Чем занимается в свободное время: "${data.hobbies_text||'не указано'}"
— Кружки и секции: "${data.clubs_text||'не указано'}"
— Мечта (если деньги не важны): "${data.dream_text||'не указано'}"
— Чем мог бы работать уже сейчас: "${data.work_text||'не указано'}"
— Главное достижение: "${data.achieve_text||'не указано'}"
— Чего боится в будущем: "${mat.m20||'не указано'}"
— Кем хотят видеть родители: "${data.parent_wish||'не указано'}"
— На кого хочет быть похожим: "${data.role_model||'не указано'}"
— Чего ожидает от этого анализа: "${data.final_wish||'не указано'}"

ПСИХОЛОГИЧЕСКИЙ ТЕСТ (шкала 1-5):
Общительность:${psy.p1||'-'} Интроверт(нужно побыть одному):${psy.p2||'-'} Сердце/логика:${psy.p3||'-'} Планирование:${psy.p4||'-'}
Творчество:${psy.p5||'-'} Аналитика:${psy.p6||'-'} Адаптация:${psy.p7||'-'} Помощь_другим:${psy.p8||'-'}
Лидерство:${psy.p9||'-'} Команда/один:${psy.p10||'-'} Терпение:${psy.p11||'-'}
Точные_науки:${psy.p12||'-'} Гуманитарные:${psy.p13||'-'} Технологии:${psy.p14||'-'} Природа:${psy.p15||'-'}
Деньги_важны:${psy.p18||'-'} Слава_важна:${psy.p19||'-'} Стабильность:${psy.p20||'-'}
Упорство:${psy.p24||'-'} Конкуренция:${psy.p25||'-'} Искусство:${psy.p26||'-'}
Медицина:${psy.p27||'-'} Бизнес:${psy.p28||'-'} Дети/педагогика:${psy.p29||'-'} Право:${psy.p30||'-'}

ОЦЕНКА ЗРЕЛОСТИ:
Быт/самост.: ${mat.m8||'?'} | Готовность к жизни:${mat.m19||0}/5 | Стресс:${mat.m16||'?'}
Самооценка:${mat.m18||'?'} | Эмоции:${mat.m9||0}/5 | Решения:${mat.m1||'?'}
Деньги:${mat.m12||'?'} | Родители:${mat.m14||'?'} | Критика:${mat.m6||'?'}

Переезд РФ: ${data.move_city||'?'} | За рубеж: ${data.move_abroad||'?'} | Страны: ${data.preferred_countries||'?'}
Нумерология: ЧЖП=${data.numerology?.lifePath} ЧВ=${data.numerology?.expressionNumber} знак=${data.numerology?.zodiac} китай=${data.numerology?.chineseZodiac} год2026=${data.numerology?.personalYear}
${hardStudy ? 'ВАЖНО: учёба очень тяжела — обязательно рассмотри путь через работу/короткие курсы.' : ''}

СТРУКТУРА ОТВЕТА (строго в этом порядке, развёрнуто и конкретно):

## 🧠 КТО ТЫ — ПОДРОБНЫЙ ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ

Это самый важный раздел. Опиши личность развёрнуто — несколько абзацев по каждому пункту:

**Тип личности (MBTI):** Определи точный тип и объясни что это значит для этого человека — как он думает, чувствует, принимает решения, взаимодействует с людьми. Почему именно этот тип, исходя из ответов.

**Характер и сильные стороны:** Подробно — какой он человек? Лидер или исполнитель? Интроверт или экстраверт? Как реагирует на стресс, критику, неудачи? Что его заряжает энергией? Что его выматывает?

**Как он учится:** Какой стиль обучения ему подходит — лекции, практика, самостоятельное изучение? Работает лучше в группе или один? Нужна ли ему структура и дисциплина или свобода?

**Эмоциональная зрелость:** Честная оценка — насколько он готов к взрослой жизни? Умеет ли справляться с трудностями самостоятельно?

**Мотивация и ценности:** Что им движет — деньги, признание, интерес, помощь другим? Как это влияет на выбор профессии?

**Риски и зоны роста:** Что может помешать успеху? Какие качества нужно развивать?

## 💼 ПРОФЕССИИ И ПОЧЕМУ ОНИ ПОДХОДЯТ

Топ-5 профессий. Для каждой — подробное объяснение на несколько абзацев:
- Почему именно эта профессия подходит ЭТОМУ человеку (связь с психотипом, оценками, хобби, мечтами)
- Как будет выглядеть рабочий день, что нужно делать каждый день
- Карьерный путь: первая работа → через 3 года → через 10 лет
- Зарплата: стартовая / через 5 лет / топ-специалист
- ${data.grade==='9'?'2-3 конкретных колледжа/техникума: название, город, специальность, проходной балл, шансы':'2-3 конкретных вуза: название, город, факультет, проходной балл ЕГЭ (сумма), шансы'}
- Что сдавать на ${data.grade==='9'?'ОГЭ':'ЕГЭ'} для этой специальности

## 🏫 КУДА РЕАЛЬНО ПОСТУПИТЬ С ТВОИМИ ОЦЕНКАМИ

${data.grade==='9'?`Средний балл аттестата: ${avgGrade}/5.
✅ ВЫСОКИЕ ШАНСЫ — перечисли реальные колледжи/техникумы с проходным баллом ниже ${avgGrade}
🎯 СРЕДНИЕ ШАНСЫ — проходной примерно равен твоему
⚡ СЛОЖНО, НО ВОЗМОЖНО — топовые заведения куда можно попробовать
Укажи заведения в ${data.city||'родном городе'} и в других городах России.`
:`Сумма ЕГЭ: ${egeSum} баллов (математика+информатика+физика).
✅ ВЫСОКИЕ ШАНСЫ — реальные вузы с проходным суммарным баллом ниже ${egeSum}
🎯 СРЕДНИЕ ШАНСЫ — проходной близко к ${egeSum}
⚡ СЛОЖНО, НО ВОЗМОЖНО — топовые вузы если постараться
Укажи вузы в ${data.city||'родном городе'} и в других городах.`}

${data.grade==='9'?`## 🤔 ОСТАТЬСЯ В 10-11 КЛАССЕ ИЛИ ИДТИ В КОЛЛЕДЖ СЕЙЧАС?

Это важный выбор. Дай честный развёрнутый ответ конкретно для этого ученика:
- Что лучше с учётом его психотипа, оценок и целей?
- Плюсы колледжа после 9-го: раньше получит профессию, более практично, быстрее к работе
- Плюсы 10-11 класса: выше шансы на хороший вуз, больше времени созреть, ЕГЭ открывает больше дверей
- Конкретная рекомендация для ЭТОГО ученика и почему` : ''}

## 🏠 ГДЕ И КАК ЖИТЬ — КОНКРЕТНАЯ РЕКОМЕНДАЦИЯ

Исходя из психотипа и уровня зрелости, дай развёрнутый ответ:

**Остаться в родном городе или переехать?**
Конкретный вердикт: ДА/НЕТ/ПОКА НЕТ — с подробным обоснованием из психологического профиля. Не общие слова, а конкретные причины связанные с характером этого ученика.

**Если переезд — где жить?**
Честно разбери три варианта именно для этого психотипа:
- 🏠 У родственников: плюсы и минусы для ЭТОГО человека. Подходит ли?
- 🏢 Общежитие: плюсы и минусы для ЭТОГО человека. Справится ли?
- 🔑 Съёмная квартира: плюсы и минусы. Готов ли психологически и финансово?
Итоговая рекомендация: какой вариант лучше и почему.
${abroadReady ? '\n**Переезд за рубеж:** Реально ли для этого человека? Какие страны подходят по психотипу? Что нужно сделать?' : ''}

## 🔮 НУМЕРОЛОГИЯ И АСТРОЛОГИЯ

Число Жизненного Пути ${data.numerology?.lifePath} — подробно: что означает для судьбы и карьеры, какие профессии предопределены, сильные и слабые стороны этого числа.
Знак Зодиака ${data.numerology?.zodiac} — характер, таланты, в чём сила этого знака, как использовать это для карьеры.
Китайский знак ${data.numerology?.chineseZodiac} — добавь конкретные черты характера, а не просто название животного.
Личный год ${data.numerology?.personalYear} в 2026 — что он несёт, благоприятно ли для начала нового пути.

## 🎯 КОНКРЕТНЫЙ ПЛАН — ЧТО ДЕЛАТЬ ПРЯМО СЕЙЧАС

По шагам, без воды:
1. Что сделать в ближайший месяц
2. Что сделать до конца лета
3. Как готовиться к поступлению
4. Куда подавать документы в первую очередь и запасные варианты
5. Один главный совет от психолога лично для этого человека

ВАЖНО: Называй РЕАЛЬНЫЕ учебные заведения (не [Название]), РЕАЛЬНЫЕ проходные баллы, РЕАЛЬНЫЕ зарплаты. Пиши как живой человек — тепло, честно, с уважением к ребёнку. Это важное решение в его жизни.`;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (USE_CLAUDE) {
    // ── Claude (Anthropic) ──────────────────────────
    try {
      const stream = anthropicClient.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }]
      });
      stream.on('text', (text) => res.write(`data: ${JSON.stringify({ text })}\n\n`));
      stream.on('finalMessage', () => { res.write('data: [DONE]\n\n'); res.end(); });
      stream.on('error', (err) => { res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`); res.end(); });
    } catch (e) {
      res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
      res.end();
    }
  } else if (USE_DEEPSEEK) {
    streamFromOpenAICompat('https://api.deepseek.com/v1/chat/completions', process.env.DEEPSEEK_API_KEY, DEEPSEEK_MODEL, prompt, res);
  } else if (USE_GROK) {
    streamFromOpenAICompat('https://api.x.ai/v1/chat/completions', process.env.XAI_API_KEY, GROK_MODEL, prompt, res);
  } else if (USE_GROQ) {
    streamFromOpenAICompat('https://api.groq.com/openai/v1/chat/completions', process.env.GROQ_API_KEY, GROQ_MODEL, prompt, res);
  } else if (USE_YANDEX) {
    streamFromYandex(prompt, res);
  } else {
    streamFromOllama(prompt, res);
  }
});

// Universal OpenAI-compatible streaming (works for Groq, DeepSeek, Grok/xAI)
async function streamFromOpenAICompat(url, apiKey, model, prompt, res) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 8000,
        stream: true,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`❌ ${model} API error:`, response.status, err);
      res.write(`data: ${JSON.stringify({ error: `Ошибка ${model} (${response.status}): ${err}` })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') { res.write('data: [DONE]\n\n'); res.end(); return; }
        try {
          const parsed = JSON.parse(data);
          const text = parsed.choices?.[0]?.delta?.content || '';
          if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
        } catch(e) {}
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch(e) {
    console.error('❌ Stream error:', e.message);
    res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
}

// YandexGPT (Alice AI) streaming
async function streamFromYandex(prompt, res) {
  try {
    const modelUri = `gpt://${YANDEX_FOLDER}/yandexgpt/latest`;
    const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${process.env.YANDEX_API_KEY}`,
        'x-folder-id': YANDEX_FOLDER,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        modelUri,
        completionOptions: { stream: true, temperature: 0.7, maxTokens: 8000 },
        messages: [{ role: 'user', text: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('❌ YandexGPT error:', response.status, err);
      res.write(`data: ${JSON.stringify({ error: `Ошибка YandexGPT (${response.status}): ${err}` })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          const text = parsed.result?.alternatives?.[0]?.message?.text || '';
          if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
        } catch(e) {}
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch(e) {
    console.error('❌ YandexGPT stream error:', e.message);
    res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
}

function streamFromOllama(prompt, res) {
  const body = JSON.stringify({
    model: OLLAMA_MODEL,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    options: { num_predict: 6000, temperature: 0.7 }
  });

  const options = {
    hostname: OLLAMA_HOST,
    port: OLLAMA_PORT,
    path: '/api/chat',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  };

  const req = http.request(options, (ollamaRes) => {
    if (ollamaRes.statusCode !== 200) {
      res.write(`data: ${JSON.stringify({ error: `Ollama error: ${ollamaRes.statusCode}. Убедись что Ollama запущена и модель ${OLLAMA_MODEL} загружена.` })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    let buffer = '';
    ollamaRes.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          const text = parsed.message?.content || '';
          if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
          if (parsed.done) { res.write('data: [DONE]\n\n'); res.end(); }
        } catch(e) {}
      }
    });

    ollamaRes.on('end', () => {
      res.write('data: [DONE]\n\n');
      res.end();
    });
  });

  req.on('error', (e) => {
    const msg = `Ollama не запущена! Запусти Ollama и выполни команду: ollama pull ${OLLAMA_MODEL}`;
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  });

  req.write(body);
  req.end();
}

const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║   🎓 GRADUATE ADVISOR 2026                   ║');
    console.log('║   Советник для выпускников 9 и 11 класса     ║');
    console.log(`║   Открыть: http://localhost:${PORT}             ║`);
    console.log('╠══════════════════════════════════════════════╣');
    if (USE_CLAUDE)   console.log('║   🤖 Режим: Claude (Anthropic)               ║');
    else if (USE_DEEPSEEK) console.log(`║   🐋 Режим: DeepSeek (${DEEPSEEK_MODEL.padEnd(20)}) ║`);
    else if (USE_GROK)     console.log(`║   ⚡ Режим: Grok/xAI (${GROK_MODEL.padEnd(20)}) ║`);
    else if (USE_GROQ)     console.log(`║   🚀 Режим: Groq (${GROQ_MODEL.substring(0,24).padEnd(24)}) ║`);
    else if (USE_YANDEX)   console.log('║   🔮 Режим: YandexGPT (Alice AI)             ║');
    else {
      console.log(`║   🦙 Режим: Ollama локальный (${OLLAMA_MODEL.padEnd(13)})║`);
      console.log('║   ⚠️  Убедись что Ollama запущена!           ║');
    }
    console.log('╚══════════════════════════════════════════════╝\n');
  });
}

module.exports = app;
