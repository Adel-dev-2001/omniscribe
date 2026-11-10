import { GeminiModelInfo } from '../types';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export const DEFAULT_GEMINI_MODELS: GeminiModelInfo[] = [
  {
    name: 'gemini-3.8-flash',
    displayName: 'Google Gemini 3.8 Flash',
    version: '3.8',
    description: 'Latest generation multimodal vision model (Ultra-fast, Free Tier)',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent'],
    isMultimodal: true,
    isRecommended: true
  },
  {
    name: 'gemini-3.6-flash',
    displayName: 'Google Gemini 3.6 Flash',
    version: '3.6',
    description: 'High-speed secondary multimodal engine (Free Tier)',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent'],
    isMultimodal: true,
    isRecommended: false
  },
  {
    name: 'gemini-3.5-flash-lite',
    displayName: 'Google Gemini 3.5 Flash-Lite',
    version: '3.5',
    description: 'High-speed lightweight multimodal engine (Free Tier)',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent'],
    isMultimodal: true,
    isRecommended: false
  }
];

/**
 * Detects model family/tier: 'flash' | 'flash-lite' | 'pro' | 'other'
 */
export function getModelFamily(name: string): 'flash' | 'flash-lite' | 'pro' | 'other' {
  const lower = name.toLowerCase();
  if (lower.includes('flash-lite') || lower.includes('flash_lite') || lower.includes('lite')) {
    return 'flash-lite';
  }
  if (lower.includes('flash')) {
    return 'flash';
  }
  if (lower.includes('pro')) {
    return 'pro';
  }
  return 'other';
}

/**
 * Parses version numbers from model name string (e.g. 'gemini-3.8-flash' -> { major: 3, minor: 8, ... })
 * Future-proof for any upcoming Gemini version (Gemini 4, 4.5, 5.0, etc.)
 */
export function extractVersion(name: string): { major: number; minor: number; isFlash: boolean; isPreview: boolean } {
  const isFlash = name.toLowerCase().includes('flash');
  const isPreview = name.toLowerCase().includes('preview') || name.toLowerCase().includes('exp');
  
  const match = name.match(/gemini-(\d+)(?:\.(\d+))?/i);
  if (match) {
    return {
      major: parseInt(match[1], 10),
      minor: match[2] ? parseInt(match[2], 10) : 0,
      isFlash,
      isPreview
    };
  }
  return { major: 1, minor: 0, isFlash, isPreview };
}

/**
 * Autonomous Future-Proof Model Discovery:
 * Dynamically queries Google Gemini API's `/models` endpoint using the provided API Key.
 * Evaluates all compatible multimodal models, scores them by generation version & free-tier suitability (flash),
 * and selects the absolute newest model available at runtime directly from Google.
 */
export async function discoverLatestGeminiModels(apiKey: string): Promise<{
  models: GeminiModelInfo[];
  recommendedModel: string;
}> {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API Key is missing. Please enter your Google Gemini API key.');
  }

  const cleanKey = apiKey.trim();
  const url = `${API_BASE_URL}/models?key=${cleanKey}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = errJson.error?.message || `Google API HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  const data = await response.json();
  const rawModels: any[] = data.models || [];

  if (rawModels.length === 0) {
    throw new Error('Google API returned 0 models for this API key.');
  }

  // Filter compatible multimodal models that support generateContent
  const eligibleModels: GeminiModelInfo[] = rawModels
    .filter((m) => {
      const methods: string[] = m.supportedGenerationMethods || [];
      const isGenerative = methods.includes('generateContent');
      const name: string = m.name?.toLowerCase() || '';
      
      // Exclude text-only, embeddings, imagen, aqa, or audio-only specialized models, and paid models
      const isExcluded = 
        name.includes('embedding') || 
        name.includes('aqa') || 
        name.includes('imagen') || 
        name.includes('whisper') || 
        name.includes('tts') || 
        name.includes('deep-research') || 
        name.includes('image') || 
        name.includes('live') || 
        name.includes('audio') || 
        name.includes('computer-use') || 
        name.includes('robotics') ||
        name.includes('argon') || // Exclude paid Argon tier
        name.includes('paid') ||  // Exclude paid endpoints
        name.includes('ultra') || // Exclude paid Ultra tier
        name.includes('1.5');     // Exclude discontinued 1.5 endpoints that return 404

      return isGenerative && !isExcluded && name.includes('gemini');
    })
    .map((m) => {
      const shortName = m.name.replace(/^models\//, '');
      return {
        name: shortName,
        displayName: m.displayName || shortName,
        version: m.version || '',
        description: m.description || '',
        inputTokenLimit: m.inputTokenLimit || 0,
        outputTokenLimit: m.outputTokenLimit || 0,
        supportedGenerationMethods: m.supportedGenerationMethods || [],
        isMultimodal: true,
        isRecommended: false
      };
    });

  if (eligibleModels.length === 0) {
    return {
      models: DEFAULT_GEMINI_MODELS,
      recommendedModel: 'gemini-3.8-flash'
    };
  }

  // Version comparator: sorts newer versions first (e.g. 4.0 > 3.8 > 2.5)
  const compareVersionsDesc = (a: GeminiModelInfo, b: GeminiModelInfo) => {
    const vA = extractVersion(a.name);
    const vB = extractVersion(b.name);

    // Major version priority (3 > 2)
    if (vA.major !== vB.major) return vB.major - vA.major;

    // Minor version priority (8 > 5)
    if (vA.minor !== vB.minor) return vB.minor - vA.minor;

    // Stable releases favored over experimental/preview
    if (!vA.isPreview && vB.isPreview) return -1;
    if (vA.isPreview && !vB.isPreview) return 1;

    return a.name.localeCompare(b.name);
  };

  // Group eligible models by family ('flash', 'flash-lite', 'pro')
  const familyGroups: Record<string, GeminiModelInfo[]> = {
    'flash': [],
    'flash-lite': [],
    'pro': []
  };

  for (const model of eligibleModels) {
    const family = getModelFamily(model.name);
    if (!familyGroups[family]) {
      familyGroups[family] = [];
    }
    familyGroups[family].push(model);
  }

  // Filter: Keep strictly the latest 2 versions for each model family (e.g. latest 2 Flash, latest 2 Lite, latest 2 Pro)
  const curatedModels: GeminiModelInfo[] = [];
  for (const family of ['flash', 'flash-lite', 'pro'] as const) {
    const group = familyGroups[family] || [];
    group.sort(compareVersionsDesc);
    // Keep strictly the newest 2 releases per family; drop obsolete older versions
    curatedModels.push(...group.slice(0, 2));
  }

  const finalModels = curatedModels.length > 0 ? curatedModels : DEFAULT_GEMINI_MODELS;

  // Global priority sorting: Full Flash first (fastest/free tier), then Flash-Lite, then Pro
  finalModels.sort((a, b) => {
    const famA = getModelFamily(a.name);
    const famB = getModelFamily(b.name);
    const familyPriority: Record<string, number> = { 'flash': 1, 'flash-lite': 2, 'pro': 3, 'other': 4 };
    const pA = familyPriority[famA] || 5;
    const pB = familyPriority[famB] || 5;
    if (pA !== pB) return pA - pB;

    return compareVersionsDesc(a, b);
  });

  // Mark the top newest Flash model as recommended
  finalModels.forEach((m) => { m.isRecommended = false; });
  finalModels[0].isRecommended = true;

  return {
    models: finalModels,
    recommendedModel: finalModels[0].name
  };
}

/**
 * Extracts all text, Unicode emojis, tables, and mathematical symbols
 * from an image using Gemini Vision API with dynamic fallback.
 */
export async function extractTextAndEmojisFromImage(
  apiKey: string,
  modelName: string,
  imageBase64: string,
  mimeType: string,
  options: {
    preserveFormatting?: boolean;
    extractEmojis?: boolean;
    temperature?: number;
  } = {},
  liveDiscoveredModels: string[] = []
): Promise<{ text: string; modelUsed: string }> {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API Key is missing. Please configure your Google Gemini API key.');
  }

  const cleanKey = apiKey.trim();
  const rawBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
  const cleanMimeType = mimeType || 'image/jpeg';
  const prompt = `Transcribe all visible text, numbers, formatting, and Unicode emojis verbatim. Return ONLY the extracted content with zero preamble.`;

  // Filter out any deprecated models like 1.5 which Google discontinued/throws 404
  const targetModel = (modelName && !modelName.includes('1.5')) ? modelName.trim() : 'gemini-3.8-flash';

  // Dynamic candidate cascade: prioritize target model, then live models discovered from this key, then verified fallbacks
  const candidateModels = Array.from(
    new Set([
      targetModel,
      ...liveDiscoveredModels,
      'gemini-3.8-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash-lite',
      'gemini-2.5-flash'
    ])
  ).filter((m): m is string => Boolean(m && !m.includes('1.5')));

  let lastError: Error | null = null;

  for (const candidate of candidateModels) {
    const isGemini3 = candidate.includes('3.') || candidate.includes('gemini-3');

    // Strategy 1: Optimized thinking config (LOW for Gemini 3.x for sub-second OCR, or budget 0 for 2.x)
    // Strategy 2: Pure generationConfig if endpoint rejects thinkingConfig syntax
    const configsToTry: any[] = [
      {
        temperature: options.temperature ?? 0.0,
        topP: 0.95,
        maxOutputTokens: 8192,
        thinkingConfig: isGemini3 ? { thinkingLevel: 'LOW' } : { thinkingBudget: 0 }
      },
      {
        temperature: options.temperature ?? 0.0,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    ];

    for (const genConfig of configsToTry) {
      const endpoint = `${API_BASE_URL}/models/${candidate}:generateContent?key=${cleanKey}`;
      const controller = new AbortController();
      // Fast, non-blocking 20s timeout (with LOW thinking, Gemini responds in 1-3 seconds)
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const payload = {
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: cleanMimeType,
                    data: rawBase64
                  }
                }
              ]
            }
          ],
          generationConfig: genConfig
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          const status = response.status;
          const errMsg = errJson.error?.message || response.statusText;

          // If API Key is invalid, stop immediately
          if (status === 400 && (errMsg.includes('API_KEY_INVALID') || errMsg.includes('API key not valid'))) {
            throw new Error('INVALID_API_KEY: The provided Google Gemini API key is invalid.');
          }

          // If Quota is exhausted on this specific model, record error and dynamically switch to next candidate
          if (status === 429 || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.toLowerCase().includes('quota')) {
            lastError = new Error(`QUOTA_EXCEEDED: ${errMsg || 'Google Gemini API request limit reached.'}`);
            break; // Try next candidate model in the cascade!
          }

          // If 400 was caused by thinkingConfig parameter mismatch, continue to next config (without thinkingConfig)
          if (status === 400 && (errMsg.toLowerCase().includes('thinking') || errMsg.toLowerCase().includes('argument'))) {
            continue;
          }

          // If 404 (model not found / retired), break to try next candidate model
          if (status === 404 || errMsg.toLowerCase().includes('not found')) {
            lastError = new Error(`${candidate} (404): Model not found.`);
            break;
          }

          lastError = new Error(`${candidate} (${status}): ${errMsg}`);
          break;
        }

        const resJson = await response.json();
        const candidateChoice = resJson.candidates?.[0];
        const parts: any[] = candidateChoice?.content?.parts || [];

        // Join real text parts; skip internal thoughts
        const text = parts
          .filter((p) => typeof p.text === 'string' && !p.thought)
          .map((p) => p.text)
          .join('')
          .trim();

        if (!text && candidateChoice?.finishReason && candidateChoice.finishReason !== 'STOP') {
          lastError = new Error(`${candidate}: ended with reason ${candidateChoice.finishReason}`);
          break;
        }

        if (!text && resJson.promptFeedback?.blockReason) {
          lastError = new Error(`${candidate}: blocked (${resJson.promptFeedback.blockReason})`);
          break;
        }

        // Return verified text and model
        return { text, modelUsed: candidate };
      } catch (err: any) {
        if (err.name === 'AbortError') {
          lastError = new Error(`${candidate}: no response within 20s`);
          break; // Try next candidate model
        }
        if (err.message?.includes('INVALID_API_KEY') || err.message?.includes('QUOTA_EXCEEDED')) {
          throw err;
        }
        lastError = err;
        break; // Try next candidate model
      } finally {
        clearTimeout(timeoutId);
      }
    }
  }

  throw lastError || new Error(`Extraction failed across all available Gemini models.`);
}

/**
 * Calculates quantitative statistics on extracted text:
 * Character count, word count, line count, and strict Unicode emoji detection.
 */
export function analyzeExtractedText(text: string, processingTimeMs: number) {
  if (!text) {
    return {
      charCount: 0,
      wordCount: 0,
      emojiCount: 0,
      lineCount: 0,
      processingTimeMs
    };
  }

  const charCount = text.length;
  const wordCount = (text.match(/[\p{L}\p{N}]+/gu) || []).length;
  const lineCount = text.split(/\r\n|\r|\n/).length;

  // Modern Unicode-compliant Emoji regex pattern
  // Matches standard emojis, emoji modifiers, zero-width joiner (ZWJ) sequences, flags
  const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Regional_Indicator}{2})/gu;
  const emojis = text.match(emojiRegex) || [];

  return {
    charCount,
    wordCount,
    emojiCount: emojis.length,
    lineCount,
    processingTimeMs
  };
}

