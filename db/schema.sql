DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT,
    roles_id INT,
    FOREIGN KEY (roles_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
VALUE ('Sales');
INSERT INTO department (name)
VALUE ('Reception');
INSERT INTO department (name)
VALUE ('Human Resources');
INSERT INTO department (name)
VALUE ('Warehouse');
INSERT INTO department (name)
VALUE ('Corporate');

INSERT INTO roles (title, salary, department_id)
VALUE ('Lead Sales', 690000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ('Junior Sales', 63000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ('Office Administrator', 50000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ('Receptionist', 42000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ('HR Lead', 63000, 3);
INSERT INTO roles (title, salary, department_id)
VALUE ('Loader', 42000, 4);
INSERT INTO roles (title, salary, department_id)
VALUE ('Warehouse Manager', 46000, 4);
INSERT INTO roles (title, salary, department_id)
VALUE ('Regional Manager', 47000, 5);

INSERT INTO employee (first_name, last_name, manager_id, roles_id)
VALUE ('Michael', 'Scott', NULL, 8);
INSERT INTO employee (first_name, last_name, manager_id, roles_id)
VALUE ('Darryl', 'Philbin', 1, 7);
INSERT INTO employee (first_name, last_name, manager_id, roles_id)
VALUE ('Dwight', 'Schrute', 1, 1);
INSERT INTO employee (first_name, last_name, manager_id, roles_id)
VALUE ('Jim', 'Halpert', 1, 1);
INSERT INTO employee (first_name, last_name, manager_id, roles_id)
VALUE ('Pam', 'Beesly', 1, 3);
INSERT INTO employee (first_name, last_name, manager_id, roles_id)
VALUE ('Nate', 'Nickerson', 2, 6);
INSERT INTO employee (first_name, last_name, manager_id, roles_id)
VALUE ('Ryan', 'Howard', 1, 2);
INSERT INTO employee (first_name, last_name, manager_id, roles_id)
VALUE ('Erin', 'Hannon', 5, 4);



SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;