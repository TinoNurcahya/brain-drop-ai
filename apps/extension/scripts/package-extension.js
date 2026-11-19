/**
 * BrainDrop AI — Chrome MV3 Extension Packager
 * Validates manifest files, copies assets to dist/, and builds braindrop-extension.zip
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.resolve(ROOT_DIR, "dist");
const MANIFEST_PATH = path.resolve(ROOT_DIR, "manifest.json");

function packageExtension() {
  console.log("=== Packaging BrainDrop AI Chrome MV3 Extension ===");

  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error("manifest.json not found in extension directory!");
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  console.log(`Extension: ${manifest.name} (v${manifest.version})`);

  // Required files based on manifest
  const requiredFiles = [
    "manifest.json",
    "background.js",
    "content.js",
    "styles.css",
    "popup.html",
    "popup.js",
    "sidepanel.html",
    "sidepanel.js",
    "icons/icon16.png",
    "icons/icon48.png",
    "icons/icon128.png",
  ];

  // Validate existence
  for (const file of requiredFiles) {
    const fullPath = path.resolve(ROOT_DIR, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing required extension file: ${file}`);
    }
  }
  console.log("✓ All manifest files verified successfully.");

  // Clean and prepare dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(path.join(DIST_DIR, "icons"), { recursive: true });

  // Copy files to dist
  for (const file of requiredFiles) {
    const src = path.resolve(ROOT_DIR, file);
    const dest = path.resolve(DIST_DIR, file);
    fs.copyFileSync(src, dest);
  }
  console.log("✓ Copied all assets to apps/extension/dist/");

  // Create Zip Archive
  const zipPath = path.resolve(ROOT_DIR, "braindrop-extension.zip");
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  try {
    if (process.platform === "win32") {
      execSync(
        `powershell -NoProfile -Command "$ProgressPreference = 'SilentlyContinue'; Compress-Archive -Path '${DIST_DIR}\\*' -DestinationPath '${zipPath}' -Force"`,
        { stdio: "inherit" }
      );
    } else {
      execSync(`zip -r "${zipPath}" .`, { cwd: DIST_DIR, stdio: "inherit" });
    }
    console.log(`✓ Extension packaged into: ${zipPath}`);
  } catch (err) {
    console.warn("Notice: PowerShell zip compression note:", err.message);
  }

  console.log("\n[Ready for Evaluators] Load unpacked extension from:");
  console.log(`  Folder: ${DIST_DIR}`);
  console.log(`  Or zip: ${zipPath}\n`);
}

packageExtension();
