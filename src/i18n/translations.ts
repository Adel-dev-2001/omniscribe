import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  badgeScholarship: string;
  navWorkspace: string;
  navFeatures: string;
  navArchitecture: string;
  navBenchmarks: string;
  navFaq: string;
  navDocs: string;
  navGithub: string;
  navSettings: string;
  
  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitleGradient: string;
  heroSubtitle: string;
  heroCtaUpload: string;
  heroCtaDemo: string;
  heroMetricImages: string;
  heroMetricImagesSub: string;
  heroMetricEmoji: string;
  heroMetricEmojiSub: string;
  heroMetricLatency: string;
  heroMetricLatencySub: string;
  heroMetricLongevity: string;
  heroMetricLongevitySub: string;

  // Workspace Studio
  studioTitle: string;
  studioSubtitle: string;
  loadDemoSamplesBtn: string;
  demoLoadedToast: string;

  // API & Model Config
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  apiKeyHelp: string;
  clearKeyBtn: string;
  apiKeySaved: string;
  apiKeyInvalid: string;
  modelSelectorLabel: string;
  autoDetectBtn: string;
  detectingModel: string;
  currentModel: string;
  modelDetectedSuccess: string;
  freeTierBadge: string;
  latestVersionBadge: string;
  activeModelTooltip: string;
  
  // Dropzone
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  dropzoneLimitNotice: string;
  dropzoneFormatsNotice: string;
  dropzoneMaxFilesReached: string;
  dropzoneDuplicateFiles: string;
  
  // Batch Actions
  totalImages: string;
  readyToProcess: string;
  processedCount: string;
  clearAllBtn: string;
  extractAllBtn: string;
  processingBtn: string;
  stopBtn: string;
  exportMergedBtn: string;
  
  // Card Actions
  extractSingleBtn: string;
  removeImageBtn: string;
  viewResultBtn: string;
  copyTextBtn: string;
  copiedBtn: string;
  statusIdle: string;
  statusQueued: string;
  statusProcessing: string;
  statusCompleted: string;
  statusError: string;
  
  // Stats & Info
  charsLabel: string;
  wordsLabel: string;
  emojisLabel: string;
  timeLabel: string;
  previewTitle: string;
  rawTextTab: string;
  formattedTab: string;
  editTextTab: string;
  saveChangesBtn: string;
  
  // Export Modal
  exportModalTitle: string;
  exportModalDesc: string;
  formatLabel: string;
  formatTxt: string;
  formatPdf: string;
  formatMd: string;
  formatJson: string;
  includeMetadataLabel: string;
  includeStatsLabel: string;
  documentTitleLabel: string;
  downloadBtn: string;
  exportSuccess: string;
  
  // Settings Modal
  settingsTitle: string;
  promptSettingsTitle: string;
  preserveFormattingLabel: string;
  preserveFormattingDesc: string;
  extractEmojisLabel: string;
  extractEmojisDesc: string;
  temperatureLabel: string;
  saveSettingsBtn: string;
  closeBtn: string;
  
  // Future-Proofing / Gemini Dynamic Discovery
  dynamicDiscoveryTitle: string;
  dynamicDiscoveryDesc: string;
  modelsFound: string;
  recommendedModel: string;
  manualOverride: string;
  testConnectionBtn: string;
  connectionSuccess: string;
  connectionFail: string;

  // Features Section
  featuresTitle: string;
  featuresSubtitle: string;
  f1Title: string;
  f1Desc: string;
  f2Title: string;
  f2Desc: string;
  f3Title: string;
  f3Desc: string;
  f4Title: string;
  f4Desc: string;
  f5Title: string;
  f5Desc: string;
  f6Title: string;
  f6Desc: string;

  // Comparison Section
  comparisonTitle: string;
  comparisonSubtitle: string;
  compColFeature: string;
  compColLegacy: string;
  compColOmni: string;
  compR1Name: string;
  compR1Legacy: string;
  compR1Omni: string;
  compR2Name: string;
  compR2Legacy: string;
  compR2Omni: string;
  compR3Name: string;
  compR3Legacy: string;
  compR3Omni: string;
  compR4Name: string;
  compR4Legacy: string;
  compR4Omni: string;
  compR5Name: string;
  compR5Legacy: string;
  compR5Omni: string;

  // How It Works
  howTitle: string;
  howSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Academic Statement Box
  academicTitle: string;
  academicSubtitle: string;
  academicRole: string;
  academicUnivs: string;

  // FAQ
  faqTitle: string;
  faqSubtitle: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
  q4: string;
  a4: string;

  // Empty state & Error messages
  emptyStateTitle: string;
  emptyStateDesc: string;
  missingKeyWarning: string;
  quotaExceededTitle: string;
  quotaExceededWarning: string;
  changeKeyBtn: string;
  networkErrorWarning: string;
  noTextFound: string;
  setApiKeyBtn: string;
  modalStatusScanning: string;
  modalScanningSub: string;
  modalLiveVerifiedBadge: string;
  modalLiveVerifiedDesc: string;
  modalNoModelTitle: string;
  modalNoModelDesc: string;
  f1Tag: string;
  f2Tag: string;
  f3Tag: string;
  f5Tag: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appTitle: "OmniScribe",
    appSubtitle: "Autonomous Multimodal Vision OCR & Emoji Extractor",
    badgeScholarship: "Russian Government Scholarship Portfolio 2026/2027",
    navWorkspace: "Studio Workspace",
    navFeatures: "Capabilities",
    navArchitecture: "Architecture",
    navBenchmarks: "Benchmarks",
    navFaq: "FAQ",
    navDocs: "Documentation",
    navGithub: "GitHub Repository",
    navSettings: "Model Engine",

    heroBadge: "Next-Gen Vision Engine • v2.4 Production Ready",
    heroTitle1: "Extract Multilingual Text & Emojis With",
    heroTitleGradient: "100% Neural Precision.",
    heroSubtitle: "Engineered for autonomous multimodal document intelligence. Eliminates Unicode emoji loss, handles batch ingestion up to 20 images, and auto-binds to the newest Gemini vision models for perpetual longevity.",
    heroCtaUpload: "Launch Studio Workspace",
    heroCtaDemo: "Load Demo Samples (1-Click)",
    heroMetricImages: "Up to 20 Images",
    heroMetricImagesSub: "Concurrent batch ingestion",
    heroMetricEmoji: "100% Unicode Emojis",
    heroMetricEmojiSub: "Zero character loss",
    heroMetricLatency: "Sub-Second Latency",
    heroMetricLatencySub: "Flash multimodal speed",
    heroMetricLongevity: "Smart Model Discovery",
    heroMetricLongevitySub: "Auto-binds latest version",

    studioTitle: "Document Intelligence Studio",
    studioSubtitle: "Drag & drop images below, inspect extracted Unicode streams, and export consolidated PDF or TXT reports.",
    loadDemoSamplesBtn: "Load Demo Challenge Files",
    demoLoadedToast: "3 Challenge samples loaded into workspace!",

    apiKeyLabel: "Google Gemini API Key",
    apiKeyPlaceholder: "Paste your AI Studio API key (AIzaSy...)",
    apiKeyHelp: "Your key stays safely stored in browser localStorage. Never sent to any third-party server.",
    clearKeyBtn: "Clear",
    apiKeySaved: "API Key safely configured",
    apiKeyInvalid: "Please enter a valid Gemini API key",
    modelSelectorLabel: "Active Gemini Vision Model",
    autoDetectBtn: "Smart Auto-Detect",
    detectingModel: "Scanning API for latest multimodal models...",
    currentModel: "Active Model",
    modelDetectedSuccess: "Successfully connected and bound to latest model",
    freeTierBadge: "Free Tier Optimized",
    latestVersionBadge: "Latest Model Active",
    activeModelTooltip: "Live API status: Connected to Google's newest generation model",

    dropzoneTitle: "Drop up to 20 images here, or browse files",
    dropzoneSubtitle: "Supports high-resolution PNG, JPG, JPEG, WEBP, and screenshots",
    dropzoneLimitNotice: "Max 20 images per batch • Drag & drop or click to upload",
    dropzoneFormatsNotice: "OCR engine extracts complex formatting, multilingual scripts & all Unicode emojis",
    dropzoneMaxFilesReached: "Maximum batch limit (20 images) reached",
    dropzoneDuplicateFiles: "Duplicate images were ignored",

    totalImages: "Total Images",
    readyToProcess: "Ready to Process",
    processedCount: "Processed",
    clearAllBtn: "Clear",
    extractAllBtn: "Extract",
    processingBtn: "Extracting Text & Emojis...",
    stopBtn: "Stop",
    exportMergedBtn: "Export",

    extractSingleBtn: "Extract Image",
    removeImageBtn: "Remove",
    viewResultBtn: "Inspect Output",
    copyTextBtn: "Copy Text",
    copiedBtn: "Copied to Clipboard!",
    statusIdle: "Ready",
    statusQueued: "Queued",
    statusProcessing: "Recognizing...",
    statusCompleted: "Extracted",
    statusError: "Failed",

    charsLabel: "Characters",
    wordsLabel: "Words",
    emojisLabel: "Emojis",
    timeLabel: "Latency",
    previewTitle: "Extracted Content & Emoji Stream",
    rawTextTab: "Raw Text & Emojis",
    formattedTab: "Formatted Preview",
    editTextTab: "Edit in Place",
    saveChangesBtn: "Save Changes",

    exportModalTitle: "Consolidate & Export Results",
    exportModalDesc: "Merge all extracted texts into an academic-grade structured document with clean typography and metadata.",
    formatLabel: "Output Format",
    formatTxt: "Structured Text File (.txt)",
    formatPdf: "Clean High-Res PDF (.pdf)",
    formatMd: "Markdown Document (.md)",
    formatJson: "Structured JSON Dataset (.json)",
    includeMetadataLabel: "Include Image Metadata & Timestamp Headers",
    includeStatsLabel: "Include Quantitative Stats (Word / Char / Emoji Counts)",
    documentTitleLabel: "Document Header Title",
    downloadBtn: "Download File",
    exportSuccess: "Document generated and downloaded successfully!",

    settingsTitle: "Engine & Model Configuration",
    promptSettingsTitle: "Extraction Behavior",
    preserveFormattingLabel: "Preserve Spatial Layout & Tables",
    preserveFormattingDesc: "Maintains indented lists, markdown tables, code syntax, and paragraph line breaks.",
    extractEmojisLabel: "Strict Unicode Emoji & Symbol Fidelity",
    extractEmojisDesc: "Captures 100% of emojis (😀, 🚀, 💻, flags, skin-tone modifiers) without dropping symbols.",
    temperatureLabel: "Sampling Temperature (0.0 = Deterministic Accuracy)",
    saveSettingsBtn: "Save & Apply Changes",
    closeBtn: "Close",

    dynamicDiscoveryTitle: "Smart Dynamic Model Discovery",
    dynamicDiscoveryDesc: "Queries Google's live catalog via models.list to automatically detect and bind to the latest free multimodal model available.",
    modelsFound: "Available Compatible Models Found",
    recommendedModel: "Recommended Autonomous Choice",
    manualOverride: "Manual Model Selection",
    testConnectionBtn: "Test Connection & Query Models",
    connectionSuccess: "Gemini API handshake successful! Model catalog synchronized.",
    connectionFail: "Connection failed. Please verify your API key and network connection.",

    featuresTitle: "Core System Capabilities",
    featuresSubtitle: "High-precision multimodal vision engineered for instant, verbatim text and Unicode emoji extraction.",
    f1Title: "Live Model Auto-Discovery",
    f1Desc: "Instantly binds to Google's newest multimodal vision engine via models.list with zero manual setup.",
    f2Title: "100% Unicode Emoji Matrix",
    f2Desc: "Captures emojis, flags, ZWJ sequences, and skin tones directly into native Unicode glyphs without loss.",
    f3Title: "High-Speed Batch Pipeline",
    f3Desc: "Processes up to 20 images in rapid succession with optimized memory and deterministic execution.",
    f4Title: "Instant Direct Multi-Format Export",
    f4Desc: "Direct 1-click downloads to PDF, TXT, Markdown, and JSON with zero print dialogs or popups.",
    f5Title: "Client-Side Zero-Knowledge Privacy",
    f5Desc: "Direct browser-to-Google communication. API keys stay local and no image data is ever stored.",
    f6Title: "Trilingual System (EN / RU / AR)",
    f6Desc: "Grammatically flawless translation in English, Russian, and Arabic with bidirectional auto-switching layout.",

    comparisonTitle: "Benchmark: OmniScribe vs Legacy OCR",
    comparisonSubtitle: "Direct technical evaluation comparing modern multimodal vision against traditional OCR libraries.",
    compColFeature: "Capability",
    compColLegacy: "Legacy OCR (Tesseract / EasyOCR)",
    compColOmni: "OmniScribe (Gemini Multimodal)",
    compR1Name: "Emoji & Unicode Symbols",
    compR1Legacy: "❌ Dropped, replaced with '?' or noise",
    compR1Omni: "✅ 100% Faithful Unicode Transcription",
    compR2Name: "Layout & Markdown Tables",
    compR2Legacy: "❌ Collapses column structure",
    compR2Omni: "✅ Perfect table & spatial preservation",
    compR3Name: "Multilingual Cyrillic & Arabic",
    compR3Legacy: "⚠️ Frequent segmentation & font errors",
    compR3Omni: "✅ Native high-precision transcription",
    compR4Name: "API Drift & Model Deprecation",
    compR4Legacy: "❌ Manual retraining or breaks on update",
    compR4Omni: "✅ Auto-negotiates latest API version",
    compR5Name: "Document Merge Engine",
    compR5Legacy: "❌ Requires custom script chaining",
    compR5Omni: "✅ 1-Click Consolidated PDF / TXT / JSON",

    howTitle: "How the Pipeline Works",
    howSubtitle: "A three-phase autonomous vision pipeline designed for maximum reproducibility.",
    step1Title: "1. Batch Ingestion & Validation",
    step1Desc: "Upload up to 20 files. In-browser canvas extracts base64 payloads and validates dimensions without server uploads.",
    step2Title: "2. Autonomous Model Introspection",
    step2Desc: "Queries Google Gemini endpoint to discover the freshest multimodal model, applying deterministic OCR directives.",
    step3Title: "3. Unicode Decoding & Consolidation",
    step3Desc: "Extracts formatted text, separates emoji streams, and compiles consolidated reports ready for publication.",

    academicTitle: "Academic Statement for Russian Government Scholarship",
    academicSubtitle: "Submitted for the Open Doors Olympiad / Russian Government Scholarship in Computer Science & Artificial Intelligence.",
    academicRole: "Candidate: Adel • Focus: Multimodal NLP, Computer Vision & Distributed Systems",
    academicUnivs: "Target Institutions: HSE University (НИУ ВШЭ), ITMO (ИТМО), MIPT (МФТИ), MSU (МГУ)",

    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Everything you need to know about the architecture, key security, and model binding.",
    q1: "How does Dynamic Model Discovery work?",
    a1: "The platform does not hardcode model names. When initialized, it queries Google's live models catalog, evaluates generation methods, parses major/minor version numbers, and automatically binds to the newest available free-tier model.",
    q2: "Is my Gemini API key secure?",
    a2: "Yes. OmniScribe is a 100% client-side Single Page Application. Your key is stored in your local browser storage and is transmitted directly to Google's official endpoints. No third-party server ever intercepts your credentials.",
    q3: "Can I export all 20 images into one combined PDF or TXT?",
    a3: "Yes. The batch export engine compiles all completed extractions into a unified document with ASCII headers, metadata, word/emoji counts, and vector styling for PDF printing.",
    q4: "What image formats are supported?",
    a4: "OmniScribe supports PNG, JPEG, JPG, WEBP, and high-DPI screenshots containing mixed handwriting, printed text, code, and emojis.",

    emptyStateTitle: "Studio Workspace is Empty",
    emptyStateDesc: "Upload your images above or click 'Load Demo Challenge Files' to test the full pipeline in 1 click.",
    missingKeyWarning: "Gemini API key is required to perform multimodal vision extraction. Please configure your key in the header.",
    quotaExceededTitle: "API Quota Limit Reached",
    quotaExceededWarning: "API rate limit or quota reached for this minute. Please wait 60 seconds or switch your API key in settings.",
    changeKeyBtn: "Change Key",
    networkErrorWarning: "Network connectivity issue while contacting Gemini API.",
    noTextFound: "No readable text or emojis detected in this image.",
    setApiKeyBtn: "Set API Key",
    modalStatusScanning: "Connecting live to Google Gemini API...",
    modalScanningSub: "Querying models.list to select the newest free vision model",
    modalLiveVerifiedBadge: "Live Google Connected ✓",
    modalLiveVerifiedDesc: "Verified with Google models.list • Ready for Multimodal Vision OCR",
    modalNoModelTitle: "No Model Connected Yet",
    modalNoModelDesc: "Enter your Google Gemini API key above and click \"Test Connection & Query Models\" to query Google live and bind the latest model.",
    f1Tag: "Live Discovery",
    f2Tag: "100% Fidelity",
    f3Tag: "High Speed",
    f5Tag: "Zero-Knowledge"
  },

  ru: {
    appTitle: "OmniScribe",
    appSubtitle: "Мультимодальное распознавание текста и эмодзи на базе Gemini API",
    badgeScholarship: "Портфолио для правительственной стипендии РФ 2026/2027",
    navWorkspace: "Рабочая студия",
    navFeatures: "Возможности",
    navArchitecture: "Архитектура",
    navBenchmarks: "Бенчмарки",
    navFaq: "FAQ",
    navDocs: "Документация",
    navGithub: "Репозиторий GitHub",
    navSettings: "Движок моделей",

    heroBadge: "Нейросетевой OCR движок нового поколения • v2.4 Production",
    heroTitle1: "Распознавание многоязычного текста и эмодзи с",
    heroTitleGradient: "100% нейронной точностью.",
    heroSubtitle: "Разработано для автономного интеллектуального анализа документов. Исключает потерю эмодзи Unicode, обрабатывает до 20 изображений в пакете и автоматически подключает новейшие модели Gemini для долговечной работы.",
    heroCtaUpload: "Открыть студию OCR",
    heroCtaDemo: "Загрузить демо-примеры (1 клик)",
    heroMetricImages: "До 20 изображений",
    heroMetricImagesSub: "Параллельная пакетная очередь",
    heroMetricEmoji: "100% Unicode эмодзи",
    heroMetricEmojiSub: "Без искажения символов",
    heroMetricLatency: "Субсекундный отклик",
    heroMetricLatencySub: "Высокая скорость Flash",
    heroMetricLongevity: "Умный выбор модели",
    heroMetricLongevitySub: "Авто-подключение к API",

    studioTitle: "Студия интеллектуального анализа документов",
    studioSubtitle: "Перетащите изображения, просматривайте поток эмодзи и экспортируйте объединенные отчеты в PDF или TXT.",
    loadDemoSamplesBtn: "Загрузить тестовые файлы",
    demoLoadedToast: "3 демонстрационных файла добавлены в студию!",

    apiKeyLabel: "Ключ Google Gemini API",
    apiKeyPlaceholder: "Вставьте ваш API-ключ из Google AI Studio (AIzaSy...)",
    apiKeyHelp: "Ключ безопасно хранится локально в браузере (localStorage) и не передается сторонним серверам.",
    clearKeyBtn: "Очистить",
    apiKeySaved: "API-ключ успешно настроен",
    apiKeyInvalid: "Пожалуйста, введите корректный ключ Gemini API",
    modelSelectorLabel: "Активная модель Gemini Vision",
    autoDetectBtn: "Авто-поиск новейшей модели",
    detectingModel: "Сканирование API на наличие актуальных мультимодальных моделей...",
    currentModel: "Активная модель",
    modelDetectedSuccess: "Успешное подключение и привязка к новейшей доступной модели",
    freeTierBadge: "Оптимально для бесплатного тарифа",
    latestVersionBadge: "Новейшая модель активна",
    activeModelTooltip: "Статус API: Подключено к самой новой модели Google",

    dropzoneTitle: "Перетащите до 20 изображений сюда или выберите файлы",
    dropzoneSubtitle: "Поддерживаются PNG, JPG, JPEG, WEBP и скриншоты любого разрешения",
    dropzoneLimitNotice: "Максимум 20 изображений в пакете • Drag & Drop или клик для загрузки",
    dropzoneFormatsNotice: "Интеллектуальное извлечение верстки, многоязычного текста и всех символов эмодзи",
    dropzoneMaxFilesReached: "Достигнут лимит пакета (максимум 20 изображений)",
    dropzoneDuplicateFiles: "Повторяющиеся изображения пропущены",

    totalImages: "Всего изображений",
    readyToProcess: "Готово к обработке",
    processedCount: "Обработано",
    clearAllBtn: "Очистить",
    extractAllBtn: "Извлечь",
    processingBtn: "Извлечение текста и эмодзи...",
    stopBtn: "Стоп",
    exportMergedBtn: "Экспорт",

    extractSingleBtn: "Распознать это фото",
    removeImageBtn: "Удалить",
    viewResultBtn: "Просмотр результата",
    copyTextBtn: "Копировать текст",
    copiedBtn: "Скопировано в буфер!",
    statusIdle: "Готов",
    statusQueued: "В очереди",
    statusProcessing: "Распознавание...",
    statusCompleted: "Завершено",
    statusError: "Ошибка",

    charsLabel: "Символов",
    wordsLabel: "Слов",
    emojisLabel: "Эмодзи",
    timeLabel: "Время",
    previewTitle: "Извлеченный текст и поток эмодзи",
    rawTextTab: "Исходный текст и эмодзи",
    formattedTab: "Форматированный просмотр",
    editTextTab: "Редактировать на месте",
    saveChangesBtn: "Сохранить правки",

    exportModalTitle: "Объединение и экспорт результатов",
    exportModalDesc: "Объедините все извлеченные тексты в единый структурированный академический документ с метаданными.",
    formatLabel: "Формат экспорта",
    formatTxt: "Структурированный текстовый файл (.txt)",
    formatPdf: "Печатный документ PDF (.pdf)",
    formatMd: "Документ Markdown (.md)",
    formatJson: "Структурированный датасет JSON (.json)",
    includeMetadataLabel: "Включить метаданные изображений и временные метки",
    includeStatsLabel: "Включить количественную статистику (слов, символов, эмодзи)",
    documentTitleLabel: "Заголовок документа",
    downloadBtn: "Скачать файл",
    exportSuccess: "Документ успешно сгенерирован и скачан!",

    settingsTitle: "Конфигурация нейросетевого движка",
    promptSettingsTitle: "Параметры распознавания",
    preserveFormattingLabel: "Сохранять структуру и таблицы",
    preserveFormattingDesc: "Сохраняет списки с отступами, markdown-таблицы, фрагменты кода и разрывы строк.",
    extractEmojisLabel: "Точное распознавание всех Unicode эмодзи и символов",
    extractEmojisDesc: "Гарантирует 100% извлечение эмодзи (😀, 🚀, 💻, флаги, модификаторы тона) без искажений.",
    temperatureLabel: "Температура генерации (0.0 = максимальная точность OCR)",
    saveSettingsBtn: "Сохранить и применить",
    closeBtn: "Закрыть",

    dynamicDiscoveryTitle: "Динамическое обнаружение моделей",
    dynamicDiscoveryDesc: "Опрашивает каталог моделей Google (models.list) и автоматически подключает самую новую бесплатную модель машинного зрения.",
    modelsFound: "Найдено совместимых моделей",
    recommendedModel: "Рекомендуемая модель",
    manualOverride: "Ручной выбор модели",
    testConnectionBtn: "Проверить подключение и список моделей",
    connectionSuccess: "Подключение к Gemini API успешно! Каталог моделей обновлен.",
    connectionFail: "Ошибка подключения. Проверьте правильность API-ключа и доступ в интернет.",

    featuresTitle: "Ключевые возможности системы",
    featuresSubtitle: "Высокоточные нейросетевые алгоритмы мультимодального распознавания текста и символов Unicode.",
    f1Title: "Динамическое обнаружение моделей",
    f1Desc: "Мгновенное подключение к новейшим моделям Google Gemini через models.list без изменения кода.",
    f2Title: "100% точность эмодзи и Unicode",
    f2Desc: "Точное извлечение всех эмодзи, составных символов ZWJ, флагов и оттенков кожи в оригинальном Unicode.",
    f3Title: "Скоростная пакетная очередь",
    f3Desc: "Быстрая параллельная обработка до 20 изображений с минимальной задержкой и стабильной скоростью.",
    f4Title: "Прямой экспорт без диалогов печати",
    f4Desc: "Мгновенное скачивание файлов PDF, TXT, Markdown и JSON в один клик прямо на ваше устройство.",
    f5Title: "Полная клиентская конфиденциальность",
    f5Desc: "Прямая связь браузера с серверами Google. Ключи хранятся локально, изображения не сохраняются.",
    f6Title: "Трехъязычный интерфейс (EN / RU / AR)",
    f6Desc: "Выверенная терминология на английском, русском и арабском языках с поддержкой двунаправленного текста.",

    comparisonTitle: "Сравнение: OmniScribe и классический OCR",
    comparisonSubtitle: "Технический анализ современных мультимодальных нейросетей против традиционных систем OCR.",
    compColFeature: "Параметр",
    compColLegacy: "Классический OCR (Tesseract / EasyOCR)",
    compColOmni: "OmniScribe (Gemini Multimodal)",
    compR1Name: "Эмодзи и Unicode символы",
    compR1Legacy: "❌ Теряются или заменяются на '?'",
    compR1Omni: "✅ 100% точное извлечение символов Unicode",
    compR2Name: "Сложная верстка и таблицы",
    compR2Legacy: "❌ Слипаются колонки и строки",
    compR2Omni: "✅ Идеальное сохранение таблиц и списков",
    compR3Name: "Кириллица и арабская вязь",
    compR3Legacy: "⚠️ Частые ошибки сегментации",
    compR3Omni: "✅ Высокоточное нативное распознавание",
    compR4Name: "Устаревание версий API",
    compR4Legacy: "❌ Требует ручной перенастройки",
    compR4Omni: "✅ Автоматический переход на новые версии",
    compR5Name: "Объединение документов",
    compR5Legacy: "❌ Требуются сторонние скрипты",
    compR5Omni: "✅ Экспорт в один клик (PDF / TXT / JSON)",

    howTitle: "Как работает конвейер обработки",
    howSubtitle: "Трехэтапный автономный процесс, обеспечивающий максимальную надежность.",
    step1Title: "1. Пакетная загрузка и валидация",
    step1Desc: "Загрузка до 20 файлов с клиентской проверкой размеров и генерацией base64 без отправки на промежуточные серверы.",
    step2Title: "2. Динамическая интроспекция модели",
    step2Desc: "Запрос к каталогу Gemini для выбора актуальной модели с применением жестких инструкций OCR.",
    step3Title: "3. Декодирование Unicode и экспорт",
    step3Desc: "Извлечение структурированного текста, выделение потока эмодзи и формирование объединенного отчета.",

    academicTitle: "Академическое заявление для приемной комиссии РФ",
    academicSubtitle: "Разработано для портфолио правительственной стипендии (Open Doors / Россотрудничество) по направлению 'Компьютерные науки'.",
    academicRole: "Кандидат: Adel Mohamed • Профиль: Мультимодальный NLP, Машинное зрение и Распределенные интерфейсы",
    academicUnivs: "Целевые университеты: НИУ ВШЭ, Университет ИТМО, МФТИ, МГУ им. Ломоносова",

    faqTitle: "Часто задаваемые вопросы",
    faqSubtitle: "Технические подробности архитектуры, безопасности и привязки моделей.",
    q1: "Как устроен алгоритм динамического выбора модели?",
    a1: "Приложение не использует жестко заданные имена моделей. При старте оно опрашивает каталог Google API, парсит номера версий и связывает интерфейс с самой актуальной бесплатной моделью.",
    q2: "Безопасен ли мой API-ключ Gemini?",
    a2: "Абсолютно. OmniScribe работает полностью на стороне клиента. Ключ хранится в localStorage браузера и отправляется напрямую на серверы Google без посредников.",
    q3: "Можно ли объединить все 20 изображений в один файл PDF или TXT?",
    a3: "Да. Модуль экспорта формирует единый структурированный документ с разделителями, метаданными, подсчетом слов и эмодзи.",
    q4: "Какие форматы изображений поддерживаются?",
    a4: "Поддерживаются форматы PNG, JPEG, JPG, WEBP и скриншоты любого разрешения со сложным текстом, таблицами и формулами.",

    emptyStateTitle: "Рабочая область пуста",
    emptyStateDesc: "Загрузите изображения выше или нажмите кнопку 'Загрузить тестовые файлы' для мгновенной проверки возможностей.",
    missingKeyWarning: "Для работы мультимодального OCR необходим ключ Gemini API. Пожалуйста, укажите его в шапке сайта.",
    quotaExceededTitle: "Лимит квоты API исчерпан",
    quotaExceededWarning: "Превышен минутный лимит запросов к Google Gemini API. Подождите 60 секунд или используйте другой ключ.",
    changeKeyBtn: "Сменить ключ",
    networkErrorWarning: "Ошибка соединения при обращении к серверу Gemini API.",
    noTextFound: "В данном изображении не обнаружено распознаваемого текста или эмодзи.",
    setApiKeyBtn: "Подключить API",
    modalStatusScanning: "Прямое подключение к серверам Google Gemini...",
    modalScanningSub: "Запрос models.list для выбора актуальной модели",
    modalLiveVerifiedBadge: "Подключено к Google ✓",
    modalLiveVerifiedDesc: "Модель проверена через каталог Google Gemini и готова к распознаванию",
    modalNoModelTitle: "Модель еще не привязана",
    modalNoModelDesc: "Введите ключ Google Gemini API выше и нажмите кнопку проверки, чтобы связать сервис с новейшей моделью.",
    f1Tag: "Live API",
    f2Tag: "Unicode 100%",
    f3Tag: "Высокая скорость",
    f5Tag: "Zero-Knowledge"
  },

  ar: {
    appTitle: "OmniScribe",
    appSubtitle: "نظام ذكي متكامل لاستخراج النصوص والإيموجي بالرؤية الحاسوبية",
    badgeScholarship: "مشروع محفظة المنحة الحكومية الروسية 2026/2027",
    navWorkspace: "مساحة العمل (Studio)",
    navFeatures: "المزايا الفائقة",
    navArchitecture: "المعمارية البرمجية",
    navBenchmarks: "المقارنات التقنية",
    navFaq: "الأسئلة الشائعة",
    navDocs: "التوثيق البرمجي",
    navGithub: "مستودع GitHub",
    navSettings: "محرك النماذج",

    heroBadge: "محرك رؤية بصرية من الجيل التالي • جاهز للإنتاج البرمجي v2.4",
    heroTitle1: "استخراج النصوص المتعددة والرموز التعبيرية بدقة",
    heroTitleGradient: "100% عصبية فائقة.",
    heroSubtitle: "مُهندس لمعالجة المستندات المعقدة ذاتياً. يقضي تماماً على فقدان الإيموجي والرموز، يستوعب حتى 20 صورة في الدفعة الواحدة، ويتصل ذاتياً بأحدث نماذج Gemini المتاحة لضمان بقائه فعالاً على مر العقود.",
    heroCtaUpload: "فتح مساحة عمل الاستوديو",
    heroCtaDemo: "تحميل صور تجريبية (بضغطة واحدة)",
    heroMetricImages: "حتى 20 صورة",
    heroMetricImagesSub: "معالجة متزامنة متطورة",
    heroMetricEmoji: "100% إيموجي Unicode",
    heroMetricEmojiSub: "انعدام فقدان الرموز",
    heroMetricLatency: "استجابة فائقة السرعة",
    heroMetricLatencySub: "أداء مذهل عبر Flash",
    heroMetricLongevity: "اكتشاف تلقائي ذكي",
    heroMetricLongevitySub: "تحديث فوري لأحدث النماذج",

    studioTitle: "استوديو استخراج النصوص والذكاء البصري",
    studioSubtitle: "اسحب الصور وأفلتها بالأسفل، عاين تدفق الرموز التعبيرية المستخرجة، وصدر التقرير المدمج كـ PDF أو TXT بنقرة واحدة.",
    loadDemoSamplesBtn: "تحميل نماذج تجريبية لاختبار المنظومة",
    demoLoadedToast: "تم تحميل 3 نماذج تجريبية داخل مساحة العمل بنجاح!",

    apiKeyLabel: "مفتاح Google Gemini API",
    apiKeyPlaceholder: "ضع مفتاحك من Google AI Studio هنا (AIzaSy...)",
    apiKeyHelp: "يتم حفظ المفتاح بأمان داخل متصفحك محلياً (localStorage) ولا يُرسل لأي خادم وسيط إطلاقاً.",
    clearKeyBtn: "مسح",
    apiKeySaved: "تم ضبط مفتاح الـ API بنجاح",
    apiKeyInvalid: "يرجى إدخال مفتاح Gemini API صالح",
    modelSelectorLabel: "نموذج الرؤية البصرية النشط في Gemini",
    autoDetectBtn: "اكتشاف تلقائي ذكي",
    detectingModel: "جاري فحص الـ API لاكتشاف أحدث نماذج الرؤية المتاحة...",
    currentModel: "النموذج النشط",
    modelDetectedSuccess: "تم الاتصال بنجاح وربط الأداة بأحدث نموذج متوفر",
    freeTierBadge: "متوافق مع الخطة المجانية",
    latestVersionBadge: "أحدث إصدار يعمل الآن",
    activeModelTooltip: "حالة الـ API: متصل بأحدث نموذج تم إطلاقه من جوجل",

    dropzoneTitle: "اسحب حتى 20 صورة وأفلتها هنا، أو اضغط للاختيار",
    dropzoneSubtitle: "يدعم صيغ PNG و JPG و JPEG و WEBP ولقطات الشاشة بكافة الدقات",
    dropzoneLimitNotice: "الحد الأقصى 20 صورة في الدفعة الواحدة • سحب وإفلات أو رفع مباشر",
    dropzoneFormatsNotice: "محرك دقيق يستخرج التنسيقات، اللغات المتعددة، وكافة الرموز التعبيرية والإيموجي",
    dropzoneMaxFilesReached: "تم الوصول إلى الحد الأقصى للمجموعة (20 صورة)",
    dropzoneDuplicateFiles: "تم تجاهل الصور المكررة تلقائياً",

    totalImages: "إجمالي الصور",
    readyToProcess: "جاهز للمعالجة",
    processedCount: "تمت معالجته",
    clearAllBtn: "حذف",
    extractAllBtn: "استخراج",
    processingBtn: "جاري استخراج النصوص والإيموجي...",
    stopBtn: "إيقاف",
    exportMergedBtn: "تحميل",

    extractSingleBtn: "استخراج هذه الصورة",
    removeImageBtn: "حذف",
    viewResultBtn: "معاينة النتيجة",
    copyTextBtn: "نسخ النص",
    copiedBtn: "تم النسخ إلى الحافظة!",
    statusIdle: "جاهز",
    statusQueued: "في قائمة الانتظار",
    statusProcessing: "جاري الاستخراج...",
    statusCompleted: "مكتمل",
    statusError: "حدث خطأ",

    charsLabel: "الحروف",
    wordsLabel: "الكلمات",
    emojisLabel: "الإيموجي",
    timeLabel: "زمن الاستجابة",
    previewTitle: "النص المستخرج والرموز التعبيرية",
    rawTextTab: "النص الخام والإيموجي",
    formattedTab: "المعاينة المنسقة",
    editTextTab: "تعديل فوري للنص",
    saveChangesBtn: "حفظ التعديلات",

    exportModalTitle: "دمج وتصدير النتائج",
    exportModalDesc: "دمج نصوص جميع الصور المستخرجة في مستند منسق أكاديمي فائق الدقة مع البيانات التعريفية.",
    formatLabel: "صيغة التصدير",
    formatTxt: "ملف نصي منظم (.txt)",
    formatPdf: "مستند بي دي إف عالي الدقة (.pdf)",
    formatMd: "مستند ماركداون (.md)",
    formatJson: "مجموعة بيانات مهيكلة JSON (.json)",
    includeMetadataLabel: "تضمين معلومات الصور وتوقيت المعالجة",
    includeStatsLabel: "تضمين الإحصائيات الدقيقة (عدد الكلمات، الحروف، والإيموجي)",
    documentTitleLabel: "عنوان المستند الرئيسي",
    downloadBtn: "تحميل الملف الآن",
    exportSuccess: "تم إنشاء الملف وتحميله بنجاح!",

    settingsTitle: "إعدادات محرك الذكاء الاصطناعي",
    promptSettingsTitle: "خصائص المعالجة والاستخراج",
    preserveFormattingLabel: "الحفاظ على التنسيق المكاني والجداول",
    preserveFormattingDesc: "يحافظ على القوائم النقطية، جداول الماركداون، الأكواد البرمجية وفواصل الأسطر بدقة.",
    extractEmojisLabel: "التقاط فائق لجميع الإيموجي والرموز التعبيرية",
    extractEmojisDesc: "يضمن استخراج 100% من الإيموجي (😀، 🚀، 💻، الأعلام، ودرجات البشرة) بدون أي فقدان.",
    temperatureLabel: "درجة الابتكارية / الدقة (0.0 = أقصى دقة حرفية لـ OCR)",
    saveSettingsBtn: "حفظ وتطبيق التغييرات",
    closeBtn: "إغلاق",

    dynamicDiscoveryTitle: "استكشاف ديناميكي ذكي للنماذج",
    dynamicDiscoveryDesc: "استعلام مباشر من كتالوج جوجل عبر models.list لربط المنظومة بأحدث نموذج رؤية بصرية مجاني متاح تلقائياً.",
    modelsFound: "النماذج المتوافقة المكتشفة",
    recommendedModel: "النموذج الذاتي الموصى به",
    manualOverride: "اختيار النموذج يدوياً",
    testConnectionBtn: "اختبار الاتصال وجلب النماذج",
    connectionSuccess: "تم الاتصال بنجاح بـ Gemini API وتحديث قائمة النماذج!",
    connectionFail: "فشل الاتصال. يرجى التأكد من صحة المفتاح واتصال الإنترنت.",

    featuresTitle: "إمكانيات فائقة لاستخراج ذكي وفوري",
    featuresSubtitle: "منظومة رؤية حاسوبية متطورة لاستخراج النصوص والرموز التعبيرية بأعلى دقة وسرعة استجابة.",
    f1Title: "ربط تلقائي بأحدث النماذج",
    f1Desc: "استعلام مباشر يربط الأداة بأحدث نماذج الرؤية من Google فور إطلاقها دون أي تعديل في الكود.",
    f2Title: "استخراج 100% للإيموجي والرموز",
    f2Desc: "التقاط فائق لجميع الإيموجي والأعلام ومعدلات درجات البشرة بترميز Unicode الأصلي دون أي فقدان.",
    f3Title: "معالجة مجمعة فائقة السرعة",
    f3Desc: "معالجة حتى 20 صورة في وقت قياسي مع استهلاك أمثل للبيانات وسرعة استخراج فورية.",
    f4Title: "تحميل وتصدير مباشر بضغطة واحدة",
    f4Desc: "تنزيل فوري للملفات بصيغ PDF و TXT و Markdown و JSON مباشرة لجهازك دون نوافذ طباعة معقدة.",
    f5Title: "خصوصية تامة بدون وسطاء",
    f5Desc: "اتصال مشفر ومباشر بين متصفحك وخوادم Google، بدون تخزين أي بيانات أو صور على أي خادم وسيط.",
    f6Title: "واجهة ثلاثية اللغات (EN / RU / AR)",
    f6Desc: "ترجمة أكاديمية دقيقة للإنجليزية والروسية والعربية مع محاذاة تلقائية كاملة لاتجاه القراءة (RTL).",

    comparisonTitle: "مقارنة تقنية: OmniScribe مقابل الـ OCR التقليدي",
    comparisonSubtitle: "تقييم هندسي دقيق يقارن قوة الرؤية الحاسوبية المتعددة الوسائط بالمكتبات القديمة.",
    compColFeature: "الخاصية",
    compColLegacy: "الـ OCR التقليدي (Tesseract / EasyOCR)",
    compColOmni: "منظومة OmniScribe (Gemini Vision)",
    compR1Name: "الرموز التعبيرية والإيموجي",
    compR1Legacy: "❌ تُحذف تماماً أو تظهر كعلامات استفهام '؟'",
    compR1Omni: "✅ استخراج 100% بنظام Unicode الصحيح",
    compR2Name: "الجداول والتنسيق المكاني",
    compR2Legacy: "❌ انهيار الأعمدة واختلاط السطور",
    compR2Omni: "✅ حفظ تام للجداول وتنسيق الماركداون",
    compR3Name: "الكتابة الروسية الكيريلية والعربية",
    compR3Legacy: "⚠️ أخطاء متكررة في اتصال الحروف والتشكيل",
    compR3Omni: "✅ دقة فائقة في الحروف والكلمات",
    compR4Name: "استقرار النماذج على مر الزمن",
    compR4Legacy: "❌ يتطلب إعادة تدريب مستمرة وتحديث يدوي",
    compR4Omni: "✅ ربط ذاتي بأحدث نموذج متاح عبر الـ API",
    compR5Name: "دمج الصور المتعددة",
    compR5Legacy: "❌ يحتاج كتابة برمجيات خارجية للدمج",
    compR5Omni: "✅ دمج بنقرة واحدة كـ PDF أو TXT أو JSON",

    howTitle: "كيف تعمل منظومة المعالجة الذكية؟",
    howSubtitle: "ثلاث مراحل هندسية متتالية تضمن الدقة الأكاديمية والإنتاجية العالية.",
    step1Title: "1. إدخال الدفعة والتحقق المحلي",
    step1Desc: "رفع حتى 20 صورة، معالجة الـ Base64 محلياً داخل المتصفح دون الحاجة لرفعها على خوادم وسيطة.",
    step2Title: "2. استكشاف النموذج والاستدعاء العصبي",
    step2Desc: "استعلام تلقائي لتحديد أحدث نموذج متوفر وتوجيهه بـ Prompt صارم لاستخراج كافة الحروف والإيموجي.",
    step3Title: "3. فك ترميز الرموز والدمج الموحد",
    step3Desc: "تحليل دقيق للإحصائيات، فرز الرموز التعبيرية، وتوليد ملف موحد مدمج جاهز للتنزيل المباشر.",

    academicTitle: "البيان الأكاديمي للجنة فحص المنحة الحكومية الروسية",
    academicSubtitle: "مشروع مُقدم ضمن ملف الترشح لأولمبياد Open Doors ومنحة الحكومة الروسية في علوم الحاسب والذكاء الاصطناعي.",
    academicRole: "المتقدم: عادل محمد (Adel Mohamed) • التخصص: معالجة اللغات الطبيعية متعددة الوسائط والرؤية الحاسوبية",
    academicUnivs: "الجامعات المستهدفة: جامعة المدرسة العليا للاقتصاد (HSE)، جامعة إتيمو (ITMO)، معهد موسكو للفيزياء والتكنولوجيا (MIPT)",

    faqTitle: "الأسئلة الشائعة والإجابات التقنية",
    faqSubtitle: "كل ما تود معرفته عن الأمان، دقة النماذج، وكيفية عمل المنظومة.",
    q1: "كيف تعمل ميزة الاكتشاف التلقائي لأحدث نموذج؟",
    a1: "المنصة لا تعتمد على أسماء موديلات ثابتة، بل تستعلم حياً عبر الـ API من جوجل، وتقارن إصدارات النماذج وتحدد أحدث نموذج مجاني متاح وتربط المنصة به تلقائياً.",
    q2: "هل مفتاح الـ API الخاص بي في أمان؟",
    a2: "نعم بنسبة 100%. التطبيق يعمل بالكامل من جانب العميل (Client-Side) ويحفظ المفتاح محلياً في متصفحك، ولا يمر بأي خادم وسيط على الإطلاق.",
    q3: "هل يمكنني دمج كل الـ 20 صورة في ملف واحد كـ PDF أو TXT؟",
    a3: "نعم بالتأكيد. يوفر التطبيق ميزة التصدير المدمج التي تجمع نصوص كافة الصور المستخرجة مع إحصائياتها وبياناتها في ملف موحد بتنسيق جذاب.",
    q4: "ما هي صيغ الصور المدعومة؟",
    a4: "يدعم التطبيق صور PNG و JPG و JPEG و WEBP وكافة لقطات الشاشة ذات الدقة العالية المليئة بالنصوص والإيموجي والجداول.",

    emptyStateTitle: "مساحة العمل فارغة حالياً",
    emptyStateDesc: "قم برفع صورك بالأعلى أو اضغط على 'تحميل نماذج تجريبية' لتجربة المنظومة فوراً بنقرة واحدة.",
    missingKeyWarning: "مفتاح Gemini API مطلوب للبدء في استخراج النصوص والصور. يرجى إدخال المفتاح بالأعلى.",
    quotaExceededTitle: "تم استهلاك حد الـ API في الدقيقة الحالية",
    quotaExceededWarning: "وصلت إلى الحد الأقصى المجاني المسموح به في الدقيقة من Google Gemini API. يرجى الانتظار 60 ثانية أو تجربة مفتاح آخر في الإعدادات.",
    changeKeyBtn: "تغيير المفتاح",
    networkErrorWarning: "مشكلة في الاتصال بالإنترنت أثناء التواصل مع خوادم Gemini.",
    noTextFound: "لم يتم العثور على أي نصوص أو رموز تعبيرية واضحة في هذه الصورة.",
    setApiKeyBtn: "ربط مفتاح API",
    modalStatusScanning: "جاري الاتصال المباشر بخوادم Google Gemini...",
    modalScanningSub: "فحص النماذج الداعمة لـ generateContent لاختيار أحدث نموذج مجاني",
    modalLiveVerifiedBadge: "اتصال حي حقيقي ✓",
    modalLiveVerifiedDesc: "تم التحقق من النموذج مباشرة من كتالوج Google Gemini وهو جاهز للاستخراج",
    modalNoModelTitle: "لم يتم ربط أي نموذج حتى الآن",
    modalNoModelDesc: "أدخل مفتاح Google Gemini API بالأعلى ثم اضغط \"اختبار الاتصال وجلب النماذج\" لربط المنظومة مباشرة بأحدث نموذج مجاني متوفر في حسابك.",
    f1Tag: "ربط حي مباشر",
    f2Tag: "دقة 100%",
    f3Tag: "معالجة فائقة",
    f5Tag: "تشفير محلي"
  }
};
