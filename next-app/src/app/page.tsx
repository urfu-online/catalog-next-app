'use client'

import { courses } from '@/src/app/data'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function Home() {
  const [list, setList] = useState(courses)
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

  // Единая функция фильтрации
  const applyFilters = useCallback(() => {
    let filteredCourses = courses

    // Фильтр по поисковому запросу
    if (searchTerm) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Фильтр по категориям
    const activeCategories = Object.entries(category)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
    
    // Если НИ ОДНА категория не выбрана, показываем пустой результат
    if (activeCategories.length === 0) {
      filteredCourses = []
    } else {
      filteredCourses = filteredCourses.filter(course =>
        activeCategories.some(categoryName => course.tags[categoryName])
      )
    }

    // Фильтр по языку
    const activeLanguages = Object.entries(language)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
    
    // Языки всегда будут выбраны (минимум один), поэтому просто фильтруем
    filteredCourses = filteredCourses.filter(course =>
      activeLanguages.includes(course.language)
    )

    // Фильтр по платформе
    const activePlatforms = Object.entries(platform)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
    
    // Платформы всегда будут выбраны (минимум одна), поэтому просто фильтруем
    filteredCourses = filteredCourses.filter(course =>
      activePlatforms.includes(course.platform)
    )

    setList(filteredCourses)
  }, [searchTerm, category, language, platform])

  // Применяем фильтры при изменении любого состояния
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

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
              <Image src="/urfu_logo.svg" alt="УрФУ" width="275" height="80" className="u-img-responsive" />
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
            {list.length === 0 ? (
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
                  <div key={course.title + index} className="u-col-12 u-col-md-6 u-col-xl-4 u-mb-4">
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
