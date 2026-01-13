const analysisService = require('../services/analysisService');
const aiService = require('../services/aiService');

const analyzeUrl = async (req, res) => {
    const targetUrl = req.body.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const analysis = await analysisService.analyzeUrl(targetUrl);
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing URL:', error);
        res.status(500).json({ error: 'Failed to analyze the URL. It may be invalid, unreachable, or blocking our bot.' });
    }
};

const generatePlan = async (req, res) => {
    const { userUrl, competitorUrl } = req.body;

    if (!userUrl || !competitorUrl) {
        return res.status(400).json({ error: 'Both userUrl and competitorUrl are required' });
    }

    try {
        const userAnalysis = await analysisService.analyzeUrl(userUrl);
        const competitorAnalysis = await analysisService.analyzeUrl(competitorUrl);
        const aiPlan = await aiService.generateSeoPlan(userAnalysis, competitorAnalysis);

        res.json({
            userAnalysis,
            competitorAnalysis,
            aiPlan
        });
    } catch (error) {
        console.error('Error generating SEO plan:', error);
        res.status(500).json({ error: 'Failed to generate SEO plan. One or both URLs may be invalid, unreachable, or blocking our bot.' });
    }
};

module.exports = {
    analyzeUrl,
    generatePlan
};
