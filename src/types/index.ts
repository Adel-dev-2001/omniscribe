export type SupportedLanguage = 'en' | 'ru' | 'ar';

export type ProcessingStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'error';

export interface ImageStats {
  charCount: number;
  wordCount: number;
  emojiCount: number;
  lineCount: number;
  processingTimeMs: number;
}

export interface ProcessedImage {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  base64: string;
  mimeType: string;
  status: ProcessingStatus;
  extractedText: string;
  errorMsg?: string;
  stats?: ImageStats;
  timestamp: number;
}

export interface GeminiModelInfo {
  name: string;
  displayName: string;
  version: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedGenerationMethods: string[];
  isMultimodal: boolean;
  isRecommended?: boolean;
}

export interface ExportConfig {
  format: 'txt' | 'pdf' | 'md' | 'json';
  includeMetadata: boolean;
  includeStats: boolean;
  documentTitle: string;
  authorName: string;
}

export interface AppSettings {
  apiKey: string;
  selectedModel: string;
  autoDetectModel: boolean;
  temperature: number;
  language: SupportedLanguage;
  darkMode: boolean;
  preserveFormatting: boolean;
  extractEmojis: boolean;
}

