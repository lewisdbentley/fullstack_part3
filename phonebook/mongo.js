const mongoose = require('mongoose')


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
}

if ( process.argv.length < 3) {
    console.log('you need to set a password')
}

if ( process.argv.length === 3) {

    const password = process.argv[2]

    const url = `mongodb+srv://lewisdbentley:${ password }@cluster0.qnuen.mongodb.net/<phonebook>?retryWrites=true&w=majority`

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const Schema = mongoose.Schema

    const personSchema =  new Schema({
        name: String,
        number: String,
        Id: Number
    })

    const personModel = mongoose.model('Person', personSchema)

    personModel
        .find({})
        .then(result => {
            console.log('phonebook:')
            result.forEach(entry => {
                console.log(`${ entry.name } ${ entry.number }`)
            })
            mongoose.connection.close()
        })

}

if ( process.argv.length > 3 ) {

    const password = process.argv[2]

    const url = `mongodb+srv://lewisdbentley:${ password }@cluster0.qnuen.mongodb.net/<phonebook>?retryWrites=true&w=majority`

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const Schema = mongoose.Schema

    const personSchema =  new Schema({
        name: String,
        number: String,
        Id: Number
    })

    const personModel = mongoose.model('Person', personSchema)

    const instance = new personModel()
    instance.name = process.argv[3]
    instance.number = process.argv[4]
    instance.Id = getRandomInt(9999)

    instance.save( result => {
        console.log(`added ${ instance.name } number ${ instance.number } to phonebook: ${ result }`)
        mongoose.connection.close()
    })
}