import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, mapRegistration } from '../api/client.js'

function formatDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value || '—'
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}

function categoryLabel(event) {
  if (event.category === 'project') {
    return event.projectKind ? `Проектная деятельность · ${event.projectKind}` : 'Проектная деятельность'
  }
  if (event.category === 'olympiad') return 'Олимпиада'
  return 'Мероприятие'
}

function dateParts(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return { day: '—', month: '' }
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const [, month, day] = value.split('-')
  return { day, month: months[Number(month) - 1] || '' }
}

function statusClass(status) {
  if (status === 'подтверждена') return 'badge badge-ok'
  if (status === 'отклонена') return 'badge badge-no'
  if (status === 'отменена' || status === 'лист ожидания') return 'badge badge-muted'
  return 'badge badge-pending'
}

export default function Applications() {
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState([])
  const [cabinet, setCabinet] = useState({ loggedIn: false, demo: false, applications: [] })
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const [events, registrations] = await Promise.all([api.events(), api.registrations()])
    setCatalog(events)
    setCabinet({ loggedIn: true, demo: false, applications: registrations })
  }

  useEffect(() => {
    refresh().catch((cause) => setMessage(cause.message || 'Не удалось загрузить заявки.')).finally(() => setLoading(false))
  }, [])
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(null)

  useEffect(() => {
    if (!open) return undefined
    function onKey(event) {
      if (event.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function onCancel(registrationId) {
    try {
      await api.cancelRegistration(registrationId)
      setMessage('Заявка отменена.')
      await refresh()
      setOpen((current) => current && current.id === registrationId ? { ...current, status: 'отменена' } : current)
    } catch (cause) {
      setMessage(cause.message || 'Не удалось отменить заявку.')
    }
  }

  async function onRegister(event) {
    try {
      await api.registerForEvent(event.id)
      setMessage('Заявка подана.')
      await refresh()
    } catch (cause) {
      if (cause.status === 401) {
        navigate('/auth')
        return
      }
      setMessage(cause.message || 'Не удалось отправить заявку.')
    }
  }

  const items = cabinet.applications || []
  const opened = open
    ? catalog.find((event) => event.id === open.eventId) || {
      id: open.eventId,
      title: open.title,
      organizer: open.organizer,
      category: open.category,
      date: open.date,
      city: open.city,
      format: open.format,
    }
    : null

  return (
    <main>
      <div className="container">
        {loading ? <p className="muted">Загружаем заявки…</p> : null}
        <p className="lead">Регистрации на мероприятия и их статусы.</p>
        {cabinet.demo ? (
          <p className="notice">Войдите, чтобы видеть и отменять свои заявки.</p>
        ) : null}
        {message ? <p className="notice">{message}</p> : null}
        {items.length === 0 ? (
          <p className="muted">Заявок пока нет. <Link to="/events">Выберите мероприятие</Link> и зарегистрируйтесь.</p>
        ) : (
          <div className="apply-grid">
            {items.map((item) => {
              const date = dateParts(item.date)
              return (
                <article
                  key={item.id}
                  className="card apply-card"
                  onClick={() => setOpen(item)}
                >
                  <div className="apply-date">
                    <span className="apply-day">{date.day}</span>
                    <span className="apply-month">{date.month}</span>
                  </div>
                  <div className="apply-body">
                    <div className="spread">
                      <h2 className="card-title">{item.title}</h2>
                      <span className={statusClass(item.status)}>{item.status}</span>
                    </div>
                    <p className="muted">
                      {item.organizer || 'Организатор не указан'}
                      {item.city ? ` · ${item.city}` : ''}
                    </p>
                    {cabinet.loggedIn && item.status !== 'отменена' && item.status !== 'отклонена' ? (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={(mouse) => {
                          mouse.stopPropagation()
                          onCancel(item.id)
                        }}
                      >
                        Отменить заявку
                      </button>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
      {opened ? (
        <div className="detail-backdrop" onClick={() => setOpen(null)}>
          <div
            className="detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-detail-title"
            onClick={(mouse) => mouse.stopPropagation()}
          >
            <div className="spread">
              <span className="badge badge-muted">{categoryLabel(opened)}</span>
              <button type="button" className="btn btn-ghost btn-small" onClick={() => setOpen(null)}>Закрыть</button>
            </div>
            <h2 id="application-detail-title">{opened.title}</h2>
            <dl className="detail-grid">
              <dt>Организатор</dt>
              <dd>{opened.organizer || '—'}</dd>
              <dt>Интересы</dt>
              <dd>{(opened.interests || []).join(', ') || '—'}</dd>
              <dt>Класс</dt>
              <dd>{opened.grade || '—'}</dd>
              <dt>Дата</dt>
              <dd>{formatDate(opened.date)}</dd>
              <dt>Место</dt>
              <dd>{[opened.city, opened.place].filter(Boolean).join(', ') || '—'}</dd>
              <dt>Формат</dt>
              <dd>{opened.format || '—'}</dd>
              <dt>Условия</dt>
              <dd>{opened.terms || '—'}</dd>
              <dt>Дедлайн</dt>
              <dd>{formatDate(opened.deadline)}</dd>
              <dt>Мест</dt>
              <dd>{opened.seats ?? '—'}</dd>
            </dl>
            {opened.description ? <p>{opened.description}</p> : null}
            {open.status && open.status !== 'отменена' ? (
              <p className="notice">Ваша заявка: {open.status}.</p>
            ) : null}
            {!open.status || open.status === 'отменена' || open.status === 'отклонена' ? <button type="button" className="btn btn-primary" onClick={() => onRegister(opened)}>Подать заявку</button> : null}
          </div>
        </div>
      ) : null}
    </main>
  )
}
