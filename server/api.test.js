const axios = require('axios');
const { Answer, Question, AnswerPhoto } = require('./database/database.js');

jest.setTimeout(60000);

test('Get Products Returns a list of products', () => {
  return axios.get('http://localhost:3000/qa/questions', {params: {product_id: 1}})
    .then(res => res.data.results[0])
    .then(question => {
      expect(question.question_id).toBe(1)
    })

})

test('Get Answers Returns a list of answers', () => {
  return axios.get('http://localhost:3000/qa/questions/1/answers',)
    .then(res => res.data.results[0])
    .then(question => {
      expect(question.answer_id).toBe(5)
    })
})

let questionID, answerID;
test('Question is created', () => {
  return axios.post('http://localhost:3000/qa/questions', {},
  {params: {
    product_id: 2,
    body: 'Test Data',
    name: 'Jest Test',
    email: 'jest@gmail.com'
  }})
    .then(res => {
      expect(res.status).toBe(200)
    })
})

test('Answer is created', () => {
  return axios.post('http://localhost:3000/qa/questions/2/answers', {},
  {params: {
    body: 'Test Data',
    name: 'Jest Test',
    email: 'jest@gmail.com',
    photos: '["one","two"]'
  }})
    .then(res => {
      expect(res.status).toBe(200)
    })
})

test('Helpful API Increases helpfulness count in Questions', () => {
  let helpCount;
  return Question.findAll({ where: {id: 1}})
    .then(question => helpCount = question[0].helpfulness)
    .then(() => axios.put('http://localhost:3000/qa/questions/1/helpful'))
    .then(() => Question.findAll({ where: {id: 1}}))
    .then(question => expect(question[0].helpfulness).toBe(helpCount + 1))
})

test('Helpful API Increases helpfulness count in Answers', () => {
  let helpCount;
  return Answer.findAll({ where: {id: 1}})
    .then(answer => helpCount = answer[0].helpfulness)
    .then(() => axios.put('http://localhost:3000/qa/answers/1/helpful'))
    .then(() => Answer.findAll({ where: {id: 1}}))
    .then(answer => expect(answer[0].helpfulness).toBe(helpCount + 1))
})

test('Report marks Question as reported', () => {
  return axios.put('http://localhost:3000/qa/questions/5/report')
    .then(() => Question.findAll({ where: {id: 5}}))
    .then(questions => expect(questions[0].reported).toBe(true));
})

test('Report marks answer as reported', () => {
  return axios.put('http://localhost:3000/qa/answers/5/report')
    .then(() => Answer.findAll({ where: {id: 5}}))
    .then(answers => expect(answers[0].reported).toBe(true));
})
