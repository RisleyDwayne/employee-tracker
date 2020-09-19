const DAL = require("./lib/DAL");
const inquirer = require("inquirer");
const cTable = require("console.table");
const connection = require("./lib/dbConnection");
const createFuncs = require("./lib/create");
const readFuncs = require("./lib/read");
const updateFuncs = require("./lib/update");
const deleteFuncs = require("./lib/delete");


const prompt = (prompts) => {
    return inquirer.prompt(prompts);
}

const actionFuncs = {
    'View All Employees': readFuncs.readEmployees,
    'View All Employees by Department': readFuncs.readEmployeesByDept,
    'View All Employees by Manager': readFuncs.readEmployeesByMgr,
    'Add Employee': createFuncs.createEmployee,
    'Remove Employee': deleteFuncs.deleteEmployee,
    'Update Employee Role': updateFuncs.updateEmpRole,
    'Update Employee Manager': updateFuncs.updateEmpMgr,
    'View All Roles': readFuncs.readRoles,
    'Add Role': createFuncs.createRole,
    'Remove Role': deleteFuncs.deleteRole,
    'View All Departments': readFuncs.readDepartments,
    'View Budget by Department': readFuncs.readBudgetByDept,
    'Add Department': createFuncs.createDepartment,
    'Remove Department': deleteFuncs.deleteDepartment,
    'Exit Application': exit
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

function exit() {
    console.log("Application closing...");
    connection.end();
    process.exit();
};

async function init(){

    try {
        console.log("\n------------------------\n");
        const choice = await prompt(userActions);
        console.log("\n------------------------\n");
        await actionFuncs[choice.action]();
        init();
    }catch (err) {
        console.log(err);
    }

}

function start(){
    console.log("Welcome to the employee tracker app! \n");
    init();
}

start();