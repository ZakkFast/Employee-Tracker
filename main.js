const mysql = require("mysql2")
const express = require("express")
const inquirer = require("inquirer")
require("console.table")
let roleArr = []
let managerArr = []
let departmentArr = []
let employeeArr = []

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "160239",
    database: "employee_tracker_db",
  },
  console.log(`Connected to the employee_tracker_db.`)
);

function runPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choices",
        choices: [
          "View All Departments.",
          "View All Roles.",
          "View All Employees.",
          "Add Department.",
          "Add A Role.",
          "Add An Employee.",
          "Update An Employee Role.",
          "Exit.",
        ],
      },
    ])
    .then(function (val) {
      switch (val.choices) {
        case "View All Departments.":
          viewAllDepartments();
          break;

        case "View All Roles.":
          viewAllRoles();
          break;

        case "View All Employees.":
          viewAllEmployees();
          break;

        case "Add Department.":
          addDepartment();
          break;

        case "Add A Role.":
          addARole();
          break;

        case "Add An Employee.":
          addAnEmployee();
          break;

        case "Update An Employee Role.":
          updateAnEmployeeRole();
          break;

        case "Exit.":
          exit();
          break;
      }
    });
}

function selectRole() {
  db.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
}

function selectManager() {
  db.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    (err, res) => {
      if (err) throw err;
      for (i = 0; i < res.length; i++) {
        managerArr.push(res[i].first_name);
      }
    }
  );
  return managerArr;
}

function selectEmployee() {
  db.query("SELECT last_name FROM employee", (err, res) => {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      employeeArr.push(res[i].first_name);
    }
  });
  return employeeArr;
}

function selectDepartment() {
  db.query("SELECT id FROM department", (err, res) => {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      departmentArr.push(res[i].name);
    }
  });
}

function viewAllDepartments() {
  db.query(
    "SELECT department.name AS Department, department.id AS 'Department #' FROM department;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      runPrompt();
    }
  );
}

function viewAllRoles() {
  db.query(
    "SELECT roles.id AS ID, roles.title AS Position, department.name AS Department FROM roles LEFT JOIN department on department.id = roles.department_id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      runPrompt();
    }
  );
}

function viewAllEmployees() {
  db.query(
    "SELECT employee.id AS ID, CONCAT(employee.first_name, ' ' ,employee.last_name) AS Employee, department.name AS Department, roles.title AS Position, roles.salary AS Salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN roles on roles.id = employee.roles_id INNER JOIN department on department.id = roles.department_id left join employee e on employee.manager_id = e.id;",
    //switch to arrow function
    function (err, res) {
      if (err) throw err;
      console.table(res);
      runPrompt();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        message: "What is the name of the Department you would like to add?",
      },
    ])
    .then(function (res) {
      let query = db.query(
        "INSERT INTO department SET ?",
        {
          name: res.name,
        },
        (err) => {
          if (err) throw err;
          console.log(`Added the ${res.name} Department!`);
          runPrompt();
        }
      );
    });
}

function addARole() {
  db.query(
    "SELECT roles.title AS Title, roles.salary AS Salary FROM roles",
    (err, res) => {
      inquirer
        .prompt([
          {
            name: "title",
            message: "What is the title of the role?",
          },
          {
            name: "salary",
            message: `What is the salary for this position?`,
          },
          {
            name: "department",
            type: "choice",
            message:
              "What is the ID of the department that the role belongs to?",
            choices: selectDepartment(),
          },
        ])
        .then((res) => {
          db.query(
            "INSERT INTO roles SET ?",
            {
              title: res.title,
              salary: res.salary,
              department_id: res.department,
            },
            (err) => {
              if (err) throw err;
              console.table(res);
              runPrompt();
            }
          );
        });
    }
  );
}

function addAnEmployee() {
  inquirer
    .prompt([
      {
        name: "firstname",
        message: "What is the employee's first name?",
      },
      {
        name: "lastname",
        message: "What is the employee's last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's position?",
        choices: selectRole(),
      },
      {
        name: "manager",
        type: "rawlist",
        message: "Who is the employee's manager?",
        choices: selectManager(),
      },
    ])
    .then((val) => {
      let roleid = selectRole().indexOf(val.role) + 1;
      let managerid = selectManager().indexOf(val.manager) + 1;
      console.log(val.role);
      console.log(val.manager);
      db.query(
        "INSERT INTO employee SET ?",
        {
          first_name: val.firstname,
          last_name: val.lastname,
          manager_id: managerid,
          roles_id: roleid,
        },
        (err) => {
          if (err) throw err;
          console.table(val);
          runPrompt();
        }
      );
    });
}

function updateAnEmployeeRole() {
  db.query(
    "SELECT employee.last_name, roles.title FROM employee JOIN roles ON employee.roles_id = roles.id;",
    function (err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function () {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole(),
          },
        ])
        .then(function (val) {
          console.log(val.role);
          console.log(val.lastName);
          var roleId = selectRole().indexOf(val.role) + 1;
          db.query("UPDATE employee SET roles_id =? WHERE last_name =?", [
            roleId,
            val.lastName,
          ]),
            function (err) {
              if (err) throw err;
              console.table(val);
            };
          runPrompt();
        });
    }
  );
}

function exit() {
  console.log("Goodbye!");
  process.exit();
}

runPrompt();
