import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, registerStudent, listSchools } from '../data/store.js'

const QUICK_ACCESS_PASSWORD = 'demo1234'

const ROLES = [
  { id: 'student', label: 'Войти как школьник', quickEmail: 'alina@demo.by' },
  { id: 'parent', label: 'Войти как родитель', quickEmail: 'olga@demo.by' },
  { id: 'school', label: 'Войти как администрация школы', quickEmail: 'school@demo.by' },
  { id: 'company', label: 'Войти как представитель компании', quickEmail: 'company@demo.by' },
  { id: 'moderator', label: 'Войти как модератор', quickEmail: 'admin@demo.by' },
]

function readSchools() {
  try {
    const list = listSchools()
    if (!Array.isArray(list) || list.length === 0) return []
    const names = list
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object') return item.name || item.title || item.school || ''
        return ''
      })
      .filter(Boolean)
    return names
  } catch {
    return []
  }
}

function userFrom(result) {
  if (!result || result.ok === false) return null
  if (result.role) return result
  if (result.user && result.user.role) return result.user
  return null
}

function pathFor(user) {
  if (!user) return null
  if (user.role === 'student') return user.profileComplete ? '/events' : '/welcome'
  if (user.role === 'parent') return '/parent'
  if (user.role === 'school') return '/school'
  if (user.role === 'moderator') return '/admin'
  if (user.role === 'company') return '/company'
  return null
}

export default function Auth() {
  const navigate = useNavigate()
  const schoolList = readSchools()
  const [role, setRole] = useState('')
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [school, setSchool] = useState(schoolList[0] || '')

  const current = ROLES.find((item) => item.id === role)

  function choose(next) {
    if (busy) return
    setRole(next)
    setMode('login')
    setEmail('')
    setPassword('')
    setError('')
  }

  async function enterAsRole() {
    if (!current?.quickEmail) return
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const user = userFrom(await login(current.quickEmail, QUICK_ACCESS_PASSWORD, role))
      if (!user || user.role !== role) {
        setError('Не удалось открыть профиль выбранной роли.')
        return
      }
      const path = pathFor(user)
      if (!path) {
        setError('Для этой роли вход пока недоступен.')
        return
      }
      navigate(path)
    } catch (error) {
      setError(error.message || 'Не удалось открыть профиль выбранной роли.')
    } finally { setBusy(false) }
  }

  async function onLogin(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const user = userFrom(await login(email.trim(), password, role))
      if (!user || user.role !== role) {
        setError('Неверная почта или пароль для этой роли.')
        return
      }
      const path = pathFor(user)
      if (!path) {
        setError('Для этой роли вход пока не открыт.')
        return
      }
      navigate(path)
    } catch (error) {
      setError(error.message || 'Неверная почта или пароль для этой роли.')
    } finally { setBusy(false) }
  }

  async function onRegister(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const result = await registerStudent({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate,
        email: email.trim(),
        password,
        school: school || schoolList[0] || '',
      })
      if (result && result.ok === false) {
        setError('Не удалось зарегистрироваться. Проверьте данные.')
        return
      }
      navigate('/welcome')
    } catch (error) {
      setError(error.message || 'Не удалось зарегистрироваться. Проверьте данные.')
    } finally { setBusy(false) }
  }

  if (!current) {
    return (
      <main className="auth-page">
        <div className="container narrow auth-container">
          <span className="org-eyebrow">TALENTHUB · ЕДИНАЯ ПЛАТФОРМА</span><h1>Выберите профиль</h1><p className="lead">Перейдите в кабинет своей роли или войдите по данным аккаунта.</p>
          <div className="role-pick">
            {ROLES.map((item) => (
              <button disabled={busy} key={item.id} type="button" className="btn btn-ghost" onClick={() => choose(item.id)}>
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
        <button disabled={busy} type="button" className="btn btn-ghost" onClick={() => choose('')}>К выбору роли</button>
        <h1>{current.label}</h1>
        {mode === 'register' ? (
          <form className="card stack" onSubmit={onRegister}>
            <label className="field">
              <span>Имя</span>
              <input value={firstName} required onChange={(event) => setFirstName(event.target.value)} />
            </label>
            <label className="field">
              <span>Фамилия</span>
              <input value={lastName} required onChange={(event) => setLastName(event.target.value)} />
            </label>
            <label className="field">
              <span>Дата рождения</span>
              <input type="date" value={birthDate} required onChange={(event) => setBirthDate(event.target.value)} />
            </label>
            <label className="field">
              <span>Электронная почта</span>
              <input type="email" value={email} required onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="field">
              <span>Пароль</span>
              <input type="password" value={password} required onChange={(event) => setPassword(event.target.value)} />
            </label>
            <label className="field">
              <span>Школа</span>
              <select value={school || schoolList[0] || ''} onChange={(event) => setSchool(event.target.value)}>
                {schoolList.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            {error ? <p className="notice">{error}</p> : null}
            <button disabled={busy} className="btn btn-primary" type="submit">Зарегистрироваться</button>
            <button disabled={busy} type="button" className="btn btn-ghost" onClick={() => { setMode('login'); setError('') }}>Уже есть аккаунт</button>
          </form>
        ) : (
          <form className="card stack" onSubmit={onLogin}>
            <label className="field">
              <span>Электронная почта</span>
              <input type="email" value={email} autoComplete="username" required onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="field">
              <span>Пароль</span>
              <input type="password" value={password} autoComplete="current-password" required onChange={(event) => setPassword(event.target.value)} />
            </label>
            {error ? <p className="notice">{error}</p> : null}
            <button disabled={busy} className="btn btn-primary" type="submit">Войти</button>
            <button disabled={busy} type="button" className="btn btn-ghost" onClick={enterAsRole}>Войти от имени {role === 'student' ? 'школьника' : role === 'parent' ? 'родителя' : role === 'school' ? 'школы' : role === 'company' ? 'компании' : 'администратора'}</button>
            {role === 'student' ? (
              <button disabled={busy} type="button" className="btn btn-ghost" onClick={() => { setMode('register'); setError('') }}>Создать аккаунт</button>
            ) : null}
          </form>
        )}
      </div>
    </main>
  )
}
