-- DEPARTMENT SEEDS --
INSERT INTO departments (department_name)
VALUE ("Accounting");
INSERT INTO departments (department_name)
VALUE ("IT");
INSERT INTO departments (department_name)
VALUE ("Software Engineering");
INSERT INTO departments (department_name)
VALUE ("Money Laundering");

-- ROLE SEEDS --
INSERT INTO roles (title, salary, department_id)
VALUE ("Senior Accountant", 85000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ("Accountant", 71000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ("Lead IT Guy", 115000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ("IT Guy", 55000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 3);
INSERT INTO roles (title, salary, department_id)
VALUE ("Software Engineer", 76000, 3);
INSERT INTO roles (title, salary, department_id)
VALUE ("Lead CPA", 200000, 4);
INSERT INTO roles (title, salary, department_id)
VALUE ("CPA", 60000, 4);

--EMPLOYEE SEEDS--
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUE ("Stan", "Marsh", 1, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUE ("Kyle", "Broflovski", 2, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUE ("Eric","Cartman", 3, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUE ("Wendy", "Testaburger", 4, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUE ("Leopold", "Stotch", 5, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUE ("Kenny", "McCormick", 6, 5);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUE ("Herbert", "Garrison", 7, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUE ("Bebe", "Stevens", 8, 7);