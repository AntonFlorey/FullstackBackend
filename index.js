/* global process */

require("dotenv").config()
const Person = require("./models/person")
const express = require("express")
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

app.use(express.static("build"))
app.use(cors())
app.use(express.json())
// app.use(morgan(customMorganFunc, "immediate"))

app.get("/", (request, response) => {
  response.send("<h1>Phonebook Backend Server!</h1>")
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/info", (request, response) => {

  Person.count({}).then(cnt => {
    let curr_date = new Date()
    response.send(`<p>Phonebook currently stores ${cnt} people <p/>
                       <p>${curr_date}<p/>`)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(p => {
    if (p) {
      response.json(p)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  // const already_existing = persons.find(p => p.name === body.name)
  // if (already_existing){
  //     return response.status(400).json({
  //         error: "Name already existing!"
  //     })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(saved_person => {
    response.json(saved_person)
  }).catch(error => {
    next(error)
  })
})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: "query" })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log("this is a test")
  console.error(error.message)
  console.log("error name is", error.name)
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT)
console.log(`Server running on port ${PORT}`)