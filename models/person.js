const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connection to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  } ,
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (message) => /^[0-9]{2,3}-[0-9]{3,}$/.test(message),
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj.__v
    delete returnedObj._id
  }
})


module.exports = mongoose.model('Person', personSchema)