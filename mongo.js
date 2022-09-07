const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

// if(process.argv.length < 4) {
//   console.log('Please provide the name as an argument')
//   process.exit(1)
// }

// if(process.argv.length < 5) {
//   console.log('Please provide the number as an argument')
//   process.exit(1)
// }

const password = process.argv[2]

const url = `mongodb+srv://Danya:${password}@cluster0.7dst3iw.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
  mongoose
    .connect(url)
    .then(result => {
      console.log('connected')
      console.log('phonebook')
      Person.find({})
      .then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
    })
    .catch(err => console.log(err))
}

if(process.argv.length === 5) {
  mongoose
    .connect(url)
    .then(result => {
      console.log('connected')
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })

      Note.find({}).then(result => {
        result.forEach(note => {
          console.log(note)
        })
        mongoose.connection.close()
      })

      return person.save()
    })
    .then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(err => console.log(err))
}