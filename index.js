const inquirer = require('inquirer');
const mysql = require('mysql2');
let supervisors = [];
let rolesCurrent = [];
let departmentsCurrent = [];

const db = mysql.createConnection({
    user: 'root',
    password: "",
    host: "localhost",
    database: "company_db",
});

const mainMenu = [
    'View all Employees',
    'Add Employee',
    'Update Employee Role',
    'View all Roles',
    'Add Role',
    'View all Departments',
    'Add Department',
    'Quit',
];

const allDepartments = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM department', (err, results) => {
            if (err) {
                console.error('Error querying database' + err.stack);
                reject(err);
            }
            departmentsCurrent = results.map(row => {
                return {
                    id: row.id,
                    name: row.name
                };
            });
            resolve(departmentsCurrent);
        });
    })
};

const roles = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM role', (err, results) => {
            if (err) {
                console.error('Error querying database' + err.stack);
                reject(err);
            }
            rolesCurrent = results.map(row => {
                return {
                    id: row.id,
                    name: row.title,
                    salary: row.salary,
                    department: row.department_id,
                };
            });
            resolve(rolesCurrent);
        });
    })
};

const allSupervisors = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM employee WHERE manager_id IS NULL', (err, results) => {
            if (err) {
                console.error('Error querying database' + err.stack);
                reject(err);
            }
            supervisors = results.map(row => {
                return {
                    id: row.id,
                    first_name: row.first_name,
                    last_name: row.last_name
                };
            });
            resolve(supervisors);
        });
    })
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // You can add additional logging or error handling here
});

const database = async () => {
    try {
        await allDepartments();
        await roles();
        await allSupervisors();

        const answer = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'menuChoice',
                    message: 'Please select a menu option',
                    choices: mainMenu //array of main menu options
                }

            ]);
        switch (answer.menuChoice) {
            case 'View all Employees':
                console.log('View all Employees function called');
                await viewEmployees();
                database();
                break;
            case 'Add Employee':
                console.log('Add Employee function called');
                await addEmplyee();
                database();
                break;
            case 'Update Employee Role':
                console.log('Update Employee Role function called');
                await updateEmplyeeRole();
                database();
                break;
            case 'View all Roles':
                console.log('View all Roles function called');
                await viewRoles();
                database();
                break;
            case 'Add Role':
                console.log('Add Role function called');
                await updateRole();
                database();
                break;
            case 'View all Departments':
                console.log('View all Departments function called');
                await viewDepartments();
                database();
                break;
            case 'Add Department':
                console.log('Add Department function called');
                await addDepartment();
                database();
                break;
            case 'Quit':
                process.exit();
            default:
                console.log('Invalid user choice');
        }

    } catch (error) {
        console.error('An error happened', error);
    }
}

const addEmplyee = async () => {
    try {
        await viewEmployees();
        await allDepartments();
        await roles();
        const answers = await inquirer
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
                    type: 'list',
                    name: 'employeeRole',
                    message: 'Add Role by id',
                    choices: rolesCurrent.map(role => ({ name: role.name, value: role.id })), //array of all current roles
                },
                {
                    type: 'confirm',
                    name: 'hasSupervisor',
                    message: 'Do they have a supervisor?',
                },

            ]);
        if (answers.hasSupervisor) {
            await allSupervisors();
            console.log(answers)
            const supervisorAnswer =
                await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employeeSupervisor',
                        message: 'Add supervisor',
                        choices: supervisors.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })), //array of all current supervisors
                    }
                ]);
            const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            db.query(query, [answers.name_first, answers.name_last, answers.employeeRole, supervisorAnswer.employeeSupervisor], (error, result) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Employee added')

                }
            });

        }
        else {
            const query = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?,?)`;
            db.query(query, [answers.name_first, answers.name_last, answers.employeeRole], (error, result) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Employee added')

                }
            });
        }

    } catch (error) {
        console.error('An error occurred during add Role', error);
    }
};

const textWithFormatting = `
+=======================================================+
|   _____                 _                             |
|  | ____|_ __ ___  _ __ | | ___  _   _  ___  ___       |
|  |  _| | '_ ' _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\      |
|  | |___| | | | | | |_) | | (_) | |_| |  __/  __/      |
|  |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|_  _  |
|  |  \\/  | __ _ _ |_|  __ _  __ _|___/ _ __  | ___|| | |
|  | |\\/| |/ _' | '_ \\ / _' |/ _' |/ _ \\ '__| |___ \\| | |
|  | |  | | (_| | | | | (_| | (_| |  __/ |     ___) |_| |
|  |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|    |____/(_) |
|                            |___/                      |
+=======================================================+
`

console.log(textWithFormatting);
database();

const viewRoles = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from role', function (err, results) {
            if (err) {
                reject(err);
            }
            let consoleTable = '---------------------\nRole #\t| Role Title\t| Salary\t| Department\n---------------------\n';
            results.forEach(role => {
                consoleTable = `${consoleTable}${role.id}\t| ${role.title}\t|${role.salary}\t\t| ${role.department_id}\n`;
            })
            console.log(consoleTable);
            resolve();

        });
    });
};


const viewDepartments = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from department', function (err, results) {
            if (err) {
                reject(err);
            }
            let consoleTable = '---------------------\nDept #\t| Dept Name\n---------------------\n';
            results.forEach(dept => {
                consoleTable = `${consoleTable}${dept.id}\t| ${dept.name}\n`;
            })
            console.log(consoleTable);
            resolve();

        });
    });

};

const viewEmployees = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from employee', function (err, results) {
            if (err) {
                reject(err);
            }
            let consoleTable = '---------------------\nEmployee #\t| First Name\t|Last Name\t|Role\t   |Manager\n---------------------\n';
            results.forEach(employee => {
                consoleTable = `${consoleTable}${employee.id}\t\t| ${employee.first_name}\t\t|${employee.last_name}\t\t|${employee.role_id}\t   |${employee.manager_id}\n`;
            })
            console.log(consoleTable);
            resolve();

        });
    });

};

// use ConsoleTable

const updateRole = async () => {
    try {
        await viewRoles();

        const newRoleAnswers = await inquirer
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
                    type: 'list',
                    name: 'department',
                    message: 'Add department id',
                    choices: departmentsCurrent.map(department => ({ name: department.name, value: department.id })), //array of all current departments
                },
            ])
        const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        db.query(query, [newRoleAnswers.newRole, newRoleAnswers.newSalary, newRoleAnswers.department], (error, result) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Role added')
                viewRoles()
            }
        });
    } catch (error) {
        console.error('An error occurred during add Role', error);
    }
};

const addDepartment = async () => {
    await viewDepartments();
    try {
        const newDepartmentAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'Add new department',
            },
        ]);
        const insertDepartment = (departmentName) => {
            return new Promise((resolve, reject) => {
                const query = `INSERT INTO department (name) VALUES (?)`;
                db.query(query, [departmentName], (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
        };
        await insertDepartment(newDepartmentAnswers.newDepartment);

        console.log('Department added');
    } catch (error) {
        console.error('An error occurred during add department', error);
    }
};

const updateEmplyeeRole = async () => {
    await viewEmployees();
    await roles();
    try {
        const changeRoleAnswers = await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'employee',
                    message: 'Select an employee to change roles by id',
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select new role',
                    choices: rolesCurrent.map(role => ({ name: role.name, value: role.id })), //array of all current roles
                },
            ])
        const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
        db.query(query, [changeRoleAnswers.role, changeRoleAnswers.employee], (error, result) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Role Changed')

            }
        });
    } catch (error) {
        console.error('An error occurred during update employee role:', error);
    }

};