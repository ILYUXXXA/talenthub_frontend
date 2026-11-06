import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listUpcoming, completeProfile, GRADES, CITIES, INTERESTS } from '../data/store.js';

const FALLBACK_UPCOMING = [
  {
    title: 'Республиканская олимпиада по математике',
    date: '12 марта 2026',
    city: 'Минск',
    category: 'olympiad',
    categoryLabel: 'Олимпиада',
  },
  {
    title: 'Олимпиада по информатике',
    date: '4 апреля 2026',
    city: 'Гродно',
    category: 'olympiad',
    categoryLabel: 'Олимпиада',
  },
  {
    title: 'Мастерская робототехники',
    date: '18 апреля 2026',
    city: 'Брест',
    category: 'project',
    categoryLabel: 'Проектная деятельность',
  },
  {
    title: 'Проектная смена «Своими руками»',
    date: '22 июня 2026',
    city: 'Гомель',
    category: 'project',
    categoryLabel: 'Проектная деятельность',
  },
];

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

function loadUpcoming() {
  try {
    const live = listUpcoming();
    if (Array.isArray(live) && live.some((event) => event && event.title)) return live;
  } catch {
    /* dimmed list still has to show */
  }
  return FALLBACK_UPCOMING;
}

export default function FirstLogin() {
  const navigate = useNavigate();
  const [upcoming] = useState(loadUpcoming);
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

  function onSubmit(event) {
    event.preventDefault();
    if (!grade || !city || selected.length < 1) {
      setError('Выберите класс, город и хотя бы один интерес.');
      return;
    }
    const gradeItem = grades.find((item) => valueOf(item) === grade);
    const cityItem = cities.find((item) => valueOf(item) === city);
    const picked = interests.filter((item) => selected.includes(valueOf(item))).map(storedValue);
    try {
      completeProfile({
        grade: gradeItem == null ? grade : storedValue(gradeItem),
        city: cityItem == null ? city : storedValue(cityItem),
        interests: picked,
      });
    } catch {
      setError('Не удалось сохранить профиль.');
      return;
    }
    navigate('/events');
  }

  return (
    <main>
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
            <p className="muted">Демо первого входа: mark@demo.by, Марк Левин. Базовая регистрация уже пройдена.</p>
          </form>
        </div>
      </div>
    </main>
  );
}
