const inquirer = require('inquirer');

// Add Employee
const addEmployee = (connection, ask) => {
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
                                if (roleResults[index].Role === role) {
                                    return roleResults[index].id
                                }
                            }
                        }
                        const chosenManger = () => {
                            for (let index = 0; index < mgrResults.length; index++) {
                                if (mgrResults[index].Manager === manager) {
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

//Add new Role
const addRole = (connection, ask) => {
    const query = 'SELECT * FROM department;';
    connection.query(query,
        (err, deptResults) => {
            if (err) throw err;
            let departments = [];
            for (let index = 0; index < deptResults.length; index++) {
                departments.push(deptResults[index].name)
            }
            inquirer.prompt([{
                type: 'input',
                name: 'newRole',
                message: 'Enter the name of the new Role'
            },
            {
                type: 'input',
                name: 'newRoleSalary',
                message: 'Assign a salary to the new role'
            },
            {
                type: 'rawlist',
                name: 'newRoleDpt',
                message: "Which department will this role belong to?",
                choices: departments
            }]).then(answers => {
                let dpt_id = 0;
                for (let index = 0; index < deptResults.length; index++) {  // i need to change this loop for something more efficient
                    if (answers.newRoleDpt === deptResults[index].name) {
                        dpt_id = deptResults[index].id;
                    }
                }
                connection.query(
                    'INSERT INTO role SET ?',
                    [
                        {
                            title: answers.newRole,
                        },
                        {
                            salary: answers.newRoleSalary,
                        },
                        {
                            department_id: dpt_id,
                        },
                    ],
                    (err) => {
                        if (err) throw err;
                        ask();
                    })
            })
        })
}

//Add Department
const addDepartment = (connection, ask) => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'newDepartment',
            message: 'Enter the name of the new Department'
        }).then(answer => {
            const query = 'INSERT INTO department SET ?';
            connection.query(query,
                {
                    name: answer.newDepartment,
                },
                (err) => {
                    if (err) throw err;
                    ask();
                })
        })
}



module.exports = {
    addEmployee,
    addRole,
    addDepartment
};