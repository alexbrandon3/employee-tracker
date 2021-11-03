const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");
const connection = require("./db/connection");

class GetInfo {
  constructor(connection) {
    this.db = connection;
  }
  promptUser() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Choose an action:",
          name: "choice",
          choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a new employee",
            "Add a new role",
            "Add a new department",
            "Update an existing employee",
            "Delete an employee",
            "Delete a department",
            "Delete a role",
            "Quit",
          ],
        },
      ])
      .then((decision) => {
        switch (decision.choice) {
          case "View all departments":
            this.viewDepartments();
            break;
          case "View all employees":
            this.viewEmployees();
            break;
          case "View all roles":
            this.viewRoles();
            break;
          case "Add a new employee":
            this.addEmployee();
            break;
          case "Add a new role":
            this.addRole();
            break;
          case "Add a new department":
            this.addDepartment();
            break;
          case "Update an existing employee":
            this.updateEmployee();
            break;
          case "Delete an employee":
            this.deleteEmployee();
            break;
          case "Delete a department":
            this.deleteDepartment();
            break;
          case "Delete a role":
            this.deleteRole();
            break;
          case "Quit":
            this.quit();
            break;
        }
      });
  }
  viewDepartments = async () => {
    console.log("------Viewing All Departments------\n");
    const sqlQuery = "SELECT * FROM departments";
    const rows = await this.db.query(sqlQuery);
    console.table(rows);
    return this.promptUser();
  };
  viewEmployees = async () => {
    console.log("------Viewing All Employees------\n");
    const sqlQuery = `SELECT employees.id, 
        employees.first_name, 
        employees.last_name, 
        roles.title, 
        departments.department_name AS department,
        roles.salary, 
        CONCAT (manager.first_name, " ", manager.last_name) AS manager
      FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees manager ON employees.manager_id = manager.id;`;
    const rows = await this.db.query(sqlQuery);
    console.table(rows);
    return this.promptUser();
  };
  viewRoles = async () => {
    console.log("------Viewing All Roles------\n");
    const sqlQuery =
      "SELECT roleS.id, roles.title, roles.salary, departments.department_name AS department FROM roles INNER JOIN departments ON roles.department_id=departments.id;";
    const rows = await this.db.query(sqlQuery);
    console.table(rows);
    return this.promptUser();
  };
  addEmployee = async () => {
    console.log("------Adding a New Employee------\n");
    const managers = await this.db.query(
      "select id, first_name, last_name from employees;"
    );
    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    const roles = await this.db.query(
      "select id, title from roles;"
    );
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is your employee's first name?",
          name: "first_name",
        },
        {
          type: "input",
          message: "What is your employee's last name?",
          name: "last_name",
        },
        {
          type: "list",
          message: "Please select a role for this employee.",
          name: "role_id",
          choices: roleChoices,
        },
        {
          type: "list",
          message: "Please select this employee's manager.",
          name: "manager_id",
          choices: managerChoices,
        },
      ])
      .then(async (data) => {
        const sqlQuery = `INSERT INTO employees SET ?;`;
        await this.db.query(sqlQuery, data);
        this.viewEmployees();
      });
  };
  addDepartment = async () => {
    console.log("------Creating a New Department------\n")
    inquirer
      .prompt([
        {
          type: "input",
          message:
            "What is the name of the department you would like to create?",
          name: "department_name",
        },
      ])
      .then(async (data) => {
        const sqlQuery = `INSERT INTO departments SET ?;`;
        await this.db.query(sqlQuery, data);
        this.viewDepartments();
      });
  };
  addRole = async () => {
    console.log("------Creating a New Role------\n");
    const departments = await this.db.query(
      "select id, department_name from departments;"
    );
    const deptChoices = departments.map(({ id, department_name }) => ({
      name: department_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the role you would like to create?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the salary of this new role?",
          name: "salary",
        },
        {
          type: "list",
          message: "Which department would you like to assign this role to?",
          name: "department_id",
          choices: deptChoices,
        },
      ])
      .then(async (data) => {
        const sqlQuery = `INSERT INTO roles SET ?;`;
        await this.db.query(sqlQuery, data);
        this.viewRoles();
      });
  };
  updateEmployee = async () => {
    const employees = await this.db.query(
      "SELECT id, first_name, last_name FROM employees;"
    );
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which employee would you like to update?",
          choices: employeeChoices,
        },
      ])
      .then(async (choice) => {
        const attributes = [];
        attributes.push(choice.id);
        const roles = await this.db.query(`SELECT * FROM roles`);
        const roleOptions = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "id",
              message: "What is the employee's new role?",
              choices: roleOptions,
            },
          ])
          .then(async (roleChoice) => {
            const role = roleChoice.id;
            attributes.push(role);
            await this.db.query(
              `UPDATE employees SET role_id = ${attributes[1]} WHERE id = ${attributes[0]};`
            );
            this.viewEmployees();
          });
      });
  };
  deleteEmployee = async () => {
    const employees = await this.db.query(
      "SELECT id, first_name, last_name FROM employees;"
    );
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which employee would you like to remove?",
          choices: employeeChoices,
        },
      ])
      .then(async (data) => {
        await this.db.query(`DELETE FROM employees WHERE id = ${data.id}`);
        this.viewEmployees();
      });
  };
  deleteDepartment = async () => {
    const departments = await this.db.query(
      "SELECT id, department_name FROM departments;"
    );
    const departmentChoices = departments.map(({ id, department_name }) => ({
      name: department_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which department would you like to remove?",
          choices: departmentChoices,
        },
      ])
      .then(async (data) => {
        await this.db.query(`DELETE FROM departments WHERE id = ${data.id}`);
        this.viewDepartments();
      });
  };
  deleteRole = async () => {
    const roles = await this.db.query("SELECT id, title FROM roles;");
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which role would you like to remove?",
          choices: roleChoices,
        },
      ])
      .then(async (data) => {
        await this.db.query(`DELETE FROM roles WHERE id = ${data.id}`);
        this.viewRoles();
      });
  };
  quit = () => {
    this.db.end();
  };
}

module.exports = new GetInfo(connection);
