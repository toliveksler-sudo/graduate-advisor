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
const GROQ_MODEL   = process.env.GROQ_MODEL   || 'llama-3.1-70b-versatile';

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

  const isEn = data.language === 'en';
  const lang = isEn ? 'English' : 'русский язык';

  const hardStudy = data.study_difficulty === 'Очень тяжело' || data.study_difficulty === 'Very hard' || data.study_or_work === 'Работать' || data.study_or_work === 'Work';
  const abroadReady = data.move_abroad === 'Да' || data.move_abroad === 'Yes' || data.move_abroad === 'Рассматриваю' || data.move_abroad === 'Considering';

  const prompt = `Ты — команда экспертов-профессионалов, которая помогает выпускникам школ выбрать путь в жизни. Отвечай развёрнуто, конкретно и практично.

СОСТАВ КОМАНДЫ (расставь акценты в таком порядке важности):
1. 🔮 НУМЕРОЛОГ-АСТРОЛОГ — ГЛАВНЫЙ ЭКСПЕРТ, его анализ идёт первым и занимает больше всего места
2. 🧠 ПСИХОЛОГ
3. 🩺 ПСИХИАТР (оценка зрелости и психотипа)
4. 📊 СПЕЦИАЛИСТ ПО РЫНКУ ТРУДА РОССИИ 2026-2030

═══════════════ ДАННЫЕ АНКЕТЫ ═══════════════

👤 УЧЕНИК: ${data.name || 'Не указано'} | ${data.grade} класс | ${data.gender}
📍 Город: ${data.city || 'Не указано'}
🎂 Дата рождения: ${data.dob}

🔮 НУМЕРОЛОГИЯ И АСТРОЛОГИЯ (расчёт по дате рождения):
• Число Жизненного Пути: ${data.numerology?.lifePath}${data.numerology?.lifePathMeaning ? ' — ' + data.numerology.lifePathMeaning + ' ⭐ МАСТЕР-ЧИСЛО!' : ''}
• Число Выражения: ${data.numerology?.expressionNumber || 'не рассчитано'}
• Знак Зодиака: ${data.numerology?.zodiac} (${data.numerology?.zodiacEn})
• Китайский гороскоп: ${data.numerology?.chineseZodiac}
• Личный год в 2026: ${data.numerology?.personalYear}

🧠 ПСИХОЛОГИЧЕСКИЙ ПРОФИЛЬ (ответы на вопросы):
${JSON.stringify(data.psychology || {}, null, 2)}

🌱 ЦЕННОСТИ И МОТИВАЦИЯ:
${JSON.stringify(data.values || {}, null, 2)}

🩺 ОЦЕНКА ЗРЕЛОСТИ И ПСИХОТИП:
${JSON.stringify(data.maturity || {}, null, 2)}

📚 УСПЕВАЕМОСТЬ (оценки 2-5):
${JSON.stringify(data.grades || {}, null, 2)}
${data.ege ? '\n📝 БАЛЛЫ ЕГЭ:\n' + JSON.stringify(data.ege, null, 2) : ''}

🎨 ИНТЕРЕСЫ И ХОББИ (свободный текст — ОЧЕНЬ ВАЖНО для анализа):
Свободное время: "${data.hobbies_text || 'не указано'}"
Кружки/секции: "${data.clubs_text || 'не указано'}"
Мечта / если деньги не важны: "${data.dream_text || 'не указано'}"
${hardStudy ? `Готов к работе вместо учёбы: "${data.work_text || 'не указано'}"` : ''}

🌍 МОБИЛЬНОСТЬ:
• Переезд в другой город РФ: ${data.move_city}
• Предпочитаемые города: ${data.preferred_cities || 'любые'}
• Переезд за рубеж: ${data.move_abroad}${abroadReady ? ' ✅' : ''}
• Предпочитаемые страны: ${data.preferred_countries || 'не указано'}
• Финансовые возможности семьи: ${data.family_finance}

📖 ОТНОШЕНИЕ К УЧЁБЕ:
• Учёба даётся: ${data.study_difficulty}
• Предпочтение: ${data.study_or_work}

═══════════════ АНАЛИЗ И РЕКОМЕНДАЦИИ ═══════════════

Дай ПОДРОБНЫЙ анализ по следующим разделам. Каждый раздел оформи красиво с заголовком и эмодзи:

## 🔮 НУМЕРОЛОГИЧЕСКИЙ И АСТРОЛОГИЧЕСКИЙ ПОРТРЕТ
Подробно разбери число жизненного пути, что оно означает для судьбы и призвания. Знак Зодиака — характер, сильные качества, в чём предназначение. Китайский зодиак — дополнительные черты. Личный год 2026 — что он несёт. Какие профессии предназначены по числам и звёздам? (3-4 абзаца)

## 🧠 ПСИХОЛОГИЧЕСКИЙ ПРОФИЛЬ И ПСИХОТИП
Определи тип личности (MBTI или аналог), сильные стороны, слабые места, как лучше принимает решения, какой стиль работы подходит. (2-3 абзаца)

## 🌱 ОЦЕНКА ЗРЕЛОСТИ
Готов ли к самостоятельной жизни и взрослым решениям? Что нужно развить? (1-2 абзаца)

## 💼 РЕКОМЕНДУЕМЫЕ ПРОФЕССИИ С ПЕРСПЕКТИВОЙ РОСТА
Предложи ровно 5 профессий. Для каждой укажи:
**[Название профессии]**
— Почему подходит (исходя из всех данных)
— Карьерный рост: стартовая позиция → через 3 года → через 10 лет
— Зарплата в России: стартовая / через 5 лет / топ
— В каких структурах работать: госструктуры, компании, самозанятость
— Рынок: востребованность в 2026-2030

## 🏫 КОНКРЕТНЫЕ УЧЕБНЫЕ ЗАВЕДЕНИЯ В 2026 ГОДУ
${data.grade === '9' ?
`Предложи 3-5 конкретных колледжа/техникума под каждую профессию. Укажи:
- Полное название
- Город
- Специальность и срок обучения
- Почему именно это заведение` :
`Предложи 3-5 конкретных вуза под каждую профессию. Укажи:
- Полное название университета
- Факультет и специальность
- Город
- Проходной балл ЕГЭ (приблизительно)
- Почему именно этот вуз`}

${hardStudy ? `## 💪 ПУТЬ ЧЕРЕЗ РАБОТУ (БЕЗ ВУЗА)
Если учёба даётся очень тяжело — это не приговор! Предложи 3 реалистичных пути:
- Профессия → где обучиться (курсы, колледж) → конкретные работодатели → карьера
- Как построить успешную жизнь без высшего образования в России 2026` : ''}

${data.move_city === 'Да' || data.move_city === 'Yes' ? `## 🏙️ ЛУЧШИЕ ГОРОДА РОССИИ ДЛЯ КАРЬЕРЫ
Для рекомендованных профессий укажи топ-3 города: средняя зарплата, спрос, качество жизни, стоимость жилья` : ''}

${abroadReady ? `## 🌍 ВОЗМОЖНОСТИ ЗА РУБЕЖОМ
Исходя из профиля, какие страны подойдут лучше всего? Конкретные варианты:
- Страна → как уехать (учёба/работа) → что нужно → перспективы` : ''}

## 📊 РЫНОК ТРУДА RUSSIA 2026-2030
Какие профессии будут расти (+%), какие умирать (-%), где самые высокие зарплаты, какие навыки критически важны. Кратко и по делу.

## 🎯 ИТОГОВЫЙ ПЛАН НА БЛИЖАЙШИЙ ГОД
Конкретные шаги: что сделать в ближайшие 3 месяца / до конца года / к поступлению. Дай личный совет от каждого эксперта команды (нумеролог, психолог, специалист по карьере).

Отвечай на языке: ${lang}
Будь максимально конкретным. Называй реальные учебные заведения, реальных работодателей, реальные цифры зарплат.`;

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
      res.write(`data: ${JSON.stringify({ error: 'Groq error: ' + err })}\n\n`);
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
