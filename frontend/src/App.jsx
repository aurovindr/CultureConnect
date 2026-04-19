import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import ExploreFeed from './pages/ExploreFeed'
import PostStory from './pages/PostStory'
import Chatbot from './pages/Chatbot'

function ProtectedRoute({ session, children }) {
  if (session === null) return <Navigate to="/login" replace />
  if (session === undefined) return null // still loading
  return children
}

function PublicRoute({ session, children }) {
  if (session === undefined) return null // still loading
  if (session) return <Navigate to="/explore" replace />
  return children
}

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    // Restore existing session on page load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })

    // Keep session in sync across tabs and after login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/explore" replace />} />
        <Route path="/login" element={<PublicRoute session={session}><Login /></PublicRoute>} />
        <Route path="/explore" element={<ProtectedRoute session={session}><ExploreFeed /></ProtectedRoute>} />
        <Route path="/post"    element={<ProtectedRoute session={session}><PostStory /></ProtectedRoute>} />
        <Route path="/chat"    element={<ProtectedRoute session={session}><Chatbot /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/explore" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
