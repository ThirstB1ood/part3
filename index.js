const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (request, response) => JSON.stringify(request.body) )
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body '))
app.use(express.json())
app.use(cors())

let phonebook = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/info', (request, response) => {
  const date = new Date()
  const message = `<div><p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p></div>`
  response.send(message)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const personInfo = phonebook.find(person => person.id == id)
  if (personInfo) {
    response.json(personInfo)
  } else {
    response.status(404).send('Not Found').end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body) {
    return response.status(404).end()
  } else {
    if (!body.number) {
      return response.status(404).json({
        error: 'number skipped'
      })
    } else if (!body.name) {
      return response.status(404).json({
        error: 'name skipped'
      })
    } else if (phonebook.find(person => person.name === body.name)) {
      return response.status(404).json({
        error: 'name already exists'
      })
    }

    const id = getRandomArbitrary(1, 100000)
    const person = {
      name: body.name,
      number: body.number,
      id: id
    }
    phonebook = phonebook.concat(person)
    response.json(person)
  }

})

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log('listen on', PORT)
})
