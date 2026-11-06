import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

const GRADES = [7, 8, 9, 10, 11];
const CITIES = ['Минск', 'Брест', 'Гродно', 'Гомель', 'Витебск', 'Могилёв'];
const INTERESTS = ['Математика', 'Информатика', 'Физика', 'Биология', 'Химия', 'Робототехника', 'Проектная работа'];

const FALLBACK_GRADES = [7, 8, 9, 10, 11];
const FALLBACK_CITIES = ['Минск', 'Брест', 'Гродно', 'Гомель', 'Витебск', 'Могилёв'];
const FALLBACK_INTERESTS = [
  'Математика',
  'Информатика',
  'Физика',
  'Биология',
  'Химия',
  'Робототехника',
  'Проектная работа',
];

function labelOf(item) {
  if (item != null && typeof item === 'object') {
    return String(item.label || item.name || item.title || item.id || item.value || '');
  }
  return String(item);
}

function valueOf(item) {
  if (item != null && typeof item === 'object') {
    return String(item.id ?? item.value ?? item.label ?? item.name ?? '');
  }
  return String(item);
}

function storedValue(item) {
  if (item != null && typeof item === 'object') {
    if (item.id != null) return item.id;
    if (item.value != null) return item.value;
    return item.label || item.name;
  }
  return item;
}

function listOr(source, fallback) {
  try {
    if (Array.isArray(source) && source.length > 0) return source;
  } catch {
    /* keep the screen filled */
  }
  return fallback;
}


export default function FirstLogin() {
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  useEffect(() => {
    Promise.all([api.events({ upcoming: true }), api.reference()])
      .then(([events, reference]) => {
        setUpcoming(events.map((item) => ({ ...item, date: item.date, categoryLabel: item.category === 'project' ? 'Проектная деятельность' : 'Олимпиада' })));
      })
      .catch(() => setUpcoming([]))
      .finally(() => setLoadingEvents(false));
  }, []);
  const grades = listOr(GRADES, FALLBACK_GRADES);
  const cities = listOr(CITIES, FALLBACK_CITIES);
  const interests = listOr(INTERESTS, FALLBACK_INTERESTS);
  const [grade, setGrade] = useState('');
  const [city, setCity] = useState('');
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');

  function toggle(value) {
    setSelected((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!grade || !city || selected.length < 1) {
      setError('Выберите класс, город и хотя бы один интерес.');
      return;
    }
    const gradeItem = grades.find((item) => valueOf(item) === grade);
    const cityItem = cities.find((item) => valueOf(item) === city);
    const picked = interests.filter((item) => selected.includes(valueOf(item))).map(storedValue);
    try {
      await api.updateProfile({
        grade: Number(gradeItem == null ? grade : storedValue(gradeItem)),
        city: cityItem == null ? city : storedValue(cityItem),
        interests: picked,
      });
      navigate('/events');
    } catch (cause) {
      setError(cause.message || 'Не удалось сохранить профиль.');
    }
  }

  return (
    <main className="student-workspace">
      <div className="container">
        <div className="dim-wrap">
          <div className="dimmed">
            <div className="grid-2">
              {upcoming.map((event, index) => (
                <article className="card" key={`${event.title}-${event.date}-${index}`}>
                  <h2 className="card-title">{event.title}</h2>
                  <p className="muted">
                    {event.date}
                    {event.city ? ` · ${event.city}` : ''}
                  </p>
                  <span className="badge badge-muted">
                    {event.category === 'project' ? 'Проектная деятельность' : 'Олимпиада'}
                  </span>
                </article>
              ))}
              {loadingEvents ? <p className="muted">Загружаем мероприятия…</p> : null}
            </div>
          </div>
          <form className="modal-card" onSubmit={onSubmit}>
            <h1 className="title" style={{ fontSize: 28 }}>Заполните профиль</h1>
            <p className="lead" style={{ fontSize: 16 }}>
              Класс, город и интересы нужны, чтобы показать подходящие мероприятия. Список событий сзади приглушён.
            </p>
            <label className="field">
              <span>Класс</span>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} required>
                <option value="">Выберите класс</option>
                {grades.map((item) => (
                  <option key={valueOf(item)} value={valueOf(item)}>{labelOf(item)}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Город</span>
              <select value={city} onChange={(e) => setCity(e.target.value)} required>
                <option value="">Выберите город</option>
                {cities.map((item) => (
                  <option key={valueOf(item)} value={valueOf(item)}>{labelOf(item)}</option>
                ))}
              </select>
            </label>
            <div>
              <span className="muted">Интересы</span>
              <div className="row">
                {interests.map((item) => {
                  const value = valueOf(item);
                  const active = selected.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      className={active ? 'chip active' : 'chip'}
                      onClick={() => toggle(value)}
                    >
                      {labelOf(item)}
                    </button>
                  );
                })}
              </div>
            </div>
            {error ? <p className="notice">{error}</p> : null}
            <button className="btn btn-primary" type="submit">Показать мероприятия</button>
            
          </form>
        </div>
      </div>
    </main>
  );
}
