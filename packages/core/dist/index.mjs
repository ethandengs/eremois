// src/tasks/TaskManager.ts
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";

// src/tasks/types.ts
import { z } from "zod";
var TaskPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
var TaskStatusSchema = z.enum(["todo", "in_progress", "completed", "cancelled"]);
var TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: TaskPrioritySchema,
  status: TaskStatusSchema,
  dueDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(z.string()),
  parentId: z.string().uuid().optional(),
  subTasks: z.array(z.string().uuid()).optional()
});

// src/tasks/TaskManager.ts
var TaskManager = class {
  constructor(storage) {
    this.STORAGE_KEY = "tasks";
    this.tasks = /* @__PURE__ */ new Map();
    this.storage = storage || null;
    if (this.storage) {
      this.loadFromStorage().catch(console.error);
    }
  }
  async loadFromStorage() {
    if (!this.storage) return;
    const storedTasks = await this.storage.get(this.STORAGE_KEY) || [];
    this.tasks = new Map(storedTasks.map((task) => [task.id, task]));
  }
  async saveToStorage() {
    if (!this.storage) return;
    const tasks = Array.from(this.tasks.values());
    await this.storage.set(this.STORAGE_KEY, tasks);
  }
  async createTask(title, description, priority = "medium", dueDate, parentId) {
    const task = {
      id: uuidv4(),
      title,
      description,
      priority,
      status: "todo",
      dueDate,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      tags: [],
      parentId,
      subTasks: []
    };
    TaskSchema.parse(task);
    if (parentId) {
      const parent = this.tasks.get(parentId);
      if (parent) {
        this.tasks.set(
          parentId,
          produce(parent, (draft) => {
            draft.subTasks = draft.subTasks || [];
            draft.subTasks.push(task.id);
          })
        );
      }
    }
    this.tasks.set(task.id, task);
    await this.saveToStorage();
    return task;
  }
  async getTask(id) {
    return this.tasks.get(id);
  }
  async updateTask(id, updates) {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    const updatedTask = produce(task, (draft) => {
      Object.assign(draft, updates);
      draft.updatedAt = /* @__PURE__ */ new Date();
    });
    TaskSchema.parse(updatedTask);
    this.tasks.set(id, updatedTask);
    await this.saveToStorage();
    return updatedTask;
  }
  async updateTaskStatus(id, status) {
    return this.updateTask(id, { status });
  }
  async deleteTask(id) {
    const task = this.tasks.get(id);
    if (!task) {
      return;
    }
    if (task.parentId) {
      const parent = this.tasks.get(task.parentId);
      if (parent?.subTasks) {
        this.tasks.set(
          task.parentId,
          produce(parent, (draft) => {
            draft.subTasks = draft.subTasks?.filter((subtaskId) => subtaskId !== id);
          })
        );
      }
    }
    const deleteTaskRecursive = (taskId) => {
      const taskToDelete = this.tasks.get(taskId);
      if (!taskToDelete) return;
      for (const subtaskId of taskToDelete.subTasks ?? []) {
        deleteTaskRecursive(subtaskId);
      }
      this.tasks.delete(taskId);
    };
    deleteTaskRecursive(id);
    await this.saveToStorage();
  }
  async getAllTasks() {
    return Array.from(this.tasks.values());
  }
  async getTasksByStatus(status) {
    return (await this.getAllTasks()).filter((task) => task.status === status);
  }
  async getTasksByPriority(priority) {
    return (await this.getAllTasks()).filter((task) => task.priority === priority);
  }
};

// src/timeline/TimelineManager.ts
import { produce as produce2 } from "immer";
import { v4 as uuidv42 } from "uuid";
var TimelineManager = class {
  constructor(storage, taskManager) {
    this.STORAGE_KEY = "timeBlocks";
    this.blocks = /* @__PURE__ */ new Map();
    this.storage = storage || null;
    this.taskManager = taskManager || null;
    if (this.storage) {
      this.loadFromStorage().catch(console.error);
    }
  }
  async loadFromStorage() {
    if (!this.storage) return;
    const storedBlocks = await this.storage.get(this.STORAGE_KEY) || [];
    this.blocks = new Map(storedBlocks.map((block) => [block.id, block]));
  }
  async saveToStorage() {
    if (!this.storage) return;
    const blocks = Array.from(this.blocks.values());
    await this.storage.set(this.STORAGE_KEY, blocks);
  }
  async createBlock(type, startTime, endTime, title, description, color, taskId) {
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }
    const overlapping = await this.findOverlappingBlocks(startTime, endTime);
    if (overlapping.length > 0) {
      throw new Error("Time block overlaps with existing blocks");
    }
    if (taskId && this.taskManager) {
      const task = await this.taskManager.getTask(taskId);
      if (!task) {
        throw new Error(`Task with id ${taskId} not found`);
      }
    }
    const block = {
      id: uuidv42(),
      type,
      startTime,
      endTime,
      title,
      description,
      color
    };
    this.blocks.set(block.id, block);
    await this.saveToStorage();
    return block;
  }
  async getBlock(id) {
    return this.blocks.get(id);
  }
  async updateBlock(id, updates) {
    const block = this.blocks.get(id);
    if (!block) {
      throw new Error(`Block with id ${id} not found`);
    }
    if (updates.startTime || updates.endTime) {
      const startTime = updates.startTime || block.startTime;
      const endTime = updates.endTime || block.endTime;
      if (startTime >= endTime) {
        throw new Error("Start time must be before end time");
      }
      const overlapping = await this.findOverlappingBlocks(startTime, endTime, id);
      if (overlapping.length > 0) {
        throw new Error("Updated time block would overlap with existing blocks");
      }
    }
    const updatedBlock = produce2(block, (draft) => {
      Object.assign(draft, updates);
    });
    this.blocks.set(id, updatedBlock);
    await this.saveToStorage();
    return updatedBlock;
  }
  async deleteBlock(id) {
    this.blocks.delete(id);
    await this.saveToStorage();
  }
  async getBlocksInRange(start, end) {
    return Array.from(this.blocks.values()).filter(
      (block) => block.startTime >= start && block.endTime <= end
    );
  }
  async findOverlappingBlocks(start, end, excludeId) {
    return Array.from(this.blocks.values()).filter(
      (block) => block.id !== excludeId && // Exclude the block being updated
      !// Return true if blocks overlap
      (block.endTime <= start || // Block ends before start
      block.startTime >= end)
    );
  }
  async createTaskBlock(task, startTime, endTime) {
    return this.createBlock(
      "TASK",
      startTime,
      endTime,
      task.title,
      task.description,
      void 0,
      // color could be based on task priority
      task.id
    );
  }
  async getAllBlocks() {
    return Array.from(this.blocks.values());
  }
  async getBlocksByType(type) {
    return Array.from(this.blocks.values()).filter((block) => block.type === type);
  }
};

// src/timeline/TimelineService.ts
var TimelineService = class {
  constructor(storage, taskManager) {
    this.userPattern = null;
    this.timelineManager = new TimelineManager(storage, taskManager);
    this.taskManager = taskManager;
  }
  async setUserPattern(pattern) {
    this.userPattern = pattern;
  }
  async scheduleTask(task, preferredStartTime) {
    if (!this.userPattern) {
      throw new Error("User pattern not set");
    }
    const startTime = preferredStartTime || await this.findNextAvailableSlot(task);
    const duration = this.estimateTaskDuration(task);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1e3);
    return this.timelineManager.createTaskBlock(task, startTime, endTime);
  }
  async findNextAvailableSlot(task) {
    if (!this.userPattern) {
      throw new Error("User pattern not set");
    }
    const now = /* @__PURE__ */ new Date();
    const duration = this.estimateTaskDuration(task);
    let candidateTime = now;
    for (let day = 0; day < 7; day++) {
      const dayOfWeek = candidateTime.getDay();
      const productivePeriod = this.userPattern.productivePeriods.find(
        (period) => period.dayOfWeek === dayOfWeek
      );
      if (productivePeriod) {
        const periodStart = new Date(candidateTime);
        periodStart.setHours(productivePeriod.startHour, 0, 0, 0);
        const periodEnd = new Date(candidateTime);
        periodEnd.setHours(productivePeriod.endHour, 0, 0, 0);
        const startTime = candidateTime > periodStart ? candidateTime : periodStart;
        const blocks = await this.timelineManager.getBlocksInRange(startTime, periodEnd);
        const availableSlot = this.findGapInBlocks(blocks, startTime, periodEnd, duration);
        if (availableSlot) {
          return availableSlot;
        }
      }
      candidateTime = new Date(candidateTime.getTime() + 24 * 60 * 60 * 1e3);
      candidateTime.setHours(0, 0, 0, 0);
    }
    throw new Error("No available time slots found in the next 7 days");
  }
  findGapInBlocks(blocks, start, end, durationMinutes) {
    const sortedBlocks = [...blocks].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );
    let currentTime = start;
    if (sortedBlocks.length === 0 || this.getMinutesBetween(currentTime, sortedBlocks[0].startTime) >= durationMinutes) {
      return currentTime;
    }
    for (let i = 0; i < sortedBlocks.length - 1; i++) {
      currentTime = sortedBlocks[i].endTime;
      const nextStart = sortedBlocks[i + 1].startTime;
      if (this.getMinutesBetween(currentTime, nextStart) >= durationMinutes) {
        return currentTime;
      }
    }
    if (sortedBlocks.length > 0) {
      currentTime = sortedBlocks[sortedBlocks.length - 1].endTime;
      if (this.getMinutesBetween(currentTime, end) >= durationMinutes) {
        return currentTime;
      }
    }
    return null;
  }
  getMinutesBetween(start, end) {
    return (end.getTime() - start.getTime()) / (1e3 * 60);
  }
  estimateTaskDuration(task) {
    switch (task.priority) {
      case "urgent":
        return 30;
      case "high":
        return 45;
      case "medium":
        return 60;
      case "low":
        return 90;
      default:
        return 60;
    }
  }
  async suggestBreaks(start, end) {
    if (!this.userPattern) {
      throw new Error("User pattern not set");
    }
    const blocks = await this.timelineManager.getBlocksInRange(start, end);
    const suggestedBreaks = [];
    const breakDuration = this.userPattern.preferredBreakDuration;
    let currentTime = start;
    while (currentTime < end) {
      const nextBlock = blocks.find((block) => block.startTime > currentTime);
      if (!nextBlock) {
        break;
      }
      const gap = this.getMinutesBetween(currentTime, nextBlock.startTime);
      if (gap >= breakDuration) {
        const breakStart = new Date(
          currentTime.getTime() + (gap - breakDuration) / 2 * 60 * 1e3
        );
        const breakEnd = new Date(breakStart.getTime() + breakDuration * 60 * 1e3);
        const breakBlock = await this.timelineManager.createBlock(
          "BREAK",
          breakStart,
          breakEnd,
          "Suggested Break"
        );
        suggestedBreaks.push(breakBlock);
      }
      currentTime = nextBlock.endTime;
    }
    return suggestedBreaks;
  }
  async getTimelineManager() {
    return this.timelineManager;
  }
};

// src/patterns/UserPatternManager.ts
import { produce as produce3 } from "immer";
var UserPatternManager = class {
  constructor(storage) {
    this.pattern = null;
    this.STORAGE_KEY = "userPattern";
    this.HISTORY_KEY = "patternHistory";
    this.DEFAULT_ANALYSIS_DAYS = 30;
    this.storage = storage;
    this.loadPattern().catch(console.error);
  }
  async loadPattern() {
    this.pattern = await this.storage.get(this.STORAGE_KEY) || null;
  }
  async savePattern(pattern) {
    await this.storage.set(this.STORAGE_KEY, pattern);
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const history = await this.storage.get(this.HISTORY_KEY) || {};
    history[timestamp] = pattern;
    await this.storage.set(this.HISTORY_KEY, history);
  }
  async getPattern() {
    return this.pattern;
  }
  async updatePattern(updates) {
    if (!this.pattern) {
      throw new Error("No pattern exists. Create a new pattern first.");
    }
    const updatedPattern = produce3(this.pattern, (draft) => {
      Object.assign(draft, updates);
    });
    await this.savePattern(updatedPattern);
    this.pattern = updatedPattern;
    return updatedPattern;
  }
  async createPattern(pattern) {
    await this.savePattern(pattern);
    this.pattern = pattern;
    return pattern;
  }
  async analyzeProductivity(blocks, days = this.DEFAULT_ANALYSIS_DAYS) {
    const now = /* @__PURE__ */ new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1e3);
    const relevantBlocks = blocks.filter((block) => block.startTime >= startDate);
    const focusBlocks = relevantBlocks.filter((block) => block.type === "FOCUS");
    const breakBlocks = relevantBlocks.filter((block) => block.type === "BREAK");
    const taskBlocks = relevantBlocks.filter((block) => block.type === "TASK");
    const averageFocusDuration = this.calculateAverageDuration(focusBlocks);
    const averageBreakDuration = this.calculateAverageDuration(breakBlocks);
    const hourlyProductivity = this.analyzeHourlyProductivity(focusBlocks, taskBlocks);
    const mostProductiveHours = this.getTopPeriods(hourlyProductivity, 5);
    const dailyProductivity = this.analyzeDailyProductivity(focusBlocks, taskBlocks);
    const mostProductiveDays = this.getTopPeriods(dailyProductivity, 3).map(({ hour, productivity }) => ({
      day: hour,
      productivity
    }));
    const completedTasks = taskBlocks.filter((block) => block.type === "TASK").length;
    const taskCompletionRate = completedTasks / taskBlocks.length || 0;
    const breakAdherence = this.calculateBreakAdherence(focusBlocks, breakBlocks);
    return {
      averageFocusDuration,
      averageBreakDuration,
      mostProductiveHours,
      mostProductiveDays,
      taskCompletionRate,
      breakAdherence
    };
  }
  async suggestPatternUpdates(blocks) {
    const metrics = await this.analyzeProductivity(blocks);
    const suggestedFocusDuration = Math.round(metrics.averageFocusDuration);
    const suggestedBreakDuration = Math.round(metrics.averageBreakDuration);
    const suggestedProductivePeriods = metrics.mostProductiveHours.flatMap(
      (hour) => metrics.mostProductiveDays.map((day) => ({
        dayOfWeek: day.day,
        startHour: hour.hour,
        endHour: hour.hour + 2,
        // Suggest 2-hour blocks
        confidence: (day.productivity + hour.productivity) / 2
      }))
    ).sort((a, b) => b.confidence - a.confidence);
    return {
      suggestedFocusDuration,
      suggestedBreakDuration,
      suggestedProductivePeriods
    };
  }
  calculateAverageDuration(blocks) {
    if (blocks.length === 0) return 0;
    const durations = blocks.map(
      (block) => (block.endTime.getTime() - block.startTime.getTime()) / (1e3 * 60)
    );
    return durations.reduce((sum, duration) => sum + duration, 0) / blocks.length;
  }
  analyzeHourlyProductivity(focusBlocks, taskBlocks) {
    const hourlyProductivity = /* @__PURE__ */ new Map();
    for (let i = 0; i < 24; i++) {
      hourlyProductivity.set(i, 0);
    }
    for (const block of focusBlocks) {
      const hour = block.startTime.getHours();
      const duration = (block.endTime.getTime() - block.startTime.getTime()) / (1e3 * 60);
      hourlyProductivity.set(hour, (hourlyProductivity.get(hour) || 0) + duration);
    }
    for (const block of taskBlocks) {
      const hour = block.startTime.getHours();
      const duration = (block.endTime.getTime() - block.startTime.getTime()) / (1e3 * 60);
      hourlyProductivity.set(hour, (hourlyProductivity.get(hour) || 0) + duration * 1.5);
    }
    return hourlyProductivity;
  }
  analyzeDailyProductivity(focusBlocks, taskBlocks) {
    const dailyProductivity = /* @__PURE__ */ new Map();
    for (let i = 0; i < 7; i++) {
      dailyProductivity.set(i, 0);
    }
    for (const block of focusBlocks) {
      const day = block.startTime.getDay();
      const duration = (block.endTime.getTime() - block.startTime.getTime()) / (1e3 * 60);
      dailyProductivity.set(day, (dailyProductivity.get(day) || 0) + duration);
    }
    for (const block of taskBlocks) {
      const day = block.startTime.getDay();
      const duration = (block.endTime.getTime() - block.startTime.getTime()) / (1e3 * 60);
      dailyProductivity.set(day, (dailyProductivity.get(day) || 0) + duration * 1.5);
    }
    return dailyProductivity;
  }
  getTopPeriods(productivityMap, count) {
    return Array.from(productivityMap.entries()).map(([period, productivity]) => ({ hour: period, productivity })).sort((a, b) => b.productivity - a.productivity).slice(0, count);
  }
  calculateBreakAdherence(focusBlocks, breakBlocks) {
    if (!this.pattern || focusBlocks.length === 0) return 0;
    const expectedBreaks = Math.floor(
      focusBlocks.reduce(
        (total, block) => total + (block.endTime.getTime() - block.startTime.getTime()) / (1e3 * 60),
        0
      ) / this.pattern.preferredFocusDuration
    );
    return Math.min(breakBlocks.length / expectedBreaks, 1);
  }
  async getPatternHistory(days = this.DEFAULT_ANALYSIS_DAYS) {
    const history = await this.storage.get(this.HISTORY_KEY) || {};
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1e3);
    return Object.entries(history).filter(([timestamp]) => new Date(timestamp) >= cutoffDate).map(([, pattern]) => pattern);
  }
};

// src/storage/encrypted/EncryptionManager.ts
import { webcrypto } from "node:crypto";
var EncryptionManager = class {
  constructor() {
    this.keys = /* @__PURE__ */ new Map();
    this.currentKeyId = null;
    this.generateNewKey().catch(console.error);
  }
  async generateNewKey() {
    const key = await webcrypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt"]
    );
    const keyId = webcrypto.randomUUID();
    this.keys.set(keyId, {
      id: keyId,
      key,
      createdAt: /* @__PURE__ */ new Date()
    });
    this.currentKeyId = keyId;
    return keyId;
  }
  async encrypt(data) {
    if (!this.currentKeyId) {
      throw new Error("No encryption key available");
    }
    const key = this.keys.get(this.currentKeyId);
    if (!key) {
      throw new Error("Current encryption key not found");
    }
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    const encryptedData = await webcrypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      key.key,
      dataBuffer
    );
    return {
      keyId: key.id,
      iv,
      data: new Uint8Array(encryptedData),
      timestamp: Date.now()
    };
  }
  async decrypt(encryptedData) {
    const key = this.keys.get(encryptedData.keyId);
    if (!key) {
      throw new Error(`Encryption key ${encryptedData.keyId} not found`);
    }
    try {
      const decryptedBuffer = await webcrypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: encryptedData.iv
        },
        key.key,
        encryptedData.data
      );
      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decryptedBuffer);
      return JSON.parse(decryptedText);
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async exportKey(keyId) {
    const key = this.keys.get(keyId);
    if (!key) {
      throw new Error(`Key ${keyId} not found`);
    }
    return webcrypto.subtle.exportKey("jwk", key.key);
  }
  async importKey(keyId, jwk) {
    const key = await webcrypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt"]
    );
    this.keys.set(keyId, {
      id: keyId,
      key,
      createdAt: /* @__PURE__ */ new Date()
    });
  }
  async rotateKey() {
    const newKeyId = await this.generateNewKey();
    return newKeyId;
  }
  getCurrentKeyId() {
    return this.currentKeyId;
  }
  hasKey(keyId) {
    return this.keys.has(keyId);
  }
};

// src/sync/SyncManager.ts
var SyncManager = class {
  constructor(storage, encryptionManager, deviceId) {
    this.version = 1;
    this.peers = /* @__PURE__ */ new Map();
    this.pendingOperations = [];
    this.storage = storage;
    this.encryptionManager = encryptionManager;
    this.deviceId = deviceId;
  }
  async addPeer(peer) {
    this.peers.set(peer.id, {
      ...peer,
      lastSeen: /* @__PURE__ */ new Date()
    });
  }
  async removePeer(peerId) {
    this.peers.delete(peerId);
  }
  async prepareDataForSync() {
    const data = {
      tasks: await this.storage.get("tasks") || [],
      timeBlocks: await this.storage.get("timeBlocks") || [],
      userPattern: await this.storage.get("userPattern")
    };
    return this.encryptionManager.encrypt(data);
  }
  async processSyncData(encryptedData) {
    const data = await this.encryptionManager.decrypt(encryptedData);
    await this.mergeData(data);
  }
  async mergeData(remoteData) {
    const localTasks = await this.storage.get("tasks") || [];
    const mergedTasks = this.mergeEntities(localTasks, remoteData.tasks);
    await this.storage.set("tasks", mergedTasks);
    const localBlocks = await this.storage.get("timeBlocks") || [];
    const mergedBlocks = this.mergeEntities(localBlocks, remoteData.timeBlocks);
    await this.storage.set("timeBlocks", mergedBlocks);
    const localPattern = await this.storage.get("userPattern");
    if (remoteData.userPattern && (!localPattern || new Date(remoteData.userPattern.updatedAt) > new Date(localPattern.updatedAt))) {
      await this.storage.set("userPattern", remoteData.userPattern);
    }
  }
  mergeEntities(local, remote) {
    const merged = /* @__PURE__ */ new Map();
    for (const entity of local) {
      merged.set(entity.id, entity);
    }
    for (const remoteEntity of remote) {
      const localEntity = merged.get(remoteEntity.id);
      if (!localEntity) {
        merged.set(remoteEntity.id, remoteEntity);
      } else {
        const remoteDate = new Date(remoteEntity.updatedAt);
        const localDate = new Date(localEntity.updatedAt);
        if (remoteDate > localDate) {
          merged.set(remoteEntity.id, remoteEntity);
        }
      }
    }
    return Array.from(merged.values());
  }
  async recordOperation(operation) {
    const syncOperation = {
      ...operation,
      metadata: {
        timestamp: Date.now(),
        deviceId: this.deviceId,
        version: this.version
      }
    };
    this.pendingOperations.push(syncOperation);
    await this.storage.set("pendingOperations", this.pendingOperations);
  }
  async getPendingOperations() {
    return this.pendingOperations;
  }
  async clearPendingOperations() {
    this.pendingOperations = [];
    await this.storage.set("pendingOperations", []);
  }
  async resolveConflict(conflict) {
    switch (conflict.resolution) {
      case "local":
        break;
      case "remote":
        await this.applyOperation(conflict.operation);
        break;
      case "merge":
        if (conflict.mergedData) {
          await this.applyOperation({
            ...conflict.operation,
            data: conflict.mergedData
          });
        }
        break;
    }
  }
  async applyOperation(operation) {
    const { entityType, type, entityId, data } = operation;
    const storageKey = `${entityType}s`;
    switch (type) {
      case "create":
      case "update": {
        const entities = await this.storage.get(storageKey) || [];
        const index = entities.findIndex((e) => e.id === entityId);
        if (index === -1) {
          entities.push(data);
        } else {
          entities[index] = data;
        }
        await this.storage.set(storageKey, entities);
        break;
      }
      case "delete": {
        const entities = await this.storage.get(storageKey) || [];
        const filtered = entities.filter((e) => e.id !== entityId);
        await this.storage.set(storageKey, filtered);
        break;
      }
    }
  }
  getConnectedPeers() {
    return Array.from(this.peers.values());
  }
  async updatePeerLastSeen(peerId) {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.lastSeen = /* @__PURE__ */ new Date();
    }
  }
};

// src/sync/P2PNetworkManager.ts
var P2PNetworkManager = class {
  constructor(config = {}) {
    this.peers = /* @__PURE__ */ new Map();
    this.stats = {
      connectedPeers: 0,
      bytesTransferred: 0,
      lastSyncTime: null,
      activeSyncCount: 0
    };
    this.messageHandlers = /* @__PURE__ */ new Map();
    this.config = {
      discoveryInterval: config.discoveryInterval || 3e4,
      // 30 seconds
      syncInterval: config.syncInterval || 3e5,
      // 5 minutes
      maxPeers: config.maxPeers || 10,
      timeout: config.timeout || 5e3
      // 5 seconds
    };
  }
  async start() {
    this.startDiscovery();
    this.startPeriodicSync();
  }
  async stop() {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
    }
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    await this.disconnectFromAllPeers();
  }
  startDiscovery() {
    this.discoveryInterval = setInterval(() => {
      this.discoverPeers().catch(console.error);
    }, this.config.discoveryInterval);
  }
  startPeriodicSync() {
    this.syncInterval = setInterval(() => {
      this.syncWithPeers().catch(console.error);
    }, this.config.syncInterval);
  }
  async connectToPeer(peer) {
    if (this.peers.size >= this.config.maxPeers) {
      return false;
    }
    try {
      this.peers.set(peer.id, peer);
      this.stats.connectedPeers = this.peers.size;
      return true;
    } catch (error) {
      console.error(`Failed to connect to peer ${peer.id}:`, error);
      return false;
    }
  }
  async disconnectFromPeer(peerId) {
    this.peers.delete(peerId);
    this.stats.connectedPeers = this.peers.size;
  }
  async disconnectFromAllPeers() {
    for (const peerId of this.peers.keys()) {
      await this.disconnectFromPeer(peerId);
    }
  }
  async sendMessage(peerId, message) {
    const peer = this.peers.get(peerId);
    if (!peer) {
      throw new Error(`Peer ${peerId} not found`);
    }
    this.stats.bytesTransferred += JSON.stringify(message).length;
  }
  async broadcastMessage(message) {
    const sendPromises = Array.from(this.peers.keys()).map(
      (peerId) => this.sendMessage(peerId, message)
    );
    await Promise.all(sendPromises);
  }
  onMessage(type, handler) {
    this.messageHandlers.set(type, handler);
  }
  async handleMessage(message) {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      try {
        await handler(message);
      } catch (error) {
        console.error(`Error handling message of type ${message.type}:`, error);
      }
    }
  }
  async discoverPeers() {
    const discoveryMessage = {
      type: "PEER_DISCOVERY",
      senderId: "local",
      // Replace with actual local peer ID
      timestamp: Date.now()
    };
    await this.broadcastMessage(discoveryMessage);
  }
  async syncWithPeers() {
    if (this.stats.activeSyncCount > 0) {
      return;
    }
    this.stats.activeSyncCount++;
    try {
      const syncMessage = {
        type: "SYNC_REQUEST",
        senderId: "local",
        // Replace with actual local peer ID
        timestamp: Date.now()
      };
      await this.broadcastMessage(syncMessage);
      this.stats.lastSyncTime = /* @__PURE__ */ new Date();
    } finally {
      this.stats.activeSyncCount--;
    }
  }
  getStats() {
    return { ...this.stats };
  }
  getPeers() {
    return Array.from(this.peers.values());
  }
  async updatePeerLastSeen(peerId) {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.lastSeen = /* @__PURE__ */ new Date();
    }
  }
};
export {
  EncryptionManager,
  P2PNetworkManager,
  SyncManager,
  TaskManager,
  TaskPrioritySchema,
  TaskSchema,
  TaskStatusSchema,
  TimelineManager,
  TimelineService,
  UserPatternManager
};
