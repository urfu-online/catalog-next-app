import { getDatabase } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Извлекаем параметры запроса
    const searchTerm = searchParams.get('search') || undefined
    const tagsParam = searchParams.get('tags')
    const languagesParam = searchParams.get('languages')
    const platformsParam = searchParams.get('platforms')
    
    // Парсим массивы из строк
    const tags = tagsParam ? tagsParam.split(',') : undefined
    const languages = languagesParam ? languagesParam.split(',') : undefined
    const platforms = platformsParam ? platformsParam.split(',') : undefined
    
    console.log('Параметры запроса:', { searchTerm, tags, languages, platforms })
    
    const db = getDatabase()
    const courses = db.searchCourses(searchTerm, tags, languages, platforms)
    
    console.log(`Найдено ${courses.length} курсов`)
    
    return NextResponse.json({
      success: true,
      data: courses,
      count: courses.length
    })
  } catch (error) {
    console.error('Ошибка при получении курсов:', error)
    
    // Определяем тип ошибки для более точного ответа
    if (error instanceof Error) {
      if (error.message.includes('no such file or directory')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'База данных не найдена. Пожалуйста, убедитесь, что база данных создана и доступна.' 
          },
          { status: 500 }
        )
      }
      
      if (error.message.includes('SQLITE_CANTOPEN')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Не удалось открыть базу данных. Проверьте права доступа.' 
          },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация данных
    if (!body.title || !body.credits || !body.platform || !body.link || !body.language) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Отсутствуют обязательные поля' 
        },
        { status: 400 }
      )
    }
    
    const db = getDatabase()
    const courseId = db.addCourse(body)
    
    return NextResponse.json({
      success: true,
      data: { id: courseId },
      message: 'Курс успешно добавлен'
    })
  } catch (error) {
    console.error('Ошибка при добавлении курса:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    )
  }
} 