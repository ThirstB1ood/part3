const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connection to', url)

mongoose.connect(url)
  .then(result => {
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