const { Answer, Question, AnswerPhoto } = require('../database.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const csv = require('csv-parser');

const nReadlines = require('n-readlines');
const questionLines = new nReadlines('./server/database/etl/questions.csv');

let line;
let lineNumber = 2;

const allData = [];

// const createData = (data) => {
//   Question.create({
//     id: Number(data[0]),
//     product_id: Number(data[1]),
//     body: data[2],
//     date: Date(data[3]),
//     asker_name: data[4],
//     asker_email: data[5],
//     reported: Boolean(Number(data[6])),
//     helpfulness: Number(data[7])
//   })
// }

line = questionLines.next();
while (line = questionLines.next()) {
  //console.log(`Line ${lineNumber} has: ${line.toString('ascii')}`);
  //createData(line.toString('ascii').split(','));
  const data = line.toString('ascii').split(',');
  allData.push({
    id: Number(data[0]),
    product_id: Number(data[1]),
    body: data[2],
    date: Date(data[3]),
    asker_name: data[4],
    asker_email: data[5],
    reported: Boolean(Number(data[6])),
    helpfulness: Number(data[7])
  });
  lineNumber++;
}

console.log('Data Length', allData.length);
console.log('End of Files');

async function saveData () {
  let chunkSize = 10;
  for (let i = 0; i < allData.length; i ++) {
    //const chunk = allData.slice(i, i + chunkSize);
    console.log('I: ', allData[i].date);
    await Question.create(allData[i]);
  }
}
saveData();
// Data Order

// ID
// Product ID
// Body
// Date Written
// Asker Name
// Asker Email
// Reported
// Helpfull

// fs.readFile('./server/database/etl/questions.csv', (err, data) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log('Parsing File');
//   parse(data, {columns: false, trim: true, from_line: 2}, (err, rows) => {
//     console.log('Adding File to Scheme')
//     Question.bulkCreate(rows)
//       .then(() => {console.log('CREATED')})
//   });
// })


// const data = [];
// fs.createReadStream('./server/database/etl/questions.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     console.log('Push')
//     data.push(row);
//   })
//   .on('end',  async () => {
//     console.log('At End')
//     // Use the bulkInsert method of the model to insert the data
//     const chunkSize = 1000; // Set the chunk size to a value that works for your system
//     for (let i = 0; i < data.length; i += chunkSize) {
//       const chunk = data.slice(i, i + chunkSize);
//       await Question.bulkInsert(chunk);
//     }
//   });

