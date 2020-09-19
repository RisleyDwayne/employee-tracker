//DELETE entries in database
const DALobj = require('./DAL');
const inquirer = require('inquirer');

const DAL = new DALobj();

const prompt = (questions) => {
    return inquirer.prompt(questions);
};

const deleteEmployee = async () => {
    try {
        const employees = await DAL.getEmployees();
        const deleteEmp = await prompt([

            {
                name: "empId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    employees.forEach((emp) => {
                        const empObj = {
                            name: `${emp.firstName} ${emp.lastName}`,
                            value: emp.id
                        }
                        choiceArray.push(empObj)
                    })
                    return choiceArray;
                },
                message: "Select Employee to remove"
            },

        ]);

        //selected employee is manager
        const [directReports, empToRemove] = await Promise.all([DAL.getEmployeesWithManager(deleteEmp.empId), DAL.getEmployeeById(deleteEmp.empId)]);

        const confirm = await prompt([
            {
                name: "yN",
                type: "confirm",
                default: false,
                message: `\nAre you sure you want to remove ${empToRemove[0].firstName} ${empToRemove[0].lastName}? THIS CANNOT BE UNDONE`
            }
        ]);
        if (confirm.yN) {

            directReports.forEach(async (emp) => {
                try {
                    await DAL.updateEmployeeManager(null, emp.id)
                } catch (err) {
                    console.log(err)
                }
            })
            
            await DAL.delete("employee", deleteEmp.empId);
            console.log(`\n${empToRemove[0].firstName} ${empToRemove[0].lastName} has been deleted.`);
        }


    } catch (err) {
        console.log(err)
    }
}


const deleteDepartment = async () => {
    try {
        const departments = await DAL.getDepartments();
        const remove = await prompt([

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
                        choiceArray.push(deptObj);
                    })
                    return choiceArray;
                },
                message: "Select department to delete"
            },

        ]);

        const deptRoles = await DAL.getRolesByDept(remove.deptId);
        // warn user that roles will be deleted, as well as employees with those roles
        if (deptRoles.length) {
            console.log("\n------------------------\n")
            console.log("This department contains roles in use:");
            deptRoles.forEach((role) => {
                console.log(role.title)
            })
            console.log("If you delete this department, all roles and employees in this department will be deleted");
            console.log("\n------------------------\n");
        }
        const removeDept = await DAL.getDeptById(remove.deptId);
        
        const confirm = await prompt([
            {
                name: "yN",
                type: "confirm",
                default: false,
                message: `\nAre you sure you want to delete ${removeDept[0].department}? THIS CANNOT BE UNDONE!`
            }
        ]);
        if (confirm.yN) {
            // delete department
            await DAL.delete("department", remove.deptId);
            console.log(`\n${removeDept[0].department} department has been deleted.`);

        }

    } catch (err) {
        console.log(err)
    }
}

const deleteRole = async () => {
    try {
        
        const roles = await DAL.getRoles();
        const remove = await prompt([

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
                message: "Which role would you like to remove?"
            },

        ]);

        const roleEmps = await DAL.getEmployeesByRole(remove.roleId);
        if (roleEmps.length) {
            console.log("\n------------------------\n")
            console.log("This role is assigned to active employees:")
            roleEmps.forEach((emp) => {
                console.log(`${emp.firstName} ${emp.lastName}`)
            })
            console.log("If you delete this role, all employees assigned this role will also be deleted");
            console.log("\n------------------------\n")
        }

        // get role to be deleted
        const removeRole = await DAL.getRoleById(remove.roleId);
        const confirm = await prompt([
            {
                name: "yN",
                type: "confirm",
                default: false,
                message: `\nAre you sure you want to delete ${removeRole[0].title}? THIS CANNOT BE UNDONE!`
            }
        ]);
        if (confirm.yN) {
            await DAL.delete("role", remove.roleId)
            console.log(`\n${removeRole[0].title} role has been deleted.`);
        }

    } catch (err) {
        console.log(err)
    }
}



module.exports = { deleteDepartment, deleteEmployee, deleteRole }
