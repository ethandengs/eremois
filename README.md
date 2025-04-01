# erēmois

A time management system that learns natural rhythms and protects privacy.

## Origins & Purpose

erēmois (from ancient Greek ἐρήμοις) refers to a quiet wilderness where people found clarity and direction. This concept shapes our approach: creating a space where individuals can understand and work with their natural patterns, free from external pressures and surveillance.

In a world where digital tools often demand trading privacy for convenience, erēmois takes a different path - one where technology adapts to people, not the other way around, and where data stays in users' hands.

## Core Principles

### Privacy as Foundation
- Data remains on user devices
- AI learns locally, adapts privately
- End-to-end encrypted sync (optional)
- Complete offline functionality
- Transparent data handling

### Thoughtful Intelligence
- Pattern recognition that respects privacy
- Adaptive scheduling based on natural rhythms
- Energy-aware task management
- Clear reasoning behind suggestions
- Customizable learning parameters

### Community-Driven Infrastructure
Choose the approach that fits your needs:

**Personal Installation**
- Runs entirely on your devices
- Zero data sharing
- Minimal resource requirements
- Available for desktop and mobile
- P2P sync between devices

**Self-Hosted Server**
- Control your own infrastructure
- Multi-device synchronization
- Family or small team sharing
- Custom integrations
- Local backup systems

**Enterprise Deployment**
- Advanced security features
- Custom authentication
- Infrastructure integration
- Comprehensive monitoring
- Scalable architecture

## Technical Implementation

### Edge AI Architecture
```typescript
interface AICore {
  // Local learning pipeline
  learn(data: UserPattern): Promise<void>;
  // Privacy-preserving predictions
  predict(context: TimeContext): Promise<Suggestion>;
  // Transparent reasoning
  explain(suggestion: Suggestion): Explanation;
}
```

### Core Features

#### Living Timeline
- Circular visualization reflecting natural rhythms
- Smart time blocks that learn patterns
- Real-time energy adaptation
- Multi-scale views (hour/day/week/month/year)
- Customizable visualizations

#### Task Management
- Events (E): Time-specific activities with flexible rules
- Tasks (T): Adaptive to-do items with custom priority
- Projects (P): Long-term goals with pattern recognition
- Energy-aware scheduling
- Personal categorization systems

#### Edge Intelligence
- TensorFlow.js for local processing
- Efficient resource usage
- Privacy-preserving learning
- Adaptive scheduling
- Pattern recognition

## Technical Stack

### Core Technologies
- TensorFlow.js / ONNX Runtime (Edge AI)
- SQLite (Local Storage)
- Tauri (Desktop)
- React Native (Mobile)
- TypeScript (Development)

### Development Tools
- ESLint
- Jest
- TypeScript
- Prettier
- Husky

## Project Structure

eremois/
├── apps/                      # Applications
│   ├── desktop/              # Desktop (Tauri)
│   ├── mobile/              # Mobile (React Native)
│   └── web/                 # Progressive Web App
├── packages/                 # Core packages
│   ├── core/                # Business logic
│   ├── ai/                  # Edge AI implementation
│   ├── storage/            # Local storage
│   └── ui/                 # Shared components
└── docs/                    # Documentation
```

## Getting Started

### Personal Use
```bash
# Desktop Installation
npm install -g @eremois/desktop

# Mobile Installation
npm install -g @eremois/mobile
```

### Self-Hosted Setup
```bash
docker run -d \
  --name eremois \
  -p 3000:3000 \
  -v eremois-data:/app/data \
  eremois/server
```

For detailed setup instructions, visit our [Getting Started Guide](docs/guide/getting-started.md).

## Development

### Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)
- Git

### Setup
```bash
git clone https://github.com/ethandeng/eremois.git
cd eremois
npm install
```

### Development Commands
```bash
npm run dev      # Start development
npm run test     # Run tests
npm run build    # Build for production
```

## Documentation

- [Technical Architecture](docs/architecture/overview.md)
- [Privacy Design](docs/guide/privacy.md)
- [API Documentation](docs/api/README.md)
- [Contribution Guidelines](CONTRIBUTING.md)

## Community

erēmois grows through community understanding and careful implementation. The project welcomes:

- Bug reports and feature discussions through issues
- Broader conversations in [discussions](https://github.com/ethandeng/eremois/discussions)
- Code contributions via pull requests
- Documentation improvements
- Use case sharing and feedback

## Support

erēmois is free software, developed by the community and released under the MIT license. To support its continued development and independence:

- [GitHub Sponsors](https://github.com/sponsors/ethandeng)
- [Open Collective](https://opencollective.com/eremois)

Contributions help maintain the project's focus on privacy, adaptability, and community benefit.