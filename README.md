# 🇮🇳 NayaNiti - Know Your Neta

> Empowering Indian Democracy Through Transparent Political Information

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-orange?style=for-the-badge)](https://groq.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

**NayaNiti** is a comprehensive civic engagement platform designed to bring transparency and accountability to Indian politics. It provides citizens with verified, non-partisan information about their political representatives, government bills, local development projects, and political claims.

### Mission

To create an informed electorate by democratizing access to political data and making complex governance information accessible to every Indian citizen.

### Vision

A transparent democracy where every citizen can make informed decisions based on facts, not propaganda.

## ✨ Features

### 🏛️ Core Features

#### 1. **Politician Profiles**
- **Comprehensive Data**: Access detailed profiles of MPs and MLAs
- **Performance Metrics**:
  - Parliamentary attendance records
  - Bills sponsored and passed
  - Voting patterns on key legislation
  - Asset declarations and criminal cases
- **Constituency Information**: Filter by location
- **Historical Voting Records**: Track consistency over time

#### 2. **AI-Powered Fact Checker**
- **Real-time Verification**: Verify political claims instantly
- **Source Analysis**: AI analyzes credibility of sources
- **Confidence Scoring**: Get transparency scores (0-100%)
- **Evidence-Based**: All verdicts backed by verifiable sources
- **Categories**:
  - ✅ True
  - ⚠️ Partially True
  - ❌ False
  - ❓ Unverifiable

#### 3. **Bill Tracker**
- **Live Parliamentary Updates**: Track bills in real-time
- **Impact Analysis**: Understand how bills affect you
- **Simplified Explanations**: Complex legislation made simple
- **Voting Patterns**: See how representatives voted
- **Status Tracking**:
  - 📝 Introduced
  - 🔄 Under Review
  - ✅ Passed
  - ❌ Rejected

#### 4. **AI Political Assistant (NayaNiti AI)**
- **Powered by Groq (Llama 3.3 70B)**: Lightning-fast responses
- **Contextual Understanding**: Ask anything about Indian politics
- **Features**:
  - Constitutional queries
  - Political party ideologies
  - Governance explanations
  - Electoral process guidance
  - Rights and responsibilities
  - RTI and petition guidance
- **Unbiased**: Presents multiple viewpoints
- **Educational**: Explains complex topics simply

#### 5. **Personalized Dashboard**
- **Location-Based**: Tailored to your constituency
- **Real-time Updates**: Get notified of local developments
- **Project Tracking**: Monitor infrastructure projects
- **Performance Analytics**: Data-driven insights
- **Quick Actions**: One-click access to key features

#### 6. **Transparency Index**
- **Unique Scoring System**: Measures accountability
- **Metrics**:
  - Financial transparency
  - Public disclosure
  - Responsiveness
  - Attendance and participation
- **Comparative Analysis**: Compare representatives

### 🎯 Additional Features

- **Responsive Design**: Works seamlessly on all devices
- **Dark Mode Ready**: (Coming Soon)
- **Multi-language Support**: (Coming Soon - Hindi, Tamil, Telugu, Bengali)
- **Offline Mode**: (Coming Soon)
- **Push Notifications**: Stay updated on important developments

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **UI Components**: 
  - Radix UI (Accessible components)
  - Shadcn/ui (Beautiful components)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend & AI
- **API Routes**: Next.js API Routes
- **AI Model**: Groq API (Llama 3.3 70B Versatile)
- **Authentication**: NextAuth.js (Optional)
- **Data Fetching**: Native Fetch API
- **Caching**: React Server Components

### Development Tools
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm/yarn/pnpm
- Groq API Key ([Get one here](https://console.groq.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nayakniti.git
cd nayakniti
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
# Create .env.local file in root directory
cp .env.example .env.local
```

Add your Groq API key:
```env
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
nayakniti/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── chat/                 # AI Chat endpoint
│   │   │   └── route.ts
│   │   ├── fact-check/           # Fact checking endpoint
│   │   │   └── route.ts
│   │   └── test-groq/            # API testing endpoint
│   │       └── route.ts
│   ├── auth/                     # Authentication pages
│   │   ├── signin/
│   │   └── signup/
│   ├── chat/                     # AI Assistant page
│   │   └── page.tsx
│   ├── dashboard/                # User Dashboard
│   │   └── page.tsx
│   ├── fact-checker/             # Fact Checker page
│   │   └── page.tsx
│   ├── bills/                    # Bill Tracker page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # React Components
│   ├── ui/                       # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── ChatBot.tsx               # Floating chatbot widget
│   ├── Navbar.tsx                # Main navigation (with auth)
│   └── NavbarSimple.tsx          # Navigation (without auth)
├── lib/                          # Utility functions
│   ├── groqService.ts            # Groq API integration
│   └── utils.ts                  # Helper functions
├── public/                       # Static assets
│   ├── images/
│   └── icons/
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Example env file
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🔌 API Integration

### Groq AI Service

**File**: `lib/groqService.ts`

```typescript
// Get chat response
const response = await getChatResponse([
  { role: 'user', content: 'What is Article 370?' }
]);

// Stream response
await getStreamingChatResponse(
  messages,
  (chunk) => console.log(chunk),
  () => console.log('Complete')
);
```

### API Endpoints

#### 1. Chat API
- **Endpoint**: `/api/chat`
- **Method**: POST
- **Body**:
```json
{
  "messages": [
    { "role": "user", "content": "Your question" }
  ]
}
```
- **Response**:
```json
{
  "message": "AI response",
  "timestamp": "2024-11-01T12:00:00Z"
}
```

#### 2. Fact Check API
- **Endpoint**: `/api/fact-check`
- **Method**: POST
- **Body**:
```json
{
  "claim": "Political claim to verify"
}
```
- **Response**:
```json
{
  "verdict": "True",
  "confidence": 85,
  "explanation": "Detailed analysis",
  "sources": ["source1", "source2"]
}
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional (if using authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here

# Optional (if using database)
DATABASE_URL=your_database_connection_string

# Optional (for analytics)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### Getting API Keys

1. **Groq API Key**:
   - Visit [console.groq.com](https://console.groq.com/)
   - Sign up/Login
   - Navigate to API Keys section
   - Create new API key
   - Copy and paste in `.env.local`

## 📖 Usage Guide

### For Citizens

1. **Get Started**:
   - Visit the homepage
   - Enter your constituency or city
   - Explore your personalized dashboard

2. **Check Facts**:
   - Go to Fact Checker
   - Enter a political claim
   - Get instant AI-powered verification

3. **Ask Questions**:
   - Click the chatbot icon (bottom right)
   - Ask anything about Indian politics
   - Get unbiased, educational responses

4. **Track Your Representative**:
   - Dashboard shows your MP/MLA
   - View attendance, bills, assets
   - Monitor performance metrics

### For Developers

1. **Adding New Features**:
```typescript
// Create new page in app/
app/new-feature/page.tsx

// Add API route if needed
app/api/new-feature/route.ts

// Create components
components/NewFeature.tsx
```

2. **Styling Guidelines**:
- Use Tailwind utility classes
- Follow existing color scheme:
  - Primary: `#FF9800` (Orange)
  - Secondary: `#00BCD4` (Cyan)
  - Success: `#4CAF50` (Green)
  - Danger: `#F44336` (Red)

3. **Adding to Navbar**:
```typescript
// In components/NavbarSimple.tsx
const navLinks = [
  { href: '/your-route', label: 'Your Feature', icon: YourIcon }
];
```

## 📸 Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)
*Clean, modern homepage with search functionality*

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Personalized political insights for your constituency*

### Fact Checker
![Fact Checker](docs/screenshots/fact-checker.png)
*AI-powered claim verification with sources*

### AI Assistant
![Chat](docs/screenshots/chat.png)
*Intelligent chatbot for political queries*

## 🎨 Design Philosophy

### Color Palette
- **Primary Orange** (`#FF9800`): Energy, transparency, democracy
- **Cyan** (`#00BCD4`): Trust, clarity, information
- **Green** (`#4CAF50`): Truth, growth, progress
- **Purple** (`#9C27B0`): Innovation, AI, intelligence

### Typography
- **Headings**: Bold, clear, hierarchical
- **Body**: Readable, accessible, professional

### UX Principles
- **Simplicity**: Complex data, simple interface
- **Accessibility**: Designed for all users
- **Speed**: Fast load times, instant responses
- **Trust**: Transparent, source-backed information

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**: Open an issue with details
2. **Suggest Features**: Share your ideas
3. **Improve Documentation**: Fix typos, add examples
4. **Submit Code**: Create pull requests

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Make your changes**
4. **Commit with clear messages**
```bash
git commit -m "Add: Amazing new feature"
```
5. **Push to your fork**
```bash
git push origin feature/amazing-feature
```
6. **Open a Pull Request**

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update tests if applicable

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core features (Dashboard, Fact Checker, AI Chat)
- ✅ Responsive design
- ✅ Groq AI integration

### Phase 2 (Next 3 months)
- 🔄 Real politician data integration
- 🔄 User authentication system
- 🔄 Bill tracker with real-time updates
- 🔄 Mobile app (React Native)

### Phase 3 (Next 6 months)
- 📋 Multi-language support
- 📋 Advanced analytics dashboard
- 📋 Community features (discussions, polls)
- 📋 API for third-party developers

### Phase 4 (Future)
- 📋 Blockchain-based voting records
- 📋 AR/VR civic education
- 📋 WhatsApp/Telegram bots
- 📋 Voice assistant integration


## 👥 Team

**Suyash Padole**
**Srushti Khandelwal**

## 🙏 Acknowledgments

- **Groq**: For providing blazing-fast AI inference
- **Vercel**: For Next.js and deployment platform
- **Shadcn/ui**: For beautiful, accessible components
- **Indian Democracy**: Our inspiration and purpose

## 📞 Contact

- **Website**: [nayakniti.vercel.app](https://nayakniti.vercel.app)
- **Email**: contact@nayakniti.in
- **Twitter**: [@NayaNiti](https://twitter.com/nayakniti)
- **GitHub**: [github.com/nayakniti](https://github.com/nayakniti)

## 💡 FAQ

**Q: Is this data real?**
A: Currently using mock data for demonstration. Real data integration coming soon.

**Q: How accurate is the fact checker?**
A: Powered by Groq's Llama 3.3 70B model with 85-95% accuracy. Always verify important claims independently.

**Q: Can I use this for my constituency?**
A: Yes! Enter any Indian constituency to get personalized insights.

**Q: Is my data secure?**
A: We don't collect personal data. All searches are anonymous.

**Q: How can I contribute data?**
A: Contact us at data@nayakniti.in to contribute verified political data.

---



</div>