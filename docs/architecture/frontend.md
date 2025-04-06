# Frontend Architecture

The frontend of erēmois is built with Next.js and follows a modern, component-based architecture designed for performance and maintainability.

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Context + Hooks
- **Animations**: Framer Motion
- **Data Fetching**: React Query
- **AI Integration**: TensorFlow.js

## Core Components

### Timeline Visualization

The circular timeline is implemented using a hybrid approach:

```typescript
interface TimelineProps {
  events: TimelineEvent[];
  currentTime: Date;
  onEventClick: (event: TimelineEvent) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  events,
  currentTime,
  onEventClick,
}) => {
  // Implementation details...
};
```

- Canvas layer for performance
- HTML overlay for interactions
- SVG markers for precise positioning

### AI Assistant Integration

```typescript
interface AIAssistantProps {
  userPreferences: UserPreferences;
  scheduleData: ScheduleData;
  onSuggestion: (suggestion: AISuggestion) => void;
}
```

- Real-time schedule suggestions
- Learning from user interactions
- Preference adaptation

### Task Management

```typescript
type TaskType = "event" | "task" | "project";

interface Task {
  id: string;
  type: TaskType;
  title: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  priority: number;
  category: string;
}
```

## Directory Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── timeline/          # Timeline components
│   ├── tasks/            # Task management
│   └── ai/              # AI integration
├── hooks/                # Custom React hooks
├── utils/               # Utility functions
└── styles/             # Global styles
```

## Performance Optimizations

1. **Virtualization**

   - Virtual scrolling for long lists
   - Lazy loading of distant time periods

2. **Caching**

   - React Query for API data
   - Memoization of expensive calculations

3. **Code Splitting**
   - Dynamic imports for heavy components
   - Route-based code splitting

## State Management

```typescript
interface TimelineState {
  events: TimelineEvent[];
  view: "hour" | "day" | "week" | "month" | "year";
  selectedDate: Date;
}

interface TaskState {
  tasks: Task[];
  drafts: Task[];
  filters: TaskFilter[];
}

interface AIState {
  preferences: UserPreferences;
  suggestions: AISuggestion[];
  learningMode: "active" | "passive";
}
```

## Accessibility

- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader optimizations
- High contrast mode support

## Testing Strategy

1. **Unit Tests**

   - Component testing with React Testing Library
   - Hook testing
   - Utility function testing

2. **Integration Tests**

   - User flow testing
   - API integration testing
   - State management testing

3. **E2E Tests**
   - Critical path testing with Cypress
   - Cross-browser testing
