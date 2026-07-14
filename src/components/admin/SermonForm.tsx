import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Sermon } from '../../types';
import { X, Upload, Save, Loader2, Plus, Trash2, Bold, Italic, List } from 'lucide-react';

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

const extractVideoId = (urlOrId: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : urlOrId;
};

interface SermonFormProps {
  sermon?: Sermon | null;
  onClose: () => void;
}

export default function SermonForm({ sermon, onClose }: SermonFormProps) {
  const [title, setTitle] = useState(sermon?.title || '');
  const [date, setDate] = useState(sermon?.date ? new Date(sermon.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
  const [scriptures, setScriptures] = useState<string[]>(
    sermon?.scripture 
      ? sermon.scripture.split(',').map(s => s.trim()).filter(Boolean)
      : ['']
  );
  const [videoId, setVideoId] = useState(sermon?.videoId || '');
  const [thumbnail, setThumbnail] = useState(sermon?.thumbnail || '');
  const [transcript, setTranscript] = useState(sermon?.transcript || '');
  const [notesUrl, setNotesUrl] = useState(sermon?.notesUrl || '');

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docProgress, setDocProgress] = useState(0);
  
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync Video ID to YouTube Thumbnail URL automatically
  useEffect(() => {
    const cleanedId = videoId.trim();
    if (cleanedId && cleanedId.length === 11) {
      setThumbnail(`https://img.youtube.com/vi/${cleanedId}/maxresdefault.jpg`);
    }
  }, [videoId]);

  // Load editor HTML once on mount/sermon load
  useEffect(() => {
    if (editorRef.current && sermon?.transcript && !editorLoaded) {
      editorRef.current.innerHTML = mdToHtml(sermon.transcript);
      setEditorLoaded(true);
    }
  }, [sermon, editorLoaded]);

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setTranscript(htmlToMd(html));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const storageRef = ref(storage, `thumbnails/${Date.now()}_${file.name}`);
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
        setThumbnail(downloadUrl);
        setUploadingImage(false);
      }
    );
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    const storageRef = ref(storage, `notes/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setDocProgress(percent);
      },
      (error) => {
        console.error('Document upload failed:', error);
        alert('Document upload failed: ' + error.message);
        setUploadingDoc(false);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setNotesUrl(downloadUrl);
        setUploadingDoc(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sermonData = {
      title,
      date: new Date(date).toISOString(),
      scripture: scriptures.map(s => s.trim()).filter(Boolean).join(', '),
      videoId,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=2603&auto=format&fit=crop',
      transcript,
      notesUrl
    };

    try {
      if (sermon?.id) {
        // Update existing sermon
        await updateDoc(doc(db, 'sermons', sermon.id), sermonData);
      } else {
        // Create new sermon
        await addDoc(collection(db, 'sermons'), sermonData);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving sermon:', err);
      alert('Error saving sermon: ' + err.message);
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
          {sermon ? 'Edit Sermon Details' : 'Add New Sermon'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Sermon Title</label>
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
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Date & Time preached</label>
              <input
                type="datetime-local"
                required
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Video ID */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">YouTube Video ID / URL</label>
              <input
                type="text"
                required
                placeholder="e.g. qW_S_1B5JvU"
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={videoId}
                onChange={(e) => setVideoId(extractVideoId(e.target.value))}
              />
            </div>

            {/* Dynamic Scriptures Section */}
            <div className="sm:col-span-2 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Scripture References</label>
              <div className="space-y-2">
                {scriptures.map((ref, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. John 3:16"
                      className="flex-1 rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                      value={ref}
                      onChange={(e) => {
                        const updated = [...scriptures];
                        updated[idx] = e.target.value;
                        setScriptures(updated);
                      }}
                    />
                    {scriptures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setScriptures(scriptures.filter((_, i) => i !== idx));
                        }}
                        className="p-3.5 border border-stone-200 hover:bg-red-50 hover:text-red-600 transition-colors text-stone-500 rounded-none bg-stone-50"
                        title="Remove Scripture"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setScriptures([...scriptures, ''])}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-church-blue uppercase tracking-widest hover:text-blue-800 transition-colors mt-1"
              >
                <Plus className="h-3 w-3" /> Add Scripture Reference
              </button>
            </div>

            {/* YouTube Embed Video Player Preview */}
            {videoId && videoId.trim().length === 11 && (
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Sermon Video Preview</label>
                <div className="aspect-video w-full border border-stone-200 bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId.trim()}`}
                    title="Sermon Video Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* PDF Notes URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Sermon Notes PDF</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PDF URL"
                  className="flex-1 rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                  value={notesUrl}
                  onChange={(e) => setNotesUrl(e.target.value)}
                />
                <label className="h-[48px] px-4 rounded-none border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center cursor-pointer transition-colors text-stone-600">
                  <Upload className="h-4 w-4" />
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleDocUpload} disabled={uploadingDoc} />
                </label>
              </div>
              {uploadingDoc && (
                <div className="w-full bg-stone-100 h-1.5 rounded-none overflow-hidden">
                  <div className="bg-church-blue h-full transition-all duration-300" style={{ width: `${docProgress}%` }}></div>
                </div>
              )}
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Thumbnail Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  className="flex-1 rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
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
            </div>

            {/* WYSIWYG Rich Text Sermon Editor */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Sermon Notes & Transcript (Visual Editor)</label>
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
                {/* Visual Contenteditable Workspace */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={(e) => {
                    const html = e.currentTarget.innerHTML;
                    setTranscript(htmlToMd(html));
                  }}
                  className="w-full min-h-[200px] max-h-[400px] bg-white p-4 text-sm text-stone-900 focus:outline-none overflow-y-auto font-sans prose prose-stone max-w-none"
                  style={{ outline: 'none' }}
                  data-placeholder="Write sermon notes, bullet points or full transcript here..."
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
              disabled={saving || uploadingImage || uploadingDoc}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-none bg-church-blue hover:bg-blue-800 text-white transition-all font-bold uppercase tracking-widest text-sm disabled:opacity-50 shadow-md"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Sermon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
