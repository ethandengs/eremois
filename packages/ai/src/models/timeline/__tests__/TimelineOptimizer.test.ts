import { TimelineOptimizer, type TimelineData } from '../TimelineOptimizer';
import type { ModelConfig } from '../../../types/model';

describe('TimelineOptimizer', () => {
  let optimizer: TimelineOptimizer;
  
  const mockConfig: ModelConfig = {
    deviceType: 'cpu',
    precision: 'float32',
    maxMemoryUsage: 256,
    timeout: 1000,
  };

  const mockTimelineData: TimelineData = {
    tasks: [
      {
        id: 'task-1',
        duration: 60,
        priority: 1,
        dependencies: [],
      },
      {
        id: 'task-2',
        duration: 120,
        priority: 2,
        dependencies: ['task-1'],
        preferredTime: { start: 9 * 3600, end: 12 * 3600 }, // 9 AM to 12 PM
      },
    ],
    constraints: {
      workingHours: { start: 9 * 3600, end: 17 * 3600 }, // 9 AM to 5 PM
      breakDuration: 30,
      maxTasksPerDay: 8,
    },
  };

  beforeEach(() => {
    optimizer = new TimelineOptimizer();
  });

  afterEach(async () => {
    await optimizer.dispose();
  });

  it('should implement BaseModel interface', () => {
    expect(optimizer).toBeModelCompatible({});
  });

  it('should initialize with custom config', async () => {
    await optimizer.initialize(mockConfig);
    expect(optimizer.config).toEqual(mockConfig);
  });

  it('should generate valid schedule', async () => {
    await optimizer.initialize(mockConfig);
    const result = await optimizer.predict(mockTimelineData);

    // Check schedule structure
    expect(result.schedule).toBeDefined();
    expect(Array.isArray(result.schedule)).toBe(true);
    expect(result.schedule.length).toBe(mockTimelineData.tasks.length);

    // Check metrics
    expect(result.metrics).toBeDefined();
    expect(result.metrics.utilizationRate).toBeGreaterThan(0);
    expect(result.metrics.utilizationRate).toBeLessThanOrEqual(1);
    expect(result.metrics.satisfactionScore).toBeGreaterThan(0);
    expect(result.metrics.satisfactionScore).toBeLessThanOrEqual(1);
  });

  it('should respect task dependencies', async () => {
    await optimizer.initialize(mockConfig);
    const result = await optimizer.predict(mockTimelineData);

    const task1 = result.schedule.find(t => t.taskId === 'task-1');
    const task2 = result.schedule.find(t => t.taskId === 'task-2');

    expect(task1).toBeDefined();
    expect(task2).toBeDefined();
    if (task1 && task2) {
      expect(task2.startTime).toBeGreaterThanOrEqual(task1.endTime);
    }
  });

  it('should respect working hours constraint', async () => {
    await optimizer.initialize(mockConfig);
    const result = await optimizer.predict(mockTimelineData);

    for (const task of result.schedule) {
      const taskStartHour = task.startTime % (24 * 3600);
      const taskEndHour = task.endTime % (24 * 3600);

      expect(taskStartHour).toBeGreaterThanOrEqual(mockTimelineData.constraints.workingHours.start);
      expect(taskEndHour).toBeLessThanOrEqual(mockTimelineData.constraints.workingHours.end);
    }
  });

  it('should handle empty task list', async () => {
    await optimizer.initialize(mockConfig);
    const emptyData = {
      ...mockTimelineData,
      tasks: [],
    };

    const result = await optimizer.predict(emptyData);
    expect(result.schedule).toHaveLength(0);
    expect(result.metrics.utilizationRate).toBe(0);
  });

  it('should export and import model state', async () => {
    await optimizer.initialize(mockConfig);
    const exportedState = await optimizer.export();
    
    const newOptimizer = new TimelineOptimizer();
    await newOptimizer.initialize(mockConfig);
    await newOptimizer.import(exportedState);

    const result1 = await optimizer.predict(mockTimelineData);
    const result2 = await newOptimizer.predict(mockTimelineData);

    expect(result1).toEqual(result2);
  });

  it('should train on historical data', async () => {
    await optimizer.initialize(mockConfig);
    await expect(optimizer.train([mockTimelineData])).resolves.not.toThrow();
  });
}); 