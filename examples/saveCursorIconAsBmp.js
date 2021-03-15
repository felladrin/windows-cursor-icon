const { getCursorIcon, ImageFormat } = require("../dist/windows-cursor-icon");
const { writeFileSync } = require("fs");

const cursorIcon = getCursorIcon({ imageFormat: ImageFormat.Bmp });

writeFileSync("cursorIcon.bmp", cursorIcon.buffer);
console.log("Cursor icon saved as cursorIcon.bmp");

