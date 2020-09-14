const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = require("./lib/dbConnection");


const prompt = (prompts) => {
    return inquirer.prompt(prompts);
}

const userActions = [

    {
        type: "list",
        message: "Select a function",
        name: "action",
        choices: [
            'View All Employees',
            'View All Employees by Department',
            'View All Employees by Manager',
            'Add Employee',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'View All Roles',
            'Add Role',
            'Remove Role',
            'View All Departments',
            'View Budget by Department',
            'Add Department',
            'Remove Department',
            'Exit Application'
        ]
    }

];

function beginApp(){
    
}