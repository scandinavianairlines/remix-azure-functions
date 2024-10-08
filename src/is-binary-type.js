const BINARY_TYPES = new Set([
  'application/octet-stream',
  // Docs
  'application/epub+zip',
  'application/msword',
  'application/pdf',
  'application/rtf',
  'application/vnd.amazon.ebook',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Fonts
  'font/otf',
  'font/woff',
  'font/woff2',
  // Images
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/vnd.microsoft.icon',
  'image/webp',
  // Audio
  'audio/3gpp',
  'audio/aac',
  'audio/basic',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'audio/x-aiff',
  'audio/x-midi',
  'audio/x-wav',
  // Video
  'video/3gpp',
  'video/mp2t',
  'video/mpeg',
  'video/ogg',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
  // Archives
  'application/java-archive',
  'application/vnd.apple.installer+xml',
  'application/x-7z-compressed',
  'application/x-apple-diskimage',
  'application/x-bzip',
  'application/x-bzip2',
  'application/x-gzip',
  'application/x-java-archive',
  'application/x-rar-compressed',
  'application/x-tar',
  'application/x-zip',
  'application/zip',
]);

/**
 * Checks given `content-type` with a list of binary types, if the given value is included returns `true`.
 * @param {string} contentType - A content-type value to test.
 * @returns {boolean} `true` if given value is a binary type.
 */
export function isBinaryType(contentType) {
  const [test] = contentType.split(';');
  return BINARY_TYPES.has(test || '');
}
