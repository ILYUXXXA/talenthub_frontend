import { useState } from 'react';
import {
  schoolStudents,
  listPartnerships,
  sendPartnership,
  respondPartnership,
  publishEvent,
  COMPANIES,
  INTERESTS,
  CITIES,
  GRADES,
} from '../data/store.js';

const SCHOOL = 'Лицей БГУ';

const FALLBACK_INTERESTS = [
  'Математика',
  'Информатика',
  'Физика',
  'Биология',
  'Химия',
  'Робототехника',
  'Проектная работа',
];

const FALLBACK_CITIES = ['Минск', 'Брест', 'Гродно', 'Гомель', 'Витебск', 'Могилёв'];
const FALLBACK_GRADES = ['8', '9', '10', '11'];
const FALLBACK_COMPANIES = ['EPAM Systems', 'IBA Group', 'Wargaming', 'A1', 'Белтелеком'];

const FALLBACK_STUDENTS = [
  {
    id: 'alina',
    name: 'Алина Коваль',
    grade: '10',
    school: SCHOOL,
    interests: ['Математика', 'Информатика'],
    registered: ['Республиканская олимпиада по математике', 'Мастерская робототехники'],
    attended: ['Олимпиада по информатике'],
    achievements: ['Диплом II степени, олимпиада по математике'],
  },
  {
    id: 'ilya',
    name: 'Илья Савич',
    grade: '11',
    school: SCHOOL,
    interests: ['Физика', 'Робототехника'],
    registered: ['Проектная смена «Своими руками»'],
    attended: ['Мастерская робототехники'],
    achievements: ['Призёр хакатона лицея'],
  },
  {
    id: 'maria',
    name: 'Мария Гуд',
    grade: '9',
    school: SCHOOL,
    interests: ['Биология', 'Химия'],
    registered: ['Олимпиада по биологии'],
    attended: [],
    achievements: [],
  },
  {
    id: 'tim',
    name: 'Тимофей Орлов',
    grade: '8',
    school: SCHOOL,
    interests: ['Информатика', 'Проектная работа'],
    registered: ['Мастерская проектной деятельности'],
    attended: ['Городской конкурс проектов'],
    achievements: ['Грамота за проект «Школьный бот»'],
  },
];

const FALLBACK_PARTNERSHIPS = [
  {
    id: 'in-epam',
    status: 'incoming',
    from: 'EPAM Systems',
    to: SCHOOL,
    title: 'Совместная олимпиада по информатике',
    text: 'Предлагаем командный тур в марте и наставников для проектных работ лицея.',
  },
  {
    id: 'in-iba',
    status: 'incoming',
    from: 'IBA Group',
    to: SCHOOL,
    title: 'Мастерская проектной деятельности',
    text: 'Готовы принять 10 лицеистов на практический интенсив: ученики делают работу руками.',
  },
  {
    id: 'out-wg',
    status: 'pending',
    from: SCHOOL,
    to: 'Wargaming',
    title: 'Партнёрская смена по разработке игр',
    text: 'Просим площадку и менторов для проектной смены 11 класса.',
  },
];

const STATUS_ORDER = { incoming: 0, pending: 1, accepted: 2, declined: 3 };

const BADGES = {
  pending: ['badge badge-pending', 'На модерации'],
  incoming: ['badge badge-muted', 'Входящий'],
  accepted: ['badge badge-ok', 'Принят'],
  declined: ['badge badge-no', 'Отклонён'],
};

function labelOf(item) {
  if (item != null && typeof item === 'object') {
    return String(item.label || item.name || item.title || item.id || item.value || '');
  }
  return String(item ?? '');
}

function valueOf(item) {
  if (item != null && typeof item === 'object') {
    return String(item.id ?? item.value ?? item.label ?? item.name ?? '');
  }
  return String(item ?? '');
}

function resolveOptions(source, fallback) {
  try {
    const value = typeof source === 'function' ? source() : source;
    if (Array.isArray(value) && value.length > 0) return value;
  } catch {
    return fallback;
  }
  return fallback;
}

function initialOption(source, fallback, prefer) {
  const list = resolveOptions(source, fallback);
  const want = prefer == null ? '' : String(prefer);
  const found = list.find((item) => {
    const label = labelOf(item);
    const value = valueOf(item);
    return label === want || value === want || (want !== '' && label.startsWith(want));
  });
  return valueOf(found || list[0]);
}

function selectedLabel(list, current) {
  const found = list.find((item) => valueOf(item) === current);
  return found == null ? current : labelOf(found);
}

function asArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.students)) return data.students;
  if (data && Array.isArray(data.partnerships)) return data.partnerships;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.list)) return data.list;
  return [];
}

function pick(source, keys) {
  for (const key of keys) {
    if (source[key] != null && source[key] !== '') return source[key];
  }
  return undefined;
}

function textOf(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => labelOf(item).trim())
      .filter(Boolean)
      .join(', ');
  }
  if (value == null || value === '') return '';
  if (typeof value === 'object') return labelOf(value).trim();
  return String(value).trim();
}

function studentName(source) {
  const direct = textOf(pick(source, ['name', 'fullName', 'student', 'ученик']));
  if (direct) return direct;
  const first = textOf(pick(source, ['firstName', 'first', 'имя']));
  const last = textOf(pick(source, ['lastName', 'last', 'фамилия']));
  return [first, last].filter(Boolean).join(' ');
}

function normalizeStudent(item, index) {
  if (typeof item === 'string' || typeof item === 'number') {
    return {
      id: `${item}-${index}`,
      name: String(item),
      grade: '',
      school: '',
      interests: [],
      registered: [],
      attended: [],
      achievements: [],
    };
  }
  const source = item && typeof item === 'object' ? item : {};
  const name = studentName(source) || 'Ученик';
  return {
    id: source.id != null ? source.id : `${name}-${index}`,
    name,
    grade: textOf(pick(source, ['grade', 'className', 'classLabel', 'gradeLabel', 'класс'])),
    school: textOf(pick(source, ['school', 'schoolName', 'школа'])),
    interests: pick(source, ['interests', 'interest', 'интересы']) ?? [],
    registered: pick(source, ['registered', 'signups', 'enrolled', 'registrations', 'joined', 'planned']) ?? [],
    attended: pick(source, ['attended', 'visits', 'visited', 'went', 'attendance']) ?? [],
    achievements: pick(source, ['achievements', 'awards', 'achievement']) ?? [],
  };
}

function scopeStudents(data) {
  const list = asArray(data).map(normalizeStudent);
  const scoped = list.filter((item) => !item.school || item.school.includes('БГУ') || item.school.includes('Лицей'));
  return scoped.length ? scoped : list;
}

function normalizeStatus(item) {
  const status = String(item.status || item.state || '').toLowerCase();
  if (status === 'approved') return 'accepted';
  if (status === 'rejected') return 'declined';
  if (status === 'moderation' || status === 'outgoing') return 'pending';
  if (status === 'pending' || status === 'incoming' || status === 'accepted' || status === 'declined') return status;
  const direction = String(item.direction || item.type || item.kind || '').toLowerCase();
  if (direction === 'incoming' || direction === 'in') return 'incoming';
  if (direction === 'outgoing' || direction === 'out') return 'pending';
  return 'pending';
}

function normalizePartnership(item, index) {
  const source = item && typeof item === 'object' ? item : {};
  return {
    id: source.id != null ? source.id : `p-${index}`,
    status: normalizeStatus(source),
    from: textOf(pick(source, ['from', 'sender', 'fromName', 'company'])),
    to: textOf(pick(source, ['to', 'recipient', 'toName', 'target'])),
    title: textOf(pick(source, ['title', 'name', 'subject'])) || 'Запрос на партнёрство',
    text: textOf(pick(source, ['text', 'message', 'body', 'description', 'comment'])),
  };
}

function scopePartnerships(data) {
  const list = asArray(data).map(normalizePartnership);
  const scoped = list.filter((item) => {
    if (!item.from && !item.to) return true;
    return item.from.includes('БГУ') || item.to.includes('БГУ') || item.from.includes(SCHOOL) || item.to.includes(SCHOOL);
  });
  const visible = scoped.length ? scoped : list;
  return [...visible].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
}

function loadStudents(tick) {
  void tick;
  try {
    const list = scopeStudents(schoolStudents());
    return list.length ? list : null;
  } catch {
    return null;
  }
}

function loadPartnerships(tick) {
  void tick;
  try {
    const list = scopePartnerships(listPartnerships());
    return list.length ? list : null;
  } catch {
    return null;
  }
}

function Dash({ value }) {
  const text = textOf(value);
  if (!text) return <span className="muted">—</span>;
  return text;
}

function SelectOptions({ list }) {
  return list.map((item, index) => {
    const value = valueOf(item);
    return (
      <option key={`${value}-${index}`} value={value}>
        {labelOf(item)}
      </option>
    );
  });
}

export default function SchoolCabinet() {
  const [version, setVersion] = useState(0);
  const [forceLocal, setForceLocal] = useState(false);
  const [fallbackPartnerships, setFallbackPartnerships] = useState(FALLBACK_PARTNERSHIPS);
  const [statusPatch, setStatusPatch] = useState({});
  const [sentLocally, setSentLocally] = useState([]);
  const [publishNote, setPublishNote] = useState('');
  const [requestNote, setRequestNote] = useState('');

  const interests = resolveOptions(INTERESTS, FALLBACK_INTERESTS);
  const cities = resolveOptions(CITIES, FALLBACK_CITIES);
  const grades = resolveOptions(GRADES, FALLBACK_GRADES);
  const companies = resolveOptions(COMPANIES, FALLBACK_COMPANIES);

  const [title, setTitle] = useState('Олимпиада лицея по математике');
  const [category, setCategory] = useState('olympiad');
  const [interest, setInterest] = useState(() => initialOption(INTERESTS, FALLBACK_INTERESTS, 'Математика'));
  const [grade, setGrade] = useState(() => initialOption(GRADES, FALLBACK_GRADES, '10'));
  const [city, setCity] = useState(() => initialOption(CITIES, FALLBACK_CITIES, 'Минск'));
  const [date, setDate] = useState('2026-04-18');
  const [format, setFormat] = useState('очно');
  const [deadline, setDeadline] = useState('2026-04-01');
  const [seats, setSeats] = useState('32');
  const [description, setDescription] = useState(
    'Очный тур для учеников Лицея БГУ: алгебра и комбинаторика. Карточка уходит администратору и не публикуется сама.',
  );

  const [company, setCompany] = useState(() => initialOption(COMPANIES, FALLBACK_COMPANIES));
  const [requestTitle, setRequestTitle] = useState('Менторы для проектной мастерской');
  const [requestText, setRequestText] = useState(
    'Просим провести практическую мастерскую для 10 класса: ученики делают работу руками.',
  );

  const liveStudents = forceLocal ? null : loadStudents(version);
  const livePartnerships = forceLocal ? null : loadPartnerships(version);
  const students = liveStudents || FALLBACK_STUDENTS;
  const partnershipBase = (livePartnerships || fallbackPartnerships).map((item) => {
    const patched = statusPatch[String(item.id)];
    return patched ? { ...item, status: patched } : item;
  });
  const partnerships = [...partnershipBase, ...sentLocally.filter((item) => !partnershipBase.some((row) => (
    String(row.id) === String(item.id) || (row.title === item.title && row.to === item.to && row.from === item.from)
  )))].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));

  function onPublish(event) {
    event.preventDefault();
    const payload = {
      title: title.trim(),
      category,
      interest: selectedLabel(interests, interest),
      grade: selectedLabel(grades, grade),
      city: selectedLabel(cities, city),
      date,
      format,
      deadline,
      seats: Number(seats) || 0,
      description: description.trim(),
      organizer: SCHOOL,
    };
    if (!payload.title || !payload.description) return;
    try {
      publishEvent(payload);
      setVersion((value) => value + 1);
    } catch (error) {
      void error;
    }
    setPublishNote('Отправлено на модерацию');
  }

  function onRespond(id, status) {
    const next = partnerships.map((item) => (String(item.id) === String(id) ? { ...item, status } : item));
    setStatusPatch((prev) => ({ ...prev, [String(id)]: status }));
    try {
      respondPartnership(id, status);
      setFallbackPartnerships(next);
      setVersion((value) => value + 1);
    } catch {
      setForceLocal(true);
      setFallbackPartnerships(next);
    }
  }

  function onSend(event) {
    event.preventDefault();
    const payload = {
      from: SCHOOL,
      to: selectedLabel(companies, company),
      title: requestTitle.trim(),
      text: requestText.trim(),
    };
    if (!payload.to || !payload.title || !payload.text) return;
    const created = { id: `local-${Date.now()}`, ...payload, status: 'pending' };
    try {
      sendPartnership({ from: payload.from, to: payload.to, title: payload.title, text: payload.text });
      setSentLocally((prev) => [...prev, created]);
      setFallbackPartnerships([...partnerships, created]);
      setVersion((value) => value + 1);
    } catch {
      setForceLocal(true);
      setFallbackPartnerships([...partnerships, created]);
    }
    setRequestNote('Заявка отправлена');
    setRequestTitle('');
    setRequestText('');
  }

  return (
    <main>
      <div className="container">
        <div className="stack">
          <header>
            <h1>Кабинет школы</h1>
            <p className="muted">Елена Брик, представитель Лицея БГУ. Демо: school@demo.by</p>
          </header>

          <section className="card stack">
            <h2 className="card-title">Опубликовать мероприятие</h2>
            <p className="muted">Организатор — Лицей БГУ. После отправки мероприятие ждёт модерации администратора.</p>
            <form className="stack" onSubmit={onPublish}>
              <div className="grid-2">
                <label className="field">
                  <span>Название</span>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
                <label className="field">
                  <span>Категория</span>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="olympiad">Олимпиада</option>
                    <option value="project">Проектная деятельность</option>
                  </select>
                </label>
                <label className="field">
                  <span>Интерес</span>
                  <select value={interest} onChange={(e) => setInterest(e.target.value)}>
                    <SelectOptions list={interests} />
                  </select>
                </label>
                <label className="field">
                  <span>Класс</span>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                    <SelectOptions list={grades} />
                  </select>
                </label>
                <label className="field">
                  <span>Город</span>
                  <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <SelectOptions list={cities} />
                  </select>
                </label>
                <label className="field">
                  <span>Дата</span>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </label>
                <label className="field">
                  <span>Формат</span>
                  <select value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option value="очно">очно</option>
                    <option value="онлайн">онлайн</option>
                    <option value="смешанный">смешанный</option>
                  </select>
                </label>
                <label className="field">
                  <span>Дедлайн</span>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                </label>
                <label className="field">
                  <span>Мест</span>
                  <input type="number" min="1" value={seats} onChange={(e) => setSeats(e.target.value)} required />
                </label>
              </div>
              <label className="field">
                <span>Короткое описание</span>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
              </label>
              {publishNote ? <p className="notice">{publishNote}</p> : null}
              <div className="row">
                <button className="btn btn-primary" type="submit">Отправить на модерацию</button>
              </div>
            </form>
          </section>

          <section className="card stack">
            <h2 className="card-title">Успехи учеников</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ученик</th>
                    <th>Класс</th>
                    <th>Интересы</th>
                    <th>Куда записался</th>
                    <th>Куда сходил</th>
                    <th>Достижения</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name || <span className="muted">—</span>}</td>
                      <td>{student.grade || <span className="muted">—</span>}</td>
                      <td><Dash value={student.interests} /></td>
                      <td><Dash value={student.registered} /></td>
                      <td><Dash value={student.attended} /></td>
                      <td><Dash value={student.achievements} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card stack">
            <h2 className="card-title">Партнёрство</h2>
            <div className="stack">
              {partnerships.map((item) => {
                const badge = BADGES[item.status] || BADGES.pending;
                return (
                  <article className="stack" key={item.id}>
                    <div className="row spread">
                      <strong>{item.title}</strong>
                      <span className={badge[0]}>{badge[1]}</span>
                    </div>
                    <p className="muted">{[item.from, item.to].filter(Boolean).join(' → ') || <span className="muted">—</span>}</p>
                    <p>{item.text ? item.text : <span className="muted">—</span>}</p>
                    {item.status === 'incoming' ? (
                      <div className="row">
                        <button className="btn btn-small btn-primary" type="button" onClick={() => onRespond(item.id, 'accepted')}>
                          Принять
                        </button>
                        <button className="btn btn-small btn-danger" type="button" onClick={() => onRespond(item.id, 'declined')}>
                          Отклонить
                        </button>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <form className="stack" onSubmit={onSend}>
              <p className="muted">Новый исходящий запрос от Лицея БГУ</p>
              <div className="grid-2">
                <label className="field">
                  <span>Компания</span>
                  <select value={company} onChange={(e) => setCompany(e.target.value)}>
                    <SelectOptions list={companies} />
                  </select>
                </label>
                <label className="field">
                  <span>Тема</span>
                  <input value={requestTitle} onChange={(e) => setRequestTitle(e.target.value)} required />
                </label>
              </div>
              <label className="field">
                <span>Короткий текст</span>
                <textarea rows={3} value={requestText} onChange={(e) => setRequestText(e.target.value)} required />
              </label>
              {requestNote ? <p className="notice">{requestNote}</p> : null}
              <div className="row">
                <button className="btn btn-primary" type="submit">Отправить запрос</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
