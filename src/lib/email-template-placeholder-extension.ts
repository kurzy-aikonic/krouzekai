import { Node, mergeAttributes, type Editor } from "@tiptap/core";

/** Atomický placeholder {{klíč}} — nelze rozdělit formátováním. */
export const EmailPlaceholderNode = Node.create({
  name: "emailPlaceholder",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      key: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-email-placeholder"),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-email-placeholder]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const key = node.attrs.key as string;
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-email-placeholder": key,
        class: "email-ph-token",
        contenteditable: "false",
      }),
      `{{${key}}}`,
    ];
  },

  renderText({ node }) {
    return `{{${node.attrs.key}}}`;
  },
});

export function insertEmailPlaceholder(editor: Editor, key: string): boolean {
  return editor
    .chain()
    .focus()
    .insertContent({
      type: "emailPlaceholder",
      attrs: { key },
    })
    .run();
}
