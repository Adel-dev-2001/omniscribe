import { ExportConfig, ProcessedImage } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Downloads a blob as a file in the user's browser
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

/**
 * Merges extracted images into a cleanly formatted, academic-grade Plain Text document.
 */
export function generateMergedPlainText(
  images: ProcessedImage[],
  config: ExportConfig
): string {
  const completedImages = images.filter((img) => img.status === 'completed');
  const now = new Date().toLocaleString();

  let output = '';

  // Header Banner
  output += `================================================================================\n`;
  output += `  ${config.documentTitle.toUpperCase()}\n`;
  output += `  Generated via OmniScribe (Multimodal Vision OCR Engine)\n`;
  output += `================================================================================\n`;
  output += `Date of Generation : ${now}\n`;
  output += `Total Images In Batch: ${completedImages.length}\n`;

  if (config.includeStats) {
    const totalChars = completedImages.reduce((acc, img) => acc + (img.stats?.charCount || 0), 0);
    const totalWords = completedImages.reduce((acc, img) => acc + (img.stats?.wordCount || 0), 0);
    const totalEmojis = completedImages.reduce((acc, img) => acc + (img.stats?.emojiCount || 0), 0);
    output += `Batch Statistics    : ${totalWords.toLocaleString()} Words | ${totalChars.toLocaleString()} Chars | ${totalEmojis.toLocaleString()} Emojis\n`;
  }
  output += `================================================================================\n\n`;

  // Itemized Content
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
 * Merges extracted images into a Markdown document.
 */
export function generateMergedMarkdown(
  images: ProcessedImage[],
  config: ExportConfig
): string {
  const completedImages = images.filter((img) => img.status === 'completed');
  const now = new Date().toLocaleString();

  let md = `# ${config.documentTitle}\n\n`;
  md += `> **Generated with OmniScribe** • *Multimodal Vision OCR Engine*\n\n`;
  md += `- **Date:** \`${now}\`\n`;
  md += `- **Total Processed Items:** \`${completedImages.length}\`\n\n`;

  if (config.includeStats) {
    const totalChars = completedImages.reduce((acc, img) => acc + (img.stats?.charCount || 0), 0);
    const totalWords = completedImages.reduce((acc, img) => acc + (img.stats?.wordCount || 0), 0);
    const totalEmojis = completedImages.reduce((acc, img) => acc + (img.stats?.emojiCount || 0), 0);

    md += `| Metric | Count |\n`;
    md += `| :--- | :--- |\n`;
    md += `| Total Words | **${totalWords.toLocaleString()}** |\n`;
    md += `| Total Characters | **${totalChars.toLocaleString()}** |\n`;
    md += `| Total Emojis Extracted | **${totalEmojis.toLocaleString()}** |\n\n`;
  }

  md += `## Table of Contents\n\n`;
  completedImages.forEach((img, i) => {
    md += `${i + 1}. [Image: ${img.name}](#image-${i + 1})\n`;
  });
  md += `\n---\n\n`;

  completedImages.forEach((img, i) => {
    md += `### Image ${i + 1}: \`${img.name}\` {#image-${i + 1}}\n\n`;

    if (config.includeMetadata) {
      md += `*File: ${img.mimeType}, ${(img.size / 1024).toFixed(1)} KB | Processed in ${((img.stats?.processingTimeMs || 0) / 1000).toFixed(2)}s*\n\n`;
    }

    md += `\`\`\`text\n`;
    md += img.extractedText ? img.extractedText.trim() : '[No text detected]';
    md += `\n\`\`\`\n\n`;
    md += `---\n\n`;
  });

  return md;
}

/**
 * Generates structured JSON dataset for academic / research reproducibility.
 */
export function generateMergedJSON(
  images: ProcessedImage[],
  config: ExportConfig
): string {
  const completedImages = images.filter((img) => img.status === 'completed');
  const payload = {
    metadata: {
      title: config.documentTitle,
      author: config.authorName,
      generatedAt: new Date().toISOString(),
      engine: 'OmniScribe (Gemini Vision Multimodal API)',
      totalCount: completedImages.length,
      aggregateStats: {
        totalChars: completedImages.reduce((acc, img) => acc + (img.stats?.charCount || 0), 0),
        totalWords: completedImages.reduce((acc, img) => acc + (img.stats?.wordCount || 0), 0),
        totalEmojis: completedImages.reduce((acc, img) => acc + (img.stats?.emojiCount || 0), 0)
      }
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
 * Generates an ultra-crisp, high-fidelity printable HTML document
 * ready for browser print-to-PDF with complete multi-language Unicode
 * glyph rendering (Full Arabic RTL, Cyrillic Russian, and color Emojis).
 */
export function generatePrintableHtmlDocument(
  images: ProcessedImage[],
  config: ExportConfig
): string {
  const completedImages = images.filter((img) => img.status === 'completed');
  const totalChars = completedImages.reduce((acc, img) => acc + (img.stats?.charCount || 0), 0);
  const totalWords = completedImages.reduce((acc, img) => acc + (img.stats?.wordCount || 0), 0);
  const totalEmojis = completedImages.reduce((acc, img) => acc + (img.stats?.emojiCount || 0), 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${config.documentTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 1.5cm;
    }
    body {
      font-family: 'Inter', 'Cairo', system-ui, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      margin: 0;
      padding: 24px;
      background-color: #ffffff;
    }
    .header-banner {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header-title {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    .header-sub {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 30px;
    }
    .stat-box {
      text-align: center;
    }
    .stat-val {
      font-size: 20px;
      font-weight: 700;
      color: #0284c7;
    }
    .stat-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .image-section {
      page-break-inside: avoid;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 24px;
      overflow: hidden;
    }
    .image-header {
      background-color: #f1f5f9;
      padding: 10px 16px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }
    .image-meta {
      font-weight: 400;
      color: #64748b;
      font-size: 12px;
    }
    .text-content {
      padding: 16px;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: 'JetBrains Mono', 'Cairo', monospace;
      font-size: 13px;
      line-height: 1.7;
      color: #0f172a;
    }
    .print-btn-bar {
      margin-bottom: 20px;
      text-align: right;
    }
    .btn {
      background-color: #0284c7;
      color: white;
      border: none;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
    }
    @media print {
      .print-btn-bar { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-btn-bar">
    <button class="btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  
  <div class="header-banner">
    <h1 class="header-title">${config.documentTitle}</h1>
    <p class="header-sub">Generated by OmniScribe • Multimodal Neural OCR & Unicode Extractor • ${new Date().toLocaleString()}</p>
  </div>

  ${
    config.includeStats
      ? `<div class="stats-grid">
          <div class="stat-box">
            <div class="stat-val">${completedImages.length}</div>
            <div class="stat-label">Images Processed</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">${totalWords.toLocaleString()}</div>
            <div class="stat-label">Total Words</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">${totalChars.toLocaleString()}</div>
            <div class="stat-label">Total Characters</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">${totalEmojis.toLocaleString()}</div>
            <div class="stat-label">Emojis Captured</div>
          </div>
        </div>`
      : ''
  }

  ${completedImages
    .map(
      (img, i) => `
    <div class="image-section">
      <div class="image-header">
        <span>Image ${i + 1}: ${img.name}</span>
        ${
          config.includeMetadata
            ? `<span class="image-meta">${(img.size / 1024).toFixed(1)} KB | ${img.stats?.wordCount || 0} words | ${img.stats?.emojiCount || 0} emojis</span>`
            : ''
        }
      </div>
      <div class="text-content">${img.extractedText ? escapeHtml(img.extractedText) : '<em>[No text detected]</em>'}</div>
    </div>
  `
    )
    .join('')}

  <script>
    // Auto-open print dialog if requested
    if (window.location.search.includes('autoprint=true')) {
      window.addEventListener('load', () => window.print());
    }
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders an HTML element onto high-resolution A4 PDF pages with full Unicode
 * support (Arabic cursive RTL, Cyrillic Russian, and color Emojis).
 */
export async function saveHtmlElementAsPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  // Ensure web fonts (Cairo, Inter) are loaded before capturing
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // ignore font loading error
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

  // Exact A4 height in canvas pixels based on standard 210mm x 297mm ratio
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
        0, renderedHeightPx, canvasWidth, currentSliceHeightPx,
        0, 0, canvasWidth, currentSliceHeightPx
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

    renderedHeightPx += pageHeightInCanvasPx;
    pageIndex++;
  }

  pdf.save(filename);
}

/**
 * Exports a single extracted image to PDF with full Arabic RTL, Cyrillic, and Emoji support.
 */
export async function exportSingleImageAsPdf(
  image: ProcessedImage,
  customText?: string
): Promise<void> {
  const textToRender = (customText !== undefined ? customText : image.extractedText) || 'No text extracted';
  const timestamp = new Date().toISOString().slice(0, 10);
  const baseName = image.name.replace(/\.[^/.]+$/, '');

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.minHeight = '1123px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Cairo', 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
  container.style.padding = '44px 48px';
  container.style.boxSizing = 'border-box';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';
  container.style.zIndex = '-9999';

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
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; white-space: pre-wrap; word-break: break-word; font-family: 'Cairo', 'Inter', 'Segoe UI', -apple-system, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; font-size: 13.5px; line-height: 1.8; color: #1e293b; unicode-bidi: plaintext; direction: auto; text-align: start;">${escapeHtml(textToRender)}</div>
    </div>
    <div style="margin-top: 32px; padding-top: 14px; border-top: 1px solid #f1f5f9; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between;">
      <span>Generated by OmniScribe Multimodal Vision Engine</span>
      <span>100% Unicode Arabic, Cyrillic & Emoji Preservation</span>
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
export async function exportConsolidatedPdf(
  images: ProcessedImage[],
  config: ExportConfig
): Promise<void> {
  const completedImages = images.filter((img) => img.status === 'completed');
  const timestamp = new Date().toISOString().slice(0, 10);
  const baseName = config.documentTitle.toLowerCase().replace(/[^a-z0-9]/gi, '_');

  const totalChars = completedImages.reduce((acc, img) => acc + (img.stats?.charCount || 0), 0);
  const totalWords = completedImages.reduce((acc, img) => acc + (img.stats?.wordCount || 0), 0);
  const totalEmojis = completedImages.reduce((acc, img) => acc + (img.stats?.emojiCount || 0), 0);

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.minHeight = '1123px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Cairo', 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
  container.style.padding = '44px 48px';
  container.style.boxSizing = 'border-box';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';
  container.style.zIndex = '-9999';

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
        <div style="padding: 18px; white-space: pre-wrap; word-break: break-word; font-family: 'Cairo', 'Inter', 'Segoe UI', -apple-system, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; font-size: 13px; line-height: 1.8; color: #0f172a; unicode-bidi: plaintext; direction: auto; text-align: start;">${escapeHtml(img.extractedText || 'No text extracted')}</div>
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
          Generated by OmniScribe • Date: ${timestamp} • Total Documents: ${completedImages.length}
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
      <span>OmniScribe Consolidated Document Intelligence</span>
      <span>100% Unicode Arabic, Cyrillic & Emoji Preservation</span>
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
  const baseName = config.documentTitle.toLowerCase().replace(/[^a-z0-9]/gi, '_');

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

