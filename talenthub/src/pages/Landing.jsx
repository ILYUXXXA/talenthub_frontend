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
          <div className="showcase-pill"><span className="showcase-live-dot" /> Платформа образовательных возможностей и партнёрств</div>
          <h1>Возможности<br />для учащихся.<br /><em>Партнёрства для всех.</em></h1>
          <p className="showcase-lead">TalentHub объединяет учащихся, образовательные учреждения, компании и академии — чтобы находить возможности для развития и вместе создавать новые.</p>
          <div className="showcase-actions">
            <Link className="showcase-primary" to="/auth">Открыть платформу <span>→</span></Link>
            <a className="showcase-secondary" href="#platform">Узнать о TalentHub <span>↓</span></a>
          </div>
          <div className="prd-hero-note"><span className="prd-note-icon">◎</span><span><strong>От интереса — к участию. От контакта — к сотрудничеству.</strong><small>Единое пространство для образования и инициатив</small></span></div>
        </div>

        <div className="prd-visual" aria-label="Трёхмерная композиция образовательных возможностей и партнёрств">
          <div className="prd-visual-glow" />
          <div className="prd-ring ring-a" /><div className="prd-ring ring-b" /><div className="prd-ring ring-c" />
          <div className="prd-node node-student"><span>✳</span><small>УЧАЩИЕСЯ</small></div>
          <div className="prd-node node-school"><span>⌂</span><small>ШКОЛЫ</small></div>
          <div className="prd-node node-company"><span>▣</span><small>КОМПАНИИ</small></div>
          <div className="prd-node node-academy"><span>◇</span><small>АКАДЕМИИ</small></div>
          <div className="prd-platform">
            <div className="prd-platform-top">
              <div className="prd-cap"><span className="cap-board" /><span className="cap-crown" /><span className="cap-tassel" /></div>
              <div className="prd-book"><span /><span /><span /></div>
              <div className="prd-trophy">★</div>
            </div>
            <div className="prd-platform-disc disc-top" /><div className="prd-platform-disc disc-mid" /><div className="prd-platform-disc disc-bottom" />
            <div className="prd-platform-label"><span>✳</span> TALENTHUB <i>•</i> CONNECTING OPPORTUNITIES</div>
          </div>
          <div className="prd-float-card float-event"><span className="float-symbol">◷</span><span><strong>Мероприятия</strong><small>Новые возможности</small></span></div>
          <div className="prd-float-card float-trust"><span className="float-symbol">✦</span><span><strong>Подтверждённый вклад</strong><small>Престиж организаций</small></span></div>
          <div className="prd-visual-caption">ЕДИНАЯ СРЕДА · ОБЩИЕ ВОЗМОЖНОСТИ</div>
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
