import { useEffect, useState } from 'react'
import OrganizationShell from '../components/OrganizationShell.jsx'
import { api } from '../api/client.js'

const EMPTY = { organization: null, counters: {} }

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('ru-RU')
}

export default function OrganizationCabinet({ kind = 'school' }) {
  const isSchool = kind === 'school'
  const [tab, setTab] = useState('overview')
  const [dashboard, setDashboard] = useState(EMPTY)
  const [students, setStudents] = useState([])
  const [events, setEvents] = useState([])
  const [partnerships, setPartnerships] = useState([])
  const [marketplace, setMarketplace] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [participants, setParticipants] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('project')
  const [projectKind, setProjectKind] = useState('')
  const [interest, setInterest] = useState('Информатика')
  const [gradeMin, setGradeMin] = useState('9')
  const [gradeMax, setGradeMax] = useState('11')
  const [date, setDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [city, setCity] = useState('')
  const [venue, setVenue] = useState('')
  const [format, setFormat] = useState('offline')
  const [capacity, setCapacity] = useState('30')
  const [partnerId, setPartnerId] = useState('')
  const [partnerTitle, setPartnerTitle] = useState('')
  const [partnerDescription, setPartnerDescription] = useState('')
  const [visibility, setVisibility] = useState('direct')

  async function refresh() {
    const [dash, orgStudents, orgEvents, mine, market, orgs] = await Promise.all([
      api.organizationDashboard(),
      api.organizationStudents(),
      api.organizationEvents(),
      api.partnerships('mine'),
      api.partnerships('marketplace'),
      api.organizations(isSchool ? 'company' : 'school'),
    ])
    setDashboard(dash)
    setStudents(orgStudents)
    setEvents(orgEvents)
    setPartnerships(mine)
    setMarketplace(market)
    setOrganizations(orgs)
    if (!city && dash.organization?.city) setCity(dash.organization.city)
    if (!partnerId && orgs.length) setPartnerId(orgs[0].id)
    setError('')
  }

  useEffect(() => {
    refresh().catch((cause) => setError(cause.message || 'Не удалось загрузить кабинет организации.'))
      .finally(() => setLoading(false))
  }, [])

  async function handlePublish(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await api.createEvent({
        title: title.trim(),
        description: description.trim(),
        kind: category,
        project_kind: category === 'project' ? (projectKind.trim() || null) : null,
        interests: [interest],
        grade_min: Number(gradeMin),
        grade_max: Number(gradeMax),
        event_date: date,
        registration_deadline: deadline,
        city: city.trim(),
        venue: venue.trim() || city.trim(),
        format,
        terms: 'Регистрация через платформу TalentHub.',
        capacity: Number(capacity),
      })
      setNotice('Мероприятие отправлено на модерацию.')
      setTitle('')
      setDescription('')
      await refresh()
      setTab('events')
    } catch (cause) {
      setError(cause.message || 'Не удалось создать мероприятие.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePartner(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await api.createPartnership({
        visibility,
        target_org_id: visibility === 'direct' ? partnerId : null,
        title: partnerTitle.trim(),
        description: partnerDescription.trim(),
      })
      setNotice('Запрос на сотрудничество отправлен на модерацию.')
      setPartnerTitle('')
      setPartnerDescription('')
      await refresh()
      setTab('partners')
    } catch (cause) {
      setError(cause.message || 'Не удалось отправить запрос.')
    } finally {
      setSaving(false)
    }
  }

  async function respond(id, decision) {
    try {
      await api.decidePartnership(id, decision)
      setNotice(decision === 'accepted' ? 'Партнёрский запрос принят.' : 'Партнёрский запрос отклонён.')
      await refresh()
    } catch (cause) {
      setError(cause.message || 'Не удалось сохранить ответ.')
    }
  }

  async function respondToMarket(id) {
    try {
      await api.respondPartnership(id)
      setNotice('Отклик отправлен. Он появится в карточке запроса.')
      await refresh()
    } catch (cause) {
      setError(cause.message || 'Не удалось отправить отклик.')
    }
  }

  async function loadParticipants(eventId) {
    setSelectedEvent(eventId)
    try {
      setParticipants(await api.eventParticipants(eventId))
    } catch (cause) {
      setError(cause.message || 'Не удалось загрузить участников.')
    }
  }

  const organization = dashboard.organization
  const counters = dashboard.counters || {}
  const filteredStudents = students.filter((item) => `${item.first_name} ${item.last_name} ${item.grade || ''} ${(item.interests || []).join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  const tabs = [['overview', 'Обзор', 'overview'], ...(isSchool ? [['students', 'Ученики', 'students']] : []), ['events', 'Мероприятия', 'events'], ['partners', 'Сотрудничество', 'partners'], ['market', isSchool ? 'Предложения компаний' : 'Запросы школ', 'market'], ['create', 'Создать мероприятие', 'create']]

  return (
    <OrganizationShell tabs={tabs} activeTab={tab} onTabChange={(next) => { setTab(next); setNotice(''); setError('') }}>
      <main className="org-page"><div className="container org-container">
        <section className="org-page-heading">
          <h1>{isSchool ? 'Кабинет учреждения образования' : 'Кабинет компании'}</h1>
          <p>{organization?.name || 'Организация'}{organization?.city ? ` · ${organization.city}` : ''}</p>
        </section>
        {loading ? <p className="muted">Загружаем данные из TalentHub API…</p> : null}
        {error ? <p className="notice">{error}</p> : null}
        {notice ? <p className="notice">{notice}</p> : null}

        {tab === 'overview' ? (
          <>
            <section className="org-metrics">
              {Object.entries(counters).map(([key, value]) => <article className="card org-metric" key={key}><strong>{value}</strong><span>{({ students: 'Ученики', events: 'Мероприятия', initiatives: 'Инициативы', published: 'Опубликовано', pending_moderation: 'На модерации', incoming_requests: 'Входящие запросы', total_requests: 'Всего запросов', agreed_initiatives: 'Согласовано', registrations: 'Заявки' })[key] || key}</span></article>)}
            </section>
            <section className="card org-panel"><h2>Профиль организации</h2><p>{organization?.description || 'Описание организации пока не заполнено.'}</p><p className="muted">{(organization?.directions || []).join(' · ')}</p></section>
          </>
        ) : null}

        {tab === 'students' ? (
          <section className="card org-panel">
            <h2>Ученики организации</h2>
            <label className="field"><span>Поиск</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Имя, класс или интерес" /></label>
            <div className="org-list">{filteredStudents.map((student) => <article className="org-partner-card" key={student.id}><h3>{student.first_name} {student.last_name}</h3><p className="muted">{student.grade ? `${student.grade} класс` : 'Класс не указан'}</p><p>{(student.interests || []).join(' · ') || 'Интересы не указаны'}</p><p className="muted">Заявки: {student.application_count} · Посещения: {student.attendance_count} · Достижения: {student.achievement_count}</p></article>)}{filteredStudents.length === 0 ? <p className="muted">Нет учеников по этому запросу.</p> : null}</div>
          </section>
        ) : null}

        {tab === 'events' ? (
          <section className="card org-panel">
            <h2>Мероприятия организации</h2>
            <div className="org-list">{events.map((item) => <article className="org-partner-card" key={item.id}><div className="row spread"><h3>{item.title}</h3><span className="badge badge-muted">{item.status}</span></div><p className="muted">{formatDate(item.date)} · {item.city} · {item.format}</p><p>{item.description}</p><p className="muted">Заявок: {item.registration_count ?? 0} · Свободных мест: {item.places_remaining ?? '—'}</p><button type="button" className="btn btn-ghost btn-small" onClick={() => loadParticipants(item.id)}>Посмотреть участников</button></article>)}{events.length === 0 ? <p className="muted">Организация пока не создала мероприятий.</p> : null}</div>
            {selectedEvent ? <div className="card"><h3>Участники</h3>{participants.length ? <ul className="stack">{participants.map((person) => <li key={person.id}>{person.first_name} {person.last_name} · {person.grade || '—'} класс · {person.status}</li>)}</ul> : <p className="muted">Заявок на мероприятие пока нет.</p>}</div> : null}
          </section>
        ) : null}

        {tab === 'partners' ? (
          <section className="card org-panel"><h2>Запросы и партнёрства</h2><div className="org-list">{partnerships.map((item) => <article className="org-partner-card" key={item.id}><div className="row spread"><h3>{item.title}</h3><span className="badge badge-muted">{item.moderation_status}{item.direct_decision ? ` · ${item.direct_decision}` : ''}</span></div><p className="muted">{item.sender?.name} → {item.target?.name || 'Открытый запрос'}</p><p>{item.description}</p>{item.target?.id === organization?.id && !item.direct_decision && item.moderation_status === 'approved' ? <div className="row"><button className="btn btn-primary btn-small" onClick={() => respond(item.id, 'accepted')}>Принять</button><button className="btn btn-ghost btn-small" onClick={() => respond(item.id, 'declined')}>Отклонить</button></div> : null}</article>)}{partnerships.length === 0 ? <p className="muted">Пока нет запросов на сотрудничество.</p> : null}</div>
            <form className="stack" onSubmit={handlePartner}><h3>Создать запрос</h3><label className="field"><span>Видимость</span><select value={visibility} onChange={(event) => setVisibility(event.target.value)}><option value="direct">Конкретной организации</option><option value="all_schools">Открытый запрос для школ</option></select></label>{visibility === 'direct' ? <label className="field"><span>Организация-партнёр</span><select value={partnerId} onChange={(event) => setPartnerId(event.target.value)}>{organizations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label> : null}<label className="field"><span>Тема</span><input value={partnerTitle} required onChange={(event) => setPartnerTitle(event.target.value)} /></label><label className="field"><span>Описание</span><textarea rows={4} value={partnerDescription} required onChange={(event) => setPartnerDescription(event.target.value)} /></label><button className="btn btn-primary" disabled={saving || (visibility === 'direct' && !partnerId)}>{saving ? 'Отправка…' : 'Отправить запрос'}</button></form>
          </section>
        ) : null}

        {tab === 'market' ? (
          <section className="card org-panel"><h2>{isSchool ? 'Открытые предложения компаний' : 'Открытые запросы школ'}</h2><div className="org-list">{marketplace.map((item) => <article className="org-partner-card" key={item.id}><h3>{item.title}</h3><p className="muted">{item.sender?.name || 'Организация'}</p><p>{item.description}</p><button className="btn btn-primary btn-small" onClick={() => respondToMarket(item.id)}>Откликнуться</button></article>)}{marketplace.length === 0 ? <p className="muted">Открытых запросов пока нет.</p> : null}</div></section>
        ) : null}

        {tab === 'create' ? (
          <section className="card org-panel org-form-panel"><h2>Создать мероприятие</h2><p className="muted">После отправки мероприятие поступит на модерацию.</p><form className="stack" onSubmit={handlePublish}>
            <label className="field"><span>Название</span><input value={title} required maxLength={250} onChange={(event) => setTitle(event.target.value)} /></label>
            <label className="field"><span>Описание</span><textarea rows={5} value={description} required onChange={(event) => setDescription(event.target.value)} /></label>
            <div className="grid-2">
              <label className="field"><span>Тип</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="olympiad">Олимпиада</option><option value="project">Проектная деятельность</option></select></label>
              {category === 'project' ? <label className="field"><span>Тип проекта</span><input value={projectKind} onChange={(event) => setProjectKind(event.target.value)} /></label> : null}
              <label className="field"><span>Направление</span><input value={interest} required onChange={(event) => setInterest(event.target.value)} /></label>
              <label className="field"><span>Город</span><input value={city} required onChange={(event) => setCity(event.target.value)} /></label>
              <label className="field"><span>Место проведения</span><input value={venue} onChange={(event) => setVenue(event.target.value)} /></label>
              <label className="field"><span>Формат</span><select value={format} onChange={(event) => setFormat(event.target.value)}><option value="offline">Очно</option><option value="online">Онлайн</option><option value="hybrid">Гибридный</option></select></label>
              <label className="field"><span>Класс от</span><select value={gradeMin} onChange={(event) => setGradeMin(event.target.value)}>{[7,8,9,10,11].map((n) => <option key={n}>{n}</option>)}</select></label>
              <label className="field"><span>Класс до</span><select value={gradeMax} onChange={(event) => setGradeMax(event.target.value)}>{[7,8,9,10,11].filter((n) => n >= Number(gradeMin)).map((n) => <option key={n}>{n}</option>)}</select></label>
              <label className="field"><span>Дата проведения</span><input type="date" value={date} required onChange={(event) => setDate(event.target.value)} /></label>
              <label className="field"><span>Дедлайн регистрации</span><input type="date" value={deadline} required onChange={(event) => setDeadline(event.target.value)} /></label>
              <label className="field"><span>Количество мест</span><input type="number" min="1" value={capacity} required onChange={(event) => setCapacity(event.target.value)} /></label>
            </div>
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Отправка…' : 'Отправить на модерацию'}</button>
          </form></section>
        ) : null}
      </div></main>
    </OrganizationShell>
  )
}
