// load the things we need
var mongoose = require('mongoose')

// define the schema for locations
var locationSchema = mongoose.Schema({
  'profile': {type: String, required: true},
  'places': {type: String, required: true}
})

module.exports = mongoose.model('Location', locationSchema)
