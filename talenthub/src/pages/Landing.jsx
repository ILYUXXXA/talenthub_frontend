import { Link } from 'react-router-dom'
import { listEvents } from '../data/store.js'

const features = [
  { icon: '⌕', title: 'Возможности рядом', text: 'Мероприятия, олимпиады, конкурсы и образовательные программы в одном каталоге.' },
  { icon: '▤', title: 'Личное портфолио', text: 'Собирайте подтверждённые достижения и отслеживайте свой образовательный путь.' },
  { icon: '↔', title: 'Партнёрства', text: 'Находите организации и создавайте совместные образовательные инициативы.' },
]

const roles = [
  { title: 'Учащимся', text: 'Находите интересные события, участвуйте и сохраняйте свои результаты.', link: '/auth', action: 'Открыть платформу' },
  { title: 'Школам и учреждениям', text: 'Публикуйте возможности, работайте с заявками и находите партнёров.', link: '/school', action: 'Подробнее' },
  { title: 'Компаниям и академиям', text: 'Предлагайте инициативы и сотрудничайте с образовательными учреждениями.', link: '/company', action: 'Подробнее' },
  { title: 'Родителям', text: 'Следите за образовательной активностью и успехами ребёнка.', link: '/parent', action: 'Подробнее' },
]

function formatPreviewDate(value) {
  if (!value || !/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return value || ''
  const parts = value.split('-')
  return parts[2] + '.' + parts[1]
}

export default function Landing() {
  const previewEvents = (() => {
    try { return listEvents().filter((event) => !event.status || event.status === 'published').slice(0, 2) }
    catch { return [] }
  })()
  return (
    <main className="th-landing">
      <header className="th-header">
        <div className="th-header-inner">
          <Link to="/" className="th-logo"><span className="th-logo-mark">t.</span><span>Talent<span>Hub</span></span></Link>
          <nav className="th-nav">
            <a href="#platform">О платформе</a>
            <a href="#how">Как это работает</a>
            <a href="#partners">Партнёрства</a>
          </nav>
          <Link to="/auth" className="th-login">Войти <span>→</span></Link>
        </div>
      </header>

      <section className="th-hero">
        <div className="th-hero-copy">
          <div className="th-overline"><span></span> ПЛАТФОРМА ОБРАЗОВАТЕЛЬНЫХ ВОЗМОЖНОСТЕЙ</div>
          <h1>Образование открывает возможности.</h1>
          <p>TalentHub объединяет учащихся, школы, компании и академии — чтобы находить события, развивать таланты и создавать новые образовательные проекты.</p>
          <div className="th-hero-actions">
            <Link to="/auth" className="th-primary">Перейти на платформу <span>→</span></Link>
            <a href="#platform" className="th-secondary">Узнать больше</a>
          </div>
          <div className="th-hero-caption"><span>Для учащихся</span><i></i><span>Для учреждений</span><i></i><span>Для партнёров</span></div>
        </div>

        <div className="th-dashboard-wrap">
          <div className="th-dashboard">
            <div className="th-dash-top"><div className="th-dash-brand"><span className="th-mini-mark">t.</span> TalentHub</div><div className="th-dash-user"><span>Каталог мероприятий</span><b>А</b></div></div>
            <div className="th-preview-nav"><span className="active">Мероприятия</span><span>Мои заявки</span><span>Уведомления</span><span>Достижения</span><span>Профиль</span></div>
            <div className="th-preview-content">
              <div className="th-preview-title"><div><small>КАТАЛОГ</small><h3>Мероприятия</h3><p>Найдите возможность для своего развития</p></div></div>
              <div className="th-preview-search"><span>⌕</span> Название, организатор или город <b>Фильтры</b></div>
              <div className="th-preview-list">
                {previewEvents.map((event) => (
                  <article className="th-preview-event" key={event.id}>
                    <span className="th-preview-event-icon">{event.category === 'project' ? '◇' : '✳'}</span>
                    <div className="th-preview-event-info">
                      <small>{event.category === 'project' ? 'ПРОЕКТНАЯ ДЕЯТЕЛЬНОСТЬ' : 'ОЛИМПИАДА'} · {event.organizer}</small>
                      <b>{event.title}</b>
                      <span>{formatPreviewDate(event.date)} · {event.city} · {event.format}</span>
                      <em>Дедлайн: {formatPreviewDate(event.deadline)}</em>
                    </div>
                    <span className="th-preview-arrow">→</span>
                  </article>
                ))}
                {previewEvents.length === 0 ? <p className="th-preview-empty">Опубликованные мероприятия появятся здесь</p> : null}
              </div>
            </div>
          </div>
          <div className="th-dashboard-note"><span>✓</span><div><b>Реальный каталог TalentHub</b><small>Данные загружаются из приложения</small></div></div>
        </div>
      </section>

      <section className="th-intro" id="platform">
        <div className="th-section-label">TALENTHUB / ПЛАТФОРМА</div>
        <div><h2>Единая среда для развития и сотрудничества</h2><p>Возможности для учащихся и инструменты для организаций собраны на одной платформе. Меньше разрозненной информации — больше полезных связей и реальных результатов.</p></div>
      </section>

      <section className="th-features" id="how">
        <div className="th-section-heading"><div><div className="th-section-label">ВОЗМОЖНОСТИ</div><h2>Всё необходимое<br/>для следующего шага</h2></div><p>От первого интереса до участия и подтверждённого результата.</p></div>
        <div className="th-feature-grid">{features.map((item, i) => <article className="th-feature" key={item.title}><span className="th-feature-icon">{item.icon}</span><small>0{i + 1}</small><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>

      <section className="th-partners" id="partners">
        <div className="th-partners-copy"><div className="th-section-label">СОТРУДНИЧЕСТВО</div><h2>Создавайте возможности вместе</h2><p>Учреждения могут находить компании и академии для совместных проектов. Партнёры, в свою очередь, могут предлагать образовательные инициативы и находить заинтересованные учреждения.</p><Link to="/auth" className="th-partner-link">Стать частью TalentHub <span>→</span></Link></div>
        <div className="th-partner-diagram"><div className="th-partner-card"><span>⌂</span><b>Образовательные учреждения</b><small>Школы и организации</small></div><div className="th-partner-connector"><span>↔</span></div><div className="th-partner-card"><span>▦</span><b>Компании и академии</b><small>Партнёры и инициативы</small></div></div>
      </section>

      <section className="th-roles">
        <div className="th-section-heading"><div><div className="th-section-label">ДЛЯ КАЖДОГО УЧАСТНИКА</div><h2>TalentHub объединяет</h2></div><p>У каждого участника — своя роль и понятные инструменты.</p></div>
        <div className="th-role-grid">{roles.map((role, i) => <article className="th-role" key={role.title}><span>0{i + 1}</span><h3>{role.title}</h3><p>{role.text}</p><Link to={role.link}>{role.action} <b>→</b></Link></article>)}</div>
      </section>

      <section className="th-cta"><div><div className="th-section-label">TALENTHUB</div><h2>Начните открывать новые возможности</h2><p>Присоединяйтесь к единой образовательной среде.</p></div><Link to="/auth" className="th-primary">Открыть платформу <span>→</span></Link></section>

      <footer className="th-footer"><Link to="/" className="th-logo"><span className="th-logo-mark">t.</span><span>Talent<span>Hub</span></span></Link><span>Платформа образовательных возможностей и партнёрств</span><small>© TalentHub</small></footer>
    </main>
  )
}
