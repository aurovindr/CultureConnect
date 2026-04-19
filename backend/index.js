require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    /^http:\/\/192\.168\.\d+\.\d+:\d+$/,  // local network (mobile testing)
    /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,   // local network alternate range
  ],
  credentials: true,
}))
app.use(express.json())

app.use('/api/stories', require('./routes/stories'))
app.use('/api/chat', require('./routes/chat'))

app.get('/api/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on http://0.0.0.0:${PORT}`))
