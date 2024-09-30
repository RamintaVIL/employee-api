const express = require('express');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
app.use(express.json());

app.use('/api/employees', employeeRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;