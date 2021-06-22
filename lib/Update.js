const mysql = require('mysql')
const inquirer = require('inquirer');
//create connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeesdb',
});

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
                const query = 'SELECT id, title as role FROM role;'
                connection.query(query,
                    (err, roleResponse) => {
                        if (err) throw err;
                        let roles = [];
                        for (let index = 0; index < roleResponse.length; index++) {
                            roles.push(roleResponse[index].role)
                        }
                        inquirer.prompt(
                            {
                                name: 'role',
                                type: 'list',
                                message: `What would you like ${chosenEmployee.employee}'s new role be?`,
                                choices: roles,
                            }).then(answer => {
                                const roleNum = () => {  //this is good candidate for CLASSES
                                    for (let index = 0; index < roleResponse.length; index++) {
                                        if (roleResponse[index].role === answer.role) {
                                            return roleResponse[index].id
                                        }
                                    }
                                }
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
                let managers = employees;
                managers.push('None')
                inquirer.prompt(
                    {
                        name: 'manager',
                        type: 'list',
                        message: `What would you like ${chosenEmployee.employee}'s new manager be?`,
                        choices: managers,
                    }).then(manager => {
                        let mgrId = null;
                        let splitEmp = chosenEmployee.employee.split(' ');
                        for (let index = 0; index < results.length; index++) {
                            if (manager.manager === results[index].Employee) {
                                mgrId = results[index].id
                            }
                        }
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
                        ask();
                    })
            })
        });
}

module.exports = {
    updateEmpRole,
    updateEmpMgr
};