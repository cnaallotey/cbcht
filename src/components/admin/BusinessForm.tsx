"use client";

import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Sparkles, Building2 } from 'lucide-react';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, updateDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Business, BusinessCategory, BusinessStatus } from '../../types';
import {
  validateImageFile,
  generateSafeStoragePath,
  sanitizeWebUrl,
  sanitizeInstagramUrl,
  sanitizeFacebookUrl,
  sanitizeSlug
} from '../../lib/security';

interface BusinessFormProps {
  business: Business | null;
  onClose: () => void;
}

const CATEGORIES: BusinessCategory[] = [
  'Food & Catering',
  'Technology & Digital Services',
  'Health, Beauty & Wellness',
  'Education & Tutoring',
  'Construction & Real Estate',
  'Retail & Fashion',
  'Financial Services',
  'Transportation & Logistics',
  'Creative Arts & Media',
  'Agriculture & Produce',
  'Other'
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function BusinessForm({ business, onClose }: BusinessFormProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('Food & Catering');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [logo, setLogo] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<BusinessStatus>('published');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (business) {
      setName(business.name || '');
      setSlug(business.slug || '');
      setOwnerName(business.ownerName || '');
      setCategory(business.category || 'Food & Catering');
      setShortDescription(business.shortDescription || '');
      setFullDescription(business.fullDescription || '');
      setServicesInput(business.services ? business.services.join('\n') : '');
      setWhatsapp(business.whatsapp || '');
      setPhone(business.phone || '');
      setEmail(business.email || '');
      setWebsite(business.website || '');
      setLocation(business.location || '');
      setInstagram(business.instagram || '');
      setFacebook(business.facebook || '');
      setLogo(business.logo || '');
      setFeatured(business.featured || false);
      setStatus(business.status || 'published');
      setLogoPreview(business.logo || null);
    } else {
      setName('');
      setSlug('');
      setOwnerName('');
      setCategory('Food & Catering');
      setShortDescription('');
      setFullDescription('');
      setServicesInput('');
      setWhatsapp('');
      setPhone('');
      setEmail('');
      setWebsite('');
      setLocation('');
      setInstagram('');
      setFacebook('');
      setLogo('');
      setFeatured(false);
      setStatus('published');
      setLogoPreview(null);
    }
  }, [business]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!business) {
      setSlug(generateSlug(val));
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error || 'Invalid file');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = logo;

      // Upload new logo file if provided
      if (logoFile) {
        const safePath = generateSafeStoragePath('businesses', logoFile.name, logoFile.type);
        const storageRef = ref(storage, safePath);
        const snapshot = await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(snapshot.ref);
      }

      const servicesArray = servicesInput
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .slice(0, 8);

      const finalSlug = sanitizeSlug(slug || name);

      // If set as featured, ensure no other business is featured
      if (featured) {
        const querySnapshot = await getDocs(collection(db, 'businesses'));
        const batch = writeBatch(db);
        querySnapshot.forEach((docSnap) => {
          if (docSnap.id !== business?.id && docSnap.data().featured) {
            batch.update(docSnap.ref, { featured: false });
          }
        });
        await batch.commit();
      }

      const businessData = {
        name: name.trim(),
        slug: finalSlug,
        ownerName: ownerName.trim(),
        category,
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim() || '',
        services: servicesArray,
        whatsapp: whatsapp.trim(),
        phone: phone.trim(),
        email: email.trim(),
        website: sanitizeWebUrl(website),
        location: location.trim(),
        instagram: sanitizeInstagramUrl(instagram),
        facebook: sanitizeFacebookUrl(facebook),
        logo: logoUrl.trim(),
        featured,
        status,
        updatedAt: new Date().toISOString()
      };

      if (business) {
        await updateDoc(doc(db, 'businesses', business.id), {
          ...businessData,
          publishedAt: status === 'published' && !business.publishedAt ? new Date().toISOString() : (business.publishedAt || null)
        });
      } else {
        await addDoc(collection(db, 'businesses'), {
          ...businessData,
          createdAt: new Date().toISOString(),
          publishedAt: status === 'published' ? new Date().toISOString() : null
        });
      }

      onClose();
    } catch (err: any) {
      console.error("Failed to save business:", err);
      alert("Error saving business: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 my-8 max-h-[90vh] flex flex-col rounded-none font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-stone-50 shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-church-blue" />
            <h2 className="font-serif text-xl font-bold text-stone-900">
              {business ? 'Edit Business Profile' : 'Add New Member Business'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Scroll Area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Status & Featured Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-100 p-4 border border-stone-200">
            <div>
              <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                Listing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BusinessStatus)}
                className="w-full bg-white border border-stone-300 p-2 text-xs font-bold rounded-none"
              >
                <option value="published">Published (Live on site)</option>
                <option value="pending">Pending Review</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded-none border-stone-300 text-church-blue focus:ring-church-blue h-4 w-4"
                />
                <span className="flex items-center gap-1 text-amber-900">
                  <Sparkles className="h-4 w-4 text-amber-500 fill-current" /> Feature This Week
                </span>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Grace & Savour Catering"
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. grace-and-savour-catering"
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-mono focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                Owner / Member Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Deaconess Mary Appiah"
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                Short Description (Max 300 characters) <span className="text-red-500">*</span>
              </label>
              <span className={`font-mono text-[10px] ${shortDescription.length > 300 ? 'text-red-600 font-bold' : 'text-stone-400'}`}>
                {shortDescription.length}/300
              </span>
            </div>
            <textarea
              required
              maxLength={300}
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief summary shown on directory card"
              className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
            />
          </div>

          {/* Full Description */}
          <div className="space-y-1">
            <label className="block font-bold uppercase tracking-wider text-stone-700">
              Full Profile Description (Optional)
            </label>
            <textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Full story, bio, services, mission"
              className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
            />
          </div>

          {/* Services Offered */}
          <div className="space-y-1">
            <label className="block font-bold uppercase tracking-wider text-stone-700">
              Services or Products Offered (One per line, up to 8)
            </label>
            <textarea
              rows={3}
              value={servicesInput}
              onChange={(e) => setServicesInput(e.target.value)}
              placeholder="Buffet Catering&#10;Cocktail Bites&#10;Private Chef Service"
              className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-mono focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. +233 24 412 3456"
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +233 24 412 3456"
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@business.com"
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                Location Area
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lashibi, Accra"
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                Instagram Handle
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@handle"
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-stone-700">
                Facebook Page
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="Page link or name"
                className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
              />
            </div>
          </div>

          {/* Logo Upload & URL */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <label className="block font-bold uppercase tracking-wider text-stone-700">
              Logo / Image (Upload or Image URL)
            </label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <div className="h-14 w-14 border border-stone-300 overflow-hidden bg-stone-100 shrink-0">
                  <img src={logoPreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-bold file:bg-stone-200 file:text-stone-800"
                />
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => {
                    setLogo(e.target.value);
                    if (!logoFile) setLogoPreview(e.target.value);
                  }}
                  placeholder="Or paste direct image URL (https://...)"
                  className="w-full bg-stone-50 border border-stone-300 p-2 text-xs focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-6 py-2.5 font-bold uppercase tracking-wider rounded-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-church-blue hover:bg-blue-900 text-white px-8 py-2.5 font-bold uppercase tracking-wider flex items-center gap-2 rounded-none disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {business ? 'Update Business' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
