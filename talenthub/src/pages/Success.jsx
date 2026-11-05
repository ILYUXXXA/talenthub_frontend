import { useState } from 'react'
import { studentCabinet } from '../data/store.js'

function names(list) {
  return (list || []).map((item) => (typeof item === 'string' ? item : item.title)).filter(Boolean)
}

export default function Success() {
  const cabinet = useState(() => {
    try {
      return studentCabinet()
    } catch {
      return { demo: true, student: null }
    }
  })[0]
  const student = cabinet.student
  const attended = names(student?.attended)
  const achievements = names(student?.achievements)

  return (
    <main>
      <div className="container">
        <p className="lead">Куда школьник сходил и какие результаты подтверждены.</p>
        {cabinet.demo ? <p className="notice">Показаны демо-успехи.</p> : null}
        {!student ? (
          <p className="muted">Профиль ученика не найден.</p>
        ) : (
          <div className="grid-2">
            <section className="card">
              <h2>Посещения</h2>
              {attended.length === 0 ? <p className="muted">Посещений пока нет.</p> : (
                <ul className="stack">
                  {attended.map((title) => <li key={title}>{title}</li>)}
                </ul>
              )}
            </section>
            <section className="card">
              <h2>Достижения</h2>
              {achievements.length === 0 ? <p className="muted">Подтверждённых достижений пока нет.</p> : (
                <ul className="stack">
                  {achievements.map((title) => <li key={title}>{title}</li>)}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
