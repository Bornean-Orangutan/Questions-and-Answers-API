const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/qna');

let questionSchema = mongoose.Schema({
  id: Number,
  product_id: Number,
  body: String,
  date: Date,
  helpfulness: Number,
  asker_name: String,
  asker_email: String,
  reported: Boolean,
  answers: Array
})

let questionModel = mongoose.model('questions', questionSchema);

module.exports = { questionModel }