const express = require('express');
const { Answer, Question, AnswerPhoto } = require('./database/database.js');

require('dotenv').config();

let app = express();

// app.get('/qa', (req, res) => {
//   let product_id = req.query.product_id;
//   let page = req.query.page || 1;
//   let count = req.query.count || 5;
//   req.send(200);
// })

app.get('/qa/questions', (req, res) => {
  let product_id = req.query.product_id;
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  Question.findAll({
    where: { product_id, reported: false },
    attributes: [['id', 'question_id'], ['body', 'question_body'], ['date', 'question_date'], 'asker_name', ['helpfulness', 'question_helpfulness'], 'reported'],
    include: [{
      model: Answer,
      attributes: ['id', 'body', 'date', 'answerer_name', 'helpfulness'],
      where: {reported: false},
      include: [{
        model: AnswerPhoto,
        as: 'photos',
        attributes: ['id', 'url']
      }]
    }]
  })
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        let answerObject = {};
        let answerArray = data[i].answers;
        answerArray.forEach(answer => {
          answerObject[answer.id] = answer;
        })
        data[i].answers = answerObject;
      }
      //console.log(data[0].answers)
      return data;
    })
    .then(formattedData => {
      console.log(formattedData[0].answers)
      //res.send({ product_id, results: formattedData})})
      res.json(formattedData[0])})
    .catch(err => {
      console.log(err);
      res.sendStatus(500)})
})

app.listen(process.env.PORT, () => {
  console.log('Listening on Port', process.env.PORT);
})