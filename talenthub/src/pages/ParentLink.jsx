import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { linkChild } from '../data/store.js'

function values(items) {
  return (items || []).map((item) => typeof item === 'string' ? item : item?.title || item?.name || '').filter(Boolean)
}

export default function ParentLink() {
  const [tab, setTab] = useState('overview')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [child, setChild] = useState(null)
  const [notice, setNotice] = useState('')

  const registrations = useMemo(() => values(child?.signedUp), [child])
  const attended = useMemo(() => values(child?.attended), [child])
  const achievements = useMemo(() => values(child?.achievements), [child])

  function onSubmit(event) {
    event.preventDefault()
    setNotice('')
    try {
      const result = linkChild({ firstName: firstName.trim(), lastName: lastName.trim(), birthDate })
      if (!result?.ok || !result.child) {
        setChild(null)
        setNotice('Не удалось найти ученика. Проверьте данные и попробуйте ещё раз.')
        return
      }
      setChild(result.child)
      setNotice('Профиль ребёнка успешно привязан.')
      setTab('overview')
    } catch {
      setNotice('Не удалось выполнить привязку. Повторите попытку позже.')
    }
  }

  function clearChild() {
    setChild(null)
    setFirstName('')
    setLastName('')
    setBirthDate('')
    setNotice('')
    setTab('connect')
  }

  const fullName = child ? [child.firstName, child.lastName].filter(Boolean).join(' ') || child.name : ''

  return (
    <main className="org-page parent-page">
      <div className="container org-container">
        <section className="org-hero parent-hero">
          <div>
            <span className="org-eyebrow">ЛИЧНОЕ ПРОСТРАНСТВО СЕМЬИ</span>
            <h1>Кабинет родителя</h1>
            <p>Следите за образовательным маршрутом ребёнка, его мероприятиями, результатами и новыми возможностями.</p>
            <div className="row org-hero-meta">
              <span>Успехи и активность</span><span>·</span><span>Единый профиль семьи</span>
            </div>
          </div>
          <div className="org-hero-mark"><span>✦</span><small>TalentHub<br/>Family</small></div>
        </section>

        <nav className="org-tabs" aria-label="Разделы кабинета родителя">
          {[['overview', 'Обзор'], ['connect', child ? 'Другой ребёнок' : 'Привязать ребёнка']].map(([id, label]) => (
            <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => { setTab(id); setNotice('') }}>{label}</button>
          ))}
        </nav>

        {notice ? <div className="notice org-notice" role="status">{notice}</div> : null}

        {tab === 'overview' ? (
          <>
            {child ? (
              <>
                <section className="org-metrics">
                  <article className="card org-metric"><strong>{registrations.length}</strong><span>Заявки</span><small>Мероприятия в планах</small></article>
                  <article className="card org-metric"><strong>{attended.length}</strong><span>Посещения</span><small>Участие в событиях</small></article>
                  <article className="card org-metric"><strong>{achievements.length}</strong><span>Достижения</span><small>Результаты ребёнка</small></article>
                </section>
                <section className="card org-panel parent-child-card">
                  <div className="org-section-head">
                    <div><span className="org-eyebrow">ПРОФИЛЬ УЧЕНИКА</span><h2>{fullName}</h2></div>
                    <span className="badge badge-ok">Профиль привязан</span>
                  </div>
                  <div className="parent-facts">
                    <div><small>Учебное заведение</small><strong>{child.school || '—'}</strong></div>
                    <div><small>Класс</small><strong>{child.grade || '—'}</strong></div>
                    <div><small>Город</small><strong>{child.city || '—'}</strong></div>
                    <div><small>Интересы</small><strong>{values(child.interests).join(', ') || 'Пока не указаны'}</strong></div>
                  </div>
                </section>
                <div className="org-dashboard-grid">
                  <section className="card org-panel">
                    <span className="org-eyebrow">ОБРАЗОВАТЕЛЬНЫЙ ПЛАН</span><h2>Предстоящие мероприятия</h2>
                    {registrations.length ? <ul className="parent-list">{registrations.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted">Заявок пока нет. Можно посмотреть доступные мероприятия.</p>}
                    <Link className="btn btn-primary btn-small" to="/events">Открыть каталог →</Link>
                  </section>
                  <section className="card org-panel">
                    <span className="org-eyebrow">ПУТЬ РАЗВИТИЯ</span><h2>Посещения и достижения</h2>
                    {attended.length || achievements.length ? <ul className="parent-list">{[...attended, ...achievements].map((item, index) => <li key={item + index}>{item}</li>)}</ul> : <p className="muted">Подтверждённых результатов пока нет. Они появятся здесь после участия.</p>}
                    <Link className="btn btn-ghost btn-small" to="/events">Найти новые возможности →</Link>
                  </section>
                </div>
                <div className="org-form-footer"><span className="muted">Данные профиля доступны после подтверждённой привязки.</span><button type="button" className="btn btn-ghost" onClick={clearChild}>Отвязать / сменить ребёнка</button></div>
              </>
            ) : (
              <section className="org-empty parent-empty">
                <div className="org-prestige-mark">✦</div>
                <h2>Добавьте профиль ребёнка</h2>
                <p>Привяжите ученика, чтобы видеть его образовательную активность, заявки и достижения в одном месте.</p>
                <button className="btn btn-primary" type="button" onClick={() => setTab('connect')}>Привязать ребёнка →</button>
              </section>
            )}
          </>
        ) : (
          <section className="card org-panel org-form-panel">
            <div className="org-section-head"><div><span className="org-eyebrow">СВЯЗЬ С ПРОФИЛЕМ УЧЕНИКА</span><h2>Данные ребёнка</h2></div></div>
            <p className="muted">Укажите данные точно так, как они записаны в профиле ученика.</p>
            <form className="parent-link-form" onSubmit={onSubmit}>
              <label className="field"><span>Имя</span><input value={firstName} autoComplete="given-name" required onChange={(event) => setFirstName(event.target.value)} placeholder="Имя ребёнка" /></label>
              <label className="field"><span>Фамилия</span><input value={lastName} autoComplete="family-name" required onChange={(event) => setLastName(event.target.value)} placeholder="Фамилия ребёнка" /></label>
              <label className="field"><span>Дата рождения</span><input type="date" value={birthDate} required onChange={(event) => setBirthDate(event.target.value)} /></label>
              <div className="row"><button className="btn btn-primary" type="submit">Найти и привязать профиль</button><button className="btn btn-ghost" type="button" onClick={() => { setFirstName(''); setLastName(''); setBirthDate(''); setNotice('') }}>Очистить</button></div>
            </form>
          </section>
        )}
      </div>
    </main>
  )
}
