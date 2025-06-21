import { getDatabase } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Некорректный ID курса' 
        },
        { status: 400 }
      )
    }
    
    const db = getDatabase()
    const course = db.getCourseById(id)
    
    if (!course) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Курс не найден' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: course
    })
  } catch (error) {
    console.error('Ошибка при получении курса:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Некорректный ID курса' 
        },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const db = getDatabase()
    
    const updated = db.updateCourse(id, body)
    
    if (!updated) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Курс не найден или нет данных для обновления' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Курс успешно обновлен'
    })
  } catch (error) {
    console.error('Ошибка при обновлении курса:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Некорректный ID курса' 
        },
        { status: 400 }
      )
    }
    
    const db = getDatabase()
    const deleted = db.deleteCourse(id)
    
    if (!deleted) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Курс не найден' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Курс успешно удален'
    })
  } catch (error) {
    console.error('Ошибка при удалении курса:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    )
  }
} 