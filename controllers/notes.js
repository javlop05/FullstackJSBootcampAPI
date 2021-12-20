const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })

  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(next)
})

notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  await Note.findByIdAndDelete(id)
  response.status(204).end()
})

notesRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important !== undefined ? note.important : false
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then(result => {
    response.json(result)
  }).catch(next)
})

notesRouter.post('/', async (request, response, next) => {
  const {
    content,
    important = false
  } = request.body

  const authorization = request.get('authorization')
  let token = null

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  // Could throw JsonWebTokenError
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const { id: userId } = decodedToken
  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'Note is missing'
    })
  }

  const newNote = new Note({
    content: content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

module.exports = notesRouter
