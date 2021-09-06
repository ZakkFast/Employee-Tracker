const mysql = require('mysql2')
const express = require('express')
const inquirer = require('inquirer')
require('console.table')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '160239',
        database: 'employee_tracker_db',
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
                'Update An Employee Role.',
                'Exit.'
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

            case 'Exit.':
                exit()
            break;
        }
    })
}

function exit(){
    console.log('Goodbye!')
}

function viewAllDepartments() {
    db.query("SELECT department.name AS Department, department.id AS 'Department #' FROM department;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      runPrompt()
    })
  }

  function viewAllRoles() {
    db.query("SELECT roles.id AS ID, roles.title AS Position, roles.department_id FROM roles;",
    function(err, res){
        if (err) throw err
        runPrompt()
    })
}

function viewAllEmployees() {
    db.query("SELECT employee.id AS ID, CONCAT(employee.first_name, ' ' ,employee.last_name) AS Employee, department.name AS Department, roles.title AS Position, roles.salary AS Salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN roles on roles.id = employee.roles_id INNER JOIN department on department.id = roles.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
        if (err) throw err
        console.table(res)
        runPrompt()    
    })
}
runPrompt()