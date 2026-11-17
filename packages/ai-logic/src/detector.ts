/**
 * BrainDrop AI — On-Device AI Capability Detector
 */

export type NanoStatus = "available" | "downloadable" | "unavailable" | "unknown";

export interface DeviceCapability {
  nanoStatus: NanoStatus;
  browserName: string;
  browserVersion: string;
  supportsWebGPU: boolean;
  timestamp: Date;
}

export async function detectOnDeviceAI(): Promise<DeviceCapability> {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isChrome = ua.includes("Chrome");
  const versionMatch = ua.match(/Chrome\/(\d+)/);
  const version = versionMatch ? parseInt(versionMatch[1], 10) : 0;

  let nanoStatus: NanoStatus = "unknown";
  let supportsWebGPU = false;

  if (typeof window !== "undefined") {
    supportsWebGPU = "gpu" in navigator;
    try {
      if ("ai" in window && "languageModel" in (window as any).ai) {
        const capabilities = await (window as any).ai.languageModel.capabilities();
        if (capabilities.available === "readily") nanoStatus = "available";
        else if (capabilities.available === "after-download") nanoStatus = "downloadable";
        else nanoStatus = "unavailable";
      } else {
        nanoStatus = "unavailable";
      }
    } catch {
      nanoStatus = "unavailable";
    }
  }

  return { nanoStatus, browserName: isChrome ? "Chrome" : "Other", browserVersion: version.toString(), supportsWebGPU, timestamp: new Date() };
}

export function isNanoReady(cap: DeviceCapability): boolean {
  return cap.nanoStatus === "available";
}
