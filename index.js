require('dotenv').config()
require('./mongo')

const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const app = express()
const cors = require('cors')
const logger = require('./middlewares/logger')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
app.use('/images', express.static('images'))

app.use(logger)

Sentry.init({
  dsn: 'https://b09efdd8cf294f258ffffa95dd40d3a2@o1079665.ingest.sentry.io/6084706',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
