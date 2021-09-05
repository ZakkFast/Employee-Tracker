const mysql = require('mysql2')
const express = require('express')
const inquirer = require('inquirer')
const PORT = process.env.PORT || 3001
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '160239',
        database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db.`)
)

app.use((req, res) => {
    res.status(404).end()
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
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