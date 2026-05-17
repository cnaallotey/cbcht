import React from 'react';
import { BlogPost } from '../types';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

export default function BlogCard({ post, onClick }: BlogCardProps) {
  return (
    <div 
      className="group flex flex-col items-start cursor-pointer"
      onClick={() => onClick(post)}
    >
      <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-sm">
        <img 
          src={post.image || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop'}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 rounded-full bg-white/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-church-blue backdrop-blur-md">
          {post.category}
        </div>
      </div>
      <div className="flex flex-col flex-grow border-l-4 border-church-gold pl-6">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-church-gold-warm">
          {format(new Date(post.date), 'MMMM dd, yyyy')} — By {post.author}
        </div>
        <h3 className="mb-3 font-serif text-2xl font-bold leading-tight text-text-dark group-hover:text-church-blue">
          {post.title}
        </h3>
        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-text-light">
          {post.excerpt}
        </p>
        <button className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-church-blue">
          Read More →
        </button>
      </div>
    </div>
  );
}
