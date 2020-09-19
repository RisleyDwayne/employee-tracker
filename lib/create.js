//CREATE entries in database
const DALobj = require('./DAL');
const cTable = require('console.table');
const inquirer = require('inquirer');

const DAL = new DALobj();

const prompt = (questions) => {
    return inquirer.prompt(questions);
};

const createEmployee = async () => {
    try {

        // inquirer data
        const [roles, employees] = await Promise.all([DAL.getRoles(), DAL.getEmployees()]);

        const newEmp = await prompt([
            {
                type: 'input',
                message: "Enter employee first name:",
                name: 'empFirst'
            },
            {
                type: 'input',
                message: "Enter employee last name:",
                name: 'empLast'
            },
            {
                name: "empRole",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    roles.forEach((role) => {
                        const roleObj = {
                            name: role.title,
                            value: role.id
                        }
                        choiceArray.push(roleObj)
                    })
                    return choiceArray;
                },
                message: "Select employee role:"
            },
            {
                name: "empMgr",
                type: "list",
                choices: function () {
                    const choiceArray = [{ name: "None", value: -1 }];
                    employees.forEach((employee) => {
                        const mgrObj = {
                            name: employee.firstName + " " + employee.lastName,
                            value: employee.id
                        }
                        choiceArray.push(mgrObj);
                    })
                    return choiceArray;
                },
                message: "Select this employee's manager:"
            },


        ]);

        // create employee in database
        await DAL.createEmployee(newEmp);
        console.log(`\n${newEmp.empFirst} ${newEmp.empLast} added to database.`);


    } catch (err) {
        console.log(err);
    }
}

// create department
const createDepartment = async () => {
    try {

        // department to create
        const newDept = await prompt([
            {
                type: 'input',
                message: "Enter new department:",
                name: 'deptName'
            },
        ]);

        // create department in database
        await DAL.createDepartment(newDept);
        console.log(`${newDept.deptName} department created!`);


    } catch (err) {
        console.log(err);
    }
}

// create role
const createRole = async () => {
    try {
        // populate department choices
        const departments = await DAL.getDepartments();

        const newRole = await prompt([
            {
                type: 'input',
                message: "Enter new role:",
                name: 'roleTitle'
            },
            {
                type: 'input',
                message: "Enter salary:",
                name: 'roleSalary',
                validate: function (salary) {
                    const valid = /\d+/.test(salary)
                    if (valid) {
                        return true;
                    } else {
                        return "Enter a valid salary.";
                    }
                }
            },
            {
                name: "roleDept",
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
                message: "Select a department for this role:"
            },

        ]);

        // create role in database
        await DAL.createRole(newRole);
        console.log(`${newRole.roleTitle} role createed!`);


    } catch (err) {
        console.log(err);
    }
}

module.exports = { createEmployee, createDepartment, createRole }