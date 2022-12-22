const express = require('express');
const { Answer, Question, AnswerPhoto } = require('./database/database.js');

require('dotenv').config();

let app = express();

// Adjust on Front End
app.get('/qa/questions', (req, res) => {
  let product_id = req.query.product_id;
  let offset = req.query.page - 1 || 0;
  let count = req.query.count || 5;
  Question.findAll({
    limit: count,
    offset: offset,
    where: { product_id, reported: false },
    attributes: [['id', 'question_id'], ['body', 'question_body'], ['date', 'question_date'], 'asker_name', ['helpfulness', 'question_helpfulness'], 'reported'],
    include: [{
      model: Answer,
      attributes: ['id', 'body', 'date', 'answerer_name', 'helpfulness'],
      where: {reported: false},
      include: [{
        model: AnswerPhoto,
        as: 'photos',
        attributes: ['url']
      }]
    }]
  })
    .then(formattedData => {
      res.send({ product_id, results: formattedData})})
    .catch(err => {
      console.log(err);
      res.sendStatus(500)})
})

// Complete
app.get('/qa/questions/:question_id/answers', (req, res) => {
  let questionId = req.params.question_id;
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  Answer.findAll({
    limit: count,
    offset: page - 1,
    where: {questionId, reported: false},
    attributes: [['id', 'answer_id'], 'body', 'date', 'answerer_name', 'helpfulness'],
    include: {
      model: AnswerPhoto,
      as: 'photos',
      attributes: ['id', 'url']
    }
  })

  .then(data => res.send({question: questionId, page, count, results: data}))
  .catch(err => res.sendStatus(500))
})

// Complete
app.post('/qa/questions', (req, res) => {
  let product_id = req.query.product_id;
  let body = req.query.body;
  let asker_name = req.query.name;
  let asker_email = req.query.email;
  let date = new Date();
  Question.create({product_id, body, asker_email, asker_name, date, reported: false, helpfulness: 0})
    .then(() => res.send(200))
    .catch((err) => console.log(err))
})

// Complete
app.post('/qa/questions/:question_id/answers', (req, res) => {
  let questionId = req.params.question_id;
  let body = req.query.body;
  let answerer_name = req.query.name;
  let answerer_email = req.query.email;
  let date = new Date();
  let photos = JSON.parse(req.query.photos);
  console.log(typeof []);
  Answer.create({questionId, body, answerer_email, answerer_name, date, reported: false, helpfulness: 0})
    .then((answer) => {
      let photoList = [];
      photos.forEach(url => {
        photoList.push({url, answerId: answer.id})
      })
      return AnswerPhoto.bulkCreate(photoList);
    })
    .then(() => res.sendStatus(200))
    .catch((err) => console.log(err))
})

// Complete
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  let id = req.params.question_id;
  Question.increment('helpfulness', {where: {id}})
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500))
})

// Complete
app.put('/qa/questions/:question_id/report', (req, res) => {
  let id = req.params.question_id;
  Question.update({reported: true}, {where: {id}})
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500))
})

// Complete
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  let id = req.params.answer_id;
  Answer.increment('helpfulness', {where: {id}})
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500))
})

// Complete
app.put('/qa/answers/:answer_id/report', (req, res) => {
  let id = req.params.answer_id;
  Answer.update({reported: true}, {where: {id}})
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500))
})

app.listen(process.env.PORT, () => {
  console.log('Listening on Port', process.env.PORT);
})