require('dotenv').config();
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('qna', 'ubuntu', 'ubuntu', { dialect: 'postgres', logging: false , host: process.env.PGPORT});

sequelize.authenticate()
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Unable to connect to database'))

const Question = sequelize.define('questions', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  body: { type: Sequelize.TEXT },
  date: { type: Sequelize.DATE },
  helpfulness: { type: Sequelize.INTEGER },
  asker_name: { type: Sequelize.TEXT },
  asker_email: { type: Sequelize.TEXT },
  reported: { type: Sequelize.BOOLEAN }
}, {indexes: [{ fields: ['product_id', 'reported']}]});

const Answer = sequelize.define('answers', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  'body': { type: Sequelize.TEXT },
  date: { type: Sequelize.DATE },
  helpfulness: { type: Sequelize.INTEGER },
  answerer_name: { type: Sequelize.TEXT },
  answerer_email: { type: Sequelize.TEXT },
  reported: { type: Sequelize.BOOLEAN }
}, {indexes: [{ fields: ['reported']}, {fields: ['questionId']}]});

Answer.belongsTo(Question);
Question.hasMany(Answer);

const AnswerPhoto = sequelize.define('answerphotos', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  url: { type: Sequelize.TEXT }
}, {indexes: [{fields: ['answerId']}]});

AnswerPhoto.belongsTo(Answer);
Answer.hasMany(AnswerPhoto, {as: 'photos'});

sequelize.sync();

module.exports = { Question, Answer, AnswerPhoto }