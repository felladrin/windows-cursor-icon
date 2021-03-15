const { getCursorIcon } = require("../dist/windows-cursor-icon");

const cursorIcon = getCursorIcon();

if (!cursorIcon.buffer) {
  console.error("Failed to get the cursor icon.");
  process.exit(1);
}

const base64 = cursorIcon.buffer.toString("base64");

console.log(base64);