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

  const prompt = `Ты советник по образованию и карьере для выпускников школ России. Отвечай на ${lang}.

ДАННЫЕ УЧЕНИКА:
Имя: ${data.name||'?'} | Класс: ${data.grade} | Пол: ${data.gender||'?'} | Город: ${data.city||'?'}
Финансы семьи: ${data.family_finance||'?'} | Учёба: ${data.study_difficulty||'?'}
Оценки (${avgGrade}/5 средний): ${gradesList||'не заполнены'}
${data.grade==='11' && egeList ? `ЕГЭ (сумма ${egeSum}): ${egeList}` : ''}
Любимые предметы: ${data.fav_subject||'?'} | Трудные: ${data.hard_subject||'?'}
Хобби: ${data.hobbies_text||'?'} | Кружки: ${data.clubs_text||'?'}
Мечта: ${data.dream_text||'?'} | Достижение: ${data.achieve_text||'?'}
Психология (1-5): общит.${psy.p1||'-'} лидер.${psy.p9||'-'} творч.${psy.p5||'-'} аналит.${psy.p6||'-'} технол.${psy.p14||'-'} деньги${psy.p18||'-'} медиц.${psy.p27||'-'} бизнес${psy.p28||'-'} педаг.${psy.p29||'-'} право${psy.p30||'-'}
Зрелость: ${mobilitySignals} | решения:${mat.m1||'?'} | родители:${mat.m14||'?'}
Страхи: ${mat.m20||'?'}
Переезд в РФ: ${data.move_city||'?'} | За рубеж: ${data.move_abroad||'?'} | Страны: ${data.preferred_countries||'?'}
Нумерология: ЧЖП=${data.numerology?.lifePath} ЧВ=${data.numerology?.expressionNumber} зодиак=${data.numerology?.zodiac} китай=${data.numerology?.chineseZodiac} год2026=${data.numerology?.personalYear}${hardStudy ? '\nУЧЁБА ОЧЕНЬ ТЯЖЕЛА — рассмотри путь через работу/короткие курсы' : ''}

СТРУКТУРА ОТВЕТА (строго в этом порядке):

## 🏆 ТОП-5 ПРОФЕССИЙ
Для каждой: название, почему подходит (оценки+хобби+психотип), карьера и зарплата, ${data.grade==='9'?'2-3 конкретных колледжа/техникума с городом и проходным баллом':'2-3 конкретных вуза с городом и проходным баллом ЕГЭ'}, шансы поступления (высокие/средние/низкие).

## 🏫 КУДА РЕАЛЬНО ПОСТУПИТЬ
${data.grade==='9'?`Средний балл ${avgGrade}/5. Раздели на: ✅ высокие шансы / 🎯 средние / ⚡ сложно. Реальные колледжи с проходными баллами в городе ${data.city||'ученика'} и топ-городах РФ.`:`Сумма ЕГЭ ${egeSum} баллов. Раздели на: ✅ высокие шансы / 🎯 средние / ⚡ сложно. Реальные вузы с проходными суммами баллов.`}

## 🔑 ВЕРДИКТ: ГОТОВ К ПЕРЕЕЗДУ?
Чёткий ответ: ✅ ГОТОВ / ⚠️ ЧАСТИЧНО / ❌ НЕ ГОТОВ. Обоснование по данным зрелости. Конкретная рекомендация.${abroadReady ? ' Оцени реальность переезда за рубеж.' : ''}

## 🔮 НУМЕРОЛОГИЯ
ЧЖП ${data.numerology?.lifePath}, знак ${data.numerology?.zodiac} — судьба, призвание, профессии по числам. Личный год ${data.numerology?.personalYear} в 2026.

## 🧠 ПСИХОТИП
MBTI, сильные стороны, стиль обучения, мотивация, совет.

## 🎯 ПЛАН НА 3 МЕСЯЦА
Конкретные шаги к поступлению. Что сдавать, куда подавать документы, запасные варианты.

Называй РЕАЛЬНЫЕ учебные заведения, РЕАЛЬНЫЕ проходные баллы, РЕАЛЬНЫЕ зарплаты. Никаких шаблонов вроде [Название].`;

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
        max_tokens: 4500,
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
