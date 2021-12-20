const ERROR_HANDLERS = {
  CastError: res => res.status(400).send({ error: 'id used is malformed' }),
  JsonWebTokenError: res => res.status(401).send({ error: 'token missing or invalid' }),
  TokenExpirerError: res => res.status(401).send({ error: 'token expired' }),
  defaaultError: res => res.status(500).end()
}

module.exports = (error, request, response, next) => {
  console.error(error.name)

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaaultError;

  handler(response)
}
