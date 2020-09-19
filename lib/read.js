//READ entries in database
const DALobj = require('./DAL');
const cTable = require("console.table");
const inquirer = require('inquirer');

const DAL = new DALobj();

const prompt = (questions) => {
    return inquirer.prompt(questions);
};

const readEmployees = async () => {
    try {
        const rows = await DAL.getEmployees();
        console.table(rows);

    } catch (err) {
        console.log(err);
    }
}
const readRoles = async () => {
    try {
        const rows = await DAL.getRoles()
        console.table(rows);

    } catch (err) {
        console.log(err);
    }
}

const readDepartments = async () => {
    try {
        const rows = await DAL.getDepartments()
        console.table(rows);

    } catch (err) {
        console.log(err)
    }
}

const readEmployeesByDept = async () => {
    try {
        const departments = await DAL.getDepartments();
        const deptChoice = await prompt([
            {
                name: "deptId",
                type: "list",
                choices: function () {
                    const choices = [];
                    departments.forEach((dept) => {
                        const deptObj = {
                            name: dept.department,
                            value: dept.id
                        }
                        choices.push(deptObj)
                    })
                    return choices;
                },
                message: "Select department to read employees"
            },

        ]);

        // employees from selected department
        const rows = await DAL.getEmployeesByDept(deptChoice.deptId);
        console.log("\n");
        console.table(rows);

    } catch (err) {
        console.log(err);
    }
}

const readEmployeesByMgr = async () => {
    try {
        const employees = await DAL.getEmployees();
        const chosenMgr = await prompt([
            {
                name: "managerId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    employees.forEach((emp) => {
                        const mgrObj = {
                            name: `${emp.firstName} ${emp.lastName}`,
                            value: emp.id
                        }
                        choiceArray.push(mgrObj);
                    })
                    return choiceArray;
                },
                message: "Select manager to read employees"
            },

        ]);

        // employees from selected manager
        const rows = await DAL.getEmployeesByManager(chosenMgr.id);
 
        if (rows.length === -1) {
            console.log(`This person has no subordinate employees.`);
        } else {
            // show found employee data
            console.log("\n------------------------\n");
            console.table(rows);
        }

    } catch (err) {
        console.log(err);
    }
}

const readBudgetByDept = async () => {
    try {
        const departments = await DAL.getDepartments();
        const deptChoice = await prompt([
            {
                name: "deptId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    departments.forEach((dept) => {
                        const deptObj = {
                            name: dept.department,
                            value: dept.id
                        }
                        choiceArray.push(deptObj)
                    })
                    return choiceArray;
                },
                message: "Select a department to read the budget"
            },
        ]);

        const rows = await DAL.getBudgetByDept(deptChoice.deptId);

        if (rows.length<1) {
            console.log(`\n${deptChoice.name} has no active employees.`);
            
        } else {
            console.log("\n")
            console.table(rows);
        }

    } catch (err) {
        console.log(err)
    }
}

module.exports = { readEmployees, readRoles, readDepartments, readEmployeesByDept, readEmployeesByMgr, readBudgetByDept }