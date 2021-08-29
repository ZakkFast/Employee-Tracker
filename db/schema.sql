DROP DATABASE IF EXISTS employee_tracker_db

CREATE DATABASE employee_tracker_db

CREATE TABLE department (
    id,
    name
);

CREATE TABLE role (
    id,
    title,
    salarary,
    department_id
);

CREATE TABLE employee (
    id,
    first_name,
    last_name,
    role_id,
    manager_id
)