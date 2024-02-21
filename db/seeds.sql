INSERT INTO department (name)
VALUES  ('Engineering'),
        ('Customer Service'),
        ('Sales'),
        ('Testing'),
        ('Logistics');

INSERT INTO role (title, salary, department_id)
VALUES  ('Engineer', 80000, 1),
        ('Lead Engineer', 120000, 1),
        ('Phone Specialist', 40000, 2),
        ("Phone Manager", 60000, 2),
        ('Client Acquirer', 50000, 3),
        ('Best Client Acquirer', 100000, 3),
        ('Tester', 45000, 4),
        ('Lead Tester', 60000, 4),
        ('Hauler', 50000, 5),
        ('Warehouse Manager', 75000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Bill', 'Gurr', 2),
        ('Dave', 'Chappy', 4),
        ('Richard', 'After', 6),
        ('Chris', 'Broke', 8),
        ('Sarah', 'Golderman', 10),
        ('John', 'Lynch', 1, 1),
        ('Jessica', 'Johns', 3, 2),
        ('Kyle', 'Knowsite', 5, 3),
        ('Tye', 'Debwoski', 7, 4),
        ('Lauren', 'Allboutit', 9, 5),