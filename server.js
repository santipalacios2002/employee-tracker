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
        choices: ['View All Employees', 'View All Employees by Department', 'View All Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View all Roles', 'I\'m done'],
    }
];

const start = () => {
    inquirer.prompt(whatToDo).then(answer => {
    if (answer.whatToDo === 'View All Employees') {
        allEmployeeQuery(); 
    } else if (answer.whatToDo === 'View All Employees by Department') {
    console.log('View All Employees by Department')
        ask();
    }  else if (answer.whatToDo === 'View All Employees by Manager') {
    console.log('View All Employees by Manager:')
    ask();
    } else if (answer.whatToDo === 'Add Employee') {
    console.log('Add Employee:')
    ask();
    } else if (answer.whatToDo === 'Remove Employee') {
    console.log('Remove Employee:')
    ask();
    } else if (answer.whatToDo === 'Update Employee Role') {
    console.log('Update Employee Role:')
    ask();
    } else if (answer.whatToDo === 'Update Employee Manager') {
    console.log('Update Employee Manager:')
    ask();
    } else if (answer.whatToDo === 'View all Roles') {
        allRoleQuery();
    console.log('View all Roles:')
    }
})
}



const allEmployeeQuery = () => {
    connection.query(
        `SELECT 
            e.id,
            CONCAT(e.first_name, ' ', e.last_name) AS Employee,
            role.title AS Title,
            department.name AS Department,
            role.salary AS Salary,
            CONCAT(m.first_name, ' ', m.last_name) AS Manager
        FROM
            employee e
                LEFT JOIN
            employee m ON m.id = e.manager_id
                JOIN
            role ON e.role_id = role.id
                JOIN
            department ON department.id = role.department_id`,
        (err, results) => {
            if (err) throw err;
            console.table(results);
            ask();
        }
    )
}

const allRoleQuery = () => {
    connection.query(
        `SELECT 
            role.id, title AS role
         FROM
            role`,
        (err, results) => {
            if (err) throw err;
            console.table(results);
            ask()
        }
    )

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


