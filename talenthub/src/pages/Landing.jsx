import { Link } from 'react-router-dom'

const pillars = [
  { icon: '⌕', number: '01', title: 'Находи возможности', text: 'Мероприятия, олимпиады, конкурсы и образовательные программы — в одном каталоге. Ищи по интересам и выбирай своё.' },
  { icon: '↗', number: '02', title: 'Участвуй и развивайся', text: 'Регистрируйся, следи за статусом участия и сохраняй подтверждённые результаты в личном портфолио.' },
  { icon: '◇', number: '03', title: 'Создавай партнёрства', text: 'Школы, компании и академии находят друг друга, объединяют ресурсы и запускают совместные инициативы.' },
]

const audiences = [
  { icon: '✳', title: 'Учащимся', text: 'Открывать новые направления, находить события и собирать портфолио.', link: '/auth', action: 'Найти возможности', tone: 'blue' },
  { icon: '⌂', title: 'Учреждениям', text: 'Публиковать мероприятия, работать с регистрациями и искать партнёров.', link: '/school', action: 'Для учреждений', tone: 'violet' },
  { icon: '▣', title: 'Компаниям и академиям', text: 'Запускать образовательные инициативы и находить учреждения для сотрудничества.', link: '/company', action: 'Для организаций', tone: 'green' },
  { icon: '♡', title: 'Родителям', text: 'Быть в курсе образовательной активности и участия ребёнка.', link: '/parent', action: 'Кабинет родителя', tone: 'rose' },
]

export default function Landing() {
  return (
    <main className="showcase prd-showcase">
      <header className="showcase-nav prd-nav">
        <Link className="showcase-logo" to="/"><span className="prd-mark">✳</span>Talent<span>Hub</span></Link>
        <nav aria-label="Основная навигация">
          <a href="#platform">О платформе</a>
          <a href="#journey">Как это работает</a>
          <a href="#partners">Партнёрства</a>
          <Link to="/auth" className="showcase-nav-cta">Войти <span>↗</span></Link>
        </nav>
      </header>

      <section className="showcase-hero prd-hero">
        <div className="showcase-copy prd-copy">
          <div className="showcase-pill"><span className="showcase-live-dot" /> Образовательные возможности и партнёрства</div>
          <h1>Находи возможности.<br /><em>Создавай партнёрства.</em></h1>
          <p className="showcase-lead">TalentHub объединяет учащихся, школы, компании и академии. Здесь можно находить мероприятия, развивать свои интересы и запускать совместные образовательные инициативы.</p>
          <div className="showcase-actions">
            <Link className="showcase-primary" to="/auth">Открыть платформу <span>→</span></Link>
            <a className="showcase-secondary" href="#platform">Как это работает <span>↓</span></a>
          </div>
          <div className="prd-hero-note"><span className="prd-note-icon">◎</span><span><strong>Всё необходимое — в одном пространстве</strong><small>От поиска события до реального сотрудничества</small></span></div>
        </div>

        <div className="prd-product-preview" aria-label="Пример интерфейса TalentHub">
          <div className="preview-window">
            <div className="preview-topbar"><div className="preview-brand"><span>✳</span> TalentHub</div><div className="preview-top-actions"><i></i><i></i><b>АК</b></div></div>
            <div className="preview-body">
              <aside className="preview-sidebar"><span className="active">⌂ <small>Обзор</small></span><span>▦ <small>Мероприятия</small></span><span>◇ <small>Партнёрства</small></span><span>▤ <small>Портфолио</small></span></aside>
              <div className="preview-content">
                <div className="preview-greeting"><div><small>ЛИЧНЫЙ КАБИНЕТ</small><strong>Привет, Алина!</strong><p>Твои новые возможности уже здесь.</p></div><span className="preview-avatar">А</span></div>
                <div className="preview-stats"><div><small>Мероприятия</small><strong>12</strong><em>доступно сейчас</em></div><div><small>Мои достижения</small><strong>08</strong><em>в портфолио</em></div><div><small>Интересы</small><strong>04</strong><em>направления</em></div></div>
                <div className="preview-section-title">Подобрали для тебя <a href="#audience">Все возможности →</a></div>
                <div className="preview-event"><div className="preview-event-art art-blue">✦</div><div><small>ОЛИМПИАДА · 18 НОЯБРЯ</small><strong>Технологии будущего</strong><span>Наука · Онлайн</span></div><b>→</b></div>
                <div className="preview-event"><div className="preview-event-art art-violet">◇</div><div><small>ОБРАЗОВАТЕЛЬНАЯ ПРОГРАММА</small><strong>Лаборатория идей</strong><span>Проектная деятельность</span></div><b>→</b></div>
              </div>
            </div>
          </div>
          <div className="preview-float preview-float-top"><span>✓</span><div><strong>Твой прогресс</strong><small>Сохраняется в портфолио</small></div></div>
          <div className="preview-float preview-float-bottom"><span>↗</span><div><strong>Новые партнёрства</strong><small>Школы и организации рядом</small></div></div>
          <div className="preview-caption">ИНТЕРФЕЙС TALENTHUB</div>
        </div>
      </section>

      <section className="prd-statement" id="platform">
        <div className="prd-statement-mark">T<span>H</span></div>
        <p>Образовательные возможности часто разбросаны по разным площадкам. <strong>TalentHub собирает их в одном месте</strong> — и помогает людям и организациям находить друг друга.</p>
      </section>

      <section className="showcase-section prd-journey" id="journey">
        <div className="showcase-section-head">
          <div><span className="showcase-kicker">КАК РАБОТАЕТ TALENTHUB</span><h2>От первого интереса<br /><em>до реального результата.</em></h2></div>
          <p>Платформа сопровождает путь учащегося и помогает организациям превращать идеи в совместные образовательные инициативы.</p>
        </div>
        <div className="showcase-feature-grid prd-pillar-grid">
          {pillars.map((item) => (
            <article className="showcase-feature prd-pillar" key={item.number}>
              <div className="feature-top"><span>{item.icon}</span><small>{item.number}</small></div>
              <h3>{item.title}</h3><p>{item.text}</p><div className="feature-line" />
            </article>
          ))}
        </div>
      </section>

      <section className="prd-partnership" id="partners">
        <div className="prd-partnership-copy">
          <span className="showcase-kicker">ДВА НАПРАВЛЕНИЯ СОТРУДНИЧЕСТВА</span>
          <h2>Связи, из которых<br /><em>рождаются инициативы.</em></h2>
          <p>TalentHub помогает выстраивать партнёрства в обе стороны — от запроса учреждения до инициативы компании или академии.</p>
        </div>
        <div className="prd-flow">
          <div className="prd-flow-card"><span className="flow-icon">⌂</span><div><strong>Учреждение ищет партнёра</strong><small>Публикует запрос и получает отклики компаний и академий</small></div><b>01</b></div>
          <div className="prd-flow-connector"><span>↕</span><small>ВСТРЕЧА ИНТЕРЕСОВ</small></div>
          <div className="prd-flow-card"><span className="flow-icon company-flow">▣</span><div><strong>Компания ищет учреждение</strong><small>Предлагает инициативу и находит подходящую площадку</small></div><b>02</b></div>
          <div className="prd-trust-note"><span>✦</span><p><strong>Доверие на основе реальных действий.</strong> Престиж организации формируется подтверждённым вкладом в образовательные инициативы, а не количеством публикаций.</p></div>
        </div>
      </section>

      <section className="showcase-audience prd-audience" id="audience">
        <div className="showcase-section-head audience-head">
          <div><span className="showcase-kicker">ОДНА ПЛАТФОРМА — РАЗНЫЕ РОЛИ</span><h2>Возможности <em>объединяют.</em></h2></div>
          <p>Каждый участник получает инструменты для своей задачи — и становится частью общей образовательной среды.</p>
        </div>
        <div className="showcase-role-grid prd-role-grid">
          {audiences.map((item, index) => (
            <article className={`showcase-role prd-role ${item.tone}`} key={item.title}>
              <div className="role-number">0{index + 1}</div><div className="role-icon">{item.icon}</div>
              <h3>{item.title}</h3><p>{item.text}</p><Link to={item.link}>{item.action} <span>↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="prd-prestige">
        <div className="prestige-emblem"><span>✦</span><small>TRUST<br />THROUGH<br />IMPACT</small></div>
        <div><span className="showcase-kicker">ОСОБЕННОСТЬ TALENTHUB</span><h2>Престиж — это<br /><em>подтверждённый вклад.</em></h2><p>Прозрачная история проведённых инициатив помогает организациям видеть активность потенциальных партнёров и принимать более обоснованные решения о сотрудничестве. Это не рейтинг учащихся и не платное повышение позиции.</p></div>
      </section>

      <section className="showcase-final prd-final">
        <div><span className="showcase-kicker">НАЧНИТЕ СОТРУДНИЧЕСТВО СЕГОДНЯ</span><h2>Найдите свою возможность.<br /><em>Создайте следующую вместе.</em></h2><p>TalentHub — пространство, где интересы встречаются с инициативами.</p></div>
        <Link className="showcase-primary" to="/auth">Перейти на платформу <span>→</span></Link><div className="final-star">✳</div>
      </section>

      <footer className="showcase-footer prd-footer"><Link className="showcase-logo" to="/"><span className="prd-mark">✳</span>Talent<span>Hub</span></Link><span>Платформа образовательных возможностей и партнёрств</span><span>© TalentHub</span></footer>
    </main>
  )
}
