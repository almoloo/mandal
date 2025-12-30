# 🛡️ Mandal

**AI-Powered Security Analysis for Mantle Blockchain**

> ⚠️ **Development Status**: This project is currently in active development and not yet production-ready. Features and APIs may change.

Mandal is a Chrome extension that provides real-time security analysis for smart contracts and dApps on the Mantle blockchain. Using advanced AI analysis powered by OpenAI GPT-4o, Mandal helps users identify potential risks, vulnerabilities, and security concerns before interacting with contracts.

---

## 📋 Table of Contents

-   [Features](#-features)
-   [Architecture](#-architecture)
-   [Installation](#-installation)
    -   [For Users](#for-users)
    -   [For Developers](#for-developers)
-   [How It Works](#-how-it-works)
-   [Usage](#-usage)
-   [API Documentation](#-api-documentation)
-   [Tech Stack](#-tech-stack)
-   [Project Structure](#-project-structure)
-   [Development](#-development)
-   [Deployment](#-deployment)
-   [Contributing](#-contributing)
-   [License](#-license)

---

## ✨ Features

### 🔍 **AI-Powered Contract Analysis**

-   **Automated Security Scanning**: Analyzes smart contract source code for common vulnerabilities and attack vectors
-   **Risk Level Assessment**: Categorizes contracts as Low, Medium, High, or Critical risk
-   **Natural Language Summaries**: Get clear, actionable security insights in plain English
-   **Vulnerability Detection**: Identifies reentrancy, overflow, access control issues, and more

### 🌐 **DApp Metadata Intelligence**

-   **Domain Age Verification**: Checks how long a website has been registered using WHOIS data
-   **Metadata Extraction**: Automatically scrapes titles, descriptions, and other identifying information
-   **Trust Indicators**: Combines on-chain and off-chain data for comprehensive trust assessment

### 📊 **Real-Time Monitoring**

-   **Automatic Detection**: Activates when you visit Mantle explorer pages (mantlescan.xyz)
-   **Live Updates**: Fresh security analysis for recently deployed contracts
-   **Network Support**: Works on both Mantle Mainnet (Chain ID: 5000) and Sepolia Testnet (Chain ID: 5003)

### 👥 **Community Reports**

-   **User-Generated Warnings**: Submit reports about suspicious contracts or scams
-   **Crowdsourced Intelligence**: View warnings from other community members
-   **Multiple Report Types**: Report scams, phishing, honeypots, rug pulls, and security vulnerabilities

### 📈 **Contract Information**

-   **Verification Status**: See if contract source code is verified on the explorer
-   **Creator Details**: View contract deployer address and creation timestamp
-   **Balance Tracking**: Monitor contract ETH holdings in real-time
-   **Source Code Access**: Browse verified contract code directly in the extension

---

## 🏗️ Architecture

Mandal consists of two main components:

### **Backend API** (`/backend`)

-   **Framework**: Hono.js (lightweight, fast Node.js framework)
-   **Database**: PostgreSQL with Prisma ORM v7
-   **AI Engine**: OpenAI GPT-4o for contract analysis
-   **External APIs**:
    -   Mantle Explorer API (Etherscan-compatible)
    -   IP2Location WHOIS API for domain verification
    -   Cheerio for web scraping

### **Chrome Extension** (`/extension`)

-   **Framework**: React 19 with TypeScript
-   **Build Tool**: Vite 7
-   **State Management**: TanStack Query v5 for data fetching and caching
-   **Styling**: Tailwind CSS v4 with custom design system
-   **Chrome APIs**: Service Workers, Tabs API, Storage API, Identity API, Action API

### **Data Flow**

```
┌─────────────────┐
│  User Browses   │
│ Mantle Explorer │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Service Worker  │◄─── Detects explorer URLs
│  (Background)   │      Updates extension icon
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Popup Window   │◄─── React App loads
│   (Extension)   │      (when icon clicked)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │◄─── Fetches contract data
│   (Hono.js)     │      Requests AI analysis
└────────┬────────┘
         │
         ├──────────────┬──────────────┬─────────────┐
         ▼              ▼              ▼             ▼
    ┌────────┐    ┌──────────┐   ┌────────┐   ┌─────────┐
    │ OpenAI │    │ Explorer │   │ WHOIS  │   │ Web     │
    │ GPT-4o │    │   API    │   │  API   │   │ Scraper │
    └────────┘    └──────────┘   └────────┘   └─────────┘
         │              │              │             │
         └──────────────┴──────────────┴─────────────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  PostgreSQL │
                 │  Database   │
                 └─────────────┘
```

---

## 🚀 Installation

> **Note**: This extension is not yet available on the Chrome Web Store. Follow the developer setup instructions below.

### For Developers

#### Prerequisites

-   Node.js v22.17.0 or higher
-   PostgreSQL database
-   OpenAI API key
-   IP2Location WHOIS API key (optional, for domain age verification)

#### Backend Setup

```bash
# Clone the repository
git clone https://github.com/almoloo/mandal.git
cd mandal/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` file with your credentials:

```env
# Required: PostgreSQL database connection
DATABASE_URL="postgresql://user:password@localhost:5432/mandal"

# Required: OpenAI API key for contract analysis
OPENAI_API_KEY="sk-proj-..."

# Optional: IP2Location WHOIS API key for domain age verification
WHOIS_API_KEY="your-whois-key"

# Optional: Chrome extension ID for CORS (leave empty for development)
EXTENSION_ID=""
```

Continue setup:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start development server (runs on http://localhost:3000)
npm run dev
```

**Verify backend is running:**

```bash
curl http://localhost:3000
# Should return: "Hello Hono!"
```

#### Extension Setup

```bash
# Navigate to extension directory (from project root)
cd extension

# Install dependencies
npm install

# Configure API URL for local development
# Edit src/lib/constants.ts and change:
export const API_BASE_URL = 'http://localhost:3000';  // For local backend
# Or keep: export const API_BASE_URL = 'https://mandal.almoloo.com';  // For production backend

# Build the extension
npm run build
```

**Load extension in Chrome:**

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** toggle (top right corner)
3. Click **"Load unpacked"** button
4. Navigate to and select the `mandal/extension/dist` folder
5. The Mandal extension should now appear in your extensions list

**Test the extension:**

1. Visit a contract page on Mantle explorer:
    - Mainnet: `https://mantlescan.xyz/address/0x...`
    - Testnet: `https://sepolia.mantlescan.xyz/address/0x...`
2. Click the Mandal extension icon in your toolbar
3. The extension should load and display contract analysis

**Troubleshooting:**

-   If the extension doesn't appear, check the Chrome console for errors
-   Make sure the backend is running on `http://localhost:3000`
-   Check that `API_BASE_URL` in `constants.ts` matches your backend URL
-   Verify CORS is configured correctly in the backend

---

## 🔧 How It Works

### 1. **Tab Detection**

The service worker monitors your browsing activity and detects when you navigate to a Mantle blockchain explorer page:

```typescript
// Supported URLs
https://mantlescan.xyz/address/0x...     // Mainnet contracts
https://sepolia.mantlescan.xyz/address/0x...  // Testnet contracts
```

### 2. **Contract Data Extraction**

When a contract page is detected:

-   Extension extracts the contract address from the URL
-   Sends request to backend API with contract address and chain ID

### 3. **Backend Processing**

#### First Time Analysis

If the contract hasn't been analyzed before:

1. **Fetch Contract Data** from Mantle Explorer API:

    - Source code (if verified)
    - Creator address and creation timestamp
    - Current balance
    - Contract ABI

2. **AI Security Analysis** via OpenAI GPT-4o:

    - Analyzes source code for vulnerabilities
    - Checks for common attack patterns (reentrancy, overflow, etc.)
    - Evaluates access control mechanisms
    - Generates risk level and summary

3. **Store Results** in PostgreSQL database for future requests

#### Subsequent Requests

If the contract was analyzed before:

-   Retrieves cached analysis from database (3-day cache)
-   Instantly returns results to extension

### 4. **Display Results**

The extension displays:

-   **Overview Tab**: Contract name, risk level, verification status, creation date, balance
-   **Analysis Tab**: Detailed AI-generated security analysis
-   **Code Tab**: Source code viewer (for verified contracts)
-   **Reports Tab**: User-submitted warnings and reports

### 5. **Caching Strategy**

-   **Frontend**: React Query caches results for 3 days (configurable)
-   **Backend**: Database stores all analyses permanently
-   **Smart Refresh**: Users can manually refetch for updated analysis

---

## 📖 Usage

### Basic Workflow

1. **Navigate to a Contract**

    ```
    Visit: https://mantlescan.xyz/address/0x1234567890abcdef...
    ```

2. **View Security Analysis**

    - Extension icon becomes active
    - Click the extension icon or wait for automatic popup
    - Review the risk level indicator (color-coded)
    - Read the AI-generated security summary

3. **Explore Details**

    - Switch to "Analysis" tab for detailed vulnerability breakdown
    - Check "Code" tab to review source code
    - Visit "Reports" tab to see community warnings

4. **Submit a Report** (Optional)
    - If you discover issues, click "Submit Report"
    - Fill in report details:
        - **Title**: Brief description
        - **Report Type**: Scam, Phishing, Honeypot, Security, etc.
        - **Severity**: Low, Medium, High, Critical
        - **Description**: Detailed explanation
    - Submit to warn other users

### Understanding Risk Levels

| Risk Level   | Color     | Meaning                                                      |
| ------------ | --------- | ------------------------------------------------------------ |
| **Low**      | 🟢 Green  | Contract appears safe with standard patterns                 |
| **Medium**   | 🟡 Yellow | Some concerns detected, proceed with caution                 |
| **High**     | 🟠 Orange | Significant risks found, verify carefully before interacting |
| **Critical** | 🔴 Red    | Severe vulnerabilities or malicious patterns detected, avoid |

### Interpreting Analysis Results

**Good Signs:**

-   ✅ Verified source code
-   ✅ Standard OpenZeppelin patterns
-   ✅ Clear access control
-   ✅ Older domain age (for DApps)
-   ✅ Multiple security measures

**Red Flags:**

-   🚩 Unverified contract
-   🚩 Hidden mint/burn functions
-   🚩 Unusual transfer restrictions
-   🚩 Very new domain (< 30 days)
-   🚩 Honeypot patterns detected

---

## 📡 API Documentation

### Base URL

```
Production: https://mandal.almoloo.com
Development: http://localhost:3000
```

### Endpoints

#### **GET /contracts**

Get contract analysis by address

**Query Parameters:**

-   `address` (required): Contract address (0x...)
-   `chainId` (optional): Chain ID (5000 for mainnet, 5003 for testnet)
-   `model` (optional): AI model to use (default: gpt-4o)

**Response:**

```json
{
	"success": true,
	"data": {
		"address": "0x1234...",
		"name": "MyToken",
		"chainId": 5000,
		"verified": true,
		"createdAt": "2024-01-15T10:30:00Z",
		"creatorAddress": "0xabcd...",
		"balance": "1.5",
		"sourceCode": "pragma solidity ^0.8.0;...",
		"latestAnalysis": {
			"riskLevel": "Low",
			"summary": "This contract appears to follow standard...",
			"securityScore": 85,
			"vulnerabilities": [],
			"recommendations": ["Consider adding..."]
		},
		"userReports": []
	}
}
```

#### **GET /dapps**

Get DApp analysis with connected contracts

**Query Parameters:**

-   `url` (required): DApp website URL
-   `chainId` (optional): Chain ID
-   `contracts` (optional): Comma-separated contract addresses
-   `model` (optional): AI model to use

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://example-dapp.com",
    "title": "Example DApp",
    "description": "A DeFi protocol...",
    "domainCreatedAt": "2023-06-10T00:00:00Z",
    "connectedContracts": [...],
    "latestAnalysis": {
      "overallRisk": "Medium",
      "summary": "...",
      "contractsAnalyzed": 3
    }
  }
}
```

#### **GET /reviews**

Get user reports for contract or DApp

**Query Parameters:**

-   `contractAddress` (optional): Filter by contract
-   `dappUrl` (optional): Filter by DApp
-   `status` (optional): Filter by status (PENDING, APPROVED, REJECTED)

**Response:**

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"reportType": "SCAM",
			"severity": "High",
			"title": "Honeypot detected",
			"description": "Cannot sell tokens after purchase",
			"status": "APPROVED",
			"createdAt": "2024-12-01T14:20:00Z",
			"userAddress": "user@example.com"
		}
	]
}
```

#### **POST /reviews**

Submit a new report

**Body:**

```json
{
	"contractAddress": "0x1234...", // Required if no dappUrl
	"dappUrl": "https://...", // Required if no contractAddress
	"reportType": "SCAM", // Required
	"severity": "High", // Optional
	"title": "Issue title", // Required
	"description": "Detailed info", // Required
	"userAddress": "user@example.com" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "status": "PENDING",
    ...
  }
}
```

---

## 🛠️ Tech Stack

### Backend

-   **Runtime**: Node.js v22.17.0
-   **Framework**: [Hono.js](https://hono.dev/) v4.10.7 - Ultra-fast web framework
-   **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/) v7.0.1
-   **AI**: [OpenAI API](https://openai.com/api/) - GPT-4o model
-   **Web Scraping**: [Cheerio](https://cheerio.js.org/) - jQuery-like HTML parsing
-   **WHOIS**: IP2Location WHOIS API
-   **HTTP Client**: Native Fetch API
-   **Deployment**: Docker + Coolify

### Frontend (Chrome Extension)

-   **Framework**: [React](https://react.dev/) v19.2.1
-   **Language**: TypeScript v5.9.3
-   **Build Tool**: [Vite](https://vite.dev/) v7.2.4
-   **State Management**: [TanStack Query](https://tanstack.com/query) v5.90.12
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4.1.17
-   **UI Components**: [React Aria Components](https://react-spectrum.adobe.com/react-aria/)
-   **Icons**: [@untitledui/icons](https://www.untitledui.com/)
-   **Class Utilities**: [tailwind-merge](https://github.com/dcastil/tailwind-merge) + [clsx](https://github.com/lukeed/clsx)
-   **Chrome APIs**: chrome.tabs, chrome.storage, chrome.identity, chrome.action

### Development Tools

-   **Type Safety**: TypeScript with strict mode
-   **Code Quality**: ESLint + Prettier
-   **Package Manager**: npm
-   **Version Control**: Git
-   **API Testing**: Hono's built-in testing utilities

---

## 📁 Project Structure

```
mandal/
├── backend/                 # Backend API server
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema definition
│   │   └── migrations/      # Database migration files
│   ├── src/
│   │   ├── index.ts        # Server entry point & CORS config
│   │   ├── lib/
│   │   │   ├── db.ts       # Prisma client instance
│   │   │   ├── explorer.ts # Mantle Explorer API client
│   │   │   └── types.ts    # Shared TypeScript types
│   │   ├── routes/
│   │   │   ├── contracts.ts # Contract analysis endpoints
│   │   │   ├── dapps.ts    # DApp analysis endpoints
│   │   │   └── reviews.ts  # User reports endpoints
│   │   └── services/
│   │       ├── ai-analysis.service.ts     # OpenAI integration
│   │       ├── dapp-analysis.service.ts   # DApp-specific analysis
│   │       └── metadata.service.ts        # Web scraping & WHOIS
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                # Environment variables
│
├── extension/              # Chrome extension
│   ├── public/
│   │   ├── manifest.json   # Extension manifest v3
│   │   └── icons/          # Extension icons
│   ├── src/
│   │   ├── main.tsx        # React entry point
│   │   ├── app.tsx         # Main app component
│   │   ├── index.css       # Tailwind imports & global styles
│   │   ├── theme.css       # Design system tokens
│   │   ├── service-worker.ts # Background script
│   │   ├── components/
│   │   │   ├── header.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── overview-box.tsx
│   │   │   ├── analysis-tab.tsx
│   │   │   ├── code-tab.tsx
│   │   │   ├── reports-tab.tsx
│   │   │   ├── reports/
│   │   │   │   ├── report-form.tsx
│   │   │   │   └── report-item.tsx
│   │   │   └── ui/          # Reusable UI components
│   │   ├── hooks/
│   │   │   ├── use-current-tab.ts
│   │   │   ├── use-breakpoint.ts
│   │   │   └── use-theme.ts
│   │   ├── lib/
│   │   │   ├── constants.ts # API URLs, configs
│   │   │   ├── types.ts     # TypeScript interfaces
│   │   │   ├── utils.ts     # Helper functions
│   │   │   └── user.ts      # User identification
│   │   ├── providers/
│   │   │   └── theme-provider.tsx
│   │   ├── routes/
│   │   │   └── explorer.tsx # Main extension view
│   │   └── utils/
│   │       └── cx.ts        # Class name utilities
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
└── README.md               # This file
```

---

## 💻 Development

### Backend Development

```bash
cd backend

# Start dev server with hot reload
npm run dev

# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name description_of_change

# View database in Prisma Studio
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Run TypeScript compiler
npx tsc
```

### Extension Development

```bash
cd extension

# Start dev server (for testing)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Add new UI component
npx untitledui@latest add <component-name>
```

### Testing the Extension

1. Make changes to extension code
2. Run `npm run build` in the extension directory
3. Go to `chrome://extensions/`
4. Click the refresh icon on your extension card
5. Test on a Mantle explorer page

### Environment Variables

#### Backend `.env`

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mandal"

# OpenAI API
OPENAI_API_KEY="sk-..."

# Optional: WHOIS API for domain age
WHOIS_API_KEY="..."

# CORS: Your Chrome extension ID
EXTENSION_ID="abcdefghijklmnopqrstuvwxyz"
```

#### Extension (if using local backend)

Edit `extension/src/lib/constants.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:3000';
```

---

## 🚢 Deployment

### Backend Deployment (Docker)

```bash
cd backend

# Build Docker image
docker build -t mandal-backend .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e OPENAI_API_KEY="..." \
  -e WHOIS_API_KEY="..." \
  mandal-backend
```

### Coolify Deployment

The backend is configured for [Coolify](https://coolify.io/) deployment:

1. Push code to Git repository
2. Connect repository in Coolify
3. Set environment variables
4. Coolify automatically builds and deploys

**Build configuration:**

-   Build command: `npm install && npm run build`
-   Start command: `npm start`
-   Port: `3000`

### Extension Publication

1. **Build Production Version**

    ```bash
    cd extension
    npm run build
    ```

2. **Create ZIP Archive**

    ```bash
    cd dist
    zip -r mandal-extension.zip .
    ```

3. **Publish to Chrome Web Store**

    - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
    - Create new item or update existing
    - Upload `mandal-extension.zip`
    - Fill in store listing details
    - Submit for review

4. **Update Extension ID in Backend**
    - After publishing, update `EXTENSION_ID` in backend `.env`
    - Redeploy backend to enable CORS for published extension

---

## 🤝 Contributing

Contributions are welcome! This project is open source and we appreciate your help in making it better.

### Reporting Issues

-   Use GitHub Issues to report bugs
-   Include detailed reproduction steps
-   Provide browser version and OS
-   Include screenshots if applicable

### Submitting Pull Requests

1. **Fork the Repository**

    ```bash
    git clone https://github.com/almoloo/mandal.git
    cd mandal
    git checkout -b feature/your-feature-name
    ```

2. **Make Changes**

    - Follow existing code style
    - Add tests if applicable
    - Update documentation

3. **Test Thoroughly**

    - Test backend API endpoints
    - Test extension in Chrome
    - Verify on both mainnet and testnet

4. **Commit with Clear Messages**

    ```bash
    git commit -m "feat: add vulnerability detection for X"
    ```

5. **Push and Create PR**
    ```bash
    git push origin feature/your-feature-name
    ```
    Then open a Pull Request on GitHub

### Development Guidelines

-   **Code Style**: Follow existing TypeScript/React patterns
-   **Commits**: Use conventional commits (feat, fix, docs, refactor, etc.)
-   **Testing**: Ensure changes don't break existing functionality
-   **Documentation**: Update README and code comments as needed

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Ali Mousavi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

-   **Mantle Network** - For providing a fast, secure L2 blockchain
-   **OpenAI** - For GPT-4o model powering security analysis
-   **IP2Location** - For WHOIS API service
-   **Chrome Extension Community** - For excellent documentation and resources
-   **Open Source Community** - For the amazing tools and libraries used in this project

---

## 📞 Support

-   **Email**: amousavig@icloud.com

---

## 🗺️ Roadmap

### Current Version (v1.0.0)

-   ✅ Basic contract security analysis
-   ✅ Risk level assessment
-   ✅ User reports system
-   ✅ Mantle mainnet and testnet support

### Planned Features

-   [ ] Multi-chain support (Ethereum, BSC, Polygon)
-   [ ] Historical analysis tracking
-   [ ] Browser notification system
-   [ ] Automated vulnerability scanning on new deployments
-   [ ] Integration with additional security databases
-   [ ] Community reputation system
-   [ ] Export analysis reports (PDF/JSON)
-   [ ] Advanced code visualization
-   [ ] Transaction simulation and analysis
-   [ ] Smart contract upgrade detection

---

## 📊 Statistics

![GitHub stars](https://img.shields.io/github/stars/almoloo/mandal?style=social)
![GitHub forks](https://img.shields.io/github/forks/almoloo/mandal?style=social)
![GitHub issues](https://img.shields.io/github/issues/almoloo/mandal)
![GitHub license](https://img.shields.io/github/license/almoloo/mandal)

---

<div align="center">

**Made with ❤️ for the Mantle Community**

[⬆ Back to Top](#-mandal)

</div>
