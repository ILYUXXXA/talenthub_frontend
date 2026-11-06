import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GRADES, INTERESTS } from '../data/store.js'
import { api, clearSession } from '../api/client.js'

function formatDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value || '—'
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [schools, setSchools] = useState([])
  const [grade, setGrade] = useState('')
  const [interests, setInterests] = useState([])
  const [schoolDraft, setSchoolDraft] = useState('')
  const [schoolOpen, setSchoolOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([api.me(), api.profile(), api.organizations('school')])
      .then(([account, student, schoolList]) => {
        setUser(account)
        setProfile(student)
        setGrade(student.grade == null ? '' : String(student.grade))
        setInterests(student.interests || [])
        setSchoolDraft(student.school?.id || '')
        setSchools(schoolList)
      })
      .catch((cause) => {
        setMessage(cause.message || 'Не удалось загрузить профиль.')
        if (cause.status === 401) navigate('/auth')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const profileName = [user?.first_name || profile?.first_name, user?.last_name || profile?.last_name].filter(Boolean).join(' ')
  const query = draft.trim().toLowerCase()
  const suggestions = query ? INTERESTS.filter((name) => name.toLowerCase().includes(query) && !interests.includes(name)) : []

  function addInterest(value = draft) {
    const name = String(value).trim()
    if (name && !interests.some((item) => item.toLowerCase() === name.toLowerCase())) setInterests((prev) => [...prev, name])
    setDraft('')
  }

  async function onSave(event) {
    event.preventDefault()
    if (!interests.length) {
      setMessage('Добавьте хотя бы один интерес: по ним фильтруются мероприятия.')
      return
    }
    setSaving(true)
    try {
      const saved = await api.updateProfile({ grade: grade ? Number(grade) : null, interests })
      setProfile(saved)
      setMessage('Настройки профиля сохранены.')
    } catch (cause) {
      setMessage(cause.message || 'Не удалось сохранить профиль.')
    } finally {
      setSaving(false)
    }
  }

  async function onChangeSchool() {
    setSaving(true)
    try {
      const saved = await api.updateProfile({ school_id: schoolDraft || null })
      setProfile(saved)
      setSchoolOpen(false)
      setMessage('Учреждение образования обновлено.')
    } catch (cause) {
      setMessage(cause.message || 'Не удалось изменить учреждение.')
    } finally {
      setSaving(false)
    }
  }

  function onLogout() {
    clearSession()
    navigate('/auth')
  }

  return (
    <main className="student-workspace">
      <div className="container">
        {loading ? <p className="muted">Загружаем профиль…</p> : null}
        <div className="grid-2">
          <section className="card">
            <h1>{profileName || 'Школьник'}</h1>
            {!user || !profile ? <p className="muted">Профиль не найден. <Link to="/auth">Войти</Link></p> : (
              <dl className="profile-facts">
                <div><dt>Дата рождения</dt><dd>{formatDate(profile.birth_date)}</dd></div>
                <div><dt>Почта</dt><dd>{user.email || '—'}</dd></div>
                <div><dt>Школа</dt><dd>{profile.school?.name || '—'}</dd></div>
                <div><dt>Город</dt><dd>{profile.city || '—'}</dd></div>
              </dl>
            )}
            <button type="button" className="btn btn-ghost profile-switch" onClick={() => setSchoolOpen((open) => !open)}>Сменить учреждение образования</button>
            {schoolOpen ? (
              <div className="field profile-school">
                <select value={schoolDraft} onChange={(event) => setSchoolDraft(event.target.value)}>
                  <option value="">Не выбрано</option>
                  {schools.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <button type="button" className="btn btn-primary" disabled={saving} onClick={onChangeSchool}>Сохранить изменения</button>
              </div>
            ) : null}
          </section>
          <form id="profile-form" className="card" onSubmit={onSave}>
            <h2>Настройки</h2>
            <p className="muted">Класс и интересы. Имя, дата рождения, почта, школа и город здесь не меняются.</p>
            <label className="field">
              <span>Класс</span>
              <select value={grade} onChange={(event) => setGrade(event.target.value)} disabled={!profile}>
                <option value="">Не выбран</option>
                {GRADES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <div className="field">
              <span>Интересы</span>
              {interests.length ? (
                <div className="chips">{interests.map((name) => (
                  <span key={name} className="chip interest-chip">{name}
                    <button type="button" className="chip-remove" aria-label={`Убрать ${name}`} onClick={() => setInterests((prev) => prev.filter((item) => item !== name))}>×</button>
                  </span>
                ))}</div>
              ) : <p className="muted">Пока ничего не добавлено.</p>}
              <div className="interest-add">
                <input type="text" value={draft} placeholder="Введите интерес" role="combobox" aria-autocomplete="list" aria-expanded={suggestions.length > 0} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addInterest() } }} />
                <button type="button" className="btn btn-ghost" onClick={() => addInterest()}>Добавить</button>
              </div>
              {suggestions.length ? <ul className="suggest" role="listbox">{suggestions.map((name) => <li key={name}><button type="button" onClick={() => addInterest(name)}>{name}</button></li>)}</ul> : null}
            </div>
            {message ? <p className="notice">{message}</p> : null}
            <div className="profile-actions">
              <button type="submit" className="btn btn-primary" disabled={saving || !profile}>{saving ? 'Сохраняем…' : 'Сохранить профиль'}</button>
              <button type="button" className="btn btn-ghost" onClick={onLogout}>Выйти</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
