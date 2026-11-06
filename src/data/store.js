const KEY = 'talenthub-db'
const VERSION = 1
const TODAY = '2026-11-06'

export const INTERESTS = ['Математика', 'Информатика', 'Физика', 'Биология', 'Химия', 'Робототехника', 'Проектная работа']
export const CITIES = ['Минск', 'Брест', 'Гродно', 'Гомель', 'Витебск', 'Могилёв']
export const GRADES = ['7', '8', '9', '10', '11']
export const COMPANIES = ['КодМастер', 'РобоЛаб', 'ХимПрактикум', 'НаноСофт']

const SCHOOLS = ['Лицей БГУ', 'Гимназия №1 Минск', 'СШ №4 Гродно', 'Гимназия №2 Брест']

const memory = { raw: null }

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function signupLabel(item) {
  if (item == null || item === '') return ''
  if (typeof item === 'string') return item
  const title = item.title || item.name || ''
  return item.status ? `${title} (${item.status})` : String(title)
}

function presentStudent(student) {
  if (!student) return null
  const copy = clone(student)
  copy.name = [copy.firstName, copy.lastName].filter(Boolean).join(' ')
  copy.registered = (copy.signedUp || []).map(signupLabel).filter(Boolean)
  return copy
}

function norm(value) {
  return String(value ?? '').trim().toLowerCase()
}

function nextId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function readRaw() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return memory.raw
  }
}

function writeRaw(raw) {
  memory.raw = raw
  try {
    localStorage.setItem(KEY, raw)
  } catch {
    /* demo keeps working in memory */
  }
}

function event(fields) {
  return {
    projectKind: '',
    interests: [],
    description: '',
    place: '',
    format: 'очно',
    terms: '',
    deadline: '',
    seats: 0,
    status: 'published',
    ...fields,
  }
}

function demoNotifications() {
  return [
    {
      id: 'n1',
      studentId: 's1',
      type: 'confirmation',
      title: 'Заявка подтверждена',
      body: 'Лицей БГУ подтвердил заявку на «Республиканскую олимпиаду по математике».',
      date: '2026-11-05',
      read: false,
    },
    {
      id: 'n2',
      studentId: 's1',
      type: 'deadline',
      title: 'Напоминание о дедлайне',
      body: 'Регистрация на олимпиаду по информатике «КодБел» закрывается 25 ноября.',
      date: '2026-11-06',
      read: false,
    },
    {
      id: 'n6',
      studentId: 's1',
      type: 'interest',
      title: 'Новое мероприятие по интересам',
      body: 'По математике открыта запись на «Открытую олимпиаду по физике и математике».',
      date: '2026-11-02',
      read: false,
    },
    {
      id: 'n5',
      studentId: 's1',
      type: 'invite',
      title: 'Приглашение на мероприятие',
      body: 'КодМастер приглашает на олимпиаду по информатике для 7–8 классов.',
      date: '2026-11-01',
      read: true,
    },
  ]
}

function seed() {
  return {
    version: VERSION,
    sessionUserId: null,
    users: [
      {
        id: 'u-alina',
        email: 'alina@demo.by',
        password: 'demo1234',
        role: 'student',
        firstName: 'Алина',
        lastName: 'Коваль',
        birthDate: '2010-04-12',
        school: 'Лицей БГУ',
        grade: '10',
        city: 'Минск',
        interests: ['Математика', 'Информатика'],
        profileComplete: true,
        catalogId: 's1',
      },
      {
        id: 'u-mark',
        email: 'mark@demo.by',
        password: 'demo1234',
        role: 'student',
        firstName: 'Марк',
        lastName: 'Левин',
        birthDate: '2011-09-03',
        school: 'Гимназия №1 Минск',
        grade: '',
        city: '',
        interests: [],
        profileComplete: false,
        catalogId: 's5',
      },
      {
        id: 'u-olga',
        email: 'olga@demo.by',
        password: 'demo1234',
        role: 'parent',
        firstName: 'Ольга',
        lastName: 'Коваль',
        childId: null,
      },
      {
        id: 'u-school',
        email: 'school@demo.by',
        password: 'demo1234',
        role: 'school',
        firstName: 'Елена',
        lastName: 'Брик',
        orgName: 'Лицей БГУ',
      },
      {
        id: 'u-admin',
        email: 'admin@demo.by',
        password: 'demo1234',
        role: 'admin',
        firstName: 'Админ',
        lastName: 'TalentHub',
      },
      {
        id: 'u-company',
        email: 'company@demo.by',
        password: 'demo1234',
        role: 'company',
        firstName: 'Павел',
        lastName: 'Мороз',
        orgName: 'КодМастер',
      },
    ],
    students: [
      {
        id: 's1',
        firstName: 'Алина',
        lastName: 'Коваль',
        birthDate: '2010-04-12',
        school: 'Лицей БГУ',
        grade: '10',
        city: 'Минск',
        interests: ['Математика', 'Информатика'],
        signedUp: [
          { title: 'Республиканская олимпиада по математике', status: 'подтверждена', eventId: 'e1' },
          { title: 'Олимпиада по информатике «КодБел»', status: 'подана', eventId: 'e2' },
        ],
        attended: [{ title: 'Городская олимпиада по математике', eventId: 'e6' }],
        achievements: [{ title: 'Диплом II степени, городская олимпиада по математике', status: 'confirmed' }],
      },
      {
        id: 's2',
        firstName: 'Илья',
        lastName: 'Савич',
        birthDate: '2009-02-11',
        school: 'Лицей БГУ',
        grade: '11',
        city: 'Минск',
        interests: ['Физика'],
        signedUp: [{ title: 'Областная олимпиада по физике', status: 'подана', eventId: 'e3' }],
        attended: [{ title: 'Проектная смена «Физическая лаборатория»', eventId: 'e12' }],
        achievements: [{ title: 'Сертификат участника смены', status: 'confirmed' }],
      },
      {
        id: 's3',
        firstName: 'Мария',
        lastName: 'Гуд',
        birthDate: '2011-06-19',
        school: 'Лицей БГУ',
        grade: '9',
        city: 'Минск',
        interests: ['Биология'],
        signedUp: [{ title: 'Биологическая интернет-олимпиада', status: 'подана', eventId: 'e4' }],
        attended: [],
        achievements: [],
      },
      {
        id: 's4',
        firstName: 'Тимофей',
        lastName: 'Орлов',
        birthDate: '2010-12-01',
        school: 'Лицей БГУ',
        grade: '10',
        city: 'Минск',
        interests: ['Робототехника'],
        signedUp: [{ title: 'Мастерская роботов', status: 'подана', eventId: 'e11' }],
        attended: [{ title: 'Смена «Инженерные каникулы»', eventId: 'e9' }],
        achievements: [],
      },
      {
        id: 's5',
        firstName: 'Марк',
        lastName: 'Левин',
        birthDate: '2011-09-03',
        school: 'Гимназия №1 Минск',
        grade: '',
        city: '',
        interests: [],
        signedUp: [],
        attended: [],
        achievements: [],
      },
    ],
    events: [
      event({
        id: 'e1',
        title: 'Республиканская олимпиада по математике',
        category: 'olympiad',
        interests: ['Математика'],
        organizer: 'Лицей БГУ',
        description: 'Письменный тур республиканской олимпиады по математике для 10–11 классов.',
        grade: '10–11',
        date: '2026-11-20',
        city: 'Минск',
        place: 'Лицей БГУ, актовый зал',
        format: 'очно',
        terms: 'Паспорт и справка из школы.',
        deadline: '2026-11-12',
        seats: 80,
      }),
      event({
        id: 'e2',
        title: 'Олимпиада по информатике «КодБел»',
        category: 'olympiad',
        interests: ['Информатика'],
        organizer: 'КодМастер',
        description: 'Онлайн-олимпиада по алгоритмам и программированию для 9–11 классов.',
        grade: '9–11',
        date: '2026-12-02',
        city: 'Онлайн',
        place: 'Платформа КодМастер',
        format: 'онлайн',
        terms: 'Нужен компьютер и доступ к платформе в день тура.',
        deadline: '2026-11-25',
        seats: 200,
      }),
      event({
        id: 'e3',
        title: 'Областная олимпиада по физике',
        category: 'olympiad',
        interests: ['Физика'],
        organizer: 'Лицей БГУ',
        description: 'Областной очный тур по физике для учащихся 8–11 классов.',
        grade: '8–11',
        date: '2026-11-28',
        city: 'Минск',
        place: 'Лицей БГУ, кабинет физики',
        format: 'очно',
        terms: 'Письменный тур без калькулятора.',
        deadline: '2026-11-18',
        seats: 60,
      }),
      event({
        id: 'e4',
        title: 'Биологическая интернет-олимпиада',
        category: 'olympiad',
        interests: ['Биология'],
        organizer: 'Академия биологии',
        description: 'Дистанционная олимпиада по биологии для школьников 7–11 классов.',
        grade: '7–11',
        date: '2026-12-15',
        city: 'Онлайн',
        place: 'Сайт Академии биологии',
        format: 'онлайн',
        terms: 'Регистрация на сайте и самостоятельный онлайн-тур.',
        deadline: '2026-12-01',
        seats: 300,
      }),
      event({
        id: 'e5',
        title: 'Олимпиада «Юный химик»',
        category: 'olympiad',
        interests: ['Химия'],
        organizer: 'ХимПрактикум',
        description: 'Очная олимпиада по химии для учащихся 9–10 классов.',
        grade: '9–10',
        date: '2026-11-18',
        city: 'Гродно',
        place: 'ХимПрактикум, лаборатория',
        format: 'очно',
        terms: 'Очный письменный и практический тур.',
        deadline: '2026-11-10',
        seats: 40,
      }),
      event({
        id: 'e6',
        title: 'Городская олимпиада по математике',
        category: 'olympiad',
        interests: ['Математика'],
        organizer: 'Гимназия №2 Брест',
        description: 'Городской очный тур по математике для 8–9 классов.',
        grade: '8–9',
        date: '2026-11-25',
        city: 'Брест',
        place: 'Гимназия №2 Брест',
        format: 'очно',
        terms: 'Справка из школы и паспорт.',
        deadline: '2026-11-15',
        seats: 50,
      }),
      event({
        id: 'e7',
        title: 'Олимпиада по информатике для 7–8 классов',
        category: 'olympiad',
        interests: ['Информатика'],
        organizer: 'КодМастер',
        description: 'Очный тур по информатике для учеников 7–8 классов.',
        grade: '7–8',
        date: '2026-12-05',
        city: 'Гомель',
        place: 'Площадка КодМастер в Гомеле',
        format: 'очно',
        terms: 'Очный тур в компьютерном классе.',
        deadline: '2026-11-28',
        seats: 70,
      }),
      event({
        id: 'e8',
        title: 'Открытая олимпиада по физике и математике',
        category: 'olympiad',
        interests: ['Физика', 'Математика'],
        organizer: 'Лицей БГУ',
        description: 'Совместный очный тур по физике и математике для 10–11 классов.',
        grade: '10–11',
        date: '2026-12-10',
        city: 'Минск',
        place: 'Лицей БГУ',
        format: 'очно',
        terms: 'Два письменных тура в один день.',
        deadline: '2026-12-01',
        seats: 90,
      }),
      event({
        id: 'e9',
        title: 'Смена «Инженерные каникулы»',
        category: 'project',
        projectKind: 'смена',
        interests: ['Информатика', 'Робототехника'],
        organizer: 'НаноСофт',
        description: 'Короткая смена, где школьники собирают и программируют устройства.',
        grade: '8–11',
        date: '2026-11-30',
        city: 'Минск',
        place: 'НаноСофт, учебный класс',
        format: 'очно',
        terms: 'Согласие родителей, смена идёт несколько дней.',
        deadline: '2026-11-20',
        seats: 24,
      }),
      event({
        id: 'e10',
        title: 'НПК: конкурс исследовательских проектов',
        category: 'project',
        projectKind: 'конкурс',
        interests: ['Проектная работа', 'Биология'],
        organizer: 'Лицей БГУ',
        description: 'Конкурс исследовательских работ с очной защитой проектов.',
        grade: '9–11',
        date: '2026-12-12',
        city: 'Минск',
        place: 'Лицей БГУ, конференц-зал',
        format: 'очно',
        terms: 'Тезисы до дедлайна, защита очно.',
        deadline: '2026-12-01',
        seats: 40,
      }),
      event({
        id: 'e11',
        title: 'Мастерская роботов',
        category: 'project',
        projectKind: 'мастерская',
        interests: ['Робототехника'],
        organizer: 'РобоЛаб',
        description: 'Практическая мастерская по сборке роботов для 7–10 классов.',
        grade: '7–10',
        date: '2026-11-21',
        city: 'Гомель',
        place: 'РобоЛаб, мастерская',
        format: 'очно',
        terms: 'Материалы выдают на месте, группа небольшая.',
        deadline: '2026-11-14',
        seats: 16,
      }),
      event({
        id: 'e12',
        title: 'Проектная смена «Физическая лаборатория»',
        category: 'project',
        projectKind: 'смена',
        interests: ['Физика', 'Проектная работа'],
        organizer: 'Лицей БГУ',
        description: 'Смена с опытами и мини-проектами по физике для 10–11 классов.',
        grade: '10–11',
        date: '2026-12-06',
        city: 'Минск',
        place: 'Лицей БГУ, лаборатория физики',
        format: 'очно',
        terms: 'Зачисление по заявке, опыты в лаборатории лицея.',
        deadline: '2026-11-26',
        seats: 30,
      }),
      event({
        id: 'e13',
        title: 'Конкурс «Математический макет»',
        category: 'project',
        projectKind: 'конкурс',
        interests: ['Математика', 'Проектная работа'],
        organizer: 'Гимназия №2 Брест',
        description: 'Конкурс макетов, которые объясняют математическую идею.',
        grade: '8–10',
        date: '2026-11-27',
        city: 'Витебск',
        place: 'Площадка в Витебске',
        format: 'смешанный',
        terms: 'Макет или видеозащита, один участник или пара.',
        deadline: '2026-11-18',
        seats: 45,
      }),
      event({
        id: 'e14',
        title: 'Химическая лаборатория выходного дня',
        category: 'project',
        projectKind: 'мастерская',
        interests: ['Химия'],
        organizer: 'ХимПрактикум',
        description: 'Однодневная лаборатория с безопасными опытами по химии.',
        grade: '9–11',
        date: '2026-11-16',
        city: 'Минск',
        place: 'ХимПрактикум, учебная лаборатория',
        format: 'очно',
        terms: 'Халат выдают, нужно согласие родителей.',
        deadline: '2026-11-12',
        seats: 20,
      }),
      event({
        id: 'e15',
        title: 'Смена «Сделай устройство»',
        category: 'project',
        projectKind: 'смена',
        interests: ['Робототехника', 'Проектная работа'],
        organizer: 'РобоЛаб',
        description: 'Смена, где команды собирают полезное устройство и защищают его.',
        grade: '9–11',
        date: '2026-12-18',
        city: 'Минск',
        place: 'РобоЛаб, Минск',
        format: 'смешанный',
        terms: 'Команда до четырёх человек, идея до старта.',
        deadline: '2026-12-08',
        seats: 32,
      }),
      event({
        id: 'e16',
        title: 'Олимпиада по математике «Шаг в БГУ»',
        category: 'olympiad',
        interests: ['Математика'],
        organizer: 'Лицей БГУ',
        description: 'Олимпиада для одиннадцатиклассников, которые готовятся к поступлению.',
        grade: '11',
        date: '2026-12-20',
        city: 'Минск',
        place: 'Лицей БГУ',
        format: 'очно',
        terms: 'Только 11 класс, при себе паспорт.',
        deadline: '2026-12-10',
        seats: 100,
        status: 'pending',
      }),
      event({
        id: 'e17',
        title: 'Хакатон «Школьный код»',
        category: 'project',
        projectKind: 'хакатон',
        interests: ['Информатика', 'Проектная работа'],
        organizer: 'КодМастер',
        description: 'Однодневный хакатон школьных команд с задачей от компании.',
        grade: '9–11',
        date: '2026-11-22',
        city: 'Минск',
        place: 'Офис КодМастер, Минск',
        format: 'очно',
        terms: 'Команда из 2–4 человек, ноутбуки свои.',
        deadline: '2026-11-18',
        seats: 48,
        status: 'pending',
      }),
    ],
    partnerships: [
      {
        id: 'p1',
        from: 'КодМастер',
        to: 'Лицей БГУ',
        title: 'Мастер-класс по программированию',
        description: 'КодМастер предлагает провести мастер-класс по программированию для учеников лицея.',
        status: 'incoming',
      },
      {
        id: 'p2',
        from: 'РобоЛаб',
        to: 'Лицей БГУ',
        title: 'Оборудование для мастерской',
        description: 'РобоЛаб предлагает комплект оборудования для школьной мастерской робототехники.',
        status: 'incoming',
      },
      {
        id: 'p3',
        from: 'Лицей БГУ',
        to: 'ХимПрактикум',
        title: 'Лабораторная смена',
        description: 'Лицей просит ХимПрактикум провести лабораторную смену для своих учеников.',
        status: 'pending',
      },
      {
        id: 'p4',
        from: 'НаноСофт',
        to: 'Лицей БГУ',
        title: 'IT-каникулы',
        description: 'НаноСофт и лицей согласовали IT-каникулы для школьников.',
        status: 'accepted',
      },
    ],
    achievements: [
      {
        id: 'a1',
        studentId: 's4',
        student: 'Тимофей Орлов',
        firstName: 'Тимофей',
        lastName: 'Орлов',
        title: 'Внешний диплом конкурса роботов',
        school: 'Лицей БГУ',
        status: 'pending',
      },
    ],
    notifications: demoNotifications(),
  }
}

function load() {
  const raw = readRaw()
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.version === VERSION && Array.isArray(parsed.users)) {
        const stale = !Array.isArray(parsed.notifications)
          || parsed.notifications.some((item) => item.type === 'school' || item.type === 'admin')
        if (stale) {
          parsed.notifications = demoNotifications()
          writeRaw(JSON.stringify(parsed))
        }
        if (!parsed.users.some((item) => item && item.role === 'company')) {
          parsed.users.push({
            id: 'u-company',
            email: 'company@demo.by',
            password: 'demo1234',
            role: 'company',
            firstName: 'Павел',
            lastName: 'Мороз',
            orgName: 'КодМастер',
          })
          writeRaw(JSON.stringify(parsed))
        }
        return parsed
      }
    } catch {
      /* reseed */
    }
  }
  const db = seed()
  writeRaw(JSON.stringify(db))
  return db
}

function save(db) {
  writeRaw(JSON.stringify(db))
}

function viewUser(db, user) {
  const copy = clone(user)
  delete copy.password
  if (copy.role === 'parent') {
    copy.child = copy.childId ? presentStudent(db.students.find((student) => student.id === copy.childId)) : null
  }
  return copy
}

export function listSchools() {
  return SCHOOLS.slice()
}

export function changeSchool(school) {
  const db = load()
  const user = db.users.find((item) => item.id === db.sessionUserId)
  if (!user || user.role !== 'student') return null
  const name = String(school || '').trim()
  if (!name) return null
  user.school = name
  const student = db.students.find((item) => item.id === user.catalogId)
  if (student) student.school = name
  save(db)
  return viewUser(db, user)
}

export function login(email, password) {
  const db = load()
  const user = db.users.find((item) => norm(item.email) === norm(email) && item.password === password)
  if (!user) return null
  db.sessionUserId = user.id
  save(db)
  return viewUser(db, user)
}

export function logout() {
  const db = load()
  db.sessionUserId = null
  save(db)
}

export function currentUser() {
  const db = load()
  const user = db.users.find((item) => item.id === db.sessionUserId)
  return user ? viewUser(db, user) : null
}

export function registerStudent({ firstName, lastName, birthDate, email, password, school } = {}) {
  const db = load()
  const cleanEmail = norm(email)
  if (!cleanEmail || !password) return { ok: false }
  if (db.users.some((item) => norm(item.email) === cleanEmail)) return { ok: false }

  const fn = String(firstName ?? '').trim()
  const ln = String(lastName ?? '').trim()
  const bd = String(birthDate ?? '').trim()
  const sch = String(school ?? '').trim()

  let student = db.students.find((item) => norm(item.firstName) === norm(fn) && norm(item.lastName) === norm(ln) && item.birthDate === bd)
  if (!student) {
    student = {
      id: nextId('s'),
      firstName: fn,
      lastName: ln,
      birthDate: bd,
      school: sch,
      grade: '',
      city: '',
      interests: [],
      signedUp: [],
      attended: [],
      achievements: [],
    }
    db.students.push(student)
  }

  const user = {
    id: nextId('u'),
    email: cleanEmail,
    password,
    role: 'student',
    firstName: fn,
    lastName: ln,
    birthDate: bd,
    school: sch,
    grade: '',
    city: '',
    interests: [],
    profileComplete: false,
    catalogId: student.id,
  }
  db.users.push(user)
  db.sessionUserId = user.id
  save(db)
  return viewUser(db, user)
}

export function completeProfile({ grade, city, interests } = {}) {
  const db = load()
  const user = db.users.find((item) => item.id === db.sessionUserId)
  if (!user || user.role !== 'student') return null
  user.grade = grade == null ? '' : String(grade)
  user.city = city == null ? '' : String(city)
  user.interests = Array.isArray(interests) ? interests.map((item) => String(item)) : []
  user.profileComplete = true
  const student = db.students.find((item) => item.id === user.catalogId)
  if (student) {
    student.grade = user.grade
    student.city = user.city
    student.interests = user.interests.slice()
  }
  save(db)
  return viewUser(db, user)
}

export function listEvents() {
  return clone(load().events)
}

export function listUpcoming() {
  return clone(load().events.filter((item) => item.status === 'published' && item.date >= TODAY))
}

export function publishEvent(payload = {}) {
  const db = load()
  const user = db.users.find((item) => item.id === db.sessionUserId)
  const created = {
    title: '',
    category: 'olympiad',
    projectKind: '',
    interests: [],
    description: '',
    grade: '',
    date: '',
    city: '',
    place: '',
    format: 'очно',
    terms: '',
    deadline: '',
    seats: 0,
    ...payload,
    id: nextId('e'),
    status: 'pending',
  }
  if (!created.organizer) created.organizer = user?.orgName || user?.school || ''
  if (typeof created.interests === 'string') {
    created.interests = created.interests.split(',').map((item) => item.trim()).filter(Boolean)
  }
  if (!Array.isArray(created.interests)) created.interests = []
  if (created.interests.length === 0 && created.interest) created.interests = [String(created.interest)]
  if (created.seats != null && created.seats !== '') created.seats = Number(created.seats) || 0
  db.events.push(created)
  save(db)
  return clone(created)
}

export function moderateEvent(id, decision) {
  if (decision !== 'published' && decision !== 'rejected') return null
  const db = load()
  const item = db.events.find((eventItem) => eventItem.id === id)
  if (!item) return null
  item.status = decision
  save(db)
  return clone(item)
}


// Организационные инструменты кабинетов: регистрация, посещение и жизненный цикл мероприятия.
export function updateEvent(id, payload = {}) {
  const db = load()
  const item = db.events.find((eventItem) => eventItem.id === id)
  if (!item) return null
  Object.assign(item, payload)
  save(db)
  return clone(item)
}

export function eventRegistrations(eventId) {
  const db = load()
  const rows = []
  for (const student of db.students) {
    for (const registration of (student.signedUp || [])) {
      if (registration && registration.eventId === eventId && registration.status !== 'отменена') {
        rows.push({
          studentId: student.id,
          name: [student.firstName, student.lastName].filter(Boolean).join(' '),
          grade: student.grade || '',
          status: registration.status || 'подана',
          attended: (student.attended || []).some((item) => item && item.eventId === eventId),
          result: registration.result || '',
        })
      }
    }
  }
  return rows
}

export function updateEventRegistration(eventId, studentId, payload = {}) {
  const db = load()
  const student = db.students.find((item) => item.id === studentId)
  if (!student) return null
  const registration = (student.signedUp || []).find((item) => item && item.eventId === eventId)
  if (!registration) return null
  if (payload.status) registration.status = payload.status
  if (payload.result !== undefined) registration.result = String(payload.result)
  if (payload.attended === true) {
    if (!Array.isArray(student.attended)) student.attended = []
    if (!student.attended.some((item) => item && item.eventId === eventId)) {
      const event = db.events.find((item) => item.id === eventId)
      student.attended.push({ title: event?.title || registration.title, eventId })
    }
    registration.status = 'подтверждена'
    if (payload.result && !student.achievements.some((item) => (item.title || item) === payload.result)) {
      student.achievements.push({ title: String(payload.result), status: 'confirmed', eventId })
    }
  }
  save(db)
  return clone(registration)
}

export function updateOrganizationProfile(payload = {}) {
  const db = load()
  const user = db.users.find((item) => item.id === db.sessionUserId)
  if (!user || !['school', 'company'].includes(user.role)) return null
  for (const key of ['orgName', 'orgCity', 'orgDescription', 'orgDirections', 'orgWebsite', 'orgContact']) {
    if (payload[key] !== undefined) user[key] = String(payload[key]).trim()
  }
  save(db)
  return viewUser(db, user)
}

export function schoolStudents() {
  return load().students.filter((item) => item.school === 'Лицей БГУ').map(presentStudent)
}

export function listPartnerships() {
  return clone(load().partnerships)
}

export function sendPartnership(payload = {}) {
  const db = load()
  const user = db.users.find((item) => item.id === db.sessionUserId)
  const created = {
    from: user?.orgName || '',
    to: '',
    title: '',
    description: '',
    ...payload,
    id: nextId('p'),
    status: payload.status || 'pending',
  }
  if (!created.description && created.text) created.description = created.text
  if (!created.text && created.description) created.text = created.description
  db.partnerships.push(created)
  save(db)
  return clone(created)
}

export function respondPartnership(id, decision) {
  if (decision !== 'accepted' && decision !== 'declined') return null
  const db = load()
  const item = db.partnerships.find((partnership) => partnership.id === id)
  if (!item) return null
  item.status = decision
  save(db)
  return clone(item)
}

export function moderatePartnership(id, decision) {
  if (decision !== 'incoming' && decision !== 'rejected') return null
  const db = load()
  const item = db.partnerships.find((partnership) => partnership.id === id)
  if (!item) return null
  item.status = decision
  save(db)
  return clone(item)
}

export function listAchievementsQueue() {
  return clone(load().achievements)
}

export function moderateAchievement(id, decision) {
  if (decision !== 'confirmed' && decision !== 'rejected') return null
  const db = load()
  const item = db.achievements.find((achievement) => achievement.id === id)
  if (!item) return null
  item.status = decision
  if (decision === 'confirmed') {
    const student = db.students.find((entry) => entry.id === item.studentId)
      || db.students.find((entry) => norm(entry.firstName) === norm(item.firstName) && norm(entry.lastName) === norm(item.lastName))
    if (student && !student.achievements.some((achievement) => (achievement.title || achievement) === item.title)) {
      student.achievements.push({ title: item.title, status: 'confirmed' })
    }
  }
  save(db)
  return clone(item)
}

function resolveStudent(db, user) {
  if (!user) return null
  return db.students.find((item) => item.id === user.catalogId)
    || db.students.find((item) =>
      norm(item.firstName) === norm(user.firstName)
      && norm(item.lastName) === norm(user.lastName)
      && item.birthDate === user.birthDate
    )
    || null
}

function notificationsOf(db, student) {
  if (!student) return []
  return (db.notifications || [])
    .filter((item) => item.studentId === student.id)
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
}

function applicationsOf(db, student) {
  if (!student) return []
  return (student.signedUp || []).map((item) => {
    const title = typeof item === 'string' ? item : (item.title || '')
    const status = typeof item === 'string' ? 'подана' : (item.status || 'подана')
    const eventId = typeof item === 'string' ? '' : (item.eventId || '')
    const event = db.events.find((entry) => (eventId && entry.id === eventId) || entry.title === title)
    return {
      eventId: event?.id || eventId,
      title: title || event?.title || 'Мероприятие',
      status,
      date: event?.date || '',
      city: event?.city || '',
      organizer: event?.organizer || '',
      category: event?.category || '',
      format: event?.format || '',
    }
  })
}

export function studentCabinet() {
  const db = load()
  const session = db.users.find((item) => item.id === db.sessionUserId)
  if (session?.role === 'student') {
    const student = resolveStudent(db, session)
    return {
      demo: false,
      loggedIn: true,
      user: viewUser(db, session),
      student: presentStudent(student),
      applications: applicationsOf(db, student),
      notifications: notificationsOf(db, student),
    }
  }
  if (session) {
    return { demo: false, loggedIn: false, foreign: true, user: null, student: null, applications: [], notifications: [] }
  }
  const alinaUser = db.users.find((item) => item.id === 'u-alina')
  const alina = db.students.find((item) => item.id === 's1')
  return {
    demo: true,
    loggedIn: false,
    user: alinaUser ? viewUser(db, alinaUser) : null,
    student: presentStudent(alina),
    applications: applicationsOf(db, alina),
    notifications: notificationsOf(db, alina),
  }
}

export function registerForEvent(eventId) {
  const db = load()
  const session = db.users.find((item) => item.id === db.sessionUserId)
  if (!session || session.role !== 'student') return { ok: false, reason: 'auth' }
  const student = resolveStudent(db, session)
  if (!student) return { ok: false, reason: 'profile' }
  const event = db.events.find((item) => item.id === eventId)
  if (!event || event.status !== 'published') return { ok: false, reason: 'closed' }
  if (!Array.isArray(student.signedUp)) student.signedUp = []
  const existing = student.signedUp.find((item) => item && item.eventId === event.id)
  if (existing && existing.status !== 'отменена') {
    return { ok: true, already: true, status: existing.status }
  }
  if (existing) {
    existing.status = 'подана'
    existing.title = event.title
  } else {
    student.signedUp.push({ title: event.title, status: 'подана', eventId: event.id })
  }
  save(db)
  return { ok: true, status: 'подана' }
}

export function cancelRegistration(eventId) {
  const db = load()
  const session = db.users.find((item) => item.id === db.sessionUserId)
  if (!session || session.role !== 'student') return { ok: false, reason: 'auth' }
  const student = resolveStudent(db, session)
  if (!student) return { ok: false, reason: 'profile' }
  const existing = (student.signedUp || []).find((item) => item && item.eventId === eventId)
  if (!existing || existing.status === 'отменена' || existing.status === 'отклонена') {
    return { ok: false, reason: 'missing' }
  }
  existing.status = 'отменена'
  save(db)
  return { ok: true, status: 'отменена' }
}

export function linkChild({ firstName, lastName, birthDate } = {}) {
  const db = load()
  const child = db.students.find((item) =>
    norm(item.firstName) === norm(firstName)
    && norm(item.lastName) === norm(lastName)
    && item.birthDate === String(birthDate ?? '').trim()
  )
  if (!child) return { ok: false, child: null }
  const user = db.users.find((item) => item.id === db.sessionUserId)
  if (user && user.role === 'parent') {
    user.childId = child.id
    save(db)
  }
  return { ok: true, child: presentStudent(child) }
}
