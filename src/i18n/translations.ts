import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  navWorkspace: string;
  navFeatures: string;
  navFaq: string;

  // Hero Section
  heroTitle1: string;
  heroTitleGradient: string;
  heroSubtitle: string;
  heroCtaUpload: string;
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

  // API & Model Config
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  apiKeyHelp: string;
  clearKeyBtn: string;
  autoDetectBtn: string;
  detectingModel: string;
  currentModel: string;
  modelConfigTitle: string;

  // Dropzone
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  dropzoneFormatsNotice: string;
  dropzoneMaxFilesReached: string;
  queueImagesCount: string;
  queueSlotsAvailable: string;
  fileReadErrorWarning: string;
  pasteSuccess: string;

  // Batch Actions
  totalImages: string;
  queueDoneCount: string;
  queueProcessingCount: string;
  queueReadyCount: string;
  queueAllDone: string;
  clearAllBtn: string;
  extractAllBtn: string;
  stopBtn: string;
  exportMergedBtn: string;

  // Card Actions
  extractSingleBtn: string;
  removeImageBtn: string;
  viewResultBtn: string;
  copyTextBtn: string;
  copiedBtn: string;
  statusIdle: string;
  statusProcessing: string;
  statusCompleted: string;
  statusError: string;

  // Stats & Info
  charsLabel: string;
  wordsLabel: string;
  emojisLabel: string;
  rawTextTab: string;
  formattedTab: string;
  editTextTab: string;
  saveChangesBtn: string;
  cancelBtn: string;
  emojisStreamTitle: string;
  uniqueLabel: string;
  emojiCopiedShort: string;
  emojiTooltipPrefix: string;
  sourceDocumentLabel: string;
  latencyUnit: string;
  editPlaceholder: string;
  processedByFooter: string;

  // Export Modal
  exportModalTitle: string;
  readyForMergeDesc: string;
  readyToConsolidateDesc: string;
  generatingLabel: string;
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
  saveSettingsBtn: string;
  closeBtn: string;
  selectLanguageLabel: string;
  toggleThemeLabel: string;
  downloadTxtTitle: string;
  downloadPdfTitle: string;
  exportFailWarning: string;

  // Gemini Dynamic Discovery
  dynamicDiscoveryTitle: string;
  dynamicDiscoveryDesc: string;
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
  f1Tag: string;
  f2Title: string;
  f2Desc: string;
  f2Tag: string;
  f3Title: string;
  f3Desc: string;
  f3Tag: string;
  f4Title: string;
  f4Desc: string;
  f4Tag: string;

  // FAQ
  faqTitle: string;
  faqSubtitle: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;

  // Error & Status messages
  missingKeyWarning: string;
  quotaExceededTitle: string;
  quotaExceededWarning: string;
  changeKeyBtn: string;
  noTextFound: string;
  setApiKeyBtn: string;
  modalStatusScanning: string;
  modalScanningSub: string;
  modalLiveVerifiedBadge: string;
  modalLiveVerifiedDesc: string;
  modalNoModelTitle: string;
  modalNoModelDesc: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    navWorkspace: "Studio Workspace",
    navFeatures: "Capabilities",
    navFaq: "FAQ",

    heroTitle1: "Extract Multilingual Text & Emojis With",
    heroTitleGradient: "Multimodal Vision Precision.",
    heroSubtitle: "Built for reliable client-side document extraction. Preserves complex Unicode emojis and multilingual scripts, processes batches up to 20 images, and dynamically discovers the newest Gemini vision models.",
    heroCtaUpload: "Launch Studio Workspace",
    heroMetricImages: "Up to 20 Images",
    heroMetricImagesSub: "Sequential batch queue",
    heroMetricEmoji: "Full Emoji Unicode",
    heroMetricEmojiSub: "Preserves flags & ZWJ",
    heroMetricLatency: "Flash Vision Speed",
    heroMetricLatencySub: "Low-latency API pipeline",
    heroMetricLongevity: "Smart Model Discovery",
    heroMetricLongevitySub: "Auto-binds latest version",

    studioTitle: "Document Intelligence Studio",
    studioSubtitle: "Drag & drop images below, inspect extracted Unicode streams, and export consolidated PDF or TXT reports.",

    apiKeyLabel: "Google Gemini API Key",
    apiKeyPlaceholder: "Paste your AI Studio API key (AIzaSy...)",
    apiKeyHelp: "Your key stays safely stored in browser localStorage. Never sent to any third-party server.",
    clearKeyBtn: "Clear",
    autoDetectBtn: "Smart Auto-Detect",
    detectingModel: "Scanning API for latest multimodal models...",
    currentModel: "Active Model",
    modelConfigTitle: "Configure Google Gemini API Key and Models",

    dropzoneTitle: "Drop up to 20 images here, or browse files",
    dropzoneSubtitle: "Supports high-resolution PNG, JPG, JPEG, WEBP, and screenshots",
    dropzoneFormatsNotice: "OCR engine extracts complex formatting, multilingual scripts & all Unicode emojis",
    dropzoneMaxFilesReached: "Maximum batch limit (20 images) reached",
    queueImagesCount: "Images in Queue",
    queueSlotsAvailable: "Slots Available",
    fileReadErrorWarning: "Some selected files could not be read as images.",
    pasteSuccess: "Image pasted from clipboard into queue",

    totalImages: "Total Images",
    queueDoneCount: "done",
    queueProcessingCount: "images in active pipeline",
    queueReadyCount: "images ready for extraction",
    queueAllDone: "All queue images processed",
    clearAllBtn: "Clear",
    extractAllBtn: "Extract",
    stopBtn: "Stop",
    exportMergedBtn: "Export",

    extractSingleBtn: "Extract Image",
    removeImageBtn: "Remove",
    viewResultBtn: "Inspect Output",
    copyTextBtn: "Copy Text",
    copiedBtn: "Copied to Clipboard!",
    statusIdle: "Ready",
    statusProcessing: "Recognizing...",
    statusCompleted: "Extracted",
    statusError: "Failed",

    charsLabel: "Characters",
    wordsLabel: "Words",
    emojisLabel: "Emojis",
    rawTextTab: "Raw Text & Emojis",
    formattedTab: "Formatted Preview",
    editTextTab: "Edit in Place",
    saveChangesBtn: "Save Changes",
    cancelBtn: "Cancel",
    emojisStreamTitle: "Extracted Emojis Stream",
    uniqueLabel: "unique",
    emojiCopiedShort: "Copied",
    emojiTooltipPrefix: "Click to copy Unicode",
    sourceDocumentLabel: "Source Document",
    latencyUnit: "latency",
    editPlaceholder: "Edit extracted text or correct any character here...",
    processedByFooter: "Processed via Google Gemini Multimodal OCR",

    exportModalTitle: "Consolidate & Export Results",
    readyForMergeDesc: "completed items ready for merge",
    readyToConsolidateDesc: "Ready to consolidate {count} items",
    generatingLabel: "Generating...",
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
    saveSettingsBtn: "Save & Apply Changes",
    closeBtn: "Close",
    selectLanguageLabel: "Select Interface Language",
    toggleThemeLabel: "Toggle Theme",
    downloadTxtTitle: "Download .txt",
    downloadPdfTitle: "Download .pdf",
    exportFailWarning: "Failed to generate export file. Please try again.",

    dynamicDiscoveryTitle: "Dynamic Model Discovery",
    dynamicDiscoveryDesc: "Queries Google's live catalog via models.list to detect and select the latest free multimodal model available.",
    recommendedModel: "Recommended Model",
    manualOverride: "Manual Model Selection",
    testConnectionBtn: "Test Connection & Query Models",
    connectionSuccess: "Gemini API handshake successful! Model catalog synchronized.",
    connectionFail: "Connection failed. Please verify your API key and network connection.",

    featuresTitle: "Core System Capabilities",
    featuresSubtitle: "Multimodal vision architecture built for accurate text and Unicode emoji extraction.",
    f1Title: "Live Model Auto-Discovery",
    f1Desc: "Instantly binds to Google's newest available Flash vision model via models.list with zero manual setup.",
    f1Tag: "Live Discovery",
    f2Title: "Emoji & Script Preservation",
    f2Desc: "Captures emojis, flags, ZWJ sequences, and skin-tone modifiers into valid Unicode code points alongside mixed scripts.",
    f2Tag: "Unicode Safe",
    f3Title: "Rate-Safe Batch Pipeline",
    f3Desc: "Processes up to 20 images sequentially with pre-scaling, abort support, and automatic rate-limit failover.",
    f3Tag: "Batch Queue",
    f4Title: "Direct Client-Side Privacy",
    f4Desc: "Direct HTTPS browser-to-Google communication. API keys stay local and no image data is uploaded to intermediate servers.",
    f4Tag: "Client-Side",

    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Technical details about model discovery, credential handling, and document exports.",
    q1: "How does Dynamic Model Discovery work?",
    a1: "The platform avoids hardcoded model versions. It queries Google's live models catalog, evaluates generation methods, parses major/minor version numbers, and selects the newest available free-tier Flash model.",
    q2: "Is my Gemini API key secure?",
    a2: "Yes. OmniScribe runs completely in your browser. Your key stays in localStorage and is sent strictly via the x-goog-api-key header over HTTPS directly to Google's API endpoints without any proxy server.",
    q3: "Can I export all 20 images into one combined PDF or TXT?",
    a3: "Yes. The batch export engine compiles all completed extractions into a unified document with ASCII headers, metadata, word/emoji counts, and vector styling for PDF printing.",

    missingKeyWarning: "Gemini API key is required to perform multimodal vision extraction. Please configure your key in the header.",
    quotaExceededTitle: "API Quota Limit Reached",
    quotaExceededWarning: "API rate limit or quota reached for this minute. Please wait 60 seconds or switch your API key in settings.",
    changeKeyBtn: "Change Key",
    noTextFound: "No readable text or emojis detected in this image.",
    setApiKeyBtn: "Set API Key",
    modalStatusScanning: "Connecting live to Google Gemini API...",
    modalScanningSub: "Querying models.list to select the newest free vision model",
    modalLiveVerifiedBadge: "Live Google Connected ✓",
    modalLiveVerifiedDesc: "Verified with Google models.list • Ready for Multimodal Vision OCR",
    modalNoModelTitle: "No Model Connected Yet",
    modalNoModelDesc: "Enter your Google Gemini API key above and click \"Test Connection & Query Models\" to query Google live and bind the latest model."
  },

  ru: {
    navWorkspace: "Рабочая студия",
    navFeatures: "Возможности",
    navFaq: "FAQ",

    heroTitle1: "Распознавание многоязычного текста и эмодзи с",
    heroTitleGradient: "мультимодальной точностью.",
    heroSubtitle: "Клиентское веб-приложение для точного извлечения текста и символов Unicode. Поддерживает пакетную очередь до 20 изображений и динамически находит актуальные модели Gemini Flash.",
    heroCtaUpload: "Открыть студию OCR",
    heroMetricImages: "До 20 изображений",
    heroMetricImagesSub: "Упорядоченная очередь",
    heroMetricEmoji: "Полный Unicode",
    heroMetricEmojiSub: "Эмодзи, флаги и ZWJ",
    heroMetricLatency: "Скорость Flash",
    heroMetricLatencySub: "Низкая задержка отклика",
    heroMetricLongevity: "Авто-выбор модели",
    heroMetricLongevitySub: "Актуальные версии API",

    studioTitle: "Студия интеллектуального анализа документов",
    studioSubtitle: "Перетащите изображения, просматривайте поток эмодзи и экспортируйте объединенные отчеты в PDF или TXT.",

    apiKeyLabel: "Ключ Google Gemini API",
    apiKeyPlaceholder: "Вставьте ваш API-ключ из Google AI Studio (AIzaSy...)",
    apiKeyHelp: "Ключ безопасно хранится локально в браузере (localStorage) и не передается сторонним серверам.",
    clearKeyBtn: "Очистить",
    autoDetectBtn: "Авто-поиск новейшей модели",
    detectingModel: "Сканирование API на наличие актуальных мультимодальных моделей...",
    currentModel: "Активная модель",
    modelConfigTitle: "Настроить API-ключ Google Gemini и модели",

    dropzoneTitle: "Перетащите до 20 изображений сюда или выберите файлы",
    dropzoneSubtitle: "Поддерживаются PNG, JPG, JPEG, WEBP и скриншоты любого разрешения",
    dropzoneFormatsNotice: "Интеллектуальное извлечение верстки, многоязычного текста и всех символов эмодзи",
    dropzoneMaxFilesReached: "Достигнут лимит пакета (максимум 20 изображений)",
    queueImagesCount: "изобр. в очереди",
    queueSlotsAvailable: "свободных слотов",
    fileReadErrorWarning: "Некоторые выбранные файлы не удалось прочитать как изображения.",
    pasteSuccess: "Изображение вставлено из буфера обмена в очередь",

    totalImages: "Всего изображений",
    queueDoneCount: "готово",
    queueProcessingCount: "изобр. в активной обработке",
    queueReadyCount: "изобр. готово к распознаванию",
    queueAllDone: "Все изображения в очереди обработаны",
    clearAllBtn: "Очистить",
    extractAllBtn: "Извлечь",
    stopBtn: "Стоп",
    exportMergedBtn: "Экспорт",

    extractSingleBtn: "Распознать это фото",
    removeImageBtn: "Удалить",
    viewResultBtn: "Просмотр результата",
    copyTextBtn: "Копировать текст",
    copiedBtn: "Скопировано в буфер!",
    statusIdle: "Готов",
    statusProcessing: "Распознавание...",
    statusCompleted: "Завершено",
    statusError: "Ошибка",

    charsLabel: "Символов",
    wordsLabel: "Слов",
    emojisLabel: "Эмодзи",
    rawTextTab: "Исходный текст и эмодзи",
    formattedTab: "Форматированный просмотр",
    editTextTab: "Редактировать на месте",
    saveChangesBtn: "Сохранить правки",
    cancelBtn: "Отмена",
    emojisStreamTitle: "Поток извлеченных эмодзи",
    uniqueLabel: "уник.",
    emojiCopiedShort: "Скопировано",
    emojiTooltipPrefix: "Нажмите, чтобы скопировать Unicode",
    sourceDocumentLabel: "Исходный документ",
    latencyUnit: "задержка",
    editPlaceholder: "Отредактируйте или исправьте извлеченный текст здесь...",
    processedByFooter: "Обработано через Google Gemini Multimodal OCR",

    exportModalTitle: "Объединение и экспорт результатов",
    readyForMergeDesc: "готовых элементов для объединения",
    readyToConsolidateDesc: "Готово к объединению элементов: {count}",
    generatingLabel: "Генерация...",
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
    saveSettingsBtn: "Сохранить и применить",
    closeBtn: "Закрыть",
    selectLanguageLabel: "Выбрать язык интерфейса",
    toggleThemeLabel: "Переключить тему",
    downloadTxtTitle: "Скачать .txt",
    downloadPdfTitle: "Скачать .pdf",
    exportFailWarning: "Не удалось сформировать файл экспорта. Попробуйте еще раз.",

    dynamicDiscoveryTitle: "Динамическое обнаружение моделей",
    dynamicDiscoveryDesc: "Опрашивает каталог моделей Google (models.list) и автоматически подключает самую новую бесплатную модель машинного зрения.",
    recommendedModel: "Рекомендуемая модель",
    manualOverride: "Ручной выбор модели",
    testConnectionBtn: "Проверить подключение и список моделей",
    connectionSuccess: "Подключение к Gemini API успешно! Каталог моделей обновлен.",
    connectionFail: "Ошибка подключения. Проверьте правильность API-ключа и доступ в интернет.",

    featuresTitle: "Ключевые возможности системы",
    featuresSubtitle: "Мультимодальное распознавание текста и символов Unicode прямо в браузере.",
    f1Title: "Динамическое обнаружение моделей",
    f1Desc: "Мгновенное подключение к актуальным моделям Google Gemini Flash через models.list без ручной правки кода.",
    f1Tag: "Live API",
    f2Title: "Сохранение эмодзи и шрифтов",
    f2Desc: "Точное извлечение эмодзи, составных символов ZWJ, флагов и многоязычного текста в стандартном Unicode.",
    f2Tag: "Unicode",
    f3Title: "Пакетный конвейер",
    f3Desc: "Последовательная обработка до 20 изображений со сжатием на Canvas, поддержкой отмены и переключением при квотах.",
    f3Tag: "Очередь",
    f4Title: "Клиентская конфиденциальность",
    f4Desc: "Прямые HTTPS-запросы из браузера в Google API. Ключи хранятся локально в браузере без промежуточных серверов.",
    f4Tag: "Client-Side",

    faqTitle: "Часто задаваемые вопросы",
    faqSubtitle: "Технические детали архитектуры, безопасности ключей и экспорта отчетов.",
    q1: "Как устроен алгоритм динамического выбора модели?",
    a1: "Приложение не использует жестко заданные имена моделей. Оно опрашивает каталог Google API, разбирает номера версий и выбирает самую актуальную бесплатную модель Flash.",
    q2: "Безопасен ли мой API-ключ Gemini?",
    a2: "Да. OmniScribe работает целиком на стороне клиента: ключ хранится в localStorage вашего браузера и передается напрямую в Google через заголовок x-goog-api-key по HTTPS.",
    q3: "Можно ли объединить все 20 изображений в один файл PDF или TXT?",
    a3: "Да. Модуль экспорта формирует единый структурированный документ с разделителями, метаданными, подсчетом слов и эмодзи.",

    missingKeyWarning: "Для работы мультимодального OCR необходим ключ Gemini API. Пожалуйста, укажите его в шапке сайта.",
    quotaExceededTitle: "Лимит квоты API исчерпан",
    quotaExceededWarning: "Превышен минутный лимит запросов к Google Gemini API. Подождите 60 секунд или используйте другой ключ.",
    changeKeyBtn: "Сменить ключ",
    noTextFound: "В данном изображении не обнаружено распознаваемого текста или эмодзи.",
    setApiKeyBtn: "Подключить API",
    modalStatusScanning: "Прямое подключение к серверам Google Gemini...",
    modalScanningSub: "Запрос models.list для выбора актуальной модели",
    modalLiveVerifiedBadge: "Подключено к Google ✓",
    modalLiveVerifiedDesc: "Модель проверена через каталог Google Gemini и готова к распознаванию",
    modalNoModelTitle: "Модель еще не привязана",
    modalNoModelDesc: "Введите ключ Google Gemini API выше и нажмите кнопку проверки, чтобы связать сервис с новейшей моделью."
  },

  ar: {
    navWorkspace: "مساحة العمل (Studio)",
    navFeatures: "المزايا التقنية",
    navFaq: "الأسئلة الشائعة",

    heroTitle1: "استخراج النصوص متعددة اللغات والرموز بدقة",
    heroTitleGradient: "الرؤية متعددة الوسائط.",
    heroSubtitle: "تطبيق ويب عملي لاستخراج النصوص والرموز من الصور بدقة عالية. يحافظ على ترميز الإيموجي وUnicode، ويعالج حتى 20 صورة في الدفعة الواحدة مع اكتشاف تلقائي لأحدث نماذج Gemini المتاحة.",
    heroCtaUpload: "فتح مساحة عمل الاستوديو",
    heroMetricImages: "حتى 20 صورة",
    heroMetricImagesSub: "معالجة متتابعة منظمة",
    heroMetricEmoji: "دعم كامل لـ Unicode",
    heroMetricEmojiSub: "حفظ الأعلام والرموز المركبة",
    heroMetricLatency: "سرعة نماذج Flash",
    heroMetricLatencySub: "زمن استجابة منخفض",
    heroMetricLongevity: "اكتشاف تلقائي ذكي",
    heroMetricLongevitySub: "تحديث تلقائي حسب المتاح",

    studioTitle: "استوديو استخراج النصوص والذكاء البصري",
    studioSubtitle: "اسحب الصور وأفلتها بالأسفل، عاين تدفق الرموز التعبيرية المستخرجة، وصدر التقرير المدمج كـ PDF أو TXT بنقرة واحدة.",

    apiKeyLabel: "مفتاح Google Gemini API",
    apiKeyPlaceholder: "ضع مفتاحك من Google AI Studio هنا (AIzaSy...)",
    apiKeyHelp: "يتم حفظ المفتاح بأمان داخل متصفحك محلياً (localStorage) ولا يُرسل لأي خادم وسيط إطلاقاً.",
    clearKeyBtn: "مسح",
    autoDetectBtn: "اكتشاف تلقائي ذكي",
    detectingModel: "جاري فحص الـ API لاكتشاف أحدث نماذج الرؤية المتاحة...",
    currentModel: "النموذج النشط",
    modelConfigTitle: "إعداد مفتاح Google Gemini API ونماذج الرؤية",

    dropzoneTitle: "اسحب حتى 20 صورة وأفلتها هنا، أو اضغط للاختيار",
    dropzoneSubtitle: "يدعم صيغ PNG و JPG و JPEG و WEBP ولقطات الشاشة بكافة الدقات",
    dropzoneFormatsNotice: "محرك دقيق يستخرج التنسيقات، اللغات المتعددة، وكافة الرموز التعبيرية والإيموجي",
    dropzoneMaxFilesReached: "تم الوصول إلى الحد الأقصى للمجموعة (20 صورة)",
    queueImagesCount: "صورة في القائمة",
    queueSlotsAvailable: "خانة متاحة",
    fileReadErrorWarning: "تعذر قراءة بعض الملفات المختارة كصور صالحة.",
    pasteSuccess: "تم لصق الصورة من الحافظة في قائمة الانتظار",

    totalImages: "إجمالي الصور",
    queueDoneCount: "مكتمل",
    queueProcessingCount: "صور قيد المعالجة الآن",
    queueReadyCount: "صور جاهزة للاستخراج",
    queueAllDone: "تمت معالجة جميع الصور في القائمة",
    clearAllBtn: "حذف",
    extractAllBtn: "استخراج",
    stopBtn: "إيقاف",
    exportMergedBtn: "تحميل",

    extractSingleBtn: "استخراج هذه الصورة",
    removeImageBtn: "حذف",
    viewResultBtn: "معاينة النتيجة",
    copyTextBtn: "نسخ النص",
    copiedBtn: "تم النسخ إلى الحافظة!",
    statusIdle: "جاهز",
    statusProcessing: "جاري الاستخراج...",
    statusCompleted: "مكتمل",
    statusError: "حدث خطأ",

    charsLabel: "الحروف",
    wordsLabel: "الكلمات",
    emojisLabel: "الإيموجي",
    rawTextTab: "النص الخام والإيموجي",
    formattedTab: "المعاينة المنسقة",
    editTextTab: "تعديل فوري للنص",
    saveChangesBtn: "حفظ التعديلات",
    cancelBtn: "إلغاء",
    emojisStreamTitle: "سلسلة الإيموجي المستخرجة",
    uniqueLabel: "فريد",
    emojiCopiedShort: "تم نسخ",
    emojiTooltipPrefix: "اضغط لنسخ كود Unicode",
    sourceDocumentLabel: "المستند المصدر",
    latencyUnit: "الزمن المستغرق",
    editPlaceholder: "قم بتعديل النص المستخرج أو تصحيح أي حرف هنا...",
    processedByFooter: "معالج عبر محرك Google Gemini متعدد الوسائط",

    exportModalTitle: "دمج وتصدير النتائج",
    readyForMergeDesc: "صور مكتملة جاهزة للدمج",
    readyToConsolidateDesc: "جاهز لدمج {count} عناصر",
    generatingLabel: "جاري الإنشاء...",
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
    saveSettingsBtn: "حفظ وتطبيق التغييرات",
    closeBtn: "إغلاق",
    selectLanguageLabel: "اختيار لغة الواجهة",
    toggleThemeLabel: "تبديل المظهر الداكن/الفاتح",
    downloadTxtTitle: "تحميل ملف .txt",
    downloadPdfTitle: "تحميل ملف .pdf",
    exportFailWarning: "تعذر إنشاء ملف التصدير. يرجى المحاولة مرة أخرى.",

    dynamicDiscoveryTitle: "استكشاف ديناميكي ذكي للنماذج",
    dynamicDiscoveryDesc: "استعلام مباشر من كتالوج جوجل عبر models.list لربط المنظومة بأحدث نموذج رؤية بصرية مجاني متاح تلقائياً.",
    recommendedModel: "النموذج الذاتي الموصى به",
    manualOverride: "اختيار النموذج يدوياً",
    testConnectionBtn: "اختبار الاتصال وجلب النماذج",
    connectionSuccess: "تم الاتصال بنجاح بـ Gemini API وتحديث قائمة النماذج!",
    connectionFail: "فشل الاتصال. يرجى التأكد من صحة المفتاح واتصال الإنترنت.",

    featuresTitle: "المزايا الهندسية الأساسية",
    featuresSubtitle: "بنية رؤية حاسوبية عملية لاستخراج النصوص والرموز التعبيرية بأعلى دقة مباشرة من المتصفح.",
    f1Title: "ربط تلقائي بأحدث النماذج",
    f1Desc: "استعلام مباشر عبر models.list يربط التطبيق بأحدث نماذج Flash المجانية من Google دون أي تعديل يدوي في الكود.",
    f1Tag: "اتصال مباشر",
    f2Title: "دعم شامل للإيموجي وUnicode",
    f2Desc: "استخراج دقيق للإيموجي والأعلام والرموز المركبة والنصوص العربية والروسية والإنجليزية بترميز Unicode الأصلي.",
    f2Tag: "دقة الترميز",
    f3Title: "طابور معالجة مجمعة سريع",
    f3Desc: "معالجة متتابعة لما يصل إلى 20 صورة مع ضغط الصور مسبقاً ودعم الإيقاف الفوري والتبديل التلقائي عند امتلاء الحصة.",
    f3Tag: "معالجة دفعية",
    f4Title: "خصوصية محلية بدون خادم وسيط",
    f4Desc: "اتصال مباشر ومشفر عبر HTTPS بين متصفحك وخوادم Google، مع بقاء مفتاح الـ API محلياً دون تخزين الصور على أي خادم وسيط.",
    f4Tag: "خصوصية تامة",

    faqTitle: "الأسئلة الشائعة والإجابات التقنية",
    faqSubtitle: "تفاصيل العمل التقنية حول اكتشاف النماذج، أمان المفتاح، وتصدير التقارير.",
    q1: "كيف تعمل ميزة الاكتشاف التلقائي لأحدث نموذج؟",
    a1: "التطبيق لا يثبت أسماء موديلات قديمة في الكود، بل يستعلم مباشرة من كتالوج Google عبر API ويحلل أرقام الإصدارات لاختيار أحدث نموذج Flash مجاني متاح.",
    q2: "هل مفتاح الـ API الخاص بي في أمان؟",
    a2: "نعم. التطبيق يعمل بالكامل من جانب المتصفح، ويُحفظ المفتاح محلياً في localStorage ويُرسل مباشرة عبر الهيدر x-goog-api-key إلى Google دون المرور بأي خادم وسيط.",
    q3: "هل يمكنني دمج كل الـ 20 صورة في ملف واحد كـ PDF أو TXT؟",
    a3: "نعم بالتأكيد. يوفر التطبيق ميزة التصدير المدمج التي تجمع نصوص كافة الصور المستخرجة مع إحصائياتها وبياناتها في ملف موحد بتنسيق جذاب.",

    missingKeyWarning: "مفتاح Gemini API مطلوب للبدء في استخراج النصوص والصور. يرجى إدخال المفتاح بالأعلى.",
    quotaExceededTitle: "تم استهلاك حد الـ API في الدقيقة الحالية",
    quotaExceededWarning: "وصلت إلى الحد الأقصى المجاني المسموح به في الدقيقة من Google Gemini API. يرجى الانتظار 60 ثانية أو تجربة مفتاح آخر في الإعدادات.",
    changeKeyBtn: "تغيير المفتاح",
    noTextFound: "لم يتم العثور على أي نصوص أو رموز تعبيرية واضحة في هذه الصورة.",
    setApiKeyBtn: "ربط مفتاح API",
    modalStatusScanning: "جاري الاتصال المباشر بخوادم Google Gemini...",
    modalScanningSub: "فحص النماذج الداعمة لـ generateContent لاختيار أحدث نموذج مجاني",
    modalLiveVerifiedBadge: "اتصال حي حقيقي ✓",
    modalLiveVerifiedDesc: "تم التحقق من النموذج مباشرة من كتالوج Google Gemini وهو جاهز للاستخراج",
    modalNoModelTitle: "لم يتم ربط أي نموذج حتى الآن",
    modalNoModelDesc: "أدخل مفتاح Google Gemini API بالأعلى ثم اضغط \"اختبار الاتصال وجلب النماذج\" لربط المنظومة مباشرة بأحدث نموذج مجاني متوفر في حسابك."
  }
};
