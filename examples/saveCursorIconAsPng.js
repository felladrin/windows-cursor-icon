const { getCursorIcon } = require("../dist/windows-cursor-icon");
const { writeFileSync } = require("fs");

const cursorIcon = getCursorIcon();

writeFileSync("cursorIcon.png", cursorIcon.buffer);
console.log("Cursor icon saved as cursorIcon.png");
