/**
 * Client-Side HTML5 Canvas Image Pre-Processing Utility
 * Normalizes high-resolution images (>1280px) into optimized JPEG payloads
 * to minimize network transmission latency while preserving character edge sharpness.
 */
export async function optimizeImageForOcr(
  base64DataUrl: string,
  maxDimension = 1280
): Promise<{ base64: string; mimeType: string }> {
  const detectedMime =
    base64DataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/)?.[1] || 'image/jpeg';

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;
      if (!width || !height) {
        resolve({ base64: base64DataUrl, mimeType: detectedMime });
        return;
      }

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ base64: base64DataUrl, mimeType: detectedMime });
        return;
      }

      // Render white backing behind transparent PNG regions to preserve glyph contrast
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      canvas.width = 0;
      canvas.height = 0;

      resolve({
        base64: optimizedDataUrl,
        mimeType: 'image/jpeg'
      });
    };
    img.onerror = () => resolve({ base64: base64DataUrl, mimeType: detectedMime });
    img.src = base64DataUrl;
  });
}
