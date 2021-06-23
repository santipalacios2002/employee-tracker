const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const c = require('./lib/Create');
const r = require('./lib/Read');
const u = require('./lib/Update');
const d = require('./lib/Delete');


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
        type: 'rawlist',
        name: 'action',
        message: "What would you like to do?",
        choices: ['View All Employees', 'View All Roles', 'View All Departments', 'View All Employees by Department', 'View All Employees by Manager', 'View Budget by Department', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee Role', 'Update Employee Manager', 'Remove Employee', 'Remove Department', 'Remove Role', 'I\'m done'],
    }
];

const start = () => {
    inquirer.prompt(whatToDo).then(answer => {
        switch (answer.action) {
            case 'View All Employees':
                r.allEmployeeQuery(connection, ask);
                break;
            case 'View All Employees by Department':
                r.allEmpByDept(connection, ask);
                break;
            case 'View All Employees by Manager':
                r.allEmpByMgr(connection, ask);
                break;
            case 'Add Employee':
                c.addEmployee(connection, ask);
                break;
            case 'Remove Employee':
                d.removeEmployee(connection, ask);
                break;
            case 'Update Employee Role':
                u.updateEmpRole(connection, ask);
                break;
            case 'Update Employee Manager':
                u.updateEmpMgr(connection, ask);
                break;
            case 'View All Roles':
                r.allRoleQuery(connection, ask);
                break;
            case 'View All Departments':
                r.allDptQuery(connection, ask);
                break;
            case 'Add Role':
                c.addRole(connection, ask);
                break;
            case 'Add Department':
                c.addDepartment(connection, ask);
                break;
            case 'Remove Department':
                d.removeDepartment(connection, ask);
                break;
            case 'Remove Role':
                d.removeRole(connection, ask);
                break;
            case 'View Budget by Department':
                r.salaryByDpt(connection, ask);
                break;
            case 'I\'m done':
                connection.end();
                break;
            default:
                break;
        }
    })
}

const ask = () => {
    inquirer.prompt([{
        type: 'confirm',
        name: 'askAgain',
        message: 'Would you like to do something else?',
        default: true,
    }]).then((answer) => {
        if (answer.askAgain) start();
        else connection.end();
    });
}
    
start();

