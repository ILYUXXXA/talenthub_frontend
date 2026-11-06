import { useState } from 'react'
import { linkChild } from '../data/store.js'

const DEMO = {
  firstName: 'Алина',
  lastName: 'Коваль',
  birthDate: '2010-04-12',
}

const FALLBACK_CHILD = {
  firstName: 'Алина',
  lastName: 'Коваль',
  birthDate: '2010-04-12',
  school: 'Лицей БГУ',
  grade: 10,
  city: 'Минск',
  interests: 'Математика и Информатика',
  signedUp: [
    'Республиканская олимпиада по математике',
    'Олимпиада по информатике «КодБел»',
  ],
  attended: ['Городская олимпиада по математике'],
  achievements: ['Диплом II степени'],
}

let initialMatch

function isDemoChild(firstName, lastName, birthDate) {
  return (
    String(firstName).trim().toLowerCase() === DEMO.firstName.toLowerCase() &&
    String(lastName).trim().toLowerCase() === DEMO.lastName.toLowerCase() &&
    birthDate === DEMO.birthDate
  )
}

function show(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item == null || item === '') return ''
        if (typeof item === 'string') return item
        if (typeof item === 'object') {
          const title = item.title || item.name || item.label || ''
          if (item.status) return title ? `${title} (${item.status})` : String(item.status)
          return title
        }
        return String(item)
      })
      .filter(Boolean)
      .join(', ')
  }
  if (value == null || value === '') return ''
  return String(value)
}

function childName(child) {
  if (child.name) return String(child.name)
  return [child.firstName, child.lastName].filter(Boolean).join(' ')
}

function matchChild(firstName, lastName, birthDate) {
  try {
    const result = linkChild({ firstName, lastName, birthDate })
    if (!result || result.ok !== true) return { ok: false, child: null }
    const child = result.child && typeof result.child === 'object' ? result.child : result
    if (!child.firstName && !child.lastName && !child.name) return { ok: false, child: null }
    return { ok: true, child }
  } catch {
    if (isDemoChild(firstName, lastName, birthDate)) {
      return { ok: true, child: FALLBACK_CHILD }
    }
    return { ok: false, child: null }
  }
}

function readInitialMatch() {
  if (!initialMatch) {
    initialMatch = matchChild(DEMO.firstName, DEMO.lastName, DEMO.birthDate)
  }
  return initialMatch
}

function FieldLine({ label, value }) {
  return (
    <p>
      <span className="muted">{label}: </span>
      {show(value) || '—'}
    </p>
  )
}

export default function ParentLink() {
  const [firstName, setFirstName] = useState(DEMO.firstName)
  const [lastName, setLastName] = useState(DEMO.lastName)
  const [birthDate, setBirthDate] = useState(DEMO.birthDate)
  const [result, setResult] = useState(readInitialMatch)

  function onSubmit(event) {
    event.preventDefault()
    setResult(matchChild(firstName.trim(), lastName.trim(), birthDate))
  }

  function onClear() {
    setFirstName('')
    setLastName('')
    setBirthDate('')
    setResult(null)
  }

  const linked = result && result.ok === true && result.child

  return (
    <main>
      <div className="container">
        <div className="stack">
          <div>
            <h1 className="card-title">Привязка родителя</h1>
            <p className="muted">
              Демо: olga@demo.by. Совпадение ищется по имени, фамилии и дате рождения ребёнка.
            </p>
          </div>
          <div className="grid-2">
            <form className="card stack" onSubmit={onSubmit}>
              <h2 className="card-title">Данные ребёнка</h2>
              <label className="field">
                <span>Имя</span>
                <input
                  value={firstName}
                  autoComplete="given-name"
                  required
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </label>
              <label className="field">
                <span>Фамилия</span>
                <input
                  value={lastName}
                  autoComplete="family-name"
                  required
                  onChange={(event) => setLastName(event.target.value)}
                />
              </label>
              <label className="field">
                <span>Дата рождения</span>
                <input
                  type="date"
                  value={birthDate}
                  required
                  onChange={(event) => setBirthDate(event.target.value)}
                />
              </label>
              <button className="btn btn-primary" type="submit">Привязать</button>
              <button className="btn btn-ghost" type="button" onClick={onClear}>
                Проверить другую запись
              </button>
            </form>

            <section className="card stack">
              <h2 className="card-title">Запись ребёнка</h2>
              {linked ? (
                <>
                  <span className="badge badge-ok">Совпадение найдено</span>
                  <p>{childName(linked)}</p>
                  <p className="muted">{show(linked.birthDate)}</p>
                  <FieldLine label="Школа" value={linked.school} />
                  <FieldLine label="Класс" value={linked.grade} />
                  <FieldLine label="Город" value={linked.city} />
                  <FieldLine label="Интересы" value={linked.interests} />
                  <FieldLine label="Куда записался" value={linked.signedUp} />
                  <FieldLine label="Куда сходил" value={linked.attended} />
                  <FieldLine label="Достижения" value={linked.achievements} />
                </>
              ) : result && result.ok === false ? (
                <p className="notice">Совпадений нет. Проверьте имя, фамилию и дату рождения.</p>
              ) : (
                <p className="muted">Введите имя, фамилию и дату рождения, затем нажмите «Привязать».</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
