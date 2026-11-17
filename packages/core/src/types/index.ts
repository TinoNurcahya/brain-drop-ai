/** BrainDrop AI — Core Type Definitions */

export interface Note {
  id: string;
  title: string;
  content: string;
  plainText: string;
  tags: string[];
  sourceUrl?: string;
  sourceTitle?: string;
  clippedText?: string;
  isClip: boolean;
  linkedNoteIds: string[];
  summary?: string;
  aiProcessed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Clip {
  id: string;
  text: string;
  sourceUrl: string;
  sourceTitle: string;
  pageDescription?: string;
  selectedHtml?: string;
  tags: string[];
  createdAt: Date;
  userId: string;
}

export interface Tag {
  name: string;
  color: string;
  count: number;
}

export interface FlashCard {
  id: string;
  noteId: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  nextReview: Date;
  correctCount: number;
  incorrectCount: number;
  createdAt: Date;
  userId: string;
}

export interface GraphNode {
  id: string;
  noteId: string;
  label: string;
  tags: string[];
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  strength: number;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TelemetryRecord {
  id: string;
  operation: string;
  mode: "on-device" | "cloud" | "simulated";
  latencyMs: number;
  inputTokens: number;
  outputTokens?: number;
  timestamp: Date;
  userId: string;
}

export interface TelemetryStats {
  totalOnDevice: number;
  totalCloud: number;
  totalSimulated: number;
  avgOnDeviceLatency: number;
  avgCloudLatency: number;
  bytesKeptLocal: number;
}

export type AITaskType =
  | "tag"
  | "summarize"
  | "simplify"
  | "expand"
  | "link"
  | "synthesize"
  | "flashcard"
  | "translate"
  | "search";

export interface AITaskRequest {
  type: AITaskType;
  input: string;
  context?: string;
  noteIds?: string[];
  targetLanguage?: string;
}

export interface AITaskResult {
  type: AITaskType;
  output: string;
  mode: "on-device" | "cloud" | "simulated";
  latencyMs: number;
  tokens: number;
}

export type InferenceStrategy =
  | "PREFER_ON_DEVICE"
  | "ONLY_ON_DEVICE"
  | "ONLY_CLOUD"
  | "AUTO";

export interface HybridConfig {
  strategy: InferenceStrategy;
  simulateNano: boolean;
  maxOnDeviceTokens: number;
  cloudModel: string;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  defaultStrategy: InferenceStrategy;
  enableTelemetry: boolean;
  enableDemoMode: boolean;
}
