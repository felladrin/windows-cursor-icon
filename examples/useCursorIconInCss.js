const { getCursorIcon } = require("../dist/windows-cursor-icon");
const { writeFileSync } = require("fs");

const cursorIcon = getCursorIcon();

if (!cursorIcon.buffer) {
  console.error("Failed to get the cursor icon.");
  process.exit(1);
}

const iconsAsBase64 = cursorIcon.buffer.toString("base64");

const cursorStyle = `url(data:image/${cursorIcon.imageFormat.toLowerCase()};base64,${iconsAsBase64}) ${
  cursorIcon.xHotspot
} ${cursorIcon.yHotspot}`;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Cursor Icon In CSS</title>
    <style>
      html,
      body {
        width: 100%;
        height: 100%;
        cursor: ${cursorStyle}, auto;
      }
    </style>
  </head>
  <body>
    <p>How does your cursor look like? ;)</p>
  </body>
</html>
`;

writeFileSync("cursorIcon.html", html);
console.log("Successfully created cursorIcon.html");
