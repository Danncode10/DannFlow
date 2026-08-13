"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import { DOMParser as PMDOMParser } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { marked } from "marked";
import {
  ArrowLeft, Settings2, Globe, FileText, Loader2,
  Bold, Italic, Code, List, ListOrdered, Quote, AlignLeft,
  Heading1, Heading2, Heading3, ImageIcon, PlayCircle,
  EyeOff, Check, X, Upload, Table2, ChevronDown,
  Undo2, Redo2, Trash2, Search, AlertCircle, Send, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  compressImageToDataUrl, uploadDataUrl, dataUrlSizeKb, isDataUrl,
  extractImageSrcs, MAX_POST_IMAGES_KB,
} from "@/lib/blog-image-upload";
import {
  createBlogPost, updateBlogPost, publishBlogPost, unpublishBlogPost,
} from "@/services/blog";
import type { BlogPost, BlogPostInput } from "@/services/blog";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Heuristic check for "this plain-text paste is probably markdown" — used to
// decide whether to auto-format pasted text into rich content (Notion-style).
const MARKDOWN_PATTERN = /(^|\n) {0,3}(#{1,6})\s|\*\*[^*\n]+\*\*|__[^_\n]+__|(^|\n) {0,3}[-*+]\s|(^|\n) {0,3}\d+\.\s|(^|\n) {0,3}>\s|```|\[[^\]]+\]\([^)]+\)/;

function looksLikeMarkdown(text: string): boolean {
  return MARKDOWN_PATTERN.test(text);
}

interface ImageBudget {
  remainingKb: number;
}

/** Extracts every image URL (cover + inline) currently referenced by a post's form state. */
function collectImageUrls(coverUrl: string, contentHtml: string): string[] {
  return [coverUrl, ...extractImageSrcs(contentHtml)].filter(Boolean);
}

/** Sums the in-memory (data-URL) image weight of a post — used for the budget bar. */
function localImageUsageKb(coverUrl: string, contentHtml: string): number {
  let kb = 0;
  for (const u of collectImageUrls(coverUrl, contentHtml)) {
    if (isDataUrl(u)) kb += dataUrlSizeKb(u);
  }
  return kb;
}

function plainTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countContentInternalLinks(contentHtml: string): number {
  const matches = contentHtml.match(/href=["']\/(?!\/)[^"']+/g);
  return matches?.length ?? 0;
}

function countPlannedInternalLinks(value: string): number {
  return value
    .split(/\n|,/)
    .map(item => item.trim())
    .filter(item => item.startsWith("/")).length;
}

type SeoAnalysis = {
  score: number;
  warnings: string[];
};

type SocialPlatform = "facebook" | "reddit";

type SocialLinks = Partial<Record<SocialPlatform, string>>;

function analyzeSeo(form: FormState, wordCount: number): SeoAnalysis {
  const warnings: string[] = [];
  let score = 100;
  const contentText = plainTextFromHtml(form.content);
  const seoTitleLength = (form.seo_title || form.title).trim().length;
  const descriptionLength = (form.seo_description || form.excerpt).trim().length;
  const h2Count = (form.content.match(/<h2[\s>]/gi) ?? []).length;
  const internalLinkCount = countContentInternalLinks(form.content) + countPlannedInternalLinks(form.internal_links);
  const keyword = form.primary_keyword.trim().toLowerCase();

  const addWarning = (message: string, penalty: number) => {
    warnings.push(message);
    score -= penalty;
  };

  if (!form.title.trim()) addWarning("Add a clear article title.", 10);
  if (seoTitleLength < 35 || seoTitleLength > 60) addWarning("Keep the SEO title between 35 and 60 characters.", 8);
  if (descriptionLength < 120 || descriptionLength > 160) addWarning("Write a unique meta description between 120 and 160 characters.", 10);
  if (!form.primary_keyword.trim()) addWarning("Set one primary keyword or long-tail phrase.", 8);
  if (!form.search_intent.trim()) addWarning("Describe the search intent this post answers.", 8);
  if (wordCount < 700) addWarning("Expand the article with practical detail; aim for at least 700 words.", 8);
  if (h2Count < 2) addWarning("Use at least two H2 sections so readers and search engines can scan it.", 7);
  if (!form.cover_image_url) addWarning("Add a relevant cover image near the article topic.", 8);
  if (form.cover_image_url && !form.image_alt_text.trim()) addWarning("Add descriptive cover image alt text.", 8);
  if (form.cover_image_url && !form.image_caption.trim()) addWarning("Add an image caption that explains the image context.", 5);
  if (form.cover_image_url && !form.pexels_credit_url.trim()) addWarning("Add the Pexels source URL for attribution tracking.", 4);
  if (internalLinkCount < 1) addWarning("Add at least one internal link to a related site page or blog post.", 8);
  if (!form.facebook_caption.trim()) addWarning("Draft a Facebook caption for launch promotion.", 3);
  if (!form.reddit_discussion_prompt.trim()) addWarning("Draft a Reddit discussion prompt for community-safe promotion.", 3);
  if (keyword && !contentText.toLowerCase().includes(keyword)) addWarning("Use the primary keyword naturally in the article body.", 5);

  return {
    score: Math.max(0, Math.min(100, score)),
    warnings,
  };
}

// ─── Cover Upload ─────────────────────────────────────────────────────────────

interface CoverUploadProps {
  url: string;
  onChange: (url: string, storagePath: string) => void;
  budget: ImageBudget;
  compact?: boolean; // true = sidebar chip, false = full inline zone
}

function CoverUpload({ url, onChange, budget, compact = false }: CoverUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 20 * 1024 * 1024) { toast.error("File too large — max 20 MB before compression"); return; }

    setUploading(true);
    setProgress(40);
    try {
      // Deferred upload: compress in the browser and hold the image as a data
      // URL. It's only written to Supabase Storage when the post is published.
      const dataUrl = await compressImageToDataUrl(file);
      const sizeKb = dataUrlSizeKb(dataUrl);
      if (sizeKb > budget.remainingKb) {
        toast.error(
          `This image is ${sizeKb} KB, but this post only has ${budget.remainingKb} KB left of its ` +
          `${MAX_POST_IMAGES_KB / 1024} MB image budget. Remove an image or pick a smaller one.`
        );
        return;
      }
      setProgress(100);
      onChange(dataUrl, "");
      toast.success(`Cover added — ${sizeKb} KB · uploads when you publish`);
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Couldn't process image");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onChange, budget]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = ""; // allow re-selecting same file
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleRemove = () => {
    // Nothing is in storage until publish, so removing is just clearing state.
    onChange("", "");
  };

  // ── Compact (sidebar) ──────────────────────────────────────────────────────
  if (compact) {
    return (
      <div className="space-y-2">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
        {url ? (
          <div className="relative group rounded-lg overflow-hidden aspect-video bg-muted">
            <Image src={url} alt="cover" fill unoptimized className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/60 backdrop-blur-sm">
              <button onClick={() => inputRef.current?.click()} className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-[11px] hover:bg-muted transition-colors">Replace</button>
              <button onClick={handleRemove} className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 py-5 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-ring transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-[11px]">Uploading… {progress}%</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span className="text-[11px]">Click to upload</span>
                <span className="text-[10px] text-muted-foreground">JPG, PNG, WebP · compressed automatically</span>
              </>
            )}
          </button>
        )}
        {uploading && (
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-200 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    );
  }

  // ── Inline / full (document sheet top) ────────────────────────────────────
  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
      {url ? (
        <div
          className="relative group aspect-[2.4/1] overflow-hidden cursor-pointer"
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          <Image src={url} alt="cover" fill unoptimized className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-muted via-transparent to-transparent" />
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-[12px]">
              <Upload className="w-3.5 h-3.5" /> Replace cover
            </div>
            <button
              onClick={e => { e.stopPropagation(); handleRemove(); }}
              className="p-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Upload progress bar */}
          {uploading && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-muted">
              <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      ) : (
        <div
          className="flex items-center justify-center gap-2 py-5 border-b border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[12px]">Uploading… {progress}%</span>
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              <span className="text-[12px]">Add cover image</span>
              <span className="text-[11px] text-muted-foreground">— drag & drop or click · auto-compressed</span>
            </>
          )}
        </div>
      )}
    </>
  );
}

// ─── Hover delete overlay ─────────────────────────────────────────────────────

const DELETABLE_SELECTOR = 'img, table, blockquote, pre, h1, h2, h3, iframe';

function HoverDeleteButton({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const [target, setTarget] = useState<Element | null>(null);
  const [rect,   setRect  ] = useState<DOMRect   | null>(null);
  const btnWrapRef = useRef<HTMLDivElement>(null);
  const targetRef  = useRef<Element | null>(null);

  const apply = useCallback((el: Element | null) => {
    targetRef.current = el;
    setTarget(el);
    setRect(el ? el.getBoundingClientRect() : null);
  }, []);

  // Timer-free hover tracking: a block stays "active" while the cursor is over
  // either the block itself OR the floating delete button (they visually overlap,
  // so there is never a dead gap to cross).
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const node = e.target as Element;

      // Over the delete button → keep current target, do nothing.
      if (btnWrapRef.current?.contains(node)) return;

      const pm = document.querySelector('.ProseMirror');
      if (!pm) return;

      const el = node.closest(DELETABLE_SELECTOR);
      if (el && pm.contains(el)) {
        if (el !== targetRef.current) apply(el);   // only re-render when block changes
      } else if (targetRef.current) {
        apply(null);                                // left a block → hide immediately
      }
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, [apply]);

  // Keep rect in sync with scroll / resize while a target is active
  useEffect(() => {
    if (!target) return;
    const sync = () => setRect(target.getBoundingClientRect());
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    return () => { window.removeEventListener('scroll', sync, true); window.removeEventListener('resize', sync); };
  }, [target]);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = targetRef.current;
    if (!el || !editor) return;
    const view = editor.view;
    try {
      const tag = el.tagName.toLowerCase();
      if (tag === 'table') {
        const cell = el.querySelector('td, th');
        if (cell) {
          const pos = view.posAtDOM(cell, 0);
          editor.chain().focus().setTextSelection(pos).deleteTable().run();
        }
      } else if (tag === 'img') {
        const pos = view.posAtDOM(el, 0);
        const node = view.state.doc.nodeAt(pos);
        if (node) editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
      } else {
        const innerPos = view.posAtDOM(el, 0);
        const blockPos = Math.max(0, innerPos - 1);
        const node = view.state.doc.nodeAt(blockPos);
        if (node && node.nodeSize > 0) {
          editor.chain().focus().deleteRange({ from: blockPos, to: blockPos + node.nodeSize }).run();
        }
      }
    } catch (err) {
      console.warn('Block delete failed:', err);
    }
    apply(null);
  };

  if (!rect || !target) return null;

  const label = (() => {
    const t = target.tagName.toLowerCase();
    if (/^h[1-6]$/.test(t)) return 'heading';
    if (t === 'pre') return 'code block';
    if (t === 'img') return 'image';
    if (t === 'iframe') return 'video';
    return t; // table, blockquote
  })();

  // Anchor inside the block's top-right corner so there's no gap to cross.
  return (
    <div
      ref={btnWrapRef}
      style={{
        position: 'fixed',
        top: rect.top + 8,
        left: rect.right - 8,
        transform: 'translateX(-100%)',
        zIndex: 200,
      }}
    >
      <button
        type="button"
        onMouseDown={handleDelete}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-destructive text-primary-foreground text-[11px] font-semibold shadow-lg hover:brightness-110 cursor-pointer"
      >
        <Trash2 className="w-3 h-3" />
        Delete {label}
      </button>
    </div>
  );
}

// ─── Table dropdown ───────────────────────────────────────────────────────────

function TableMenu({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click — proper listener so Safari behaves
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  if (!editor) return null;
  const inTable = editor.isActive("table");

  // Plain onClick (not onMouseDown+preventDefault) — works reliably in Safari
  const runAction = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  const actions = inTable ? [
    { label: "Add row above",    fn: () => runAction(() => editor.chain().focus().addRowBefore().run()) },
    { label: "Add row below",    fn: () => runAction(() => editor.chain().focus().addRowAfter().run()) },
    { label: "Delete row",       fn: () => runAction(() => editor.chain().focus().deleteRow().run()), danger: true },
    null, // separator
    { label: "Add column left",  fn: () => runAction(() => editor.chain().focus().addColumnBefore().run()) },
    { label: "Add column right", fn: () => runAction(() => editor.chain().focus().addColumnAfter().run()) },
    { label: "Delete column",    fn: () => runAction(() => editor.chain().focus().deleteColumn().run()), danger: true },
    null,
    { label: "Toggle header row",fn: () => runAction(() => editor.chain().focus().toggleHeaderRow().run()) },
    { label: "Delete table",     fn: () => runAction(() => editor.chain().focus().deleteTable().run()), danger: true },
  ] : [
    { label: "Insert 2 × 2",    fn: () => runAction(() => editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()) },
    { label: "Insert 3 × 3",    fn: () => runAction(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()) },
    { label: "Insert 4 × 4",    fn: () => runAction(() => editor.chain().focus().insertTable({ rows: 4, cols: 4, withHeaderRow: true }).run()) },
    { label: "Insert 3 × 5",    fn: () => runAction(() => editor.chain().focus().insertTable({ rows: 3, cols: 5, withHeaderRow: true }).run()) },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        title="Table"
        className={cn(
          "flex items-center gap-0.5 p-1.5 rounded-md text-[13px] transition-colors",
          inTable || open
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Table2 className="w-4 h-4" />
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[170px] bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1">
          <p className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            {inTable ? "Table options" : "Insert table"}
          </p>
          {actions.map((a, i) =>
            a === null ? (
              <div key={i} className="my-1 border-t border-border" />
            ) : (
              <button
                key={a.label}
                onClick={a.fn}
                className={cn(
                  "w-full text-left px-3 py-2 text-[13px] transition-colors hover:bg-muted",
                  (a as { danger?: boolean }).danger ? "text-destructive" : "text-foreground"
                )}
              >
                {a.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function ToolBtn({
  onClick, active, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={cn(
        "p-1.5 rounded-md text-[13px] transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-4 bg-border mx-0.5 shrink-0" />;
}

function Toolbar({ editor, budget }: { editor: ReturnType<typeof useEditor>; budget: ImageBudget }) {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [imgUploading, setImgUploading] = useState(false);

  if (!editor) return null;

  const handleInlineImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImgUploading(true);
    try {
      // Deferred: compress to a data URL now, upload to storage only on publish.
      const dataUrl = await compressImageToDataUrl(file);
      const sizeKb = dataUrlSizeKb(dataUrl);
      if (sizeKb > budget.remainingKb) {
        toast.error(
          `This image is ${sizeKb} KB, but this post only has ${budget.remainingKb} KB left of its ` +
          `${MAX_POST_IMAGES_KB / 1024} MB image budget. Remove an image or pick a smaller one.`
        );
        return;
      }
      editor.chain().focus().setImage({ src: dataUrl }).run();
      toast.success(`Image added — ${sizeKb} KB · uploads when you publish`);
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Couldn't process image");
    } finally {
      setImgUploading(false);
    }
  };

  const addYoutube = () => {
    const url = window.prompt("Paste YouTube URL:");
    if (url) editor.chain().focus().setYoutubeVideo({ src: url, width: 720, height: 405 }).run();
  };

  return (
    <div className="sticky top-[57px] z-10 border-b border-border bg-background/95 backdrop-blur-sm">
      {/* Hidden file input for inline image upload */}
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInlineImageFile}
      />
      <div className="max-w-3xl mx-auto flex items-center flex-wrap gap-0.5 px-4 sm:px-6 py-2">
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo (⌘Z)" active={false}><Undo2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo (⌘⇧Z)" active={false}><Redo2 className="w-4 h-4" /></ToolBtn>
        <Sep />
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1"><Heading1 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3"><Heading3 className="w-4 h-4" /></ToolBtn>
        <Sep />
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline Code"><Code className="w-4 h-4" /></ToolBtn>
        <Sep />
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List"><List className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List"><ListOrdered className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote"><Quote className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block"><AlignLeft className="w-4 h-4" /></ToolBtn>
        <Sep />
        {/* Image — triggers file upload, compresses, inserts into editor */}
        <ToolBtn
          onClick={() => imgInputRef.current?.click()}
          title="Insert Image (upload & compress)"
          active={imgUploading}
        >
          {imgUploading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <ImageIcon className="w-4 h-4" />
          }
        </ToolBtn>
        <ToolBtn onClick={addYoutube} title="Embed YouTube"><PlayCircle className="w-4 h-4" /></ToolBtn>
        <Sep />
        <TableMenu editor={editor} />
      </div>
    </div>
  );
}

// ─── Settings Panel ───────────────────────────────────────────────────────────

function SettingsPanel({
  form, onChange, isPublished, wordCount, budget, seoAnalysis, socialLinks,
  publicBlogUrl, onPostSocial, socialPending,
}: {
  form: FormState;
  onChange: (f: Partial<FormState>) => void;
  isPublished: boolean;
  wordCount: number;
  budget: ImageBudget;
  seoAnalysis: SeoAnalysis;
  socialLinks: SocialLinks;
  publicBlogUrl: string;
  onPostSocial: (platform: SocialPlatform) => void;
  socialPending: boolean;
}) {
  const inputCls = "w-full bg-muted border border-border rounded-lg px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring transition-colors resize-none";

  const usedKb = MAX_POST_IMAGES_KB - budget.remainingKb;
  const usedPct = Math.min(100, Math.round((usedKb / MAX_POST_IMAGES_KB) * 100));
  const nearLimit = usedPct >= 85;

  return (
    <div className="flex flex-col gap-0 divide-y divide-border">

      {/* Status */}
      <div className="p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Status</p>
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium border border-border",
          isPublished ? "bg-muted text-primary" : "bg-muted text-muted-foreground"
        )}>
          {isPublished ? <Globe className="w-3.5 h-3.5 shrink-0" /> : <FileText className="w-3.5 h-3.5 shrink-0" />}
          {isPublished ? "Published" : "Draft"}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">{wordCount} words</p>
      </div>

      {/* Social publishing */}
      <div className="p-4 space-y-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Social Publishing</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onPostSocial("facebook")}
            disabled={!isPublished || socialPending}
            className="min-h-12 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-[12px] font-medium text-foreground hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {socialPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Facebook
          </button>
          <button
            type="button"
            onClick={() => onPostSocial("reddit")}
            disabled={!isPublished || socialPending}
            className="min-h-12 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-[12px] font-medium text-foreground hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {socialPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Reddit
          </button>
        </div>
        {!isPublished && (
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Publish the blog first, then post it to Facebook or Reddit.
          </p>
        )}
        {isPublished && (
          <div className="grid grid-cols-1 gap-2">
            <a
              href={publicBlogUrl}
              target="_blank"
              rel="noreferrer"
              className="min-h-10 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Blog
            </a>
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="min-h-10 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Facebook Post
              </a>
            )}
            {socialLinks.reddit && (
              <a
                href={socialLinks.reddit}
                target="_blank"
                rel="noreferrer"
                className="min-h-10 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Reddit Post
              </a>
            )}
          </div>
        )}
      </div>

      {/* Slug */}
      <div className="p-4">
        <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">URL Slug</label>
        <div className="flex items-center gap-1.5 bg-muted border border-border rounded-lg px-3 py-2">
          <span className="text-[11px] text-muted-foreground shrink-0">/blog/</span>
          <input
            value={form.slug}
            onChange={e => onChange({ slug: slugify(e.target.value), slugManual: true })}
            className="flex-1 bg-transparent text-[12px] text-foreground font-mono focus:outline-none min-w-0"
            placeholder="your-slug"
          />
        </div>
      </div>

      {/* Cover image */}
      <div className="p-4">
        <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Cover Image</label>
        <CoverUpload
          compact
          url={form.cover_image_url}
          onChange={(url, path) => onChange({ cover_image_url: url, cover_storage_path: path })}
          budget={budget}
        />
      </div>

      {/* Image SEO */}
      <div className="p-4 space-y-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Image SEO</p>
        <div>
          <label className="block text-[11px] text-muted-foreground mb-1.5">Image Alt Text</label>
          <input
            value={form.image_alt_text}
            onChange={e => onChange({ image_alt_text: e.target.value })}
            placeholder="Describe the cover image and its article context"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] text-muted-foreground mb-1.5">Image Caption</label>
          <textarea
            value={form.image_caption}
            onChange={e => onChange({ image_caption: e.target.value })}
            rows={2}
            placeholder="Short caption shown below the cover image"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] text-muted-foreground mb-1.5">Pexels Credit URL</label>
          <input
            value={form.pexels_credit_url}
            onChange={e => onChange({ pexels_credit_url: e.target.value })}
            placeholder="https://www.pexels.com/photo/..."
            className={inputCls}
          />
        </div>
      </div>

      {/* Image budget */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Image Storage</label>
          <span className={cn("text-[11px]", nearLimit ? "text-primary" : "text-muted-foreground")}>
            {(usedKb / 1024).toFixed(2)} / {(MAX_POST_IMAGES_KB / 1024).toFixed(0)} MB
          </span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", nearLimit ? "bg-primary" : "bg-primary")}
            style={{ width: `${usedPct}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Cover + inline images for this post, after auto-compression (~1200px JPEG). Uploaded to storage only when you publish — drafts stay local.
        </p>
      </div>

      {/* Excerpt */}
      <div className="p-4">
        <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Excerpt</label>
        <textarea
          value={form.excerpt}
          onChange={e => onChange({ excerpt: e.target.value })}
          rows={3}
          placeholder="Short summary shown on blog index and landing page…"
          className={inputCls}
        />
      </div>

      {/* SEO */}
      <div className="p-4 space-y-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">SEO</p>
        <div>
          <label className="block text-[11px] text-muted-foreground mb-1.5">SEO Title</label>
          <input
            value={form.seo_title}
            onChange={e => onChange({ seo_title: e.target.value })}
            placeholder="Defaults to post title"
            maxLength={60}
            className={inputCls}
          />
          <div className="flex justify-end mt-1">
            <span className={cn("text-[10px]", form.seo_title.length > 55 ? "text-primary" : "text-muted-foreground")}>
              {form.seo_title.length}/60
            </span>
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-muted-foreground mb-1.5">Meta Description</label>
          <textarea
            value={form.seo_description}
            onChange={e => onChange({ seo_description: e.target.value })}
            rows={3}
            placeholder="Shown in Google results (150–160 chars)"
            maxLength={160}
            className={inputCls}
          />
          <div className="flex justify-end mt-1">
            <span className={cn("text-[10px]", form.seo_description.length > 150 ? "text-primary" : form.seo_description.length > 0 ? "text-primary" : "text-muted-foreground")}>
              {form.seo_description.length}/160
            </span>
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-muted-foreground mb-1.5">Primary Keyword</label>
          <input
            value={form.primary_keyword}
            onChange={e => onChange({ primary_keyword: e.target.value })}
            placeholder="e.g. small business booking checklist"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] text-muted-foreground mb-1.5">Search Intent</label>
          <textarea
            value={form.search_intent}
            onChange={e => onChange({ search_intent: e.target.value })}
            rows={2}
            placeholder="What exact question should this article answer?"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] text-muted-foreground mb-1.5">Internal Links</label>
          <textarea
            value={form.internal_links}
            onChange={e => onChange({ internal_links: e.target.value })}
            rows={3}
            placeholder="/blog&#10;/#features&#10;/#pricing"
            className={inputCls}
          />
        </div>
      </div>

      {/* Social drafts */}
      <div className="p-4 space-y-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Social Drafts</p>
        <div>
          <label className="block text-[11px] text-muted-foreground mb-1.5">Facebook Caption</label>
          <textarea
            value={form.facebook_caption}
            onChange={e => onChange({ facebook_caption: e.target.value })}
            rows={3}
            placeholder="Short launch caption for your Facebook Page"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] text-muted-foreground mb-1.5">Reddit Discussion Prompt</label>
          <textarea
            value={form.reddit_discussion_prompt}
            onChange={e => onChange({ reddit_discussion_prompt: e.target.value })}
            rows={3}
            placeholder="Discussion-first prompt, not a direct ad"
            className={inputCls}
          />
        </div>
      </div>

      {/* SEO quality */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Quality Gate</p>
          <span className={cn(
            "inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-medium",
            seoAnalysis.score >= 85 ? "text-primary" : "text-muted-foreground"
          )}>
            <Search className="w-3 h-3" />
            {seoAnalysis.score}/100
          </span>
        </div>
        {seoAnalysis.warnings.length === 0 ? (
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-[11px] text-primary">
            <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>This post passes the blog SEO checklist.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {seoAnalysis.warnings.slice(0, 6).map((warning) => (
              <div key={warning} className="flex items-start gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-[11px] text-muted-foreground">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <p>{warning}</p>
              </div>
            ))}
            {seoAnalysis.warnings.length > 6 && (
              <p className="text-[10px] text-muted-foreground">
                {seoAnalysis.warnings.length - 6} more checks need attention.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  slug: string;
  slugManual: boolean;
  excerpt: string;
  cover_image_url: string;
  cover_storage_path: string; // storage path for deletion on replace/remove
  content: string;
  image_alt_text: string;
  image_caption: string;
  pexels_credit_url: string;
  seo_title: string;
  seo_description: string;
  primary_keyword: string;
  search_intent: string;
  internal_links: string;
  facebook_caption: string;
  reddit_discussion_prompt: string;
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

interface BlogEditorPageProps {
  post?: BlogPost | null;
  orgId: string;
}

export function BlogEditorPage({ post, orgId }: BlogEditorPageProps) {
  const router = useRouter();
  const isEdit = !!post;
  const [postId, setPostId] = useState<string | null>(post?.id ?? null);
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState<FormState>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    slugManual: isEdit,
    excerpt: post?.excerpt ?? "",
    cover_image_url: post?.cover_image_url ?? "",
    cover_storage_path: "",  // existing posts: path unknown; deletion handled on replace
    content: post?.content ?? "",
    image_alt_text: post?.image_alt_text ?? "",
    image_caption: post?.image_caption ?? "",
    pexels_credit_url: post?.pexels_credit_url ?? "",
    seo_title: post?.seo_title ?? "",
    seo_description: post?.seo_description ?? "",
    primary_keyword: post?.primary_keyword ?? "",
    search_intent: post?.search_intent ?? "",
    internal_links: post?.internal_links ?? "",
    facebook_caption: post?.facebook_caption ?? "",
    reddit_discussion_prompt: post?.reddit_discussion_prompt ?? "",
  });

  const updateForm = useCallback((f: Partial<FormState>) => {
    setForm(prev => {
      const next = { ...prev, ...f };
      if (!next.slugManual && f.title !== undefined) {
        next.slug = slugify(f.title);
      }
      return next;
    });
  }, []);

  // ── Per-post image storage budget ──────────────────────────────────────────
  // Mirror form in a ref so async callbacks (uploads, paste, doc-diff, unmount)
  // always see the latest cover/content without re-subscribing on every keystroke.
  const formRef = useRef(form);
  useEffect(() => { formRef.current = form; }, [form]);

  // Image budget is computed entirely in-memory from the data URLs currently
  // held in the form — no storage reads, because nothing is uploaded until
  // publish. (Already-published remote images don't count against the budget.)
  const usedImagesKb = useMemo(
    () => localImageUsageKb(form.cover_image_url, form.content),
    [form.cover_image_url, form.content],
  );

  const imageBudget: ImageBudget = {
    remainingKb: Math.max(0, MAX_POST_IMAGES_KB - usedImagesKb),
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ controls: true, nocookie: true }),
      Placeholder.configure({
        placeholder: ({ node }: { node: { type: { name: string } } }) =>
          node.type.name === 'heading' ? 'Type a heading…' : 'Start writing your blog post…',
      }),
      TableKit.configure({ table: { resizable: false } }),
    ],
    content: form.content,
    onUpdate: ({ editor }) => {
      updateForm({ content: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[60vh] leading-relaxed",
      },
      // Notion-style markdown paste: plain-text pastes that look like markdown
      // (headings, bold, lists, links…) are parsed to HTML and inserted as
      // rich content instead of landing as raw "## Heading" text.
      handlePaste: (view, event) => {
        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        const text = clipboard.getData("text/plain");
        const html = clipboard.getData("text/html");
        if (!text || html || !looksLikeMarkdown(text)) return false;

        event.preventDefault();
        const parsedHtml = marked.parse(text, { async: false }) as string;
        const dom = new window.DOMParser().parseFromString(parsedHtml, "text/html");
        const slice = PMDOMParser.fromSchema(view.state.schema).parseSlice(dom.body);
        view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
        return true;
      },
    },
  });

  const wordCount = form.content
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const seoAnalysis = useMemo(() => analyzeSeo(form, wordCount), [form, wordCount]);

  // ── Build payload ──────────────────────────────────────────────────────────

  const buildPayload = (overrides: Partial<BlogPostInput> = {}): BlogPostInput => {
    return {
      title: form.title || "Untitled",
      slug: form.slug || slugify(form.title || "untitled"),
      excerpt: form.excerpt || undefined,
      content: form.content,
      cover_image_url: form.cover_image_url || undefined,
      image_alt_text: form.image_alt_text || undefined,
      image_caption: form.image_caption || undefined,
      pexels_credit_url: form.pexels_credit_url || undefined,
      seo_title: form.seo_title || undefined,
      seo_description: form.seo_description || undefined,
      primary_keyword: form.primary_keyword || undefined,
      search_intent: form.search_intent || undefined,
      internal_links: form.internal_links || undefined,
      facebook_caption: form.facebook_caption || undefined,
      reddit_discussion_prompt: form.reddit_discussion_prompt || undefined,
      seo_quality_score: seoAnalysis.score,
      pre_publish_warnings: seoAnalysis.warnings.join("\n") || undefined,
      ...overrides,
    };
  };

  // Uploads every in-editor data URL (cover + inline) to Supabase Storage and
  // returns the rewritten cover/content pointing at the public CDN URLs. This
  // is the ONLY place blog images are written to storage — called on publish.
  const materializeImages = async (): Promise<{ cover: string; content: string }> => {
    let cover = formRef.current.cover_image_url;
    let content = formRef.current.content;

    if (cover && isDataUrl(cover)) {
      const { url } = await uploadDataUrl(cover);
      cover = url;
    }
    const dataSrcs = Array.from(new Set(extractImageSrcs(content).filter(isDataUrl)));
    for (const src of dataSrcs) {
      const { url } = await uploadDataUrl(src);
      content = content.split(src).join(url);
    }
    return { cover, content };
  };

  // ── Save draft ─────────────────────────────────────────────────────────────

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = buildPayload();
      let result: BlogPost;
      if (postId) {
        result = await updateBlogPost(postId, payload);
      } else {
        const created = await createBlogPost(payload, orgId);
        setPostId(created.id);
        window.history.replaceState({}, "", `/dashboard/blog/${created.id}`);
        result = created;
      }
      return result;
    },
    onMutate: () => setSaveStatus("saving"),
    onSuccess: () => {
      setSaveStatus("saved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
    },
    onError: (e: Error) => {
      setSaveStatus("idle");
      toast.error(e.message);
    },
  });

  // ── Publish / Unpublish ────────────────────────────────────────────────────

  const publishMutation = useMutation({
    mutationFn: async () => {
      // Unpublish path never uploads — just flip the flag back to draft.
      if (isPublished && postId) {
        await unpublishBlogPost(postId);
        setIsPublished(false);
        toast.success("Post unpublished");
        return;
      }

      // Publish path: NOW upload every data-URL image to storage, rewrite the
      // content to point at the public URLs, then persist + publish.
      const { cover, content } = await materializeImages();
      // Reflect the real URLs back into the editor so a second publish doesn't
      // re-upload the same images.
      if (cover !== formRef.current.cover_image_url || content !== formRef.current.content) {
        updateForm({ cover_image_url: cover, content });
        editor?.commands.setContent(content);
      }

      const payload = buildPayload({ content, cover_image_url: cover || undefined });
      let id = postId;
      if (!id) {
        const created = await createBlogPost(payload, orgId);
        id = created.id;
        setPostId(created.id);
        window.history.replaceState({}, "", `/dashboard/blog/${created.id}`);
      } else {
        await updateBlogPost(id, payload);
      }
      await publishBlogPost(id);
      setIsPublished(true);
      toast.success("Post published — now live at /blog/" + (form.slug || "untitled"));
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const socialPublishMutation = useMutation({
    mutationFn: async (platform: SocialPlatform) => {
      if (!postId) throw new Error("Save and publish the blog post first.");
      if (!isPublished) throw new Error("Publish the blog post before posting to social media.");

      const response = await fetch("/api/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          platform,
          caption: platform === "facebook" ? form.facebook_caption : form.reddit_discussion_prompt,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 503 && Array.isArray(result.missing)) {
          throw new Error(`${result.error} Missing: ${result.missing.join(", ")}`);
        }
        throw new Error(result.error || "Social publishing failed.");
      }

      return result as { platform: SocialPlatform; url: string };
    },
    onSuccess: (result) => {
      setSocialLinks(prev => ({ ...prev, [result.platform]: result.url }));
      toast.success(`Posted to ${result.platform === "facebook" ? "Facebook" : "Reddit"}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isBusy = saveMutation.isPending || publishMutation.isPending || socialPublishMutation.isPending;
  const publicBlogUrl = isPublished ? `/blog/${form.slug || slugify(form.title) || "untitled"}` : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 h-[57px] flex items-center justify-between gap-4 px-4 border-b border-border bg-background/95 backdrop-blur-sm shrink-0">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard?tab=blog")}
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Blog</span>
          </button>
          <div className="w-px h-4 bg-border" />
          <span className="text-[13px] text-muted-foreground truncate max-w-[180px] sm:max-w-xs">
            {form.title || "Untitled post"}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Save status */}
          <span className={cn(
            "text-[11px] transition-all duration-300 hidden sm:flex items-center gap-1",
            saveStatus === "saving" ? "text-muted-foreground" :
            saveStatus === "saved"  ? "text-primary" : "text-muted-foreground"
          )}>
            {saveStatus === "saving" && <Loader2 className="w-3 h-3 animate-spin" />}
            {saveStatus === "saved"  && <Check className="w-3 h-3" />}
            {saveStatus === "saving" ? "Saving…" : "Saved"}
          </span>

          {/* Save draft */}
          <button
            onClick={() => saveMutation.mutate()}
            disabled={isBusy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
          >
            {saveMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {isPublished && (
            <a
              href={publicBlogUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">View Blog</span>
            </a>
          )}

          <button
            onClick={() => socialPublishMutation.mutate("facebook")}
            disabled={isBusy || !isPublished}
            title={isPublished ? "Post this blog to Facebook Page" : "Publish the blog first"}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
          >
            {socialPublishMutation.isPending
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Send className="w-3.5 h-3.5" />
            }
            <span className="hidden xl:inline">Post FB</span>
          </button>

          <button
            onClick={() => socialPublishMutation.mutate("reddit")}
            disabled={isBusy || !isPublished}
            title={isPublished ? "Post this blog to Reddit" : "Publish the blog first"}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
          >
            {socialPublishMutation.isPending
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Send className="w-3.5 h-3.5" />
            }
            <span className="hidden xl:inline">Post Reddit</span>
          </button>

          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">View FB</span>
            </a>
          )}

          {socialLinks.reddit && (
            <a
              href={socialLinks.reddit}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">View Reddit</span>
            </a>
          )}

          {/* Publish / Unpublish */}
          <button
            onClick={() => publishMutation.mutate()}
            disabled={isBusy || !form.title}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50 border",
              isPublished
                ? "bg-muted text-muted-foreground hover:text-foreground border-border"
                : "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent"
            )}
          >
            {publishMutation.isPending
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : isPublished
                ? <EyeOff className="w-3.5 h-3.5" />
                : <Globe className="w-3.5 h-3.5" />
            }
            {isPublished ? "Unpublish" : "Publish"}
          </button>

          {/* Settings toggle */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            title="Toggle settings"
            className={cn(
              "p-2 rounded-lg transition-colors border",
              sidebarOpen
                ? "bg-muted text-foreground border-border"
                : "text-muted-foreground border-border hover:text-foreground hover:bg-muted"
            )}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 bg-background">

        {/* Editor column */}
        <div className="flex-1 min-w-0 flex flex-col">

          <Toolbar editor={editor} budget={imageBudget} />

          {/* Writing area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">

              {/* Document sheet */}
              <div className="rounded-2xl border border-border bg-muted shadow-lg overflow-hidden">

                {/* Cover zone */}
                <CoverUpload
                  url={form.cover_image_url}
                  onChange={(url, path) => updateForm({ cover_image_url: url, cover_storage_path: path })}
                  budget={imageBudget}
                />

                {/* Inner padding */}
                <div className="px-6 sm:px-10 py-8 sm:py-10">

                  {/* Title */}
                  <input
                    value={form.title}
                    onChange={e => updateForm({ title: e.target.value })}
                    placeholder="Post title"
                    className="w-full bg-transparent text-3xl sm:text-[2.5rem] font-bold text-foreground placeholder:text-muted-foreground focus:outline-none mb-3 leading-[1.15] tracking-tight"
                  />

                  {/* Slug preview */}
                  <div className="flex items-center gap-2 mb-8 pb-6 border-b border-border">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      /blog/<span className="text-foreground">{form.slug || slugify(form.title) || "your-slug"}</span>
                    </span>
                  </div>

                  {/* Hover-delete overlay — rendered once, works globally in editor */}
                  {editor && <HoverDeleteButton editor={editor} />}

                  {/* TipTap — all prose styles live in globals.css .ProseMirror rules */}
                  <div className="blog-editor-prose">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>

              {/* Footer meta */}
              <p className="text-center text-[11px] text-muted-foreground mt-4">
                {wordCount} words · ~{Math.max(1, Math.ceil(wordCount / 200))} min read
              </p>
            </div>
          </div>
        </div>

        {/* ── Settings sidebar ────────────────────────────────────────────── */}
        <aside className={cn(
          "shrink-0 border-l border-border bg-card overflow-y-auto transition-all duration-200",
          sidebarOpen ? "w-72" : "w-0 overflow-hidden border-l-0"
        )}>
          {sidebarOpen && (
            <SettingsPanel
              form={form}
              onChange={updateForm}
              isPublished={isPublished}
              wordCount={wordCount}
              budget={imageBudget}
              seoAnalysis={seoAnalysis}
              socialLinks={socialLinks}
              publicBlogUrl={publicBlogUrl}
              onPostSocial={(platform) => socialPublishMutation.mutate(platform)}
              socialPending={socialPublishMutation.isPending}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
