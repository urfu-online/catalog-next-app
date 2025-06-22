import Database from 'better-sqlite3'
import path from 'path'

export interface ICourse {
  id?: number
  title: string
  description?: string
  competences?: string
  credits: number
  platform: string
  link: string
  interactive?: boolean
  tags: string // JSON string
  language: 'ru' | 'en'
}

class DatabaseManager {
  private db: Database.Database

  constructor() {
    try {
      // Используем абсолютный путь от корня проекта
      const dbPath = path.resolve(process.cwd(), 'database', 'data', 'courses.db')
      console.log('Подключение к базе данных:', dbPath)
      
      this.db = new Database(dbPath, { verbose: console.log })
      this.init()
    } catch (error) {
      console.error('Ошибка при инициализации базы данных:', error)
      throw error
    }
  }

  private init() {
    // Создаем таблицу курсов, если её нет
    this.db.exec(`
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
  }

  // Методы для работы с SQL-запросами
  prepare(sql: string) {
    return this.db.prepare(sql)
  }

  exec(sql: string) {
    return this.db.exec(sql)
  }

  // Получить все курсы
  getAllCourses(): ICourse[] {
    const stmt = this.db.prepare('SELECT * FROM courses ORDER BY title')
    const rows = stmt.all() as ICourse[]
    
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags),
      interactive: Boolean(row.interactive)
    }))
  }

  // Получить курс по ID
  getCourseById(id: number): ICourse | null {
    const stmt = this.db.prepare('SELECT * FROM courses WHERE id = ?')
    const row = stmt.get(id) as ICourse | undefined
    
    if (!row) return null
    
    return {
      ...row,
      tags: JSON.parse(row.tags),
      interactive: Boolean(row.interactive)
    }
  }

  // Получить курс по названию
  getCourseByTitle(title: string): ICourse | null {
    const stmt = this.db.prepare('SELECT * FROM courses WHERE title = ?')
    const row = stmt.get(title) as ICourse | undefined
    
    if (!row) return null
    
    return {
      ...row,
      tags: JSON.parse(row.tags),
      interactive: Boolean(row.interactive)
    }
  }

  // Добавить курс
  addCourse(course: Omit<ICourse, 'id'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO courses (title, description, competences, credits, platform, link, interactive, tags, language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
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
    
    return result.lastInsertRowid as number
  }

  // Обновить курс
  updateCourse(id: number, course: Partial<Omit<ICourse, 'id'>>): boolean {
    const fields = []
    const values = []
    
    if (course.title !== undefined) {
      fields.push('title = ?')
      values.push(course.title)
    }
    if (course.description !== undefined) {
      fields.push('description = ?')
      values.push(course.description)
    }
    if (course.competences !== undefined) {
      fields.push('competences = ?')
      values.push(course.competences)
    }
    if (course.credits !== undefined) {
      fields.push('credits = ?')
      values.push(course.credits)
    }
    if (course.platform !== undefined) {
      fields.push('platform = ?')
      values.push(course.platform)
    }
    if (course.link !== undefined) {
      fields.push('link = ?')
      values.push(course.link)
    }
    if (course.interactive !== undefined) {
      fields.push('interactive = ?')
      values.push(course.interactive ? 1 : 0)
    }
    if (course.tags !== undefined) {
      fields.push('tags = ?')
      values.push(JSON.stringify(course.tags))
    }
    if (course.language !== undefined) {
      fields.push('language = ?')
      values.push(course.language)
    }
    
    if (fields.length === 0) return false
    
    values.push(id)
    const stmt = this.db.prepare(`UPDATE courses SET ${fields.join(', ')} WHERE id = ?`)
    const result = stmt.run(...values)
    
    return result.changes > 0
  }

  // Удалить курс
  deleteCourse(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM courses WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  // Поиск курсов
  searchCourses(searchTerm?: string, tags?: string[], languages?: string[], platforms?: string[]): ICourse[] {
    let query = 'SELECT * FROM courses WHERE 1=1'
    const params: any[] = []

    if (searchTerm) {
      query += ' AND (title LIKE ? OR description LIKE ?)'
      params.push(`%${searchTerm}%`, `%${searchTerm}%`)
    }

    if (languages && languages.length > 0) {
      query += ` AND language IN (${languages.map(() => '?').join(', ')})`
      params.push(...languages)
    }

    if (platforms && platforms.length > 0) {
      query += ` AND platform IN (${platforms.map(() => '?').join(', ')})`
      params.push(...platforms)
    }

    query += ' ORDER BY title'
    
    const stmt = this.db.prepare(query)
    const rows = stmt.all(...params) as ICourse[]
    
    let courses = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags),
      interactive: Boolean(row.interactive)
    }))

    // Фильтрация по тегам (так как это JSON, делаем это после запроса)
    if (tags && tags.length > 0) {
      courses = courses.filter(course => 
        tags.some(tag => course.tags[tag] === true)
      )
    }

    return courses
  }

  close() {
    this.db.close()
  }
}

// Синглтон для базы данных с обработкой ошибок
let dbInstance: DatabaseManager | null = null

export function getDatabase(): DatabaseManager {
  if (!dbInstance) {
    try {
      dbInstance = new DatabaseManager()
    } catch (error) {
      console.error('Ошибка при создании экземпляра базы данных:', error)
      throw error
    }
  }
  return dbInstance
} 