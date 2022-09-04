require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))

morgan.token('body', (request, response) => JSON.stringify(request.body) )
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body '))
app.use(express.json())
app.use(cors())

// let phonebook = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]

app.get('/api/persons', (request, response) => {
  // response.json(phonebook)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response, next) => {
  const date = new Date()
  Person.find({})
    .then(result => { 
      const persons = [...result]
      return persons.length
    })
    .then(length => {
      const message = `<div><p>Phonebook has info for ${length} people</p><p>${date}</p></div>`
      response.send(message)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(note => {
      if(note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body
  if (!name && !number) {
    return response.status(404).json({ error: 'content missing' }).end()
  } else {
    if (!number) {
      return response.status(404).json({
        error: 'number skipped'
      })
    } else if (!name) {
      return response.status(404).json({
        error: 'name skipped'
      })
    }
    Person.find({ name: name }).then(result => {
      console.log(result.length)
      const person = new Person({
        name: name,
        number: number,
      })
      if(result.length > 0) {
        Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true })
        .then(updatedPerson => {
          response.json(updatedPerson)
        })
        .catch(error => next(error))
      } else {
        person.save().then(savedPerson => response.json(savedPerson))
      }
    }) 
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})