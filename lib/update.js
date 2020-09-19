//UPDATE entries in database
const DALobj = require('./DAL');
const inquirer = require('inquirer');

const DAL = new DALobj();

const prompt = (questions) => {
    return inquirer.prompt(questions);
};

const updateEmpRole = async () => {
    try {
        const [roles, employees] = await Promise.all([DAL.getRoles(), DAL.getEmployees()])

        const employee = await prompt([

            {
                name: "empId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    employees.forEach((emp) => {
                        const empObj = {
                            name: `${emp.first_name} ${emp.last_name}`,
                            value: emp.id
                        }
                        choiceArray.push(empObj)
                    })
                    return choiceArray;
                },
                message: "Select an employee to update their role"
            },

        ]);

        // prompt for role to update with
        const newRole = await prompt([
            {
                name: "roleId",
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
                message: "Choose the employee's new role:"
            },
        ]);

        await DAL.updateEmpRole(newRole.roleId, employee.empId)
        console.log("\n")
        console.log("Role Updated.")

    } catch (err) {
        console.log(err);
    }

}

const updateEmpMgr = async () => {
    try {
        const employees = await DAL.getEmployees();

        // select employee to update
        const employee = await prompt([
            {
                name: "empId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    employees.forEach((emp) => {
                        const empObj = {
                            name: `${emp.first_name} ${emp.last_name}`,
                            value: emp.id
                        }
                        choiceArray.push(empObj)
                    })
                    return choiceArray;
                },
                message: "Which employee's manager would you like to update?"
            },

        ]);

        const managers = employees.filter((emp) => {
            return emp.id !== employee.empId
        })

        // select new manager
        const newMgr = await prompt([
            {
                name: "mgrId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    managers.forEach((mgr) => {
                        const mgrObj = {
                            name: `${mgr.first_name} ${mgr.last_name}`,
                            value: mgr.id
                        }
                        choiceArray.push(mgrObj)
                    })
                    return choiceArray;
                },
                message: "Choose the employee's new manager:"
            },
        ]);

        await DAL.updateEmpMgr(newMgr.mgrId, employee.empId)
        console.log("\n")
        console.log("Manager Updated.")

    } catch (err) {
        console.log(err);
    }

}


module.exports = { updateEmpRole, updateEmpMgr }