import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="landing">
      <div className="landing-center">
        <h1>TalentHub</h1>
        <p>Единая среда для школьных мероприятий: олимпиады и проектная деятельность, где школьник делает работу руками.</p>
      </div>
      <Link className="btn btn-primary" to="/auth">Поехали</Link>
    </main>
  )
}
