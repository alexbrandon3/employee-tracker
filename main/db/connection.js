const mysql = require("mysql2");
const util = require("util")

// Connect to database
const connection = mysql.createConnection(
    {
      host: "localhost",
      // MySQL username,
      port: 3306,
      user: "root",
      // TODO: Add MySQL password here
      password: "1234",
      database: "employees_db",
    },
    console.log(`Connected to the employees_db database.`)
  );

  connection.query = util.promisify(connection.query)

  connection.connect(err =>{if (err) {console.log(err)}})

  

  module.exports = connection;
