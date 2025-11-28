# Link Scope - Intelligent SEO & Website Analysis Tool

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/link-scope) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An advanced web analysis tool that goes beyond simple link scraping. Link Scope provides a comprehensive SEO and content audit of any webpage, identifies key issues, and leverages AI to generate actionable recommendations for improvement.

**Live Demo :** `(https://link-scope.onrender.com/)`

---

## ✨ Core Features

Link Scope provides a detailed analysis report that includes:

*   **🔗 Comprehensive Link Analysis:**
    *   **Categorization:** Automatically categorizes every link into `internal`, `external`, `social`, `affiliate`, or `sponsored`.
    *   **Anchor Text Extraction:** Reports the visible "anchor text" for every link, which is crucial for SEO auditing.
    *   **Broken Link Detection:** (Planned) Checks the status of every link to identify and flag broken links (404s, etc.).

*   **🖼️ Image & Accessibility Audit:**
    *   Scans all images on the page and checks for missing `alt` text, a key factor for both SEO and web accessibility.

*   **🤖 AI-Powered SEO Advisor:**
    *   **Competitor Comparison:** Analyzes your URL alongside a competitor's to provide comparative insights.
    *   **Actionable Recommendations:** Generates concise, expert-level SEO plans with 3-5 key recommendations based on the comparison data.

*   **📊 Data Visualization & Export:**
    *   Presents analysis results in clean, easy-to-understand charts and graphs (using Chart.js).
    *   Allows you to export the full analysis report as a `PDF` or `CSV` file for offline use. (Planned)

---

## 🛠️ How It Works

The application is built on a simple but powerful Node.js backend.

1.  **Fetch:** The user provides a URL, which the Express server fetches using `node-fetch`.
2.  **Parse:** The raw HTML is parsed using `cheerio`, creating a traversable DOM structure on the server.
3.  **Analyze:** The core logic scans the DOM for links and images, extracting attributes and categorizing the data.
4.  **Advise (Optional):** For competitor analysis, the JSON reports for both URLs are sent to an AI model to generate strategic advice.
5.  **Report:** The final analysis, including the AI recommendations, is sent to the frontend as a JSON object to be visualized.

---

## 🔌 API Documentation

The core of the project is a single powerful API endpoint.

### `POST /analyze`

Analyzes a single URL and returns its link and image data.

*   **Request Body:**
    ```json
    {
      "url": "https://example.com"
    }
    ```

*   **Success Response (200):**
    ```json
    {
      "links": {
        "internal": [
          { "url": "https://example.com/about", "anchorText": "About Us" }
        ],
        "external": [
          { "url": "https://another-site.com/", "anchorText": "Visit our partner" }
        ],
        "social": [],
        "affiliate": [],
        "sponsored": []
      },
      "images": [
        { "src": "https://example.com/logo.png", "alt": "Company Logo" },
        { "src": "https://example.com/hero.jpg", "alt": "" } // Empty alt text
      ]
    }
    ```

### `POST /generate-plan`

Analyzes two URLs and returns an AI-generated SEO plan.

*   **Request Body:**
    ```json
    {
      "userUrl": "https://your-site.com",
      "competitorUrl": "https://competitor-site.com"
    }
    ```

*   **Success Response (200):**
    ```json
    {
      "userAnalysis": { ... },
      "competitorAnalysis": { ... },
      "aiPlan": "1. **Improve Internal Linking:** Your site has fewer internal links than the competitor. Focus on linking relevant content. \n2. **Optimize Image Alt Text:** Several of your images are missing alt text. Ensure all images have descriptive alt attributes for SEO and accessibility. \n3. **Diversify Anchor Text:** Review your internal and external links to ensure a variety of relevant anchor texts are used, avoiding over-optimization."
    }
    ```

---

## 🖥️ User Interface & Visualization

The Link Scope application features an intuitive web interface that allows users to:

*   **Analyze Single Sites:** Enter a URL and click "Analyze Site" to get a comprehensive link and image analysis with anchor text extraction.
*   **Generate AI SEO Plans:** Enter both a user URL and a competitor URL, then click "Generate SEO Plan" to receive comparative analysis and AI-generated recommendations.
*   **Visual Data Representation:** Link distribution is displayed using interactive charts powered by Chart.js, making it easy to understand the breakdown of internal, external, social, affiliate, and sponsored links.
*   **Detailed Results:** View comprehensive analysis results including categorized links with their anchor text and images with their alt attributes.

![Link Scope Application Screenshot](screenshot.png "Link Scope UI showing analysis results and visualization")

## 🚀 Getting Started

Instructions to get a local copy up and running.

### Prerequisites

*   Node.js (v14 or higher)
*   npm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/khaidGir/link-scope.git
    cd link-scope
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the server:**
    ```sh
    npm start
    ```
    The server will be running at `http://localhost:3000`.

---


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
