import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listEvents, registerForEvent, studentCabinet } from '../data/store.js'

const OLYMPIAD_DIRECTIONS = ['Математика', 'Информатика', 'Физика', 'Биология', 'Химия']
const PROJECT_DIRECTIONS = ['Робототехника', 'Дизайн', 'Медиа', 'Экология']

const STATUSES = [
  { id: 'none', label: 'Без заявки' },
  { id: 'подана', label: 'Подана' },
  { id: 'на рассмотрении', label: 'На рассмотрении' },
  { id: 'подтверждена', label: 'Подтверждена' },
  { id: 'лист ожидания', label: 'Лист ожидания' },
  { id: 'отклонена', label: 'Отклонена' },
  { id: 'отменена', label: 'Отменена' },
]

function categoryLabel(event) {
  if (event.category === 'project') {
    return event.projectKind ? `Проектная деятельность · ${event.projectKind}` : 'Проектная деятельность'
  }
  return 'Олимпиада'
}

function formatDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value || '—'
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}

function applicationFor(applications, eventId) {
  return (applications || []).find((item) => item.eventId === eventId) || null
}

function activeApplication(applications, eventId) {
  const item = applicationFor(applications, eventId)
  if (!item || item.status === 'отменена') return null
  return item
}

function directionGroups(category) {
  if (category === 'olympiad') return [{ title: 'Олимпиады', names: OLYMPIAD_DIRECTIONS }]
  if (category === 'project') return [{ title: 'Проектная деятельность', names: PROJECT_DIRECTIONS }]
  return [
    { title: 'Олимпиады', names: OLYMPIAD_DIRECTIONS },
    { title: 'Проектная деятельность', names: PROJECT_DIRECTIONS },
  ]
}

function matchesQuery(event, query) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = [
    event.title,
    event.organizer,
    event.description,
    event.city,
    event.place,
    event.terms,
    event.projectKind,
    ...(event.interests || []),
  ].join(' ').toLowerCase()
  return haystack.includes(needle)
}

export default function Events() {
  const navigate = useNavigate()
  const catalog = useMemo(() => {
    try {
      const loaded = listEvents()
      return Array.isArray(loaded) ? loaded : []
    } catch {
      return []
    }
  }, [])
  const published = useMemo(
    () => catalog.filter((event) => !event.status || event.status === 'published'),
    [catalog],
  )
  const [cabinet, setCabinet] = useState(() => {
    try {
      return studentCabinet()
    } catch {
      return { demo: true, loggedIn: false, user: null, applications: [] }
    }
  })
  const [directions, setDirections] = useState([])
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('none')
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const [open, setOpen] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!open) return undefined
    function onKey(event) {
      if (event.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function toggleDirection(name) {
    setDirections((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const visible = useMemo(() => {
    return published.filter((event) => {
      if (category === 'olympiad' && event.category !== 'olympiad') return false
      if (category === 'project' && event.category !== 'project') return false
      const application = applicationFor(cabinet.applications, event.id)
      const applicationStatus = application?.status || 'none'
      if (applicationStatus !== status) return false
      if (!matchesQuery(event, query)) return false
      if (directions.length === 0) return true
      const interests = Array.isArray(event.interests) ? event.interests : []
      return directions.some((name) => interests.includes(name))
    })
  }, [published, category, status, directions, query, cabinet.applications])

  const profileDirections = (cabinet.user?.interests || []).filter((name) => (
    OLYMPIAD_DIRECTIONS.includes(name) || PROJECT_DIRECTIONS.includes(name)
  ))
  const suggestionBasis = directions.length > 0 ? directions : profileDirections
  const recommended = useMemo(() => {
    if (suggestionBasis.length === 0) return []
    return published.filter((event) => {
      if (activeApplication(cabinet.applications, event.id)) return false
      const interests = Array.isArray(event.interests) ? event.interests : []
      return suggestionBasis.some((name) => interests.includes(name))
    }).slice(0, 3)
  }, [published, suggestionBasis, cabinet.applications])

  function changeCategory(value) {
    setCategory(value)
    if (value === 'all') {
      setDirections([])
      return
    }
    const allowed = new Set(directionGroups(value).flatMap((group) => group.names))
    setDirections((prev) => prev.filter((name) => allowed.has(name)))
  }

  const activeFilters = Number(category !== 'all')
    + Number(status !== 'none')
    + Number(directions.length > 0)

  function refresh() {
    try {
      setCabinet(studentCabinet())
    } catch {
      /* оставляем текущий снимок */
    }
  }

  function onRegister(event) {
    let result
    try {
      result = registerForEvent(event.id)
    } catch {
      setMessage('Не удалось отправить заявку.')
      return
    }
    if (!result.ok && result.reason === 'auth') {
      navigate('/auth')
      return
    }
    if (!result.ok) {
      setMessage('Регистрация на это мероприятие закрыта.')
      return
    }
    refresh()
    if (!result.already) setStatus(result.status || 'подана')
    setMessage(result.already ? `Заявка уже есть: ${result.status}.` : 'Заявка подана. Список переключён на этот статус.')
    setOpen(event)
  }

  function RegisterButton({ event }) {
    const existing = activeApplication(cabinet.applications, event.id)
    if (existing) {
      return (
        <button type="button" className="btn btn-ghost" onClick={(mouse) => { mouse.stopPropagation(); setOpen(event) }}>
          {existing.status}
        </button>
      )
    }
    return (
      <button type="button" className="btn btn-primary" onClick={(mouse) => { mouse.stopPropagation(); onRegister(event) }}>
        Зарегистрироваться
      </button>
    )
  }

  const opened = open ? published.find((event) => event.id === open.id) || open : null
  const openedApp = opened ? activeApplication(cabinet.applications, opened.id) : null

  return (
    <main>
      <div className="container">
        {status !== 'none' ? (
          <p className="notice">
            Показаны только заявки со статусом «{STATUSES.find((item) => item.id === status)?.label || status}».
          </p>
        ) : null}
        {message ? <p className="notice">{message}</p> : null}
        <div className="search-row">
          <label className="field">
            <span>Поиск</span>
            <input
              type="search"
              value={query}
              placeholder="Название, организатор или город"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="btn btn-primary filter-toggle"
            aria-expanded={filtersOpen}
            aria-controls="event-filters"
            onClick={() => setFiltersOpen((value) => !value)}
          >
            <svg className="tab-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            Фильтры{activeFilters ? ` · ${activeFilters}` : ''}
            <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
        {filtersOpen ? (
          <div className="card filter-panel" id="event-filters">
            <div className="filter-bar two">
              <label className="field">
                <span>Категория</span>
                <select value={category} onChange={(event) => changeCategory(event.target.value)}>
                  <option value="all">Все</option>
                  <option value="olympiad">Олимпиады</option>
                  <option value="project">Проектная деятельность</option>
                </select>
              </label>
              <label className="field">
                <span>Статус заявки</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  {STATUSES.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>
            </div>
            {category === 'all' ? (
              <p className="muted">Направление появится, когда выберете олимпиады или проектную деятельность.</p>
            ) : (
              <fieldset className="direction-filter">
                <legend>Направление</legend>
                <p className="muted">Можно отметить несколько. Пока ничего не отмечено, направление список не сужает.</p>
                <div className="direction-options">
                  {directionGroups(category)[0].names.map((name) => (
                    <label key={name} className="direction-option">
                      <input
                        type="checkbox"
                        checked={directions.includes(name)}
                        onChange={() => toggleDirection(name)}
                      />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        ) : null}
        <section className="recommend">
          {recommended.length > 0 ? (
            <>
              <h2>Рекомендуем для тебя</h2>
              <div className="event-grid">
                {recommended.map((event) => (
                  <article key={event.id} className="card event-card" onClick={() => setOpen(event)}>
                    <span className="badge badge-muted">{categoryLabel(event)}</span>
                    <h2 className="card-title">{event.title}</h2>
                    <p className="muted">{event.organizer}</p>
                    <p className="muted">{formatDate(event.date)} · {event.city} · {event.format}</p>
                    <p className="muted">Дедлайн: {formatDate(event.deadline)}</p>
                    <RegisterButton event={event} />
                  </article>
                ))}
              </div>
            </>
          ) : null}
          <button
            type="button"
            className="btn btn-primary recommend-more"
            aria-expanded={listOpen}
            onClick={() => setListOpen((value) => !value)}
          >
            {listOpen ? 'Свернуть список' : 'Посмотреть всё'}
          </button>
        </section>
        {listOpen ? <p className="muted">Показано {visible.length} из {published.length}</p> : null}
        {listOpen && visible.length === 0 ? (
          <p className="muted">В этом срезе ничего нет. Измените фильтры или поиск.</p>
        ) : null}
        {listOpen && visible.length > 0 ? (
          <div className="event-grid">
            {visible.map((event) => (
              <article
                key={event.id}
                className="card event-card"
                onClick={() => setOpen(event)}
              >
                <span className="badge badge-muted">{categoryLabel(event)}</span>
                <h2 className="card-title">{event.title}</h2>
                <p className="muted">{event.organizer}</p>
                <p className="muted">{formatDate(event.date)} · {event.city} · {event.format}</p>
                <p className="muted">Дедлайн: {formatDate(event.deadline)}</p>
                <RegisterButton event={event} />
              </article>
            ))}
          </div>
        ) : null}
      </div>
      {opened ? (
        <div className="detail-backdrop" onClick={() => setOpen(null)}>
          <div
            className="detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-detail-title"
            onClick={(mouse) => mouse.stopPropagation()}
          >
            <div className="spread">
              <span className="badge badge-muted">{categoryLabel(opened)}</span>
              <button type="button" className="btn btn-ghost btn-small" onClick={() => setOpen(null)}>Закрыть</button>
            </div>
            <h2 id="event-detail-title">{opened.title}</h2>
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
            {openedApp ? (
              <p className="notice">Ваша заявка: {openedApp.status}.</p>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => onRegister(opened)}>Зарегистрироваться</button>
            )}
          </div>
        </div>
      ) : null}
    </main>
  )
}
