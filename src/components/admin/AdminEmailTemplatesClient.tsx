"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
import type { EmailTemplateRichEditorHandle } from "@/components/admin/EmailTemplateRichEditor";
import {
  DEFAULT_EMAIL_TEMPLATES,
  isEmailTemplateId,
} from "@/lib/email-templates-defaults";
import {
  findRecommendedPlaceholdersMissing,
  insertPlaceholderAtCursor,
  renderEmailTemplate,
} from "@/lib/email-template-render";
import { sampleEmailTemplateVars } from "@/lib/email-template-samples";
import {
  EMAIL_TEMPLATE_IDS,
  EMAIL_TEMPLATE_META,
  type EmailTemplateContent,
  type EmailTemplateId,
} from "@/lib/email-template-types";
import { site } from "@/lib/site-config";

const EmailTemplateRichEditor = dynamic(
  () =>
    import("@/components/admin/EmailTemplateRichEditor").then(
      (m) => m.EmailTemplateRichEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-sm text-slate-500">
        Načítám vizuální editor…
      </div>
    ),
  },
);

type EditFormat = "visual" | "html";

type Props = {
  initialTemplates: Record<EmailTemplateId, EmailTemplateContent>;
  storage: string;
  updatedAt?: string;
};

const AUDIENCE_LABEL: Record<
  (typeof EMAIL_TEMPLATE_META)[EmailTemplateId]["audience"],
  string
> = {
  rodič: "Rodič",
  interní: "Interní",
  admin: "Admin / test",
};

export function AdminEmailTemplatesClient({
  initialTemplates,
  storage,
  updatedAt,
}: Props) {
  const [templates, setTemplates] =
    useState<Record<EmailTemplateId, EmailTemplateContent>>(initialTemplates);
  const [activeId, setActiveId] =
    useState<EmailTemplateId>("registration_confirmation");
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [editFormat, setEditFormat] = useState<EditFormat>("visual");
  const [testTo, setTestTo] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<
    "save" | "reset" | "test" | "preview" | null
  >(null);
  const htmlRef = useRef<HTMLTextAreaElement>(null);
  const richEditorRef = useRef<EmailTemplateRichEditorHandle>(null);

  const active = templates[activeId];
  const meta = EMAIL_TEMPLATE_META[activeId];
  const defaults = DEFAULT_EMAIL_TEMPLATES[activeId];

  const isModified = useMemo(
    () =>
      active.subject !== defaults.subject ||
      active.htmlBody !== defaults.htmlBody,
    [active, defaults],
  );

  const previewRendered = useMemo(() => {
    const vars = sampleEmailTemplateVars(activeId);
    return renderEmailTemplate(active, vars);
  }, [active, activeId]);

  const missingRecommended = useMemo(
    () => findRecommendedPlaceholdersMissing(activeId, active),
    [activeId, active],
  );

  const setActiveField = useCallback(
    (field: keyof EmailTemplateContent, value: string) => {
      setTemplates((prev) => ({
        ...prev,
        [activeId]: { ...prev[activeId], [field]: value },
      }));
    },
    [activeId],
  );

  function insertPlaceholder(key: string) {
    if (editFormat === "visual") {
      richEditorRef.current?.insertPlaceholder(key);
      richEditorRef.current?.focus();
      return;
    }
    const el = htmlRef.current;
    if (!el) {
      setActiveField("htmlBody", `${active.htmlBody}{{${key}}}`);
      return;
    }
    const cursor = el.selectionStart ?? active.htmlBody.length;
    const { next, nextCursor } = insertPlaceholderAtCursor(
      active.htmlBody,
      cursor,
      key,
    );
    setActiveField("htmlBody", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(nextCursor, nextCursor);
    });
  }

  async function saveCurrent() {
    setMessage(null);
    setError(null);
    setPending("save");
    try {
      const res = await fetch("/api/admin/email-templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          templateId: activeId,
          subject: active.subject,
          htmlBody: active.htmlBody,
        }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(extractError(data, "Uložení se nezdařilo."));
        return;
      }
      setMessage(`Šablona „${meta.label}“ uložena (${storage}).`);
    } catch {
      setError("Síťová chyba.");
    } finally {
      setPending(null);
    }
  }

  async function resetCurrent() {
    if (
      !window.confirm(
        `Opravdu obnovit výchozí text šablony „${meta.label}“? Vaše úpravy se ztratí.`,
      )
    ) {
      return;
    }
    setMessage(null);
    setError(null);
    setPending("reset");
    try {
      const res = await fetch("/api/admin/email-templates/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ templateId: activeId }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        templates?: Record<string, EmailTemplateContent>;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Reset se nezdařil.");
        return;
      }
      if (data.templates) {
        const next = { ...templates };
        for (const id of EMAIL_TEMPLATE_IDS) {
          const t = data.templates[id];
          if (t && isEmailTemplateId(id)) {
            next[id] = t;
          }
        }
        setTemplates(next);
      } else {
        setTemplates((prev) => ({
          ...prev,
          [activeId]: DEFAULT_EMAIL_TEMPLATES[activeId],
        }));
      }
      setMessage(`Šablona „${meta.label}“ obnovena na výchozí.`);
    } catch {
      setError("Síťová chyba.");
    } finally {
      setPending(null);
    }
  }

  async function sendTest() {
    setMessage(null);
    setError(null);
    setPending("test");
    try {
      const res = await fetch("/api/admin/email-templates/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          templateId: activeId,
          to: testTo.trim() || undefined,
          subject: active.subject,
          htmlBody: active.htmlBody,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        to?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Test se nezdařil.");
        return;
      }
      setMessage(
        `Test odeslán na ${data.to ?? (testTo || site.contactEmail)} (s ukázkovými daty).`,
      );
    } catch {
      setError("Síťová chyba.");
    } finally {
      setPending(null);
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<string, EmailTemplateId[]>();
    for (const id of EMAIL_TEMPLATE_IDS) {
      const aud = EMAIL_TEMPLATE_META[id].audience;
      const list = map.get(aud) ?? [];
      list.push(id);
      map.set(aud, list);
    }
    return map;
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="portal-card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-violet-800">
            Šablony
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Uloženo: <strong>{storage}</strong>
            {updatedAt ? (
              <>
                <br />
                <span className="text-slate-500">
                  {new Date(updatedAt).toLocaleString("cs-CZ")}
                </span>
              </>
            ) : null}
          </p>
        </div>

        {[...grouped.entries()].map(([audience, ids]) => (
          <div key={audience}>
            <p className="mb-1.5 px-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
              {AUDIENCE_LABEL[audience as keyof typeof AUDIENCE_LABEL]}
            </p>
            <ul className="space-y-1">
              {ids.map((id) => {
                const m = EMAIL_TEMPLATE_META[id];
                const modified =
                  templates[id].subject !== DEFAULT_EMAIL_TEMPLATES[id].subject ||
                  templates[id].htmlBody !==
                    DEFAULT_EMAIL_TEMPLATES[id].htmlBody;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(id);
                        setView("edit");
                        setMessage(null);
                        setError(null);
                      }}
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        activeId === id
                          ? "bg-violet-100 font-bold text-violet-900"
                          : "font-medium text-slate-700 hover:bg-violet-50"
                      }`}
                    >
                      {m.label}
                      {modified ? (
                        <span className="ml-1 text-[10px] font-extrabold uppercase text-amber-700">
                          · upraveno
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      <div className="portal-card space-y-5 p-5 sm:p-6">
        <header>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-extrabold text-slate-900">
                {meta.label}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{meta.description}</p>
              <p className="mt-2 text-xs text-slate-500">
                <strong>Kdy se posílá:</strong> {meta.whenSent}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
              {view === "edit" ? (
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setEditFormat("visual")}
                    className={`rounded-md px-3 py-1.5 ${
                      editFormat === "visual"
                        ? "bg-white text-violet-900 shadow-sm"
                        : "text-slate-600"
                    }`}
                  >
                    Vizuální editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFormat("html")}
                    className={`rounded-md px-3 py-1.5 ${
                      editFormat === "html"
                        ? "bg-white text-violet-900 shadow-sm"
                        : "text-slate-600"
                    }`}
                  >
                    HTML kód
                  </button>
                </div>
              ) : null}
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setView("edit")}
                className={`rounded-md px-3 py-1.5 ${
                  view === "edit"
                    ? "bg-white text-violet-900 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setView("preview")}
                className={`rounded-md px-3 py-1.5 ${
                  view === "preview"
                    ? "bg-white text-violet-900 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                Náhled
              </button>
            </div>
            </div>
          </div>
        </header>

        {view === "edit" ? (
          <>
            <div>
              <label
                htmlFor="email-subject"
                className="text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Předmět
              </label>
              <input
                id="email-subject"
                type="text"
                value={active.subject}
                onChange={(e) => setActiveField("subject", e.target.value)}
                className="input-portal mt-1.5 w-full font-medium"
                spellCheck={false}
              />
            </div>

            <div>
              <label
                htmlFor="email-subject"
                className="text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Tělo e-mailu
              </label>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {editFormat === "visual" ? (
                  <>
                    Formátujte text jako ve Wordu — tučné, kurzíva, odrážky,
                    písmo. Placeholdery{" "}
                    <code className="rounded bg-slate-100 px-1">{"{{klíč}}"}</code>{" "}
                    vkládejte tlačítky níže (zobrazí se jako fialové štítky).
                    Obal dokumentu (<code>&lt;html&gt;</code>,{" "}
                    <code>&lt;body&gt;</code>) se ukládá automaticky.
                  </>
                ) : (
                  <>
                    Celý HTML včetně{" "}
                    <code className="rounded bg-slate-100 px-1">&lt;html&gt;</code>{" "}
                    a placeholdery{" "}
                    <code className="rounded bg-slate-100 px-1">{"{{klíč}}"}</code>.
                  </>
                )}
              </p>
              {editFormat === "visual" ? (
                <div className="mt-2">
                  <EmailTemplateRichEditor
                    ref={richEditorRef}
                    key={activeId}
                    htmlBody={active.htmlBody}
                    onChange={(htmlBody) => setActiveField("htmlBody", htmlBody)}
                  />
                </div>
              ) : (
                <textarea
                  id="email-html"
                  ref={htmlRef}
                  value={active.htmlBody}
                  onChange={(e) => setActiveField("htmlBody", e.target.value)}
                  rows={22}
                  spellCheck={false}
                  className="input-portal mt-2 w-full font-mono text-xs leading-relaxed"
                />
              )}
            </div>

            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-violet-800">
                Placeholdery pro tuto šablonu
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {meta.placeholders.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    title={p.hint ?? p.label}
                    onClick={() => insertPlaceholder(p.key)}
                    className="rounded-lg border border-violet-200 bg-white px-2.5 py-1 text-xs font-semibold text-violet-900 hover:border-violet-400"
                  >
                    {`{{${p.key}}}`}
                  </button>
                ))}
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                {meta.placeholders.map((p) => (
                  <li key={`hint-${p.key}`}>
                    <code className="text-violet-800">{`{{${p.key}}}`}</code> —{" "}
                    {p.label}
                    {p.hint ? ` (${p.hint})` : ""}
                  </li>
                ))}
              </ul>
            </div>

            {missingRecommended.length > 0 ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                <strong>Upozornění:</strong> V šabloně chybí doporučené
                placeholdery:{" "}
                {missingRecommended.map((k) => `{{${k}}}`).join(", ")}.
              </p>
            ) : null}

            {isModified ? (
              <p className="text-xs font-medium text-amber-800">
                Tato šablona se liší od výchozí verze v kódu.
              </p>
            ) : null}
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Náhled s ukázkovými daty
            </p>
            <p className="text-sm font-semibold text-slate-800">
              Předmět: {previewRendered.subject}
            </p>
            <iframe
              title="Náhled e-mailu"
              srcDoc={previewRendered.html}
              className="h-[min(520px,70vh)] w-full rounded-xl border border-slate-200 bg-white"
              sandbox=""
            />
          </div>
        )}

        <div className="flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
          <div className="min-w-[12rem] flex-1">
            <label
              htmlFor="email-test-to"
              className="text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Test — cílová adresa
            </label>
            <input
              id="email-test-to"
              type="email"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder={`výchozí: ${site.contactEmail}`}
              className="input-portal mt-1.5 w-full max-w-md"
              autoComplete="off"
            />
          </div>
        </div>

        {error ? (
          <p className="alert-error text-sm" role="alert">
            {error}
          </p>
        ) : null}
        {message ? <p className="alert-success text-sm">{message}</p> : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => void saveCurrent()}
            className="btn-portal-primary"
          >
            {pending === "save" ? "Ukládám…" : "Uložit šablonu"}
          </button>
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => void sendTest()}
            className="btn-portal-outline"
          >
            {pending === "test" ? "Odesílám…" : "Odeslat test"}
          </button>
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => void resetCurrent()}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            {pending === "reset" ? "Obnovuji…" : "Obnovit výchozí"}
          </button>
        </div>
      </div>
    </div>
  );
}

function extractError(data: unknown, fallback: string): string {
  if (
    typeof data === "object" &&
    data &&
    "error" in data &&
    typeof (data as { error?: string }).error === "string"
  ) {
    return (data as { error: string }).error;
  }
  return fallback;
}
