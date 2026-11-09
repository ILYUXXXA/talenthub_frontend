import { useEffect, useState } from 'react'

export default function ActionToast() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    let timer
    const show = (event) => {
      const nextMessage = event.detail?.message
      if (!nextMessage) return
      setMessage(nextMessage)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setMessage(''), 3600)
    }
    window.addEventListener('talenthub:action-success', show)
    return () => {
      window.removeEventListener('talenthub:action-success', show)
      window.clearTimeout(timer)
    }
  }, [])

  if (!message) return null
  return (
    <div className="action-toast" role="status" aria-live="polite">
      <span className="action-toast-icon" aria-hidden="true">✓</span>
      <span>{message}</span>
      <button type="button" aria-label="Закрыть уведомление" onClick={() => setMessage('')}>×</button>
    </div>
  )
}
