const { Answer } = require('../database.js');
const nReadlines = require('n-readlines');

// Data Order

// ID
// Question ID
// Body
// Date Written
// Answerer Name
// Answerer Email
// Reported
// Helpfull

const data = [];
let dataIndex = 0;
const chunkSize = 100000;
let line;

const questionLines = new nReadlines('./server/database/etl/answers.csv');

line = questionLines.next();

async function lineLoop() {
  while (line = questionLines.next()) {
    const row = line.toString('ascii').split(',');
    data[dataIndex] = {
      id: Number(row[0]),
      questionId: Number(row[1]),
      body: row[2],
      date: Date(row[3]),
      answerer_name: row[4],
      answerer_email: row[5],
      reported: Boolean(Number(row[6])),
      helpfulness: Number(row[7])
    };
    dataIndex ++;
    if (dataIndex >= chunkSize ) {
      await saveData();
      dataIndex = 0;
    }
  }
  await saveData();
}

async function saveData() {
  let chunk = data.slice(0, chunkSize);
  await Answer.bulkCreate(chunk);
}

lineLoop();
