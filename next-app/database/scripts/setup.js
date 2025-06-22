const { extractData } = require('./extract-data')
const { migrateData } = require('./migrate')

async function setupDatabase() {
  try {
    console.log('🚀 Начинаем настройку базы данных...')
    
    // Извлекаем данные из TypeScript в JSON
    console.log('\n📦 Шаг 1: Извлечение данных из TypeScript...')
    extractData()
    
    // Запускаем миграцию
    console.log('\n🔄 Шаг 2: Миграция данных в базу...')
    migrateData()
    
    console.log('\n✅ База данных успешно настроена!')
  } catch (error) {
    console.error('\n❌ Ошибка при настройке базы данных:', error.message)
    process.exit(1)
  }
}

// Запускаем настройку базы данных
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase } 