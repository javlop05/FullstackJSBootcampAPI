const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('./middlewares/logger')

app.use(cors())
app.use(express.json())

app.use(logger)

let notes = [
  {
    id: 1,
    content:
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    important: true
  },
  {
    id: 2,
    content: 'qui est esse',
    important: false
  },
  {
    id: 3,
    content: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
    important: true
  },
  {
    id: 4,
    content: 'eum et est occaecati',
    important: false
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(204).end()
  }
  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const noteToUpdate = notes.findIndex((note) => note.id === id)

  if (noteToUpdate === -1) {
    return response.status(409).end()
  }

  notes[noteToUpdate] = {
    ...notes[noteToUpdate],
    ...request.body
  }

  response.json(notes[noteToUpdate])
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'Note is missing'
    })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: note.important !== undefined ? note.important : false
  }

  notes = [...notes, newNote]
  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
