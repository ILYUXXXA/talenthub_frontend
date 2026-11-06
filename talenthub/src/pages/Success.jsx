import { useEffect, useState } from 'react'
import { api } from '../api/client.js'

export default function Success() {
  const [data, setData] = useState({ attendances: [], achievements: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.success()
      .then(setData)
      .catch((cause) => setError(cause.message || 'Не удалось загрузить достижения.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <div className="container">
        <p className="lead">Куда школьник сходил и какие результаты подтверждены.</p>
        {loading ? <p className="muted">Загружаем достижения…</p> : null}
        {error ? <p className="notice">{error}</p> : null}
        <div className="grid-2">
          <section className="card">
            <h2>Посещения</h2>
            {data.attendances.length === 0 ? <p className="muted">Посещений пока нет.</p> : (
              <ul className="stack">{data.attendances.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
            )}
          </section>
          <section className="card">
            <h2>Достижения</h2>
            {data.achievements.length === 0 ? <p className="muted">Подтверждённых достижений пока нет.</p> : (
              <ul className="stack">{data.achievements.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
