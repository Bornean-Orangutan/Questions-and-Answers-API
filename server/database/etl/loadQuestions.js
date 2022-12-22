const { Question } = require('../database.js');
const nReadlines = require('n-readlines');
require('dotenv').config();

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
let dataIndex = 0;
const chunkSize = process.env.CHUNKSIZE;
let line;

const questionLines = new nReadlines('./server/database/etl/questions.csv');

line = questionLines.next();

async function lineLoop() {
  while (line = questionLines.next()) {
    const row = line.toString('ascii').split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    data[dataIndex] = {
      id: Number(row[0]),
      product_id: Number(row[1]),
      body: row[2].slice(1, row[2].length - 1),
      date: Date(row[3]),
      asker_name: row[4].slice(1, row[4].length - 1),
      asker_email: row[5].slice(1, row[5].length - 1),
      reported: Boolean(Number(row[6])),
      helpfulness: Number(row[7])
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
  await Question.bulkCreate(chunk);
}

lineLoop();