require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
// We use path.join to ensure Vercel can find the folder in the serverless environment
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', apiRoutes);

// Explicitly serve index.html for the root route to fix "Cannot GET /"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app for Vercel deployment
module.exports = app;

// Only listen on local environment
if (require.main === module) {
  app.listen(PORT, () => {
      console.log(`Link-Scope API is running on http://localhost:${PORT}`);
  });
}
