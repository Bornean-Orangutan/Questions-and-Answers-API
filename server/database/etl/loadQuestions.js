const { Answer, Question, AnswerPhoto } = require('../database.js');
const nReadlines = require('n-readlines');


// Data Order

// ID
// Product ID
// Body
// Date Written
// Asker Name
// Asker Email
// Reported
// Helpfull

const data = [];
let line;

const questionLines = new nReadlines('./server/database/etl/questions.csv');

line = questionLines.next();

while (line = questionLines.next()) {
  const row = line.toString('ascii').split(',');
  data.push({
    id: Number(row[0]),
    product_id: Number(row[1]),
    body: row[2],
    date: Date(row[3]),
    asker_name: row[4],
    asker_email: row[5],
    reported: Boolean(Number(row[6])),
    helpfulness: Number(row[7])
  });
}

async function saveData () {
  let chunkSize = 100000;
  for (let i = 0; i < data.length; i += chunkSize) {
    let chunk = data.slice(i, i + chunkSize);
    await Question.bulkCreate(chunk);
  }
}

saveData();
