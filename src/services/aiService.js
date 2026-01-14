const { HfInference } = require('@huggingface/inference');

const generateSeoPlan = async (userAnalysis, competitorAnalysis) => {
    // Check for API token
    if (!process.env.HF_TOKEN) {
        console.warn('HF_TOKEN is missing in .env file.');
        return `[OFFLINE MODE]: 
1. **Improve Internal Linking:** User has ${userAnalysis.links.internal.length} internal links vs Competitor's ${competitorAnalysis.links.internal.length}.
2. **Optimize Images:** User has ${userAnalysis.images.length} images. Check alt tags.
3. **Meta Analysis:** Title: "${userAnalysis.meta.title}". Ensure it is optimized.`;
    }

    const hf = new HfInference(process.env.HF_TOKEN);
    const model = 'meta-llama/Llama-3.1-8B-Instruct';

    // Construct a concise summary for the AI to avoid token limits
    const userSummary = `
    - URL: ${userAnalysis.meta.title}
    - Description: ${userAnalysis.meta.description}
    - Internal Links: ${userAnalysis.links.internal.length}
    - External Links: ${userAnalysis.links.external.length}
    - Images: ${userAnalysis.images.length}
    `;

    const competitorSummary = `
    - URL: ${competitorAnalysis.meta.title}
    - Description: ${competitorAnalysis.meta.description}
    - Internal Links: ${competitorAnalysis.links.internal.length}
    - External Links: ${competitorAnalysis.links.external.length}
    - Images: ${competitorAnalysis.images.length}
    `;

    const systemPrompt = "You are a senior SEO consultant. Analyze the provided site metrics and provide a high-impact strategic action plan. Format the response in Markdown using these specific headers: '🚀 Quick Wins', '🛡️ Technical Debt', and '💡 Strategic Opportunities'. Keep it concise.";
    const userMessage = `Compare my site stats with my competitor and provide actionable advice.\n\nMy Site:${userSummary}\n\nCompetitor Site:${competitorSummary}`;

    try {
        const response = await hf.chatCompletion({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 500,
            temperature: 0.7
        });

        // Extract the message content
        return response.choices[0].message.content;

    } catch (error) {
        console.error('Hugging Face API Error:', error);
        return `[FALLBACK - API ERROR]:
1. **Check Internal Links:** You have ${userAnalysis.links.internal.length} links.
2. **Review Meta Tags:** Title is "${userAnalysis.meta.title}".
3. **Compare Content:** Competitor has ${competitorAnalysis.links.external.length} external citations.`;
    }
};

module.exports = {
    generateSeoPlan
};