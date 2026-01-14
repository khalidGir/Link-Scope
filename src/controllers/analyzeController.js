const analysisService = require('../services/analysisService');
const aiService = require('../services/aiService');

const analyzeUrl = async (req, res) => {
    const targetUrl = req.body.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const analysis = await analysisService.analyzeUrl(targetUrl);
        
        // Generate Single Site Chart Data
        const chartData = {
            labels: ["Internal", "External", "Images", "Social"],
            counts: [
                analysis.links.internal.length,
                analysis.links.external.length,
                analysis.images.length,
                analysis.links.social.length
            ]
        };

        res.json({ ...analysis, chartData });
    } catch (error) {
        console.error('Error analyzing URL:', error);
        res.status(500).json({ error: error.message || 'Failed to analyze the URL.' });
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

        // Generate Chart Data Schema
        const chartData = {
            labels: ["Internal Links", "External Links", "Images", "Social"],
            userValues: [
                userAnalysis.links.internal.length,
                userAnalysis.links.external.length,
                userAnalysis.images.length,
                userAnalysis.links.social.length
            ],
            compValues: [
                competitorAnalysis.links.internal.length,
                competitorAnalysis.links.external.length,
                competitorAnalysis.images.length,
                competitorAnalysis.links.social.length
            ]
        };

        res.json({
            userAnalysis,
            competitorAnalysis,
            aiPlan,
            rawPlan: aiPlan,
            chartData
        });
    } catch (error) {
        console.error('Error generating SEO plan:', error);
        res.status(500).json({ error: 'Failed to generate SEO plan. One or both URLs may be invalid, unreachable, or blocking our bot.' });
    }
};

const getLlamaInsights = async (req, res) => {
    const { userAnalysis, competitorAnalysis } = req.body;

    if (!userAnalysis || !competitorAnalysis) {
        return res.status(400).json({ error: 'Both userAnalysis and competitorAnalysis are required' });
    }

    try {
        const aiPlan = await aiService.generateSeoPlan(userAnalysis, competitorAnalysis);

        res.json({
            aiPlan
        });
    } catch (error) {
        console.error('Error generating Llama insights:', error);
        res.status(500).json({ error: 'Failed to generate Llama insights.' });
    }
};

module.exports = {
    analyzeUrl,
    generatePlan,
    getLlamaInsights
};
