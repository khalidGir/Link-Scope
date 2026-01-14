require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/', apiRoutes);

// Export app for Vercel deployment
module.exports = app;

// Only listen on local environment
if (require.main === module) {
  app.listen(PORT, () => {
      console.log(`Link-Scope API is running on http://localhost:${PORT}`);
  });
}