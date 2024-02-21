const inquirer = require('inquirer');
const mysql = require('mysql2');
let supervisors = [];
let rolesCurrent = [];
let departmentsCurrent = [];

const db = mysql.createConnection({
    user: 'route',
    password: "",
    host: "localhost",
    database: "movie_db",
});

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

const allDepartments = () => {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.error('Error querying database' + err.stack);
        }
        departmentsCurrent = results.map(row => {
            return {
                id: row.id,
                name: row.name
            };
        });
    });

};

const roles = () => {
    db.query('SELECT * FROM role', (err, results) => {
        if (err) {
            console.error('Error querying database' + err.stack);
        }
        rolesCurrent = results.map(row => {
            return {
                id: row.id,
                name: row.title,
                salary: row.salary,
                department: row.deparment_id,
            };
        });
    });

};

const allSupervisors = () => {
db.query('SELECT * FROM employees AND manager_id IS NULL', (err, results) => {
    if (err) {
        console.error('Error querying database' + err.stack);
    }
    supervisors = results.map(row => {
        return {
            id: row.id,
            first_name: row.first_name,
            last_name: row.last_name
        };
    });
});
}

const database = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'menuChoice',
                message: 'Please select a menu option',
                choices: mainMenu, //array of main menu options
            }

        ]).then(answer => {
            switch (answer.menuChoice) {
                case 'View all Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmplyee();
                    break;
                case 'Update Employee Role':
                    updateEmplyeeRole();
                    break;
                case 'View all Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    updateRole();
                    break;
                case 'Vew all Departments':
                    viewDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    process.exit();
                    break;
                default:
                    console.log('Invalid user choice');
            }

            database();

        });
}

const addEmplyee = () => {
    allDepartments()
    viewEmployees()
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name_first',
                message: 'Add employee first name',
            },
            {
                type: 'input',
                name: 'name_last',
                message: 'Add employee last name',
            },
            {
                type: 'input',
                name: 'employeeDepartment',
                message: 'Add employee name',
                choices: departmentsCurrent, //array of all current departments
            },
            {
                type: 'confirm',
                name: 'hasSupervisor',
                message: 'Do they have a supervisor?',
            },

        ]).then(answers => {
            if (answers.hasSupervisor) {
                allSupervisors()
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'employeeSupervisor',
                        message: 'Add supervisor',
                        choices: supervisors, //array of all current supervisors
                    }
                ]).then(supervisorAnswer => {
                    const query = `INSERT INTO employee (first_name, last_name, department, supervisor) VALUES (?, ?, ?, ?)`;
                    db.query(query, [answers.name_first, answers.name_last, answers.employeeDepartment, supervisorAnswer.employeeSupervisor], (error, result) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log('Employee added')
                            viewEmployees()
                        }
                    });
                });
            }
            else {
                const query = `INSERT INTO employee (first_name, last_name, department) VALUES (?, ?)`;
                db.query(query, [answers.name_first, answers.name_last, answers.employeeDepartment], (error, result) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('Employee added')
                        viewEmployees()
                    }
                });
            }

            
        });
};

    database();

const viewRoles = () => {
    db.query('SELECT * from roles', function (err, results) {
        console.log(results);
    });
};

const viewDepartments = () => {
    db.query('SELECT * from departments', function (err, results) {
        console.log(results);
    });
};

const viewEmployees = () => {
    db.query('SELECT * from employee', function (err, results) {
        console.log(results);
    });
};

const updateRole = () => {
    allDepartments()
    viewRoles()
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'Add new title',
            },
            {
                type: 'input',
                name: 'newSalary',
                message: 'Add salary',
            },
            {
                type: 'input',
                name: 'department',
                message: 'Add department id',
                choices: departmentsCurrent //array of all current departments
            },
        ]).then(newRoleAnswers => {
            const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            db.query(query, [newRoleAnswers.newRole, newRoleAnswers.newSalary, newRoleAnswers.department_id], (error, result) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Role added')
                    viewRoles()
                }
            });
            
        });
};

const addDepartment = () => {
    viewDepartments()
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'Add new department',
            },
        ]).then(newDepartmentAnswers => {
            const query = `INSERT INTO department (name) VALUES (?)`;
            db.query(query, [newDepartmentAnswers.newDepartment], (error, result) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Department added')
                    viewDepartments()
                }
            });
            
        });
};

const updateEmplyeeRole = () => {
    viewEmployees()
    roles()
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employee',
                message: 'Select an employee to change roles',
            },
            {
                type: 'input',
                name: 'role',
                message: 'Select new role',
                choices: rolesCurrent, //array of all current roles
            },
        ]).then(changeRoleAnswers => {
            const query = `UPDATE employee SET role_id = ? WHERE name = ?`;
            db.query(query, [changeRoleAnswers.role, changeRoleAnswers.employee], (error, result) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Role Changed')
                    viewEmployees()
                }
            });
            
        });
};