const mysql = require('mysql')
const inquirer = require('inquirer')
const cTable = require('console.table');

//create connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeesdb',
});

console.log(

    "|       ______                 _                          __  __                                      |\n" +
    "|      |  ____|               | |                        |  \\/  |                                     |\n" +
    "|      | |__   _ __ ___  _ __ | | ___  _   _  ___  ___   | \\  / | __ _ _ __   __ _  __ _  ___ _ __    |\n" +
    "|      |  __| | '_ ` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\  | |\\/| |/ _` | '_ \\ / _` |/ _` |/ _ \\ '__|   |\n" +
    "|      | |____| | | | | | |_) | | (_) | |_| |  __/  __/  | |  | | (_| | | | | (_| | (_| |  __/ |      |\n" +
    "|      |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|  |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|      |\n" +
    "|                       | |             __/ |                                       __/ |             |\n" +
    "|                       |_|            |___/                                       |___/              |" + "\n" +

    " -----------------------------------------------------------------------------------------------------"

)

const whatToDo = [
    {
        type: 'list',
        name: 'whatToDo',
        message: "What would you like to do?",
        choices: ['View All Employees', 'View All Employees by Department', 'View All Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View all Roles'],
    }
];

inquirer.prompt(whatToDo).then(answer => {
    if (answer.whatToDo === 'View All Employees') {
        connection.query(
            "select e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, role.title AS Title,  department.name AS Department, role.salary AS Salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON  m.id = e.manager_id join role on e.role_id = role.id JOIN department ON department.id = role.department_id",
            (err, results) => {
                if (err) throw err;
                console.table(results);
            }
        )
        connection.end();

    }

})


// const otherTable = [{
//     id: 1,
//     Employee: 'Ashley Rodriguez',
//     Title: 'Lead Engineer',
//     Department: 'Engineering',
//     Salary: 150000,
//     Manager: null
//   },
//   {
//     id: 2,
//     Employee: 'John Doe',
//     Title: 'Sales Lead',
//     Department: 'Sales',
//     Salary: 100000,
//     Manager: 'Ashley Rodriguez'
//   },
//   {
//     id: 3,
//     Employee: 'Mike Chan',
//     Title: 'Sales Person',
//     Department: 'Sales',
//     Salary: 80000,
//     Manager: 'John Doe'
//   },
//   {
//     id: 4,
//     Employee: 'Kevin Tupik',
//     Title: 'Software Engineer',
//     Department: 'Engineering',
//     Salary: 70000,
//     Manager: 'Ashley Rodriguez'
//   },
//   {
//     id: 5,
//     Employee: 'Malia Brown',
//     Title: 'Accountant',
//     Department: 'Finance',
//     Salary: 125000,
//     Manager: null
//   },
//   {
//     id: 6,
//     Employee: 'Sarah Lourd',
//     Title: 'Legal Team Lead',
//     Department: 'Legal',
//     Salary: 250000,
//     Manager: null
//   },
//   {
//     id: 7,
//     Employee: 'Tom Allen',
//     Title: 'Lawyer',
//     Department: 'Legal',
//     Salary: 190000,
//     Manager: 'Sarah Lourd'
//   }

//User this sql statement for all employees: 
// select e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, role.title AS Title,  department.name AS Department, role.salary AS Salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager
// FROM employee e
// LEFT JOIN employee m ON  m.id = e.manager_id join role on e.role_id = role.id JOIN department ON department.id = role.department_id





