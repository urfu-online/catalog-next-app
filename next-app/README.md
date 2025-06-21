# Каталог курсов УрФУ

Веб-приложение для просмотра каталога онлайн-курсов Уральского федерального университета.

## Особенности

- 🗄️ **SQLite база данных** - курсы хранятся в локальной базе данных
- 🔍 **Поиск и фильтрация** - по названию, категориям, языку и платформе
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- ⚡ **REST API** - полноценный API для работы с курсами
- 🎨 **УрФУ UI Kit** - использует фирменный стиль УрФУ

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
# или
bun install
```

### 2. Настройка базы данных

Создайте SQLite базу данных и заполните её тестовыми данными:

```bash
npm run db:setup
```

Эта команда:
- Создаст файл `courses.db` в корне проекта
- Создаст таблицу `courses`
- Заполнит её тестовыми данными курсов

### 3. Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### 4. Сборка для продакшена

```bash
npm run build
```

## API Endpoints

Приложение предоставляет следующие API endpoints:

### Получить все курсы

```
GET /api/courses
```

**Параметры запроса:**
- `search` - поиск по названию или описанию
- `tags` - фильтр по категориям (через запятую)
- `languages` - фильтр по языкам: `ru`, `en` (через запятую)
- `platforms` - фильтр по платформам: `УрФУ.Онлайн`, `НПОО` (через запятую)

**Пример:**
```
GET /api/courses?search=машинное&tags=Искусственный интеллект&languages=en
```

### Получить курс по ID

```
GET /api/courses/[id]
```

### Добавить новый курс

```
POST /api/courses
```

**Тело запроса:**
```json
{
  "title": "Название курса",
  "description": "Описание курса",
  "competences": "Компетенции",
  "credits": 3,
  "platform": "УрФУ.Онлайн",
  "link": "https://...",
  "interactive": true,
  "tags": {
    "Математика и ИТ": true,
    "Искусственный интеллект": true
  },
  "language": "ru"
}
```

### Обновить курс

```
PUT /api/courses/[id]
```

### Удалить курс

```
DELETE /api/courses/[id]
```

## Структура базы данных

```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  competences TEXT,
  credits INTEGER NOT NULL,
  platform TEXT NOT NULL,
  link TEXT NOT NULL,
  interactive BOOLEAN DEFAULT FALSE,
  tags TEXT NOT NULL, -- JSON строка
  language TEXT NOT NULL CHECK (language IN ('ru', 'en'))
)
```

## Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - типизация
- **Better-SQLite3** - SQLite база данных
- **Tailwind CSS** - стилизация
- **УрФУ UI Kit** - компоненты интерфейса

## Структура проекта

```
next-app/
├── src/app/
│   ├── api/courses/          # API роуты
│   ├── page.tsx              # Главная страница
│   └── globals.css           # Глобальные стили
├── lib/
│   └── database.ts           # Утилиты для работы с БД
├── scripts/
│   └── migrate-data.js       # Скрипт миграции данных
├── courses.db                # SQLite база данных
└── package.json
```

## Разработка

### Добавление новых курсов

1. Через API:
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Новый курс","credits":3,...}'
```

2. Напрямую в базе данных через SQLite клиент

### Миграция данных

Для переноса данных из существующего JSON файла в базу данных:

1. Обновите данные в `scripts/migrate-data.js`
2. Запустите: `npm run db:setup`

## Docker

Приложение поддерживает запуск в Docker контейнерах:

```bash
# Разработка
docker-compose -f docker-compose.dev.yml up

# Продакшен
docker-compose -f docker-compose.prod.yml up
```
