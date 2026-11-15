import { ExportConfig, ProcessedImage } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Triggers a direct client-side file download in the user's browser.
 */
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function safeFileSlug(title: string | undefined): string {
  const slug = (title || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '');
  return slug || 'omniscribe_report';
}

function computeAggregateStats(images: ProcessedImage[]) {
  return images.reduce(
    (acc, img) => ({
      totalChars: acc.totalChars + (img.stats?.charCount || 0),
      totalWords: acc.totalWords + (img.stats?.wordCount || 0),
      totalEmojis: acc.totalEmojis + (img.stats?.emojiCount || 0)
    }),
    { totalChars: 0, totalWords: 0, totalEmojis: 0 }
  );
}

function createPdfPrintContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.minHeight = '1123px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily =
    "'Cairo', 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
  container.style.padding = '44px 48px';
  container.style.boxSizing = 'border-box';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';
  container.style.zIndex = '-9999';
  return container;
}

/**
 * Exports a single extracted text stream to a sanitized `.txt` download.
 */
export function exportSingleImageAsTxt(image: ProcessedImage, customText?: string): void {
  const textToExport = customText !== undefined ? customText : image.extractedText;
  const baseName = safeFileSlug(image.name.replace(/\.[^/.]+$/, ''));
  const blob = new Blob([textToExport || ''], { type: 'text/plain;charset=utf-8' });
  triggerDownload(blob, `${baseName}_extracted.txt`);
}

/**
 * Merges extracted images into a structured Plain Text document.
 */
export function generateMergedPlainText(
  images: ProcessedImage[],
  config: ExportConfig
): string {
  const completedImages = images.filter((img) => img.status === 'completed');
  const now = new Date().toLocaleString();
  const title = config.documentTitle?.trim() || 'OmniScribe Extraction Report';

  let output = '';

  output += `================================================================================\n`;
  output += `  ${title.toUpperCase()}\n`;
  output += `  Generated via OmniScribe (Multimodal Vision OCR Engine)\n`;
  output += `================================================================================\n`;
  if (config.authorName?.trim()) {
    output += `Author             : ${config.authorName.trim()}\n`;
  }
  output += `Date of Generation : ${now}\n`;
  output += `Total Images In Batch: ${completedImages.length}\n`;

  if (config.includeStats) {
    const { totalChars, totalWords, totalEmojis } = computeAggregateStats(completedImages);
    output += `Batch Statistics    : ${totalWords.toLocaleString()} Words | ${totalChars.toLocaleString()} Chars | ${totalEmojis.toLocaleString()} Emojis\n`;
  }
  output += `================================================================================\n\n`;

  completedImages.forEach((img, index) => {
    output += `--------------------------------------------------------------------------------\n`;
    output += `[IMAGE ${index + 1}/${completedImages.length}] - ${img.name}\n`;

    if (config.includeMetadata) {
      const sizeKB = (img.size / 1024).toFixed(1);
      const timeSec = ((img.stats?.processingTimeMs || 0) / 1000).toFixed(2);
      output += `File Details       : ${img.mimeType} | ${sizeKB} KB | Processed in ${timeSec}s\n`;
      if (config.includeStats && img.stats) {
        output += `Metrics            : ${img.stats.wordCount} Words | ${img.stats.charCount} Chars | ${img.stats.emojiCount} Emojis\n`;
      }
    }
    output += `--------------------------------------------------------------------------------\n\n`;

    output += img.extractedText ? img.extractedText.trim() : '[No text detected]';
    output += `\n\n\n`;
  });

  output += `================================================================================\n`;
  output += `  End of Consolidated Document\n`;
  output += `================================================================================\n`;

  return output;
}

/**
 * Merges extracted images into a structured Markdown document.
 */
export function generateMergedMarkdown(
  images: ProcessedImage[],
  config: ExportConfig
): string {
  const completedImages = images.filter((img) => img.status === 'completed');
  const now = new Date().toLocaleString();
  const title = config.documentTitle?.trim() || 'OmniScribe Extraction Report';

  let md = `# ${title}\n\n`;
  md += `> **Generated with OmniScribe** • *Multimodal Vision OCR Engine*\n\n`;
  if (config.authorName?.trim()) {
    md += `- **Author:** ${config.authorName.trim()}\n`;
  }
  md += `- **Date:** \`${now}\`\n`;
  md += `- **Total Processed Items:** \`${completedImages.length}\`\n\n`;

  if (config.includeStats) {
    const { totalChars, totalWords, totalEmojis } = computeAggregateStats(completedImages);

    md += `| Metric | Count |\n`;
    md += `| :--- | :--- |\n`;
    md += `| Total Words | **${totalWords.toLocaleString()}** |\n`;
    md += `| Total Characters | **${totalChars.toLocaleString()}** |\n`;
    md += `| Total Emojis Extracted | **${totalEmojis.toLocaleString()}** |\n\n`;
  }

  md += `## Table of Contents\n\n`;
  completedImages.forEach((img, i) => {
    const safeTocName = img.name.replace(/([[\]])/g, '\\$1');
    md += `${i + 1}. [Image: ${safeTocName}](#image-${i + 1})\n`;
  });
  md += `\n---\n\n`;

  completedImages.forEach((img, i) => {
    const body = img.extractedText ? img.extractedText.trim() : '[No text detected]';
    const backtickRuns = body.match(/`+/g) || [];
    const maxRun = backtickRuns.reduce((max, run) => Math.max(max, run.length), 0);
    const fence = '`'.repeat(Math.max(3, maxRun + 1));
    const safeHeadingName = img.name.replace(/`/g, "'");

    md += `<a id="image-${i + 1}"></a>\n\n`;
    md += `### Image ${i + 1}: \`${safeHeadingName}\`\n\n`;

    if (config.includeMetadata) {
      md += `*File: ${img.mimeType}, ${(img.size / 1024).toFixed(1)} KB | Processed in ${((img.stats?.processingTimeMs || 0) / 1000).toFixed(2)}s*\n\n`;
    }

    md += `${fence}text\n`;
    md += body;
    md += `\n${fence}\n\n`;
    md += `---\n\n`;
  });

  return md;
}

/**
 * Generates structured JSON dataset for academic and research reproducibility.
 */
export function generateMergedJSON(
  images: ProcessedImage[],
  config: ExportConfig
): string {
  const completedImages = images.filter((img) => img.status === 'completed');
  const payload = {
    metadata: {
      title: config.documentTitle?.trim() || 'OmniScribe Extraction Report',
      author: config.authorName,
      generatedAt: new Date().toISOString(),
      engine: 'OmniScribe (Gemini Vision Multimodal API)',
      totalCount: completedImages.length,
      aggregateStats: computeAggregateStats(completedImages)
    },
    items: completedImages.map((img, idx) => ({
      index: idx + 1,
      fileName: img.name,
      fileSize: img.size,
      mimeType: img.mimeType,
      processingTimeMs: img.stats?.processingTimeMs,
      metrics: img.stats,
      extractedContent: img.extractedText
    }))
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Renders an HTML element onto high-resolution A4 PDF pages with full Unicode
 * support (Arabic cursive RTL, Cyrillic Russian, and color Emojis).
 */
async function saveHtmlElementAsPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed if web font readiness check is unsupported
    }
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: 1200
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidthMm = 210;
  const pageHeightMm = 297;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const pageHeightInCanvasPx = Math.floor((canvasWidth * pageHeightMm) / pageWidthMm);

  let renderedHeightPx = 0;
  let pageIndex = 0;

  while (renderedHeightPx < canvasHeight) {
    if (pageIndex > 0) {
      pdf.addPage();
    }

    const currentSliceHeightPx = Math.min(pageHeightInCanvasPx, canvasHeight - renderedHeightPx);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvasWidth;
    pageCanvas.height = currentSliceHeightPx;
    const ctx = pageCanvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        renderedHeightPx,
        canvasWidth,
        currentSliceHeightPx,
        0,
        0,
        canvasWidth,
        currentSliceHeightPx
      );

      const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
      const sliceHeightMm = (currentSliceHeightPx * pageWidthMm) / canvasWidth;

      pdf.addImage(
        pageImgData,
        'JPEG',
        0,
        0,
        pageWidthMm,
        sliceHeightMm,
        undefined,
        'FAST'
      );
    }

    pageCanvas.width = 0;
    pageCanvas.height = 0;
    renderedHeightPx += pageHeightInCanvasPx;
    pageIndex++;
  }

  canvas.width = 0;
  canvas.height = 0;
  pdf.save(filename);
}

/**
 * Exports a single extracted image to PDF with full Arabic RTL, Cyrillic, and Emoji support.
 */
export async function exportSingleImageAsPdf(
  image: ProcessedImage,
  customText?: string
): Promise<void> {
  const textToRender =
    (customText !== undefined ? customText : image.extractedText) || 'No text extracted';
  const timestamp = new Date().toISOString().slice(0, 10);
  const baseName = safeFileSlug(image.name.replace(/\.[^/.]+$/, ''));

  const container = createPdfPrintContainer();

  container.innerHTML = `
    <div>
      <div style="border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; color: #0f172a; word-break: break-all;">
          ${escapeHtml(image.name)}
        </h1>
        <p style="margin: 0; font-size: 11px; color: #64748b; font-family: monospace;">
          OmniScribe • Date: ${timestamp} • Latency: ${((image.stats?.processingTimeMs || 0) / 1000).toFixed(2)}s • Words: ${image.stats?.wordCount || 0} • Chars: ${image.stats?.charCount || 0} • Emojis: ${image.stats?.emojiCount || 0}
        </p>
      </div>
      <div dir="auto" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; white-space: pre-wrap; word-break: break-word; font-family: 'Cairo', 'Inter', 'Segoe UI', -apple-system, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; font-size: 13.5px; line-height: 1.8; color: #1e293b; unicode-bidi: plaintext; text-align: start;">${escapeHtml(textToRender)}</div>
    </div>
    <div style="margin-top: 32px; padding-top: 14px; border-top: 1px solid #f1f5f9; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between;">
      <span>Generated by OmniScribe Multimodal Vision Engine</span>
      <span>Unicode Arabic, Cyrillic &amp; Emoji PDF Rendering</span>
    </div>
  `;

  document.body.appendChild(container);

  try {
    await saveHtmlElementAsPdf(container, `${baseName}_extracted.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Exports consolidated batch images to PDF with full Arabic RTL, Cyrillic, and Emoji support.
 */
async function exportConsolidatedPdf(
  images: ProcessedImage[],
  config: ExportConfig
): Promise<void> {
  const completedImages = images.filter((img) => img.status === 'completed');
  const timestamp = new Date().toISOString().slice(0, 10);
  const baseName = safeFileSlug(config.documentTitle);
  const { totalChars, totalWords, totalEmojis } = computeAggregateStats(completedImages);

  const container = createPdfPrintContainer();

  let sectionsHtml = '';
  completedImages.forEach((img, idx) => {
    const sizeKB = (img.size / 1024).toFixed(1);
    const timeSec = ((img.stats?.processingTimeMs || 0) / 1000).toFixed(2);
    sectionsHtml += `
      <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #f1f5f9; padding: 10px 16px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 700; color: #334155;">
          <span>[${idx + 1}/${completedImages.length}] ${escapeHtml(img.name)}</span>
          <span style="font-weight: 400; color: #64748b; font-size: 11px;">
            ${sizeKB} KB • ${timeSec}s • ${img.stats?.wordCount || 0} words • ${img.stats?.emojiCount || 0} emojis
          </span>
        </div>
        <div dir="auto" style="padding: 18px; white-space: pre-wrap; word-break: break-word; font-family: 'Cairo', 'Inter', 'Segoe UI', -apple-system, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; font-size: 13px; line-height: 1.8; color: #0f172a; unicode-bidi: plaintext; text-align: start;">${escapeHtml(img.extractedText || 'No text extracted')}</div>
      </div>
    `;
  });

  container.innerHTML = `
    <div>
      <div style="border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #0f172a;">
          ${escapeHtml(config.documentTitle || 'OmniScribe Extraction Report')}
        </h1>
        <p style="margin: 0; font-size: 11px; color: #64748b;">
          Generated by OmniScribe${config.authorName?.trim() ? ` • Author: ${escapeHtml(config.authorName.trim())}` : ''} • Date: ${timestamp} • Total Documents: ${completedImages.length}
        </p>
      </div>

      ${
        config.includeStats
          ? `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 24px; text-align: center;">
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #0284c7;">${completedImages.length}</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Documents</div>
          </div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #0284c7;">${totalWords.toLocaleString()}</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Words</div>
          </div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #0284c7;">${totalChars.toLocaleString()}</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Characters</div>
          </div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #0284c7;">${totalEmojis.toLocaleString()}</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Emojis</div>
          </div>
        </div>
        `
          : ''
      }

      ${sectionsHtml}
    </div>

    <div style="margin-top: 32px; padding-top: 14px; border-top: 1px solid #f1f5f9; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between;">
      <span>OmniScribe Consolidated Export</span>
      <span>Unicode Arabic, Cyrillic &amp; Emoji PDF Rendering</span>
    </div>
  `;

  document.body.appendChild(container);

  try {
    await saveHtmlElementAsPdf(container, `${baseName}_${timestamp}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Master Export Orchestrator
 */
export async function exportExtractedData(
  images: ProcessedImage[],
  config: ExportConfig
): Promise<void> {
  const timestamp = new Date().toISOString().slice(0, 10);
  const baseName = safeFileSlug(config.documentTitle);

  if (config.format === 'txt') {
    const content = generateMergedPlainText(images, config);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    triggerDownload(blob, `${baseName}_${timestamp}.txt`);
  } else if (config.format === 'md') {
    const content = generateMergedMarkdown(images, config);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    triggerDownload(blob, `${baseName}_${timestamp}.md`);
  } else if (config.format === 'json') {
    const content = generateMergedJSON(images, config);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    triggerDownload(blob, `${baseName}_${timestamp}.json`);
  } else if (config.format === 'pdf') {
    await exportConsolidatedPdf(images, config);
  }
}
