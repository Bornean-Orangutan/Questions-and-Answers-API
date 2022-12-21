const { AnswerPhoto } = require('../database.js');
const nReadlines = require('n-readlines');

// Data Order

// ID
// Answer ID
// url


const data = [];
let line;

const questionLines = new nReadlines('./server/database/etl/answers_photos.csv');

line = questionLines.next();

while (line = questionLines.next()) {
  const row = line.toString('ascii').split(',');
  data.push({
    id: Number(row[0]),
    answer_id: Number(row[1]),
    url: row[2],
  });
}

async function saveData () {
  let chunkSize = 100000;
  for (let i = 0; i < data.length; i += chunkSize) {
    let chunk = data.slice(i, i + chunkSize);
    await AnswerPhoto.bulkCreate(chunk);
  }
}

saveData();