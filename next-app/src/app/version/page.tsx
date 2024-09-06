export default async function Version() {
  // как в страницах ссылаться на api next
  const response = await fetch('http://next-app:3000/api/version', {
    cache: 'no-store', // Отключение кеширования
  })
  console.log(response)

  // Указываем, что ожидаем получить JSON
  const data: { version: string } = await response.json()

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1>Version App:</h1>
      <p>{data.version}</p>
    </main>
  )
}
