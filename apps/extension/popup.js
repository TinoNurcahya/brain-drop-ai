// BrainDrop AI — Popup Script

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save-btn");
  const panelBtn = document.getElementById("panel-btn");
  const textarea = document.querySelector(".quick-clip");
  const clipCount = document.getElementById("clip-count");
  const noteCount = document.getElementById("note-count");

  // Load stats
  chrome.storage.local.get(["clips"], (result) => {
    const clips = result.clips || [];
    const today = new Date().toDateString();
    const todayClips = clips.filter(
      (c) => new Date(c.timestamp).toDateString() === today
    );
    clipCount.textContent = todayClips.length;
    noteCount.textContent = clips.length;
  });

  // Save quick note
  saveBtn.addEventListener("click", () => {
    const text = textarea.value.trim();
    if (!text) return;

    chrome.runtime.sendMessage(
      {
        type: "CLIP_TEXT",
        text,
        sourceUrl: "",
        sourceTitle: "Quick Note",
      },
      (response) => {
        if (response?.success) {
          textarea.value = "";
          saveBtn.textContent = "✅ Saved!";
          setTimeout(() => {
            saveBtn.textContent = "💾 Save to BrainDrop";
          }, 1500);

          // Update count
          const current = parseInt(clipCount.textContent) || 0;
          clipCount.textContent = current + 1;
          noteCount.textContent = parseInt(noteCount.textContent) + 1;
        }
      }
    );
  });

  // Open side panel
  panelBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "OPEN_SIDE_PANEL" });
  });
});
