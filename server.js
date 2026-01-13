const express = require('express');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/', apiRoutes);

app.listen(PORT, () => {
    console.log(`Link-Scope API is running on http://localhost:${PORT}`);
});