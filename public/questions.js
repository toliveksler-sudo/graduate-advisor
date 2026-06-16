// ═══════════════════════════════════════════════
//  GRADUATE ADVISOR — Questions Database
//  120+ questions across 8 sections
//  Bilingual: Russian / English
// ═══════════════════════════════════════════════

const T = {
  ru: {
    sections: [
      {
        id: 'basic', icon: '📋',
        title: 'Основная информация',
        desc: 'Расскажи о себе — эти данные помогут рассчитать нумерологический портрет',
        questions: [
          { id: 'name', type: 'text', text: 'Твоё полное имя (имя + фамилия)', placeholder: 'Например: Анна Иванова', required: true },
          { id: 'dob', type: 'date', text: 'Дата рождения', required: true },
          { id: 'gender', type: 'radio', text: 'Пол', options: [{ v: 'Девочка', label: '👧 Девочка' }, { v: 'Мальчик', label: '👦 Мальчик' }] },
          { id: 'city', type: 'text', text: 'Город проживания', placeholder: 'Например: Москва' },
          { id: 'school', type: 'text', text: 'Название школы (необязательно)', placeholder: 'Школа №...' },
          { id: 'family', type: 'radio', text: 'Семейная ситуация', options: [
            { v: 'Полная семья', label: '👨‍👩‍👧 Полная семья' },
            { v: 'Мама', label: '👩 Живу с мамой' },
            { v: 'Папа', label: '👨 Живу с папой' },
            { v: 'Опекуны', label: '👴 С бабушкой/дедушкой или опекунами' }
          ]},
          { id: 'siblings', type: 'radio', text: 'Братья и сёстры', options: [
            { v: 'Нет', label: '🧍 Я единственный ребёнок' },
            { v: 'Братья', label: '👬 Есть брат(ья)' },
            { v: 'Сёстры', label: '👭 Есть сестра(ы)' },
            { v: 'Есть и те и те', label: '👪 Есть и братья и сёстры' }
          ]},
          { id: 'family_finance', type: 'radio', text: 'Финансовые возможности семьи для образования', options: [
            { v: 'Только бесплатно', label: '🎓 Только бюджет/бесплатное' },
            { v: 'Скромный бюджет', label: '💰 Небольшой бюджет на образование' },
            { v: 'Средний бюджет', label: '💳 Средние возможности' },
            { v: 'Высокий бюджет', label: '💎 Готовы вложить значительные средства' }
          ]}
        ]
      },
      {
        id: 'numerology', icon: '🔮',
        title: 'Нумерология и Астрология',
        desc: 'Этот раздел рассчитывается АВТОМАТИЧЕСКИ по твоей дате рождения. Просто проверь данные!',
        questions: [
          { id: 'astro_confirm', type: 'radio', text: 'Ты веришь в то, что дата рождения влияет на характер и судьбу?', options: [
            { v: 'Верю', label: '⭐ Да, верю' },
            { v: 'Частично', label: '🤔 Частично' },
            { v: 'Не верю', label: '🔬 Нет, не верю' }
          ]},
          { id: 'birth_time', type: 'text', text: 'Время рождения (если знаешь)', placeholder: 'Например: 14:30 или не знаю' },
          { id: 'birth_place', type: 'text', text: 'Место рождения', placeholder: 'Город, где родился(ась)' },
          { id: 'lucky_number', type: 'text', text: 'Какое число кажется тебе "счастливым"?', placeholder: 'Любое число от 1 до 33' },
          { id: 'zodiac_feel', type: 'textarea', text: 'Как ты ощущаешь свой знак зодиака? Похож ли ты на типичного представителя своего знака?', placeholder: 'Напиши свои мысли...' }
        ]
      },
      {
        id: 'psychology', icon: '🧠',
        title: 'Психологический профиль',
        desc: 'Отвечай честно — нет правильных или неправильных ответов. Оцени от 1 (совсем не про меня) до 5 (это я на 100%)',
        questions: [
          { id: 'p1', type: 'scale', text: 'Мне нравится знакомиться с новыми людьми и быть в центре внимания', min: 'Не про меня', max: 'Точно про меня' },
          { id: 'p2', type: 'scale', text: 'После шумной компании мне нужно побыть одному(ой), чтобы восстановиться', min: 'Редко', max: 'Всегда' },
          { id: 'p3', type: 'scale', text: 'Я принимаю решения скорее сердцем (чувствами), чем головой (логикой)', min: 'Логика', max: 'Чувства' },
          { id: 'p4', type: 'scale', text: 'Мне важно всё планировать заранее и следовать плану', min: 'Живу как идёт', max: 'Чёткий план' },
          { id: 'p5', type: 'scale', text: 'Я люблю создавать что-то новое: рисовать, писать, придумывать', min: 'Не моё', max: 'Обожаю!' },
          { id: 'p6', type: 'scale', text: 'Мне нравится анализировать, разбираться в деталях, находить закономерности', min: 'Скучно', max: 'Очень нравится' },
          { id: 'p7', type: 'scale', text: 'Я легко адаптируюсь к изменениям и новым условиям', min: 'С трудом', max: 'Легко' },
          { id: 'p8', type: 'scale', text: 'Мне важно помогать другим людям, чувствовать себя нужным(ой)', min: 'Не так важно', max: 'Очень важно' },
          { id: 'p9', type: 'scale', text: 'Я хочу быть лидером, принимать важные решения', min: 'Нет', max: 'Да' },
          { id: 'p10', type: 'scale', text: 'Мне нравится работать в команде, а не самостоятельно', min: 'Предпочитаю один(а)', max: 'Только в команде' },
          { id: 'p11', type: 'scale', text: 'Я умею терпеливо выполнять одну задачу долгое время', min: 'Отвлекаюсь', max: 'Очень терпелив(а)' },
          { id: 'p12', type: 'scale', text: 'Мне нравятся точные науки (математика, физика, химия)', min: 'Не люблю', max: 'Очень нравятся' },
          { id: 'p13', type: 'scale', text: 'Мне нравятся гуманитарные науки (история, литература, языки)', min: 'Не люблю', max: 'Очень нравятся' },
          { id: 'p14', type: 'scale', text: 'Технологии и компьютеры — моё хобби или интерес', min: 'Нет', max: 'Да' },
          { id: 'p15', type: 'scale', text: 'Природа, животные, биология меня искренне интересуют', min: 'Нет', max: 'Да' },
          { id: 'p16', type: 'scale', text: 'Я часто думаю о смысле жизни, философских вопросах', min: 'Редко', max: 'Постоянно' },
          { id: 'p17', type: 'scale', text: 'Я легко выражаю свои мысли — устно и письменно', min: 'Трудно', max: 'Легко' },
          { id: 'p18', type: 'scale', text: 'Деньги и материальный успех очень важны для меня', min: 'Не важно', max: 'Очень важно' },
          { id: 'p19', type: 'scale', text: 'Признание и слава важнее денег', min: 'Нет', max: 'Да' },
          { id: 'p20', type: 'scale', text: 'Стабильность и безопасность важнее риска и приключений', min: 'Хочу риск', max: 'Хочу стабильность' },
          { id: 'p21', type: 'scale', text: 'Я могу часами заниматься одним увлечением и не устаю', min: 'Нет', max: 'Да' },
          { id: 'p22', type: 'scale', text: 'Мне легко понять, что чувствуют другие люди', min: 'Трудно', max: 'Легко' },
          { id: 'p23', type: 'scale', text: 'Критика меня сильно задевает и расстраивает', min: 'Не задевает', max: 'Очень задевает' },
          { id: 'p24', type: 'scale', text: 'Я готов(а) много и упорно работать ради достижения цели', min: 'Избегаю', max: 'Готов(а) на всё' },
          { id: 'p25', type: 'scale', text: 'Мне нравится соревноваться и побеждать', min: 'Не люблю', max: 'Обожаю' },
          { id: 'p26', type: 'scale', text: 'Я хочу заниматься искусством, музыкой или театром', min: 'Нет', max: 'Да' },
          { id: 'p27', type: 'scale', text: 'Мне интересна медицина и здоровье человека', min: 'Нет', max: 'Да' },
          { id: 'p28', type: 'scale', text: 'Мне интересны бизнес, предпринимательство, своё дело', min: 'Нет', max: 'Да' },
          { id: 'p29', type: 'scale', text: 'Я хотел(а) бы работать с детьми или молодёжью', min: 'Нет', max: 'Да' },
          { id: 'p30', type: 'scale', text: 'Мне интересна юриспруденция, закон, справедливость', min: 'Нет', max: 'Да' }
        ]
      },
      {
        id: 'values', icon: '💫',
        title: 'Ценности и мотивация',
        desc: 'Что для тебя действительно важно в будущей работе и жизни?',
        questions: [
          { id: 'v1', type: 'radio', text: 'Что для тебя важнее всего в будущей работе?', options: [
            { v: 'Деньги', label: '💰 Высокая зарплата' },
            { v: 'Смысл', label: '❤️ Работа приносит пользу людям' },
            { v: 'Творчество', label: '🎨 Возможность творить' },
            { v: 'Статус', label: '👑 Престиж и признание' }
          ]},
          { id: 'v2', type: 'radio', text: 'Какой режим работы тебе больше нравится?', options: [
            { v: 'Офис', label: '🏢 Офис, чёткий график' },
            { v: 'Удалённо', label: '🏠 Удалённо из дома' },
            { v: 'Разъезды', label: '✈️ Командировки, путешествия' },
            { v: 'Гибко', label: '🔄 Гибкий график' }
          ]},
          { id: 'v3', type: 'radio', text: 'Какой масштаб деятельности тебя привлекает?', options: [
            { v: 'Маленькая команда', label: '👥 Маленькая команда' },
            { v: 'Крупная компания', label: '🏭 Крупная компания' },
            { v: 'Госслужба', label: '🏛️ Государственная служба' },
            { v: 'Своё дело', label: '🚀 Своё дело / фриланс' }
          ]},
          { id: 'v4', type: 'radio', text: 'Ты больше "человек" или "система"?', options: [
            { v: 'Люди', label: '🤝 Работа с людьми (общение, помощь)' },
            { v: 'Системы', label: '⚙️ Работа с системами (данные, техника, код)' },
            { v: 'Природа', label: '🌿 Работа с природой/животными' },
            { v: 'Образы', label: '🎭 Работа с образами (искусство, дизайн)' }
          ]},
          { id: 'v5', type: 'radio', text: 'Как ты относишься к физическому труду?', options: [
            { v: 'Нравится', label: '💪 Нравится, люблю работать руками' },
            { v: 'Нормально', label: '👍 Нормально, не против' },
            { v: 'Предпочитаю умственный', label: '🧠 Предпочитаю умственный труд' },
            { v: 'Сочетание', label: '⚖️ Хочу сочетать оба' }
          ]},
          { id: 'v6', type: 'scale', text: 'Насколько важна тебе возможность карьерного роста и развития?', min: 'Неважно', max: 'Крайне важно' },
          { id: 'v7', type: 'radio', text: 'Ты хотел(а) бы работать в государственных структурах?', options: [
            { v: 'Да', label: '🏛️ Да, это стабильность и статус' },
            { v: 'Нет', label: '🚫 Нет, хочу в частный сектор' },
            { v: 'Не знаю', label: '🤷 Пока не знаю' }
          ]},
          { id: 'v8', type: 'radio', text: 'В какой сфере хотел(а) бы работать? (выбери одну — главную)', options: [
            { v: 'IT технологии', label: '💻 IT и технологии' },
            { v: 'Медицина', label: '🏥 Медицина и здоровье' },
            { v: 'Бизнес/Финансы', label: '📈 Бизнес и финансы' },
            { v: 'Искусство', label: '🎨 Искусство и культура' }
          ]},
          { id: 'v8b', type: 'radio', text: 'Или другая сфера:', options: [
            { v: 'Образование', label: '📚 Образование' },
            { v: 'Безопасность', label: '🛡️ Силовые структуры / безопасность' },
            { v: 'Наука', label: '🔬 Наука и исследования' },
            { v: 'Социальная сфера', label: '🤲 Социальная работа / НКО' }
          ]},
          { id: 'v9', type: 'scale', text: 'Насколько важно для тебя работать в экологичной / "зелёной" сфере?', min: 'Неважно', max: 'Очень важно' },
          { id: 'v10', type: 'textarea', text: 'Опиши своего кумира или человека, которому завидуешь (белой завистью) — чего ты хочешь достичь как он/она?', placeholder: 'Напиши несколько предложений...' },
          { id: 'v11', type: 'radio', text: 'Через 10 лет ты хочешь быть...', options: [
            { v: 'Специалист', label: '🎯 Крутым специалистом в своей области' },
            { v: 'Руководитель', label: '👔 Руководителем / менеджером' },
            { v: 'Предприниматель', label: '🏆 Предпринимателем' },
            { v: 'Творческая карьера', label: '✨ Известным творческим человеком' }
          ]},
          { id: 'v12', type: 'scale', text: 'Мне важно, чтобы моя работа была связана с современными технологиями и ИИ', min: 'Неважно', max: 'Очень важно' },
          { id: 'v13', type: 'scale', text: 'Я готов(а) учиться всю жизнь, постоянно повышать квалификацию', min: 'Нет', max: 'Да' },
          { id: 'v14', type: 'radio', text: 'Твоя главная мотивация в жизни:', options: [
            { v: 'Семья', label: '👨‍👩‍👧 Семья и близкие' },
            { v: 'Достижения', label: '🏅 Достижения и победы' },
            { v: 'Удовольствие', label: '😊 Удовольствие и качество жизни' },
            { v: 'Влияние', label: '🌍 Изменить мир к лучшему' }
          ]},
          { id: 'v15', type: 'scale', text: 'Я готов(а) работать больше 8 часов в день, если работа мне нравится', min: 'Нет', max: 'Да' }
        ]
      },
      {
        id: 'maturity', icon: '🌱',
        title: 'Зрелость и психотип',
        desc: 'Эти вопросы помогут оценить психологическую зрелость и готовность к взрослой жизни',
        questions: [
          { id: 'm1', type: 'radio', text: 'Когда возникает серьёзная проблема, ты обычно...', options: [
            { v: 'Решаю сам(а)', label: '💪 Пытаюсь решить самостоятельно' },
            { v: 'Прошу помощи', label: '🤝 Прошу помощи у близких' },
            { v: 'Жду само рассосётся', label: '⏳ Жду, что само разрешится' },
            { v: 'Впадаю в панику', label: '😰 Тревожусь и теряюсь' }
          ]},
          { id: 'm2', type: 'radio', text: 'Как ты принимаешь важные решения?', options: [
            { v: 'Анализирую', label: '📊 Собираю информацию, анализирую' },
            { v: 'Интуиция', label: '💫 Доверяю интуиции' },
            { v: 'Советуюсь', label: '👥 Советуюсь с другими' },
            { v: 'Откладываю', label: '😬 Откладываю на потом' }
          ]},
          { id: 'm3', type: 'scale', text: 'Я умею справляться с разочарованием и неудачами', min: 'Трудно', max: 'Легко' },
          { id: 'm4', type: 'scale', text: 'Я знаю, чего хочу от жизни', min: 'Нет', max: 'Точно знаю' },
          { id: 'm5', type: 'scale', text: 'Я могу отстоять свою точку зрения, не обижая других', min: 'Трудно', max: 'Легко' },
          { id: 'm6', type: 'radio', text: 'Как ты реагируешь на критику от учителей / родителей?', options: [
            { v: 'Принимаю и исправляю', label: '✅ Принимаю, делаю выводы' },
            { v: 'Обижаюсь', label: '😢 Обижаюсь, долго переживаю' },
            { v: 'Игнорирую', label: '🙄 Игнорирую' },
            { v: 'Агрессия', label: '😡 Защищаюсь или злюсь' }
          ]},
          { id: 'm7', type: 'scale', text: 'Я планирую своё время (учёбу, отдых, хобби)', min: 'Нет', max: 'Всегда' },
          { id: 'm8', type: 'radio', text: 'Готов(а) ли ты жить один(а) — самостоятельно вести быт?', options: [
            { v: 'Готов(а)', label: '✅ Да, умею готовить, убирать, планировать бюджет' },
            { v: 'Частично', label: '🤔 Частично, нужно ещё научиться' },
            { v: 'Не готов(а)', label: '❌ Нет, пока не готов(а)' }
          ]},
          { id: 'm9', type: 'scale', text: 'Я умею управлять своим настроением и эмоциями', min: 'Нет', max: 'Да' },
          { id: 'm10', type: 'radio', text: 'Когда ты сильно расстроен(а) или тревожишься, что делаешь?', options: [
            { v: 'Спорт', label: '🏃 Занимаюсь спортом / иду гулять' },
            { v: 'Музыка/Творчество', label: '🎵 Слушаю музыку / занимаюсь творчеством' },
            { v: 'Общаюсь', label: '💬 Общаюсь с друзьями / родителями' },
            { v: 'Телефон', label: '📱 Сижу в телефоне / играю' }
          ]},
          { id: 'm11', type: 'scale', text: 'У меня есть устойчивые интересы, которым я посвящаю время регулярно', min: 'Нет', max: 'Да' },
          { id: 'm12', type: 'radio', text: 'Как ты относишься к деньгам?', options: [
            { v: 'Трачу сразу', label: '💸 Трачу сразу, сложно копить' },
            { v: 'Копить не умею', label: '🤷 Пытаюсь копить, но получается плохо' },
            { v: 'Умею копить', label: '🏦 Умею копить на цели' },
            { v: 'Бюджет', label: '📊 Веду учёт расходов' }
          ]},
          { id: 'm13', type: 'scale', text: 'Я несу ответственность за свои слова и поступки', min: 'Нет', max: 'Всегда' },
          { id: 'm14', type: 'radio', text: 'Твои отношения с родителями:', options: [
            { v: 'Отличные', label: '❤️ Отличные, понимаем друг друга' },
            { v: 'Нормальные', label: '👍 Нормальные' },
            { v: 'Напряжённые', label: '😬 Бывают конфликты' },
            { v: 'Сложные', label: '😔 Сложные, почти не общаемся' }
          ]},
          { id: 'm15', type: 'scale', text: 'Я знаю свои сильные стороны и опираюсь на них', min: 'Не знаю', max: 'Точно знаю' },
          { id: 'm16', type: 'radio', text: 'Как ты справляешься со стрессом?', options: [
            { v: 'Хорошо', label: '😌 Хорошо, стресс меня мобилизует' },
            { v: 'Нормально', label: '😐 Нормально, справляюсь' },
            { v: 'Тяжело', label: '😓 С трудом, долго восстанавливаюсь' },
            { v: 'Очень тяжело', label: '😰 Очень тяжело, стресс выбивает надолго' }
          ]},
          { id: 'm17', type: 'scale', text: 'Я умею говорить "нет" и отказывать, когда это нужно', min: 'Нет', max: 'Да' },
          { id: 'm18', type: 'radio', text: 'Твоя самооценка:', options: [
            { v: 'Высокая', label: '😎 Высокая, уверен(а) в себе' },
            { v: 'Нормальная', label: '🙂 Нормальная, адекватная' },
            { v: 'Низкая', label: '😔 Невысокая, часто сомневаюсь' },
            { v: 'Нестабильная', label: '🎢 Нестабильная — то взлёт, то падение' }
          ]},
          { id: 'm19', type: 'scale', text: 'Я готов(а) к самостоятельной взрослой жизни (учёба в другом городе, работа)', min: 'Нет', max: 'Да' },
          { id: 'm20', type: 'textarea', text: 'Чего ты больше всего боишься в будущем?', placeholder: 'Напиши честно...' }
        ]
      },
      {
        id: 'grades', icon: '📚',
        title: 'Успеваемость',
        desc: 'Укажи свои оценки — это важно для подбора подходящего направления',
        questions: [
          { id: 'grades_main', type: 'grades', text: 'Оценки по основным предметам (последний аттестат)', subjects: [
            'Русский язык', 'Литература', 'Алгебра', 'Геометрия', 'Физика',
            'Химия', 'Биология', 'История', 'Обществознание', 'География',
            'Английский язык', 'Информатика', 'Физкультура', 'ОБЖ', 'Технология'
          ]},
          { id: 'fav_subject', type: 'textarea', text: 'Любимые предметы — в чём ты лучше всего?', placeholder: 'Например: Математика, информатика, биология...' },
          { id: 'hard_subject', type: 'textarea', text: 'Какие предметы даются труднее всего?', placeholder: 'Например: Физика, химия...' },
          { id: 'study_difficulty', type: 'radio', text: 'В целом учёба тебе даётся...', options: [
            { v: 'Легко', label: '🚀 Легко, я хорошист или отличник' },
            { v: 'Нормально', label: '📖 Нормально, учусь на 4-5' },
            { v: 'Тяжело', label: '😓 Тяжело, учусь на 3-4' },
            { v: 'Очень тяжело', label: '😩 Очень тяжело, нет мотивации' }
          ]},
          { id: 'study_or_work', type: 'radio', text: 'Что ты предпочитаешь после школы?', options: [
            { v: 'Учиться', label: '🎓 Обязательно учиться (колледж/вуз)' },
            { v: 'Учиться и работать', label: '💼 Учиться и работать параллельно' },
            { v: 'Работать', label: '💪 Пойти работать, учёба не для меня' },
            { v: 'Не знаю', label: '🤷 Пока не знаю' }
          ]}
        ]
      },
      {
        id: 'interests', icon: '🎨',
        title: 'Интересы, хобби и кружки',
        desc: 'Это САМЫЙ ВАЖНЫЙ раздел для ИИ-анализа. Пиши подробнее!',
        questions: [
          { id: 'hobbies_text', type: 'textarea', text: '🎯 Чем ты занимаешься в свободное время? (подробно!)', placeholder: 'Например: играю на гитаре, смотрю видео о космосе, катаюсь на скейте, рисую аниме, пишу стихи, разбираю компьютеры, вяжу, готовлю...' },
          { id: 'clubs_text', type: 'textarea', text: '🏫 Какие кружки, секции, курсы ты посещаешь или посещал(а)?', placeholder: 'Например: секция по борьбе (3 года), школьный театр, кружок программирования, музыкальная школа (фортепиано)...' },
          { id: 'dream_text', type: 'textarea', text: '💭 Если бы деньги и мнение других не имели значения — чем бы ты занимался(ась)?', placeholder: 'Твоя мечта, даже если она кажется нереалистичной...' },
          { id: 'work_text', type: 'textarea', text: '💼 Если бы пришлось идти работать прямо сейчас — чем мог(ла) бы заниматься?', placeholder: 'Что умеешь, за что могут заплатить уже сейчас...' },
          { id: 'achieve_text', type: 'textarea', text: '🏆 Твоё главное достижение за последние 2-3 года (в чём ты можешь гордиться)?', placeholder: 'Победа в олимпиаде, спортивные достижения, проект, который ты сделал(а)...' },
          { id: 'sport', type: 'radio', text: 'Ты занимаешься спортом?', options: [
            { v: 'Профессионально', label: '🥇 Да, профессионально (соревнования)' },
            { v: 'Для себя', label: '🏃 Да, для себя' },
            { v: 'Иногда', label: '🚶 Иногда' },
            { v: 'Нет', label: '😴 Нет' }
          ]},
          { id: 'music', type: 'radio', text: 'Музыка в твоей жизни:', options: [
            { v: 'Играю', label: '🎸 Играю на инструменте' },
            { v: 'Пою', label: '🎤 Пою' },
            { v: 'Слушаю', label: '🎧 Только слушаю' },
            { v: 'Безразлично', label: '😐 Безразлично' }
          ]},
          { id: 'tech_interest', type: 'scale', text: 'Насколько тебе интересны компьютеры, программирование, гаджеты?', min: 'Нет', max: 'Очень' },
          { id: 'social_media', type: 'textarea', text: 'Есть ли у тебя свой блог, канал или аккаунт с подписчиками? Расскажи про него', placeholder: 'Например: веду тикток о котах (1000 подписчиков), YouTube-канал о играх...' },
          { id: 'languages', type: 'textarea', text: 'Какие иностранные языки знаешь и на каком уровне?', placeholder: 'Например: Английский — B2, изучаю китайский...' },
          { id: 'travel', type: 'radio', text: 'Тебе нравится путешествовать и узнавать новые места?', options: [
            { v: 'Да', label: '✈️ Да, обожаю' },
            { v: 'Нормально', label: '👍 Нормально' },
            { v: 'Предпочитаю дом', label: '🏠 Предпочитаю дом' }
          ]}
        ]
      },
      {
        id: 'mobility', icon: '🌍',
        title: 'Мобильность и будущее',
        desc: 'Готов(а) ли ты к переменам места жизни?',
        questions: [
          { id: 'move_city', type: 'radio', text: 'Готов(а) ли ты переехать в другой город России ради учёбы или работы?', options: [
            { v: 'Да', label: '✅ Да, готов(а)' },
            { v: 'Рассматриваю', label: '🤔 Рассматриваю' },
            { v: 'Нет', label: '🏠 Нет, хочу остаться в своём городе' }
          ]},
          { id: 'preferred_cities', type: 'textarea', text: 'Какие города России тебе интересны?', placeholder: 'Например: Москва, Санкт-Петербург, Казань, Краснодар, Екатеринбург...' },
          { id: 'move_abroad', type: 'radio', text: 'Рассматриваешь ли ты возможность переехать в другую страну?', options: [
            { v: 'Да', label: '🌍 Да, хочу жить за рубежом' },
            { v: 'Рассматриваю', label: '🤔 Рассматриваю как вариант' },
            { v: 'Нет', label: '🇷🇺 Нет, Россия — мой выбор' }
          ]},
          { id: 'preferred_countries', type: 'textarea', text: 'Если за рубеж — какие страны интересуют?', placeholder: 'Например: ОАЭ, Сербия, Германия, США, Беларусь, Казахстан...' },
          { id: 'abroad_reason', type: 'radio', text: 'Если за рубеж — главная причина:', options: [
            { v: 'Образование', label: '🎓 Получить зарубежное образование' },
            { v: 'Работа', label: '💼 Найти работу с высокой зарплатой' },
            { v: 'Образ жизни', label: '🌴 Лучший образ жизни' },
            { v: 'Родственники', label: '👨‍👩‍👧 Там живут родственники' }
          ]},
          { id: 'timeline', type: 'radio', text: 'Когда ты хочешь определиться с будущей профессией?', options: [
            { v: 'Уже знаю', label: '✅ Я уже знаю, кем хочу быть' },
            { v: 'В процессе', label: '🔍 Ещё ищу себя' },
            { v: 'Не думал', label: '😅 Пока не думал(а) об этом' }
          ]},
          { id: 'who_decides', type: 'radio', text: 'Кто принимает решение о выборе профессии?', options: [
            { v: 'Я сам(а)', label: '💪 Я сам(а) принимаю решение' },
            { v: 'С родителями', label: '👨‍👩‍👧 Вместе с родителями' },
            { v: 'Родители', label: '👨‍👩 Родители решают' },
            { v: 'Ещё не знаем', label: '🤷 Ещё не обсуждали' }
          ]},
          { id: 'parent_wish', type: 'textarea', text: 'Кем хотят видеть тебя родители? Совпадает ли это с твоими желаниями?', placeholder: 'Напиши, что думают родители и твоё отношение к этому...' },
          { id: 'role_model', type: 'textarea', text: 'Есть ли профессия или человек, на которого ты хочешь быть похожим(ей)?', placeholder: 'Кумир, знакомый, родственник...' },
          { id: 'final_wish', type: 'textarea', text: 'Что ты ожидаешь от этого анализа? Что хочешь получить в итоге?', placeholder: 'Напиши свои ожидания и вопросы...' }
        ]
      }
    ]
  },

  en: {
    sections: [
      {
        id: 'basic', icon: '📋',
        title: 'Basic Information',
        desc: 'Tell us about yourself — this data will be used to calculate your numerology portrait',
        questions: [
          { id: 'name', type: 'text', text: 'Your full name (first + last name)', placeholder: 'Example: Anna Ivanova', required: true },
          { id: 'dob', type: 'date', text: 'Date of birth', required: true },
          { id: 'gender', type: 'radio', text: 'Gender', options: [{ v: 'Девочка', label: '👧 Female' }, { v: 'Мальчик', label: '👦 Male' }] },
          { id: 'city', type: 'text', text: 'City of residence', placeholder: 'Example: Moscow' },
          { id: 'school', type: 'text', text: 'School name (optional)', placeholder: 'School #...' },
          { id: 'family', type: 'radio', text: 'Family situation', options: [
            { v: 'Полная семья', label: '👨‍👩‍👧 Two-parent family' },
            { v: 'Мама', label: '👩 Live with mom' },
            { v: 'Папа', label: '👨 Live with dad' },
            { v: 'Опекуны', label: '👴 With grandparents / guardians' }
          ]},
          { id: 'siblings', type: 'radio', text: 'Brothers and sisters', options: [
            { v: 'Нет', label: '🧍 Only child' },
            { v: 'Братья', label: '👬 Have brother(s)' },
            { v: 'Сёстры', label: '👭 Have sister(s)' },
            { v: 'Есть и те и те', label: '👪 Both brothers and sisters' }
          ]},
          { id: 'family_finance', type: 'radio', text: 'Family financial capacity for education', options: [
            { v: 'Только бесплатно', label: '🎓 Budget / free education only' },
            { v: 'Скромный бюджет', label: '💰 Small budget' },
            { v: 'Средний бюджет', label: '💳 Medium budget' },
            { v: 'Высокий бюджет', label: '💎 Ready for significant investment' }
          ]}
        ]
      },
      {
        id: 'numerology', icon: '🔮',
        title: 'Numerology & Astrology',
        desc: 'This section is calculated AUTOMATICALLY from your date of birth. Just verify the data!',
        questions: [
          { id: 'astro_confirm', type: 'radio', text: 'Do you believe that your birth date influences your character and destiny?', options: [
            { v: 'Верю', label: '⭐ Yes, I believe it' },
            { v: 'Частично', label: '🤔 Partly' },
            { v: 'Не верю', label: '🔬 No, I do not' }
          ]},
          { id: 'birth_time', type: 'text', text: 'Time of birth (if known)', placeholder: 'Example: 14:30 or unknown' },
          { id: 'birth_place', type: 'text', text: 'Place of birth', placeholder: 'City where you were born' },
          { id: 'lucky_number', type: 'text', text: 'What number feels "lucky" to you?', placeholder: 'Any number 1-33' },
          { id: 'zodiac_feel', type: 'textarea', text: 'How do you feel about your zodiac sign? Are you a typical representative?', placeholder: 'Write your thoughts...' }
        ]
      },
      {
        id: 'psychology', icon: '🧠',
        title: 'Psychological Profile',
        desc: 'Answer honestly — there are no right or wrong answers. Rate 1 (not like me at all) to 5 (totally me)',
        questions: [
          { id: 'p1', type: 'scale', text: 'I enjoy meeting new people and being in the spotlight', min: 'Not me', max: 'Totally me' },
          { id: 'p2', type: 'scale', text: 'After a noisy crowd I need alone time to recharge', min: 'Rarely', max: 'Always' },
          { id: 'p3', type: 'scale', text: 'I make decisions more with my heart (feelings) than my head (logic)', min: 'Logic', max: 'Feelings' },
          { id: 'p4', type: 'scale', text: 'I like to plan everything in advance and stick to the plan', min: 'Go with the flow', max: 'Strict plan' },
          { id: 'p5', type: 'scale', text: 'I love creating things: drawing, writing, inventing', min: 'Not my thing', max: 'I love it!' },
          { id: 'p6', type: 'scale', text: 'I enjoy analyzing, digging into details, finding patterns', min: 'Boring', max: 'Love it' },
          { id: 'p7', type: 'scale', text: 'I adapt easily to change and new conditions', min: 'Difficult', max: 'Easy' },
          { id: 'p8', type: 'scale', text: 'It is important to me to help others and feel needed', min: 'Not important', max: 'Very important' },
          { id: 'p9', type: 'scale', text: 'I want to be a leader and make important decisions', min: 'No', max: 'Yes' },
          { id: 'p10', type: 'scale', text: 'I prefer working in a team rather than alone', min: 'Alone', max: 'Team only' },
          { id: 'p11', type: 'scale', text: 'I can patiently work on one task for a long time', min: 'Get distracted', max: 'Very patient' },
          { id: 'p12', type: 'scale', text: 'I enjoy exact sciences (math, physics, chemistry)', min: 'Dislike', max: 'Love them' },
          { id: 'p13', type: 'scale', text: 'I enjoy humanities (history, literature, languages)', min: 'Dislike', max: 'Love them' },
          { id: 'p14', type: 'scale', text: 'Technology and computers are my hobby or interest', min: 'No', max: 'Yes' },
          { id: 'p15', type: 'scale', text: 'Nature, animals, biology genuinely interest me', min: 'No', max: 'Yes' },
          { id: 'p16', type: 'scale', text: 'I often think about the meaning of life and philosophical questions', min: 'Rarely', max: 'Constantly' },
          { id: 'p17', type: 'scale', text: 'I easily express my thoughts — verbally and in writing', min: 'Difficult', max: 'Easy' },
          { id: 'p18', type: 'scale', text: 'Money and material success are very important to me', min: 'Not important', max: 'Very important' },
          { id: 'p19', type: 'scale', text: 'Recognition and fame matter more than money', min: 'No', max: 'Yes' },
          { id: 'p20', type: 'scale', text: 'Stability and safety matter more than risk and adventure', min: 'Want risk', max: 'Want stability' },
          { id: 'p21', type: 'scale', text: 'I can spend hours on one passion without getting tired', min: 'No', max: 'Yes' },
          { id: 'p22', type: 'scale', text: 'I easily understand what other people feel', min: 'Difficult', max: 'Easy' },
          { id: 'p23', type: 'scale', text: 'Criticism really upsets and affects me', min: 'Does not bother', max: 'Really hurts' },
          { id: 'p24', type: 'scale', text: 'I am ready to work hard to achieve my goals', min: 'Avoid it', max: 'Ready for anything' },
          { id: 'p25', type: 'scale', text: 'I enjoy competing and winning', min: 'Dislike', max: 'Love it' },
          { id: 'p26', type: 'scale', text: 'I want to work in art, music, or theater', min: 'No', max: 'Yes' },
          { id: 'p27', type: 'scale', text: 'I am interested in medicine and human health', min: 'No', max: 'Yes' },
          { id: 'p28', type: 'scale', text: 'I am interested in business and entrepreneurship', min: 'No', max: 'Yes' },
          { id: 'p29', type: 'scale', text: 'I would like to work with children or youth', min: 'No', max: 'Yes' },
          { id: 'p30', type: 'scale', text: 'I am interested in law and justice', min: 'No', max: 'Yes' }
        ]
      },
      {
        id: 'values', icon: '💫',
        title: 'Values & Motivation',
        desc: 'What truly matters to you in your future work and life?',
        questions: [
          { id: 'v1', type: 'radio', text: 'What matters most in your future job?', options: [
            { v: 'Деньги', label: '💰 High salary' },
            { v: 'Смысл', label: '❤️ Helping people' },
            { v: 'Творчество', label: '🎨 Creative expression' },
            { v: 'Статус', label: '👑 Prestige and recognition' }
          ]},
          { id: 'v2', type: 'radio', text: 'What work schedule do you prefer?', options: [
            { v: 'Офис', label: '🏢 Office, fixed hours' },
            { v: 'Удалённо', label: '🏠 Remote from home' },
            { v: 'Разъезды', label: '✈️ Business trips, travel' },
            { v: 'Гибко', label: '🔄 Flexible schedule' }
          ]},
          { id: 'v3', type: 'radio', text: 'What scale of activity attracts you?', options: [
            { v: 'Маленькая команда', label: '👥 Small team' },
            { v: 'Крупная компания', label: '🏭 Large company' },
            { v: 'Госслужба', label: '🏛️ Government service' },
            { v: 'Своё дело', label: '🚀 Own business / freelance' }
          ]},
          { id: 'v4', type: 'radio', text: 'Are you more a "people" or "systems" person?', options: [
            { v: 'Люди', label: '🤝 Work with people (communication, help)' },
            { v: 'Системы', label: '⚙️ Work with systems (data, tech, code)' },
            { v: 'Природа', label: '🌿 Work with nature/animals' },
            { v: 'Образы', label: '🎭 Work with images (art, design)' }
          ]},
          { id: 'v5', type: 'radio', text: 'How do you feel about physical labor?', options: [
            { v: 'Нравится', label: '💪 Like it, enjoy working with hands' },
            { v: 'Нормально', label: '👍 Fine, no problem' },
            { v: 'Предпочитаю умственный', label: '🧠 Prefer intellectual work' },
            { v: 'Сочетание', label: '⚖️ Want both' }
          ]},
          { id: 'v6', type: 'scale', text: 'How important is career growth and development for you?', min: 'Not important', max: 'Extremely important' },
          { id: 'v7', type: 'radio', text: 'Would you like to work in government structures?', options: [
            { v: 'Да', label: '🏛️ Yes, stability and status' },
            { v: 'Нет', label: '🚫 No, private sector' },
            { v: 'Не знаю', label: '🤷 Not sure yet' }
          ]},
          { id: 'v8', type: 'radio', text: 'Which field would you like to work in? (choose one main)', options: [
            { v: 'IT технологии', label: '💻 IT and technology' },
            { v: 'Медицина', label: '🏥 Medicine and health' },
            { v: 'Бизнес/Финансы', label: '📈 Business and finance' },
            { v: 'Искусство', label: '🎨 Arts and culture' }
          ]},
          { id: 'v8b', type: 'radio', text: 'Or another field:', options: [
            { v: 'Образование', label: '📚 Education' },
            { v: 'Безопасность', label: '🛡️ Security / law enforcement' },
            { v: 'Наука', label: '🔬 Science and research' },
            { v: 'Социальная сфера', label: '🤲 Social work / NGO' }
          ]},
          { id: 'v9', type: 'scale', text: 'How important is working in an eco / "green" field?', min: 'Not important', max: 'Very important' },
          { id: 'v10', type: 'textarea', text: 'Describe a person you admire or envy (in a good way) — what do you want to achieve like them?', placeholder: 'Write a few sentences...' },
          { id: 'v11', type: 'radio', text: 'In 10 years you want to be...', options: [
            { v: 'Специалист', label: '🎯 A top specialist in your field' },
            { v: 'Руководитель', label: '👔 A manager / executive' },
            { v: 'Предприниматель', label: '🏆 An entrepreneur' },
            { v: 'Творческая карьера', label: '✨ A famous creative person' }
          ]},
          { id: 'v12', type: 'scale', text: 'It is important that my work involves modern technologies and AI', min: 'Not important', max: 'Very important' },
          { id: 'v13', type: 'scale', text: 'I am ready to learn throughout my life', min: 'No', max: 'Yes' },
          { id: 'v14', type: 'radio', text: 'Your main life motivation:', options: [
            { v: 'Семья', label: '👨‍👩‍👧 Family and loved ones' },
            { v: 'Достижения', label: '🏅 Achievements and victories' },
            { v: 'Удовольствие', label: '😊 Enjoyment and quality of life' },
            { v: 'Влияние', label: '🌍 Making the world a better place' }
          ]},
          { id: 'v15', type: 'scale', text: 'I am willing to work more than 8 hours a day if I love the work', min: 'No', max: 'Yes' }
        ]
      },
      {
        id: 'maturity', icon: '🌱',
        title: 'Maturity & Psychotype',
        desc: 'These questions help assess psychological maturity and readiness for adult life',
        questions: [
          { id: 'm1', type: 'radio', text: 'When a serious problem arises, you usually...', options: [
            { v: 'Решаю сам(а)', label: '💪 Try to solve it yourself' },
            { v: 'Прошу помощи', label: '🤝 Ask close ones for help' },
            { v: 'Жду само рассосётся', label: '⏳ Wait for it to resolve itself' },
            { v: 'Впадаю в панику', label: '😰 Get anxious and confused' }
          ]},
          { id: 'm2', type: 'radio', text: 'How do you make important decisions?', options: [
            { v: 'Анализирую', label: '📊 Gather info and analyze' },
            { v: 'Интуиция', label: '💫 Trust my intuition' },
            { v: 'Советуюсь', label: '👥 Consult with others' },
            { v: 'Откладываю', label: '😬 Postpone' }
          ]},
          { id: 'm3', type: 'scale', text: 'I can handle disappointment and failure', min: 'Very hard', max: 'Easily' },
          { id: 'm4', type: 'scale', text: 'I know what I want from life', min: 'No idea', max: 'Exactly know' },
          { id: 'm5', type: 'scale', text: 'I can stand my ground without offending others', min: 'Very hard', max: 'Easily' },
          { id: 'm6', type: 'radio', text: 'How do you react to criticism from teachers/parents?', options: [
            { v: 'Принимаю и исправляю', label: '✅ Accept and draw conclusions' },
            { v: 'Обижаюсь', label: '😢 Feel offended, dwell on it' },
            { v: 'Игнорирую', label: '🙄 Ignore it' },
            { v: 'Агрессия', label: '😡 Get defensive or angry' }
          ]},
          { id: 'm7', type: 'scale', text: 'I plan my time (study, rest, hobbies)', min: 'No', max: 'Always' },
          { id: 'm8', type: 'radio', text: 'Are you ready to live independently — manage your own household?', options: [
            { v: 'Готов(а)', label: '✅ Yes, can cook, clean, manage budget' },
            { v: 'Частично', label: '🤔 Partly, still learning' },
            { v: 'Не готов(а)', label: '❌ Not yet ready' }
          ]},
          { id: 'm9', type: 'scale', text: 'I can manage my mood and emotions', min: 'No', max: 'Yes' },
          { id: 'm10', type: 'radio', text: 'When really upset or anxious, what do you do?', options: [
            { v: 'Спорт', label: '🏃 Exercise / go for a walk' },
            { v: 'Музыка/Творчество', label: '🎵 Music / creative activities' },
            { v: 'Общаюсь', label: '💬 Talk with friends / parents' },
            { v: 'Телефон', label: '📱 Phone / gaming' }
          ]},
          { id: 'm11', type: 'scale', text: 'I have stable interests I regularly dedicate time to', min: 'No', max: 'Yes' },
          { id: 'm12', type: 'radio', text: 'How do you relate to money?', options: [
            { v: 'Трачу сразу', label: '💸 Spend immediately, hard to save' },
            { v: 'Копить не умею', label: '🤷 Try to save but fail' },
            { v: 'Умею копить', label: '🏦 Save for goals' },
            { v: 'Бюджет', label: '📊 Track my expenses' }
          ]},
          { id: 'm13', type: 'scale', text: 'I take responsibility for my words and actions', min: 'No', max: 'Always' },
          { id: 'm14', type: 'radio', text: 'Your relationship with your parents:', options: [
            { v: 'Отличные', label: '❤️ Excellent, we understand each other' },
            { v: 'Нормальные', label: '👍 Normal' },
            { v: 'Напряжённые', label: '😬 Sometimes conflicts' },
            { v: 'Сложные', label: '😔 Complicated, barely talk' }
          ]},
          { id: 'm15', type: 'scale', text: 'I know my strengths and rely on them', min: 'Do not know', max: 'Know exactly' },
          { id: 'm16', type: 'radio', text: 'How do you handle stress?', options: [
            { v: 'Хорошо', label: '😌 Well — stress mobilizes me' },
            { v: 'Нормально', label: '😐 OK, I manage' },
            { v: 'Тяжело', label: '😓 Hard, takes long to recover' },
            { v: 'Очень тяжело', label: '😰 Very hard, totally derailed' }
          ]},
          { id: 'm17', type: 'scale', text: 'I can say "no" and refuse when needed', min: 'No', max: 'Yes' },
          { id: 'm18', type: 'radio', text: 'Your self-esteem:', options: [
            { v: 'Высокая', label: '😎 High — confident in myself' },
            { v: 'Нормальная', label: '🙂 Normal, adequate' },
            { v: 'Низкая', label: '😔 Low, often doubt myself' },
            { v: 'Нестабильная', label: '🎢 Unstable — ups and downs' }
          ]},
          { id: 'm19', type: 'scale', text: 'I am ready for independent adult life (study in another city, work)', min: 'No', max: 'Yes' },
          { id: 'm20', type: 'textarea', text: 'What are you most afraid of regarding the future?', placeholder: 'Write honestly...' }
        ]
      },
      {
        id: 'grades', icon: '📚',
        title: 'Academic Performance',
        desc: 'Enter your grades — important for finding the right direction',
        questions: [
          { id: 'grades_main', type: 'grades', text: 'Grades in main subjects (last report card)', subjects: [
            'Russian Language', 'Literature', 'Algebra', 'Geometry', 'Physics',
            'Chemistry', 'Biology', 'History', 'Social Studies', 'Geography',
            'English', 'Computer Science', 'Physical Education', 'Safety Studies', 'Technology'
          ]},
          { id: 'fav_subject', type: 'textarea', text: 'Favorite subjects — where are you best?', placeholder: 'E.g.: Math, computer science, biology...' },
          { id: 'hard_subject', type: 'textarea', text: 'Which subjects are hardest for you?', placeholder: 'E.g.: Physics, chemistry...' },
          { id: 'study_difficulty', type: 'radio', text: 'Overall, studying feels...', options: [
            { v: 'Легко', label: '🚀 Easy, I get A\'s and B\'s' },
            { v: 'Нормально', label: '📖 Normal, mostly good grades' },
            { v: 'Тяжело', label: '😓 Hard, mostly C\'s and some B\'s' },
            { v: 'Очень тяжело', label: '😩 Very hard, no motivation' }
          ]},
          { id: 'study_or_work', type: 'radio', text: 'After school you prefer to...', options: [
            { v: 'Учиться', label: '🎓 Study (college / university)' },
            { v: 'Учиться и работать', label: '💼 Study and work in parallel' },
            { v: 'Работать', label: '💪 Start working — studying is not for me' },
            { v: 'Не знаю', label: '🤷 Not sure yet' }
          ]}
        ]
      },
      {
        id: 'interests', icon: '🎨',
        title: 'Interests, Hobbies & Activities',
        desc: 'This is the MOST IMPORTANT section for AI analysis. Write in detail!',
        questions: [
          { id: 'hobbies_text', type: 'textarea', text: '🎯 What do you do in your free time? (be detailed!)', placeholder: 'E.g.: play guitar, watch space videos, skateboard, draw anime, write poetry, fix computers, knit, cook...' },
          { id: 'clubs_text', type: 'textarea', text: '🏫 What clubs, sections, or courses do you attend (or attended)?', placeholder: 'E.g.: wrestling (3 years), school theater, programming club, music school (piano)...' },
          { id: 'dream_text', type: 'textarea', text: '💭 If money and others\' opinions didn\'t matter — what would you do?', placeholder: 'Your dream, even if it seems unrealistic...' },
          { id: 'work_text', type: 'textarea', text: '💼 If you had to work right now — what could you do?', placeholder: 'What you can do and people would pay for right now...' },
          { id: 'achieve_text', type: 'textarea', text: '🏆 Your biggest achievement in the last 2-3 years (what are you proud of)?', placeholder: 'Olympiad win, sports achievement, project you created...' },
          { id: 'sport', type: 'radio', text: 'Do you play sports?', options: [
            { v: 'Профессионально', label: '🥇 Yes, professionally (competitions)' },
            { v: 'Для себя', label: '🏃 Yes, for myself' },
            { v: 'Иногда', label: '🚶 Sometimes' },
            { v: 'Нет', label: '😴 No' }
          ]},
          { id: 'music', type: 'radio', text: 'Music in your life:', options: [
            { v: 'Играю', label: '🎸 Play instrument' },
            { v: 'Пою', label: '🎤 Sing' },
            { v: 'Слушаю', label: '🎧 Just listen' },
            { v: 'Безразлично', label: '😐 Indifferent' }
          ]},
          { id: 'tech_interest', type: 'scale', text: 'How interested are you in computers, programming, gadgets?', min: 'No', max: 'Very much' },
          { id: 'social_media', type: 'textarea', text: 'Do you have a blog, channel, or account with followers? Tell us about it', placeholder: 'E.g.: TikTok about cats (1000 followers), YouTube gaming channel...' },
          { id: 'languages', type: 'textarea', text: 'What foreign languages do you know and at what level?', placeholder: 'E.g.: English — B2, learning Chinese...' },
          { id: 'travel', type: 'radio', text: 'Do you enjoy traveling and discovering new places?', options: [
            { v: 'Да', label: '✈️ Yes, love it' },
            { v: 'Нормально', label: '👍 It\'s okay' },
            { v: 'Предпочитаю дом', label: '🏠 Prefer home' }
          ]}
        ]
      },
      {
        id: 'mobility', icon: '🌍',
        title: 'Mobility & The Future',
        desc: 'Are you ready for changes in where you live?',
        questions: [
          { id: 'move_city', type: 'radio', text: 'Are you willing to move to another Russian city for study or work?', options: [
            { v: 'Да', label: '✅ Yes, ready' },
            { v: 'Рассматриваю', label: '🤔 Considering it' },
            { v: 'Нет', label: '🏠 No, want to stay in my city' }
          ]},
          { id: 'preferred_cities', type: 'textarea', text: 'Which Russian cities interest you?', placeholder: 'E.g.: Moscow, St. Petersburg, Kazan, Krasnodar...' },
          { id: 'move_abroad', type: 'radio', text: 'Are you considering moving to another country?', options: [
            { v: 'Да', label: '🌍 Yes, want to live abroad' },
            { v: 'Рассматриваю', label: '🤔 Considering it as an option' },
            { v: 'Нет', label: '🇷🇺 No, Russia is my choice' }
          ]},
          { id: 'preferred_countries', type: 'textarea', text: 'If abroad — which countries interest you?', placeholder: 'E.g.: UAE, Serbia, Germany, USA, Kazakhstan...' },
          { id: 'abroad_reason', type: 'radio', text: 'If abroad — main reason:', options: [
            { v: 'Образование', label: '🎓 Get foreign education' },
            { v: 'Работа', label: '💼 Find high-paying job' },
            { v: 'Образ жизни', label: '🌴 Better lifestyle' },
            { v: 'Родственники', label: '👨‍👩‍👧 Relatives live there' }
          ]},
          { id: 'timeline', type: 'radio', text: 'When do you want to decide on your future profession?', options: [
            { v: 'Уже знаю', label: '✅ I already know what I want to be' },
            { v: 'В процессе', label: '🔍 Still searching' },
            { v: 'Не думал', label: '😅 Haven\'t thought about it yet' }
          ]},
          { id: 'who_decides', type: 'radio', text: 'Who makes the decision about your profession?', options: [
            { v: 'Я сам(а)', label: '💪 I decide myself' },
            { v: 'С родителями', label: '👨‍👩‍👧 Together with parents' },
            { v: 'Родители', label: '👨‍👩 Parents decide' },
            { v: 'Ещё не знаем', label: '🤷 Haven\'t discussed yet' }
          ]},
          { id: 'parent_wish', type: 'textarea', text: 'Who do your parents want you to become? Do you agree with them?', placeholder: 'Write what parents think and your attitude...' },
          { id: 'role_model', type: 'textarea', text: 'Is there a profession or person you want to be like?', placeholder: 'Idol, acquaintance, relative...' },
          { id: 'final_wish', type: 'textarea', text: 'What do you expect from this analysis? What do you want to get?', placeholder: 'Write your expectations and questions...' }
        ]
      }
    ]
  }
};
