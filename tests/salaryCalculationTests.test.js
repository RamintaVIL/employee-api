const { calculateSalary } = require('../controllers/employeeController');

describe('Salary Calculation', () => {
    it('should add 10% bonus for managers', () => {
        const salary = calculateSalary('Manager', 5000);
        expect(salary).toBe(5500);
    });

    it('should not add bonus for other positions', () => {
        const salary = calculateSalary('Developer', 5000);
        expect(salary).toBe(5000);
    });

    it('should add 10% bonus for senior managers', () => {
        const salary = calculateSalary('Senior Manager', 6000);
        expect(salary).toBe(6600); // 10% bonus for Senior Manager
    });

    it('should handle zero salary', () => {
        const salary = calculateSalary('Manager', 0);
        expect(salary).toBe(0); // 0 salary should remain 0
    });

    it('should handle negative salary', () => {
        const salary = calculateSalary('Developer', -5000);
        expect(salary).toBe(-5000); // Negative salary should remain negative
    });
});