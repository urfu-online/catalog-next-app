'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ICourse {
  id?: number
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

const defaultTags = {
  'Ядро бакалавриата': false,
  'Математика и ИТ': false,
  'Инженерные науки': false,
  'Экономика и управление': false,
  'Гуманитарные науки': false,
  'Естественные науки': false,
  'Искусственный интеллект': false,
  'Адаптационный модуль': false,
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)

  // Форма для нового/редактируемого курса
  const [formData, setFormData] = useState<ICourse>({
    title: '',
    description: '',
    competences: '',
    credits: 3,
    platform: 'УрФУ.Онлайн',
    link: '',
    interactive: false,
    tags: { ...defaultTags },
    language: 'ru',
  })

  // Загрузка курсов
  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/courses')
      const data = await response.json()

      if (data.success) {
        setCourses(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Ошибка загрузки курсов')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  // Сброс сообщений через 3 секунды
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  // Обработка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let response
      if (editingCourse) {
        // Обновление существующего курса
        response = await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } else {
        // Создание нового курса
        response = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      }

      const data = await response.json()

      if (data.success) {
        setSuccess(editingCourse ? 'Курс успешно обновлен!' : 'Курс успешно добавлен!')
        resetForm()
        fetchCourses()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Ошибка при сохранении курса')
    }
  }

  // Удаление курса
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Курс успешно удален!')
        fetchCourses()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Ошибка при удалении курса')
    }
  }

  // Начать редактирование
  const startEdit = (course: ICourse) => {
    setEditingCourse(course)
    setFormData(course)
    setIsAddingNew(false)
  }

  // Сброс формы
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      competences: '',
      credits: 3,
      platform: 'УрФУ.Онлайн',
      link: '',
      interactive: false,
      tags: { ...defaultTags },
      language: 'ru',
    })
    setEditingCourse(null)
    setIsAddingNew(false)
  }

  // Обновление тегов
  const updateTag = (tagName: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tags: { ...prev.tags, [tagName]: value },
    }))
  }

  // Импорт курсов из JSON
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Проверка типа файла
    if (!file.name.endsWith('.json')) {
      setError('Пожалуйста, выберите JSON файл')
      return
    }

    setIsImporting(true)
    setImportResult(null)

    try {
      const text = await file.text()
      const jsonData = JSON.parse(text)

      const response = await fetch('/api/courses/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      })

      const result = await response.json()
      setImportResult(result)

      if (result.success) {
        setSuccess(`Импорт завершен! Успешно: ${result.imported}, Ошибки: ${result.failed}`)
        fetchCourses() // Обновляем список курсов
      } else {
        setError(result.error || 'Ошибка импорта')
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        setError('Некорректный JSON файл')
      } else {
        setError('Ошибка при чтении файла')
      }
    } finally {
      setIsImporting(false)
      // Сброс input для повторного выбора того же файла
      event.target.value = ''
    }
  }

  // Сброс результатов импорта
  const clearImportResult = () => {
    setImportResult(null)
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="u-header u-bg-light u-sticky-top">
        <div className="u-container">
          <div className="header-content justify-between">
            <div className="logo-section">
              <a href="/" className="logo-link">
                <Image 
                  src="/urfu_logo.svg" 
                  alt="УрФУ" 
                  width="275" 
                  height="80" 
                  className="u-img-responsive" 
                />
              
              </a>
            </div>
           
            <h1 className="admin-title ">
              Администрирование курсов
            </h1>
          </div>
        </div>
      </header>

      <main className="u-container u-py-4">
        {/* Сообщения */}
        {success && (
          <div className="u-row u-mb-4">
            <div className="u-col-12">
              <div className="u-alert u-alert-success">
                <strong>Успех!</strong> {success}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="u-row u-mb-4">
            <div className="u-col-12">
              <div className="u-alert u-alert-danger">
                <strong>Ошибка!</strong> {error}
              </div>
            </div>
          </div>
        )}

        <div className="u-row">


          {/* Список курсов */}
          <div className="u-col-12 u-col-lg-7">
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-list-header">
                  <h2 className="admin-card-title">
                    <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    Список курсов ({courses.length})
                  </h2>
                  <button className="u-btn u-btn-secondary u-btn-sm" onClick={fetchCourses} disabled={loading}>
                    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                    </svg>
                    <span style={{ marginLeft: '4px' }}>Обновить</span>
                  </button>
                </div>
              </div>

              <div className="admin-card-body">
                {loading ? (
                  <div className="loading-state">
                    <div className="loading-spinner">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                      </svg>
                    </div>
                    <p>Загрузка курсов...</p>
                  </div>
                ) : (
                  <div className="courses-list">
                    {courses.map((course) => (
                      <div key={course.id} className="course-item u-mb-3">
                        <div className="course-info">
                          <h3 className="course-title">{course.title}</h3>
                          <div className="course-meta u-mb-2">
                            <span className="u-status u-status-primary">{course.platform}</span>
                            <span className="u-status u-status-secondary">
                              {course.language === 'ru' ? (
                                <>
                                  <svg
                                    className="icon-xs"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                  </svg>
                                  RU
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="icon-xs"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                  </svg>
                                  EN
                                </>
                              )}
                            </span>
                            <span className="u-status u-status-success">{course.credits} з.е.</span>
                            {course.interactive && (
                              <span className="u-status u-status-warning">
                                <svg
                                  className="icon-xs"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                                Интерактивный
                              </span>
                            )}
                          </div>
                          <div className="course-tags">
                            {Object.entries(course.tags)
                              .filter(([_, value]) => value)
                              .map(([tag, _]) => (
                                <span key={tag} className="u-status u-status-light">
                                  {tag}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div className="course-actions">
                          <button
                            className="u-btn u-btn-secondary u-btn-sm"
                            onClick={() => startEdit(course)}
                            title="Редактировать курс"
                          >
                            <svg
                              className="icon-sm"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="u-btn u-btn-danger u-btn-sm"
                            onClick={() => course.id && handleDelete(course.id)}
                            title="Удалить курс"
                          >
                            <svg
                              className="icon-sm"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3,6 5,6 21,6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                          <a
                            href={course.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="u-btn u-btn-primary u-btn-sm"
                            title="Открыть курс"
                          >
                            <svg
                              className="icon-sm"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Форма добавления/редактирования */}
          <div className="u-col-12 u-col-lg-5 u-mb-4">
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-form-header">
                  <h2 className="admin-card-title">
                    {editingCourse ? (
                      <>
                        <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Редактировать курс
                      </>
                    ) : (
                      <>
                        <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Добавить курс
                      </>
                    )}
                  </h2>
                  {(editingCourse || isAddingNew) && (
                    <button type="button" className="u-btn u-btn-secondary u-btn-sm" onClick={resetForm}>
                      Отмена
                    </button>
                  )}
                </div>
              </div>

              <div className="admin-card-body">
                {editingCourse || isAddingNew ? (
                  <form onSubmit={handleSubmit} className="u-form">
                    <div className="u-form-item">
                      <label htmlFor="title" className="u-form-label">
                        Название курса *
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="u-form-control"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Введите название курса"
                        required
                      />
                    </div>

                    <div className="u-form-item">
                      <label htmlFor="description" className="u-form-label">
                        Описание
                      </label>
                      <textarea
                        id="description"
                        className="u-form-control"
                        rows={4}
                        value={formData.description || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Подробное описание курса, целей и задач"
                      />
                    </div>

                    <div className="u-form-item">
                      <label htmlFor="competences" className="u-form-label">
                        Компетенции
                      </label>
                      <textarea
                        id="competences"
                        className="u-form-control"
                        rows={3}
                        value={formData.competences || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, competences: e.target.value }))}
                        placeholder="Список компетенций, которые развивает курс"
                      />
                    </div>

                    <div className="u-row">
                      <div className="u-col-6">
                        <div className="u-form-item">
                          <label htmlFor="credits" className="u-form-label">
                            Зачетные еденицы *
                          </label>
                          <input
                            id="credits"
                            type="number"
                            className="u-form-control"
                            min="1"
                            max="10"
                            value={formData.credits}
                            onChange={(e) => setFormData((prev) => ({ ...prev, credits: parseInt(e.target.value) }))}
                            required
                          />
                        </div>
                      </div>
                      <div className="u-col-6">
                        <div className="u-form-item">
                          <label htmlFor="language" className="u-form-label">
                            Язык *
                          </label>
                          <select
                            id="language"
                            className="u-form-control"
                            value={formData.language}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, language: e.target.value as 'ru' | 'en' }))
                            }
                            required
                          >
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="u-form-item">
                      <label htmlFor="platform" className="u-form-label">
                        Платформа *
                      </label>
                      <select
                        id="platform"
                        className="u-form-control"
                        value={formData.platform}
                        onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
                        required
                      >
                        <option value="УрФУ.Онлайн">УрФУ.Онлайн</option>
                        <option value="НПОО">НПОО</option>
                      </select>
                    </div>

                    <div className="u-form-item">
                      <label htmlFor="link" className="u-form-label">
                        Ссылка на курс *
                      </label>
                      <input
                        id="link"
                        type="url"
                        className="u-form-control"
                        value={formData.link}
                        onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                        placeholder="https://example.com/course"
                        required
                      />
                    </div>

                    <div className="u-form-item">
                      <label className="u-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.interactive}
                          onChange={(e) => setFormData((prev) => ({ ...prev, interactive: e.target.checked }))}
                        />
                        <span className="u-checkbox-mark"></span>
                        <span className="u-checkbox-text">Интерактивный курс</span>
                      </label>
                    </div>

                    <div className="u-form-item">
                      <label className="u-form-label">Категории</label>
                      <div className="tags-grid">
                        {Object.entries(formData.tags).map(([tagName, checked]) => (
                          <div key={tagName} className="u-form-item">
                            <label className="u-checkbox">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => updateTag(tagName, e.target.checked)}
                              />
                              <span className="u-checkbox-mark"></span>
                              <span className="u-checkbox-text">{tagName}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="u-form-actions">
                      <button type="submit" className="u-btn u-btn-primary u-btn-block">
                        {editingCourse ? (
                          <>
                            <svg
                              className="icon-md"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                              <polyline points="17,21 17,13 7,13 7,21" />
                              <polyline points="7,3 7,8 15,8" />
                            </svg>
                            Сохранить изменения
                          </>
                        ) : (
                          <>
                            <svg
                              className="icon-md"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Добавить курс
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="empty-state">
                    <p>Выберите курс для редактирования или добавьте новый</p>
                    <button className="u-btn u-btn-primary" onClick={() => setIsAddingNew(true)}>
                      <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Добавить новый курс
                    </button>
                  </div>
                )}
              </div>
            </div>
         
                    {/* Импорт курсов */}
                    
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-form-header">
                  <h2 className="admin-card-title">
                    <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Пакетный импорт курсов
                  </h2>
                  {importResult && (
                    <button type="button" className="u-btn u-btn-secondary u-btn-sm" onClick={clearImportResult}>
                      Скрыть результат
                    </button>
                  )}
                </div>
              </div>

              <div className="admin-card-body">
                <div className="u-form">
                  <div className="u-form-item">
                    <label className="u-form-label">Выберите JSON файл с курсами</label>
                    <div className="file-upload-container">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        disabled={isImporting}
                        className="file-input"
                        id="course-import"
                      />
                      <label htmlFor="course-import" className="file-upload-label">
                        <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7,10 12,15 17,10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        {isImporting ? 'Импортируем...' : 'Выбрать JSON файл'}
                      </label>
                    </div>
                    <small className="form-help">
                      Файл должен содержать объект с массивом courses.
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => {
                          const example = {
                            courses: [
                              {
                                title: 'Пример курса',
                                description: 'Описание курса',
                                competences: 'Компетенции курса',
                                credits: 3,
                                platform: 'УрФУ.Онлайн',
                                link: 'https://example.com',
                                interactive: true,
                                tags: {
                                  'Ядро бакалавриата': true,
                                  'Математика и ИТ': false,
                                },
                                language: 'ru',
                              },
                            ],
                          }
                          navigator.clipboard.writeText(JSON.stringify(example, null, 2))
                          setSuccess('Пример структуры скопирован в буфер обмена!')
                        }}
                      >
                        Скопировать пример структуры
                      </button>
                    </small>
                  </div>
                </div>

                {/* Результаты импорта */}
                {importResult && (
                  <div className="import-results">
                    <h3>Результаты импорта:</h3>
                    <div className="import-summary">
                      <span className="import-stat success">✓ Успешно: {importResult.imported}</span>
                      <span className="import-stat error">✗ Ошибки: {importResult.failed}</span>
                    </div>

                    {importResult.details.successful.length > 0 && (
                      <div className="import-section">
                        <h4>Успешно импортированы:</h4>
                        <ul className="import-list success">
                          {importResult.details.successful.map((course: string, index: number) => (
                            <li key={index}>{course}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {importResult.details.failed.length > 0 && (
                      <div className="import-section">
                        <h4>Ошибки импорта:</h4>
                        <ul className="import-list error">
                          {importResult.details.failed.map((fail: any, index: number) => (
                            <li key={index}>
                              <strong>{fail.course}:</strong> {fail.error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
