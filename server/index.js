const express = require('express');
var cors = require('cors');
const { Answer, Question, AnswerPhoto } = require('./database/database.js');

require('dotenv').config();

let app = express();

app.use(cors());

app.get('/qa/questions', (req, res) => {
  Question.findAll({
    limit: req.query.count || 5,
    offset: req.query.page - 1 || 0,
    where: { product_id: req.query.product_id, reported: false },
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
      res.send({ product_id: req.query.product_id, results: formattedData})})
    .catch(err => {
      res.sendStatus(500)})
})

app.get('/qa/questions/:question_id/answers', (req, res) => {
  Answer.findAll({
    limit: req.query.count || 5,
    offset: req.query.page - 1 || 0,
    where: {questionId: req.params.question_id, reported: false},
    attributes: [['id', 'answer_id'], 'body', 'date', 'answerer_name', 'helpfulness'],
    include: {
      model: AnswerPhoto,
      as: 'photos',
      attributes: ['id', 'url']
    }
  })
  .then(data => res.send({question: req.params.question_id, page: req.query.page || 1, count: req.query.count || 5, results: data}))
  .catch(err => res.sendStatus(500))
})

app.post('/qa/questions', (req, res) => {
  console.log(req.params);
  Question.create({product_id: req.query.product_id, body: req.query.body, asker_email: req.query.email, asker_name: req.query.name, date: new Date(), reported: false, helpfulness: 0})
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500))
})

app.post('/qa/questions/:question_id/answers', (req, res) => {
  console.log(req.params);
  let photos;
  if (req.query.photos) {
    photos = JSON.parse(req.query.photos);
  } else {
    photos = [];
  }
  Answer.create({questionId: req.params.question_id, body: req.query.body, answerer_email: req.query.email, answerer_name: req.query.name, date: new Date(), reported: false, helpfulness: 0})
    .then((answer) => {
      let photoList = [];
      photos.forEach(url => {
        photoList.push({url, answerId: answer.id})
      })
      return AnswerPhoto.bulkCreate(photoList);
    })
    .then(() => res.sendStatus(200))
    .catch((err) => res.sendStatus(500))
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
  Answer.increment('helpfulness', {where: {id: req.params.answer_id}})
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500))
})

// Complete
app.put('/qa/answers/:answer_id/report', (req, res) => {
  Answer.update({reported: true}, {where: {id: req.params.answer_id}})
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500))
})

app.listen(process.env.PORT, () => {
  console.log('Listening on Port', process.env.PORT);
})