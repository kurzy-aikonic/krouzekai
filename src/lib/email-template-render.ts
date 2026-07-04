import type { EmailTemplateContent, EmailTemplateId } from "@/lib/email-template-types";
import { EMAIL_TEMPLATE_META } from "@/lib/email-template-types";

const PLACEHOLDER_RE = /\{\{(\w+)\}\}/g;

/** Nahradí {{klíč}} hodnotami. Chybějící klíče zůstanou v textu. */
export function renderEmailTemplate(
  template: EmailTemplateContent,
  vars: Record<string, string>,
): { subject: string; html: string } {
  const replace = (text: string) =>
    text.replace(PLACEHOLDER_RE, (match, key: string) =>
      key in vars ? vars[key]! : match,
    );

  return {
    subject: replace(template.subject),
    html: replace(template.htmlBody),
  };
}

/** Seznam placeholderů v šabloně, které chybí v datech (pro varování v adminu). */
export function findMissingPlaceholders(
  template: EmailTemplateContent,
  vars: Record<string, string>,
): string[] {
  const keys = new Set<string>();
  for (const text of [template.subject, template.htmlBody]) {
    for (const m of text.matchAll(PLACEHOLDER_RE)) {
      keys.add(m[1]!);
    }
  }
  return [...keys].filter((k) => !(k in vars));
}

/** Placeholdery definované pro šablonu, které v textu chybí (doporučení v adminu). */
export function findRecommendedPlaceholdersMissing(
  templateId: EmailTemplateId,
  template: EmailTemplateContent,
): string[] {
  const defined = EMAIL_TEMPLATE_META[templateId].placeholders.map((p) => p.key);
  const present = new Set<string>();
  for (const text of [template.subject, template.htmlBody]) {
    for (const m of text.matchAll(PLACEHOLDER_RE)) {
      present.add(m[1]!);
    }
  }
  return defined.filter((k) => !present.has(k));
}

export function insertPlaceholderAtCursor(
  text: string,
  cursor: number,
  key: string,
): { next: string; nextCursor: number } {
  const token = `{{${key}}}`;
  const next = text.slice(0, cursor) + token + text.slice(cursor);
  return { next, nextCursor: cursor + token.length };
}
