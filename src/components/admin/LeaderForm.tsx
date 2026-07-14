import React, { useState } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Leader } from '../../types';
import { X, Upload, Save, Loader2 } from 'lucide-react';

interface LeaderFormProps {
  leader?: Leader | null;
  onClose: () => void;
}

export default function LeaderForm({ leader, onClose }: LeaderFormProps) {
  const [name, setName] = useState(leader?.name || '');
  const [role, setRole] = useState(leader?.role || '');
  const [image, setImage] = useState(leader?.image || '');
  const [order, setOrder] = useState(leader?.order !== undefined ? leader.order : 0);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const storageRef = ref(storage, `leaders/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setImageProgress(percent);
      },
      (error) => {
        console.error('Leader image upload failed:', error);
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

    const leaderData = {
      name,
      role,
      image,
      order: Number(order)
    };

    try {
      if (leader?.id) {
        // Update existing leader
        await updateDoc(doc(db, 'leadership', leader.id), leaderData);
      } else {
        // Create new leader
        await addDoc(collection(db, 'leadership'), leaderData);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving leader:', err);
      alert('Error saving leader: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-stone-200 w-full max-w-md rounded-none p-6 md:p-8 text-stone-900 shadow-2xl relative my-8">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-none bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-900"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="font-serif text-2xl font-bold mb-6 text-church-blue">
          {leader ? 'Edit Leader Details' : 'Add New Leader'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Leader Name */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Leader Name</label>
              <input
                type="text"
                required
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Leader Role */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Role / Position</label>
              <input
                type="text"
                required
                placeholder="e.g. Associate Pastor, Youth Leader"
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Display Order Sequence</label>
              <input
                type="number"
                required
                placeholder="e.g. 1, 2, 3 (lower numbers show first)"
                className="w-full rounded-none border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>

            {/* Photo Image Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Photo / Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Photo URL"
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
                <div className="mt-2 relative h-24 w-24 rounded-none overflow-hidden border border-stone-200 bg-stone-100">
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
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
              Save Leader
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
