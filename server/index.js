const express = require('express');
const { Answer, Question, AnswerPhoto } = require('./database/database.js');

require('dotenv').config();

let app = express();

app.listen(process.env.PORT, () => {
  console.log('Listening on Port', process.env.PORT);
})