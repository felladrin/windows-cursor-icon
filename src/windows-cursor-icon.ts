import edge from "edge-js";

const getCursorIconViaDotNet = edge.func(`
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Runtime.InteropServices;

#r "System.Drawing.dll"
using System.Drawing;
using System.Drawing.Imaging;

public class Startup {
  Output output = new Output();

  public async Task<object> Invoke(dynamic input) {
    output.hasChanged = false;
    var cursorInfo = new CursorInfo();
    cursorInfo.cbSize = Marshal.SizeOf(cursorInfo);
    if (!GetCursorInfo(out cursorInfo)) return output;
    if ((cursorInfo.flags == 0) != output.isHidden) {
      output = new Output();
      output.isHidden = (cursorInfo.flags == 0);
      output.hasChanged = true;
      return output;
    }
    if (cursorInfo.hCursor == IntPtr.Zero) return output;
    if (cursorInfo.hCursor.ToInt32() == output.id) return output;
    var stream = new MemoryStream();
    var imageFormat = GetImageFormat(input.imageFormat);
    try {
      Icon.FromHandle(cursorInfo.hCursor).ToBitmap().Save(stream, imageFormat);
    } catch {
      return output;
    }
    var iconInfo = new IconInfo();
    if (!GetIconInfo(cursorInfo.hCursor, out iconInfo)) return output;
    DeleteObject(iconInfo.hbmColor);
    DeleteObject(iconInfo.hbmMask);
    output.id = cursorInfo.hCursor.ToInt32();
    output.buffer = stream.GetBuffer();
    output.imageFormat = imageFormat.ToString();
    output.xHotspot = iconInfo.xHotspot;
    output.yHotspot = iconInfo.yHotspot;
    output.hasChanged = true;
    return output;
  }

  static ImageFormat GetImageFormat(string extension)
  {
    ImageFormat result = ImageFormat.Png;
    PropertyInfo prop = typeof(ImageFormat).GetProperties().Where(p => p.Name.Equals(extension, StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault();
    if (prop != null) result = prop.GetValue(prop) as ImageFormat;
    return result;
  }

  struct Output {
    public bool hasChanged;
    public bool isHidden;
    public Int32 id;
    public byte[] buffer;
    public string imageFormat;
    public Int32 xHotspot;
    public Int32 yHotspot;
  }

  [StructLayout(LayoutKind.Sequential)]
  struct Point {
    public Int32 x;
    public Int32 y;
  }

  [StructLayout(LayoutKind.Sequential)]
  struct CursorInfo {
    public Int32 cbSize;
    public Int32 flags;
    public IntPtr hCursor;
    public Point ptScreenPos;
  }

  [StructLayout(LayoutKind.Sequential)]
  struct IconInfo {
    public bool fIcon;
    public Int32 xHotspot;
    public Int32 yHotspot;
    public IntPtr hbmMask;
    public IntPtr hbmColor;
  }

  [DllImport("user32.dll", EntryPoint = "GetCursorInfo")]
  static extern bool GetCursorInfo(out CursorInfo pci);

  [DllImport("user32.dll", EntryPoint = "GetIconInfo")]
  static extern bool GetIconInfo(IntPtr hIcon, out IconInfo piconinfo);

  [DllImport("gdi32.dll", EntryPoint = "DeleteObject")]
  static extern bool DeleteObject(IntPtr hObject);
}
`);

/**
 * Get the Windows cursor icon in different image formats.
 *
 * The function parameters are optional, and if no image format is
 * provided, the PNG format will be used, for being the most compact.
 */
export function getCursorIcon(parameters?: GetCursorIconParameters) {
  const payload = { imageFormat: parameters?.imageFormat ?? ImageFormat.Png };
  return getCursorIconViaDotNet(payload, true) as CursorIcon;
}

/**
 * Extern of .NET ImageFormat Class.
 * @see https://docs.microsoft.com/en-us/dotnet/api/system.drawing.imaging.imageformat
 */
export enum ImageFormat {
  /** The bitmap (BMP) image format. */
  Bmp = "Bmp",
  /** The enhanced metafile (EMF) image format. */
  Emf = "Emf",
  /** The Exchangeable Image File (Exif) format. */
  Exif = "Exif",
  /** The Graphics Interchange Format (GIF) image format. */
  Gif = "Gif",
  /** A Guid structure that represents the .NET ImageFormat object. */
  Guid = "Guid",
  /** The Windows icon image format. */
  Icon = "Icon",
  /** The Joint Photographic Experts Group (JPEG) image format. */
  Jpeg = "Jpeg",
  /** The format of a bitmap in memory. */
  MemoryBmp = "MemoryBmp",
  /** The W3C Portable Network Graphics (PNG) image format. */
  Png = "Png",
  /** The Tagged Image File Format (TIFF) image format. */
  Tiff = "Tiff",
  /** The Windows metafile (WMF) image format. */
  Wmf = "Wmf",
}

export interface GetCursorIconParameters {
  imageFormat?: ImageFormat;
}

export interface CursorIcon {
  /**
   * Indicates whether the buffer has changed since last time `getCursorIcon` was called.
   *
   * Use this info to skip handling the image if it has not changed.
   */
  hasChanged: boolean;

  /**
   * Indicates whether the cursor is hidden.
   *
   * If so, the `buffer` will be `null`, as there's no icon to get, and the `id` will be `0`.
   */
  isHidden: boolean;

  /**
   * A number that identifies the cursor icon. Same number means same data in buffer.
   *
   * If the cursor is hidden or there was some error when trying to get the icon,
   * the `id` will be `0`.
   */
  id: number;

  /**
   * The data representing the cursor icon in the image format requested.
   *
   * If the cursor is hidden or there was some error when trying to get the icon,
   * the `buffer` will be `null`.
   */
  buffer: Buffer | null;

  /**
   * The image format of the data in `buffer`.
   *
   * Use this info to decide how to handle the image.
   */
  imageFormat: string;

  /** The x-coordinate of a cursor's hot spot. */
  xHotspot: number;

  /** The y-coordinate of the cursor's hot spot. */
  yHotspot: number;
}
