const { AnswerPhoto } = require('../database.js');
const nReadlines = require('n-readlines');
require('dotenv').config();

// Data Order

// ID
// Answer ID
// url

const data = [];
let dataIndex = 0;
const chunkSize = process.env.CHUNKSIZE;
let line;

const questionLines = new nReadlines('./server/database/etl/answers_photos_sample.csv');

line = questionLines.next();

async function lineLoop() {
  while (line = questionLines.next()) {
    const row = line.toString('ascii').split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    data[dataIndex] = {
      id: Number(row[0]),
      answerId: Number(row[1]),
      url: row[2].slice(1, row[2].length - 1),
    };
    dataIndex ++;
    if (dataIndex >= chunkSize ) {
      await saveData(data);
      dataIndex = 0;
    }
  }
  await saveData(data.splice(0, dataIndex));
}

async function saveData(data) {
  let chunk = data.slice(0, chunkSize);
  await AnswerPhoto.bulkCreate(chunk);
}

lineLoop();
