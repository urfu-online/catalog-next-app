const fs = require('fs')
const path = require('path')

function extractData() {
  console.log('🔍 Извлечение данных из TypeScript файла...')
  
  try {
    // Читаем файл data.ts
    const dataFile = fs.readFileSync(
      path.join(process.cwd(), 'src', 'app', 'data.ts'),
      'utf8'
    )
    
    // Извлекаем массив курсов
    const coursesMatch = dataFile.match(/export const courses: ICourse\[\] = (\[[\s\S]*?\]);?\s*$/m)
    if (!coursesMatch) {
      throw new Error('Не удалось найти данные курсов в файле data.ts')
    }
    
    // Выполняем JavaScript код для получения данных
    const coursesCode = coursesMatch[1]
    const courses = eval(coursesCode)
    
    // Сохраняем в JSON файл
    const jsonPath = path.join(process.cwd(), 'database', 'config', 'courses-data.json')
    fs.writeFileSync(jsonPath, JSON.stringify(courses, null, 2), 'utf8')
    
    console.log(`✅ Данные успешно извлечены и сохранены в ${jsonPath}`)
    console.log(`📊 Количество курсов: ${courses.length}`)
    
  } catch (error) {
    console.error('❌ Ошибка при извлечении данных:', error.message)
    process.exit(1)
  }
}

// Запускаем извлечение данных
if (require.main === module) {
  extractData()
}

module.exports = { extractData } 