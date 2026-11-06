import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, mapEvent, mapRegistration } from '../api/client.js'

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('ru-RU')
}

export default function ParentLink() {
  const navigate = useNavigate()
  const [child, setChild] = useState(null)
  const [events, setEvents] = useState([])
  const [section, setSection] = useState('progress')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function refresh() {
    const [envelope, catalog] = await Promise.all([api.parentChild(), api.events()])
    setChild(envelope.child || null)
    setEvents(catalog.filter((item) => item.status === 'published'))
  }

  useEffect(() => {
    refresh()
      .catch((cause) => {
        setError(cause.message || 'Не удалось загрузить кабинет родителя.')
        if (cause.status === 401) navigate('/auth')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  async function onLink(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const result = await api.linkParentChild({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date: birthDate,
      })
      setChild(result.child || null)
      setNotice('Профиль ребёнка успешно привязан.')
      setSection('progress')
    } catch (cause) {
      setError(cause.message || 'Не удалось привязать ребёнка. Проверьте введённые данные.')
    } finally {
      setSaving(false)
    }
  }

  const profile = child?.profile
  const applications = (child?.applications || []).map(mapRegistration)
  const attendances = child?.attendances || []
  const achievements = child?.achievements || []

  return (
    <>
      <header className="header student-header">
        <div className="header-inner parent-bar">
          <Link to="/" className="brand-lockup" aria-label="TalentHub — главная"><span className="brand-mark">t.</span><span className="brand-word">Talent<span>Hub</span></span></Link>
          <p className="header-greet">Кабинет родителя</p>
          <nav className="nav student-tabs org-shell-tabs" aria-label="Разделы кабинета">
            {[
              ['progress', 'Прогресс'],
              ['applications', 'Заявки'],
              ['events', 'Мероприятия'],
              ['child', 'Профиль ребёнка'],
            ].map(([id, label]) => <button key={id} type="button" className={section === id ? 'active' : ''} onClick={() => setSection(id)}>{label}</button>)}
          </nav>
        </div>
      </header>
      <main className="student-workspace">
        <div className="container">
          {loading ? <p className="muted">Загружаем данные ребёнка…</p> : null}
          {error ? <p className="notice">{error}</p> : null}
          {notice ? <p className="notice">{notice}</p> : null}
          {!child ? (
            <section className="card narrow">
              <h1>Привязать профиль ребёнка</h1>
              <p className="muted">Для безопасного поиска введите имя, фамилию и дату рождения точно так, как они указаны в профиле школьника.</p>
              <form className="stack" onSubmit={onLink}>
                <label className="field"><span>Имя ребёнка</span><input value={firstName} required onChange={(event) => setFirstName(event.target.value)} /></label>
                <label className="field"><span>Фамилия ребёнка</span><input value={lastName} required onChange={(event) => setLastName(event.target.value)} /></label>
                <label className="field"><span>Дата рождения</span><input type="date" value={birthDate} required onChange={(event) => setBirthDate(event.target.value)} /></label>
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Проверяем…' : 'Найти и привязать'}</button>
              </form>
            </section>
          ) : (
            <>
              <section className="card">
                <span className="org-eyebrow">ПРОФИЛЬ УЧЕНИКА</span>
                <h1>{[profile?.first_name, profile?.last_name].filter(Boolean).join(' ')}</h1>
                <p className="muted">{profile?.school?.name || 'Учреждение не указано'} · {profile?.grade ? `${profile.grade} класс` : 'Класс не указан'} · {profile?.city || 'Город не указан'}</p>
                <p>{(profile?.interests || []).join(' · ')}</p>
              </section>
              <div className="grid-2">
                {section === 'progress' || section === 'child' ? (
                  <>
                    <section className="card">
                      <h2>Посещения</h2>
                      {attendances.length ? <ul className="stack">{attendances.map((item) => <li key={item.id}>{item.title} <span className="muted">· {formatDate(item.attended_at)}</span></li>)}</ul> : <p className="muted">Подтверждённых посещений пока нет.</p>}
                    </section>
                    <section className="card">
                      <h2>Достижения</h2>
                      {achievements.length ? <ul className="stack">{achievements.map((item) => <li key={item.id}>{item.title}</li>)}</ul> : <p className="muted">Подтверждённых достижений пока нет.</p>}
                    </section>
                  </>
                ) : null}
                {section === 'applications' ? (
                  <section className="card">
                    <h2>Заявки на мероприятия</h2>
                    {applications.length ? <ul className="stack">{applications.map((item) => <li key={item.id}><strong>{item.title}</strong><p className="muted">{item.status} · {formatDate(item.date)}</p></li>)}</ul> : <p className="muted">Заявок пока нет.</p>}
                  </section>
                ) : null}
                {section === 'events' ? (
                  <section className="card">
                    <h2>Опубликованные мероприятия</h2>
                    {events.length ? <ul className="stack">{events.map((item) => <li key={item.id}><strong>{item.title}</strong><p className="muted">{formatDate(item.date)} · {item.city} · {item.organizer}</p></li>)}</ul> : <p className="muted">Сейчас нет опубликованных мероприятий.</p>}
                  </section>
                ) : null}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
