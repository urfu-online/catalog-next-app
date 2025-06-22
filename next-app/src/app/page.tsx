'use client'

import { useState, useEffect, useCallback } from 'react'
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

export default function Home() {
  const [list, setList] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState({
    'Ядро бакалавриата': true,
    'Математика и ИТ': true,
    'Инженерные науки': true,
    'Экономика и управление': true,
    'Гуманитарные науки': true,
    'Естественные науки': true,
    'Искусственный интеллект': true,
    'Адаптационный модуль': true,
  })
  const [language, setLanguage] = useState({
    'ru': true,
    'en': true,
  })
  const [platform, setPlatform] = useState({
    'УрФУ.Онлайн': true,
    'НПОО': true,
  })

  // Функция для загрузки курсов с API
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Строим параметры запроса
      const params = new URLSearchParams()
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      // Активные категории (теги)
      const activeCategories = Object.entries(category)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
      if (activeCategories.length > 0 && activeCategories.length < 8) {
        params.append('tags', activeCategories.join(','))
      }
      
      // Активные языки
      const activeLanguages = Object.entries(language)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
      if (activeLanguages.length > 0 && activeLanguages.length < 2) {
        params.append('languages', activeLanguages.join(','))
      }
      
      // Активные платформы
      const activePlatforms = Object.entries(platform)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
      if (activePlatforms.length > 0 && activePlatforms.length < 2) {
        params.append('platforms', activePlatforms.join(','))
      }
      
      const response = await fetch(`/api/courses?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки курсов')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setList(data.data)
      } else {
        throw new Error(data.error || 'Неизвестная ошибка')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки курсов')
      setList([])
    } finally {
      setLoading(false)
    }
  }, [searchTerm, category, language, platform])

  // Загружаем курсы при изменении фильтров
  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const resetAllFilters = () => {
    setSearchTerm('')
    setCategory({
      'Ядро бакалавриата': true,
      'Математика и ИТ': true,
      'Инженерные науки': true,
      'Экономика и управление': true,
      'Гуманитарные науки': true,
      'Естественные науки': true,
      'Искусственный интеллект': true,
      'Адаптационный модуль': true,
    })
    setLanguage({
      'ru': true,
      'en': true,
    })
    setPlatform({
      'УрФУ.Онлайн': true,
      'НПОО': true,
    })
  }

  return (
    <div className="u-page">
      {/* Header */}
      <header className="u-header u-bg-light u-sticky-top">
        <div className="u-container">
          <div className="u-row u-py-3">
            <div className="u-col-12 u-col-lg-3 u-mb-3 u-mb-lg-0">
              <div style={{ position: 'relative' }}>
                <Image src="/urfu_logo.svg" alt="УрФУ" width="275" height="80" className="u-img-responsive" />
                {/* Скрытая ссылка на админ панель */}
                <a 
                  href="/admin/courses/manage/3a7f8b2e9c1d4f6h8j2k5l7n9p0q"
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    width: '20px', 
                    height: '20px', 
                    opacity: 0,
                    zIndex: 10
                  }}
                  title="Административная панель"
                >
                  🔧
                </a>
              </div>
            </div>
            <div className="u-col-12 u-col-lg-9">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Найти курс по названию..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {searchTerm && (
                    <button className="search-clear" onClick={clearSearch}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="u-container u-py-4">
        <div className="u-row">
          {/* Sidebar */}
          <aside className="u-col-12 u-col-lg-3">
            <div className="filters-sidebar">
              <div className="filter-section">
                <div className="filter-header">
                  <h3 className="filter-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Категории
                  </h3>
                </div>
                <div className="filter-content">
                  <form className="u-form">
                    {Object.entries(category).map(([name, value]) => (
                      <div key={name} className="u-form-item">
                        <label className="u-checkbox">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => {
                              setCategory({ ...category, [name]: e.target.checked })
                            }}
                          />
                          <span className="u-checkbox-mark"></span>
                          <span className="u-checkbox-text">{name}</span>
                        </label>
                      </div>
                    ))}
                  </form>
                </div>
              </div>

              <div className="filter-section">
                <div className="filter-header">
                  <h3 className="filter-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12V7a7 7 0 1 1 14 0v5"></path>
                      <path d="M5 12H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2"></path>
                      <path d="M19 12h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"></path>
                      <path d="M9 12v9"></path>
                      <path d="M15 12v9"></path>
                    </svg>
                    Язык курса
                  </h3>
                </div>
                <div className="filter-content">
                  <form className="u-form">
                    <div className="u-form-item">
                      <label className="u-checkbox">
                        <input 
                          type="checkbox" 
                          checked={language.ru}
                          onChange={(e) => {
                            // Предотвращаем снятие последнего языка
                            if (!e.target.checked && !language.en) {
                              return
                            }
                            setLanguage({ ...language, ru: e.target.checked })
                          }}
                        />
                        <span className="u-checkbox-mark"></span>
                        <span className="u-checkbox-text">Русский язык</span>
                      </label>
                    </div>
                    <div className="u-form-item">
                      <label className="u-checkbox">
                        <input 
                          type="checkbox" 
                          checked={language.en}
                          onChange={(e) => {
                            // Предотвращаем снятие последнего языка
                            if (!e.target.checked && !language.ru) {
                              return
                            }
                            setLanguage({ ...language, en: e.target.checked })
                          }}
                        />
                        <span className="u-checkbox-mark"></span>
                        <span className="u-checkbox-text">Английский язык</span>
                      </label>
                    </div>
                  </form>
                </div>
              </div>

              <div className="filter-section">
                <div className="filter-header">
                  <h3 className="filter-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="6" width="20" height="8" rx="1"></rect>
                      <path d="M17 14v7"></path>
                      <path d="M7 14v7"></path>
                      <path d="M17 3v3"></path>
                      <path d="M7 3v3"></path>
                      <path d="M10 14 2.3 6.3"></path>
                      <path d="m14 6 7.7 7.7"></path>
                      <path d="m8 6 8 8"></path>
                    </svg>
                    Платформа
                  </h3>
                </div>
                <div className="filter-content">
                  <form className="u-form">
                    <div className="u-form-item">
                      <label className="u-checkbox">
                        <input 
                          type="checkbox" 
                          checked={platform['УрФУ.Онлайн']}
                          onChange={(e) => {
                            // Предотвращаем снятие последней платформы
                            if (!e.target.checked && !platform['НПОО']) {
                              return
                            }
                            setPlatform({ ...platform, 'УрФУ.Онлайн': e.target.checked })
                          }}
                        />
                        <span className="u-checkbox-mark"></span>
                        <span className="u-checkbox-text">УрФУ.Онлайн</span>
                      </label>
                    </div>
                    <div className="u-form-item">
                      <label className="u-checkbox">
                        <input 
                          type="checkbox" 
                          checked={platform['НПОО']}
                          onChange={(e) => {
                            // Предотвращаем снятие последней платформы
                            if (!e.target.checked && !platform['УрФУ.Онлайн']) {
                              return
                            }
                            setPlatform({ ...platform, 'НПОО': e.target.checked })
                          }}
                        />
                        <span className="u-checkbox-mark"></span>
                        <span className="u-checkbox-text">НПОО</span>
                      </label>
                    </div>
                  </form>
                </div>
              </div>

              <div className="filter-actions">
                <button 
                  className="u-btn u-btn-secondary u-btn-block"
                  onClick={resetAllFilters}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                  Сбросить фильтры
                </button>
              </div>
            </div>
          </aside>

          {/* Course Cards */}
          <section className="u-col-12 u-col-lg-9">
            {loading ? (
              <div className="u-preloader-mini">
                <svg className="u-preloader-mini-container" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="23" stroke="#1E4391" strokeWidth="2"/>
                  <circle className="u-preloader-mini-dot" cx="6.5" cy="6.5" r="6.5" fill="#1E4391"/>
                </svg>
              </div>
            ) : error ? (
              <div className="error-state">
                <div className="error-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3>Ошибка загрузки</h3>
                <p>{error}</p>
                <button className="u-btn u-btn-primary" onClick={fetchCourses}>
                  Попробовать снова
                </button>
              </div>
            ) : list.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <h3>Курсы не найдены</h3>
                <p>
                  {searchTerm && 'Поисковый запрос не дал результатов. '}
                  {Object.values(category).every(v => !v) && 'Выберите хотя бы одну категорию. '}
                  {!searchTerm && Object.values(category).some(v => v) && 'Попробуйте изменить настройки фильтров.'}
                </p>
                <button className="u-btn u-btn-primary" onClick={resetAllFilters}>
                  Сбросить все фильтры
                </button>
              </div>
            ) : (
              <div className="u-row">
                {list.map((course, index) => (
                  <div key={course.id || course.title + index} className="u-col-12 u-col-md-6 u-col-xl-4 u-mb-4">
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="course-card-link"
                    >
                      <div className="course-card">
                        <div className="course-card-header">
                          <div className="course-platform">
                            {course.platform === 'НПОО' ? (
                              <>
                                <Image src="/openedu.png" alt="НПОО" width={20} height={20} />
                                <span>{course.platform}</span>
                              </>
                            ) : (
                              <>
                                <Image src="/urfu.png" alt="УрФУ" width={20} height={20} />
                                <span>{course.platform}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="course-card-body">
                          <h3 className="course-title">{course.title}</h3>
                          
                          <div className="course-tags">
                            {Object.entries(course.tags)
                              .filter(([_, value]) => value)
                              .slice(0, 3) // Показываем только первые 3 тега
                              .map(([tag, _]) => (
                                <span key={tag} className="u-status u-status-primary">
                                  {tag}
                                </span>
                              ))}
                            {Object.entries(course.tags).filter(([_, value]) => value).length > 3 && (
                              <span className="u-status u-status-secondary">
                                +{Object.entries(course.tags).filter(([_, value]) => value).length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="course-card-footer">
                          <span className="course-link-text">
                            Перейти к курсу
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M7 17L17 7M17 7H7M17 7V17"/>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
