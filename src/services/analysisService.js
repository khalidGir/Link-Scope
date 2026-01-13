const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { URL } = require('url');

// Helper function to normalize and validate a URL
const normalizeUrl = (url, baseUrl) => {
    try {
        // new URL(url, baseUrl) works for both absolute and relative URLs (with or without leading /)
        return new URL(url, baseUrl).href;
    } catch (_error) {
        return null;
    }
};

// Helper function to categorize a link
const categorizeLink = (normalizedLink, baseDomain, rel) => {
    const link = normalizedLink;

    if (rel && rel.includes('sponsored')) {
        return 'sponsored';
    }
    else if (link.includes('tag=') || link.includes('/gp/product/') || link.includes('awin')) {
        return 'affiliate';
    }
    else if (['facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com', 'youtube.com'].some(domain => link.includes(domain))) {
        return 'social';
    }
    else if (new URL(link).hostname === baseDomain) {
        return 'internal';
    }
    else {
        return 'external';
    }
};

// Reusable function to analyze a URL
const analyzeUrl = async (targetUrl) => {
    let baseUrl;
    let baseDomain;
    try {
        baseUrl = new URL(targetUrl).href;
        baseDomain = new URL(targetUrl).hostname;
    } catch (_error) {
        throw new Error('Invalid URL provided');
    }

    const response = await fetch(baseUrl, {
        headers: {
            'User-Agent': 'Link-Scope-Bot/1.0 (+https://github.com/your-username/link-scope)'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const categorizedLinks = {
        internal: [],
        external: [],
        social: [],
        affiliate: [],
        sponsored: []
    };

    $('a').each((index, element) => {
        const href = $(element).attr('href');
        const rel = $(element).attr('rel') || '';
        const anchorText = $(element).text().trim();

        if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
            return;
        }

        const normalizedUrl = normalizeUrl(href, baseUrl);
        if (!normalizedUrl) {
            return;
        }

        const category = categorizeLink(normalizedUrl, baseDomain, rel);

        categorizedLinks[category].push({
            url: normalizedUrl,
            anchorText: anchorText
        });
    });

    const images = [];
    $('img').each((index, element) => {
        const src = $(element).attr('src');
        const alt = $(element).attr('alt') || '';

        if (src) {
            const normalizedSrc = normalizeUrl(src, baseUrl);
            if (normalizedSrc) {
                images.push({
                    src: normalizedSrc,
                    alt: alt
                });
            }
        }
    });

    for (const category in categorizedLinks) {
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
};

module.exports = {
    analyzeUrl
};
