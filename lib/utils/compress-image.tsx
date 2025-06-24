import sharp from "sharp";

export const compressImage = async (
  arrayBuffer: ArrayBuffer,
  {
    format,
    width,
    height,
    maxSizeMB,
  }: {
    format: "jpeg" | "png";
    width: number;
    height: number;
    maxSizeMB: number;
  }
): Promise<Buffer> => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  let quality = format === "jpeg" ? 100 : 80;
  let buffer: Buffer;

  do {
    const image = sharp(Buffer.from(arrayBuffer)).resize(width, height);
    buffer =
      format === "jpeg"
        ? await image.jpeg({ quality }).toBuffer()
        : await image
            .png({ compressionLevel: Math.round((100 - quality) / 10) })
            .toBuffer();
    quality -= 10;
  } while (buffer.length > maxBytes && quality >= 10);

  return buffer;
};
