require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))


// GET Homepage
app.get('/', (request, response) => {
    response.send('<h1>Welcome to my site</h1>')
    console.log('get homepage')
})

// GET all notes
app.get('/api/notes', (request, response) => {

    Note.find({}).then(notes => {
        response.json(notes.map(note => note.toJSON()))
    })
    console.log('get all notes')
})

// GET note
app.get('/api/notes/:id', (request, response, next) => {

    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note.toJSON())
                console.log('find individual note:', note.content)
            } else {
                response.sendStatus(404).end()
            }
        })
        .catch(error => next(error))
})

// POST note
app.post('/api/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note
        .save()
        .then(savedNote => {
            return savedNote.toJSON()
        })
        .then(savedAndFormattedNote => {
            response.json(savedAndFormattedNote)
        })
        .catch( error => {
            next(error)
        })
})

// DELETE note

app.delete('/api/notes/:id/delete', (request, response, next) => {

    Note.findByIdAndRemove(request.params.id)
        .then( result => {
            console.log(`attempted to findByIdAndRemove: ${result}`)
            response.status(204).end()
        })
        .catch( error => {
            console.log('deleted already')
            next(error)
        })
})

// TOGGLE IMPORTANCE

app.put('/api/notes/:id', (request, response, next) => {

    const body = request.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            console.log(updatedNote)
            response.json(updatedNote.toJSON())
        })
        .catch(error => next(error))
})

// UNKNOWN ENDPOINT

const unknownEndpoint = (request, response) => {

    return response.status(404).send({ error: 'unknown endpoint reached' })

}

app.use(unknownEndpoint)

// ERROR MIDDLEWARE

const errorMiddleware = (error, request, response, next) => {

    console.error(
        '----------',
        error.message,
        '----------'
    )

    if ( error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if ( error.name === 'ValidationError' ) {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorMiddleware)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`the server is running on port ${PORT}!`)
})


