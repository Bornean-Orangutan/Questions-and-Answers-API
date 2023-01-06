# Questions-and-Answers-API
The Questions and Answers API is a collection of endpoints that allow users to retreive and post questions and answers related to a specific project. The endpoints work in conjunction with the FEC webpage that displays the product information as a commercial website. In total there are eight endpoints for getting data, posting data, and marking helpful and reported values on the data.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Endpoints](#end-points)
- [Peformance](#performance)
- [Installation](#installation)
- [Contributors](#contributors)

## Tech Stack
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node](https://img.shields.io/badge/-Node-9ACD32?logo=node.js&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/-Express-DCDCDC?logo=express&logoColor=black&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## End Points
* Get Questions
  * Given a product ID and optional page count information, this endpoint will return a list of questions and the associated answers for the product.
* Get Answers
  * Given a question ID and optional page count information, this endpoint will return a list of answers for a particular question.
* Post Question
  * Given a body, name, and email, this endpoint will create a question and add it to the database.
* Post Answer
  * Given a body, name, images, and email, this endpoint will create an answer and add it to the database.
* Mark Question as Helpful
  * This endpoint will increment the helpful value of a question, whose total can be viewed directly from the webpgage.
* Mark Answer as Helpful
  * This endpoint will increment the helpful value of an answer, whose total can be viewed directly from the webpgage.
* Report Question
  * This will mark a question as reported. Reported questions are not return by the get request.
* Report Answer
  * This will mark an answer as reported. Reported answer are not return by the get request.

## Performance
To allow for 1000 RPS, this API was deployed over five different instances: a database instance, a load balancer instance, and three server handling instances. Below are key metric improvements compared to running the endpoints on a single instance. All utilize a throughput of 1000 RPS for 60 seconds.
* Get Questions
  * 63% to 0% Error Rate
  * 4655 ms to 1 ms Latency
* Get Answer
  * 38% to 0% Error Rate
  * 2602 ms to 1 ms Latency
* Post Question
  * 36% to 0% Error Rate
  * 2661 ms to 5 ms Latency
* Post Answer
  * 37% to 0% Error Rate
  * 2698 ms to 5 ms Latency
* Mark Quesiton as Helpful
  * 28% to 0% Error Rate
  * 2144 ms to 8 ms Latency
* Mark Answer as Helpful
  * 27% to 0% Error Rate
  * 2100 ms to 15 ms Latency
* Report Question
  * 37% to 0% Error Rate
  * 2593 ms to 9 ms Latency
* Get Questions
  * 41% to 0% Error Rate
  * 2773 ms to 20 ms Latency

## Installation Details

### How to install and use PostgreSQL
#### Installation
* Utilizing Homebrew to install: <b>brew install postgresql</b>
* Start postgresql service: <b>brew services start postegresql</b>
  * Stop: <b>brew services stop postgres</b>
* Connect to postgresql: <b>psql postgres</b>
* Install into Repo: <b>npm install pq</b>
#### Utilization
* Create a database: <b>CREATE DATABASE dbname;</b>
* Connect to database: <b>\c dbname</b>
* Read currrent database: <b>SELECT current_database();</b>
* List all tables: <b>\dt</b>
#### Update the Starting AutoIncrement Values for the tables
* ALTER SEQUENCE questions_id_seq RESTART WITH 3518964;
* ALTER SEQUENCE answers_id_seq RESTART WITH 6879307;
* ALTER SEQUENCE answerphotos_id_seq RESTART WITH 2063760;

## Contributors
<a href="https://github.com/Bornean-Orangutan/Questions-and-Answers-API/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Bornean-Orangutan/Questions-and-Answers-API" />
</a>