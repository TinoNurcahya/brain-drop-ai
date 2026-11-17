"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  List,
  ListTodo,
  Quote,
  Undo2,
  Redo2,
  Link as LinkIcon,
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (markdown: string, plainText: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Write your thoughts, ideas, or markdown here...",
  editable = true,
}: TiptapEditorProps) {
  const isUpdatingFromPropRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (isUpdatingFromPropRef.current) return;
      const markdown = (editor.storage as any).markdown?.getMarkdown?.() ?? editor.getHTML();
      const plainText = editor.getText();
      onChange(markdown, plainText);
    },
  });

  // Sync content when prop changes externally (e.g. switching active note in sidebar)
  useEffect(() => {
    if (!editor) return;
    const currentMarkdown = (editor.storage as any).markdown?.getMarkdown?.() ?? "";
    if (content !== currentMarkdown) {
      isUpdatingFromPropRef.current = true;
      editor.commands.setContent(content, false);
      isUpdatingFromPropRef.current = false;
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="flex-1 p-8 text-[var(--text-muted)] animate-pulse">
        Loading editor engine...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="relative flex flex-col flex-1 h-full overflow-hidden">
      {/* Clean Header Formatting Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm shrink-0 overflow-x-auto">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors ${
            editor.isActive("bold") ? "bg-[var(--bg-tertiary)] text-[var(--accent-blue)]" : ""
          }`}
          title="Bold (Cmd+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors ${
            editor.isActive("italic") ? "bg-[var(--bg-tertiary)] text-[var(--accent-blue)]" : ""
          }`}
          title="Italic (Cmd+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors ${
            editor.isActive("strike") ? "bg-[var(--bg-tertiary)] text-[var(--accent-blue)]" : ""
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors ${
            editor.isActive("code") ? "bg-[var(--bg-tertiary)] text-[var(--accent-blue)]" : ""
          }`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-[var(--border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-[var(--bg-tertiary)] text-[var(--accent-blue)]" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "bg-[var(--bg-tertiary)] text-[var(--accent-blue)]" : ""
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-[var(--border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors ${
            editor.isActive("bulletList") ? "bg-[var(--bg-tertiary)] text-[var(--accent-blue)]" : ""
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors ${
            editor.isActive("taskList") ? "bg-[var(--bg-tertiary)] text-[var(--accent-blue)]" : ""
          }`}
          title="Task List / Checkbox"
        >
          <ListTodo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors ${
            editor.isActive("blockquote") ? "bg-[var(--bg-tertiary)] text-[var(--accent-blue)]" : ""
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white transition-colors ${
            editor.isActive("link") ? "bg-[var(--bg-tertiary)] text-[var(--accent-blue)]" : ""
          }`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Bubble Menu on selection */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 150 }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[var(--bg-card)]/95 border border-[var(--border)] shadow-xl backdrop-blur-md"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded text-xs hover:bg-[var(--bg-tertiary)] ${
              editor.isActive("bold") ? "text-[var(--accent-blue)] font-bold" : "text-white"
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded text-xs hover:bg-[var(--bg-tertiary)] ${
              editor.isActive("italic") ? "text-[var(--accent-blue)] italic" : "text-white"
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1 rounded text-xs hover:bg-[var(--bg-tertiary)] ${
              editor.isActive("code") ? "text-[var(--accent-blue)]" : "text-white"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-1.5 py-0.5 rounded text-xs font-semibold hover:bg-[var(--bg-tertiary)] ${
              editor.isActive("heading", { level: 2 }) ? "text-[var(--accent-blue)]" : "text-white"
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={setLink}
            className={`p-1 rounded text-xs hover:bg-[var(--bg-tertiary)] ${
              editor.isActive("link") ? "text-[var(--accent-blue)]" : "text-white"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </BubbleMenu>
      )}

      {/* Editor Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
