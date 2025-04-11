# @eremois/core

Core business logic package for the Eremois time management system.

## Overview

This package contains the fundamental business logic and services that power Eremois's time management capabilities. It implements the core functionality for timeline management, task handling, and user pattern analysis.

## Structure

```
src/
├── timeline/           # Timeline management and scheduling
├── tasks/             # Task management and organization
├── patterns/          # User pattern analysis
├── sync/              # P2P synchronization logic
└── types/             # Core type definitions
```

## Features

- **Timeline Management**: Handles creation, modification, and optimization of user timelines
- **Task Management**: Manages task creation, updates, and lifecycle
- **Pattern Analysis**: Analyzes user behavior and preferences
- **P2P Sync**: Implements secure peer-to-peer synchronization

## Installation

```bash
npm install @eremois/core
```

## Usage

```typescript
import { TimelineManager, TaskManager } from '@eremois/core';

// Initialize managers
const timelineManager = new TimelineManager();
const taskManager = new TaskManager();

// Create and manage tasks
const task = await taskManager.createTask({
  title: 'Complete project',
  duration: 120, // minutes
  priority: 'high'
});

// Add task to timeline
await timelineManager.scheduleTask(task);
```

## Development Status

🚧 **Current Status**: Early Development

- Timeline Management: In Progress
- Task Management: In Progress
- Pattern Analysis: Planned
- P2P Sync: Planned

## Contributing

Please read our [Contributing Guide](../../CONTRIBUTING.md) before submitting any changes.

## License

MIT 