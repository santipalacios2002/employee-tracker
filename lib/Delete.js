const inquirer = require('inquirer');

//Remove Employee
const removeEmployee = (connection, ask) => {

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

//remove Department
const removeDepartment = (connection, ask) => {
    const query = 'SELECT name FROM department'
    connection.query(query,
        (err, results) => {
            if (err) throw err;
            let departments = [];
            for (let index = 0; index < results.length; index++) {  // i need to change this loop for something more efficient
                departments.push(results[index].name)
            }
            inquirer.prompt(
                {
                    type: 'rawlist',
                    name: 'remove',
                    message: 'Which department would you like to remove?',
                    choices: departments
                }).then(answer => {
                    const query = 'DELETE FROM department WHERE ?;'
                    connection.query(query,
                        {
                            name: answer.remove,
                        },
                        (err) => {
                            if (err) throw err;
                            ask();
                        })
                })
        }
    )
}

//remove Role
const removeRole = (connection, ask) => {
    const query = 'SELECT * FROM role'
    connection.query(query,
        (err, results) => {
            if (err) throw err;
            let roles = [];
            for (let index = 0; index < results.length; index++) {  // i need to change this loop for something more efficient
                roles.push(results[index].title)
            }
            inquirer.prompt(
                {
                    type: 'rawlist',
                    name: 'remove',
                    message: 'Which role would you like to remove?',
                    choices: roles
                }).then(answer => {
                    const query = 'DELETE FROM role WHERE ?;'
                    connection.query(query,
                        {
                            title: answer.remove,
                        },
                        (err) => {
                            if (err) throw err;
                            ask();
                        })
                })
        }
    )
}

module.exports = {
    removeEmployee,
    removeDepartment,
    removeRole
};