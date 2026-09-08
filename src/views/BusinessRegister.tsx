"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Upload, 
  Building2, Phone, Mail, Globe, MapPin, Loader2, AlertCircle, Sparkles, Check
} from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BusinessCategory } from '../types';
import { 
  validateImageFile, 
  generateSafeStoragePath, 
  sanitizeSlug 
} from '../lib/security';

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

export default function BusinessRegister() {
  // Required fields
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('Food & Catering');
  const [shortDescription, setShortDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(false);

  // Optional collapsible section
  const [showOptional, setShowOptional] = useState(false);
  const [fullDescription, setFullDescription] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle "Same as phone" checkbox
  const handleSameAsPhoneToggle = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsapp(phone);
    }
  };

  // Handle phone change
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsapp(val);
    }
  };

  // Logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        e.target.value = '';
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!ownerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your contact phone number.');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Please enter your business name.');
      return;
    }
    if (!shortDescription.trim()) {
      setErrorMessage('Please provide a short description of your business.');
      return;
    }
    if (!whatsapp.trim() && !phone.trim()) {
      setErrorMessage('Please provide either a WhatsApp number or a phone number.');
      return;
    }

    setSubmitting(true);

    try {
      let uploadedLogoUrl = '';

      // Upload logo if provided
      if (logoFile) {
        try {
          const filename = generateSafeStoragePath('businesses', logoFile.name, logoFile.type);
          const storageRef = ref(storage, filename);
          const uploadSnapshot = await uploadBytes(storageRef, logoFile, {
            contentType: logoFile.type
          });
          uploadedLogoUrl = await getDownloadURL(uploadSnapshot.ref);
        } catch (uploadErr) {
          console.warn("Logo upload failed, continuing without logo:", uploadErr);
        }
      }

      // Parse services lines (up to 8)
      const servicesArray = servicesInput
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .slice(0, 8);

      const baseSlug = sanitizeSlug(name);
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

      // Construct clean payload - avoiding undefined fields to prevent Firestore serialization errors
      const payload: Record<string, any> = {
        name: name.trim(),
        slug: uniqueSlug,
        ownerName: ownerName.trim(),
        category,
        shortDescription: shortDescription.trim(),
        whatsapp: (whatsapp || phone).trim(),
        phone: phone.trim(),
        featured: false,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      if (fullDescription.trim()) payload.fullDescription = fullDescription.trim();
      if (servicesArray.length > 0) payload.services = servicesArray;
      if (uploadedLogoUrl) payload.logo = uploadedLogoUrl;
      if (email.trim()) payload.email = email.trim();
      if (website.trim()) payload.website = website.trim();
      if (location.trim()) payload.location = location.trim();
      if (instagram.trim()) payload.instagram = instagram.trim();
      if (facebook.trim()) payload.facebook = facebook.trim();

      await addDoc(collection(db, 'businesses'), payload);

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Business registration error:", err);
      setErrorMessage(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pt-28 pb-24">
      {/* Header */}
      <header className="bg-stone-900 text-white py-16 border-b border-stone-800">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-4">
          <Link
            href="/directory"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-church-gold hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Business Directory
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Register Your <span className="text-church-gold italic">Business</span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Every Calvary Baptist Church member business has a permanent home on our platform. 
            Fill in your details below for inclusion in the directory.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {submitted ? (
          /* Confirmation Message */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-church-gold p-8 sm:p-12 text-center space-y-6 rounded-none"
          >
            <div className="h-16 w-16 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-none flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-church-gold">
                Submission Received
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-950">
                Thank You, {ownerName}!
              </h2>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Your business submission for <strong className="text-stone-950">{name}</strong> has been received. 
              The CBC Communications Team will review your listing and get it published within <strong>5 business days</strong>. 
              We'll send you a WhatsApp message as soon as it is live on the church directory!
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/directory"
                className="bg-church-blue hover:bg-blue-900 text-white font-bold px-8 py-3.5 text-xs uppercase tracking-widest transition-colors rounded-none"
              >
                Browse Directory
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setOwnerName('');
                  setShortDescription('');
                  setFullDescription('');
                  setServicesInput('');
                  setPhone('');
                  setWhatsapp('');
                  setEmail('');
                  setWebsite('');
                  setLocation('');
                  setLogoFile(null);
                  setLogoPreview(null);
                }}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-8 py-3.5 text-xs uppercase tracking-widest transition-colors rounded-none"
              >
                Submit Another Business
              </button>
            </div>
          </motion.div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="bg-white border border-stone-200 p-6 sm:p-10 space-y-8 rounded-none">
            {errorMessage && (
              <div role="alert" aria-live="assertive" className="bg-red-50 border-l-4 border-red-600 p-4 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Required Essentials */}
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-2">
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  1. Essential Business Details
                </h2>
                <p className="text-xs text-stone-500">
                  Required fields to get your business listed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Your Name */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-owner-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-owner-name"
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Deaconess Mary Appiah"
                    className="w-full bg-stone-50 border border-stone-300 px-4 py-3 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-phone" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Your Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="e.g. 024 412 3456"
                    className="w-full bg-stone-50 border border-stone-300 px-4 py-3 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Business Name */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-business-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-business-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Grace & Savour Catering"
                    className="w-full bg-stone-50 border border-stone-300 px-4 py-3 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-category" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Business Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reg-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                    className="w-full bg-stone-50 border border-stone-300 px-4 py-3 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="reg-short-desc" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Short Description (for directory card) <span className="text-red-500">*</span>
                  </label>
                  <span aria-live="polite" className={`text-[11px] font-mono ${
                    shortDescription.length > 300 ? 'text-red-600 font-bold' : 'text-stone-600'
                  }`}>
                    {shortDescription.length}/300
                  </span>
                </div>
                <textarea
                  id="reg-short-desc"
                  required
                  maxLength={300}
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="2-3 sentences explaining what your business provides and how you serve clients."
                  className="w-full bg-stone-50 border border-stone-300 p-4 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none leading-relaxed"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="reg-whatsapp" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Business WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                      className="rounded-none border-stone-300 text-church-blue focus:ring-church-blue"
                    />
                    <span>Same as my phone number above</span>
                  </label>
                </div>
                <input
                  id="reg-whatsapp"
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    if (sameAsPhone && e.target.value !== phone) {
                      setSameAsPhone(false);
                    }
                  }}
                  placeholder="e.g. 024 412 3456"
                  className="w-full bg-stone-50 border border-stone-300 px-4 py-3 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                />
              </div>
            </div>

            {/* Section 2: Collapsible Optional Details */}
            <div className="border-t border-stone-200 pt-6">
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                aria-expanded={showOptional}
                aria-controls="optional-enrichment-fields"
                className="w-full flex items-center justify-between py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 transition-colors text-xs font-bold uppercase tracking-wider rounded-none focus-visible:ring-2 focus-visible:ring-church-blue"
              >
                <span>Add More Details (Optional Profile Enrichment)</span>
                {showOptional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              <AnimatePresence>
                {showOptional && (
                  <motion.div
                    id="optional-enrichment-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 pt-6 overflow-hidden"
                  >
                    {/* Full Description */}
                    <div className="space-y-1.5">
                      <label htmlFor="reg-full-desc" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Full Profile Story / Detailed Description
                      </label>
                      <textarea
                        id="reg-full-desc"
                        rows={5}
                        value={fullDescription}
                        onChange={(e) => setFullDescription(e.target.value)}
                        placeholder="Share your business journey, mission, guarantees, or special discount for CBC members."
                        className="w-full bg-stone-50 border border-stone-300 p-4 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none leading-relaxed"
                      />
                    </div>

                    {/* Services or Products offered */}
                    <div className="space-y-1.5">
                      <label htmlFor="reg-services" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Services or Products Offered (One per line, up to 8)
                      </label>
                      <textarea
                        id="reg-services"
                        rows={4}
                        value={servicesInput}
                        onChange={(e) => setServicesInput(e.target.value)}
                        placeholder="Wedding Buffets&#10;Corporate Lunches&#10;Packed Event Meals&#10;Cocktail Bites"
                        className="w-full bg-stone-50 border border-stone-300 p-4 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none font-mono text-xs leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          Business Email
                        </label>
                        <input
                          id="reg-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. contact@business.com"
                          className="w-full bg-stone-50 border border-stone-300 px-4 py-3 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                        />
                      </div>

                      {/* Website */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-website" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          Website URL
                        </label>
                        <input
                          id="reg-website"
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-stone-50 border border-stone-300 px-4 py-3 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {/* Location */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-location" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          Location / General Area
                        </label>
                        <input
                          id="reg-location"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Lashibi, Community 18"
                          className="w-full bg-stone-50 border border-stone-300 px-4 py-3 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                        />
                      </div>

                      {/* Instagram */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-instagram" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          Instagram Handle
                        </label>
                        <input
                          id="reg-instagram"
                          type="text"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          placeholder="@handle"
                          className="w-full bg-stone-50 border border-stone-300 px-4 py-3 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                        />
                      </div>

                      {/* Facebook */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-facebook" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          Facebook Page
                        </label>
                        <input
                          id="reg-facebook"
                          type="text"
                          value={facebook}
                          onChange={(e) => setFacebook(e.target.value)}
                          placeholder="Page name or URL"
                          className="w-full bg-stone-50 border border-stone-300 px-4 py-3 text-sm focus:border-church-blue focus:bg-white focus:outline-none rounded-none"
                        />
                      </div>
                    </div>

                    {/* Logo / Image Upload */}
                    <div className="space-y-2">
                      <label htmlFor="reg-logo" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Logo or Primary Photo (PNG, JPG, WebP - Max 5MB)
                      </label>
                      <div className="flex items-center gap-4">
                        {logoPreview && (
                          <div className="h-16 w-16 border border-stone-300 overflow-hidden bg-stone-100 shrink-0 rounded-none">
                            <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <input
                          id="reg-logo"
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleLogoChange}
                          className="text-xs text-stone-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300 cursor-pointer"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submission Button */}
            <div className="pt-6 border-t border-stone-200">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-church-blue hover:bg-blue-900 text-white font-bold py-4 text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 rounded-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting for Review...
                  </>
                ) : (
                  'Submit for Review'
                )}
              </button>
              <p className="text-center text-[11px] text-stone-400 mt-3">
                Submissions are reviewed by the CBC Communications Team prior to publishing.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
