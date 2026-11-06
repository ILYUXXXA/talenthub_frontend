import { useState } from 'react'
import {
  listEvents,
  listPartnerships,
  listAchievementsQueue,
  moderateEvent,
  moderatePartnership,
  moderateAchievement,
} from '../data/store.js'

const SEED = {
  events: [
    {
      id: 'fb-event-1',
      title: 'Республиканская олимпиада по математике',
      category: 'olympiad',
      organizer: 'Лицей БГУ',
      date: '12 марта 2026',
      city: 'Минск',
      status: 'pending',
    },
    {
      id: 'fb-event-2',
      title: 'Проектная смена «Своими руками»',
      category: 'project',
      organizer: 'Гимназия №1 Минск',
      date: '22 июня 2026',
      city: 'Минск',
      status: 'pending',
    },
    {
      id: 'fb-event-3',
      title: 'Олимпиада по информатике',
      category: 'olympiad',
      organizer: 'СШ №4 Гродно',
      date: '4 апреля 2026',
      city: 'Гродно',
      status: 'published',
    },
    {
      id: 'fb-event-4',
      title: 'Мастерская робототехники',
      category: 'project',
      organizer: 'Гимназия №2 Брест',
      date: '18 апреля 2026',
      city: 'Брест',
      status: 'rejected',
    },
  ],
  partnerships: [
    {
      id: 'fb-partner-1',
      from: 'EPAM Systems',
      to: 'Лицей БГУ',
      title: 'Мастер-класс по разработке',
      status: 'pending',
    },
    {
      id: 'fb-partner-2',
      from: 'Парк высоких технологий',
      to: 'Гимназия №1 Минск',
      title: 'Экскурсия для проектных групп',
      status: 'incoming',
    },
  ],
  achievements: [
    {
      id: 'fb-ach-1',
      title: 'Диплом III степени, городская олимпиада по информатике',
      student: 'Алина Коваль',
      school: 'Лицей БГУ',
      status: 'pending',
    },
    {
      id: 'fb-ach-2',
      title: 'Призёр проектной смены',
      student: 'Илья Савич',
      school: 'Лицей БГУ',
      status: 'confirmed',
    },
  ],
}

function labelOf(value) {
  if (value == null || value === '') return ''
  if (typeof value === 'object') {
    return String(value.name || value.title || value.label || value.school || '')
  }
  return String(value)
}

function categoryLabel(category) {
  if (category === 'project' || category === 'Проектная деятельность') return 'Проектная деятельность'
  return 'Олимпиада'
}

function cloneSeed() {
  return {
    mode: 'fallback',
    events: SEED.events.map((item) => ({ ...item })),
    partnerships: SEED.partnerships.map((item) => ({ ...item })),
    achievements: SEED.achievements.map((item) => ({ ...item })),
  }
}

function readStore() {
  try {
    const events = listEvents()
    const partnerships = listPartnerships()
    const achievements = listAchievementsQueue()
    return {
      mode: 'store',
      events: Array.isArray(events) ? events : [],
      partnerships: Array.isArray(partnerships) ? partnerships : [],
      achievements: Array.isArray(achievements) ? achievements : [],
    }
  } catch {
    return cloneSeed()
  }
}

function pendingOf(list) {
  return (list || []).filter((item) => item && item.status === 'pending')
}

function decidedCount(list) {
  return (list || []).filter((item) => item && item.status && item.status !== 'pending').length
}

function withStatus(data, bucket, id, status) {
  const next = {
    mode: 'fallback',
    events: data.events,
    partnerships: data.partnerships,
    achievements: data.achievements,
  }
  next[bucket] = (data[bucket] || []).map((item) => (
    String(item.id) === String(id) ? { ...item, status } : item
  ))
  return next
}

function eventOrganizer(event) {
  return labelOf(event.organizer || event.organizerName || event.school || event.schoolName || '')
}

function eventDate(event) {
  return labelOf(event.date || event.startsAt || event.startDate || '')
}

function eventCity(event) {
  return labelOf(event.city || event.cityName || '')
}

function party(item, key) {
  if (item[key]) return labelOf(item[key])
  return labelOf(item[`${key}Name`] || item[`${key}School`] || '')
}

function achievementTitle(item) {
  return labelOf(item.title || item.name || item.achievement || 'Достижение')
}

function achievementWho(item) {
  const person = labelOf(item.student || item.studentName || item.pupil || item.owner || '')
  const school = labelOf(item.school || item.schoolName || '')
  return [person, school].filter(Boolean).join(' · ')
}

export default function Admin() {
  const [version, setVersion] = useState(0)
  const [fallbackState, setFallbackState] = useState(null)
  const snapshot = fallbackState || readStore()
  void version

  const pendingEvents = pendingOf(snapshot.events)
  const pendingPartnerships = pendingOf(snapshot.partnerships)
  const pendingAchievements = pendingOf(snapshot.achievements)

  function onModerate(bucket, id, status) {
    if (id == null) return
    if (snapshot.mode === 'fallback') {
      setFallbackState(withStatus(fallbackState || snapshot, bucket, id, status))
      return
    }
    try {
      if (bucket === 'events') moderateEvent(id, status)
      else if (bucket === 'partnerships') moderatePartnership(id, status)
      else moderateAchievement(id, status)
      setVersion((value) => value + 1)
    } catch {
      setFallbackState(withStatus(snapshot, bucket, id, status))
    }
  }

  return (
    <main>
      <div className="container">
        <div className="stack">
          <div>
            <h1>Модерация</h1>
            <p className="muted">Отдельная роль администратора. Демо: admin@demo.by</p>
          </div>

          <section className="card stack">
            <h2 className="card-title">Мероприятия</h2>
            <p className="muted">Уже решено: {decidedCount(snapshot.events)}</p>
            {pendingEvents.length === 0 ? <p className="muted">Нет заявок</p> : pendingEvents.map((event) => (
              <article className="card stack" key={event.id}>
                <div className="row">
                  <h3 className="card-title">{labelOf(event.title)}</h3>
                  <span className="badge badge-pending">На проверке</span>
                </div>
                <p>{categoryLabel(event.category)}</p>
                <p className="muted">{[eventOrganizer(event), eventDate(event), eventCity(event)].filter(Boolean).join(' · ')}</p>
                <div className="row">
                  <button
                    type="button"
                    className="btn btn-primary btn-small"
                    onClick={() => onModerate('events', event.id, 'published')}
                  >
                    Опубликовать
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => onModerate('events', event.id, 'rejected')}
                  >
                    Отклонить
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="card stack">
            <h2 className="card-title">Запросы на партнёрство</h2>
            <p className="muted">Уже решено: {decidedCount(snapshot.partnerships)}</p>
            {pendingPartnerships.length === 0 ? <p className="muted">Нет заявок</p> : pendingPartnerships.map((item) => (
              <article className="card stack" key={item.id}>
                <div className="row">
                  <h3 className="card-title">{labelOf(item.title || item.name || 'Запрос на партнёрство')}</h3>
                  <span className="badge badge-pending">На проверке</span>
                </div>
                <p className="muted">{party(item, 'from')} → {party(item, 'to')}</p>
                <div className="row">
                  <button
                    type="button"
                    className="btn btn-primary btn-small"
                    onClick={() => onModerate('partnerships', item.id, 'incoming')}
                  >
                    Допустить
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => onModerate('partnerships', item.id, 'rejected')}
                  >
                    Отклонить
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="card stack">
            <h2 className="card-title">Прочее: достижения на проверке</h2>
            <p className="muted">Уже решено: {decidedCount(snapshot.achievements)}</p>
            {pendingAchievements.length === 0 ? <p className="muted">Нет заявок</p> : pendingAchievements.map((item) => (
              <article className="card stack" key={item.id}>
                <div className="row">
                  <h3 className="card-title">{achievementTitle(item)}</h3>
                  <span className="badge badge-pending">На проверке</span>
                </div>
                {achievementWho(item) ? <p className="muted">{achievementWho(item)}</p> : null}
                <div className="row">
                  <button
                    type="button"
                    className="btn btn-primary btn-small"
                    onClick={() => onModerate('achievements', item.id, 'confirmed')}
                  >
                    Подтвердить
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => onModerate('achievements', item.id, 'rejected')}
                  >
                    Отклонить
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}
