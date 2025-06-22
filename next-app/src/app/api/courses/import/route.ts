import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

interface ImportCourse {
  title: string
  description?: string
  competences?: string
  credits: number
  platform: string
  link: string
  interactive?: boolean
  tags: { [key: string]: boolean }
  language: 'ru' | 'en'
}

interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: string[]
  details: {
    successful: string[]
    failed: { course: string, error: string }[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.courses || !Array.isArray(data.courses)) {
      return NextResponse.json({
        success: false,
        error: 'Неверный формат данных. Ожидается объект с массивом courses.'
      }, { status: 400 })
    }

    const db = getDatabase()
    const courses: ImportCourse[] = data.courses
    const result: ImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [],
      details: {
        successful: [],
        failed: []
      }
    }

    // Валидация и импорт каждого курса
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i]
      const courseNumber = i + 1
      
      try {
        // Валидация обязательных полей
        if (!course.title?.trim()) {
          throw new Error('Отсутствует название курса')
        }
        
        if (!course.credits || course.credits < 1 || course.credits > 10) {
          throw new Error('Зачетные еденицы должны быть числом от 1 до 10')
        }
        
        if (!course.platform?.trim()) {
          throw new Error('Отсутствует платформа')
        }
        
        if (!course.link?.trim()) {
          throw new Error('Отсутствует ссылка на курс')
        }
        
        if (!course.language || (course.language !== 'ru' && course.language !== 'en')) {
          throw new Error('Язык должен быть "ru" или "en"')
        }
        
        // Проверка валидности URL
        try {
          new URL(course.link)
        } catch {
          throw new Error('Некорректная ссылка на курс')
        }
        
        // Проверка существования курса с таким же названием
        const existingCourse = db.getCourseByTitle(course.title)
        if (existingCourse) {
          throw new Error('Курс с таким названием уже существует')
        }
        
        // Добавляем курс через метод addCourse
        const courseId = db.addCourse({
          title: course.title.trim(),
          description: course.description?.trim() || '',
          competences: course.competences?.trim() || '',
          credits: course.credits,
          platform: course.platform.trim(),
          link: course.link.trim(),
          interactive: course.interactive || false,
          tags: JSON.stringify(course.tags || {}),
          language: course.language
        })
        
        result.imported++
        result.details.successful.push(`Курс ${courseNumber}: "${course.title}"`)
        
      } catch (error) {
        result.failed++
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
        const fullError = `Курс ${courseNumber}: ${errorMessage}`
        result.errors.push(fullError)
        result.details.failed.push({
          course: course.title || `Курс ${courseNumber}`,
          error: errorMessage
        })
      }
    }
    
    // Если есть ошибки, но также есть успешные импорты
    if (result.failed > 0 && result.imported > 0) {
      result.success = true // Частичный успех
    } else if (result.failed > 0 && result.imported === 0) {
      result.success = false // Полный провал
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Ошибка импорта курсов:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка сервера при импорте курсов'
    }, { status: 500 })
  }
} 