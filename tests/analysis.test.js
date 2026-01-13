const analysisService = require('../src/services/analysisService');
// We need to export helper functions from analysisService to test them individually, 
// or just test the main function.
// For now, I'll modify analysisService to export helpers if possible, 
// or better, I will mock the fetch call and test analyzeUrl.

// Actually, looking at analysisService.js, I didn't export the helpers.
// I should export them for unit testing or keep them private and test analyzeUrl.
// Testing analyzeUrl requires mocking node-fetch.

jest.mock('node-fetch');
const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('Analysis Service', () => {
    
    beforeEach(() => {
        fetch.mockClear();
    });

    test('analyzeUrl should correctly categorize links', async () => {
        const mockHtml = `
            <html>
                <body>
                    <a href="https://example.com/about">Internal</a>
                    <a href="https://google.com">External</a>
                    <img src="logo.png" alt="Logo">
                </body>
            </html>
        `;

        fetch.mockReturnValue(Promise.resolve(new Response(mockHtml)));

        const result = await analysisService.analyzeUrl('https://example.com');

        expect(result.links.internal).toHaveLength(1);
        expect(result.links.internal[0].url).toBe('https://example.com/about');
        expect(result.links.external).toHaveLength(1);
        expect(result.links.external[0].url).toBe('https://google.com/');
        expect(result.images).toHaveLength(1);
        expect(result.images[0].src).toBe('https://example.com/logo.png');
    });

    test('analyzeUrl should handle invalid URLs gracefully', async () => {
        await expect(analysisService.analyzeUrl('invalid-url'))
            .rejects
            .toThrow('Invalid URL provided');
    });
});
