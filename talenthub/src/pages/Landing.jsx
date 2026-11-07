import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, ArrowRight, Menu, X, Compass, Trophy, Network, GraduationCap, School, Building2, Heart, Asterisk } from "lucide-react";
import { Button, Dialog, DialogContent, DialogTitle, DialogDescription } from "../components/LandingUI.jsx";
import "../styles/talent-connect-landing.css";
import sculpture from "../assets/landing/talenthub-sculpture.jpg";
import teamPhoto from "../assets/landing/team_photo.jpg";

const audiences = [
  { title: "Родителям", role: "parent", icon: Heart, headline: "Рядом на каждом\nэтапе развития.", description: "Следите за образовательной активностью и успехами ребёнка.", tags: ["Активность", "Результаты", "Развитие"] },
  { title: "Учащимся", role: "student", icon: GraduationCap, headline: "Твой интерес.\nТвой следующий шаг.", description: "Находите интересные события, участвуйте и сохраняйте свои результаты.", tags: ["Мероприятия", "Олимпиады", "Портфолио"] },
  { title: "Компаниям", role: "company", icon: Building2, headline: "Инициативы,\nкоторые объединяют.", description: "Предлагайте инициативы и сотрудничайте с образовательными учреждениями.", tags: ["Проекты", "Партнёрства", "Образование"] },
  { title: "Школам", role: "school", icon: School, headline: "Возможности\nдля всей школы.", description: "Публикуйте возможности, работайте с заявками и находите партнёров.", tags: ["Публикации", "Заявки", "Сотрудничество"] },
];
const steps = [
  { title: "Находи", subtitle: "Возможности рядом", icon: Compass, copy: "Мероприятия, олимпиады, конкурсы и образовательные программы в одном каталоге.", detail: "От первого интереса — к своему направлению." },
  { title: "Участвуй", subtitle: "Личное портфолио", icon: Trophy, copy: "Собирайте подтверждённые достижения и отслеживайте свой образовательный путь.", detail: "От заявки — к подтверждённому результату." },
  { title: "Создавай", subtitle: "Партнёрства", icon: Network, copy: "Находите организации и создавайте совместные образовательные инициативы.", detail: "От знакомства — к общему проекту." },
];
export default function Landing() {
  const [audience, setAudience] = useState(3);
  const [menu, setMenu] = useState(false);
  const [join, setJoin] = useState(false);
  const root = useRef(null);
  const person = audiences[audience];
  useEffect(() => {
    const elements = root.current?.querySelectorAll(".kt-reveal");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  if (!person) return null;
  return <>
    <main id="top" className="kt th-landing" ref={root}>
      <div className="kt-opening">
      <header className="kt-header">
        <Link to="/" className="kt-logo" aria-label="TalentHub — главная"><span className="kt-logo-mark">t.</span><span>Talent<span>Hub</span></span></Link>
        <nav id="landing-navigation" className={menu ? "kt-nav is-open" : "kt-nav"} aria-label="Основная навигация">
          {[['#platform', 'Об экосистеме'], ['#how', 'Как это работает'], ['#partners', 'Партнёрства']].map(([href, label]) => <Button asChild variant="ghost" key={href}><a href={href} onClick={() => setMenu(false)}>{label}</a></Button>)}
        </nav>
        <div className="kt-header-actions"><Button asChild className="kt-login" variant="outline"><Link to="/auth">Войти <ArrowRight /></Link></Button><Button className="kt-menu" variant="ghost" size="icon" aria-controls="landing-navigation" aria-expanded={menu} aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</Button></div>
      </header>
      <section className="kt-hero">
        <div className="kt-hero-top"><span><span className="kt-live" /> ОБРАЗОВАТЕЛЬНАЯ ЭКОСИСТЕМА</span><span><Asterisk size={16} /></span></div>
        <div className="kt-hero-copy">
        <h1><span className="kt-line-one">Твои возможности</span><button type="button" className="kt-line-two" onClick={() => setJoin(true)} aria-haspopup="dialog">В одном месте <ArrowUpRight aria-hidden="true" /></button></h1>
        <div className="kt-hero-bottom"><div><p>TalentHub — это образовательная экосистема, которая объединяет школьников, родителей, школы, компании и образовательные организации вокруг развития талантов, образовательных возможностей и достижений.</p><div className="kt-hero-actions"><Button className="kt-cta" onClick={() => setJoin(true)}>Открыть TalentHub <ArrowUpRight /></Button><Button asChild variant="ghost" className="kt-scroll"><a href="#platform">Об экосистеме <ArrowDown /></a></Button></div></div></div>
        </div>
        <div className="kt-hero-art-frame"><img className="kt-hero-art" src={sculpture} width={1920} height={1024} alt="Синяя скульптура в форме звезды" /></div>
        <div className="kt-hero-footer"><span>ЛЮДИ / ИДЕИ / ВОЗМОЖНОСТИ</span><a href="#platform" aria-label="Перейти к экосистеме"><ArrowDown /></a><span>ТВОЙ СЛЕДУЮЩИЙ ШАГ ↓</span></div>
      </section>
      <div className="kt-ticker" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>НАХОДИ <Asterisk /> УЧАСТВУЙ <Asterisk /> СОЗДАВАЙ <Asterisk /></span>)}</div></div>
      </div>
      <section className="kt-platform kt-section" id="platform">
        <div className="kt-section-top kt-reveal"><span>01 / ЭКОСИСТЕМА</span><span>РАЗНЫЕ РОЛИ. ОБЩИЕ ВОЗМОЖНОСТИ.</span></div>
        <h2 className="kt-reveal">Не просто платформа.<br /><span>Точка пересечения.</span></h2>
        <div className="kt-audiences kt-reveal" role="tablist" aria-label="Участники экосистемы">{audiences.map((item, i) => <Button key={item.title} role="tab" tabIndex={audience === i ? 0 : -1} onKeyDown={event => { const keys = ["ArrowRight", "ArrowLeft", "Home", "End"]; if (!keys.includes(event.key)) return; event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? audiences.length - 1 : (i + (event.key === "ArrowRight" ? 1 : -1) + audiences.length) % audiences.length; setAudience(next); document.getElementById(`audience-${next}`)?.focus(); }} aria-selected={audience === i} aria-controls="audience-panel" id={`audience-${i}`} variant="ghost" className={audience === i ? 'is-active' : ''} onClick={() => setAudience(i)}><item.icon />{item.title}<ArrowUpRight /></Button>)}</div>
        <div className="kt-audience-content" role="tabpanel" id="audience-panel" aria-labelledby={`audience-${audience}`}>
          <div key={audience} className="kt-audience-copy"><span className="kt-mini">TALENTHUB / {person.title.toUpperCase()}</span><h3>{person.headline}</h3><p>{person.description}</p><div className="kt-tags">{person.tags.map(tag => <span key={tag}>{tag}</span>)}</div><Button onClick={() => setJoin(true)} variant="ghost" className="kt-text-link">Открыть экосистему <ArrowUpRight /></Button></div>
          <div className="kt-audience-image"><img src={teamPhoto} width={1280} height={720} loading="lazy" alt="Команда TalentHub" /></div>
        </div>
      </section>
      <section className="kt-how kt-section" id="how"><div className="kt-section-top kt-reveal"><span>02 / ТВОЙ МАРШРУТ</span><span>ОТ ПЕРВОГО ИНТЕРЕСА ДО РЕЗУЛЬТАТА</span></div><h2 className="kt-reveal">Меньше барьеров.<br /><span>Больше движения.</span></h2>
        <div className="kt-steps">{steps.map((item, i) => <article key={item.title} className="kt-step kt-reveal"><Button variant="ghost" className="kt-step-trigger" aria-label={`Открыть TalentHub: ${item.title}`} onClick={() => setJoin(true)}><span className="kt-step-number">0{i + 1}</span><item.icon /><span className="kt-step-title">{item.title}</span><span className="kt-step-subtitle">{item.subtitle}</span><span className="kt-step-toggle"><ArrowUpRight /></span></Button><div className="kt-step-body" id={`step-${i}`}><p>{item.copy}</p><span>{item.detail}</span></div></article>)}</div>
      </section>
      <section className="kt-partners kt-section" id="partners"><div className="kt-section-top kt-reveal"><span>03 / СОТРУДНИЧЕСТВО</span><span>ШКОЛЫ × КОМПАНИИ × АКАДЕМИИ</span></div><div className="kt-partners-content kt-reveal"><h2>Создавайте<br /><span>возможности вместе.</span></h2><div><Network className="kt-network" strokeWidth={1} /><p>Школы, компании и академии могут находить друг друга, договариваться о сотрудничестве и запускать совместные образовательные проекты — от мастер-классов и экскурсий до конкурсов, стажировок и программ развития.</p><Button className="kt-cta kt-cta-light" onClick={() => setJoin(true)}>Стать частью TalentHub <ArrowUpRight /></Button></div></div><div className="kt-partner-types kt-reveal"><span><School /> Образовательные учреждения</span><span><Building2 /> Компании и академии</span><span>Совместные проекты <ArrowUpRight /></span></div></section>
      <section className="kt-final kt-section"><div className="kt-section-top"><span>СЛЕДУЮЩИЙ ШАГ — ЗА ТОБОЙ</span><Asterisk /></div><Button className="kt-final-link" variant="ghost" onClick={() => setJoin(true)}><span>Начнём<span>с возможности?</span></span><ArrowUpRight /></Button><p>Присоединяйтесь к единой образовательной среде.</p></section>
      <footer className="kt-footer"><Link to="/" className="kt-logo"><span className="kt-logo-mark">t.</span><span>Talent<span>Hub</span></span></Link><span>Образовательная экосистема возможностей и партнёрств</span><span>© TalentHub</span><Button asChild size="icon" variant="ghost"><a href="#top" aria-label="Вернуться наверх"><ArrowUpRight /></a></Button></footer>
    </main>
    <Dialog open={join} onOpenChange={setJoin}><DialogContent className="kt-join"><DialogTitle>С чего начнём?</DialogTitle><DialogDescription>Выберите, как вы хотите использовать TalentHub. Дальше откроется единая форма входа и регистрации.</DialogDescription><div className="kt-join-roles">{audiences.map(item => <Button key={item.title} asChild variant="outline"><Link to={`/auth?role=${item.role}`} onClick={() => setJoin(false)} aria-label={`Продолжить как: ${item.title}`}><item.icon />{item.title}<ArrowUpRight /></Link></Button>)}</div></DialogContent></Dialog>
  </>;
}
