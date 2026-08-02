/**
 * Utility functions for handling image URLs, with auto-formatting for
 * Google Drive and Google Photos shared image URLs.
 */

export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  
  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view...
  const fileDMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: https://drive.google.com/open?id=FILE_ID...
  const openIdMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openIdMatch && openIdMatch[1]) {
    return openIdMatch[1];
  }

  // Pattern 3: https://drive.google.com/uc?...id=FILE_ID
  const ucIdMatch = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucIdMatch && ucIdMatch[1]) {
    return ucIdMatch[1];
  }

  // Pattern 4: https://docs.google.com/uc?id=FILE_ID
  const docsUcIdMatch = url.match(/docs\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (docsUcIdMatch && docsUcIdMatch[1]) {
    return docsUcIdMatch[1];
  }

  return null;
}

/**
 * Transforms any raw image URL or Google Drive sharing URL into a direct,
 * displayable image URL.
 */
export function formatImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  // Check if it's a Google Drive link
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    // Return high-res direct image URL via lh3.googleusercontent CDN
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  return trimmed;
}

/**
 * Helper to parse a multi-line text input of image URLs.
 * Automatically trims and converts Google Drive URLs.
 */
export function parseImageUrlList(textInput: string): string[] {
  if (!textInput) return [];
  return textInput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => formatImageUrl(line));
}
