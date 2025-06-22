const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

function setupDatabase() {
  console.log('🚀 Настройка базы данных...')
  
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
    // Поскольку мы не можем напрямую импортировать TypeScript, 
    // мы загрузим данные из файла как текст и извлечем их
    const dataFile = fs.readFileSync(
      path.join(process.cwd(), 'src/app/data.ts'), 
      'utf8'
    )
    
    // Простой парсинг для извлечения данных (это упрощенный подход)
    // В реальном проекте лучше использовать более надежный парсер
    const coursesMatch = dataFile.match(/export const courses: ICourse\[\] = (\[[\s\S]*?\]);?\s*$/m)
    if (!coursesMatch) {
      throw new Error('Не удалось найти данные курсов в файле data.ts')
    }
    
    // Выполняем JavaScript код для получения данных
    const coursesCode = coursesMatch[1]
    const courses = eval(coursesCode)
    
    transaction(courses)
    
    console.log(`✅ Добавлено ${courses.length} курсов в базу данных`)
    
  } catch (error) {
    console.error('❌ Ошибка при переносе данных:', error.message)
    process.exit(1)
  } finally {
    db.close()
  }
  
  console.log('🎉 База данных успешно настроена!')
  console.log(`📍 Файл базы данных: ${dbPath}`)
}

// Запускаем настройку, если скрипт вызван напрямую
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase } 