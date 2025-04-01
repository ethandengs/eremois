# Getting Started with erēmois Development

This guide will help you set up your development environment and start contributing to erēmois.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm (v9 or later)
- Docker Desktop
- Git
- MongoDB (local instance or Atlas account)
- Visual Studio Code (recommended)

## Initial Setup

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/eremois.git
cd eremois
```

2. **Install Dependencies**

```bash
npm install
```

3. **Set Up Environment Variables**

Create a `.env` file in the root directory:

```env
# Development Environment
NODE_ENV=development

# API Configuration
API_PORT=4000
API_URL=http://localhost:4000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/eremois
MONGODB_TEST_URI=mongodb://localhost:27017/eremois_test

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# AI Service Configuration
AI_SERVICE_URL=http://localhost:5000
MODEL_PATH=./models/latest
```

4. **Start Development Services**

```bash
# Start MongoDB (if running locally)
mongod

# Start Redis (if running locally)
redis-server

# Start development servers
npm run dev
```

## Project Structure

```
eremois/
├── apps/
│   ├── web/          # Frontend application
│   └── api/          # Backend API
├── packages/
│   ├── ui/           # Shared UI components
│   ├── core/         # Core business logic
│   └── ai/           # AI processing modules
├── docs/             # Documentation
├── tools/            # Development tools
└── config/           # Configuration files
```

## Development Workflow

1. **Create a New Feature Branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Run Tests**

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- packages/core

# Run tests in watch mode
npm test -- --watch
```

3. **Start Development Servers**

```bash
# Start frontend development server
npm run dev:web

# Start backend development server
npm run dev:api

# Start all services
npm run dev
```

4. **Code Quality**

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checks
npm run type-check

# Format code
npm run format
```

## Available Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all packages and applications
- `npm run test` - Run all tests
- `npm run lint` - Check code quality
- `npm run format` - Format code using Prettier
- `npm run docs` - Generate documentation
- `npm run clean` - Clean build artifacts

## Development Guidelines

### Code Style

We follow a strict code style guide:

1. **TypeScript**
   - Use strict type checking
   - Avoid `any` types
   - Document complex types

2. **React**
   - Use functional components
   - Implement proper error boundaries
   - Follow React hooks best practices

3. **Testing**
   - Write unit tests for utilities
   - Write integration tests for components
   - Maintain good test coverage

### Git Workflow

1. **Commits**
   - Use conventional commits
   - Keep commits focused
   - Write meaningful messages

2. **Pull Requests**
   - Create descriptive titles
   - Fill out the PR template
   - Request appropriate reviewers

### Documentation

1. **Code Documentation**
   - Document complex functions
   - Add JSDoc comments
   - Keep README files updated

2. **Architecture Documentation**
   - Document design decisions
   - Update API documentation
   - Maintain changelog

## Debugging

### Frontend Debugging

1. **Browser DevTools**
   - React Developer Tools
   - Redux DevTools (if used)
   - Network tab for API calls

2. **VS Code**
   - Chrome Debugger
   - React Native Tools
   - ESLint

### Backend Debugging

1. **API Testing**
   - Use Postman/Insomnia
   - Check logs in terminal
   - Monitor MongoDB queries

2. **VS Code**
   - Node.js Debugger
   - MongoDB extension
   - Thunder Client

## Common Issues

1. **Port Conflicts**
   ```bash
   # Check ports in use
   lsof -i :3000
   lsof -i :4000
   
   # Kill process using port
   kill -9 <PID>
   ```

2. **Database Connection**
   ```bash
   # Check MongoDB status
   mongosh
   
   # Verify connection string
   echo $MONGODB_URI
   ```

3. **Node Modules**
   ```bash
   # Clear node_modules
   rm -rf node_modules
   rm -rf apps/*/node_modules
   rm -rf packages/*/node_modules
   
   # Reinstall dependencies
   npm install
   ```

## Getting Help

1. **Documentation**
   - Check the [official docs](https://docs.eremois.dev)
   - Review architecture guides
   - Search existing issues

2. **Community**
   - Join our Discord server
   - Ask in GitHub discussions
   - Check Stack Overflow tags

3. **Support**
   - Open GitHub issues
   - Email support@eremois.dev
   - Contact team leads 