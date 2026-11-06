import { useMemo, useState } from 'react'
import { currentUser, listEvents, listPartnerships, listSchools, publishEvent, sendPartnership, respondPartnership, updateEvent, eventRegistrations, updateEventRegistration } from '../data/store.js'

const DEFAULT_ORG = 'КодМастер'
const SCHOOL_LIST = ['Лицей БГУ', 'Гимназия №1 Минск', 'СШ №4 Гродно', 'Гимназия №2 Брест']
const statusText = { incoming: 'Входящий запрос', pending: 'Ожидает ответа', accepted: 'Согласовано', declined: 'Отклонено' }
const statusClass = { incoming: 'badge-muted', pending: 'badge-pending', accepted: 'badge-ok', declined: 'badge-no' }
const safeRead = (fn, fallback) => { try { const value = fn(); return Array.isArray(value) ? value : fallback } catch { return fallback } }
const dateText = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Дата не указана'

function Metric({ value, label, note }) { return <article className="card org-metric"><strong>{value}</strong><span>{label}</span>{note ? <small>{note}</small> : null}</article> }
function SectionTitle({ eyebrow, title, children }) { return <div className="org-section-head"><div><span className="org-eyebrow">{eyebrow}</span><h2>{title}</h2></div>{children}</div> }

export default function Company() {
  const [version, setVersion] = useState(0)
  const [tab, setTab] = useState('overview')
  const [expandedEvent, setExpandedEvent] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [eventTitle, setEventTitle] = useState('Практикум по алгоритмам и программированию')
  const [category, setCategory] = useState('project')
  const [interest, setInterest] = useState('Информатика')
  const [grade, setGrade] = useState('9–11')
  const [date, setDate] = useState('2026-12-19')
  const [deadline, setDeadline] = useState('2026-12-10')
  const [format, setFormat] = useState('смешанный')
  const [city, setCity] = useState('Минск')
  const [seats, setSeats] = useState('30')
  const [description, setDescription] = useState('Практическая программа для школьников: участники разберут алгоритмические задачи, поработают в командах и представят итоговый проект.')
  const [school, setSchool] = useState('Лицей БГУ')
  const [requestAudience, setRequestAudience] = useState('school')
  const [requestTitle, setRequestTitle] = useState('Практический IT-интенсив для школьников')
  const [requestText, setRequestText] = useState('Предлагаем провести в вашем учреждении бесплатный практический интенсив по программированию для учащихся 9–11 классов. Предоставим наставников и учебные материалы.')

  let user = null
  try { user = currentUser() } catch { user = null }
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Павел Мороз'
  const org = user?.orgName || DEFAULT_ORG
  const events = useMemo(() => safeRead(listEvents, []).filter((item) => item.organizer === org), [version, org])
  const partnerships = useMemo(() => safeRead(listPartnerships, []).filter((item) => item.from === org || item.to === org), [version, org])
  const schools = useMemo(() => safeRead(listSchools, SCHOOL_LIST), [])
  const incoming = partnerships.filter((item) => item.to === org && item.status === 'incoming')
  const accepted = partnerships.filter((item) => item.status === 'accepted')
  const published = events.filter((item) => ['published', 'registration_closed', 'completed'].includes(item.status)).length
  const registrationsCount = events.reduce((sum, item) => sum + eventRegistrations(item.id).length, 0)
  const filteredSchools = schools.filter((item) => item.toLowerCase().includes(query.toLowerCase()))

  function handlePublish(event) {
    event.preventDefault()
    if (!eventTitle.trim() || !description.trim() || !date || !deadline || Number(seats) < 1) return
    try {
      publishEvent({ title: eventTitle.trim(), category, interests: [interest], grade, date, deadline, format, city, place: city, seats: Number(seats), description: description.trim(), organizer: org, terms: 'Регистрация через TalentHub.' })
      setVersion((value) => value + 1)
      setNotice('Инициатива отправлена на модерацию и появится в каталоге после проверки.')
      setTab('events')
    } catch { setNotice('Не удалось сохранить инициативу. Попробуйте ещё раз.') }
  }
  function handleRequest(event) {
    event.preventDefault()
    if (!requestTitle.trim() || !requestText.trim()) return
    try {
      const isPublic = requestAudience === 'marketplace'
      sendPartnership({
        from: org,
        to: isPublic ? '' : school,
        title: requestTitle.trim(),
        text: requestText.trim(),
        description: requestText.trim(),
        visibility: isPublic ? 'public' : 'direct',
        audience: isPublic ? 'all_schools' : 'selected_school',
      })
      setVersion((value) => value + 1)
      setNotice(isPublic ? 'Запрос опубликован на общем рынке и доступен всем школам.' : `Предложение отправлено: ${school}.`)
      setTab('partners')
    } catch { setNotice('Не удалось отправить предложение. Попробуйте ещё раз.') }
  }
  function handleRespond(id, decision) {
    try { respondPartnership(id, decision) } catch { /* обновление интерфейса остаётся доступным в демо */ }
    setVersion((value) => value + 1)
    setNotice(decision === 'accepted' ? 'Запрос принят. Можно согласовать детали инициативы.' : 'Запрос отклонён.')
  }

  return <main className="org-page"><div className="container org-container">
    <section className="org-hero"><div><span className="org-eyebrow">КАБИНЕТ КОМПАНИИ / АКАДЕМИИ</span><h1>{org}</h1><p>Развивайте образовательные инициативы, находите учреждения-партнёры и показывайте реальный вклад вашей организации в развитие учащихся.</p><div className="row org-hero-meta"><span>IT и технологии</span><span>·</span><span>Представитель: {name}</span><span className="badge badge-ok">Профиль организации</span></div></div><div className="org-hero-mark"><span>{org.slice(0,2).toUpperCase()}</span><small>TalentHub<br/>Partner</small></div></section>
    <nav className="org-tabs" aria-label="Разделы кабинета">
      {[['overview','Обзор'],['events','Инициативы'],['partners','Партнёрства'],['schools','Учреждения'],['create','Создать инициативу']].map(([id,label]) => <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => { setTab(id); setNotice('') }}>{label}</button>)}
    </nav>
    {notice ? <div className="notice org-notice" role="status">{notice}</div> : null}

    {tab === 'overview' ? <>
      <div className="org-metrics"><Metric value={events.length} label="Всего инициатив" note={`${published} опубликовано`}/><Metric value={incoming.length} label="Новых предложений" note="Запросы от учреждений"/><Metric value={partnerships.length} label="Партнёрских запросов" note="Входящие и исходящие"/><Metric value={accepted.length} label="Согласованных инициатив" note="История сотрудничества"/><Metric value={registrationsCount} label="Регистраций" note="На ваши мероприятия"/></div>
      <div className="org-dashboard-grid"><section className="card org-panel"><SectionTitle eyebrow="ОБРАЗОВАТЕЛЬНЫЕ ПРОГРАММЫ" title="Ваши инициативы"/><div className="org-list">{events.slice(0,3).map((item) => <article className="org-list-item" key={item.id}><div className="org-list-icon">↗</div><div className="org-list-main"><strong>{item.title}</strong><small>{dateText(item.date)} · {item.city || 'Онлайн'}</small></div><span className={`badge ${item.status === 'published' ? 'badge-ok' : item.status === 'rejected' ? 'badge-no' : 'badge-pending'}`}>{item.status === 'published' ? 'Опубликовано' : item.status === 'registration_closed' ? 'Регистрация закрыта' : item.status === 'completed' ? 'Завершено' : item.status === 'rejected' ? 'Отклонено' : 'На модерации'}</span></article>)}{events.length === 0 ? <p className="muted">Опубликуйте первую инициативу, чтобы привлечь учащихся и учреждения.</p> : null}</div><button className="btn btn-ghost btn-small" onClick={() => setTab('events')}>Все инициативы</button></section>
      <section className="card org-panel"><SectionTitle eyebrow="СОВМЕСТНАЯ РАБОТА" title="Партнёрства"/><div className="org-list">{partnerships.slice(0,3).map((item) => <article className="org-list-item" key={item.id}><div className="org-list-icon">⇄</div><div className="org-list-main"><strong>{item.title}</strong><small>{item.from === org ? `Для: ${item.to}` : `От: ${item.from}`}</small></div><span className={`badge ${statusClass[item.status] || 'badge-muted'}`}>{statusText[item.status] || 'В обработке'}</span></article>)}{partnerships.length === 0 ? <p className="muted">Запросов пока нет.</p> : null}</div><button className="btn btn-ghost btn-small" onClick={() => setTab('partners')}>Открыть партнёрства</button></section></div>
      <section className="org-quick-actions"><div><span className="org-eyebrow">РАСШИРЯЙТЕ СОТРУДНИЧЕСТВО</span><h2>Найдите учреждение для следующей инициативы</h2><p>Выберите школу или лицей, отправьте предложение и отслеживайте его статус в кабинете.</p></div><button className="btn btn-primary" onClick={() => setTab('schools')}>Найти учреждение →</button></section>
      <section className="card org-prestige"><div className="org-prestige-mark">✦</div><div><span className="org-eyebrow">РЕПУТАЦИЯ TALENTHUB</span><h2>Подтверждённый вклад важнее количества публикаций</h2><p>История согласованных и подтверждённых образовательных инициатив помогает партнёрам оценивать опыт организации. Публикация мероприятия или получение заявок сами по себе не повышают престиж.</p><button className="btn btn-ghost btn-small" onClick={() => setTab('partners')}>Посмотреть сотрудничество</button></div></section>
    </> : null}

    {tab === 'events' ? <section className="card org-panel"><SectionTitle eyebrow="УПРАВЛЕНИЕ ИНИЦИАТИВАМИ" title="Публикации организации"><button className="btn btn-primary btn-small" onClick={() => setTab('create')}>＋ Новая инициатива</button></SectionTitle><div className="org-list">{events.map((item) => <article className="org-event-row" key={item.id}><div className="org-event-top"><span className="org-eyebrow">{item.category === 'project' ? 'ПРОЕКТНАЯ ДЕЯТЕЛЬНОСТЬ' : 'ОЛИМПИАДА'}</span><span className={`badge ${item.status === 'published' ? 'badge-ok' : item.status === 'rejected' ? 'badge-no' : 'badge-pending'}`}>{item.status === 'published' ? 'Опубликовано' : item.status === 'registration_closed' ? 'Регистрация закрыта' : item.status === 'completed' ? 'Завершено' : item.status === 'rejected' ? 'Отклонено' : 'На модерации'}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="org-event-meta"><span>◷ {dateText(item.date)}</span><span>⌖ {item.city || '—'}</span><span>Лимит: {item.seats || '—'}</span><span>{item.format || '—'}</span><span>Регистраций: {eventRegistrations(item.id).length}</span></div><div className="row org-event-actions"><button className="btn btn-ghost btn-small" type="button" onClick={() => setExpandedEvent(expandedEvent === item.id ? '' : item.id)}>{expandedEvent === item.id ? 'Скрыть участников' : 'Управлять участниками'}</button>{item.status === 'published' ? <button className="btn btn-ghost btn-small" type="button" onClick={() => { updateEvent(item.id, { status: 'registration_closed' }); setVersion((v) => v + 1); setNotice('Регистрация на мероприятие закрыта.') }}>Закрыть регистрацию</button> : null}{item.status === 'registration_closed' ? <button className="btn btn-ghost btn-small" type="button" onClick={() => { updateEvent(item.id, { status: 'published' }); setVersion((v) => v + 1); setNotice('Регистрация снова открыта.') }}>Открыть регистрацию</button> : null}{['published','registration_closed'].includes(item.status) ? <button className="btn btn-ghost btn-small" type="button" onClick={() => { updateEvent(item.id, { status: 'completed' }); setVersion((v) => v + 1); setNotice('Мероприятие отмечено завершённым.') }}>Завершить</button> : null}</div>{expandedEvent === item.id ? <div className="org-participants"><strong>Заявки участников</strong>{eventRegistrations(item.id).map((person) => <div className="org-participant-row" key={person.studentId}><div><b>{person.name}</b><small>{person.grade ? `${person.grade} класс` : 'Класс не указан'} · {person.status}{person.attended ? ' · Посещение подтверждено' : ''}</small></div><div className="row">{person.status === 'подана' ? <><button className="btn btn-primary btn-small" type="button" onClick={() => { updateEventRegistration(item.id, person.studentId, { status: 'подтверждена' }); setVersion((v) => v + 1) }}>Подтвердить</button><button className="btn btn-ghost btn-small" type="button" onClick={() => { updateEventRegistration(item.id, person.studentId, { status: 'отклонена' }); setVersion((v) => v + 1) }}>Отклонить</button></> : null}{person.status === 'подтверждена' && !person.attended ? <button className="btn btn-ghost btn-small" type="button" onClick={() => { updateEventRegistration(item.id, person.studentId, { attended: true }); setVersion((v) => v + 1); setNotice(`Посещение подтверждено: ${person.name}.`) }}>Отметить посещение</button> : null}</div></div>)}{eventRegistrations(item.id).length === 0 ? <p className="muted">Заявок пока нет. Они появятся после регистрации школьников.</p> : null}</div> : null}</article>)}{events.length === 0 ? <div className="org-empty"><strong>Пока нет опубликованных инициатив</strong><p>Создайте образовательную программу или мероприятие для учащихся.</p><button className="btn btn-primary" onClick={() => setTab('create')}>Создать инициативу</button></div> : null}</div></section> : null}

    {tab === 'partners' ? <div className="org-dashboard-grid org-partner-layout"><section className="card org-panel"><SectionTitle eyebrow="ВХОДЯЩИЕ И ИСХОДЯЩИЕ" title="Запросы на сотрудничество"/><div className="org-list">{partnerships.map((item) => <article className="org-partner-card" key={item.id}><div className="row spread"><span className="org-eyebrow">{item.parentRequestId ? 'ОТКЛИК ШКОЛЫ НА ПУБЛИЧНЫЙ ЗАПРОС' : item.to === org ? 'ВХОДЯЩИЙ ЗАПРОС' : item.visibility === 'public' ? 'ПУБЛИЧНЫЙ ЗАПРОС' : 'ВАШЕ ПРЕДЛОЖЕНИЕ'}</span><span className={`badge ${statusClass[item.status] || 'badge-muted'}`}>{statusText[item.status] || 'В обработке'}</span></div><h3>{item.title}</h3><p className="muted">{item.from || '—'} <span aria-hidden="true">→</span> {item.visibility === 'public' ? 'Общий рынок · все школы' : item.to || '—'}</p><p>{item.description || item.text || 'Описание не добавлено.'}</p>{item.status === 'incoming' && item.to === org ? <div className="row"><button className="btn btn-primary btn-small" onClick={() => handleRespond(item.id, 'accepted')}>Принять</button><button className="btn btn-ghost btn-small" onClick={() => handleRespond(item.id, 'declined')}>Отклонить</button></div> : null}</article>)}{partnerships.length === 0 ? <p className="muted">Пока нет запросов. Найдите учреждение и отправьте предложение.</p> : null}</div></section>
      <section className="card org-panel"><SectionTitle eyebrow="НОВОЕ СОТРУДНИЧЕСТВО" title="Предложить инициативу"/><p className="muted">Отправьте образовательному учреждению предложение с темой, форматом и условиями.</p><form className="stack" onSubmit={handleRequest}><label className="field"><span>Кому отправить запрос</span><select value={requestAudience} onChange={(e) => setRequestAudience(e.target.value)}><option value="school">Конкретному учреждению</option><option value="marketplace">На общий рынок — всем школам</option></select></label>{requestAudience === 'school' ? <label className="field"><span>Образовательное учреждение</span><select value={school} onChange={(e) => setSchool(e.target.value)}>{schools.map((item) => <option key={item}>{item}</option>)}</select></label> : <p className="notice">Публикацию увидят все образовательные учреждения. Школы смогут отправить отклик, а вы — принять или отклонить его.</p>}<label className="field"><span>Тема предложения</span><input value={requestTitle} onChange={(e) => setRequestTitle(e.target.value)} required/></label><label className="field"><span>Формат и условия</span><textarea rows={5} value={requestText} onChange={(e) => setRequestText(e.target.value)} required/></label><button className="btn btn-primary" type="submit">Отправить предложение</button></form></section></div> : null}

    {tab === 'schools' ? <section className="card org-panel"><SectionTitle eyebrow="КАТАЛОГ ОРГАНИЗАЦИЙ" title="Образовательные учреждения"/><p className="muted">Выберите потенциального партнёра для совместной образовательной инициативы.</p><label className="field org-search"><span>Поиск учреждения</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Название или город"/></label><div className="org-school-grid">{filteredSchools.map((item, index) => <article className="org-school-card" key={item}><div className="org-school-avatar">{item.slice(0,1)}</div><div className="org-school-content"><strong>{item}</strong><small>{index === 0 ? 'Минск · Лицей' : item.includes('Гродно') ? 'Гродно · Школа' : item.includes('Брест') ? 'Брест · Гимназия' : 'Минск · Учреждение образования'}</small><p>Потенциальный партнёр для олимпиад, проектных смен и образовательных программ.</p><button className="btn btn-ghost btn-small" onClick={() => { setSchool(item); setTab('partners') }}>Предложить сотрудничество →</button></div></article>)}</div>{filteredSchools.length === 0 ? <p className="muted">Учреждений по вашему запросу не найдено.</p> : null}</section> : null}

    {tab === 'create' ? <section className="card org-panel org-form-panel"><SectionTitle eyebrow="НОВАЯ ОБРАЗОВАТЕЛЬНАЯ ПРОГРАММА" title="Создать инициативу"/><p className="muted">Опишите мероприятие для учащихся. После проверки оно станет доступно в общем каталоге TalentHub.</p><form className="stack" onSubmit={handlePublish}><div className="grid-2"><label className="field"><span>Название инициативы</span><input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required/></label><label className="field"><span>Тип</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="project">Проектная деятельность</option><option value="olympiad">Олимпиада</option></select></label><label className="field"><span>Направление</span><select value={interest} onChange={(e) => setInterest(e.target.value)}>{['Информатика','Математика','Физика','Биология','Химия','Робототехника','Проектная работа'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="field"><span>Целевая аудитория</span><select value={grade} onChange={(e) => setGrade(e.target.value)}>{['7–8','8–9','9–10','9–11','10–11','7–11'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="field"><span>Город / площадка</span><input value={city} onChange={(e) => setCity(e.target.value)} required/></label><label className="field"><span>Формат</span><select value={format} onChange={(e) => setFormat(e.target.value)}><option value="очно">Очно</option><option value="онлайн">Онлайн</option><option value="смешанный">Смешанный</option></select></label><label className="field"><span>Дата проведения</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} min="2026-11-06" required/></label><label className="field"><span>Дедлайн регистрации</span><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required/></label><label className="field"><span>Количество мест</span><input type="number" min="1" max="10000" value={seats} onChange={(e) => setSeats(e.target.value)} required/></label></div><label className="field"><span>Описание инициативы</span><textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required/></label><div className="org-form-footer"><span className="muted">Организатор: {org}</span><button className="btn btn-primary" type="submit">Отправить на модерацию →</button></div></form></section> : null}
  </div></main>
}
