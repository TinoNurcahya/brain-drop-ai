// BrainDrop AI — Extension Background Service Worker

// Enable side panel on extension icon click
chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: false })?.catch(() => {});

// Context menu for clipping
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "braindrop-clip",
    title: "🧠 Clip to BrainDrop AI",
    contexts: ["selection"],
  });
});

// Helper to push clip to web app API
async function syncToWebApp(clip) {
  try {
    const res = await fetch("http://localhost:3000/api/clips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clip),
    });
    return res.ok;
  } catch {
    // Web app might not be running locally; kept in chrome.storage.local safely
    return false;
  }
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "braindrop-clip" && info.selectionText) {
    const clip = {
      id: `clip-${Date.now()}`,
      text: info.selectionText.trim(),
      sourceUrl: tab?.url || "",
      sourceTitle: tab?.title || "Web Clip",
      tags: ["web-clip"],
      timestamp: Date.now(),
    };

    // Save to extension storage
    chrome.storage.local.get(["clips"], async (result) => {
      const clips = result.clips || [];
      clips.unshift(clip);
      chrome.storage.local.set({ clips: clips.slice(0, 100) });
    });

    // Sync to local BrainDrop Next.js instance
    await syncToWebApp(clip);
  }
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CLIP_TEXT") {
    const clip = {
      id: `clip-${Date.now()}`,
      text: message.text.trim(),
      sourceUrl: message.sourceUrl || "",
      sourceTitle: message.sourceTitle || "Quick Note",
      selectedHtml: message.selectedHtml || "",
      tags: message.tags || ["web-clip"],
      timestamp: Date.now(),
    };

    chrome.storage.local.get(["clips"], async (result) => {
      const clips = result.clips || [];
      clips.unshift(clip);
      chrome.storage.local.set({ clips: clips.slice(0, 100) }, async () => {
        const synced = await syncToWebApp(clip);
        sendResponse({ success: true, clip, synced });
      });
    });

    return true; // Keep message channel open for async response
  }

  if (message.type === "GET_CLIPS") {
    chrome.storage.local.get(["clips"], (result) => {
      sendResponse({ clips: result.clips || [] });
    });
    return true;
  }

  if (message.type === "OPEN_SIDE_PANEL") {
    chrome.sidePanel?.open?.({ tabId: sender.tab?.id });
    sendResponse({ success: true });
    return true;
  }
});
