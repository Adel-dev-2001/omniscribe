import { ProcessedImage } from '../types';

/**
 * Generates lightweight, high-contrast SVG data URLs representing real-world OCR challenge documents:
 * 1. Tech Developer Screenshot (Code + Unicode Emojis)
 * 2. Multilingual Academic Diploma (English + Russian Cyrillic + Arabic)
 * 3. Structured Data Invoice (Table + Financial Glyphs + Emojis)
 */

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

const SAMPLE_1_CODE_EMOJIS = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="#0D1117">
  <!-- macOS Window Controls -->
  <circle cx="30" cy="30" r="7" fill="#FF5F56"/>
  <circle cx="50" cy="30" r="7" fill="#FFBD2E"/>
  <circle cx="70" cy="30" r="7" fill="#27C93F"/>
  <text x="400" y="35" fill="#8B949E" font-family="monospace" font-size="14" text-anchor="middle">neural_vision_kernel.ts 🚀</text>
  <line x1="0" y1="55" x2="800" y2="55" stroke="#30363D" stroke-width="1"/>

  <!-- Code Snippet -->
  <text x="30" y="100" fill="#7EE787" font-family="monospace" font-size="16">// 🌟 OmniScribe: High-Performance Vision Pipeline</text>
  <text x="30" y="140" fill="#FF7B72" font-family="monospace" font-size="16">import { <tspan fill="#FFA657">MultimodalModel</tspan> } from <tspan fill="#A5D6FF">"@google/gemini-3.8"</tspan>; ⚡</text>
  
  <text x="30" y="190" fill="#FF7B72" font-family="monospace" font-size="16">export async function <tspan fill="#D2A8FF">extractSemanticGlyphs</tspan>(image: <tspan fill="#FFA657">Buffer</tspan>): <tspan fill="#FFA657">Promise</tspan>&lt;<tspan fill="#FFA657">OCRResult</tspan>&gt; {</text>
  <text x="60" y="230" fill="#79C0FF" font-family="monospace" font-size="15">  const model = await discoverLatestEndpoint(); // Auto-binds latest AI 🧠</text>
  <text x="60" y="270" fill="#79C0FF" font-family="monospace" font-size="15">  const response = await model.generateVisionContent(image); 🔥</text>
  <text x="60" y="310" fill="#FF7B72" font-family="monospace" font-size="15">  return {</text>
  <text x="90" y="350" fill="#E6EDF3" font-family="monospace" font-size="15">    tokens: response.tokens,    // All text transcribed 100% 📝</text>
  <text x="90" y="390" fill="#E6EDF3" font-family="monospace" font-size="15">    emojis: ["🚀", "⚡", "🔥", "🧠", "✨", "💻", "🇷🇺", "🇸🇦"],</text>
  <text x="90" y="430" fill="#E6EDF3" font-family="monospace" font-size="15">    accuracy: 0.9998           // Verified fidelity ✅</text>
  <text x="60" y="465" fill="#FF7B72" font-family="monospace" font-size="15">  };</text>
  <text x="30" y="490" fill="#FF7B72" font-family="monospace" font-size="16">}</text>
</svg>
`);

const SAMPLE_2_MULTILINGUAL = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="#F8FAFC">
  <!-- Certificate Border -->
  <rect x="20" y="20" width="760" height="460" rx="16" fill="#FFFFFF" stroke="#0284C7" stroke-width="3"/>
  <rect x="30" y="30" width="740" height="440" rx="12" fill="none" stroke="#BAE6FD" stroke-width="1.5" stroke-dasharray="6,6"/>

  <!-- Seal / Emblem -->
  <circle cx="400" cy="90" r="36" fill="#0369A1"/>
  <text x="400" y="98" fill="#FFFFFF" font-family="sans-serif" font-size="24" text-anchor="middle" font-weight="bold">🎓</text>

  <!-- Russian University / Scholarship Heading -->
  <text x="400" y="160" fill="#0F172A" font-family="sans-serif" font-size="20" text-anchor="middle" font-weight="bold">РОССИЙСКАЯ АКАДЕМИЧЕСКАЯ СТИПЕНДИЯ 2026/2027</text>
  <text x="400" y="190" fill="#475569" font-family="sans-serif" font-size="14" text-anchor="middle">Отделение компьютерных наук и искусственного интеллекта (ВШЭ / МФТИ)</text>

  <!-- English Description -->
  <text x="400" y="235" fill="#1E293B" font-family="sans-serif" font-size="15" text-anchor="middle" font-weight="600">Candidate Portfolio Verification: Adel (Computer Science Department)</text>
  <text x="400" y="260" fill="#64748b" font-family="sans-serif" font-size="13" text-anchor="middle">Demonstrating Autonomous Multimodal OCR, Unicode Synthesis &amp; Dynamic API Longevity</text>

  <!-- Arabic Calligraphic / Formal Text -->
  <text x="400" y="315" fill="#0369A1" font-family="sans-serif" font-size="18" text-anchor="middle" font-weight="bold">منحة الحكومة الروسية للدراسات العليا في الذكاء الاصطناعي 🏛️</text>
  <text x="400" y="345" fill="#334155" font-family="sans-serif" font-size="14" text-anchor="middle">مشروع استخراج النصوص وتحليل الرموز التعبيرية بدون أي فقدان لغوي 🌟</text>

  <!-- Signature Bar -->
  <line x1="150" y1="410" x2="330" y2="410" stroke="#94A3B8" stroke-width="1.5"/>
  <text x="240" y="430" fill="#64748B" font-family="sans-serif" font-size="11" text-anchor="middle">Admissions Committee (Москва, РФ)</text>

  <line x1="470" y1="410" x2="650" y2="410" stroke="#94A3B8" stroke-width="1.5"/>
  <text x="560" y="430" fill="#64748B" font-family="sans-serif" font-size="11" text-anchor="middle">Research Verification Code: #RU-CS-2026-AI</text>
</svg>
`);

const SAMPLE_3_STRUCTURED_TABLE = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="#0B132B">
  <!-- Invoice Header -->
  <text x="40" y="55" fill="#48CAE4" font-family="sans-serif" font-size="22" font-weight="bold">FINANCIAL AUDIT REPORT 📊</text>
  <text x="760" y="55" fill="#90E0EF" font-family="monospace" font-size="14" text-anchor="end">INVOICE: #INV-9821-AI 💳</text>
  <text x="40" y="80" fill="#ADB5BD" font-family="sans-serif" font-size="12">Issued Date: 2026-11-08 • Client: Autonomous Lab Inc. 🏢</text>
  
  <!-- Table Header -->
  <rect x="40" y="110" width="720" height="36" rx="6" fill="#1C2541"/>
  <text x="60" y="133" fill="#CAF0F8" font-family="sans-serif" font-size="13" font-weight="bold">Item Description 📦</text>
  <text x="420" y="133" fill="#CAF0F8" font-family="sans-serif" font-size="13" font-weight="bold">Category 🏷️</text>
  <text x="560" y="133" fill="#CAF0F8" font-family="sans-serif" font-size="13" font-weight="bold">Qty 🔢</text>
  <text x="730" y="133" fill="#CAF0F8" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="end">Subtotal 💰</text>

  <!-- Row 1 -->
  <text x="60" y="180" fill="#FFFFFF" font-family="sans-serif" font-size="13">High-Resolution GPU Compute Cluster 🖥️</text>
  <text x="420" y="180" fill="#90E0EF" font-family="sans-serif" font-size="13">Hardware</text>
  <text x="560" y="180" fill="#FFFFFF" font-family="monospace" font-size="13">4 units</text>
  <text x="730" y="180" fill="#48CAE4" font-family="monospace" font-size="13" font-weight="bold" text-anchor="end">$4,800.00</text>
  <line x1="40" y1="205" x2="760" y2="205" stroke="#3A506B" stroke-width="0.8"/>

  <!-- Row 2 -->
  <text x="60" y="240" fill="#FFFFFF" font-family="sans-serif" font-size="13">Multimodal OCR Vision License (Gemini 2.5 Flash) ⚡</text>
  <text x="420" y="240" fill="#90E0EF" font-family="sans-serif" font-size="13">Software API</text>
  <text x="560" y="240" fill="#FFFFFF" font-family="monospace" font-size="13">1 year</text>
  <text x="730" y="240" fill="#48CAE4" font-family="monospace" font-size="13" font-weight="bold" text-anchor="end">$0.00 (Free Tier)</text>
  <line x1="40" y1="265" x2="760" y2="265" stroke="#3A506B" stroke-width="0.8"/>

  <!-- Row 3 -->
  <text x="60" y="300" fill="#FFFFFF" font-family="sans-serif" font-size="13">Unicode Tokenizer &amp; Emoji Decoder Suite 🦄</text>
  <text x="420" y="300" fill="#90E0EF" font-family="sans-serif" font-size="13">Library</text>
  <text x="560" y="300" fill="#FFFFFF" font-family="monospace" font-size="13">Enterprise</text>
  <text x="730" y="300" fill="#48CAE4" font-family="monospace" font-size="13" font-weight="bold" text-anchor="end">$1,250.00</text>
  <line x1="40" y1="325" x2="760" y2="325" stroke="#3A506B" stroke-width="0.8"/>

  <!-- Totals Box -->
  <rect x="480" y="360" width="280" height="90" rx="10" fill="#1C2541" stroke="#48CAE4" stroke-width="1"/>
  <text x="500" y="390" fill="#ADB5BD" font-family="sans-serif" font-size="13">Total Net:</text>
  <text x="740" y="390" fill="#FFFFFF" font-family="monospace" font-size="13" text-anchor="end">$6,050.00</text>
  <text x="500" y="425" fill="#48CAE4" font-family="sans-serif" font-size="15" font-weight="bold">GRAND TOTAL 💵:</text>
  <text x="740" y="425" fill="#52B788" font-family="monospace" font-size="16" font-weight="bold" text-anchor="end">$6,050.00 USD</text>
</svg>
`);

export function getDemoSampleImages(): ProcessedImage[] {
  const now = Date.now();
  return [
    {
      id: `sample-1-${now}`,
      file: new File([], 'developer_code_emojis_sample.svg', { type: 'image/svg+xml' }),
      name: 'developer_code_emojis_sample.svg',
      size: 14200,
      previewUrl: SAMPLE_1_CODE_EMOJIS,
      base64: SAMPLE_1_CODE_EMOJIS,
      mimeType: 'image/svg+xml',
      status: 'idle',
      progress: 0,
      extractedText: '',
      timestamp: now
    },
    {
      id: `sample-2-${now}`,
      file: new File([], 'multilingual_russian_arabic_sample.svg', { type: 'image/svg+xml' }),
      name: 'multilingual_russian_arabic_sample.svg',
      size: 18500,
      previewUrl: SAMPLE_2_MULTILINGUAL,
      base64: SAMPLE_2_MULTILINGUAL,
      mimeType: 'image/svg+xml',
      status: 'idle',
      progress: 0,
      extractedText: '',
      timestamp: now + 1
    },
    {
      id: `sample-3-${now}`,
      file: new File([], 'structured_table_invoice_sample.svg', { type: 'image/svg+xml' }),
      name: 'structured_table_invoice_sample.svg',
      size: 21300,
      previewUrl: SAMPLE_3_STRUCTURED_TABLE,
      base64: SAMPLE_3_STRUCTURED_TABLE,
      mimeType: 'image/svg+xml',
      status: 'idle',
      progress: 0,
      extractedText: '',
      timestamp: now + 2
    }
  ];
}

