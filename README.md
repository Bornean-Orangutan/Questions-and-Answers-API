# Questions-and-Answers-API


## Technical Detail

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