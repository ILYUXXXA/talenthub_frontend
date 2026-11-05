import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="landing">
      <div className="landing-center">
        <h1>TalentHub</h1>
        <p>Таланты находят возможности. Возможности находят таланты.</p>
      </div>
      <Link className="btn btn-primary" to="/auth">Поехали</Link>
    </main>
  )
}
