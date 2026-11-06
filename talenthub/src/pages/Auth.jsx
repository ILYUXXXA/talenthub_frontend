import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, ApiError, clearSession } from '../api/client.js'

const ROLES = [
  { id: 'student', label: 'Школьник' },
  { id: 'parent', label: 'Родитель' },
  { id: 'school', label: 'Администрация школы' },
  { id: 'company', label: 'Представитель компании' },
  { id: 'moderator', label: 'Модератор' },
]

function pathFor(user) {
  if (user.role === 'student') return user.profile_complete ? '/events' : '/welcome'
  if (user.role === 'parent') return '/parent'
  if (user.role === 'school') return '/school'
  if (user.role === 'company') return '/company'
  if (user.role === 'moderator') return '/admin'
  return null
}

export default function Auth() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [schools, setSchools] = useState([])
  const [schoolId, setSchoolId] = useState('')
  const [busy, setBusy] = useState(false)
  const current = ROLES.find((item) => item.id === role)

  useEffect(() => {
    if (mode !== 'register') return
    api.organizations('school')
      .then((items) => {
        setSchools(items)
        if (items.length) setSchoolId(items[0].id)
      })
      .catch((cause) => setError(cause.message))
  }, [mode])

  function choose(next) {
    setRole(next)
    setMode('login')
    setEmail('')
    setPassword('')
    setError('')
    clearSession()
  }

  async function onLogin(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await api.login(email.trim(), password, role)
      const path = pathFor(user)
      if (!path) {
        clearSession()
        setError('Для этой роли кабинет не настроен.')
        return
      }
      navigate(path)
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Не удалось войти.')
    } finally {
      setBusy(false)
    }
  }

  async function onRegister(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await api.register({
        role: 'student',
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date: birthDate || null,
        email: email.trim(),
        password,
        school_id: schoolId || null,
      })
      navigate(user.profile_complete ? '/events' : '/welcome')
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Не удалось зарегистрироваться.')
    } finally {
      setBusy(false)
    }
  }

  if (!current) {
    return (
      <main className="auth-page">
        <div className="container narrow auth-container">
          <span className="org-eyebrow">TALENTHUB · ЕДИНАЯ ЭКОСИСТЕМА</span>
          <h1>Выберите профиль</h1>
          <p className="lead">Войдите в существующий аккаунт или создайте аккаунт школьника.</p>
          <div className="role-pick">
            {ROLES.map((item) => (
              <button key={item.id} type="button" className="btn btn-ghost" onClick={() => choose(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="container narrow auth-container">
        <button type="button" className="btn btn-ghost" onClick={() => choose('')}>К выбору роли</button>
        <h1>{current.label}</h1>
        {mode === 'register' ? (
          <form className="card stack" onSubmit={onRegister}>
            <label className="field"><span>Имя</span><input value={firstName} required maxLength={100} onChange={(event) => setFirstName(event.target.value)} /></label>
            <label className="field"><span>Фамилия</span><input value={lastName} required maxLength={100} onChange={(event) => setLastName(event.target.value)} /></label>
            <label className="field"><span>Дата рождения</span><input type="date" value={birthDate} required onChange={(event) => setBirthDate(event.target.value)} /></label>
            <label className="field"><span>Электронная почта</span><input type="email" value={email} required onChange={(event) => setEmail(event.target.value)} /></label>
            <label className="field"><span>Пароль (не менее 8 символов)</span><input type="password" value={password} minLength={8} maxLength={128} required onChange={(event) => setPassword(event.target.value)} /></label>
            <label className="field">
              <span>Учреждение образования</span>
              <select value={schoolId} onChange={(event) => setSchoolId(event.target.value)}>
                <option value="">Не выбрано</option>
                {schools.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            {error ? <p className="notice">{error}</p> : null}
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Отправка…' : 'Зарегистрироваться'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setMode('login'); setError('') }}>Уже есть аккаунт</button>
          </form>
        ) : (
          <form className="card stack" onSubmit={onLogin}>
            <label className="field"><span>Электронная почта</span><input type="email" value={email} autoComplete="username" required onChange={(event) => setEmail(event.target.value)} /></label>
            <label className="field"><span>Пароль</span><input type="password" value={password} autoComplete="current-password" required onChange={(event) => setPassword(event.target.value)} /></label>
            {error ? <p className="notice">{error}</p> : null}
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Входим…' : 'Войти'}</button>
            {role === 'student' ? <button type="button" className="btn btn-ghost" onClick={() => { setMode('register'); setError('') }}>Создать аккаунт</button> : null}
          </form>
        )}
      </div>
    </main>
  )
}
