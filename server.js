require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const USE_CLAUDE = !!process.env.ANTHROPIC_API_KEY;
const USE_GROQ   = !USE_CLAUDE && !!process.env.GROQ_API_KEY;
const USE_OLLAMA = !USE_CLAUDE && !USE_GROQ;

const OLLAMA_HOST  = process.env.OLLAMA_HOST  || 'localhost';
const OLLAMA_PORT  = process.env.OLLAMA_PORT  || 11434;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';
const GROQ_MODEL   = process.env.GROQ_MODEL   || 'llama-3.3-70b-versatile';

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

  // Calculate average grade from attestat
  const gradesObj = data.grades || {};
  const gradeVals = Object.values(gradesObj).map(Number).filter(v => v >= 2 && v <= 5);
  const avgGrade = gradeVals.length ? (gradeVals.reduce((a,b) => a+b,0) / gradeVals.length).toFixed(1) : null;

  // Format grades as readable list
  const gradesList = Object.entries(gradesObj)
    .filter(([,v]) => v)
    .map(([k,v]) => `${k.replace('grade_','').replace(/_/g,' ')}: ${v}`)
    .join(', ');

  // Format EGE scores
  const egeObj = data.ege || {};
  const egeList = Object.entries(egeObj)
    .filter(([,v]) => v)
    .map(([k,v]) => `${k.replace('ege_','').replace(/_/g,' ')}: ${v} баллов`)
    .join(', ');
  const egeSum = Object.values(egeObj).map(Number).filter(v=>v>0).reduce((a,b)=>a+b,0);

  // Maturity signals for moving readiness assessment
  const mat = data.maturity || {};
  const selfSufficient = mat.m8 === 'Готов(а)' ? 'умеет вести быт' : mat.m8 === 'Частично' ? 'частично умеет вести быт' : 'не умеет вести быт самостоятельно';
  const independenceScore = Number(mat.m19 || 0);
  const stressHandling = mat.m16 === 'Хорошо' ? 'хорошо справляется со стрессом' : mat.m16 === 'Нормально' ? 'нормально справляется со стрессом' : mat.m16 === 'Тяжело' ? 'с трудом справляется со стрессом' : 'стресс выбивает надолго';
  const selfEsteem = mat.m18 || 'не указана';
  const decisionMaking = mat.m1 || 'не указано';

  const prompt = `Ты — опытный профессиональный советник по образованию и карьере для выпускников российских школ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ГЛАВНАЯ ЗАДАЧА — ответить на два вопроса:
1. КАКУЮ ПРОФЕССИЮ выбрать этому ученику?
2. В КАКИЕ КОНКРЕТНЫЕ УЧЕБНЫЕ ЗАВЕДЕНИЯ он РЕАЛЬНО может поступить с его оценками?
3. ГОТОВ ли он психологически уехать учиться далеко от родителей?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

══ ДАННЫЕ УЧЕНИКА ══

👤 ${data.name || 'Ученик'} | ${data.grade} класс | ${data.gender || 'не указан'}
📍 Город: ${data.city || 'не указан'}
💰 Финансы семьи: ${data.family_finance || 'не указано'}
📖 Учёба даётся: ${data.study_difficulty || 'не указано'}

══ УСПЕВАЕМОСТЬ (АТТЕСТАТ) ══
${gradesList ? `Оценки: ${gradesList}` : 'Оценки не заполнены'}
${avgGrade ? `СРЕДНИЙ БАЛЛ АТТЕСТАТА: ${avgGrade}/5` : ''}
Любимые предметы: ${data.fav_subject || 'не указано'}
Трудные предметы: ${data.hard_subject || 'не указано'}
${data.grade === '11' && egeList ? `\n══ БАЛЛЫ ЕГЭ ══\n${egeList}\nСУММА БАЛЛОВ: ${egeSum}` : ''}

══ ИНТЕРЕСЫ И ХОББИ ══
Свободное время: "${data.hobbies_text || 'не указано'}"
Кружки/секции: "${data.clubs_text || 'не указано'}"
Мечта (если бы деньги не важны): "${data.dream_text || 'не указано'}"
Главное достижение: "${data.achieve_text || 'не указано'}"
${hardStudy ? `Готов работать (не учиться): "${data.work_text || 'не указано'}"` : ''}

══ ПСИХОЛОГИЧЕСКИЙ ПРОФИЛЬ (шкала 1-5) ══
Общительность/лидерство (p1,p9): ${mat ? JSON.stringify({общительность:data.psychology?.p1,лидерство:data.psychology?.p9}) : 'не заполнено'}
Творчество/аналитика (p5,p6): ${JSON.stringify({творчество:data.psychology?.p5,аналитика:data.psychology?.p6})}
Работа в команде/один (p10): ${data.psychology?.p10}
Технологии/компьютеры (p14): ${data.psychology?.p14}
Медицина (p27), Бизнес (p28), Дети/педагогика (p29), Юриспруденция (p30): ${JSON.stringify({медицина:data.psychology?.p27,бизнес:data.psychology?.p28,педагогика:data.psychology?.p29,право:data.psychology?.p30})}
Деньги важны (p18): ${data.psychology?.p18}; Стабильность важна (p20): ${data.psychology?.p20}

══ ОЦЕНКА ЗРЕЛОСТИ И ГОТОВНОСТИ К ОТЪЕЗДУ ══
Самостоятельность в быту: ${selfSufficient}
Готовность к самостоятельной жизни (m19, шкала 1-5): ${independenceScore}/5
Управление стрессом: ${stressHandling}
Самооценка: ${selfEsteem}
При проблемах: ${decisionMaking}
Управление эмоциями (m9): ${mat.m9}/5
Отношения с родителями (m14): ${mat.m14 || 'не указано'}
Чего боится в будущем: "${mat.m20 || 'не указано'}"

══ МОБИЛЬНОСТЬ ══
Переезд в другой город РФ: ${data.move_city || 'не указано'}
Предпочитаемые города: ${data.preferred_cities || 'не указано'}
Переезд за рубеж: ${data.move_abroad || 'не указано'}
Страны: ${data.preferred_countries || 'не указано'}

══ НУМЕРОЛОГИЯ ══
Число Жизненного Пути: ${data.numerology?.lifePath}${data.numerology?.lifePathMeaning ? ' — ' + data.numerology.lifePathMeaning + ' ⭐ МАСТЕР-ЧИСЛО' : ''}
Число Выражения: ${data.numerology?.expressionNumber || 'не рассчитано'}
Знак Зодиака: ${data.numerology?.zodiac}
Китайский зодиак: ${data.numerology?.chineseZodiac}
Личный год 2026: ${data.numerology?.personalYear}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
СТРУКТУРА ОТВЕТА — СТРОГО В ЭТОМ ПОРЯДКЕ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🏆 РАЗДЕЛ 1: ТОП-5 РЕКОМЕНДУЕМЫХ ПРОФЕССИЙ

Для каждой профессии дай ПОЛНЫЙ блок:

### 🎯 Профессия 1: [НАЗВАНИЕ]
**Почему подходит именно тебе:** [на основе оценок + интересов + психотипа — конкретно!]
**Карьерный путь:** [Стартовая должность] → [через 3 года] → [через 10 лет — руководитель/эксперт]
**Зарплата 2026:** [стартовая] / [через 5 лет] / [топ специалист]
**Куда поступать ${data.grade === '9' ? '(колледж/техникум)' : '(вуз)'}:**
${data.grade === '9' ? `  - [Название колледжа], [Город] — Специальность: [название], срок: [X лет], проходной средний балл: [X.X] — ТВОИ ШАНСЫ: [ВЫСОКИЕ/СРЕДНИЕ/НУЖНО ПОДТЯНУТЬ]
  - [Второй колледж], [Город] — ...` : `  - [Название вуза], [Город] — Факультет: [название], специальность: [код и название], проходной балл ЕГЭ (сумма 3 предметов): [XXX] — ТВОИ ШАНСЫ: [ВЫСОКИЕ/СРЕДНИЕ/НУЖНО ПОДТЯНУТЬ]
  - [Второй вуз] — ...`}
**Что сдавать:** ${data.grade === '9' ? '[предметы ОГЭ нужные для этой специальности]' : '[предметы ЕГЭ обязательные для поступления]'}
**Перспективы 2026-2030:** [востребованность, рост рынка]

[Повтори блок для профессий 2, 3, 4, 5]

---

## 🏫 РАЗДЕЛ 2: КУДА РЕАЛЬНО ПОСТУПИТЬ С ТВОИМИ ОЦЕНКАМИ

${data.grade === '9' ? `**Твой средний балл аттестата: ${avgGrade || 'не указан'}/5**

Разбей учебные заведения по реалистичности:

✅ **ВЫСОКИЕ ШАНСЫ** (твои оценки выше или равны проходному):
- [Колледж/техникум], [город] — специальность "[название]" — проходной балл: [X.X] — [краткое описание]
- [ещё 2-3 варианта]

🎯 **СРЕДНИЕ ШАНСЫ** (нужно немного подтянуть):
- [варианты]

⚡ **ЦЕЛЕВЫЕ** (если сильно постараться):
- [варианты]

Укажи колледжи в [город ученика] и в крупных городах России.` :
`**Твои баллы ЕГЭ: ${egeList || 'не указаны'}, СУММА: ${egeSum || '?'} баллов**

Разбей вузы по реалистичности:

✅ **ВЫСОКИЕ ШАНСЫ** (твои баллы выше проходного):
- [Вуз], [Город] — [Факультет] — проходной сумма: [XXX] — твоя сумма: ${egeSum} — [комментарий]
- [ещё 2-3 варианта]

🎯 **СРЕДНИЕ ШАНСЫ** (нужно чуть подтянуть):
- [варианты с проходным близким к ${egeSum}]

⚡ **ЦЕЛЕВЫЕ / ЕСЛИ ПОВЕЗЁТ**:
- [ТОП вузы если есть шанс]

Укажи вузы в [город ученика] и в других городах.`}

---

## 🔑 РАЗДЕЛ 3: ВЕРДИКТ — ГОТОВ(А) ЛИ К ПЕРЕЕЗДУ ОТ РОДИТЕЛЕЙ?

**Это КРИТИЧЕСКИ ВАЖНЫЙ вопрос. Дай чёткий ответ:**

> **[✅ ГОТОВ(А) К ПЕРЕЕЗДУ / ⚠️ ЧАСТИЧНО ГОТОВ(А) — НУЖНА ПОДГОТОВКА / ❌ НЕ ГОТОВ(А) — ЛУЧШЕ УЧИТЬСЯ РЯДОМ С ДОМОМ]**

**Обоснование (на основе ответов на анкету):**
- Готовность к быту: ${selfSufficient}
- Оценка самим учеником своей готовности (1-5): ${independenceScore}/5
- Стресс-устойчивость: ${stressHandling}
- Самооценка: ${selfEsteem}
- [Другие важные факторы из психологического профиля]

**Рекомендация:**
${`Если ГОТОВ: "Смело рассматривай учёбу в другом городе — Москва, СПб, [город по интересам]. Это отличная возможность для роста."
Если ЧАСТИЧНО: "Начни с учёбы в своём регионе или в 2-3 часах езды от дома. Через год-два окрепнешь и сможешь переехать. Вот что нужно развить: [конкретно]."
Если НЕ ГОТОВ: "Сейчас лучше остаться в родном городе — это не слабость, а мудрость. Выбирай местные заведения. Вот почему и что делать: [конкретно]."`}
${abroadReady ? '\n**По поводу переезда за рубеж:** [конкретная оценка — реально ли, через что, какие страны подходят по психотипу]' : ''}

---

## 🔮 РАЗДЕЛ 4: НУМЕРОЛОГИЧЕСКИЙ ПОРТРЕТ

Число Жизненного Пути **${data.numerology?.lifePath}** — разбери подробно что это значит для судьбы, призвания и профессии (2-3 абзаца). Знак Зодиака **${data.numerology?.zodiac}** — характер и сильные стороны. Китайский зодиак — дополнительные черты. Личный год **${data.numerology?.personalYear}** в 2026 — что несёт. Какие профессии предназначены по числам?

---

## 🧠 РАЗДЕЛ 5: ПСИХОТИП И ПСИХОЛОГИЧЕСКИЙ ПРОФИЛЬ

Определи тип личности (MBTI), сильные стороны, как лучше обучается, что мотивирует, чего нужно остерегаться. Дай практичный совет как использовать психотип для успеха в выбранной профессии.

---

${hardStudy ? `## 💪 РАЗДЕЛ 6: ПУТЬ БЕЗ ДЛИННОЙ УЧЁБЫ

Учёба даётся тяжело — это не приговор! Предложи 3 конкретных пути:
1. [Профессия] → [курсы или краткий колледж, срок] → [первая работа] → [карьера через 3-5 лет]
2. [Профессия] → ...
3. [Профессия] → ...
Реальные цифры зарплат и конкретные работодатели.

---

` : ''}
## 📊 РАЗДЕЛ ${hardStudy ? '7' : '6'}: РЫНОК ТРУДА 2026-2030

Для рекомендованных профессий: востребованность, рост (+X%), автоматизация (риск), ключевые навыки, топ-работодатели, средняя зарплата по России и Москве.

---

## 🎯 РАЗДЕЛ ${hardStudy ? '8' : '7'}: ПЛАН ДЕЙСТВИЙ НА БЛИЖАЙШИЕ 3 МЕСЯЦА

**До конца ${new Date().getMonth() < 9 ? 'лета' : 'года'}:**
1. [Конкретный шаг]
2. [Конкретный шаг]
3. [Конкретный шаг]

**К поступлению:**
- Что сдавать (ОГЭ/ЕГЭ), какие предметы подтянуть
- Куда подать документы в первую очередь
- Запасные варианты

**Совет нумеролога:** [персонально]
**Совет психолога:** [персонально]
**Совет по карьере:** [персонально]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Отвечай на языке: ${lang}
ВАЖНО: Называй КОНКРЕТНЫЕ учебные заведения с реальными названиями, конкретные проходные баллы, реальные зарплаты. Не давай общих фраз — только конкретика, цифры, названия.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

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
  } else if (USE_GROQ) {
    // ── Groq (free cloud AI) ────────────────────────
    streamFromGroq(prompt, res);
  } else {
    // ── Ollama (local, no API key needed) ──────────
    streamFromOllama(prompt, res);
  }
});

async function streamFromGroq(prompt, res) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 8000,
        stream: true,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('❌ Groq API error:', response.status, err);
      res.write(`data: ${JSON.stringify({ error: 'Groq ошибка ' + response.status + ': ' + err })}\n\n`);
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
          if (parsed.error) console.error('❌ Groq stream error:', parsed.error);
        } catch(e) {}
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch(e) {
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
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   🎓 GRADUATE ADVISOR 2026                   ║');
  console.log('║   Советник для выпускников 9 и 11 класса     ║');
  console.log(`║   Открыть: http://localhost:${PORT}             ║`);
  console.log('╠══════════════════════════════════════════════╣');
  if (USE_CLAUDE) {
    console.log('║   🤖 Режим: Claude API (Anthropic)           ║');
  } else if (USE_GROQ) {
    console.log(`║   ⚡ Режим: Groq (${GROQ_MODEL.substring(0,22).padEnd(22)}) ║`);
  } else {
    console.log(`║   🦙 Режим: Ollama локальный (${OLLAMA_MODEL.padEnd(13)})║`);
    console.log(`║   📍 Ollama: http://${OLLAMA_HOST}:${OLLAMA_PORT}            ║`);
    console.log('║   ⚠️  Убедись что Ollama запущена!           ║');
  }
  console.log('╚══════════════════════════════════════════════╝\n');
});
