import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EventFeed from '../components/EventFeed.jsx'
import { registerForEvent, studentCabinet } from '../data/store.js'

export default function Events() {
  const navigate = useNavigate()
  const [cabinet, setCabinet] = useState(() => {
    try {
      return studentCabinet()
    } catch {
      return { demo: true, loggedIn: false, user: null, applications: [] }
    }
  })

  function refresh() {
    try {
      setCabinet(studentCabinet())
    } catch {
      /* оставляем текущий снимок */
    }
  }

  function onAction(event) {
    let result
    try {
      result = registerForEvent(event.id)
    } catch {
      return { ok: false, message: 'Не удалось отправить заявку.' }
    }
    if (!result.ok && result.reason === 'auth') return { ok: false, reason: 'auth' }
    if (!result.ok) return { ok: false, message: 'Регистрация на это мероприятие закрыта.' }
    refresh()
    return {
      ok: true,
      already: result.already,
      status: result.already ? undefined : (result.status || 'подана'),
      message: result.already ? `Заявка уже есть: ${result.status}.` : 'Заявка подана. Список переключён на этот статус.',
    }
  }

  return (
    <main>
      <div className="container">
        <EventFeed
          interests={cabinet.user?.interests}
          applications={cabinet.applications}
          onAction={onAction}
          onAuthRequired={() => navigate('/auth')}
        />
      </div>
    </main>
  )
}
