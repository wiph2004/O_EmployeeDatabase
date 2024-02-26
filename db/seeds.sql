INSERT INTO department (name)
VALUES  ('Engineering'),
        ('Customer Service'),
        ('Sales'),
        ('Testing'),
        ('Logistics');

INSERT INTO role (title, salary, department_id)
VALUES  ('Engineer', 80000, 1),
        ('Lead Engineer', 120000, 1),
        ('Phones Lead', 40000, 2),
        ("Phone Manager", 60000, 2),
        ('Client Getter', 50000, 3),
        ('Best Clienter', 100000, 3),
        ('Tester', 45000, 4),
        ('Lead Tester', 60000, 4),
        ('Hauler', 50000, 5),
        ('Warehouse', 75000, 5);

    -- managers only
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  ('Bill', 'Gurr', 2, NULL),
        ('Dave', 'Chappy', 4, NULL),
        ('Rich', 'After', 6, NULL),
        ('Chris', 'Broke', 8, NULL),
        ('Sarah', 'Goldy', 10, NULL);
        
    -- all other employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  ('John', 'Lynch', 1, 1),
        ('Jess', 'Johns', 3, 2),
        ('Kyle', 'Knows', 5, 3),
        ('Tye', 'Debwo', 7, 4),
        ('Laury', 'Bouti', 9, 5);
