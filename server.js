// Create an Express server that listens on port 3000
const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio'); // 1. Require at the top

const app = express();
const PORT = process.env.PORT || 3000; // 2. Use environment variable

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Helper function to normalize and validate a URL
const normalizeUrl = (url, baseUrl) => {
    try {
        // If it's a relative link (starts with /), resolve it against the base URL
        if (url.startsWith('/')) {
            return new URL(url, baseUrl).href;
        }
        // If it's a full URL, use it directly
        return new URL(url).href;
    } catch (error) {
        // If URL construction fails, it's invalid, so we return null to filter it out later.
        return null;
    }
};

// Helper function to categorize a link
const categorizeLink = (normalizedLink, baseDomain, rel) => {
    const link = normalizedLink;

    // Check if link is sponsored (look for rel attribute)
    if (rel && rel.includes('sponsored')) {
        return 'sponsored';
    }
    // Check if link is an affiliate link
    else if (link.includes('tag=') || link.includes('/gp/product/') || link.includes('awin')) {
        return 'affiliate';
    }
    // Check if link is social media
    else if (['facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com', 'youtube.com'].some(domain => link.includes(domain))) {
        return 'social';
    }
    // Check if link is internal (check if its hostname matches the base domain)
    else if (new URL(link).hostname === baseDomain) {
        return 'internal';
    }
    // Otherwise, it's external
    else {
        return 'external';
    }
};

// Reusable function to analyze a URL
async function analyzeUrl(targetUrl) {
    // Validate the input URL format
    let baseUrl;
    let baseDomain;
    try {
        baseUrl = new URL(targetUrl).href; // This validates the URL
        baseDomain = new URL(targetUrl).hostname;
    } catch (error) {
        throw new Error('Invalid URL provided');
    }

    // Fetch the HTML content from the targetUrl using node-fetch
    const response = await fetch(baseUrl, {
        headers: {
            'User-Agent': 'Link-Scope-Bot/1.0 (+https://github.com/your-username/link-scope)' // 3. Good bot etiquette
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Load the html content into cheerio for parsing
    const $ = cheerio.load(html);

    // Initialize categorized object
    const categorizedLinks = {
        internal: [],
        external: [],
        social: [],
        affiliate: [],
        sponsored: []
    };

    // Find all 'a' tags and process them
    $('a').each((index, element) => {
        const href = $(element).attr('href');
        const rel = $(element).attr('rel') || '';
        const anchorText = $(element).text().trim(); // Extract the anchor text

        // Skip if no href, or if it's a mailto: tel: javascript: link
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
            return; // This is like 'continue' in a forEach
        }

        // Normalize the URL (convert relative to absolute, etc.)
        const normalizedUrl = normalizeUrl(href, baseUrl);
        if (!normalizedUrl) {
            return; // Skip invalid URLs
        }

        // Categorize the link
        const category = categorizeLink(normalizedUrl, baseDomain, rel);

        // Push an object containing both URL and anchor text into the correct category
        categorizedLinks[category].push({
            url: normalizedUrl,
            anchorText: anchorText
        });
    });

    // Extract image tags with their src and alt attributes
    const images = [];
    $('img').each((index, element) => {
        const src = $(element).attr('src');
        const alt = $(element).attr('alt') || ''; // Use empty string if no alt attribute

        if (src) {
            // Normalize the image source URL (convert relative to absolute, etc.)
            const normalizedSrc = normalizeUrl(src, baseUrl);
            if (normalizedSrc) {
                images.push({
                    src: normalizedSrc,
                    alt: alt
                });
            }
        }
    });

    // 4. (Optional) Deduplicate links in each category
    for (const category in categorizedLinks) {
        // Update deduplication to work with objects containing url and anchorText
        const seenUrls = new Set();
        categorizedLinks[category] = categorizedLinks[category].filter(item => {
            const url = typeof item === 'object' ? item.url : item;
            if (seenUrls.has(url)) {
                return false;
            }
            seenUrls.add(url);
            return true;
        });
    }

    return {
        links: categorizedLinks,
        images: images
    };
}

app.post('/analyze', async (req, res) => {
    // Get the URL from the request body
    const targetUrl = req.body.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const analysis = await analyzeUrl(targetUrl);
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing URL:', error);
        // Provide a more specific error message
        res.status(500).json({ error: 'Failed to analyze the URL. It may be invalid, unreachable, or blocking our bot.' });
    }
});

app.post('/generate-plan', async (req, res) => {
    const { userUrl, competitorUrl } = req.body;

    if (!userUrl || !competitorUrl) {
        return res.status(400).json({ error: 'Both userUrl and competitorUrl are required' });
    }

    try {
        // Analyze both URLs using the reusable function
        const userAnalysis = await analyzeUrl(userUrl);
        const competitorAnalysis = await analyzeUrl(competitorUrl);

        // Simulate an LLM response (in a real implementation, this would call an actual LLM API)
        const aiPlan = `1. **Improve Internal Linking:** Your site has fewer internal links than the competitor. Focus on linking relevant content.
2. **Optimize Image Alt Text:** Several of your images are missing alt text. Ensure all images have descriptive alt attributes for SEO and accessibility.
3. **Diversify Anchor Text:** Review your internal and external links to ensure a variety of relevant anchor texts are used, avoiding over-optimization.
4. **Boost External Link Quality:** The competitor appears to have more authoritative external links. Consider building relationships with reputable sites in your industry.`;

        res.json({
            userAnalysis,
            competitorAnalysis,
            aiPlan
        });
    } catch (error) {
        console.error('Error generating SEO plan:', error);
        res.status(500).json({ error: 'Failed to generate SEO plan. One or both URLs may be invalid, unreachable, or blocking our bot.' });
    }
});

app.listen(PORT, () => {
    console.log(`Link-Scope API is running on http://localhost:${PORT}`);
});
