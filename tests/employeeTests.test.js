const request = require('supertest');
const app = require('../app');
const { setupDatabase, cleanupDatabase } = require('./setup');

describe('Employee API', () => {
    beforeAll(async () => {
        await setupDatabase();
    });

    afterAll(async () => {
        await cleanupDatabase();
    });

    it('should create a new employee', async () => {
        const response = await request(app)
            .post('/api/employees')
            .send({ name: 'John Doe', position: 'Manager', baseSalary: 5000 });

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe('John Doe');
        expect(response.body.totalSalary).toBe(5500); // 10% bonus for manager
    });

    it('should get all employees', async () => {
        const response = await request(app).get('/api/employees');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get an employee by ID', async () => {
        const response = await request(app).get('/api/employees/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
    });

    it('should update an employee', async () => {
        const response = await request(app)
            .put('/api/employees/1')
            .send({ name: 'John Smith', baseSalary: 6000 });

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('John Smith');
        expect(response.body.totalSalary).toBe(6600); // updated salary with bonus
    });

    it('should delete an employee', async () => {
        const response = await request(app).delete('/api/employees/1');
        expect(response.statusCode).toBe(204);
    });
});

// const request = require('supertest');
// const app = require('../app');

// describe('Employee API', () => {
//     it('should create a new employee', async () => {
//         const response = await request(app)
//             .post('/api/employees')
//             .send({ name: 'John Doe', position: 'Manager', baseSalary: 5000 });

//         expect(response.statusCode).toBe(201);
//         expect(response.body.name).toBe('John Doe');
//         expect(response.body.totalSalary).toBe(5500); // 10% bonus for manager
//     });

//     it('should get all employees', async () => {
//         const response = await request(app).get('/api/employees');
//         expect(response.statusCode).toBe(200);
//         expect(response.body.length).toBeGreaterThan(0);
//     });

//     it('should get an employee by ID', async () => {
//         const response = await request(app).get('/api/employees/1');
//         expect(response.statusCode).toBe(200);
//         expect(response.body.id).toBe(1);
//     });

//     it('should update an employee', async () => {
//         const response = await request(app)
//             .put('/api/employees/1')
//             .send({ name: 'John Smith', baseSalary: 6000 });

//         expect(response.statusCode).toBe(200);
//         expect(response.body.name).toBe('John Smith');
//         expect(response.body.totalSalary).toBe(6600); // updated salary with bonus
//     });

//     it('should delete an employee', async () => {
//         const response = await request(app).delete('/api/employees/1');
//         expect(response.statusCode).toBe(204);
//     });
// });