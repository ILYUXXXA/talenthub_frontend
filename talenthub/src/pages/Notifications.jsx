import { useEffect, useState } from 'react'
import { api } from '../api/client.js'

const TYPE_LABELS = {
  confirmation: 'Подтверждение заявки',
  deadline: 'Дедлайн',
  interest: 'По интересам',
  invite: 'Приглашение',
}

function TypeIcon({ type }) {
  const props = { className: 'inbox-svg', viewBox: '0 0 24 24', 'aria-hidden': true }
  if (type === 'deadline') return <svg {...props}><circle cx="12" cy="12" r="8" /><path d="M12 8v5l3 2" /></svg>
  if (type === 'interest') return <svg {...props}><path d="m12 3 2.2 4.6L19 8.2l-3.5 3.4.8 4.9L12 14.8 7.7 16.5l.8-4.9L5 8.2l4.8-.6L12 3z" /></svg>
  if (type === 'invite') return <svg {...props}><path d="M4 7h16v10H4z" /><path d="m4 7 8 6 8-6" /></svg>
  return <svg {...props}><circle cx="12" cy="12" r="8" /><path d="m8.5 12.5 2.2 2.2 4.8-5" /></svg>
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('ru-RU')
}

export default function Notifications() {
  const [items, setItems] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.notifications()
      .then((feed) => {
        setItems(feed.items || [])
        setUnreadCount(feed.unread_count || 0)
      })
      .catch((cause) => setError(cause.message || 'Не удалось загрузить уведомления.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="student-workspace">
      <div className="container">
        {loading ? <p className="muted">Загружаем уведомления…</p> : null}
        {error ? <p className="notice">{error}</p> : null}
        <p className="lead">
          {items.length === 0 ? 'Сообщений пока нет.' : unreadCount > 0 ? `Непрочитанных: ${unreadCount}.` : 'Все уведомления прочитаны.'}
        </p>
        {items.length === 0 ? (
          <p className="muted">Когда школа, администратор или организатор напишут, сообщение появится здесь.</p>
        ) : (
          <ul className="inbox">
            {items.map((item) => (
              <li key={item.id} className={item.read ? 'inbox-row' : 'inbox-row unread'}>
                <span className="inbox-icon" title={TYPE_LABELS[item.type] || 'Сообщение'}><TypeIcon type={item.type} /></span>
                <div><p className="inbox-title">{item.title}</p><p className="inbox-body">{item.body}</p></div>
                <time className="inbox-time" dateTime={item.created_at}>{formatDate(item.created_at)}</time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
