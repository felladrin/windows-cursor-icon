const { getCursorIcon, ImageFormat } = require("../dist/windows-cursor-icon");
const { writeFileSync } = require("fs");

const cursorIcon = getCursorIcon({ imageFormat: ImageFormat.Jpeg });

writeFileSync("cursorIcon.jpg", cursorIcon.buffer);
console.log("Cursor icon saved as cursorIcon.jpg");
