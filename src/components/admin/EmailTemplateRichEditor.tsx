"use client";

import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  innerHtmlForRichEditor,
  innerHtmlFromRichEditor,
  joinEmailHtmlDocument,
  splitEmailHtmlDocument,
  type EmailHtmlParts,
} from "@/lib/email-template-html-parts";
import {
  EmailPlaceholderNode,
  insertEmailPlaceholder,
} from "@/lib/email-template-placeholder-extension";

export type EmailTemplateRichEditorHandle = {
  insertPlaceholder: (key: string) => void;
  focus: () => void;
};

type Props = {
  htmlBody: string;
  onChange: (htmlBody: string) => void;
};

const FONT_OPTIONS = [
  { label: "Výchozí (system)", value: "" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Courier", value: "'Courier New', Courier, monospace" },
];

function ToolbarButton({
  active,
  disabled,
  title,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md px-2 py-1 text-sm font-bold transition ${
        active
          ? "bg-violet-600 text-white"
          : "bg-white text-slate-700 hover:bg-violet-50"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export const EmailTemplateRichEditor = forwardRef<
  EmailTemplateRichEditorHandle,
  Props
>(function EmailTemplateRichEditor({ htmlBody, onChange }, ref) {
  const initialParts = splitEmailHtmlDocument(htmlBody);
  const wrapperRef = useRef<EmailHtmlParts>(initialParts);
  const syncingRef = useRef(false);
  const initialInnerHtml = innerHtmlForRichEditor(initialParts.inner);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: false }),
      EmailPlaceholderNode,
      Placeholder.configure({
        placeholder: "Začněte psát text e-mailu…",
      }),
    ],
    content: initialInnerHtml,
    editorProps: {
      attributes: {
        class:
          "email-rich-editor__content min-h-[420px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (syncingRef.current) return;
      const inner = innerHtmlFromRichEditor(ed.getHTML());
      onChange(
        joinEmailHtmlDocument({
          ...wrapperRef.current,
          inner,
        }),
      );
    },
  });

  useImperativeHandle(ref, () => ({
    insertPlaceholder(key: string) {
      if (!editor) return;
      insertEmailPlaceholder(editor, key);
    },
    focus() {
      editor?.commands.focus();
    },
  }));

  useEffect(() => {
    if (!editor) return;
    const parts = splitEmailHtmlDocument(htmlBody);
    wrapperRef.current = parts;
    const nextInner = innerHtmlForRichEditor(parts.inner);
    const currentInner = innerHtmlFromRichEditor(editor.getHTML());
    if (currentInner.trim() === parts.inner.trim()) return;
    syncingRef.current = true;
    editor.commands.setContent(nextInner, { emitUpdate: false });
    syncingRef.current = false;
  }, [htmlBody, editor]);

  if (!editor) {
    return (
      <div className="email-rich-editor rounded-xl border border-slate-200 bg-slate-50 p-8 text-sm text-slate-500">
        Načítám editor…
      </div>
    );
  }

  const fontFamily =
    (editor.getAttributes("textStyle").fontFamily as string | undefined) ?? "";

  return (
    <div className="email-rich-editor overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div
        className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2"
        role="toolbar"
        aria-label="Formátování e-mailu"
      >
        <ToolbarButton
          title="Tučné"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          title="Kurzíva"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          title="Podtržené"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          title="Přeškrtnuté"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span className="line-through">S</span>
        </ToolbarButton>

        <span className="mx-1 hidden h-6 w-px bg-slate-300 sm:inline" />

        <ToolbarButton
          title="Nadpis 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Nadpis 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </ToolbarButton>

        <span className="mx-1 hidden h-6 w-px bg-slate-300 sm:inline" />

        <ToolbarButton
          title="Odrážky"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </ToolbarButton>
        <ToolbarButton
          title="Číslování"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>

        <span className="mx-1 hidden h-6 w-px bg-slate-300 sm:inline" />

        <ToolbarButton
          title="Zarovnat vlevo"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ≡
        </ToolbarButton>
        <ToolbarButton
          title="Na střed"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ≡
        </ToolbarButton>
        <ToolbarButton
          title="Zarovnat vpravo"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          ≡
        </ToolbarButton>

        <span className="mx-1 hidden h-6 w-px bg-slate-300 sm:inline" />

        <label className="flex items-center gap-1 text-xs font-semibold text-slate-600">
          Písmo
          <select
            value={fontFamily}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(v).run();
              }
            }}
            className="max-w-[9rem] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1 text-xs font-semibold text-slate-600">
          Barva
          <input
            type="color"
            value={
              (editor.getAttributes("textStyle").color as string | undefined) ||
              "#334155"
            }
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            className="h-7 w-8 cursor-pointer rounded border border-slate-200 bg-white"
            title="Barva textu"
          />
        </label>

        <ToolbarButton
          title="Odkaz"
          active={editor.isActive("link")}
          onClick={() => {
            const prev = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("URL odkazu (lze i {{placeholder}}):", prev ?? "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          🔗
        </ToolbarButton>

        <span className="mx-1 hidden h-6 w-px bg-slate-300 sm:inline" />

        <ToolbarButton
          title="Zpět"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          title="Vpřed"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
});
