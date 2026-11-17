// BrainDrop AI — Content Script
// Adds a floating "Clip to BrainDrop" button when text is selected

let clipButton = null;

function createClipButton() {
  if (clipButton) return clipButton;

  clipButton = document.createElement("div");
  clipButton.id = "braindrop-clip-button";
  clipButton.innerHTML = "🧠 Clip";
  clipButton.style.cssText = `
    position: absolute;
    z-index: 999999;
    display: none;
    padding: 6px 14px;
    border-radius: 8px;
    background: linear-gradient(135deg, #4f8ff7, #8b5cf6);
    color: white;
    font-size: 13px;
    font-weight: 600;
    font-family: system-ui, -apple-system, sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(79, 143, 247, 0.4);
    transition: transform 0.15s ease, opacity 0.15s ease;
    user-select: none;
  `;

  clipButton.addEventListener("click", handleClip);
  clipButton.addEventListener("mouseenter", () => {
    clipButton.style.transform = "scale(1.05)";
  });
  clipButton.addEventListener("mouseleave", () => {
    clipButton.style.transform = "scale(1)";
  });

  document.body.appendChild(clipButton);
  return clipButton;
}

function handleClip() {
  const selection = window.getSelection();
  const text = selection?.toString().trim();

  if (!text) return;

  // Get selected HTML
  let selectedHtml = "";
  try {
    const range = selection.getRangeAt(0);
    const div = document.createElement("div");
    div.appendChild(range.cloneContents());
    selectedHtml = div.innerHTML;
  } catch {}

  // Send to background
  chrome.runtime.sendMessage(
    {
      type: "CLIP_TEXT",
      text,
      selectedHtml,
      sourceUrl: window.location.href,
      sourceTitle: document.title,
    },
    (response) => {
      if (response?.success) {
        showNotification("✅ Clipped to BrainDrop!");
      }
    }
  );

  hideClipButton();
}

function showNotification(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    padding: 12px 20px;
    border-radius: 12px;
    background: rgba(10, 10, 15, 0.95);
    color: #f0f0ff;
    font-size: 14px;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: 0 4px 24px rgba(0,0,0,0.5);
    border: 1px solid rgba(79, 143, 247, 0.3);
    animation: braindrop-fade-in 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function showClipButton(x, y) {
  const button = createClipButton();
  button.style.left = `${x}px`;
  button.style.top = `${y - 40}px`;
  button.style.display = "block";
  button.style.opacity = "1";
}

function hideClipButton() {
  if (clipButton) {
    clipButton.style.display = "none";
  }
}

// Listen for text selection
document.addEventListener("mouseup", (e) => {
  // Ignore clicks on our own button
  if (e.target === clipButton) return;

  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 5) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      showClipButton(
        rect.left + window.scrollX + rect.width / 2 - 40,
        rect.top + window.scrollY
      );
    } else {
      hideClipButton();
    }
  }, 10);
});

// Hide on scroll or click elsewhere
document.addEventListener("mousedown", (e) => {
  if (e.target !== clipButton) hideClipButton();
});
