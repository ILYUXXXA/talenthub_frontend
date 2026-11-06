import { Link } from 'react-router-dom'

const paths = [
  { n: '01', title: 'Найти возможность', text: 'Мероприятия, олимпиады, конкурсы и программы — с поиском по интересам.', icon: '↗' },
  { n: '02', title: 'Принять участие', text: 'Понятная регистрация и актуальный статус участия в одном месте.', icon: '◎' },
  { n: '03', title: 'Сохранить результат', text: 'Подтверждённые достижения остаются в личном портфолио.', icon: '◇' },
]

const roles = [
  { name: 'Учащимся', text: 'Открывать направления, находить события и собирать портфолио.', to: '/auth', label: 'Найти возможности', symbol: '↗' },
  { name: 'Учреждениям', text: 'Публиковать события, управлять регистрациями и находить партнёров.', to: '/school', label: 'Профиль учреждения', symbol: '⌂' },
  { name: 'Компаниям и академиям', text: 'Запускать образовательные инициативы и сотрудничать с учреждениями.', to: '/company', label: 'Профиль организации', symbol: '▣' },
  { name: 'Родителям', text: 'Быть в курсе образовательной активности ребёнка.', to: '/parent', label: 'Кабинет родителя', symbol: '♡' },
]

export default function Landing() {
  return (
    <main className="minimal-landing">
      <header className="minimal-nav">
        <Link to="/" className="minimal-logo"><span className="minimal-logo-mark">t.</span>talent<span>hub</span></Link>
        <nav><a href="#about">О платформе</a><a href="#flow">Как это работает</a><a href="#collab">Партнёрства</a><Link to="/auth" className="minimal-login">Войти <span>↗</span></Link></nav>
      </header>

      <section className="minimal-hero">
        <div className="minimal-hero-copy">
          <div className="minimal-eyebrow"><i /> ЕДИНОЕ ПРОСТРАНСТВО ВОЗМОЖНОСТЕЙ</div>
          <h1>Найди то,<br/>что <em>зажигает.</em></h1>
          <p className="minimal-lead">TalentHub помогает учащимся находить образовательные возможности, а школам, компаниям и академиям — создавать их вместе.</p>
          <div className="minimal-actions"><Link to="/auth" className="minimal-button">Открыть TalentHub <span>↗</span></Link><a href="#about" className="minimal-text-link">Исследовать платформу <span>↓</span></a></div>
          <div className="minimal-proof"><span className="minimal-proof-dot">✳</span><span><b>От интереса — к действию</b><small>События · Портфолио · Партнёрства</small></span></div>
        </div>

        <div className="minimal-art" aria-label="Абстрактная трёхмерная композиция TalentHub">
          <div className="minimal-art-halo"></div>
          <div className="minimal-orbit orbit-one"></div><div className="minimal-orbit orbit-two"></div><div className="minimal-orbit orbit-three"></div>
          <div className="minimal-core">
            <div className="core-top"></div><div className="core-side"></div><div className="core-front"><span>t.</span></div>
          </div>
          <div className="minimal-float-card float-event"><span className="float-card-icon">✳</span><span><small>ВОЗМОЖНОСТЬ</small><b>Найди своё событие</b></span><i>↗</i></div>
          <div className="minimal-float-card float-portfolio"><span className="float-card-icon">◇</span><span><small>ТВОЙ ПУТЬ</small><b>Сохраняй достижения</b></span></div>
          <div className="minimal-float-card float-partner"><span className="float-card-icon">↔</span><span><small>СОТРУДНИЧЕСТВО</small><b>Создавайте вместе</b></span></div>
          <div className="minimal-art-label">DISCOVER <span>·</span> PARTICIPATE <span>·</span> CREATE</div>
        </div>
        <div className="minimal-scroll">ЛИСТАЙТЕ НИЖЕ <span>↓</span></div>
      </section>

      <section className="minimal-intro" id="about">
        <div className="minimal-section-index">01 / ЗАЧЕМ TALENTHUB</div>
        <div className="minimal-intro-content"><h2>Возможности есть.<br/><em>Найти их — сложнее.</em></h2><p>Мероприятия и программы часто разбросаны по разным площадкам. А организациям непросто найти друг друга для совместных инициатив. TalentHub собирает эти процессы в одном пространстве.</p></div>
      </section>

      <section className="minimal-flow" id="flow">
        <div className="minimal-section-head"><div><div className="minimal-section-index">02 / ПУТЬ УЧАЩЕГОСЯ</div><h2>От интереса<br/>к <em>достижению.</em></h2></div><p>Весь путь — без лишних шагов и разрозненных сервисов.</p></div>
        <div className="minimal-path-list">{paths.map((item) => <article className="minimal-path" key={item.n}><span className="path-num">{item.n}</span><span className="path-symbol">{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><span className="path-arrow">↗</span></article>)}</div>
      </section>

      <section className="minimal-collab" id="collab">
        <div className="minimal-collab-copy"><div className="minimal-section-index">03 / ПАРТНЁРСТВА</div><h2>Инициатива может<br/>начаться <em>с любой стороны.</em></h2><p>TalentHub поддерживает двустороннее сотрудничество: учреждение может искать компанию или академию, а организация — предлагать инициативу подходящему учреждению.</p></div>
        <div className="minimal-collab-visual">
          <div className="collab-node node-school"><span>⌂</span><small>УЧРЕЖДЕНИЕ</small></div>
          <div className="collab-node node-company"><span>▣</span><small>КОМПАНИЯ</small></div>
          <div className="collab-link"><i></i><b>↔</b><i></i></div>
          <div className="collab-center">T<span>H</span></div>
          <div className="collab-caption">ОБЩАЯ ИНИЦИАТИВА</div>
        </div>
      </section>

      <section className="minimal-trust">
        <div className="trust-object"><div className="trust-ring"></div><div className="trust-cube"><span>✳</span></div></div>
        <div className="trust-copy"><div className="minimal-section-index">04 / ДОВЕРИЕ</div><h2>Престиж —<br/>это <em>реальный вклад.</em></h2><p>Престиж организации отражает подтверждённое участие в образовательных инициативах. Это прозрачная основа для доверия между партнёрами — не рейтинг учащихся и не платное продвижение.</p></div>
      </section>

      <section className="minimal-roles">
        <div className="minimal-section-head"><div><div className="minimal-section-index">05 / ДЛЯ КОГО</div><h2>Одна среда.<br/><em>Разные возможности.</em></h2></div><p>Каждая роль получает инструменты для своей задачи и вносит вклад в общую образовательную среду.</p></div>
        <div className="minimal-role-grid">{roles.map((role, i) => <article className="minimal-role" key={role.name}><div className="role-top"><span>{role.symbol}</span><small>0{i + 1}</small></div><h3>{role.name}</h3><p>{role.text}</p><Link to={role.to}>{role.label} <span>↗</span></Link></article>)}</div>
      </section>

      <section className="minimal-end"><div className="minimal-end-orb"></div><div className="minimal-section-index">TALENTHUB / NEXT STEP</div><h2>Твоя следующая<br/><em>возможность начинается здесь.</em></h2><p>Открой платформу и найди, с чего начать.</p><Link to="/auth" className="minimal-button">Перейти в TalentHub <span>↗</span></Link></section>

      <footer className="minimal-footer"><Link to="/" className="minimal-logo"><span className="minimal-logo-mark">t.</span>talent<span>hub</span></Link><span>Образовательные возможности и партнёрства</span><span>© TalentHub</span></footer>
    </main>
  )
}
