const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)

const initialNotes = [
  {
    content: 'Learning FullStack JS',
    important: true,
    date: new Date()
  },
  {
    content: 'Creating the notes API',
    important: true,
    date: new Date()
  },
  {
    content: 'Doing refactor of code',
    important: false,
    date: new Date()
  }
]

const getAllContentsFromNotes = async () => {
  const response = await api.get('/api/notes')

  return {
    response,
    contents: response.body.map(note => note.content)
  }
}

module.exports = { api, initialNotes, getAllContentsFromNotes }
