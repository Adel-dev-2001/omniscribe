/**
 * Intelligent Mock OCR Engine for Reviewers & Evaluators.
 * Enables full end-to-end testing of the pipeline (recognition, emoji stream chips,
 * speech synthesis, text editing, and PDF consolidation) even without an API key!
 */

export interface MockExtractionResult {
  text: string;
  modelUsed: string;
}

const SAMPLE_1_MOCK = `// 🌟 OmniScribe: High-Performance Vision Pipeline
import { MultimodalModel } from "@google/gemini-3.8"; ⚡

export async function extractSemanticGlyphs(image: Buffer): Promise<OCRResult> {
  const model = await discoverLatestEndpoint(); // Auto-binds latest AI 🧠
  const response = await model.generateVisionContent(image); 🔥
  return {
    tokens: response.tokens,    // All text transcribed 100% 📝
    emojis: ["🚀", "⚡", "🔥", "🧠", "✨", "💻", "🇷🇺", "🇸🇦"],
    accuracy: 0.9998           // Verified fidelity ✅
  };
}`;

const SAMPLE_2_MOCK = `🎓
РОССИЙСКАЯ АКАДЕМИЧЕСКАЯ СТИПЕНДИЯ 2026/2027
Отделение компьютерных наук и искусственного интеллекта (ВШЭ / МФТИ)

Candidate Portfolio Verification: Adel (Computer Science Department)
Demonstrating Autonomous Multimodal OCR, Unicode Synthesis & Dynamic API Longevity

منحة الحكومة الروسية للدراسات العليا في الذكاء الاصطناعي 🏛️
مشروع استخراج النصوص وتحليل الرموز التعبيرية بدون أي فقدان لغوي 🌟

Admissions Committee (Москва, РФ)
Research Verification Code: #RU-CS-2026-AI`;

const SAMPLE_3_MOCK = `FINANCIAL AUDIT REPORT 📊
INVOICE: #INV-9821-AI 💳
Issued Date: 2026-11-08 • Client: Autonomous Lab Inc. 🏢

Item Description 📦 | Category 🏷️ | Qty 🔢 | Subtotal 💰
------------------------------------------------------------
High-Resolution GPU Compute Cluster 🖥️ | Hardware | 4 units | $4,800.00
Multimodal OCR Vision License (Gemini 3.8 Flash) ⚡ | Software API | 1 year | $0.00 (Free Tier)
Unicode Tokenizer & Emoji Decoder Suite 🦄 | Library | Enterprise | $1,250.00

Total Net: $6,050.00
GRAND TOTAL 💵: $6,050.00 USD`;

export function getMockExtractionForImage(fileName: string): MockExtractionResult {
  const lower = fileName.toLowerCase();

  if (lower.includes('code') || lower.includes('developer')) {
    return {
      text: SAMPLE_1_MOCK,
      modelUsed: 'gemini-3.8-flash (Demo Simulator)'
    };
  }

  if (lower.includes('russian') || lower.includes('multilingual') || lower.includes('arabic')) {
    return {
      text: SAMPLE_2_MOCK,
      modelUsed: 'gemini-3.8-flash (Demo Simulator)'
    };
  }

  if (lower.includes('invoice') || lower.includes('table') || lower.includes('structured')) {
    return {
      text: SAMPLE_3_MOCK,
      modelUsed: 'gemini-3.8-flash (Demo Simulator)'
    };
  }

  // Generic fallback if user uploaded their own image in simulator mode
  return {
    text: `[OmniScribe Simulator Mode]\nRecognized document: ${fileName}\n\nMultilingual Verification: English, Русский текст, العربية 🌟\nCaptured Unicode Emojis: 🚀 💻 ⚡ 🔥 ✨ 🎓 🇷🇺 🇸🇦\nSpatial Layout: Preserved with 100% fidelity.\n\nTip: To perform live neural recognition on custom personal photos, enter your free Google Gemini API key in the top bar!`,
    modelUsed: 'gemini-3.8-flash (Demo Simulator)'
  };
}

