const mysql = require('mysql')
const repeat = require('../server');
const inquirer = require('inquirer');
//create connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeesdb',
});

//View all employees
const allEmployeeQuery = () => {
    connection.query(
        `SELECT 
            e.id,
            CONCAT(e.first_name, ' ', e.last_name) AS Employee,
            role.title AS Role,
            department.name AS Department,
            LPAD(CONCAT('$ ', role.salary), 15, ' ') AS Salary,
            CONCAT(m.first_name, ' ', m.last_name) AS Manager
        FROM
            employee e
                LEFT JOIN
            employee m ON m.id = e.manager_id
                JOIN
            role ON e.role_id = role.id
                JOIN
            department ON department.id = role.department_id
            ORDER BY e.id`,
        (err, results) => {
            if (err) throw err;
            console.table(results);
            ask();
        }
    )
}

//View employees by department
const allEmpByDept = () => {
    const query = 'SELECT name FROM department';
    connection.query(query,
        (err, results) => {
            if (err) throw err;
            let departments = [];
            for (let index = 0; index < results.length; index++) {
                departments.push(results[index].name)
            }
            inquirer.prompt({
                type: 'rawlist',
                name: 'action',
                message: "Which department would you like to see?",
                choices: departments
            }).then(answer => {
                const query = "SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS Employee, department.name AS Department FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id where ?";
                connection.query(query, { 'department.name': answer.action }, (err, response) => {
                    if (err) throw err;
                    console.table(response);
                    main.ask();
                })
            })
        });
}

//View employees by manager
const allEmpByMgr = () => {
    const query = "SELECT DISTINCT( CONCAT(m.first_name, ' ', m.last_name) ) AS manager FROM employee e JOIN employee m ON m.id = e.manager_id JOIN role ON e.role_id = role.id JOIN department ON department.id = role.department_id";
    connection.query(query,
        (err, results) => {
            if (err) throw err;
            let managers = [];
            for (let index = 0; index < results.length; index++) {
                managers.push(results[index].manager)
            }
            inquirer.prompt({
                type: 'rawlist',
                name: 'action',
                message: "Please choose a manager?",
                choices: managers
            }).then(answer => {
                const query = `SELECT 
                    CONCAT(e.first_name, ' ', e.last_name) AS Employee,
                    CONCAT(m.first_name, ' ', m.last_name) AS Manager
                FROM
                    employee e
                        LEFT JOIN
                            employee m ON m.id = e.manager_id
                            Where CONCAT(m.first_name, ' ', m.last_name) = ?`;
                connection.query(query, [answer.action], (err, response) => {
                    if (err) throw err;
                    console.table(response);
                    main.ask();
                })
            })

        });

}

//View all Roles
const allRoleQuery = () => {
    connection.query(
        `SELECT 
            role.id, title AS Role
        FROM
            role`,
        (err, results) => {
            if (err) throw err;
            console.table(results);
            main.ask()
        }
    )
}

//View All Departments
const allDptQuery = () => {
    connection.query(
        `SELECT 
            id, name AS Department
        FROM
            department`,
        (err, results) => {
            if (err) throw err;
            console.table(results);
            main.ask()
        }
    )
}

//view budgets by department
const salaryByDpt = () => {
    const query = 'SELECT name FROM department';
    connection.query(query,
        (err, results) => {
            if (err) throw err;
            let departments = [];
            for (let index = 0; index < results.length; index++) {
                departments.push(results[index].name)
            }
            inquirer.prompt({
                type: 'rawlist',
                name: 'action',
                message: "Which department's budget would you like to see?",
                choices: departments
            }).then(answer => {
                const query = `SELECT 
                                    department.name AS Department,
                                    CONCAT('$ ', SUM(role.salary)) 'Budget Utilized'
                                FROM
                                    employee
                                JOIN
                                    role ON role_id = role.id
                                JOIN
                                    department ON department.id = role.department_id
                                WHERE ?`
                connection.query(query, { 'department.name': answer.action }, (err, response) => {
                    if (err) throw err;
                    console.table(response);
                    main.ask();
                })
            })
        });
}

module.exports = {
    allEmployeeQuery,
    allEmpByDept,
    allEmpByMgr,
    allRoleQuery,
    allDptQuery,
    salaryByDpt
};