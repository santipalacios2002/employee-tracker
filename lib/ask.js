const mysql = require('mysql')
const repeat = require('../lib/start');
const inquirer = require('inquirer');

const ask = () => {
    inquirer.prompt([{
        type: 'confirm',
        name: 'askAgain',
        message: 'Would you like to do something else?',
        default: true,
    }]).then((answer) => {
        if (answer.askAgain) repeat.start();
        else connection.end();
    });
}

module.export = {ask}