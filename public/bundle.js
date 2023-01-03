/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./server/database/database.js":
/*!*************************************!*\
  !*** ./server/database/database.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { Sequelize } = __webpack_require__(/*! sequelize */ \"sequelize\");\n\nconst sequelize = new Sequelize('qna', '', '', { dialect: 'postgres', logging: false });\n\nsequelize.authenticate()\n  .then(() => console.log('Connected to database'))\n  .catch(() => console.log('Unable to connect to database'))\n\nconst Question = sequelize.define('questions', {\n  id: {\n    type: Sequelize.INTEGER,\n    primaryKey: true,\n    allowNull: false,\n    autoIncrement: true\n  },\n  product_id: {\n    type: Sequelize.INTEGER,\n    allowNull: false\n  },\n  body: { type: Sequelize.TEXT },\n  date: { type: Sequelize.DATE },\n  helpfulness: { type: Sequelize.INTEGER },\n  asker_name: { type: Sequelize.TEXT },\n  asker_email: { type: Sequelize.TEXT },\n  reported: { type: Sequelize.BOOLEAN }\n}, {indexes: [{ fields: ['product_id', 'reported']}]});\n\nconst Answer = sequelize.define('answers', {\n  id: {\n    type: Sequelize.INTEGER,\n    primaryKey: true,\n    allowNull: false,\n    autoIncrement: true\n  },\n  'body': { type: Sequelize.TEXT },\n  date: { type: Sequelize.DATE },\n  helpfulness: { type: Sequelize.INTEGER },\n  answerer_name: { type: Sequelize.TEXT },\n  answerer_email: { type: Sequelize.TEXT },\n  reported: { type: Sequelize.BOOLEAN }\n}, {indexes: [{ fields: ['reported']}, {fields: ['questionId']}]});\n\nAnswer.belongsTo(Question);\nQuestion.hasMany(Answer);\n\nconst AnswerPhoto = sequelize.define('answerphotos', {\n  id: {\n    type: Sequelize.INTEGER,\n    primaryKey: true,\n    allowNull: false,\n    autoIncrement: true\n  },\n  url: { type: Sequelize.TEXT }\n}, {indexes: [{fields: ['answerId']}]});\n\nAnswerPhoto.belongsTo(Answer);\nAnswer.hasMany(AnswerPhoto, {as: 'photos'});\n\nsequelize.sync();\n\nmodule.exports = { Question, Answer, AnswerPhoto }\n\n//# sourceURL=webpack://questions-and-answers-api/./server/database/database.js?");

/***/ }),

/***/ "./server/index.js":
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst { Answer, Question, AnswerPhoto } = __webpack_require__(/*! ./database/database.js */ \"./server/database/database.js\");\n\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)();\n\nlet app = express();\n\n// Adjust on Front End\napp.get('/qa/questions', (req, res) => {\n  Question.findAll({\n    limit: req.query.count || 5,\n    offset: req.query.page - 1 || 0,\n    where: { product_id: req.query.product_id, reported: false },\n    attributes: [['id', 'question_id'], ['body', 'question_body'], ['date', 'question_date'], 'asker_name', ['helpfulness', 'question_helpfulness'], 'reported'],\n    include: [{\n      model: Answer,\n      attributes: ['id', 'body', 'date', 'answerer_name', 'helpfulness'],\n      where: {reported: false},\n      include: [{\n        model: AnswerPhoto,\n        as: 'photos',\n        attributes: ['url']\n      }]\n    }]\n  })\n    .then(formattedData => {\n      res.send({ product_id: req.query.product_id, results: formattedData})})\n    .catch(err => {\n      res.sendStatus(500)})\n})\n\n// Complete\napp.get('/qa/questions/:question_id/answers', (req, res) => {\n  Answer.findAll({\n    limit: req.query.count || 5,\n    offset: req.query.page - 1 || 0,\n    where: {questionId: req.params.question_id, reported: false},\n    attributes: [['id', 'answer_id'], 'body', 'date', 'answerer_name', 'helpfulness'],\n    include: {\n      model: AnswerPhoto,\n      as: 'photos',\n      attributes: ['id', 'url']\n    }\n  })\n  .then(data => res.send({question: req.params.question_id, page: req.query.page || 1, count: req.query.count || 5, results: data}))\n  .catch(err => res.sendStatus(500))\n})\n\n// Complete\napp.post('/qa/questions', (req, res) => {\n  Question.create({product_id: req.query.product_id, body: req.query.body, asker_email: req.query.email, asker_name: req.query.name, date: new Date(), reported: false, helpfulness: 0})\n    .then(() => res.send(200))\n    .catch(() => res.send(500))\n})\n\n// Complete\napp.post('/qa/questions/:question_id/answers', (req, res) => {\n  let photos;\n  if (req.query.photos) {\n    photos = JSON.parse(req.query.photos);\n  } else {\n    photos = [];\n  }\n  Answer.create({questionId: req.params.question_id, body: req.query.body, answerer_email: req.query.email, answerer_name: req.query.name, date: new Date(), reported: false, helpfulness: 0})\n    .then((answer) => {\n      let photoList = [];\n      photos.forEach(url => {\n        photoList.push({url, answerId: answer.id})\n      })\n      return AnswerPhoto.bulkCreate(photoList);\n    })\n    .then(() => res.sendStatus(200))\n    .catch((err) => console.log(err))\n})\n\n// Complete\napp.put('/qa/questions/:question_id/helpful', (req, res) => {\n  let id = req.params.question_id;\n  Question.increment('helpfulness', {where: {id}})\n    .then(() => res.sendStatus(200))\n    .catch(() => res.sendStatus(500))\n})\n\n// Complete\napp.put('/qa/questions/:question_id/report', (req, res) => {\n  let id = req.params.question_id;\n  Question.update({reported: true}, {where: {id}})\n    .then(() => res.sendStatus(200))\n    .catch(() => res.sendStatus(500))\n})\n\n// Complete\napp.put('/qa/answers/:answer_id/helpful', (req, res) => {\n  Answer.increment('helpfulness', {where: {id: req.params.answer_id}})\n    .then(() => res.sendStatus(200))\n    .catch(() => res.sendStatus(500))\n})\n\n// Complete\napp.put('/qa/answers/:answer_id/report', (req, res) => {\n  Answer.update({reported: true}, {where: {id: req.params.answer_id}})\n    .then(() => res.sendStatus(200))\n    .catch(() => res.sendStatus(500))\n})\n\napp.listen(process.env.PORT, () => {\n  console.log('Listening on Port', process.env.PORT);\n})\n\n//# sourceURL=webpack://questions-and-answers-api/./server/index.js?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("sequelize");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./server/index.js");
/******/ 	
/******/ })()
;