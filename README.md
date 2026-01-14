# Link Scope - Premium SEO Analytics Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Vercel Deployed](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com/)

## 🚀 Executive Overview

Link Scope is a cutting-edge SEO analytics platform that combines advanced web scraping capabilities with AI-powered strategic insights. Built with an "Executive Lounge" design philosophy, it delivers premium analytics in an elegant, intuitive interface.

## ✨ Key Features

### 🎨 Executive Lounge Design
- **Premium Dark Theme**: Sophisticated zinc-based color palette with glassmorphism effects
- **Responsive Layout**: Mobile-first design with lg:grid-cols-2 desktop optimization
- **Smooth Animations**: Shimmering skeleton loaders and polished transitions
- **Typography Excellence**: Inter font family with precise tracking controls

### 🤖 AI-Powered Analytics
- **Llama 3.1 Integration**: Advanced AI model for strategic SEO recommendations
- **Real-time Comparison**: Side-by-side analysis of your site vs competitors
- **Automated Insights**: Generated strategic roadmaps with actionable recommendations
- **Confidence Scoring**: Quality metrics for all AI-generated suggestions

### 📊 Comprehensive Analytics
- **Traffic Distribution**: Visual comparison of internal vs external links
- **Image Analysis**: Alt text and optimization recommendations
- **Link Profiling**: Detailed categorization of all link types
- **At-a-Glance Summary**: Key metrics dashboard for quick insights

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN) with custom glassmorphism effects
- **Charts**: Chart.js for dynamic visualizations
- **Icons**: Font Awesome Pro
- **Backend**: Node.js + Express.js
- **AI Integration**: Hugging Face Inference API (Llama 3.1)
- **Deployment**: Vercel Serverless Functions

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd link-scope
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
HF_TOKEN=your_hugging_face_token_here
```

5. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📋 API Endpoints

- `POST /analyze` - Single site analysis
- `POST /generate-plan` - Competitive analysis with AI recommendations
- `GET /` - Dashboard UI

## 🎯 Workflow

1. **Immediate Data**: Enter a URL to see instant traffic distribution metrics
2. **Competitive Analysis**: Add competitor URL for side-by-side comparison
3. **AI Strategy**: Click "Generate AI Plan" for strategic recommendations
4. **Export Insights**: Copy strategic roadmaps with one-click functionality

## 🏗️ Architecture

### Frontend Structure
```
public/
├── index.html          # Executive Lounge UI
├── script.js          # Client-side logic
└── style.css          # Custom styles (if any)
```

### Backend Structure
```
src/
├── controllers/       # Request handlers
├── routes/           # API route definitions  
├── services/         # Business logic
└── utils/            # Helper functions
```

## 🔐 Security

- Environment variables securely stored in `.env`
- CORS configured for production domains only
- Input validation on all endpoints
- Sanitized output to prevent XSS

## 🚀 Deployment

This project is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Vercel Configuration
The `vercel.json` file is pre-configured for Express.js serverless functions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

<p align="center">
  <em>Built with ❤️ for premium SEO analytics</em>
</p>