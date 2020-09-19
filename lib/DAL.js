const connection = require("./dbConnection");
const util = require('util');


const query = util.promisify(connection.query).bind(connection);


// data access layer - to query dbConnection
class DAL {
    constructor(query) {
        this.query = query;
    }

    getEmployees() {
        return query('SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name AS department, CONCAT(manager.firstName, " ", manager.lastName) manager_name FROM ((employee LEFT JOIN employee manager ON manager.id = employee.manager_id) INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id) ORDER BY employee.id');
    }

    getEmployeeById(id) {
        return query('SELECT * from employee WHERE id = ?', [id]);
    }

    getEmployeesByDept(deptId) {
        return query('SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name AS department, CONCAT(manager.firstName, " ", manager.lastName) manager_name FROM ((employee LEFT JOIN employee manager ON manager.id = employee.manager_id) INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id) WHERE department.id = ? ORDER BY employee.id', [deptId]);
    }

    getEmployeesByManager(mgrId) {
        return query('SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name AS department, CONCAT(manager.firstName, " ", manager.lastName) manager_name FROM ((employee LEFT JOIN employee manager ON manager.id = employee.manager_id) INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id) WHERE employee.manager_id = ? ORDER BY employee.id', [mgrId]);
    }

    getEmployeesByRole(roleId) {
        return query('SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name AS department, CONCAT(manager.firstName, " ", manager.lastName) manager_name FROM ((employee LEFT JOIN employee manager ON manager.id = employee.manager_id) INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id) WHERE role.id = ? ORDER BY employee.id', [roleId]);
    }

    getEmployeesWithManager(mgrId) {
        return query('SELECT employee.id, employee.firstName, employee.lastName, employee.manager_id FROM employee WHERE employee.manager_id = ? ORDER BY employee.id', [mgrId]);
    }

    getRoles() {
        return query('SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id');
    }

    getRolesByDept(deptId) {
        return query('SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id WHERE department.id = ?', [deptId]);
    }

    getRoleById(roleId) {
        return query('SELECT role.id, role.title, role.salary FROM role WHERE role.id = ?', [roleId]);
    }

    getDepartments() {
        return query('SELECT department.id, department.name AS department FROM department');
    }

    getDeptById(deptId) {
        return query('SELECT department.id, department.name AS department FROM department WHERE department.id = ?', [deptId]);
    }

    getBudgetByDept(deptId) {
        return query('SELECT department.name AS department, SUM(role.salary) AS Total_Department_Budget FROM (employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id) WHERE department.id = ? GROUP BY department', [deptId]);
    }

    createEmployee(emp) {
        if (emp.empMgr != -1) {
            return query('INSERT INTO employee SET ?', { firstName: emp.empFirst, lastName: emp.empLast, role_id: emp.empRole, manager_id: emp.empMgr });
        } else {
            return query('INSERT INTO employee SET ?', { firstName: emp.empFirst, lastName: emp.empLast, role_id: emp.empRole });
        }

    }

    createDepartment(dept) {
        return query('INSERT INTO department SET ?', { name: dept.deptName });
    }

    createRole(role) {
        return query('INSERT INTO role SET ?', { title: role.roleTitle, salary: role.roleSalary, department_id: role.roleDept });
    }

    updateEmployeeRole(roleId, empId) {
        return query('UPDATE employee SET ? WHERE ?', [
            {
                role_id: roleId
            },
            {
                id: empId
            }
        ]);
    }

    updateEmployeeManager(managerId, employeeId) {
        return query('UPDATE employee SET ? WHERE ?', [
            {
                manager_id: managerId
            },
            {
                id: employeeId
            }
        ]);
    }

    delete(table, id) {
        return query('DELETE FROM ?? WHERE id = ?', [table, id]);
    }

}


module.exports = DAL;