import { Link, NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Главная', end: true },
  { to: '/auth', label: 'Войти' },
  { to: '/welcome', label: 'Настройка профиля' },
  { to: '/events', label: 'Мероприятия' },
  { to: '/school', label: 'Школа' },
  { to: '/admin', label: 'Администрирование' },
  { to: '/parent', label: 'Кабинет родителя' },
]

function Brand() {
  return <Link to="/" className="brand-lockup" aria-label="TalentHub — главная"><span className="brand-mark">t.</span><span className="brand-word">Talent<span>Hub</span></span></Link>
}

export default function AppHeader({ children }) {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Brand />
          <nav className="nav" aria-label="Основная навигация">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="demo-strip">Демо MVP. Пароль всех аккаунтов: demo1234</div>
      </header>
      {children}
    </>
  )
}
