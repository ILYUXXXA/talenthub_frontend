import { NavLink } from 'react-router-dom'

export default function OrganizationShell({ tabs, activeTab, onTabChange, children }) {
  return (
    <>
      <header className="header student-header">
        <div className="header-inner">
          <NavLink to="/" className="logo">TalentHub</NavLink>
          <nav className="nav student-tabs org-shell-tabs" aria-label="Разделы кабинета">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={activeTab === id ? 'active' : ''}
                aria-current={activeTab === id ? 'page' : undefined}
                onClick={() => onTabChange(id)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </>
  )
}
