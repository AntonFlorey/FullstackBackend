/* global process */

const mongoose = require("mongoose")
mongoose.set("strictQuery", true)

const url = process.env.MONGODB_URI
const number_pattern = /\d{2,3}-\d*/g
console.log("connecting to", url)

mongoose.connect(url)
  .then(_ => {
    console.log("connected to mongoDB")
  })
  .catch(err => {
    console.log("could not connect to mongoDB. Error: ", err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (val => {
        const matches = val.match(number_pattern)
        console.log(matches)
        if (matches) {
          const num = matches[0]
          console.log("first matched:", num)
          return num === val
        }
        return false
      }),
      message: props => `${props.value} is not a valid phone number`
    }
  }
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  } 
})

module.exports = mongoose.model("Person", personSchema)