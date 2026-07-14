import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ServiceTime } from '../../types';
import { X, Save, Loader2 } from 'lucide-react';

interface ServiceTimeFormProps {
  serviceTime?: ServiceTime | null;
  onClose: () => void;
}

export default function ServiceTimeForm({ serviceTime, onClose }: ServiceTimeFormProps) {
  const [serviceName, setServiceName] = useState(serviceTime?.serviceName || '');
  const [day, setDay] = useState(serviceTime?.day || 'Sunday');
  const [time, setTime] = useState(serviceTime?.time || '');

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const serviceData = {
      serviceName,
      day,
      time
    };

    try {
      if (serviceTime?.id) {
        // Update existing service time
        await updateDoc(doc(db, 'serviceTimes', serviceTime.id), serviceData);
      } else {
        // Create new service time
        await addDoc(collection(db, 'serviceTimes'), serviceData);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving service time:', err);
      alert('Error saving service time: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white border border-stone-200 w-full max-w-md rounded-3xl p-6 md:p-8 text-stone-900 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-900"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="font-serif text-2xl font-bold mb-6 text-church-blue">
          {serviceTime ? 'Edit Service Time' : 'Add New Service Time'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Service Name */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Service Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sunday Morning Worship"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </div>

            {/* Day */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Day of Week</label>
              <select
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500">Time Range</label>
              <input
                type="text"
                required
                placeholder="e.g. 8:00 AM — 10:30 AM"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 px-4 text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors text-sm font-bold uppercase tracking-widest text-stone-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-church-blue hover:bg-blue-800 text-white transition-all font-bold uppercase tracking-widest text-sm disabled:opacity-50 shadow-md"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
