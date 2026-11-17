// BrainDrop AI — Side Panel Script

const container = document.getElementById("clips-container");
const searchInput = document.getElementById("search");

function formatTime(timestamp) {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function renderClips(clips) {
  if (!clips || clips.length === 0) {
    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">📎</div>
        <p>No clips yet.</p>
        <p style="margin-top: 4px;">Select text on any page and click "Clip to BrainDrop".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = clips
    .map(
      (clip) => `
    <div class="clip">
      <div class="clip-source">${clip.sourceTitle || clip.sourceUrl || "Quick Note"}</div>
      <div class="clip-text">${clip.text}</div>
      <div class="clip-meta">
        <span>${formatTime(clip.timestamp)}</span>
        <span>${clip.text.split(/\s+/).length} words</span>
      </div>
    </div>
  `
    )
    .join("");
}

function loadClips(filter = "") {
  chrome.runtime.sendMessage({ type: "GET_CLIPS" }, (response) => {
    let clips = response?.clips || [];
    if (filter) {
      clips = clips.filter(
        (c) =>
          c.text.toLowerCase().includes(filter.toLowerCase()) ||
          (c.sourceTitle || "").toLowerCase().includes(filter.toLowerCase())
      );
    }
    renderClips(clips);
  });
}

// Initial load
loadClips();

// Search
searchInput.addEventListener("input", (e) => {
  loadClips(e.target.value);
});

// Refresh when storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.clips) {
    loadClips(searchInput.value);
  }
});
