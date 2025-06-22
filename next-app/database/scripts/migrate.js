const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

// Загружаем данные курсов из JSON файла
const coursesDataPath = path.join(process.cwd(), 'database', 'config', 'courses-data.json')
const coursesData = JSON.parse(fs.readFileSync(coursesDataPath, 'utf8'))

function migrateData() {
  console.log('🚀 Перенос данных в SQLite базу данных...')
  
  const dbPath = path.join(process.cwd(), 'database', 'data', 'courses.db')
  
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
  
  console.log('🎉 Миграция успешно завершена!')
  console.log(`📍 Файл базы данных: ${dbPath}`)
}

// Запускаем миграцию, если скрипт вызван напрямую
if (require.main === module) {
  migrateData()
}

module.exports = { migrateData } 