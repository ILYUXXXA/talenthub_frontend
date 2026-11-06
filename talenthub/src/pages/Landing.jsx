import { Link } from 'react-router-dom'

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

export default function Landing() {
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
          <div className="th-overline"><span></span> ЕДИНАЯ ПЛАТФОРМА ДЛЯ РАЗВИТИЯ</div>
          <h1>Находи возможности. Участвуй. Развивайся.</h1>
          <p>Мероприятия и образовательные проекты для учащихся. Партнёрства и инструменты развития — для школ, компаний и академий.</p>
          <div className="th-hero-actions">
            <Link to="/auth" className="th-primary">Найти свою возможность <span>→</span></Link>
            <a href="#platform" className="th-secondary">Узнать больше</a>
          </div>
          <div className="th-hero-caption"><span>Для учащихся</span><i></i><span>Для учреждений</span><i></i><span>Для партнёров</span></div>
        </div>

        <div className="th-hero-visual" aria-label="Открой. Участвуй. Создавай.">
          <div className="th-visual-orb"></div>
          <div className="th-visual-wordmark"><span>talent</span><strong>hub</strong></div>
          <div className="th-visual-index">01 <i></i> 03</div>
          <div className="th-visual-steps">
            <div className="th-visual-step"><span>01</span><div><b>Открой</b><small>Найди своё направление</small></div><i>↗</i></div>
            <div className="th-visual-step"><span>02</span><div><b>Участвуй</b><small>Выбирай события и проекты</small></div><i>↗</i></div>
            <div className="th-visual-step"><span>03</span><div><b>Создавай</b><small>Сохраняй результаты и связи</small></div><i>↗</i></div>
          </div>
          <div className="th-visual-note">ТВОЯ СЛЕДУЮЩАЯ ВОЗМОЖНОСТЬ — ЗДЕСЬ</div>
        </div>
      </section>

      <section className="th-intro" id="platform">
        <div className="th-section-label">TALENTHUB / ПЛАТФОРМА</div>
        <div><h2>От интереса — к реальным достижениям</h2><p>Возможности для учащихся и инструменты для организаций собраны на одной платформе. Находите события, подавайте заявки, сохраняйте результаты и выстраивайте сотрудничество в единой среде.</p></div>
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
