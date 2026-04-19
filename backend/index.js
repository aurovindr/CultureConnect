require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/stories', require('./routes/stories'))
app.use('/api/chat', require('./routes/chat'))

app.get('/api/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
