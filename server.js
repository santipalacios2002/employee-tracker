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
        message: "What is the employee's role?",
        choices: ['Sales Lead', 'Sales Person', 'Lead Engineer', 'Accountant', 'Accountant Manager', 'Legal Team Lead', 'Lawyer', 'Software Engineer'],
    },
    {
        name: 'manager',
        type: 'list',
        message: "Who is the employee's manager",
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
                updateEmpRole();
                break;
            case 'Update Employee Manager':
                updateEmpMgr();
                break;
            case 'View all Roles':
                allRoleQuery();
                break;
            default:
                connection.end();
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
                    ask();
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
                    ask();
                })
            })

        });

}


// Add Employee
const addEmployee = () => {
    const query = 'SELECT id, title AS Role FROM role;';
    connection.query(query,
        (err, roleResults) => {
            if (err) throw err;
            let roles = [];
            for (let index = 0; index < roleResults.length; index++) {
                roles.push(roleResults[index].Role)
            }
            connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS Manager FROM employee",
                (err, mgrResults) => {
                    if (err) throw err;
                    let managers = [];
                    for (let index = 0; index < mgrResults.length; index++) {
                        managers.push(mgrResults[index].Manager)
                    }
                    managers.push('None')
                    inquirer.prompt([
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
                            message: "What is the employee's role?",
                            choices: roles,
                        },
                        {
                            name: 'manager',
                            type: 'list',
                            message: "Who is the employee's manager",
                            choices: managers,
                        }
                    ]).then(({ firstName, lastName, role, manager }) => {
                        const chosenId = () => {
                            for (let index = 0; index < roleResults.length; index++) {
                               if (roleResults[index].Role === role ) {
                                return roleResults[index].id
                               }   
                            }
                        }
                        const chosenManger = () => {
                            for (let index = 0; index < mgrResults.length; index++) {
                               if (mgrResults[index].Manager === manager ) {
                                return mgrResults[index].id
                               }   
                            }
                        }
                        const queryInsertRole = 'INSERT INTO employee SET ?'
                        connection.query(queryInsertRole,
                            {
                                first_name: firstName,
                                last_name: lastName,
                                role_id: chosenId(),
                                manager_id: chosenManger()
                            },
                            (err) => {
                                if (err) throw err;
                                console.log('Employee added successfully');
                                ask();
                            })
                    })
                })

        })
}

//Remove Employee
const removeEmployee = () => {

    const query = "SELECT CONCAT(first_name, ' ', last_name) AS Employee FROM employee";
    connection.query(query,
        (err, results) => {
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

//Update Employee role
const updateEmpRole = () => {
    const query = "SELECT CONCAT(first_name, ' ', last_name) AS Employee FROM employee";
    connection.query(query,
        (err, results) => {
            if (err) throw err;
            let employees = [];
            for (let index = 0; index < results.length; index++) {
                employees.push(results[index].Employee)
            }
            inquirer.prompt({
                type: 'rawlist',
                name: 'employee',
                message: "Which Employee would you like update his/her role?",
                choices: employees
            }).then(chosenEmployee => {
                console.log(`we have ${chosenEmployee.employee}`)
                const query = 'SELECT title as role FROM role;'
                connection.query(query, (err, response) => {
                    if (err) throw err;
                    let roles = [];
                    for (let index = 0; index < response.length; index++) {
                        roles.push(response[index].role)
                    }
                    inquirer.prompt(
                        {
                            name: 'role',
                            type: 'list',
                            message: `What would you like ${chosenEmployee.employee}'s new role be?`,
                            choices: ['Sales Lead', 'Sales Person', 'Lead Engineer', 'Accountant', 'Accountant Manager', 'Legal Team Lead', 'Lawyer', 'Software Engineer'],
                        }).then(answer => {
                            console.log(`NOWWWW we have ${chosenEmployee.employee} and ${answer.role} `)
                            const roleNum = () => {  //this is good candidate for CLASSES
                                switch (answer.role) {
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
                            console.log(roleNum())
                            const splitEmp = chosenEmployee.employee.split(' ');
                            connection.query(
                                'UPDATE employee SET ? WHERE ? AND ?',
                                [
                                    {
                                        role_id: roleNum(),
                                    },
                                    {
                                        first_name: splitEmp[0],
                                    },
                                    {
                                        last_name: splitEmp[1],
                                    },
                                ],
                                (err) => {
                                    if (err) throw err;
                                    console.log(`${chosenEmployee.employee}'s role updated successfully`);
                                    ask();
                                })
                        })
                })
            })
        });
}

//Update Employee Manager
const updateEmpMgr = () => {
    const query = "SELECT id, CONCAT(first_name, ' ', last_name) AS Employee FROM employee";
    connection.query(query,
        (err, results) => {
            if (err) throw err;
            let employees = [];
            for (let index = 0; index < results.length; index++) {
                employees.push(results[index].Employee)
            }
            inquirer.prompt({
                type: 'rawlist',
                name: 'employee',
                message: "Which Employee would you like to update his/her manager?",
                choices: employees
            }).then(chosenEmployee => {
                console.log(`we have ${chosenEmployee.employee}`)
                console.log(results)
                let managers = employees;
                managers.push('None')
                inquirer.prompt(
                    {
                        name: 'manager',
                        type: 'list',
                        message: `What would you like ${chosenEmployee.employee}'s new manager be?`,
                        choices: managers,
                    }).then(manager => {
                        console.log(results)
                        for (let index = 0; index < results.length; index++) {
                            if (manager.manager === results[index].Employee) {
                                const mgrId = results[index].id
                                const splitEmp = chosenEmployee.employee.split(' ');
                                connection.query(
                                    'UPDATE employee SET ? where ? and ?',
                                    [
                                        {
                                            manager_id: mgrId,
                                        },
                                        {
                                            first_name: splitEmp[0],
                                        },
                                        {
                                            last_name: splitEmp[1],
                                        },
                                    ],
                                    (err) => {
                                        if (err) throw err;
                                    })
                            } else {
                                const splitEmp = chosenEmployee.employee.split(' ');
                                connection.query(
                                    'UPDATE employee SET ? where ? and ?',
                                    [
                                        {
                                            manager_id: null,
                                        },
                                        {
                                            first_name: splitEmp[0],
                                        },
                                        {
                                            last_name: splitEmp[1],
                                        },
                                    ],
                                    (err) => {
                                        if (err) throw err;
                                    })
                            }
                        }
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

// {
//     name: "Add Role",
//     value: "ADD_ROLE"
//   },
//   {
//     name: "Remove Role",
//     value: "REMOVE_ROLE"
//   },
//   {
//     name: "View All Departments",
//     value: "VIEW_DEPARTMENTS"
//   },
//   {
//     name: "Add Department",
//     value: "ADD_DEPARTMENT"
//   },
//   {
//     name: "Remove Department",
//     value: "REMOVE_DEPARTMENT"
//   },

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


