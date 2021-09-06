const mysql = require('mysql2')
const express = require('express')
const inquirer = require('inquirer')
require('console.table')
let roleArr = []
let managerArr = []

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

// function selectRole() 

// function selectManager()

function viewAllDepartments() {
    db.query("SELECT department.name AS Department, department.id AS 'Department #' FROM department;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      runPrompt()
    })
  }

  function viewAllRoles() {
    db.query("SELECT roles.id AS ID, roles.title AS Position, department.name AS Department FROM roles INNER JOIN department on department.id = roles.department_id;",
    function(err, res){
        if (err) throw err
        console.table(res)
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

function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          message: "What is the name of the Department you would like to add?"
        }
    ]).then(function(res) {
        var query = db.query(
            "INSERT INTO department SET ?",
            {
              name: res.name
            
            },
            (err) => {
                if (err) throw err
                console.log(`Added the ${res.name} Department!`);
                runPrompt();
            }
        )
    })
  }

  function addARole() {
      db.query('SELECT roles.title AS Title, roles.salary AS Salary FROM roles', (err, res) => {
          inquirer.prompt([
              {
                  name: 'title',
                  message: 'What is the title of the role?'
              },
              {
                  name: 'salary',
                  message: `What is the salary for this position?`
              }
          ]).then((res) => {
              db.query(
                  "INSERT INTO roles SET ?",
                  {
                      title: res.title,
                      salary: res.salary
                  },
                  (err) => {
                      if (err) throw err
                      console.table(res)
                      runPrompt()
                  }
              )
          })
      })
  }

  function addAnEmployee() {
      inquirer.prompt([
          {
              name: 'firstname',
              message: "What is the employee's first name?"
          },
          {
              name: 'lastname',
              message: "What is the employee's last name?"
          },
          {
              name: 'role',
              type: 'list',
              message: "What is the employee's position?",
              choices: selectRole()
          },
          {
              name: 'manager',
              type: 'rawlist',
              message: "Who is the employee's manager?"
          }
      ]).then((val) => {
          var roleid = selectRole(indexOf)(val.role) + 1
          var managerid = selectManager()(indexOf)(val.choice) + 1
          db.query(
              "INSERT INTO employee SET ?",
              {
                  first_name: val.firstname,
                  last_name: val.lastname,
                  manager_id: managerid,
                  role_id: roleid
              },(err) => {
                  if (err) throw err
                  console.table(val)
                  runPrompt()
              }
          )
      })
  }

//   function updateAnEmployeeRole()

  
function exit(){
    console.log('Goodbye!')
}

runPrompt()