import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/talent-connect-landing-page.css'

const audiences = [
  { title: 'Родителям', role: 'parent', icon: '♡', headline: 'Рядом на каждом\nэтапе развития.', description: 'Следите за образовательной активностью и успехами ребёнка.', tags: ['Активность', 'Результаты', 'Развитие'] },
  { title: 'Учащимся', role: 'student', icon: '↗', headline: 'Твой интерес.\nТвой следующий шаг.', description: 'Находите интересные события, участвуйте и сохраняйте свои результаты.', tags: ['Мероприятия', 'Олимпиады', 'Портфолио'] },
  { title: 'Компаниям', role: 'company', icon: '▦', headline: 'Инициативы,\nкоторые объединяют.', description: 'Предлагайте инициативы и сотрудничайте с образовательными учреждениями.', tags: ['Проекты', 'Партнёрства', 'Образование'] },
  { title: 'Школам', role: 'school', icon: '⌂', headline: 'Возможности\nдля всей школы.', description: 'Публикуйте возможности, работайте с заявками и находите партнёров.', tags: ['Публикации', 'Заявки', 'Сотрудничество'] },
]
const steps = [
  { title: 'Находи', subtitle: 'Возможности рядом', icon: '⌕', copy: 'Мероприятия, олимпиады, конкурсы и образовательные программы в одном каталоге.', detail: 'От первого интереса — к своему направлению.' },
  { title: 'Участвуй', subtitle: 'Личное портфолио', icon: '✧', copy: 'Собирайте подтверждённые достижения и отслеживайте свой образовательный путь.', detail: 'От заявки — к подтверждённому результату.' },
  { title: 'Создавай', subtitle: 'Партнёрства', icon: '⌘', copy: 'Находите организации и создавайте совместные образовательные инициативы.', detail: 'От знакомства — к общему проекту.' },
]
const Icon = ({ children, className = '' }) => <span aria-hidden="true" className={`kt-glyph ${className}`}>{children}</span>

export default function Landing() {
  const [audience, setAudience] = useState(3)
  const [menu, setMenu] = useState(false)
  const [join, setJoin] = useState(false)
  const root = useRef(null)
  const person = audiences[audience]

  useEffect(() => {
    const elements = root.current?.querySelectorAll('.kt-reveal')
    if (!elements?.length) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.12 })
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return <>
    <main id="top" className="kt" ref={root}>
      <header className="kt-header">
        <Link to="/" className="kt-logo" aria-label="TalentHub — главная"><span className="kt-logo-mark">t.</span><span>Talent<span>Hub</span></span></Link>
        <nav className={menu ? 'kt-nav is-open' : 'kt-nav'} aria-label="Основная навигация">
          {[['#platform', 'Об экосистеме'], ['#how', 'Как это работает'], ['#partners', 'Партнёрства']].map(([href, label]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}
        </nav>
        <div className="kt-header-actions">
          <Link to="/auth" className="kt-login">Войти <span>→</span></Link>
          <button className="kt-menu" type="button" aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenu(!menu)}>{menu ? '×' : '☰'}</button>
        </div>
      </header>

      <section className="kt-hero">
        <img className="kt-hero-art" src="https://raw.githubusercontent.com/ILYUXXXA/talent-connect/fix/landing-step-actions/src/assets/talenthub-sculpture.jpg" width="1920" height="1024" alt="Синяя скульптура в форме звезды" />
        <div className="kt-hero-top"><span><span className="kt-live" /> ОБРАЗОВАТЕЛЬНАЯ ЭКОСИСТЕМА</span><span>✳</span></div>
        <h1><span className="kt-line-one">Твои возможности</span><span className="kt-line-two">В одном месте <span aria-hidden="true">↗</span></span></h1>
        <div className="kt-hero-bottom"><div><p>TalentHub — это образовательная экосистема, которая объединяет школьников, родителей, школы, компании и образовательные организации вокруг развития талантов, образовательных возможностей и достижений.</p><div className="kt-hero-actions"><button className="kt-cta" type="button" onClick={() => setJoin(true)}>Открыть TalentHub <span>↗</span></button><a className="kt-scroll" href="#platform">Об экосистеме <span>↓</span></a></div></div></div>
        <div className="kt-hero-footer"><span>ЛЮДИ / ИДЕИ / ВОЗМОЖНОСТИ</span><a href="#platform" aria-label="Перейти к экосистеме">↓</a><span>ТВОЙ СЛЕДУЮЩИЙ ШАГ ↓</span></div>
      </section>

      <div className="kt-ticker" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>НАХОДИ ✳ УЧАСТВУЙ ✳ СОЗДАВАЙ ✳</span>)}</div></div>

      <section className="kt-platform kt-section" id="platform">
        <div className="kt-section-top kt-reveal"><span>01 / ЭКОСИСТЕМА</span><span>РАЗНЫЕ РОЛИ. ОБЩИЕ ВОЗМОЖНОСТИ.</span></div>
        <h2 className="kt-reveal">Не просто платформа.<br /><span>Точка пересечения.</span></h2>
        <div className="kt-audiences kt-reveal" role="tablist" aria-label="Участники экосистемы">{audiences.map((item, i) => <button type="button" role="tab" aria-selected={audience === i} aria-controls="audience-panel" key={item.role} className={audience === i ? 'is-active' : ''} onClick={() => setAudience(i)}><Icon>{item.icon}</Icon>{item.title}<span>↗</span></button>)}</div>
        <div className="kt-audience-content" role="tabpanel" id="audience-panel" aria-labelledby={`audience-${audience}`}>
          <div key={audience} className="kt-audience-copy"><span className="kt-mini">TALENTHUB / {person.title.toUpperCase()}</span><h3>{person.headline}</h3><p>{person.description}</p><div className="kt-tags">{person.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button type="button" onClick={() => setJoin(true)} className="kt-text-link">Открыть экосистему ↗</button></div>
          <div className="kt-audience-image"><img src="https://raw.githubusercontent.com/ILYUXXXA/talent-connect/fix/landing-step-actions/src/assets/talenthub-team.jpg" width="1920" height="1024" loading="lazy" alt="Учащиеся работают над совместным проектом" /><span>ОТ ИНТЕРЕСА — К РЕАЛЬНЫМ ДОСТИЖЕНИЯМ ↗</span></div>
        </div>
      </section>

      <section className="kt-how kt-section" id="how"><div className="kt-section-top kt-reveal"><span>02 / ТВОЙ МАРШРУТ</span><span>ОТ ПЕРВОГО ИНТЕРЕСА ДО РЕЗУЛЬТАТА</span></div><h2 className="kt-reveal">Меньше барьеров.<br /><span>Больше движения.</span></h2>
        <div className="kt-steps">{steps.map((item, i) => <article key={item.title} className="kt-step kt-reveal"><button type="button" className="kt-step-trigger" aria-label={`Открыть TalentHub: ${item.title}`} onClick={() => setJoin(true)}><span className="kt-step-number">0{i + 1}</span><Icon>{item.icon}</Icon><span className="kt-step-title">{item.title}</span><span className="kt-step-subtitle">{item.subtitle}</span><span className="kt-step-toggle">↗</span></button><div className="kt-step-body" id={`step-${i}`}><p>{item.copy}</p><span>{item.detail}</span></div></article>)}</div>
      </section>

      <section className="kt-partners kt-section" id="partners"><div className="kt-section-top kt-reveal"><span>03 / СОТРУДНИЧЕСТВО</span><span>ШКОЛЫ × КОМПАНИИ × АКАДЕМИИ</span></div><div className="kt-partners-content kt-reveal"><h2>Создавайте<br /><span>возможности вместе.</span></h2><div><Icon className="kt-network">⌘</Icon><p>Школы, компании и академии могут находить друг друга, договариваться о сотрудничестве и запускать совместные образовательные проекты — от мастер-классов и экскурсий до конкурсов, стажировок и программ развития.</p><button className="kt-cta kt-cta-light" type="button" onClick={() => setJoin(true)}>Стать частью TalentHub ↗</button></div></div><div className="kt-partner-types kt-reveal"><span>⌂ Образовательные учреждения</span><span>▦ Компании и академии</span><span>Совместные проекты ↗</span></div></section>

      <section className="kt-final kt-section"><div className="kt-section-top"><span>СЛЕДУЮЩИЙ ШАГ — ЗА ТОБОЙ</span><span>✳</span></div><button className="kt-final-link" type="button" onClick={() => setJoin(true)}><span>Начнём<span>с возможности?</span></span><span>↗</span></button><p>Присоединяйтесь к единой образовательной среде.</p></section>
      <footer className="kt-footer"><Link to="/" className="kt-logo"><span className="kt-logo-mark">t.</span><span>Talent<span>Hub</span></span></Link><span>Образовательная экосистема возможностей и партнёрств</span><span>© TalentHub</span><a href="#top" aria-label="Вернуться наверх">↗</a></footer>
    </main>

    {join && <div className="kt-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setJoin(false) }}>
      <section className="kt-join" role="dialog" aria-modal="true" aria-labelledby="kt-join-title">
        <button className="kt-modal-close" type="button" aria-label="Закрыть" onClick={() => setJoin(false)}>×</button>
        <h2 id="kt-join-title">С чего начнём?</h2>
        <p>Выберите, как вы хотите использовать TalentHub. Дальше откроется единая форма входа и регистрации.</p>
        <div className="kt-join-roles">{audiences.map(item => <Link key={item.role} to={`/auth?role=${item.role}`} onClick={() => setJoin(false)}><Icon>{item.icon}</Icon>{item.title}<span>↗</span></Link>)}</div>
      </section>
    </div>}
  </>
}
