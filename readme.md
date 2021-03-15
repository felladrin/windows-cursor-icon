# Windows Cursor Icon

Get the Windows cursor icon in different image formats.

## Install

```
npm i windows-cursor-icon
```

## Usage

```js
const { getCursorIcon, ImageFormat } = require("windows-cursor-icon");

const cursorIcon = getCursorIcon({ imageFormat: ImageFormat.Png });

console.log(cursorIcon);
// Prints:
// {
//   hasChanged: true,
//   isHidden: false, 
//   id: 65541,
//   buffer: <Buffer 89 50 4e 47 0d  04 ...>,       
//   imageFormat: 'Png',
//   xHotspot: 8,
//   yHotspot: 9
// }

// The icon is in buffer, so it can be saved to a file, for example:
require("fs").writeFileSync("cursorIcon.png", cursorIcon.buffer);
```

Check [more examples here](./examples)!