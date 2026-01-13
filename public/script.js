// Link Scope - Frontend JavaScript
/* global Chart */
// Placeholder for frontend logic
let userChart = null;
let competitorChart = null;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('analysisForm');
    const userUrlInput = document.getElementById('userUrl');
    const competitorUrlInput = document.getElementById('competitorUrl');
    const resultsContainer = document.getElementById('resultsContainer');

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Determine which button was clicked
        const submitter = e.submitter;
        const action = submitter ? submitter.value : 'analyze';

        if (action === 'analyze') {
            // Single site analysis
            const targetUrl = userUrlInput.value.trim();
            if (!targetUrl) {
                alert('Please enter a valid URL');
                return;
            }

            // Show loading state
            resultsContainer.innerHTML = '<p>Analyzing website...</p>';

            try {
                // Call the backend API
                const response = await fetch('/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: targetUrl })
                });

                if (response.ok) {
                    const data = await response.json();
                    displayResults(data);
                } else {
                    const error = await response.json();
                    resultsContainer.innerHTML = `<p>Error: ${error.error}</p>`;
                }
            } catch (error) {
                resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            }
        } else if (action === 'generate-plan') {
            // Competitor analysis
            const userUrl = userUrlInput.value.trim();
            const competitorUrl = competitorUrlInput.value.trim();

            if (!userUrl || !competitorUrl) {
                alert('Please enter both your website URL and competitor URL');
                return;
            }

            // Show loading state
            resultsContainer.innerHTML = '<p>Generating SEO plan...</p>';

            try {
                // Call the backend API for generating plan
                const response = await fetch('/generate-plan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userUrl: userUrl, competitorUrl: competitorUrl })
                });

                if (response.ok) {
                    const data = await response.json();
                    displayAIPlan(data);
                } else {
                    const error = await response.json();
                    resultsContainer.innerHTML = `<p>Error: ${error.error}</p>`;
                }
            } catch (error) {
                resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            }
        }
    });

    // Function to display analysis results for single site
    function displayResults(data) {
        // Destroy previous charts
        if (userChart) userChart.destroy();
        if (competitorChart) competitorChart.destroy();
        document.querySelector('.chart-container').style.display = 'none'; // Hide by default

        // Create chart for single analysis
        if (data.links && Object.values(data.links).some(arr => arr.length > 0)) {
            document.querySelector('.chart-container').style.display = 'flex';
            // Hide competitor chart wrapper and show user chart wrapper
            const competitorChartWrapper = document.querySelector('#competitorLinkChart').closest('.chart-wrapper');
            const userChartWrapper = document.querySelector('#userLinkChart').closest('.chart-wrapper');

            if (competitorChartWrapper) competitorChartWrapper.style.display = 'none';
            if (userChartWrapper) userChartWrapper.style.display = 'block';
            userChart = createLinkChart('userLinkChart', data.links, 'Your Site Link Distribution');
        } else {
            // Hide the chart container if no data
            document.querySelector('.chart-container').style.display = 'none';
        }

        // Clear previous results
        resultsContainer.innerHTML = '';

        // Display links data
        if (data.links) {
            const linksSection = document.createElement('div');
            linksSection.innerHTML = '<h3>Links Analysis</h3>';

            for (const [category, links] of Object.entries(data.links)) {
                if (links.length > 0) {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.innerHTML = `<h4>${category.charAt(0).toUpperCase() + category.slice(1)} Links (${links.length})</h4>`;

                    const linksList = document.createElement('ul');
                    links.forEach(link => {
                        const listItem = document.createElement('li');
                        if (typeof link === 'object' && link.url) {
                            listItem.innerHTML = `<a href="${link.url}" target="_blank">${link.url}</a> - Anchor: "${link.anchorText || 'N/A'}"`;
                        } else {
                            listItem.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
                        }
                        linksList.appendChild(listItem);
                    });

                    categoryDiv.appendChild(linksList);
                    linksSection.appendChild(categoryDiv);
                }
            }

            resultsContainer.appendChild(linksSection);
        }

        // Display images data
        if (data.images && data.images.length > 0) {
            const imagesSection = document.createElement('div');
            imagesSection.innerHTML = '<h3>Images Analysis</h3><ul>';

            data.images.forEach(img => {
                const imgItem = document.createElement('li');
                imgItem.innerHTML = `Source: <a href="${img.src}" target="_blank">${img.src}</a> - Alt: "${img.alt || 'N/A'}"`;
                imagesSection.appendChild(imgItem);
            });

            imagesSection.innerHTML += '</ul>';
            resultsContainer.appendChild(imagesSection);
        }

        if (!data.links && !data.images) {
            resultsContainer.innerHTML = '<p>No links or images found on the page.</p>';
        }
    }

    // Function to display AI plan results
    function displayAIPlan(data) {
        // Destroy previous charts
        if (userChart) userChart.destroy();
        if (competitorChart) competitorChart.destroy();
        document.querySelector('.chart-container').style.display = 'none'; // Hide by default

        // Create charts for comparison
        if (data.userAnalysis || data.competitorAnalysis) {
            document.querySelector('.chart-container').style.display = 'flex';

            // Ensure both chart containers are visible
            const userChartWrapper = document.querySelector('#userLinkChart').closest('.chart-wrapper');
            const competitorChartWrapper = document.querySelector('#competitorLinkChart').closest('.chart-wrapper');

            if (userChartWrapper) userChartWrapper.style.display = 'block';
            if (competitorChartWrapper) competitorChartWrapper.style.display = 'block';

            // Create user chart if user analysis exists
            if (data.userAnalysis && data.userAnalysis.links) {
                userChart = createLinkChart('userLinkChart', data.userAnalysis.links, 'Your Site Link Distribution');
            }

            // Create competitor chart if competitor analysis exists
            if (data.competitorAnalysis && data.competitorAnalysis.links) {
                competitorChart = createLinkChart('competitorLinkChart', data.competitorAnalysis.links, 'Competitor Site Link Distribution');
            }
        }

        // Clear previous results
        resultsContainer.innerHTML = '';

        // Display the AI-generated plan
        if (data.aiPlan) {
            const planSection = document.createElement('div');
            planSection.classList.add('ai-plan-section');
            planSection.innerHTML = '<h3>AI-Powered SEO Recommendations</h3>';

            // Convert the plan text to HTML with proper formatting
            const planContent = document.createElement('div');
            planContent.classList.add('ai-plan-content');

            // Split the plan by newlines to create paragraphs
            const planItems = data.aiPlan.split('\n');
            const list = document.createElement('ol');

            planItems.forEach(item => {
                if (item.trim() !== '') {
                    const listItem = document.createElement('li');

                    // Process the item to handle markdown-like formatting
                    let processedItem = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                    listItem.innerHTML = processedItem.trim();
                    list.appendChild(listItem);
                }
            });

            planContent.appendChild(list);
            planSection.appendChild(planContent);
            resultsContainer.appendChild(planSection);
        }

        // Optionally display user and competitor analysis data as well
        if (data.userAnalysis || data.competitorAnalysis) {
            const comparisonSection = document.createElement('div');
            comparisonSection.classList.add('comparison-section');
            comparisonSection.innerHTML = '<h3>Site Comparisons</h3>';

            if (data.userAnalysis) {
                const userSection = document.createElement('div');
                userSection.innerHTML = '<h4>Your Site Analysis</h4>';
                if (data.userAnalysis.links) {
                    for (const [category, links] of Object.entries(data.userAnalysis.links)) {
                        if (links.length > 0) {
                            const categoryDiv = document.createElement('div');
                            categoryDiv.innerHTML = `<h5>${category.charAt(0).toUpperCase() + category.slice(1)} Links (${links.length} found)</h5>`;
                            userSection.appendChild(categoryDiv);
                        }
                    }
                }
                if (data.userAnalysis.images) {
                    const imagesDiv = document.createElement('div');
                    imagesDiv.innerHTML = `<h5>Images (${data.userAnalysis.images.length} found)</h5>`;
                    userSection.appendChild(imagesDiv);
                }
                comparisonSection.appendChild(userSection);
            }

            if (data.competitorAnalysis) {
                const competitorSection = document.createElement('div');
                competitorSection.innerHTML = '<h4>Competitor Site Analysis</h4>';
                if (data.competitorAnalysis.links) {
                    for (const [category, links] of Object.entries(data.competitorAnalysis.links)) {
                        if (links.length > 0) {
                            const categoryDiv = document.createElement('div');
                            categoryDiv.innerHTML = `<h5>${category.charAt(0).toUpperCase() + category.slice(1)} Links (${links.length} found)</h5>`;
                            competitorSection.appendChild(categoryDiv);
                        }
                    }
                }
                if (data.competitorAnalysis.images) {
                    const imagesDiv = document.createElement('div');
                    imagesDiv.innerHTML = `<h5>Images (${data.competitorAnalysis.images.length} found)</h5>`;
                    competitorSection.appendChild(imagesDiv);
                }
                // Add the fully constructed competitor section to the main comparison container
                comparisonSection.appendChild(competitorSection);
            }

            resultsContainer.appendChild(comparisonSection);
        }
    }

    function createLinkChart(canvasId, linksData, chartTitle) {
        const labels = [];
        const counts = [];
        if (linksData) {
            for (const [category, links] of Object.entries(linksData)) {
                labels.push(category.charAt(0).toUpperCase() + category.slice(1));
                counts.push(links.length);
            }
        }

        // Only create chart if we have data
        if (labels.length > 0 && counts.some(count => count > 0)) {
            const ctx = document.getElementById(canvasId).getContext('2d');
            return new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Link Count',
                        data: counts,
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: chartTitle
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
        return null; // Return null if no valid data
    }
});