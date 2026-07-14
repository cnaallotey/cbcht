import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { BlogPost } from '../../types';
import { X, Upload, Save, Loader2, Bold, Italic, List } from 'lucide-react';

// Helper functions for simple HTML / Markdown conversion
const mdToHtml = (md: string): string => {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
    .split('\n\n')
    .map(block => {
      if (block.trim().startsWith('<h') || block.trim().startsWith('<li')) {
        return block;
      }
      if (block.trim() === '') return '';
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');
};

const htmlToMd = (html: string): string => {
  if (!html) return '';
  const temp = document.createElement('div');
  temp.innerHTML = html;

  let markdown = '';
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      markdown += node.nodeValue;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      
      if (tag === 'p') {
        markdown += '\n\n';
        Array.from(el.childNodes).forEach(processNode);
        markdown += '\n\n';
      } else if (tag === 'br') {
        markdown += '\n';
      } else if (tag === 'strong' || tag === 'b') {
        markdown += '**';
        Array.from(el.childNodes).forEach(processNode);
        markdown += '**';
      } else if (tag === 'em' || tag === 'i') {
        markdown += '*';
        Array.from(el.childNodes).forEach(processNode);
        markdown += '*';
      } else if (tag === 'h1') {
        markdown += '\n\n# ';
        Array.from(el.childNodes).forEach(processNode);
        markdown += '\n\n';
      } else if (tag === 'h2') {
        markdown += '\n\n## ';
        Array.from(el.childNodes).forEach(processNode);
        markdown += '\n\n';
      } else if (tag === 'h3') {
        markdown += '\n\n### ';
        Array.from(el.childNodes).forEach(processNode);
        markdown += '\n\n';
      } else if (tag === 'li') {
        markdown += '\n- ';
        Array.from(el.childNodes).forEach(processNode);
        markdown += '\n';
      } else if (tag === 'ul' || tag === 'ol') {
        Array.from(el.childNodes).forEach(processNode);
        markdown += '\n';
      } else {
        Array.from(el.childNodes).forEach(processNode);
      }
    }
  };

  Array.from(temp.childNodes).forEach(processNode);
  return markdown
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '')
    .trim();
};

interface BlogPostFormProps {
  post?: BlogPost | null;
  onClose: () => void;
}

export default function BlogPostForm({ post, onClose }: BlogPostFormProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [date, setDate] = useState(post?.date ? new Date(post.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [author, setAuthor] = useState(post?.author || 'Reverend Lina Sunu Atta');
  const [category, setCategory] = useState(post?.category || 'Daily Devotional');
  const [image, setImage] = useState(post?.image || '');

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Load editor HTML once on mount/post load
  useEffect(() => {
    if (editorRef.current && post?.content && !editorLoaded) {
      editorRef.current.innerHTML = mdToHtml(post.content);
      setEditorLoaded(true);
    }
  }, [post, editorLoaded]);

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setContent(htmlToMd(html));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const storageRef = ref(storage, `blogs/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setImageProgress(percent);
      },
      (error) => {
        console.error('Image upload failed:', error);
        alert('Image upload failed: ' + error.message);
        setUploadingImage(false);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setImage(downloadUrl);
        setUploadingImage(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const postData = {
      title,
      date: new Date(date).toISOString(),
      excerpt,
      content,
      author,
      category,
      image: image || 'https://images.unsplash.com/photo-1469474094887-b1e7632f7b21?q=80&w=2547&auto=format&fit=crop'
    };

    try {
      if (post?.id) {
        // Update existing post
        await updateDoc(doc(db, 'blogPosts', post.id), postData);
      } else {
        // Create new post
        await addDoc(collection(db, 'blogPosts'), postData);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving post:', err);
      alert('Error saving post: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-stone-200 w-full max-w-2xl rounded-none p-6 md:p-8 text-stone-900 shadow-2xl relative my-8">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-none bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-900"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="font-serif text-2xl font-bold mb-6 text-church-blue">
          {post ? 'Edit Devotional / Announcement' : 'Add New Devotional / Announcement'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Title</label>
              <input
                type="text"
                required
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Publish Date</label>
              <input
                type="datetime-local"
                required
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Author Name</label>
              <input
                type="text"
                required
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Category</label>
              <select
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Daily Devotional">Daily Devotional</option>
                <option value="Announcement">Announcement</option>
                <option value="Event Update">Event Update</option>
                <option value="Community News">Community News</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Cover Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  className="flex-1 rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                <label className="h-[48px] px-4 rounded-none border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center cursor-pointer transition-colors text-stone-600">
                  <Upload className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              </div>
              {uploadingImage && (
                <div className="w-full bg-stone-100 h-1.5 rounded-none overflow-hidden">
                  <div className="bg-church-blue h-full transition-all duration-300" style={{ width: `${imageProgress}%` }}></div>
                </div>
              )}
              {image && (
                <div className="mt-2 relative h-24 w-40 rounded-none overflow-hidden border border-stone-200 bg-stone-100">
                  <img src={image} alt="Cover Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Short Excerpt (Teaser text)</label>
              <input
                type="text"
                placeholder="Brief single-sentence summary of the post..."
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            {/* WYSIWYG Content Body */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Main Content (Visual Editor)</label>
              <div className="border border-stone-200 bg-stone-50 rounded-none overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-1 bg-stone-100 border-b border-stone-200 p-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    className="p-2 hover:bg-stone-200 text-stone-700 font-bold rounded-none border border-transparent transition-colors"
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    className="p-2 hover:bg-stone-200 text-stone-700 italic rounded-none border border-transparent transition-colors"
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<h3>')}
                    className="py-1 px-2.5 hover:bg-stone-200 text-stone-700 font-serif font-bold text-xs rounded-none border border-transparent transition-colors"
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<h2>')}
                    className="py-1 px-2.5 hover:bg-stone-200 text-stone-700 font-serif font-bold text-xs rounded-none border border-transparent transition-colors"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    className="p-2 hover:bg-stone-200 text-stone-700 rounded-none border border-transparent transition-colors"
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <div className="h-6 w-px bg-stone-200 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => execCommand('removeFormat')}
                    className="py-1 px-2 hover:bg-stone-200 text-stone-500 text-[10px] uppercase tracking-widest font-bold rounded-none border border-transparent transition-colors"
                    title="Clear Formatting"
                  >
                    Clear
                  </button>
                </div>
                {/* Visual Workspace */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={(e) => {
                    const html = e.currentTarget.innerHTML;
                    setContent(htmlToMd(html));
                  }}
                  className="w-full min-h-[200px] max-h-[400px] bg-white p-4 text-sm text-stone-900 focus:outline-none overflow-y-auto font-sans prose prose-stone max-w-none"
                  style={{ outline: 'none' }}
                  data-placeholder="Write the full devotional message or blog content here..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 rounded-none border border-stone-200 hover:bg-stone-50 transition-colors text-sm font-bold uppercase tracking-widest text-stone-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-none bg-church-blue hover:bg-blue-800 text-white transition-all font-bold uppercase tracking-widest text-sm disabled:opacity-50 shadow-md"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Devotional
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
