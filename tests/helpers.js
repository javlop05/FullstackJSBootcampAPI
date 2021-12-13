const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const User = require('../models/User')

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

const getUsers = async () => {
  const usersDB = await User.find({})

  return usersDB.map(user => user.toJSON())
}

module.exports = { api, initialNotes, getAllContentsFromNotes, getUsers }
