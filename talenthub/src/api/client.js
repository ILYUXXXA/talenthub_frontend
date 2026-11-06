const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://lbsuhack.onrender.com').replace(/\/$/, '')
const TOKEN_KEY = 'talenthub-access-token'

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveSession(session) {
  if (session?.access_token) localStorage.setItem(TOKEN_KEY, session.access_token)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
}

export function hasSession() {
  return Boolean(getToken())
}

export async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  headers.set('Accept', 'application/json')
  if (options.body !== undefined) headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new ApiError('Не удалось связаться с сервером. Проверьте подключение и доступность API.', 0, 'network_error')
  }
  const payload = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const detail = payload?.error
    const message = detail?.message || payload?.detail || (response.status === 401
      ? 'Сессия истекла или данные входа неверны.'
      : `Ошибка сервера (${response.status}).`)
    if (response.status === 401) clearSession()
    throw new ApiError(message, response.status, detail?.code)
  }
  return payload
}

const list = (payload) => Array.isArray(payload) ? payload : (payload?.items || [])
const statusLabels = {
  submitted: 'подана',
  under_review: 'на рассмотрении',
  waitlisted: 'лист ожидания',
  approved: 'подтверждена',
  rejected: 'отклонена',
  cancelled: 'отменена',
}

export function mapEvent(item) {
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
    format: ({ offline: 'очно', online: 'онлайн', hybrid: 'гибридный' })[item.format] || item.format,
    seats: item.capacity,
    status: item.status,
    registration: registration ? { ...registration, status: statusLabels[registration.status] || registration.status } : null,
  }
}

export function mapRegistration(item) {
  const event = item.event || {}
  return {
    ...item,
    eventId: item.event_id || event.id,
    title: event.title || 'Мероприятие',
    organizer: event.organizer?.name || '',
    category: event.kind,
    date: event.event_date,
    city: event.city,
    format: ({ offline: 'очно', online: 'онлайн', hybrid: 'гибридный' })[event.format] || event.format,
    status: statusLabels[item.status] || item.status,
  }
}

export const api = {
  login: async (email, password, expectedRole) => {
    const session = await request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, expected_role: expectedRole }),
    })
    saveSession(session)
    return session.user
  },
  register: async (data) => {
    const session = await request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    saveSession(session)
    return session.user
  },
  me: () => request('/api/v1/auth/me'),
  events: async (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
    })
    const suffix = query.size ? `?${query}` : ''
    return list(await request(`/api/v1/events${suffix}`)).map(mapEvent)
  },
  registrations: async () => list(await request('/api/v1/registrations/me')).map(mapRegistration),
  registerForEvent: (eventId) => request(`/api/v1/events/${encodeURIComponent(eventId)}/registrations`, { method: 'POST' }),
  cancelRegistration: (registrationId) => request(`/api/v1/registrations/${encodeURIComponent(registrationId)}/cancel`, { method: 'POST' }),
  notifications: async () => {
    const feed = await request('/api/v1/notifications/me')
    return { ...feed, items: (feed.items || []).map((item) => ({ ...item, date: item.created_at })) }
  },
  profile: () => request('/api/v1/students/me'),
  updateProfile: (data) => request('/api/v1/students/me', { method: 'PATCH', body: JSON.stringify(data) }),
  success: () => request('/api/v1/students/me/success'),
  reference: () => request('/api/v1/reference-data'),
  organizations: async (kind) => {
    const query = kind ? `?kind=${encodeURIComponent(kind)}` : ''
    return list(await request(`/api/v1/organizations${query}`))
  },
}
