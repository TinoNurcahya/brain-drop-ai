// BrainDrop AI — Extension Background Service Worker

// Enable side panel on extension icon click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});

// Context menu for clipping
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "braindrop-clip",
    title: "Clip to BrainDrop AI",
    contexts: ["selection"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "braindrop-clip" && info.selectionText) {
    const clip = {
      text: info.selectionText,
      sourceUrl: tab?.url || "",
      sourceTitle: tab?.title || "Untitled",
      timestamp: Date.now(),
    };

    // Save to local storage
    chrome.storage.local.get(["clips"], (result) => {
      const clips = result.clips || [];
      clips.unshift(clip);
      chrome.storage.local.set({ clips: clips.slice(0, 100) });
    });

    // TODO: Send to BrainDrop web app via API
    console.log("Clipped:", clip);
  }
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CLIP_TEXT") {
    const clip = {
      text: message.text,
      sourceUrl: message.sourceUrl,
      sourceTitle: message.sourceTitle,
      selectedHtml: message.selectedHtml,
      timestamp: Date.now(),
    };

    chrome.storage.local.get(["clips"], (result) => {
      const clips = result.clips || [];
      clips.unshift(clip);
      chrome.storage.local.set({ clips: clips.slice(0, 100) }, () => {
        sendResponse({ success: true, clip });
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
    chrome.sidePanel.open({ tabId: sender.tab?.id });
    sendResponse({ success: true });
  }
});
