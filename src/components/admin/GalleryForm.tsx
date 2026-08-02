'use client';

import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { GalleryGroup, GalleryImage } from '../../types';
import { formatImageUrl, parseImageUrlList } from '../../lib/imageUtils';
import { X, Save, Loader2, Plus, Trash2, HelpCircle, Image as ImageIcon, Sparkles, Link as LinkIcon } from 'lucide-react';

interface GalleryFormProps {
  group?: GalleryGroup | null;
  onClose: () => void;
}

export default function GalleryForm({ group, onClose }: GalleryFormProps) {
  const [name, setName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');
  const [date, setDate] = useState(group?.date || new Date().toISOString().split('T')[0]);
  const [images, setImages] = useState<GalleryImage[]>(group?.images || []);
  
  // Bulk paste input modal/textarea state
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  
  // Single link state
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const [saving, setSaving] = useState(false);

  // Add a single image link
  const handleAddSingleImage = () => {
    if (!newUrl.trim()) return;
    const formatted = formatImageUrl(newUrl.trim());
    const newImage: GalleryImage = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      url: formatted,
      caption: newCaption.trim() || undefined
    };
    setImages(prev => [...prev, newImage]);
    setNewUrl('');
    setNewCaption('');
  };

  // Add multiple image links from bulk input
  const handleAddBulkImages = () => {
    const formattedUrls = parseImageUrlList(bulkInput);
    if (formattedUrls.length === 0) return;

    const newEntries: GalleryImage[] = formattedUrls.map((url, idx) => ({
      id: `img_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      url
    }));

    setImages(prev => [...prev, ...newEntries]);
    setBulkInput('');
    setShowBulkPaste(false);
  };

  // Remove an image entry
  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Update caption of an existing image
  const handleUpdateCaption = (id: string, caption: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, caption } : img));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a group name.');
      return;
    }

    if (images.length === 0) {
      alert('Please add at least one image to this gallery group.');
      return;
    }

    setSaving(true);

    const groupData = {
      name: name.trim(),
      description: description.trim(),
      date,
      images,
      createdAt: group?.createdAt || new Date().toISOString()
    };

    try {
      if (group?.id) {
        await updateDoc(doc(db, 'gallery', group.id), groupData);
      } else {
        await addDoc(collection(db, 'gallery'), groupData);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving gallery group:', err);
      alert('Error saving gallery group: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-stone-200 w-full max-w-3xl rounded-none p-6 md:p-8 text-stone-900 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6 shrink-0">
          <div>
            <h3 className="font-serif text-2xl font-bold text-church-blue flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-church-gold" />
              {group ? 'Edit Gallery Group' : 'Create New Gallery Group'}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Group photos by event or theme and paste image URLs (Google Drive, Google Photos, or direct links).
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-none bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Group Name & Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-600">
                Group / Album Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Youth Summit 2026, Easter Sunday Service, Annual Convention"
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-600">
                Event Date
              </label>
              <input
                type="date"
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Group Description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-600">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Brief summary of the event or photo collection..."
              className="w-full rounded-none border border-stone-200 bg-stone-50 py-3 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Google Drive / Photos Link Guide Box */}
          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-none text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
              <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
              How to add Google Drive or Google Photos image links:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-amber-900/90 leading-relaxed">
              <li>
                <strong className="text-amber-950">Google Drive:</strong> Open your image in Drive &rarr; click <em>Share</em> &rarr; set permissions to <em>&ldquo;Anyone with the link can view&rdquo;</em> &rarr; Copy link (<code className="bg-amber-100/80 px-1 py-0.5 font-mono text-[11px]">https://drive.google.com/file/d/.../view</code>) &rarr; Paste here. <em>We automatically convert it into a direct display link!</em>
              </li>
              <li>
                <strong className="text-amber-950">Google Photos / Web:</strong> Right-click the photo and choose <em>&ldquo;Copy image address&rdquo;</em> (or copy image location) &rarr; Paste here.
              </li>
            </ul>
          </div>

          {/* Add Images Controls */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-700">
                Gallery Images ({images.length})
              </label>
              <button
                type="button"
                onClick={() => setShowBulkPaste(!showBulkPaste)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-church-blue hover:text-blue-800 transition-colors uppercase tracking-wider"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {showBulkPaste ? 'Hide Bulk Paste' : 'Bulk Paste Multiple Links'}
              </button>
            </div>

            {/* Bulk Paste Box */}
            {showBulkPaste && (
              <div className="p-4 bg-stone-50 border border-stone-200 space-y-3">
                <label className="block text-xs font-semibold text-stone-600">
                  Paste multiple image URLs below (one URL per line):
                </label>
                <textarea
                  rows={4}
                  placeholder={`https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing\nhttps://drive.google.com/file/d/4DEF567uvw/view?usp=sharing\nhttps://images.unsplash.com/photo-example`}
                  className="w-full border border-stone-200 p-3 text-xs font-mono bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-church-blue"
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkPaste(false)}
                    className="px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddBulkImages}
                    disabled={!bulkInput.trim()}
                    className="px-4 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    Add All Images
                  </button>
                </div>
              </div>
            )}

            {/* Add Single Image Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="Paste single Image URL (Drive, Photos, or web link)"
                className="flex-1 rounded-none border border-stone-200 bg-stone-50 py-2.5 px-3 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-church-blue"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSingleImage();
                  }
                }}
              />
              <input
                type="text"
                placeholder="Caption (Optional)"
                className="sm:w-48 rounded-none border border-stone-200 bg-stone-50 py-2.5 px-3 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-church-blue"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSingleImage();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSingleImage}
                disabled={!newUrl.trim()}
                className="px-4 py-2.5 bg-church-blue hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 shrink-0 flex items-center justify-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Image
              </button>
            </div>

            {/* Image List Preview Grid */}
            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {images.map((img, index) => (
                  <div key={img.id} className="group relative border border-stone-200 bg-stone-50 p-2 flex flex-col justify-between">
                    <div className="relative h-32 w-full bg-stone-200 overflow-hidden mb-2">
                      <img
                        src={img.url}
                        alt={img.caption || `Image ${index + 1}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=600&auto=format&fit=crop');
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                        title="Remove photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 text-[10px] font-mono">
                        #{index + 1}
                      </span>
                    </div>

                    <input
                      type="text"
                      placeholder="Add caption..."
                      className="w-full text-[11px] border border-stone-200 px-2 py-1 bg-white focus:outline-none focus:border-church-blue"
                      value={img.caption || ''}
                      onChange={(e) => handleUpdateCaption(img.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 border-2 border-dashed border-stone-200 text-center text-stone-400 text-xs">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No images added yet. Paste a Google Drive, Google Photos, or web image URL above.
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="flex justify-end gap-4 pt-6 border-t border-stone-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-none border border-stone-200 hover:bg-stone-50 transition-colors text-xs font-bold uppercase tracking-widest text-stone-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-none bg-church-blue hover:bg-blue-800 text-white transition-all font-bold uppercase tracking-widest text-xs disabled:opacity-50 shadow-md"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Gallery Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
