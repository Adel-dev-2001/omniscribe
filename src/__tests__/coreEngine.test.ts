import { describe, it, expect } from 'vitest';
import { analyzeExtractedText } from '../services/geminiService';
import { getMockExtractionForImage } from '../services/mockOcrService';
import { generateMergedPlainText, generateMergedMarkdown, generateMergedJSON } from '../services/exportService';
import { ProcessedImage, ExportConfig } from '../types';

describe('OmniScribe: Core Engine & Multimodal NLP Analyzer', () => {
  it('correctly calculates character, word, line, and strict Unicode emoji counts', () => {
    const sample = 'Hello World! 🚀 Привет мир! 🇷🇺 مرحباً بالعالم 🌟\nSecond line with code: const x = 42; 💻⚡';
    const stats = analyzeExtractedText(sample, 250);

    expect(stats.charCount).toBe(sample.length);
    expect(stats.lineCount).toBe(2);
    expect(stats.processingTimeMs).toBe(250);
    expect(stats.wordCount).toBeGreaterThan(10);
    // Should detect emojis: 🚀, 🇷🇺, 🌟, 💻, ⚡
    expect(stats.emojiCount).toBeGreaterThanOrEqual(5);
  });

  it('handles empty text gracefully without throwing exceptions', () => {
    const stats = analyzeExtractedText('', 0);
    expect(stats.charCount).toBe(0);
    expect(stats.wordCount).toBe(0);
    expect(stats.emojiCount).toBe(0);
    expect(stats.lineCount).toBe(0);
  });

  it('delivers correct mock extraction data for challenge samples', () => {
    const resCode = getMockExtractionForImage('developer_code_emojis_sample.svg');
    expect(resCode.text).toContain('extractSemanticGlyphs');
    expect(resCode.text).toContain('🚀');

    const resMulti = getMockExtractionForImage('multilingual_russian_arabic_sample.svg');
    expect(resMulti.text).toContain('РОССИЙСКАЯ АКАДЕМИЧЕСКАЯ СТИПЕНДИЯ');
    expect(resMulti.text).toContain('منحة الحكومة الروسية');
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
      authorName: 'Adel',
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

  it('validates Google Gemini 3.8 Flash as top flagship default model', async () => {
    const { DEFAULT_GEMINI_MODELS } = await import('../services/geminiService');
    expect(DEFAULT_GEMINI_MODELS.length).toBeGreaterThan(0);
    expect(DEFAULT_GEMINI_MODELS[0].name).toBe('gemini-3.8-flash');
    expect(DEFAULT_GEMINI_MODELS[0].isRecommended).toBe(true);
  });

  it('correctly categorizes model family and parses future-proof version numbers', async () => {
    const { getModelFamily, extractVersion } = await import('../services/geminiService');
    
    expect(getModelFamily('gemini-3.8-flash')).toBe('flash');
    expect(getModelFamily('gemini-3.5-flash-lite')).toBe('flash-lite');
    expect(getModelFamily('gemini-3.0-pro')).toBe('pro');

    const v38 = extractVersion('gemini-3.8-flash');
    expect(v38.major).toBe(3);
    expect(v38.minor).toBe(8);
    expect(v38.isFlash).toBe(true);

    const vFuture = extractVersion('gemini-4.5-flash');
    expect(vFuture.major).toBe(4);
    expect(vFuture.minor).toBe(5);
    expect(vFuture.isFlash).toBe(true);
  });
});

