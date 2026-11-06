import { Link } from 'react-router-dom'

const features = [
  { icon: '🎯', title: 'Подобрать направление', text: 'Олимпиады, конкурсы и проекты — возможности по интересам и уровню подготовки.' },
  { icon: '📅', title: 'Не пропустить важное', text: 'Календарь событий, сроки регистрации и статусы заявок в одном месте.' },
  { icon: '🏆', title: 'Видеть свой прогресс', text: 'Достижения и участие в мероприятиях складываются в единую историю.' },
]

const roles = [
  { icon: '🎓', title: 'Школьникам', text: 'Находить возможности, подавать заявки и собирать портфолио.', link: '/auth', action: 'Найти возможности' },
  { icon: '👨‍👩‍👧', title: 'Родителям', text: 'Следить за прогрессом ребёнка, событиями и образовательными маршрутами.', link: '/parent', action: 'Кабинет родителя' },
  { icon: '🏫', title: 'Школам', text: 'Поддерживать учеников и видеть их активность и достижения.', link: '/school', action: 'Кабинет школы' },
  { icon: '🤝', title: 'Организаторам', text: 'Публиковать мероприятия и находить заинтересованных участников.', link: '/company', action: 'Для организаций' },
]

export default function Landing() {
  return (
    <main className="showcase">
      <header className="showcase-nav">
        <Link className="showcase-logo" to="/">Talent<span>Hub</span></Link>
        <nav aria-label="Основная навигация">
          <a href="#how">Возможности</a>
          <a href="#audience">Кому подходит</a>
          <Link to="/auth" className="showcase-nav-cta">Войти <span>↗</span></Link>
        </nav>
      </header>

      <section className="showcase-hero">
        <div className="showcase-copy">
          <div className="showcase-pill"><span className="showcase-live-dot" /> Единая среда возможностей для школьников</div>
          <h1>Твой интерес.<br /><em>Твои возможности.</em></h1>
          <p className="showcase-lead">TalentHub помогает школьникам находить олимпиады, конкурсы и проекты, участвовать в них и превращать достижения в понятную историю роста.</p>
          <div className="showcase-actions">
            <Link className="showcase-primary" to="/auth">Открыть TalentHub <span>→</span></Link>
            <a className="showcase-secondary" href="#how">Как это работает <span>↓</span></a>
          </div>
          <div className="showcase-proof">
            <div className="showcase-avatars"><span>А</span><span>М</span><span>И</span></div>
            <p><strong>От первого интереса до большого результата</strong><br /><small>Всё важное — в одном пространстве</small></p>
          </div>
        </div>

        <div className="showcase-art" aria-label="Иллюстрация интерфейса TalentHub">
          <div className="showcase-orbit orbit-one" />
          <div className="showcase-orbit orbit-two" />
          <div className="showcase-spark spark-one">✦</div>
          <div className="showcase-spark spark-two">✳</div>
          <div className="showcase-dashboard">
            <div className="showcase-dash-top"><span className="dash-brand">TalentHub</span><span className="dash-avatar">АК</span></div>
            <div className="dash-greeting">ТВОЙ ПУТЬ РАЗВИТИЯ</div>
            <h3>Привет, Алина! 👋</h3>
            <p className="dash-sub">Новые возможности уже рядом</p>
            <div className="dash-stats">
              <div><strong>08</strong><small>мероприятий</small></div>
              <div><strong>04</strong><small>достижения</small></div>
              <div><strong>12</strong><small>активностей</small></div>
            </div>
            <div className="dash-event-label">РЕКОМЕНДУЕМ ТЕБЕ</div>
            <div className="dash-event">
              <div className="dash-event-icon">⌘</div>
              <div><strong>Олимпиада по информатике</strong><small>Технологии · Регистрация открыта</small></div>
              <span className="dash-arrow">↗</span>
            </div>
            <div className="dash-progress"><span>Твой прогресс</span><strong>На пути к цели</strong><div><i /></div></div>
          </div>
          <div className="showcase-float float-top"><span>✦</span><div><strong>Новая возможность</strong><small>Открой своё направление</small></div></div>
          <div className="showcase-float float-bottom"><span>🏆</span><div><strong>Каждый шаг важен</strong><small>Сохраняй свои достижения</small></div></div>
        </div>
      </section>

      <section className="showcase-ribbon" aria-label="Принципы TalentHub">
        <span>ИНТЕРЕСЫ</span><b>✳</b><span>ВОЗМОЖНОСТИ</span><b>✳</b><span>УЧАСТИЕ</span><b>✳</b><span>ДОСТИЖЕНИЯ</span><b>✳</b><span>БУДУЩЕЕ</span>
      </section>

      <section className="showcase-section" id="how">
        <div className="showcase-section-head">
          <div><span className="showcase-kicker">ОДНО ПРОСТРАНСТВО — МНОГО ВОЗМОЖНОСТЕЙ</span><h2>Развивайся не наугад,<br /><em>а с интересом.</em></h2></div>
          <p>От поиска события до результата — понятный путь, который помогает не терять важное и видеть собственный рост.</p>
        </div>
        <div className="showcase-feature-grid">
          {features.map((feature, index) => (
            <article className="showcase-feature" key={feature.title}>
              <div className="feature-top"><span>{feature.icon}</span><small>0{index + 1}</small></div>
              <h3>{feature.title}</h3><p>{feature.text}</p>
              <div className="feature-line" />
            </article>
          ))}
        </div>
      </section>

      <section className="showcase-audience" id="audience">
        <div className="showcase-section-head audience-head">
          <div><span className="showcase-kicker">ДЛЯ ВСЕХ УЧАСТНИКОВ</span><h2>Растём <em>вместе.</em></h2></div>
          <p>У каждого своя роль, но общая цель — раскрыть потенциал школьника.</p>
        </div>
        <div className="showcase-role-grid">
          {roles.map((role, index) => (
            <article className="showcase-role" key={role.title}>
              <div className="role-number">0{index + 1}</div>
              <div className="role-icon">{role.icon}</div>
              <h3>{role.title}</h3><p>{role.text}</p>
              <Link to={role.link}>{role.action} <span>↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase-final">
        <div><span className="showcase-kicker">ТВОЯ ИСТОРИЯ НАЧИНАЕТСЯ ЗДЕСЬ</span><h2>Большие достижения<br />начинаются <em>с интереса.</em></h2></div>
        <Link className="showcase-primary" to="/auth">Присоединиться <span>→</span></Link>
        <div className="final-star">✳</div>
      </section>

      <footer className="showcase-footer"><Link className="showcase-logo" to="/">Talent<span>Hub</span></Link><span>Среда, в которой раскрываются возможности.</span><span>© TalentHub</span></footer>
    </main>
  )
}
