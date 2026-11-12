import { describe, it, expect } from 'vitest';
import {
  analyzeExtractedText,
  getModelFamily,
  extractVersion,
  selectNewestFreeModels,
  isLegacyOrInvalidModel,
  DEFAULT_GEMINI_MODELS
} from '../services/geminiService';
import {
  generateMergedPlainText,
  generateMergedMarkdown,
  generateMergedJSON
} from '../services/exportService';
import { ProcessedImage, ExportConfig } from '../types';

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
      progress: 100,
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
      authorName: 'Adel Mohamed',
      exportScope: 'all'
    };

    const txtOutput = generateMergedPlainText([mockImage], config);
    expect(txtOutput).toContain('TEST REPORT');
    expect(txtOutput).toContain('[IMAGE 1/1] - test.png');
    expect(txtOutput).toContain('Test text with emoji 🚀');

    const mdOutput = generateMergedMarkdown([mockImage], config);
    expect(mdOutput).toContain('# Test Report');
    expect(mdOutput).toContain('Table of Contents');

    const jsonOutput = generateMergedJSON([mockImage], config);
    const parsed = JSON.parse(jsonOutput);
    expect(parsed.metadata.title).toBe('Test Report');
    expect(parsed.items.length).toBe(1);
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
});
