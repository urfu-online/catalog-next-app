const path = require('path')

/**
 * Конфигурация базы данных
 */
const databaseConfig = {
  // Путь к файлу базы данных
  dbPath: path.join(process.cwd(), 'database', 'data', 'courses.db'),
  
  // Путь к папке с данными
  dataDir: path.join(process.cwd(), 'database', 'data'),
  
  // Путь к файлу с исходными данными курсов
  coursesDataPath: path.join(process.cwd(), 'database', 'config', 'courses-data.json'),
  
  // Настройки соответствия с базой данных
  dbOptions: {
    // Опции для better-sqlite3
    verbose: process.env.NODE_ENV === 'development' ? console.log : null,
    fileMustExist: false,
    timeout: 5000,
    readonly: false
  }
}

module.exports = databaseConfig 