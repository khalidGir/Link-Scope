const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');

router.post('/analyze', analyzeController.analyzeUrl);
router.post('/generate-plan', analyzeController.generatePlan);
router.post('/api/ai/llama', analyzeController.getLlamaInsights);

module.exports = router;
