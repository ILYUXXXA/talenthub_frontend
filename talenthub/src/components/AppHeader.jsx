import { Link, NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Главная', end: true },
  { to: '/auth', label: 'Вход' },
  { to: '/welcome', label: 'Первый вход' },
  { to: '/events', label: 'Мероприятия' },
  { to: '/school', label: 'Школа' },
  { to: '/admin', label: 'Админ' },
  { to: '/parent', label: 'Родитель' },
]

export default function AppHeader({ children }) {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">TalentHub</Link>
          <nav className="nav">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
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
