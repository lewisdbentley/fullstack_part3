const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(result => {
        console.log(`connected to mongodb: ${typeof result}`)
    })
    .catch((error) => {
        console.log('error conecting to mongoDB:', error.message)
    })

mongoose.set('useFindAndModify', false)

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 5,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)