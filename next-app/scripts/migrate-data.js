const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

// Данные курсов (первые несколько для тестирования)
const coursesData = [
  {
    title: 'Soft Skills: навыки 21 века',
    description: 'Курс позволяет получить представление об основных метакомпетенциях, которые необходимы современному человеку для личностной и профессиональной реализации.\n\nПосле этого курса вы сможете:\n\n- выявлять уникальные способности других людей, раскрывать их потенциал;\n- воспринимать, регулировать и конструктивно реагировать на чужие идеи;\n- находить решение проблем, управлять конфликтами, оказывать влияние и укреплять доверие с другими людьми.',
    competences: 'УК-1. Способен осуществлять поиск, критический анализ и синтез информации, применять системный подход для решения поставленных задач \nУК-2. Способен определять круг задач в рамках поставленной цели и выбирать оптимальные способы их решения, исходя из действующих правовых норм, имеющихся ресурсов и ограничений \nУК-3. Способен осуществлять социальное взаимодействие и реализовывать свою роль в команде\nУК-4. Способен осуществлять деловую коммуникацию в устной и письменной формах на государственном языке Российской Федерации и иностранном(ых) языке(ах)\nУК-6. Способен управлять своим временем, выстраивать и реализовывать траекторию саморазвития на основе принципов образования в течение всей жизни\nУК-10. - Способен использовать базовые дефектологические знания в социальной и профессиональной сферах',
    credits: 3,
    platform: 'НПОО',
    link: 'https://openedu.ru/course/urfu/SoftSkills/',
    interactive: true,
    tags: {
      'Ядро бакалавриата': false,
      'Математика и ИТ': false,
      'Инженерные науки': false,
      'Экономика и управление': false,
      'Гуманитарные науки': true,
      'Естественные науки': false,
      'Искусственный интеллект': false,
      'Адаптационный модуль': false,
    },
    language: 'ru',
  },
  {
    title: 'Cybersecurity in the power industry',
    description: 'The purpose of the course is to give students a holistic view of the structure and principles of operation of the cybersecurity tools at the fuel and energy sector facilities in the context of the digital transformation of the industry.\n\nThe course presents the principles of building and using digital substations, information and analytical systems, the vulnerabilities and threats in the field of information security in the power industry, the principles of building models and databases, database management systems and providing access to them.\n\nThe course also discusses the principles of using risk management, legislative, organizational and technical means of ensuring cybersecurity (cryptography, software and hardware) and the features of using machine learning in the power industry from the point of view of cybersecurity.',
    competences: 'Upon completion of the course, you will be able to:\nApply principles of ensuring cybersecurity at the Fuel and Energy Sector facilities.\nAnalyze the basic stages of the information processes in the power systems in order to reveal vulnerabilities in information protection.\nIdentify, prevent threats and ensure the cybersecurity of the information systems at the industrial enterprises using the optimal protection methods.\nUse the main cryptographic, software and software-hardware means of ensuring cybersecurity.\nDesign information systems for collecting, storing and intelligent data processing using the tools for detecting data anomalies and distortions.',
    credits: 3,
    platform: 'УрФУ.Онлайн',
    link: 'https://courses.openedu.urfu.ru/course-v1:UrFU+CYBERSECURITYEn+original',
    interactive: false,
    tags: {
      'Ядро бакалавриата': false,
      'Математика и ИТ': false,
      'Инженерные науки': true,
      'Экономика и управление': false,
      'Гуманитарные науки': false,
      'Искусственный интеллект': false,
      'Естественные науки': false,
      'Адаптационный модуль': false,
    },
    language: 'en',
  },
  {
    title: 'Machine learning in power industry',
    description: '',
    competences: '',
    credits: 3,
    platform: 'УрФУ.Онлайн',
    link: 'https://courses.openedu.urfu.ru/course-v1:UrFUx+MLENERGYEN+original',
    interactive: false,
    tags: {
      'Ядро бакалавриата': false,
      'Математика и ИТ': true,
      'Инженерные науки': true,
      'Экономика и управление': false,
      'Гуманитарные науки': false,
      'Искусственный интеллект': true,
      'Естественные науки': false,
      'Адаптационный модуль': false,
    },
    language: 'en',
  }
]

function migrateData() {
  console.log('🚀 Перенос данных в SQLite базу данных...')
  
  const dbPath = path.join(process.cwd(), 'courses.db')
  
  // Удаляем существующую базу данных, если она есть
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath)
    console.log('📝 Удалена существующая база данных')
  }
  
  const db = new Database(dbPath)
  
  // Создаем таблицу
  db.exec(`
    CREATE TABLE courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      competences TEXT,
      credits INTEGER NOT NULL,
      platform TEXT NOT NULL,
      link TEXT NOT NULL,
      interactive BOOLEAN DEFAULT FALSE,
      tags TEXT NOT NULL,
      language TEXT NOT NULL CHECK (language IN ('ru', 'en'))
    )
  `)
  
  console.log('✅ Создана таблица courses')
  
  // Подготавливаем запрос для вставки
  const insertStmt = db.prepare(`
    INSERT INTO courses (title, description, competences, credits, platform, link, interactive, tags, language)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  // Вставляем данные
  const transaction = db.transaction((courses) => {
    for (const course of courses) {
      insertStmt.run(
        course.title,
        course.description || null,
        course.competences || null,
        course.credits,
        course.platform,
        course.link,
        course.interactive ? 1 : 0,
        JSON.stringify(course.tags),
        course.language
      )
    }
  })
  
  try {
    transaction(coursesData)
    console.log(`✅ Добавлено ${coursesData.length} курсов в базу данных`)
  } catch (error) {
    console.error('❌ Ошибка при переносе данных:', error.message)
    process.exit(1)
  } finally {
    db.close()
  }
  
  console.log('🎉 База данных успешно создана!')
  console.log(`📍 Файл базы данных: ${dbPath}`)
}

// Запускаем миграцию, если скрипт вызван напрямую
if (require.main === module) {
  migrateData()
}

module.exports = { migrateData } 