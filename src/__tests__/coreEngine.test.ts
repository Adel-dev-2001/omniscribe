import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  analyzeExtractedText,
  getModelFamily,
  extractVersion,
  selectNewestFreeModels,
  discoverLatestGeminiModels,
  extractTextAndEmojisFromImage,
  isLegacyOrInvalidModel,
  DEFAULT_GEMINI_MODELS
} from '../services/geminiService';
import {
  generateMergedPlainText,
  generateMergedMarkdown,
  generateMergedJSON,
  safeFileSlug
} from '../services/exportService';
import { ProcessedImage, ExportConfig } from '../types';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('OmniScribe: Core Engine & Multimodal NLP Analyzer', () => {
  it('correctly calculates character, word, line, and strict Unicode emoji counts', () => {
    const sample =
      'Hello World! 🚀 Привет мир! 🇷🇺 Welcome 🌟\nSecond line with code: const x = 42; 💻⚡';
    const stats = analyzeExtractedText(sample, 250);

    expect(stats.charCount).toBe(sample.length);
    expect(stats.lineCount).toBe(2);
    expect(stats.processingTimeMs).toBe(250);
    expect(stats.wordCount).toBeGreaterThan(10);
    expect(stats.emojiCount).toBeGreaterThanOrEqual(5);
  });

  it('handles empty text gracefully without throwing exceptions', () => {
    const stats = analyzeExtractedText('', 0);
    expect(stats.charCount).toBe(0);
    expect(stats.wordCount).toBe(0);
    expect(stats.emojiCount).toBe(0);
    expect(stats.lineCount).toBe(0);
  });

  it('selects strictly the newest Free-Tier Flash models and filters out legacy, paid, and specialized endpoints', () => {
    const rawCatalog = [
      { name: 'models/gemini-1.5-flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-2.0-flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-2.5-flash-preview-05-20', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-2.5-flash-preview-tts', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-2.5-pro', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-4-argon-paid', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-2.5-flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-2.5-flash-lite', supportedGenerationMethods: ['generateContent'] }
    ];

    const result = selectNewestFreeModels(rawCatalog);
    expect(result.recommendedModel).toBe('gemini-2.5-flash');
    expect(result.models.map((m) => m.name)).toContain('gemini-2.5-flash');
    expect(result.models.map((m) => m.name)).toContain('gemini-2.5-flash-lite');
    expect(result.models.map((m) => m.name)).not.toContain('gemini-1.5-flash');
    expect(result.models.map((m) => m.name)).not.toContain('gemini-2.5-pro');
    expect(result.models.map((m) => m.name)).not.toContain('gemini-4-argon-paid');
    expect(result.models.map((m) => m.name)).not.toContain('gemini-2.5-flash-preview-05-20');
  });

  it('scales forward to future Gemini generations (e.g. v4.0, v12.5, v100.0) without code changes', () => {
    const futureCatalog = [
      { name: 'models/gemini-2.5-flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-12.5-flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-42.0-flash-lite', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-42.0-flash', supportedGenerationMethods: ['generateContent'] }
    ];

    const result = selectNewestFreeModels(futureCatalog);
    expect(result.recommendedModel).toBe('gemini-42.0-flash');
    expect(result.models[0].name).toBe('gemini-42.0-flash');
    expect(result.models[1].name).toBe('gemini-42.0-flash-lite');
  });

  it('generates structured consolidated Plain Text, Markdown, and JSON datasets', () => {
    const mockImage: ProcessedImage = {
      id: 'img-1',
      file: new File([], 'test.png', { type: 'image/png' }),
      name: 'test.png',
      size: 1024,
      previewUrl: 'data:image/png;base64,...',
      base64: '...',
      mimeType: 'image/png',
      status: 'completed',
      extractedText: 'Test text with emoji 🚀',
      stats: {
        charCount: 23,
        wordCount: 5,
        emojiCount: 1,
        lineCount: 1,
        processingTimeMs: 150
      },
      timestamp: Date.now()
    };

    const config: ExportConfig = {
      format: 'txt',
      includeMetadata: true,
      includeStats: true,
      documentTitle: 'Test Report',
      authorName: 'Adel Mohamed'
    };

    const txtOutput = generateMergedPlainText([mockImage], config);
    expect(txtOutput).toContain('TEST REPORT');
    expect(txtOutput).toContain('Author             : Adel Mohamed');
    expect(txtOutput).toContain('[IMAGE 1/1] - test.png');
    expect(txtOutput).toContain('Test text with emoji 🚀');

    const mdOutput = generateMergedMarkdown([mockImage], config);
    expect(mdOutput).toContain('# Test Report');
    expect(mdOutput).toContain('**Author:** Adel Mohamed');
    expect(mdOutput).toContain('Table of Contents');
    expect(mdOutput).toContain('<a id="image-1"></a>');

    const codeFenceImage: ProcessedImage = {
      ...mockImage,
      name: 'scan [final]`test.png',
      extractedText: '```ts\nconst ok = true;\n```'
    };
    const fencedMd = generateMergedMarkdown([codeFenceImage], config);
    expect(fencedMd).toContain('[Image: scan \\[final\\]`test.png](#image-1)');
    expect(fencedMd).toContain("### Image 1: `scan [final]'test.png`");
    expect(fencedMd).toContain('````text\n```ts\nconst ok = true;\n```\n````');

    const jsonOutput = generateMergedJSON([mockImage], config);
    const parsed = JSON.parse(jsonOutput);
    expect(parsed.metadata.title).toBe('Test Report');
    expect(parsed.metadata.author).toBe('Adel Mohamed');
    expect(parsed.items.length).toBe(1);

    expect(safeFileSlug('OmniScribe Report v2.4!')).toBe('omniscribe_report_v2_4');
    expect(safeFileSlug('تقرير مستندات 2026')).toBe('2026');
    expect(safeFileSlug('تقرير عربي فقط')).toBe('omniscribe_report');

    const blankTitleConfig: ExportConfig = { ...config, documentTitle: '   ' };
    expect(generateMergedPlainText([mockImage], blankTitleConfig)).toContain('OMNISCRIBE EXTRACTION REPORT');
    expect(generateMergedMarkdown([mockImage], blankTitleConfig)).toContain('# OmniScribe Extraction Report');
    expect(JSON.parse(generateMergedJSON([mockImage], blankTitleConfig)).metadata.title).toBe(
      'OmniScribe Extraction Report'
    );
  });

  it('correctly categorizes model families, versions, and legacy identifiers', () => {
    expect(DEFAULT_GEMINI_MODELS[0].name).toBe('gemini-3.8-flash');
    expect(DEFAULT_GEMINI_MODELS[0].isRecommended).toBe(true);

    expect(getModelFamily('gemini-3.8-flash')).toBe('flash');
    expect(getModelFamily('gemini-3.5-flash-lite')).toBe('flash-lite');
    expect(getModelFamily('gemini-2.5-pro')).toBe('pro');

    expect(isLegacyOrInvalidModel('gemini-1.5-flash')).toBe(true);
    expect(isLegacyOrInvalidModel('gemini-3.8-flash')).toBe(false);
    expect(isLegacyOrInvalidModel('gemini-2.5-flash')).toBe(false);

    const v38 = extractVersion('gemini-3.8-flash');
    expect(v38.major).toBe(3);
    expect(v38.minor).toBe(8);
    expect(v38.isFlash).toBe(true);

    const vFuture = extractVersion('gemini-100.5-flash');
    expect(vFuture.major).toBe(100);
    expect(vFuture.minor).toBe(5);
    expect(vFuture.isFlash).toBe(true);
  });

  it('queries live models endpoint via header auth and cascades smoothly across rate-limited models', async () => {
    const calledRequests: Array<{ url: string; apiKeyHeader: string | null; hasSystemInstruction: boolean }> = [];

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const headers = new Headers(init?.headers);
        const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null;
        calledRequests.push({
          url,
          apiKeyHeader: headers.get('x-goog-api-key'),
          hasSystemInstruction: Boolean(body?.systemInstruction)
        });

        if (url.includes('/v1beta/models?')) {
          return new Response(
            JSON.stringify({
              models: [
                {
                  name: 'models/gemini-3.8-flash',
                  displayName: 'Gemini 3.8 Flash',
                  supportedGenerationMethods: ['generateContent']
                },
                {
                  name: 'models/gemini-3.5-flash-lite',
                  displayName: 'Gemini 3.5 Flash-Lite',
                  supportedGenerationMethods: ['generateContent']
                }
              ]
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (url.includes('gemini-3.8-flash:generateContent')) {
          return new Response(
            JSON.stringify({ error: { message: 'RESOURCE_EXHAUSTED: Rate limit hit' } }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (url.includes('gemini-3.5-flash-lite:generateContent')) {
          return new Response(
            JSON.stringify({
              candidates: [
                {
                  finishReason: 'STOP',
                  content: { parts: [{ text: 'Verified live output 🚀' }] }
                }
              ]
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response('{}', { status: 404 });
      })
    );

    const testKey = 'AIzaSyTestKey1234567890';
    const discovered = await discoverLatestGeminiModels(testKey);
    expect(discovered.recommendedModel).toBe('gemini-3.8-flash');

    const extracted = await extractTextAndEmojisFromImage(
      testKey,
      discovered.recommendedModel,
      'data:image/jpeg;base64,/9j/4AAQ',
      'image/jpeg',
      { preserveFormatting: true, extractEmojis: true, temperature: 0 },
      discovered.models.map((m) => m.name)
    );

    expect(extracted.text).toBe('Verified live output 🚀');
    expect(extracted.modelUsed).toBe('gemini-3.5-flash-lite');
    expect(calledRequests.some((r) => r.url.includes('gemini-3.6-flash'))).toBe(false);
    expect(calledRequests.every((r) => r.apiKeyHeader === testKey)).toBe(true);
    expect(calledRequests.every((r) => !r.url.includes(testKey))).toBe(true);
    expect(calledRequests.some((r) => r.url.includes('gemini-3.5-flash-lite') && r.hasSystemInstruction)).toBe(true);
  });

  it('follows nextPageToken pagination and preserves 4-digit future major versions without false date filtering', async () => {
    const pagesFetched: string[] = [];

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        pagesFetched.push(url);

        if (url.includes('pageToken=page-2')) {
          return new Response(
            JSON.stringify({
              models: [
                { name: 'models/gemini-1000-flash', supportedGenerationMethods: ['generateContent'] },
                { name: 'models/gemini-2.5-flash-preview-05-20', supportedGenerationMethods: ['generateContent'] }
              ]
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            models: [{ name: 'models/gemini-3.8-flash', supportedGenerationMethods: ['generateContent'] }],
            nextPageToken: 'page-2'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );

    const catalog = await discoverLatestGeminiModels('AIzaSyPaginationTestKey123');
    expect(pagesFetched.length).toBe(2);
    expect(catalog.recommendedModel).toBe('gemini-1000-flash');
    expect(catalog.models.map((m) => m.name)).not.toContain('gemini-2.5-flash-preview-05-20');
  });

  it('falls back to single-turn prompt on HTTP 400 systemInstruction rejection and redacts secrets on errors', async () => {
    let fallbackAttempts = 0;
    let succeededWithoutSystemInstruction = false;
    let shouldFailWithForbidden = false;
    const secretKey = 'AIzaSySecretRedactionCheckKey';

    vi.stubGlobal(
      'fetch',
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        if (shouldFailWithForbidden) {
          return new Response(
            JSON.stringify({ error: { message: `Permission denied for key ${secretKey}` } }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }

        fallbackAttempts++;
        const body = typeof init?.body === 'string' ? JSON.parse(init.body) : {};

        if (body.systemInstruction) {
          return new Response(
            JSON.stringify({ error: { message: 'Developer instruction is not enabled for this model' } }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        succeededWithoutSystemInstruction = true;
        return new Response(
          JSON.stringify({
            candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'Fallback OCR ok' }] } }]
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );

    const fallbackResult = await extractTextAndEmojisFromImage(
      secretKey,
      'gemini-3.8-flash',
      'data:image/jpeg;base64,/9j/4AAQ',
      'image/jpeg',
      { preserveFormatting: false, extractEmojis: false, temperature: 0 },
      ['gemini-3.8-flash']
    );
    expect(fallbackAttempts).toBe(3);
    expect(succeededWithoutSystemInstruction).toBe(true);
    expect(fallbackResult.text).toBe('Fallback OCR ok');

    shouldFailWithForbidden = true;
    await expect(
      extractTextAndEmojisFromImage(
        secretKey,
        'gemini-3.8-flash',
        'data:image/jpeg;base64,/9j/4AAQ',
        'image/jpeg',
        { preserveFormatting: true, extractEmojis: true, temperature: 0 },
        ['gemini-3.8-flash']
      )
    ).rejects.toSatisfy((err: Error) => !err.message.includes(secretKey));
  });

  it('aborts immediately without cascading across fallback models when user cancels via AbortSignal', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const controller = new AbortController();
    controller.abort();

    await expect(
      extractTextAndEmojisFromImage(
        'AIzaSyAbortSignalCheckKey123',
        'gemini-3.8-flash',
        'data:image/jpeg;base64,/9j/4AAQ',
        'image/jpeg',
        { preserveFormatting: true, extractEmojis: true, temperature: 0 },
        ['gemini-3.8-flash', 'gemini-3.5-flash-lite'],
        controller.signal
      )
    ).rejects.toMatchObject({ name: 'AbortError' });

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
