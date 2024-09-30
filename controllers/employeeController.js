const { Pool } = require('pg');

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'your_username',       // replace with your PostgreSQL username
    host: 'localhost',            // replace with your host (usually localhost)
    database: 'your_database',    // replace with your database name
    password: 'your_password',    // replace with your password
    port: 5432,                   // PostgreSQL port
});

// Salary calculation logic (e.g., 10% bonus for manager)
const calculateSalary = (position, baseSalary) => {
    if (position === 'Manager') {
        return baseSalary * 1.1; // 10% bonus for managers
    }
    return baseSalary;
};

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employees');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a single employee by ID
const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
        const employee = result.rows[0];

        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new employee
const createEmployee = async (req, res) => {
    const { name, position, baseSalary } = req.body;
    if (!name || !position || !baseSalary) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const totalSalary = calculateSalary(position, baseSalary);

    try {
        const result = await pool.query(
            'INSERT INTO employees (name, position, base_salary, total_salary) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, position, baseSalary, totalSalary]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an employee
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, position, baseSalary } = req.body;

    try {
        const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
        const employee = result.rows[0];

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const updatedEmployee = {
            name: name || employee.name,
            position: position || employee.position,
            base_salary: baseSalary !== undefined ? baseSalary : employee.base_salary,
        };

        const totalSalary = calculateSalary(updatedEmployee.position, updatedEmployee.base_salary);

        const updateResult = await pool.query(
            'UPDATE employees SET name = $1, position = $2, base_salary = $3, total_salary = $4 WHERE id = $5 RETURNING *',
            [updatedEmployee.name, updatedEmployee.position, updatedEmployee.base_salary, totalSalary, id]
        );

        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM employees WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    calculateSalary
};
