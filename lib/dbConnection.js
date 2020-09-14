//create mySQL connection to export
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: 'root',

    database: 'employees_db'
});

connection.connect(error => {
    if (error) throw error;
});

module.exports = connection;