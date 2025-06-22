const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

// Загружаем данные курсов из JSON файла
const coursesDataPath = path.join(process.cwd(), 'database', 'config', 'courses-data.json')
const coursesData = JSON.parse(fs.readFileSync(coursesDataPath, 'utf8'))

function checkExistingDatabase(dbPath) {
  if (!fs.existsSync(dbPath)) {
    return false
  }

  try {
    const db = new Database(dbPath, { readonly: true })
    
    // Проверяем существование таблицы courses и наличие в ней данных
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='courses'").get()
    if (!tableExists) {
      db.close()
      return false
    }

    const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get()
    db.close()

    return courseCount.count > 0
  } catch (error) {
    console.error('Ошибка при проверке существующей базы данных:', error)
    return false
  }
}

function migrateData() {
  console.log('🚀 Проверка и настройка базы данных SQLite...')
  
  const dbPath = path.join(process.cwd(), 'database', 'data', 'courses.db')
  const dbDir = path.dirname(dbPath)
  
  // Создаем директорию, если она не существует
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  // Проверяем существующую базу данных
  const hasExistingData = checkExistingDatabase(dbPath)
  if (hasExistingData) {
    console.log('✅ Обнаружена существующая база данных с данными')
    console.log(`📍 Файл базы данных: ${dbPath}`)
    return
  }
  
  console.log('📝 Создание новой базы данных...')
  
  // Пробуем удалить существующую пустую базу данных
  try {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath)
      console.log('📝 Удалена существующая пустая база данных')
    }
  } catch (error) {
    if (error.code === 'EACCES') {
      console.log('⚠️ Не удалось удалить существующую базу данных из-за прав доступа')
      // Продолжаем выполнение, SQLite сам разберется с существующим файлом
    } else {
      throw error
    }
  }
  
  const db = new Database(dbPath, { 
    verbose: console.log,
    fileMustExist: false // Позволяем создать новый файл
  })
  
  // Создаем таблицу
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
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
  
  // Очищаем существующие данные
  db.exec('DELETE FROM courses')
  
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