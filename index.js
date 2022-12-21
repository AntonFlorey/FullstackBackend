const { request, response } = require('express')
const express = require('express')
const app = express()
const cors = require("cors")

// var morgan = require('morgan')
// morgan.token('body', function (req, res) { return JSON.stringify(req.body)})
// const customMorganFunc = (tokens, req, res) => {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens['response-time'](req, res), 'ms',
//       tokens.body(req, res)
//     ].join(' ')
// }

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
// app.use(morgan(customMorganFunc, "immediate"))

let persons = [
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

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend Server!</h1>')
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    num_contacts = persons.length
    curr_date = new Date()
    response.send(`<p>Phonebook currently stores ${num_contacts} people <p/>
                   <p>${curr_date}<p/>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const randID = Math.floor(Math.random() * 1000000)
    console.log(randID)
    return randID
  }

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name){
        return response.status(400).json({
            error: "no name provided!"
        })
    }
    if (!body.number){
        return response.status(400).json({
            error: "no number provided!"
        })
    }

    const already_existing = persons.find(p => p.name === body.name)
    if (already_existing){
        return response.status(400).json({
            error: "Name already existing!"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 8080
app.listen(PORT)
console.log(`Server running on port ${PORT}`)