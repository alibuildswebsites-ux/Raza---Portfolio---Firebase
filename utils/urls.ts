const ALLOWED_PROTOCOLS = new Set(['https:', 'http:']);

export const normalizeOptionalUrl = (value?: string | null): string => {
  const candidate = value?.trim();

  if (!candidate) return '';

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error('Please enter a valid URL that starts with https:// or http://.');
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new Error('Only https:// and http:// links are allowed.');
  }

  return parsed.toString();
};

export const getSafeOptionalUrl = (value?: string | null): string => {
  try {
    return normalizeOptionalUrl(value);
  } catch {
    return '';
  }
};
