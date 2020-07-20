const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const url = process.env.MONGODB_URI

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then( result => {
        console.log(`connected to mongodb: ${ typeof result }`)
    })
    .catch((error) => {
        console.log('there was an error connecting to mongodb:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: { type: String, minlength: 5, required: true, unique: true },
    number: { type: String, minlength: 8, required: true, unique: true }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, newObject) => {
        // newObject.oldId = newObject.id
        newObject.id = newObject._id.toString()
        delete newObject._id
        delete newObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)