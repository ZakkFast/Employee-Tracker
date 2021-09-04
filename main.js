const mysql = require('mysql')
const inquirer = require('inquirer')

const connections = mysql.createConnection({
    host: 'localhost',
    port: '3301',
    user: 'root',
    password: '160239',
    database: 'employee_tracker_db'
})

connection.connect(function(err){
    if (err) throw err
    console.lof('Connected')
    runPrompt()
})

function runPrompt(){
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choices',
            choices: [
                'View All Departments.',
                'View All Roles.',
                'View All Employees.',
                'Add Department.',
                'Add A Role.',
                'Add An Employee.',
                'Update An Employee Role.'
            ]
        }
    ]).then(function(val) {
        switch (val.choices) {
            case 'View All Departments.':
                viewAllDepartments()
            break;

            case 'View All Roles.':
                viewAllRoles()
            break;

            case 'View All Employees.':
                viewAllEmployees()
            break;
            
            case 'Add Department.':
                addDepartment()
            break;

            case 'Add A Role.':
                addARole()
            break;

            case 'Add An Employee.':
                addAnEmployee()
            break;

            case 'Update An Employee Role.':
                updateAnEmployeeRole()
            break;
        }
    })
}