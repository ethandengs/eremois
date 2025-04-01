# Contributing to erēmois

Thank you for your interest in contributing to erēmois! This guide will help you understand our development process and how you can contribute effectively.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### 1. Finding Issues to Work On

- Check our [issue tracker](https://github.com/ethandengs/eremois/issues)
- Look for issues tagged with `good first issue` or `help wanted`
- Join discussions in our community channels

### 2. Development Process

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub
   git clone https://github.com/your-username/eremois.git
   cd eremois
   git remote add upstream https://github.com/original/eremois.git
   ```

2. **Create a Branch**
   ```bash
   # For features
   git checkout -b feature/your-feature-name

   # For bug fixes
   git checkout -b fix/issue-description

   # For documentation
   git checkout -b docs/topic-name
   ```

3. **Make Changes**
   - Follow our coding standards
   - Write meaningful commit messages
   - Add tests for new features
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   # Run all tests
   npm test

   # Run linter
   npm run lint

   # Check types
   npm run type-check
   ```

5. **Submit a Pull Request**
   - Fill out the PR template completely
   - Link related issues
   - Add screenshots if relevant
   - Request review from maintainers

### 3. Coding Standards

#### TypeScript

```typescript
// Use explicit types
interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

// Use meaningful names
const fetchUserData = async (userId: string): Promise<User> => {
  // ...
};

// Document complex functions
/**
 * Analyzes user activity patterns and generates schedule suggestions
 * @param userId - The unique identifier of the user
 * @param timeRange - The time range to analyze
 * @returns A list of schedule suggestions
 */
const analyzeUserPatterns = async (
  userId: string,
  timeRange: TimeRange
): Promise<ScheduleSuggestion[]> => {
  // ...
};
```

#### React Components

```typescript
// Use functional components
const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskSelect }) => {
  // Use hooks at the top
  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);
  
  // Use meaningful effect dependencies
  useEffect(() => {
    setSortedTasks(sortTasks(tasks));
  }, [tasks]);

  return (
    <div>
      {sortedTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onSelect={onTaskSelect}
        />
      ))}
    </div>
  );
};
```

### 4. Testing Guidelines

#### Unit Tests

```typescript
describe('TaskManager', () => {
  it('should create a new task', () => {
    const task = createTask({
      title: 'Test Task',
      priority: 1
    });
    
    expect(task).toHaveProperty('id');
    expect(task.title).toBe('Test Task');
  });

  it('should handle task prioritization', () => {
    const tasks = [
      createTask({ priority: 2 }),
      createTask({ priority: 1 }),
      createTask({ priority: 3 })
    ];
    
    const sorted = sortTasks(tasks);
    expect(sorted[0].priority).toBe(1);
  });
});
```

#### Integration Tests

```typescript
describe('TaskList Integration', () => {
  it('should load and display tasks', async () => {
    const { getByText, findByRole } = render(<TaskList />);
    
    // Wait for tasks to load
    await findByRole('list');
    
    // Verify task display
    expect(getByText('Task 1')).toBeInTheDocument();
  });
});
```

### 5. Documentation

#### Code Comments

```typescript
/**
 * Represents a time slot in the schedule
 * @property {Date} start - The start time
 * @property {Date} end - The end time
 * @property {string} status - Current status of the time slot
 */
interface TimeSlot {
  start: Date;
  end: Date;
  status: 'free' | 'busy' | 'tentative';
}
```

#### README Updates

- Keep installation instructions current
- Document new features
- Update API references
- Add examples for new functionality

### 6. Pull Request Process

1. **Before Submitting**
   - Rebase on latest main
   - Run all tests
   - Update documentation
   - Check for lint errors

2. **PR Description**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   Describe testing done

   ## Screenshots
   If applicable

   ## Checklist
   - [ ] Tests added
   - [ ] Documentation updated
   - [ ] Lint checks pass
   - [ ] Types checked
   ```

3. **Review Process**
   - Address reviewer comments
   - Keep PR scope focused
   - Be responsive to feedback

### 7. Release Process

1. **Version Bumping**
   ```bash
   npm version patch # For bug fixes
   npm version minor # For new features
   npm version major # For breaking changes
   ```

2. **Changelog Updates**
   ```markdown
   ## [1.1.0] - 2024-03-21
   ### Added
   - New timeline visualization
   - Task prioritization algorithm

   ### Fixed
   - Database connection stability
   - UI responsiveness issues
   ```

3. **Release Notes**
   - Document breaking changes
   - Highlight new features
   - Include upgrade instructions

## Getting Help

- Join our [Discord server](https://discord.gg/eremois)
- Check the [documentation](https://docs.eremois.dev)
- Ask in [GitHub Discussions](https://github.com/yourusername/eremois/discussions)

## Recognition

We value all contributions, and contributors will be recognized in:
- Release notes
- Contributors list
- Community spotlights

Thank you for contributing to erēmois! Together, we're building a better way to manage time and focus. 