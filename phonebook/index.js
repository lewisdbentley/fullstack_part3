require('dotenv').config()
const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', function(req, res) { return JSON.stringify(`request: ${req.body}, response: ${res}`) })

app.use(morgan(':body :method :res[content-length] :res[content-type] :res[date]'))

const requestLogger = (request, response, next) => {
    console.log('method: ', request.method)
    console.log('path  : ', request.path)
    console.log('body  : ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)


// HOMEPAGE
app.get('/info', (request, response) => {

    Person.find({}).then(results => {
        const len = results.length
        response.send(`<p>Welcome to the phonebook!</p><p>The phonebook has info for ${len} people.</p><p>${new Date()}</p>`)
    })

})

// GET A SINGLE ENTRY
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(result => {
        response.json(result.toJSON())
    })
})

// GET ALL ENTRIES
app.get('/api/persons', (request, response) => {
    Person.find({}).then(results => {
        response.json(results.map(entry => entry.toJSON()))
    })
})

// CREATE A NEW ENTRY
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name) {
        response.status(400).json({
            'error': 'You must enter a name.'
        })
    }

    if (!body.number) {
        response.status(400).json({
            'error': 'You must enter a number.'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then( createdPerson => {
            console.log(`created ${createdPerson.name}`)
            response.json(createdPerson.toJSON())
        })
        .catch(error => {
            next(error)
        })
})

// UPDATE AN ENTRY

app.put('/api/persons/:id', (request, response, next) => {

    console.log(request.body)

    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })

        .then(updatedPerson => {

            response.json(updatedPerson.toJSON())

        })
        .catch(error => {
            next(error)
        })
})

// DELETE AN ENTRY
app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            console.log(`deleted a person: ${result}`)
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ 'error': 'unknown endpoint' })
}

app.use(unknownEndpoint)

// ERROR MIDDLEWARE

const errorMiddleware = (error, request, response, next) => {

    console.error(
        '----------',
        error.name,
        '----------'
    )

    if ( error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if ( error.name === 'ValidationError') {
        return response.status(400).send({ error: 'validation error' })
    }

    next(error)

}

app.use(errorMiddleware)


let PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Started the server on ${PORT}!`)
})