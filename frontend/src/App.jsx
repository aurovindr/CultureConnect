import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ExploreFeed from './pages/ExploreFeed'
import PostStory from './pages/PostStory'
import Chatbot from './pages/Chatbot'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<ExploreFeed />} />
        <Route path="/post" element={<PostStory />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
