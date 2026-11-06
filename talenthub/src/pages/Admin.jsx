import { useEffect, useState } from 'react'

function TabIcon({ children }) {
  return (
    <svg className="tab-icon" viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

const TABS = [
  {
    id: 'events',
    label: 'Мероприятия',
    icon: (
      <TabIcon>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </TabIcon>
    ),
  },
  {
    id: 'partnerships',
    label: 'Партнёрство',
    icon: (
      <TabIcon>
        <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" />
      </TabIcon>
    ),
  },
  {
    id: 'achievements',
    label: 'Достижения',
    icon: (
      <TabIcon>
        <circle cx="12" cy="9" r="5" />
        <path d="M8.5 13.2 7 21l5-2.4L17 21l-1.5-7.8" />
      </TabIcon>
    ),
  },
]

const SEED = {
  events: [
    {
      id: 'mod-event-1',
      title: 'Республиканская олимпиада по математике',
      category: 'olympiad',
      organizer: 'Лицей БГУ',
      date: '2026-03-12',
      city: 'Минск',
      place: 'Лицей БГУ',
      format: 'Очно',
      grade: '9–11',
      interests: ['Математика'],
      terms: 'Заявку подаёт школа',
      deadline: '2026-03-01',
      seats: 80,
      description: 'Лицей БГУ просит опубликовать очный тур для 9–11 классов. Заявку подаёт школа, интерес — математика. После проверки мероприятие появится в каталоге.',
      status: 'pending',
    },
    {
      id: 'mod-event-2',
      title: 'Проектная смена «Своими руками»',
      category: 'project',
      organizer: 'Гимназия №1 Минск',
      date: '2026-06-22',
      city: 'Минск',
      place: 'Учебный корпус',
      format: 'Очно',
      grade: '8–11',
      interests: ['Проектная работа', 'Робототехника'],
      terms: 'Команда до 4 человек, свой прототип',
      deadline: '2026-06-01',
      seats: 40,
      description: 'Гимназия №1 Минск просит добавить смену, где школьники собирают прототип руками. Команды до 4 человек, интересы — проектная работа и робототехника.',
      status: 'pending',
    },
  ],
  partnerships: [
    {
      id: 'mod-partner-1',
      title: 'Мастер-класс по разработке',
      from: 'EPAM Systems',
      to: 'Лицей БГУ',
      date: '2026-04-18',
      city: 'Минск',
      format: 'Очно',
      text: 'EPAM Systems просит допустить один очный мастер-класс по разработке для 10–11 классов. После допуска Лицей БГУ увидит запрос и сможет ответить.',
      status: 'pending',
    },
  ],
  achievements: [
    {
      id: 'mod-ach-1',
      title: 'Диплом III степени, городская олимпиада по информатике',
      student: 'Алина Коваль',
      school: 'Лицей БГУ',
      date: '2026-02-20',
      categoryLabel: 'Олимпиада',
      text: 'Лицей БГУ просит подтвердить диплом Алины Коваль за городскую олимпиаду по информатике. После подтверждения запись добавится в профиль ученика.',
      status: 'pending',
    },
  ],
}

function formatDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value || '—'
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}

function categoryLabel(category) {
  if (category === 'project' || category === 'Проектная деятельность') return 'Проектная деятельность'
  return 'Олимпиада'
}

function pendingOf(list) {
  return list.filter((item) => item.status === 'pending')
}

function ModeratorBar({ section, onSection, counts }) {
  return (
    <header className="header student-header">
      <div className="header-inner parent-bar">
        <span className="logo">TalentHub</span>
        <p className="header-greet">Здравствуйте!</p>
        <nav className="nav student-tabs mod-tabs">
          {TABS.map((tab) => {
            const count = counts[tab.id]
            return (
              <button
                key={tab.id}
                type="button"
                className={section === tab.id ? 'active' : undefined}
                onClick={() => onSection(tab.id)}
              >
                {tab.icon}
                {tab.label}
                {count > 0 ? <span className="tab-count">{count}</span> : null}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

function QueueCard({ item, kind, onOpen }) {
  return (
    <button type="button" className="card mod-card" onClick={onOpen}>
      <span className="badge badge-pending">На проверке</span>
      <span className="card-title">{item.title}</span>
      {kind === 'events' ? (
        <>
          <p>{categoryLabel(item.category)}. Организатор — {item.organizer}.</p>
          <p className="muted">
            {formatDate(item.date)} · {item.city}, {item.place}. {item.format}, классы {item.grade}. Дедлайн {formatDate(item.deadline)}, мест {item.seats}.
          </p>
          <p>{item.description}</p>
        </>
      ) : null}
      {kind === 'partnerships' ? (
        <>
          <p>Запрос: {item.from} → {item.to}.</p>
          <p className="muted">{formatDate(item.date)} · {item.city} · {item.format}</p>
          <p>{item.text}</p>
        </>
      ) : null}
      {kind === 'achievements' ? (
        <>
          <p>{item.student}, {item.school}. {item.categoryLabel}.</p>
          <p className="muted">{formatDate(item.date)}</p>
          <p>{item.text}</p>
        </>
      ) : null}
    </button>
  )
}

function Detail({ item, kind, onClose, onDecide }) {
  const actions = kind === 'events'
    ? [
      { status: 'published', label: 'Опубликовать', tone: 'btn btn-primary btn-small' },
      { status: 'rejected', label: 'Отклонить', tone: 'btn btn-danger btn-small' },
    ]
    : kind === 'partnerships'
      ? [
        { status: 'incoming', label: 'Допустить', tone: 'btn btn-primary btn-small' },
        { status: 'rejected', label: 'Отклонить', tone: 'btn btn-danger btn-small' },
      ]
      : [
        { status: 'confirmed', label: 'Подтвердить', tone: 'btn btn-primary btn-small' },
        { status: 'rejected', label: 'Отклонить', tone: 'btn btn-danger btn-small' },
      ]

  const note = kind === 'events'
    ? 'Публикация добавит мероприятие в каталог.'
    : kind === 'partnerships'
      ? 'Допуск передаст запрос школе.'
      : 'Подтверждение добавит достижение в профиль ученика.'

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <div
        className="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="moderator-detail-title"
        onClick={(mouse) => mouse.stopPropagation()}
      >
        <div className="spread">
          <span className="badge badge-pending">На проверке</span>
          <button type="button" className="btn btn-ghost btn-small" onClick={onClose}>Закрыть</button>
        </div>
        <h2 id="moderator-detail-title">{item.title}</h2>
        {kind === 'events' ? (
          <dl className="detail-grid">
            <dt>Категория</dt>
            <dd>{categoryLabel(item.category)}</dd>
            <dt>Организатор</dt>
            <dd>{item.organizer}</dd>
            <dt>Интересы</dt>
            <dd>{item.interests.join(', ')}</dd>
            <dt>Класс</dt>
            <dd>{item.grade}</dd>
            <dt>Дата</dt>
            <dd>{formatDate(item.date)}</dd>
            <dt>Место</dt>
            <dd>{[item.city, item.place].filter(Boolean).join(', ')}</dd>
            <dt>Формат</dt>
            <dd>{item.format}</dd>
            <dt>Условия</dt>
            <dd>{item.terms}</dd>
            <dt>Дедлайн</dt>
            <dd>{formatDate(item.deadline)}</dd>
            <dt>Мест</dt>
            <dd>{item.seats}</dd>
          </dl>
        ) : null}
        {kind === 'partnerships' ? (
          <dl className="detail-grid">
            <dt>От кого</dt>
            <dd>{item.from}</dd>
            <dt>Кому</dt>
            <dd>{item.to}</dd>
            <dt>Дата</dt>
            <dd>{formatDate(item.date)}</dd>
            <dt>Город</dt>
            <dd>{item.city}</dd>
            <dt>Формат</dt>
            <dd>{item.format}</dd>
          </dl>
        ) : null}
        {kind === 'achievements' ? (
          <dl className="detail-grid">
            <dt>Ученик</dt>
            <dd>{item.student}</dd>
            <dt>Школа</dt>
            <dd>{item.school}</dd>
            <dt>Категория</dt>
            <dd>{item.categoryLabel}</dd>
            <dt>Дата</dt>
            <dd>{formatDate(item.date)}</dd>
          </dl>
        ) : null}
        {item.description ? <p>{item.description}</p> : null}
        {item.text ? <p>{item.text}</p> : null}
        <p className="muted">{note}</p>
        <div className="row">
          {actions.map((action) => (
            <button
              key={action.status}
              type="button"
              className={action.tone}
              onClick={() => onDecide(action.status)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const [events, setEvents] = useState(SEED.events)
  const [partnerships, setPartnerships] = useState(SEED.partnerships)
  const [achievements, setAchievements] = useState(SEED.achievements)
  const [section, setSection] = useState('events')
  const [open, setOpen] = useState(null)

  const queues = {
    events: pendingOf(events),
    partnerships: pendingOf(partnerships),
    achievements: pendingOf(achievements),
  }
  const counts = {
    events: queues.events.length,
    partnerships: queues.partnerships.length,
    achievements: queues.achievements.length,
  }
  const visible = queues[section]

  useEffect(() => {
    if (!open) return undefined
    function onKey(event) {
      if (event.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function onSection(id) {
    setSection(id)
    setOpen(null)
  }

  function onDecide(status) {
    if (!open) return
    const mark = (list) => list.map((item) => (item.id === open.id ? { ...item, status } : item))
    if (open.kind === 'events') setEvents(mark)
    else if (open.kind === 'partnerships') setPartnerships(mark)
    else setAchievements(mark)
    setOpen(null)
  }

  return (
    <>
      <ModeratorBar section={section} onSection={onSection} counts={counts} />
      <main>
        <div className="container">
          <p className="muted">Демо: admin@demo.by</p>
          {visible.length === 0 ? <p className="muted">Нет заявок</p> : (
            <div className="mod-grid">
              {visible.map((item) => (
                <QueueCard
                  key={item.id}
                  item={item}
                  kind={section}
                  onOpen={() => setOpen({ ...item, kind: section })}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      {open ? (
        <Detail
          item={open}
          kind={open.kind}
          onClose={() => setOpen(null)}
          onDecide={onDecide}
        />
      ) : null}
    </>
  )
}
