import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppHeader from './components/AppHeader.jsx'
import StudentShell from './components/StudentShell.jsx'
import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth.jsx'
import FirstLogin from './pages/FirstLogin.jsx'
import Events from './pages/Events.jsx'
import Applications from './pages/Applications.jsx'
import Notifications from './pages/Notifications.jsx'
import Success from './pages/Success.jsx'
import Profile from './pages/Profile.jsx'
import SchoolCabinet from './pages/SchoolCabinet.jsx'
import Admin from './pages/Admin.jsx'
import ParentLink from './pages/ParentLink.jsx'
import Company from './pages/Company.jsx'

function WithHeader({ children }) {
  return <AppHeader>{children}</AppHeader>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/events" element={<StudentShell><Events /></StudentShell>} />
        <Route path="/applications" element={<StudentShell><Applications /></StudentShell>} />
        <Route path="/notifications" element={<StudentShell><Notifications /></StudentShell>} />
        <Route path="/success" element={<StudentShell><Success /></StudentShell>} />
        <Route path="/profile" element={<StudentShell><Profile /></StudentShell>} />
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<WithHeader><Auth /></WithHeader>} />
        <Route path="/welcome" element={<WithHeader><FirstLogin /></WithHeader>} />
        <Route path="/school" element={<WithHeader><SchoolCabinet /></WithHeader>} />
        <Route path="/admin" element={<WithHeader><Admin /></WithHeader>} />
        <Route path="/parent" element={<WithHeader><ParentLink /></WithHeader>} />
        <Route path="/company" element={<WithHeader><Company /></WithHeader>} />
      </Routes>
    </BrowserRouter>
  )
}
