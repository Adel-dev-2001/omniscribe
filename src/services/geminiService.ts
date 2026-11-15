import { GeminiModelInfo } from '../types';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

function redactSecret(text: string, secret: string): string {
  if (!text || !secret) return text;
  return text.split(secret).join('[REDACTED]');
}

/**
 * Baseline fallback catalog containing verified production Free-Tier Google Gemini Flash models.
 * Used only as a network-offline fallback; live runtime execution always queries `/v1beta/models`.
 */
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
    description: 'Lightweight high-throughput multimodal engine (Free Tier)',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent'],
    isMultimodal: true,
    isRecommended: false
  },
  {
    name: 'gemini-2.5-flash',
    displayName: 'Google Gemini 2.5 Flash',
    version: '2.5',
    description: 'Production multimodal vision model (High-speed, Free Tier)',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent'],
    isMultimodal: true,
    isRecommended: false
  }
];

/**
 * Checks whether a model identifier is obsolete, discontinued, or invalid.
 */
export function isLegacyOrInvalidModel(name?: string | null): boolean {
  if (!name || typeof name !== 'string') return true;
  const clean = name.trim().toLowerCase();
  if (clean.length === 0) return true;
  if (clean.includes('1.0') || clean.includes('1.5') || clean.includes('argon') || clean.includes('paid')) {
    return true;
  }
  return false;
}

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
 * Parses version numbers from any present or future Gemini model identifier
 * (e.g. 'gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-4.5-flash', 'gemini-100.0-flash').
 */
export function extractVersion(name: string): {
  major: number;
  minor: number;
  isFlash: boolean;
  isPreview: boolean;
} {
  const lower = name.toLowerCase();
  const isFlash = lower.includes('flash');
  const isPreview = lower.includes('preview') || lower.includes('exp');

  const match = lower.match(/gemini-(\d+)(?:\.(\d+))?/i);
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
 * Filters and ranks raw model objects from Google's `/v1beta/models` response.
 * Designed for perpetual forward-compatibility across future Gemini generations:
 * - Strictly targets Free-Tier multimodal Flash families ('flash' and 'flash-lite').
 * - Excludes paid tiers ('pro', 'ultra', 'argon'), audio/video/image-gen/embedding endpoints,
 *   temporary date-pinned snapshots, and discontinued legacy versions (< 2.0).
 * - Automatically adapts as newer generations (3.x, 4.x, 5.x, 10.x+) are released.
 */
export function selectNewestFreeModels(rawModels: any[]): {
  models: GeminiModelInfo[];
  recommendedModel: string;
} {
  const candidates: GeminiModelInfo[] = rawModels
    .filter((m) => {
      const methods: string[] = m.supportedGenerationMethods || [];
      const isGenerative = methods.includes('generateContent');
      const rawName: string = m.name || '';
      const shortName = rawName.replace(/^models\//i, '').toLowerCase();

      if (!isGenerative || !shortName.startsWith('gemini-')) {
        return false;
      }

      // Strictly require Free-Tier multimodal Flash family ('flash' or 'flash-lite')
      if (!shortName.includes('flash')) {
        return false;
      }

      // Exclude non-OCR specialized endpoints, experimental snapshots, and paid tiers
      const excludedKeywords = [
        'embedding',
        'aqa',
        'imagen',
        'veo',
        'whisper',
        'tts',
        'audio',
        'live',
        'deep-research',
        'image',
        'computer-use',
        'robotics',
        'thinking',
        'exp',
        'learnlm',
        'gemma',
        'dialog',
        'speech',
        'transcribe',
        'argon',
        'carbon',
        'hydrogen',
        'ultra',
        'pro',
        'paid',
        'customtools',
        'latest',
        '8b'
      ];

      if (excludedKeywords.some((kw) => shortName.includes(kw))) {
        return false;
      }

      // Exclude date-pinned preview snapshots and fixed revision pins only on trailing suffix
      // so high major version numbers (e.g. gemini-1000-flash) are never rejected.
      const versionSuffix = shortName.replace(/^gemini-\d+(?:\.\d+)?/, '');
      if (
        /-\d{2}-\d{2}/.test(versionSuffix) ||
        /-\d{4}/.test(versionSuffix) ||
        /-\d{3}$/.test(versionSuffix)
      ) {
        return false;
      }

      const ver = extractVersion(shortName);
      // Exclude retired 1.x models
      if (ver.major < 2) {
        return false;
      }

      return true;
    })
    .map((m) => {
      const shortName = m.name.replace(/^models\//i, '');
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

  if (candidates.length === 0) {
    return {
      models: DEFAULT_GEMINI_MODELS,
      recommendedModel: DEFAULT_GEMINI_MODELS[0].name
    };
  }

  // Determine the highest available version in the catalog to prune obsolete generations (e.g. drop 2.0 when >= 2.5 exists)
  const highestMajor = Math.max(...candidates.map((c) => extractVersion(c.name).major));
  const hasModernGen = candidates.some((c) => {
    const v = extractVersion(c.name);
    return v.major > 2 || (v.major === 2 && v.minor >= 5);
  });

  const modernCandidates = candidates.filter((c) => {
    const v = extractVersion(c.name);
    if (hasModernGen && v.major === 2 && v.minor === 0) {
      return false; // Drop legacy 2.0 when 2.5+ or 3.x+ is available
    }
    // Keep models within the top 2 major generations
    return v.major >= highestMajor - 1;
  });

  const activePool = modernCandidates.length > 0 ? modernCandidates : candidates;

  // Version comparator: newest major.minor first; stable GA favored over preview within same version
  const compareVersionsDesc = (a: GeminiModelInfo, b: GeminiModelInfo) => {
    const vA = extractVersion(a.name);
    const vB = extractVersion(b.name);

    if (vA.major !== vB.major) return vB.major - vA.major;
    if (vA.minor !== vB.minor) return vB.minor - vA.minor;

    if (!vA.isPreview && vB.isPreview) return -1;
    if (vA.isPreview && !vB.isPreview) return 1;

    return a.name.localeCompare(b.name);
  };

  // Deduplicate by (family, major, minor) so only the cleanest release per version survives
  const familyGroups: Record<'flash' | 'flash-lite', GeminiModelInfo[]> = {
    'flash': [],
    'flash-lite': []
  };

  for (const family of ['flash', 'flash-lite'] as const) {
    const group = activePool
      .filter((m) => getModelFamily(m.name) === family)
      .sort(compareVersionsDesc);

    const seenVersions = new Set<string>();
    const deduped: GeminiModelInfo[] = [];

    for (const model of group) {
      const v = extractVersion(model.name);
      const key = `${v.major}.${v.minor}`;
      if (!seenVersions.has(key)) {
        seenVersions.add(key);
        deduped.push(model);
      }
    }

    // Keep the newest 2 versions per family
    const topTwo = deduped.slice(0, 2);

    // Ensure at least one stable GA model (!isPreview) is included if available in this family
    const hasStable = topTwo.some((m) => !extractVersion(m.name).isPreview);
    if (!hasStable) {
      const newestStable = deduped.find((m) => !extractVersion(m.name).isPreview);
      if (newestStable) {
        topTwo.push(newestStable);
      }
    }

    familyGroups[family] = topTwo;
  }

  const finalModels: GeminiModelInfo[] = [
    ...familyGroups['flash'],
    ...familyGroups['flash-lite']
  ];

  if (finalModels.length === 0) {
    return {
      models: DEFAULT_GEMINI_MODELS,
      recommendedModel: DEFAULT_GEMINI_MODELS[0].name
    };
  }

  // Sort cascade order: newest generation first, with primary 'flash' before 'flash-lite' within the same generation
  finalModels.sort((a, b) => {
    const vA = extractVersion(a.name);
    const vB = extractVersion(b.name);

    if (vA.major !== vB.major) return vB.major - vA.major;
    if (vA.minor !== vB.minor) return vB.minor - vA.minor;

    const famA = getModelFamily(a.name) === 'flash' ? 0 : 1;
    const famB = getModelFamily(b.name) === 'flash' ? 0 : 1;
    if (famA !== famB) return famA - famB;

    return compareVersionsDesc(a, b);
  });

  finalModels.forEach((m, idx) => {
    m.isRecommended = idx === 0;
  });

  return {
    models: finalModels,
    recommendedModel: finalModels[0].name
  };
}

/**
 * Dynamic Model Discovery:
 * Queries Google Gemini API's `/v1beta/models` endpoint using the user's API key
 * and selects the newest Free-Tier Flash multimodal models available.
 */
export async function discoverLatestGeminiModels(apiKey: string): Promise<{
  models: GeminiModelInfo[];
  recommendedModel: string;
}> {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API Key is missing. Please enter your Google Gemini API key.');
  }

  const cleanKey = apiKey.trim();
  const allRawModels: any[] = [];
  let pageToken: string | undefined;
  let pageCount = 0;

  do {
    const query = new URLSearchParams({ pageSize: '1000' });
    if (pageToken) {
      query.set('pageToken', pageToken);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/models?${query.toString()}`, {
        method: 'GET',
        headers: {
          'x-goog-api-key': cleanKey
        },
        signal: controller.signal
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const rawMessage =
          errJson.error?.message || `Google API HTTP ${response.status}: ${response.statusText}`;
        throw new Error(redactSecret(rawMessage, cleanKey));
      }

      const data = await response.json();
      if (Array.isArray(data.models)) {
        allRawModels.push(...data.models);
      }
      pageToken = typeof data.nextPageToken === 'string' && data.nextPageToken ? data.nextPageToken : undefined;
      pageCount++;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Request timed out while querying Google Gemini models catalog.');
      }
      throw new Error(redactSecret(err.message || 'Failed to query Gemini models catalog.', cleanKey));
    } finally {
      clearTimeout(timeoutId);
    }
  } while (pageToken && pageCount < 5);

  if (allRawModels.length === 0) {
    throw new Error('Google API returned 0 models for this API key.');
  }

  return selectNewestFreeModels(allRawModels);
}

/**
 * Extracts all text, Unicode emojis, tables, and mathematical symbols
 * from an image using the live Google Gemini Vision API with real-time dynamic cascade failover.
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
  liveDiscoveredModels: string[] = [],
  externalSignal?: AbortSignal
): Promise<{ text: string; modelUsed: string }> {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API Key is missing. Please configure your Google Gemini API key.');
  }

  if (externalSignal?.aborted) {
    throw new DOMException('Batch processing cancelled by user.', 'AbortError');
  }

  const cleanKey = apiKey.trim();
  const rawBase64 = imageBase64.replace(/^data:[^;]+;base64,/i, '');
  const cleanMimeType = mimeType || 'image/jpeg';

  const directives = ['Transcribe all visible text and numbers verbatim.'];
  if (options.preserveFormatting !== false) {
    directives.push('Preserve spatial layout, indentation, Markdown tables, and line breaks.');
  }
  if (options.extractEmojis !== false) {
    directives.push('Include every visible Unicode emoji and symbol accurately.');
  }
  directives.push('Return ONLY the extracted content with zero preamble.');
  const prompt = directives.join(' ');

  // Ensure we have live-discovered models from Google's catalog
  let validLiveModels = liveDiscoveredModels.filter((m) => !isLegacyOrInvalidModel(m));
  if (validLiveModels.length === 0) {
    try {
      const discovered = await discoverLatestGeminiModels(cleanKey);
      validLiveModels = discovered.models.map((m) => m.name);
    } catch {
      // Offline / discovery fallback handled below
    }
  }

  const hasLiveCatalog = validLiveModels.length > 0;
  const fallbackNames = DEFAULT_GEMINI_MODELS.map((m) => m.name);
  const primaryTarget = !isLegacyOrInvalidModel(modelName)
    ? modelName.trim()
    : validLiveModels[0] || fallbackNames[0];

  // Dynamic candidate cascade: rely strictly on Google's live catalog when available;
  // fall back to static baseline IDs only if live catalog discovery could not complete.
  const candidateModels = Array.from(
    new Set(
      hasLiveCatalog
        ? [primaryTarget, ...validLiveModels]
        : [primaryTarget, ...fallbackNames]
    )
  ).filter((m) => !isLegacyOrInvalidModel(m));

  let lastError: Error | null = null;
  let quotaError: Error | null = null;

  for (const candidate of candidateModels) {
    const ver = extractVersion(candidate);

    // Build generationConfig strategies tailored to the model generation,
    // always keeping a standard universal config fallback for 100% forward compatibility.
    const baseConfig = {
      temperature: options.temperature ?? 0.0,
      topP: 0.95,
      maxOutputTokens: 8192
    };

    const strategies: Array<{ genConfig: Record<string, unknown>; useSystemInstruction: boolean }> = [];
    if (ver.major >= 3) {
      strategies.push({
        genConfig: { ...baseConfig, thinkingConfig: { thinkingLevel: 'LOW' } },
        useSystemInstruction: true
      });
    } else if (ver.major === 2 && ver.minor >= 5) {
      strategies.push({
        genConfig: { ...baseConfig, thinkingConfig: { thinkingBudget: 0 } },
        useSystemInstruction: true
      });
    }
    strategies.push({ genConfig: baseConfig, useSystemInstruction: true });
    strategies.push({ genConfig: baseConfig, useSystemInstruction: false });

    for (const strategy of strategies) {
      if (externalSignal?.aborted) {
        throw new DOMException('Batch processing cancelled by user.', 'AbortError');
      }

      const endpoint = `${API_BASE_URL}/models/${encodeURIComponent(candidate)}:generateContent`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      const onExternalAbort = () => controller.abort();
      externalSignal?.addEventListener('abort', onExternalAbort, { once: true });

      try {
        const payload: Record<string, unknown> = strategy.useSystemInstruction
          ? {
              systemInstruction: {
                parts: [{ text: prompt }]
              },
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: 'Transcribe all visible content from the attached image verbatim.' },
                    {
                      inlineData: {
                        mimeType: cleanMimeType,
                        data: rawBase64
                      }
                    }
                  ]
                }
              ],
              generationConfig: strategy.genConfig
            }
          : {
              contents: [
                {
                  role: 'user',
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
              generationConfig: strategy.genConfig
            };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': cleanKey
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          const status = response.status;
          const errMsg = redactSecret(errJson.error?.message || response.statusText, cleanKey);

          // Invalid API Key: stop immediately and report to user
          if (
            (status === 400 || status === 401 || status === 403) &&
            (errMsg.includes('API_KEY_INVALID') || errMsg.toLowerCase().includes('api key not valid'))
          ) {
            throw new Error('INVALID_API_KEY: The provided Google Gemini API key is invalid.');
          }

          // Quota or rate limit reached on this model: record and immediately cascade to next live model
          if (
            status === 429 ||
            errMsg.includes('RESOURCE_EXHAUSTED') ||
            errMsg.toLowerCase().includes('quota')
          ) {
            quotaError = new Error(
              `QUOTA_EXCEEDED: ${errMsg || 'Google Gemini API request limit reached.'}`
            );
            lastError = quotaError;
            break; // Move to next candidate model in candidateModels
          }

          // Parameter mismatch (e.g. thinkingConfig not supported on this version): retry immediately with standard baseConfig
          if (status === 400) {
            lastError = new Error(`${candidate} (400): ${errMsg}`);
            continue;
          }

          // 404 or 5xx: move to next candidate model
          lastError = new Error(`${candidate} (${status}): ${errMsg}`);
          break;
        }

        const resJson = await response.json();
        const candidateChoice = resJson.candidates?.[0];
        const parts: any[] = candidateChoice?.content?.parts || [];

        // Join extracted text parts; skip internal reasoning/thought blocks
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

        return { text, modelUsed: candidate };
      } catch (err: any) {
        if (externalSignal?.aborted) {
          throw new DOMException('Batch processing cancelled by user.', 'AbortError');
        }
        if (err.message?.includes('INVALID_API_KEY')) {
          throw err;
        }
        if (err.name === 'AbortError') {
          lastError = new Error(`${candidate}: request timed out after 25s`);
          break;
        }
        lastError = err;
        break;
      } finally {
        clearTimeout(timeoutId);
        externalSignal?.removeEventListener('abort', onExternalAbort);
      }
    }
  }

  throw quotaError || lastError || new Error('Extraction failed across all available Gemini models.');
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
  // Matches standard emojis, emoji modifiers, zero-width joiner (ZWJ) sequences, and regional flags
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
