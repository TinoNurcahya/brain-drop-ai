/**
 * BrainDrop AI — Hybrid Inference Router
 */
import type { AITaskType, AITaskRequest, AITaskResult, InferenceStrategy, TelemetryRecord, HybridConfig } from "@braindrop/core";
import { sanitize } from "@braindrop/core";
import { detectOnDeviceAI, isNanoReady } from "./detector";
import { simulateNano } from "./simulation";
import { PROMPTS, fillPrompt } from "./prompts";

const ON_DEVICE_TASKS: AITaskType[] = ["tag", "summarize", "simplify", "link", "search"];
const CLOUD_TASKS: AITaskType[] = ["synthesize", "flashcard", "expand", "translate"];

const DEFAULT_CONFIG: HybridConfig = {
  strategy: "PREFER_ON_DEVICE",
  simulateNano: false,
  maxOnDeviceTokens: 1024,
  cloudModel: "gemini-3.8-flash",
};

let telemetryLog: TelemetryRecord[] = [];

function routeTask(taskType: AITaskType, strategy: InferenceStrategy, nanoAvailable: boolean): "on-device" | "cloud" | "simulated" {
  if (strategy === "ONLY_CLOUD") return "cloud";
  if (strategy === "ONLY_ON_DEVICE") return nanoAvailable ? "on-device" : "simulated";
  if (ON_DEVICE_TASKS.includes(taskType)) return nanoAvailable ? "on-device" : "simulated";
  if (CLOUD_TASKS.includes(taskType)) return "cloud";
  return nanoAvailable ? "on-device" : "cloud";
}

async function runOnDevice(prompt: string): Promise<{ output: string; latencyMs: number }> {
  const start = performance.now();
  try {
    const session = await (window as any).ai.languageModel.create();
    const output = await session.prompt(prompt);
    session.destroy();
    return { output: output.trim(), latencyMs: Math.round(performance.now() - start) };
  } catch (error) {
    throw new Error(`On-device inference failed: ${error}`);
  }
}

async function runCloud(prompt: string): Promise<{ output: string; latencyMs: number }> {
  const start = performance.now();
  // TODO: Replace with actual Firebase AI Logic SDK call
  // import { getAI, getGenerativeModel } from "firebase/ai";
  // const ai = getAI(app);
  // const model = getGenerativeModel(ai, { model: "gemini-3.8-flash" });
  // const result = await model.generateContent(prompt);
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 500));
  const output = `[Cloud response pending Firebase setup — prompt length: ${prompt.length}]`;
  return { output, latencyMs: Math.round(performance.now() - start) };
}

function buildPrompt(request: AITaskRequest): string {
  const vars: Record<string, string> = { INPUT: request.input };
  if (request.targetLanguage) vars.TARGET_LANGUAGE = request.targetLanguage;
  const templateMap: Partial<Record<AITaskType, string>> = {
    tag: PROMPTS.TAG, summarize: PROMPTS.SUMMARIZE, simplify: PROMPTS.SIMPLIFY,
    synthesize: PROMPTS.SYNTHESIZE, flashcard: PROMPTS.FLASHCARD, expand: PROMPTS.EXPAND, translate: PROMPTS.TRANSLATE,
  };
  const template = templateMap[request.type];
  return template ? fillPrompt(template, vars) : request.input;
}

export async function executeTask(request: AITaskRequest, config: Partial<HybridConfig> = {}): Promise<AITaskResult> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const capability = await detectOnDeviceAI();
  const nanoAvailable = isNanoReady(capability);
  const mode = routeTask(request.type, cfg.strategy, nanoAvailable);
  const prompt = buildPrompt(request);

  let output: string;
  let latencyMs: number;

  if (mode === "simulated") {
    const result = await simulateNano(request.type, request.input);
    output = result.output; latencyMs = result.latencyMs;
  } else if (mode === "on-device") {
    const result = await runOnDevice(prompt);
    output = result.output; latencyMs = result.latencyMs;
  } else {
    const sanitized = sanitize(request.input);
    const cloudPrompt = sanitized.containsPII ? buildPrompt({ ...request, input: sanitized.sanitized }) : prompt;
    const result = await runCloud(cloudPrompt);
    output = result.output; latencyMs = result.latencyMs;
  }

  const record: TelemetryRecord = {
    id: crypto.randomUUID(), operation: request.type, mode, latencyMs,
    inputTokens: Math.ceil(request.input.length / 4), outputTokens: Math.ceil(output.length / 4),
    timestamp: new Date(), userId: "",
  };
  telemetryLog.push(record);

  return { type: request.type, output, mode, latencyMs, tokens: record.inputTokens + (record.outputTokens ?? 0) };
}

export function getTelemetryLog(): TelemetryRecord[] { return [...telemetryLog]; }

export function getTelemetryStats() {
  const stats = { totalOnDevice: 0, totalCloud: 0, totalSimulated: 0, avgOnDeviceLatency: 0, avgCloudLatency: 0, bytesKeptLocal: 0 };
  let odSum = 0, cSum = 0;
  for (const r of telemetryLog) {
    if (r.mode === "on-device") { stats.totalOnDevice++; odSum += r.latencyMs; stats.bytesKeptLocal += r.inputTokens * 4; }
    else if (r.mode === "cloud") { stats.totalCloud++; cSum += r.latencyMs; }
    else { stats.totalSimulated++; stats.bytesKeptLocal += r.inputTokens * 4; }
  }
  stats.avgOnDeviceLatency = stats.totalOnDevice > 0 ? Math.round(odSum / stats.totalOnDevice) : 0;
  stats.avgCloudLatency = stats.totalCloud > 0 ? Math.round(cSum / stats.totalCloud) : 0;
  return stats;
}

export function clearTelemetry(): void { telemetryLog = []; }
