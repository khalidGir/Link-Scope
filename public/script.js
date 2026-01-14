// Link Scope - Frontend Logic
/* global Chart */

let chartInstance = null;
let currentRawPlan = "";

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('analysisForm');
    const initialState = document.getElementById('initialState');
    const mainGrid = document.getElementById('mainGrid');
    const aiPlanContent = document.getElementById('aiPlanContent');
    const aiSkeleton = document.getElementById('aiSkeleton');
    const metricsGrid = document.getElementById('metricsGrid');
    const copyPlanBtn = document.getElementById('copyPlanBtn');
    const chartLegend = document.getElementById('chartLegend');
    
    // Inputs
    const userUrlInput = document.getElementById('userUrl');
    const competitorUrlInput = document.getElementById('competitorUrl');

    // --- State Management ---
    
    function setViewState(state) {
        if (state === 'initial') {
            initialState.classList.remove('hidden');
            mainGrid.classList.add('hidden');
        } else if (state === 'active') {
            initialState.classList.add('hidden');
            mainGrid.classList.remove('hidden');
        }
    }

    function toggleAiLoading(isLoading) {
        if (isLoading) {
            aiPlanContent.classList.add('hidden');
            aiSkeleton.classList.remove('hidden');
        } else {
            aiPlanContent.classList.remove('hidden');
            aiSkeleton.classList.add('hidden');
        }
    }

    // --- Form Handling ---

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const action = e.submitter ? e.submitter.value : 'analyze';
        
        // Validation
        const userUrl = userUrlInput.value.trim();
        if (!userUrl) return alert('Please enter a valid URL');

        if (action === 'analyze') {
            // Immediate Traffic Analysis
            setViewState('active');
            
            // Show loading in metrics/chart only? 
            // For now, we assume fast response. 
            // Ideally we'd show a mini-loader in the chart area.
            
            try {
                const res = await fetch('/analyze', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ url: userUrl })
                });
                
                if (res.ok) {
                    const data = await res.json();
                    renderDashboard(data, 'single');
                } else {
                    const err = await res.json();
                    alert(`Error: ${err.error}`);
                }
            } catch (err) {
                alert(`Connection Error: ${err.message}`);
            }

        } else if (action === 'generate-plan') {
            // Strategic Analysis
            const compUrl = competitorUrlInput.value.trim();
            if (!compUrl) return alert('Please enter a Competitor URL for AI Analysis');

            setViewState('active');
            toggleAiLoading(true);

            try {
                const res = await fetch('/generate-plan', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ userUrl, competitorUrl: compUrl })
                });

                if (res.ok) {
                    const data = await res.json();
                    renderDashboard(data, 'full');
                } else {
                    const err = await res.json();
                    alert(`AI Error: ${err.error}`);
                }
            } catch (err) {
                alert(`Connection Error: ${err.message}`);
            } finally {
                toggleAiLoading(false);
            }
        }
    });

    // --- Rendering Logic ---

    function renderDashboard(data, mode) {
        // 1. Chart Rendering
        // Ensure we handle both single and comparison data structures
        const chartData = data.chartData; 
        
        if (chartData) {
            renderChart(chartData, mode);
        }

        // 2. Metrics Cards
        renderMetrics(data, mode);

        // 3. AI Plan (Only for 'full' mode)
        if (mode === 'full') {
            renderAiPlan(data.aiPlan, data.rawPlan);
        } else {
            // Reset AI panel for single view
            aiPlanContent.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-zinc-600 space-y-3">
                    <i class="fas fa-lock text-2xl opacity-20"></i>
                    <p class="text-xs">Add a competitor to unlock AI insights.</p>
                </div>
            `;
            currentRawPlan = "";
        }
    }

    function renderChart(data, mode) {
        const ctx = document.getElementById('mainChart');
        if (!ctx) return;
        
        if (chartInstance) chartInstance.destroy();

        // Config for Single vs Comparison
        const datasets = [];
        
        // Dataset 1: User (Always present)
        // Check if data structure differs. 
        // For '/analyze', we might send 'counts'. For '/generate-plan', we send 'userValues' & 'compValues'.
        
        const labels = data.labels || ["Internal", "External", "Images", "Social"];
        const userValues = data.counts || data.userValues || [];
        const compValues = data.compValues || [];

        datasets.push({
            label: 'You',
            data: userValues,
            backgroundColor: '#10b981', // Emerald-500
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.8
        });

        if (mode === 'full' && compValues.length > 0) {
            datasets.push({
                label: 'Competitor',
                data: compValues,
                backgroundColor: '#f59e0b', // Amber-500
                borderRadius: 4,
                barPercentage: 0.6,
                categoryPercentage: 0.8
            });
        }

        // Update Legend HTML
        let legendHtml = `<div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-emerald-500"></div><span class="text-zinc-400 text-xs">You</span></div>`;
        if (mode === 'full') {
            legendHtml += `<div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-amber-500"></div><span class="text-zinc-400 text-xs">Competitor</span></div>`;
        }
        chartLegend.innerHTML = legendHtml;

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1000, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(24, 24, 27, 0.9)',
                        titleColor: '#f4f4f5',
                        bodyColor: '#a1a1aa',
                        borderColor: '#3f3f46',
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#27272a' },
                        ticks: { color: '#71717a', font: { size: 10, family: 'Inter' } },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#71717a', font: { size: 10, family: 'Inter' } },
                        border: { display: false }
                    }
                }
            }
        });
    }

    function renderMetrics(data, mode) {
        // Extract meta data safely
        const userMeta = mode === 'full' ? data.userAnalysis.meta : data.meta;
        const compMeta = mode === 'full' ? data.competitorAnalysis.meta : null;

        const createCard = (title, meta, color) => `
            <div class="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
                <h4 class="text-[10px] font-bold ${color} uppercase tracking-wider mb-2 flex items-center gap-2">
                    <i class="fas fa-circle text-[6px]"></i> ${title}
                </h4>
                <div>
                    <div class="text-xs text-zinc-500 mb-1">Page Title</div>
                    <div class="text-sm text-zinc-200 font-medium truncate" title="${meta?.title || ''}">
                        ${meta?.title || 'N/A'}
                    </div>
                </div>
            </div>
        `;

        let html = createCard('Target URL', userMeta, 'text-emerald-500');
        if (compMeta) {
            html += createCard('Competitor URL', compMeta, 'text-amber-500');
        }

        metricsGrid.innerHTML = html;
    }

    function renderAiPlan(planText, rawText) {
        currentRawPlan = rawText || "";
        
        // Parse Markdown-like structure
        // Looking for headers, lists, etc.
        const lines = planText.split('\n');
        let html = '';
        
        lines.forEach(line => {
            const t = line.trim();
            if (!t) return;

            // Headers (Rocket, Shield, Bulb)
            if (t.includes('🚀') || t.includes('🛡️') || t.includes('💡') || t.startsWith('###')) {
                const cleanTitle = t.replace(/#/g, '').trim();
                html += `
                    <div class="mt-6 first:mt-2 mb-3 pb-2 border-b border-zinc-800">
                        <h4 class="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                            ${cleanTitle}
                        </h4>
                    </div>
                `;
            } 
            // List Items
            else if (t.startsWith('- ') || t.startsWith('* ') || t.match(/^\d+\./)) {
                // Highlight bold text **text**
                const content = t.replace(/^[-*]\s|^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<span class="text-emerald-400 font-medium">$1</span>');
                html += `
                    <div class="flex gap-3 mb-3 pl-1 group">
                        <div class="min-w-[4px] h-[4px] mt-2 rounded-full bg-zinc-700 group-hover:bg-emerald-500 transition-colors"></div>
                        <p class="text-xs leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">${content}</p>
                    </div>
                `;
            }
            // Fallback Paragraph
            else {
                 html += `<p class="text-xs text-zinc-500 mb-2">${t}</p>`;
            }
        });

        aiPlanContent.innerHTML = html;
    }

    // --- Copy Logic ---
    copyPlanBtn.addEventListener('click', () => {
        if (!currentRawPlan) return;
        navigator.clipboard.writeText(currentRawPlan).then(() => {
            const original = copyPlanBtn.innerHTML;
            copyPlanBtn.innerHTML = `<i class="fas fa-check text-emerald-500"></i> <span class="text-emerald-500">Copied</span>`;
            setTimeout(() => {
                copyPlanBtn.innerHTML = original;
            }, 2000);
        });
    });

});
