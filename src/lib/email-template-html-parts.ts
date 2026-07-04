/** Rozdělení / složení celého HTML dokumentu e-mailové šablony. */

export const EMAIL_HTML_WRAPPER_PREFIX = `<!DOCTYPE html>
<html lang="cs">
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #334155;">`;

export const EMAIL_HTML_WRAPPER_SUFFIX = `</body>
</html>`;

export type EmailHtmlParts = {
  prefix: string;
  inner: string;
  suffix: string;
};

export function splitEmailHtmlDocument(html: string): EmailHtmlParts {
  const openMatch = html.match(/<body[^>]*>/i);
  const closeIndex = html.search(/<\/body>/i);

  if (openMatch && openMatch.index != null && closeIndex !== -1) {
    const prefixEnd = openMatch.index + openMatch[0].length;
    return {
      prefix: html.slice(0, prefixEnd),
      inner: html.slice(prefixEnd, closeIndex).trim(),
      suffix: html.slice(closeIndex),
    };
  }

  return {
    prefix: EMAIL_HTML_WRAPPER_PREFIX,
    inner: html.trim(),
    suffix: EMAIL_HTML_WRAPPER_SUFFIX,
  };
}

export function joinEmailHtmlDocument(parts: EmailHtmlParts): string {
  const inner = parts.inner.trim();
  if (!inner) {
    return `${parts.prefix}\n${parts.suffix}`;
  }
  return `${parts.prefix}\n${inner}\n${parts.suffix}`;
}

/** Placeholder {{klíč}} → atomický span pro vizuální editor. */
export function innerHtmlForRichEditor(inner: string): string {
  return inner.replace(
    /\{\{(\w+)\}\}/g,
    (_match, key: string) =>
      `<span data-email-placeholder="${key}" class="email-ph-token">{{${key}}}</span>`,
  );
}

/** HTML z editoru → placeholder {{klíč}}. */
export function innerHtmlFromRichEditor(html: string): string {
  let out = html.replace(
    /<span[^>]*data-email-placeholder="(\w+)"[^>]*>[\s\S]*?<\/span>/gi,
    "{{$1}}",
  );
  out = out.replace(
    /<span[^>]*class="[^"]*email-ph-token[^"]*"[^>]*data-email-placeholder="(\w+)"[^>]*>[\s\S]*?<\/span>/gi,
    "{{$1}}",
  );
  return out;
}
