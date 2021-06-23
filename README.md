# MySQL
## Homework 12 - Employee Tracker

Your purpose of this assignment is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL. 

* The link to the video walkthrough can be found [here](https://drive.google.com/file/d/1kCtkYR-rUycLjsSIPzwt0AOcCtmRiMM4/view).

<br />

# Acceptance criteria
## :heavy_check_mark: Build a command line application that uses CRUD 

 * CREATE

 Three functions have been built to create:

 ```javascript

 //Add new Employee
const addEmployee = (connection, ask) => {
}

//Add new Role
const addRole = (connection, ask) => {
}

//Add Department
const addDepartment = (connection, ask) => {
}
```

* READ

Six functions have been built to read:

```javascript
//View all employees
const allEmployeeQuery = (connection, ask) => {
}

//View employees by department
const allEmpByDept = (connection, ask) => {
}

//View employees by manager
const allEmpByMgr = (connection, ask) => {
}

//View all Roles
const allRoleQuery = (connection, ask) => {
}

//View All Departments
const allDptQuery = (connection, ask) => {
}

//view budgets by department **BONUS
const salaryByDpt = (connection, ask) => {
}
```

* UPDATE

Two functions have been built to update:

```javascript
//Update Employee role
const updateEmpRole = (connection, ask) => {
}

//Update Employee Manager
const updateEmpMgr = (connection, ask) => {
}
```

* DELETE

Three functions have been built to Delete:

```javascript
//Remove Employee
const removeEmployee = (connection, ask) => {
}

//remove Department
const removeDepartment = (connection, ask) => {
}

//remove Role
const removeRole = (connection, ask) => {
}
```

## :heavy_check_mark: Modules used

* [console.table](https://www.npmjs.com/package/console.table)
* [inquirer](https://www.npmjs.com/package/inquirer)
* [mysql](https://www.npmjs.com/package/mysql)




