-- Department seeds
INSERT INTO department(name)  -- id 1
VALUES('Sales');

INSERT INTO department(name)  -- id 2
VALUES('Engineering');

INSERT INTO department(name)  -- id 3
VALUES('Finance');

INSERT INTO department(name)  -- id 4
VALUES('Legal');

-- ROLE seeds
INSERT INTO role (title, salary, department_id) -- id 1
VALUES('Sales Lead', 100000, 1);

INSERT INTO role (title, salary, department_id) -- id 2
VALUES('Sales Person', 80000, 1);

INSERT INTO role (title, salary, department_id) -- id 3
VALUES('Lead Engineer', 150000, 2);

INSERT INTO role (title, salary, department_id) -- id 4
VALUES('Accountant', 125000, 3);

INSERT INTO role (title, salary, department_id) -- id 5
VALUES('Accountant Manager', 180000, 3);

INSERT INTO role (title, salary, department_id) -- id 6
VALUES('Legal Team Lead', 250000, 4);

INSERT INTO role (title, salary, department_id) -- id 7
VALUES('Lawyer', 190000, 4);

INSERT INTO role (title, salary, department_id) -- id 8
VALUES('Software Engineer', 70000, 2);


-- Employee seeds

INSERT INTO employee(first_name, last_name, role_id) -- id 1
VALUES('Ashley', 'Rodriguez', 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id) -- id 2
VALUES('John', 'Doe', 1, 1);

INSERT INTO employee(first_name, last_name, role_id, manager_id) -- id 3
VALUES('Mike', 'Chan', 2, 2);

INSERT INTO employee(first_name, last_name, role_id, manager_id) -- id 4
VALUES('Kevin', 'Tupik', 8, 1);

INSERT INTO employee(first_name, last_name, role_id) -- id 5
VALUES('Malia', 'Brown', 4);

INSERT INTO employee(first_name, last_name, role_id) -- id 6
VALUES('Sarah', 'Lourd', 6);

INSERT INTO employee(first_name, last_name, role_id, manager_id) -- id 7
VALUES('Tom', 'Allen', 7, 6);
