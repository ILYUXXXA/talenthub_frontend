const API_ORIGIN = (() => {
  const configured = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://lbsuhack.onrender.com'
  const withoutApiPath = configured.endsWith('/api/v1') ? configured.slice(0, -7) : configured
  return withoutApiPath.endsWith('/') ? withoutApiPath.slice(0, -1) : withoutApiPath
})()
const API_BASE = API_ORIGIN
const TOKEN_KEY = 'talenthub_access_token'
const LEGACY_TOKEN_KEY = 'talenthub-access-token'

function readToken() {
  const current = sessionStorage.getItem(TOKEN_KEY)
  if (current) return current
  const legacy = localStorage.getItem(LEGACY_TOKEN_KEY)
  if (legacy) {
    sessionStorage.setItem(TOKEN_KEY, legacy)
    localStorage.removeItem(LEGACY_TOKEN_KEY)
    return legacy
  }
  return null
}

export class ApiError extends Error {
  constructor(message, status, code, payload = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.payload = payload
  }
}

export function getToken() {
  return readToken()
}

export function saveSession(session) {
  if (!session?.access_token) throw new ApiError('Сервер не вернул access_token.', 500, 'invalid_session')
  sessionStorage.setItem(TOKEN_KEY, session.access_token)
  localStorage.removeItem(LEGACY_TOKEN_KEY)
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(LEGACY_TOKEN_KEY)
}

export function hasSession() {
  return Boolean(getToken())
}

export async function request(path, options = {}) {
  const { auth = true, headers: inputHeaders, ...fetchOptions } = options
  const headers = new Headers(inputHeaders || {})
  headers.set('Accept', 'application/json')
  if (fetchOptions.body !== undefined) headers.set('Content-Type', 'application/json')
  const token = auth ? getToken() : null
  if (token) headers.set('Authorization', `Bearer ${token}`)
  let response
  try {
    response = await fetch(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, {
      ...fetchOptions,
      headers,
      credentials: 'omit',
    })
  } catch {
    throw new ApiError('Не удалось связаться с API. Проверьте сеть, CORS и доступность сервера.', 0, 'network_error')
  }

  const raw = response.status === 204 ? '' : await response.text()
  let payload = null
  if (raw) {
    try { payload = JSON.parse(raw) } catch { payload = { message: raw } }
  }
  if (!response.ok) {
    const detail = payload?.error
    const message = detail?.message || payload?.detail || payload?.message || (response.status === 401
      ? 'Сессия истекла или данные входа неверны.'
      : `Ошибка API (${response.status}).`)
    if (response.status === 401 && auth) clearSession()
    throw new ApiError(message, response.status, detail?.code || payload?.code, payload)
  }
  return payload
}

const list = (payload) => Array.isArray(payload) ? payload : (Array.isArray(payload?.items) ? payload.items : [])
const statusLabels = {
  submitted: 'подана',
  under_review: 'на рассмотрении',
  waitlisted: 'лист ожидания',
  approved: 'подтверждена',
  rejected: 'отклонена',
  cancelled: 'отменена',
}
const formatLabels = { offline: 'очно', online: 'онлайн', hybrid: 'гибридный' }

export function mapEvent(item) {
  if (!item) return item
  const registration = item.my_registration
  return {
    ...item,
    organizer: item.organizer?.name || '',
    category: item.kind,
    projectKind: item.project_kind || '',
    grade: item.grade_min === item.grade_max ? String(item.grade_min) : `${item.grade_min}–${item.grade_max}`,
    date: item.event_date,
    deadline: item.registration_deadline,
    place: item.venue,
    formatLabel: formatLabels[item.format] || item.format,
    format: formatLabels[item.format] || item.format,
    seats: item.capacity,
    status: item.status,
    registration: registration ? { ...registration, statusLabel: statusLabels[registration.status] || registration.status, status: statusLabels[registration.status] || registration.status } : null,
  }
}

export function mapRegistration(item) {
  if (!item) return item
  const event = item.event || {}
  return {
    ...item,
    eventId: item.event_id || event.id,
    title: event.title || 'Мероприятие',
    organizer: event.organizer?.name || '',
    category: event.kind,
    projectKind: event.project_kind || '',
    date: event.event_date,
    city: event.city,
    format: formatLabels[event.format] || event.format,
    rawStatus: item.status,
    status: statusLabels[item.status] || item.status,
  }
}

export const api = {
  login: async (email, password, expectedRole) => {
    const body = { email, password }
    if (expectedRole) body.expected_role = expectedRole
    const session = await request('/api/v1/auth/login', { method: 'POST', auth: false, body: JSON.stringify(body) })
    saveSession(session)
    return session.user
  },
  register: async (data) => {
    const session = await request('/api/v1/auth/register', { method: 'POST', auth: false, body: JSON.stringify(data) })
    saveSession(session)
    return session.user
  },
  me: () => request('/api/v1/auth/me'),
  reference: () => request('/api/v1/reference-data', { auth: false }),
  organizations: async (kind, q = '') => {
    const query = new URLSearchParams()
    if (kind) query.set('kind', kind)
    if (q) query.set('q', q)
    const suffix = query.size ? `?${query}` : ''
    return list(await request(`/api/v1/organizations${suffix}`, { auth: false }))
  },
  profile: () => request('/api/v1/students/me'),
  updateProfile: (data) => request('/api/v1/students/me', { method: 'PATCH', body: JSON.stringify(data) }),
  success: () => request('/api/v1/students/me/success'),
  events: async (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      if (Array.isArray(value)) value.forEach((item) => query.append(key, String(item)))
      else query.set(key, String(value))
    })
    const suffix = query.size ? `?${query}` : ''
    return list(await request(`/api/v1/events${suffix}`, { auth: !params.public })).map(mapEvent)
  },
  event: async (id) => mapEvent(await request(`/api/v1/events/${encodeURIComponent(id)}`)),
  recommendations: async (interests = []) => {
    const query = new URLSearchParams()
    interests.forEach((interest) => query.append('interest', interest))
    const suffix = query.size ? `?${query}` : ''
    return list(await request(`/api/v1/recommendations${suffix}`)).map(mapEvent)
  },
  registrations: async () => list(await request('/api/v1/registrations/me')).map(mapRegistration),
  registerForEvent: (eventId) => request(`/api/v1/events/${encodeURIComponent(eventId)}/registrations`, { method: 'POST' }),
  cancelRegistration: (registrationId) => request(`/api/v1/registrations/${encodeURIComponent(registrationId)}/cancel`, { method: 'POST' }),
  notifications: async () => request('/api/v1/notifications/me'),
  parentChild: () => request('/api/v1/parents/me/child'),
  linkParentChild: (data) => request('/api/v1/parents/me/child', { method: 'PUT', body: JSON.stringify(data) }),
  organizationDashboard: () => request('/api/v1/organizations/me/dashboard'),
  organizationStudents: async (q = '') => {
    const suffix = q ? `?q=${encodeURIComponent(q)}` : ''
    return list(await request(`/api/v1/organizations/me/students${suffix}`))
  },
  organizationEvents: async () => list(await request('/api/v1/organizations/me/events')).map(mapEvent),
  createEvent: (data) => request('/api/v1/events', { method: 'POST', body: JSON.stringify(data) }),
  eventParticipants: async (eventId) => list(await request(`/api/v1/events/${encodeURIComponent(eventId)}/registrations`)),
  decideRegistration: (id, decision) => request(`/api/v1/registrations/${encodeURIComponent(id)}/decision`, { method: 'PATCH', body: JSON.stringify({ decision }) }),
  markAttendance: (id) => request(`/api/v1/registrations/${encodeURIComponent(id)}/attendance`, { method: 'PUT' }),
  closeEvent: (id) => request(`/api/v1/events/${encodeURIComponent(id)}/close-registration`, { method: 'POST' }),
  openEvent: (id) => request(`/api/v1/events/${encodeURIComponent(id)}/open-registration`, { method: 'POST' }),
  completeEvent: (id) => request(`/api/v1/events/${encodeURIComponent(id)}/complete`, { method: 'POST' }),
  partnerships: async (view = 'mine') => list(await request(`/api/v1/partnership-requests?view=${encodeURIComponent(view)}`)),
  createPartnership: (data) => request('/api/v1/partnership-requests', { method: 'POST', body: JSON.stringify(data) }),
  decidePartnership: (id, decision) => request(`/api/v1/partnership-requests/${encodeURIComponent(id)}/decision`, { method: 'PATCH', body: JSON.stringify({ decision }) }),
  respondPartnership: (id) => request(`/api/v1/partnership-requests/${encodeURIComponent(id)}/responses`, { method: 'POST' }),
  decidePartnershipResponse: (id, decision) => request(`/api/v1/partnership-responses/${encodeURIComponent(id)}/decision`, { method: 'PATCH', body: JSON.stringify({ decision }) }),
  moderationQueue: () => request('/api/v1/moderation/queue'),
  moderateEvent: (id, decision) => request(`/api/v1/moderation/events/${encodeURIComponent(id)}/decision`, { method: 'POST', body: JSON.stringify({ decision }) }),
  moderatePartnership: (id, decision) => request(`/api/v1/moderation/partnership-requests/${encodeURIComponent(id)}/decision`, { method: 'POST', body: JSON.stringify({ decision }) }),
  moderateAchievement: (id, decision) => request(`/api/v1/moderation/achievements/${encodeURIComponent(id)}/decision`, { method: 'POST', body: JSON.stringify({ decision }) }),
}
