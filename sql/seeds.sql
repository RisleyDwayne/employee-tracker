INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Human Resources"), ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 75000, 1), ("Sales Lead", 90000, 1), ("Chief Engineer", 120000, 2), ("Software Engineer", 80000, 2), ("HR Lead", 70000, 3), ("Accountant", 100000, 4);

INSERT INTO employee (firstName, lastName, role_id, manager_id)
VALUES ("Chris", "Pessinis", 1, 2), ("John", "Pimental", 2, NULL), ("Geordi", "LaForge", 3, NULL), ("Jesse", "Mailhot", 4, 3), ("Tracy", "Christianson-Shea", 5, NULL),("Janice", "Smith", 6, NULL);