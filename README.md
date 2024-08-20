# Каталог УрФУ.Онлайн

## Предварительные условия

Установите [Docker Desktop](https://docs.docker.com/get-docker) для Mac, Windows или Linux. Docker Desktop включает в себя Docker Compose как часть установки.

## Разработка

Сначала запустите сервер разработки:

```bash
# Создайте сеть, которая позволит контейнерам общаться
# друг с другом, используя имя своего контейнера в качестве имени хоста
docker network create my_network

# Build dev
docker compose -f docker-compose.dev.yml build

# Up dev
docker compose -f docker-compose.dev.yml up
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере, чтобы увидеть результат.

Вы можете начать редактировать страницу, изменив файл `pages/index.tsx`. Страница будет автоматически обновляться по мере редактирования файла.

## Производство

В производстве настоятельно рекомендуется использовать многоступенчатые сборки. В сочетании с функцией Next [Output Standalone](https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files) в финальный образ Docker копируются только файлы `node_modules`, необходимые для производства.

Сначала запустите производственный сервер (финальный образ размером около 110 МБ).

```bash
# Создайте сеть, которая позволит контейнерам общаться
# друг с другом, используя имя своего контейнера в качестве имени хоста
docker network create my_network

# Build prod
docker compose -f docker-compose.prod.yml build

# Up prod in detached mode
docker compose -f docker-compose.prod.yml up -d
```

В качестве альтернативы запустите рабочий сервер без многоступенчатых сборок (финальный образ около 1 ГБ).

```bash
# Создайте сеть, которая позволит контейнерам общаться
# друг с другом, используя имя своего контейнера в качестве имени хоста
docker network create my_network

# Build prod without multistage
docker compose -f docker-compose.prod-without-multistage.yml build

# Up prod without multistage in detached mode
docker compose -f docker-compose.prod-without-multistage.yml up -d
```

Откройте [http://localhost:3000](http://localhost:3000).

## Полезные команды

```bash
# Stop all running containers
docker kill $(docker ps -aq) && docker rm $(docker ps -aq)

# Free space
docker system prune -af --volumes
```
