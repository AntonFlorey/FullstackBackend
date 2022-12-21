const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log("please provide the password for anton")
    process.exit(1)
}

const pwd = process.argv[2]

const url = `mongodb+srv://anton:${pwd}@cluster0.kvbhsud.mongodb.net/phoneBook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
    mongoose.connect(url)
    .then((result) => {
        console.log("retrieving all numbers...")
        Person.find({}).then(result => {
            result.forEach(person => {
              console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
          })
    })

}else{
    mongoose.connect(url)
    .then((result) => {
        console.log("connected to DB")
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
        })
        return person.save()
    })
    .then(() => {
        console.log(`added ${process.argv[3]} with number ${process.argv[4]} to the phonebook`)
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}