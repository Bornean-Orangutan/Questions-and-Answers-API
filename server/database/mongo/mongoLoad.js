const { questionModel } = require('./mongoScheme.js');
const nReadlines = require('n-readlines');
require('dotenv').config();


const data = [];
let dataIndex = 0;
const chunkSize = process.env.CHUNKSIZE;
let line;

//const questionLines = new nReadlines('./server/database/etl/questions_sample.csv');
//let questionLines = new nReadlines('./server/database/etl/answers_sample.csv');
let questionLines = new nReadlines('./server/database/etl/answers_photos_sample.csv');

line = questionLines.next();

function loadQuestions() {
  while (line = questionLines.next()) {
    const row = line.toString('ascii').split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    let newQuestion = {
      id: Number(row[0]),
      product_id: Number(row[1]),
      body: row[2].slice(1, row[2].length - 1),
      date: Date(row[3]),
      asker_name: row[4].slice(1, row[4].length - 1),
      asker_email: row[5].slice(1, row[5].length - 1),
      reported: Boolean(Number(row[6])),
      helpfulness: Number(row[7])
    };
    let questionDoc = new questionModel(newQuestion);
    questionDoc.save((err, doc) => {
      if (err) {
        console.log(err);
      }
    })
  }
}

async function loadAnswers() {
  while (line = questionLines.next()) {
    const row = line.toString('ascii').split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    let newAnswer = {
      id: Number(row[0]),
      questionId: Number(row[1]),
      body: row[2],
      date: Date(row[3]),
      answerer_name: row[4],
      answerer_email: row[5],
      reported: Boolean(Number(row[6])),
      helpfulness: Number(row[7]),
      photos: photos[Number(row[0])]
    };
    console.log('ADD')
    await questionModel.updateOne(
      {id: Number(row[1])},
      { $push: { answers: newAnswer} }
    )
  }
}

let photos = [];
async function loadPhotos() {
  while (line = questionLines.next()) {
    const row = line.toString('ascii').split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    let newPhoto = {
      id: Number(row[0]),
      answerId: Number(row[1]),
      url: row[2],
    };
    photos[Number(row[1])] = newPhoto;
  }
}

loadPhotos();

questionLines = new nReadlines('./server/database/etl/answers_sample.csv');
line = questionLines.next();

loadAnswers();