const inquirer = require('inquirer');
const mysql = require('mysql2');

const mainMenu = [
    'Vew all Employess',
    'Add Employee',
    'Update Employee Role',
    'View all Roles',
    'Add Role',
    'Vew all Departments',
    'Add Department',
    'Quit',
];

const database = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'menu choice',
                message: 'Please select a menu option',
                choices: mainMenu,
            }

]).then(answer => {
    switch (answer.choice) {
        case 'View all Employees':
            //Do stuff
            break;
        case 'Add Employee':
            //addEmployee();
            break;
        case 'Update Employee Role':
            //updateEmployeeRole();
            break;
        case 'View all Roles':
            //do stuff
            break;
        case 'Add Role':
            //addRole();
            break;
        case 'Vew all Departments':
            //do stuff
            break;
        case 'Add Department':
            //addDepartment();
            break;
        case 'Quit':
            process.exit();
            break;
    }

    database();

});
}

database();