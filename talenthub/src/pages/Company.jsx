import { currentUser } from '../data/store.js'

export default function Company() {
  let user = null
  try {
    user = currentUser()
  } catch {
    user = null
  }
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Представитель компании'
  const org = user?.orgName || 'Компания'

  return (
    <main>
      <div className="container narrow">
        <h1>Кабинет компании</h1>
        <p className="lead">{name}, {org}.</p>
        <p className="muted">Демо-вход: company@demo.by, пароль demo1234.</p>
      </div>
    </main>
  )
}
