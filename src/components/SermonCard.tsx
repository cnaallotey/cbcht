import React from 'react';
import { Play, BookOpen, Download, Calendar } from 'lucide-react';
import { Sermon } from '../types';
import { format } from 'date-fns';

interface SermonCardProps {
  sermon: Sermon;
  onClick: (sermon: Sermon) => void;
}

export default function SermonCard({ sermon, onClick }: SermonCardProps) {
  return (
    <div 
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
      onClick={() => onClick(sermon)}
    >
      <div className="relative aspect-video overflow-hidden bg-stone-200">
        <img 
          src={sermon.thumbnail || `https://img.youtube.com/vi/${sermon.videoId}/maxresdefault.jpg`}
          alt={sermon.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full bg-church-blue p-4 text-white shadow-lg shadow-blue-900/40">
            <Play className="h-6 w-6 fill-current" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
          LATEST
        </div>
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-text-light">
          <Calendar className="h-3 w-3" />
          <span>{format(new Date(sermon.date), 'MMMM dd, yyyy')}</span>
          <span className="mx-1">•</span>
          <span className="text-church-blue font-bold">{sermon.scripture}</span>
        </div>
        <h3 className="mb-4 font-serif text-xl font-bold leading-tight text-text-dark group-hover:text-church-blue">
          {sermon.title}
        </h3>
        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
          <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-church-blue">
            <Play className="h-3 w-3 fill-current" /> Watch Video
          </button>
          <div className="flex gap-4">
            {sermon.transcript && <BookOpen className="h-4 w-4 text-text-light" />}
            {sermon.notesUrl && <Download className="h-4 w-4 text-text-light" />}
          </div>
        </div>
      </div>
    </div>
  );
}
