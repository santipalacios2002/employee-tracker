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
        type: 'rawlist',
        name: 'action',
        message: "What would you like to do?",
        choices: ['View All Employees', 'View All Employees by Department', 'View All Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View all Roles', 'I\'m done'],
    }
];

const employeeQuestions = [
    {
        name: 'firstName',
        type: 'input',
        message: 'What is the employee\'s first name?',
    },
    {
        name: 'lastName',
        type: 'input',
        message: 'What is the employee\'s last name?',
    },
    {
        name: 'role',
        type: 'list',
        message: "What is the employee's?",
        choices: ['Sales Lead', 'Sales Person', 'Lead Engineer', 'Accountant', 'Accountant Manager', 'Legal Team Lead', 'Lawyer', 'Software Engineer'],
    },
    {
        name: 'manager',
        type: 'list',
        message: "Who is de employee's manager",
        choices: ['Ashley Rodriguez', 'John Doe', 'Sarah Lourd', 'None'],
    }
]

const start = () => {
    inquirer.prompt(whatToDo).then(answer => {
        switch (answer.action) {
            case 'View All Employees':
                allEmployeeQuery();
                break;
            case 'View All Employees by Department':
                allEmpByDept();
                break;
            case 'View All Employees by Manager':
                allEmpByMgr();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                console.log('Update Employee Role:')
                break;
            case 'Update Employee Manager':
                console.log('Update Employee Manager:')
                break;
            case 'View all Roles':
                allRoleQuery();
                console.log('View all Roles:')
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    })
}


//View all employees
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
                    ask();
                })
            })

        });
}

//View employees by manager
const allEmpByMgr = () => {
    //
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
                    ask();
                })
            })

        });

}

//View all Roles
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

// Add Employee
const addEmployee = () => {
    inquirer.prompt(employeeQuestions).then(({ firstName, lastName, role, manager }) => {
        const roleNum = () => {  //this is good candidate for CLASSES
            switch (role) {
                case 'Sales Lead':
                    return 1
                case 'Sales Person':
                    return 2
                case 'Lead Engineer':
                    return 3
                case 'Accountant':
                    return 4
                case 'Accountant Manager':
                    return 5
                case 'Legal Team Lead':
                    return 6
                case 'Lawyer':
                    return 7
                case 'Software Engineer':
                    return 8
            }
        }
        const mgrNum = () => {  //this is good candidate for CLASSES
            switch (manager) {
                case 'Ashley Rodriguez':
                    return 1
                case 'John Doe':
                    return 2
                case 'Sarah Lourd':
                    return 6
                case 'None':
                    return null
            }
        }
        const roleId = roleNum()   //ASK IN CLASS
        const mgrId = mgrNum()     //ASK IN CLASS
        const queryInsertRole = 'INSERT INTO employee SET ?'
        connection.query(queryInsertRole,
            {
                first_name: firstName,
                last_name: lastName,
                role_id: roleId,
                manager_id: mgrId
            },
            (err) => {
                if (err) throw err;
                console.log('Employee added successfully');
                ask();
            })
    })
}


//Remove Employee
const removeEmployee = () => {

    const query = "SELECT CONCAT(first_name, ' ', last_name) AS Employee FROM employee";
    connection.query(query,
        (err, results) => {
            console.log('results:', results)

            if (err) throw err;
            let employees = [];
            for (let index = 0; index < results.length; index++) {
                employees.push(results[index].Employee)
            }
            inquirer.prompt({
                type: 'rawlist',
                name: 'employee',
                message: "Which Employee would you like to remove?",
                choices: employees
            }).then(answer => {
                const removeEmpQuery = "DELETE FROM employee WHERE ? AND ?";
                const splitName = answer.employee.split(' ')
                console.log('splitName:', splitName)
                connection.query(removeEmpQuery,
                    [
                        {
                            first_name: splitName[0],
                        },
                        {
                            last_name: splitName[1],
                        },
                    ],
                    (err) => {
                        if (err) throw err;
                        console.log('Employee removed successfully');
                        ask();
                    })
            })
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


