'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { ContentRow, Language } from '@/lib/content';
import { translated } from '@/lib/content';

export default function ContentGrid({type, subject, limit=12}:{type?:string;subject?:string;limit?:number}){
 const [rows,setRows]=useState<ContentRow[]>([]); const [lang,setLang]=useState<Language>('en'); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
 useEffect(()=>{const s=localStorage.getItem('ilm-lang') as Language|null;if(s)setLang(s); const h=(e:Event)=>setLang((e as CustomEvent<Language>).detail);window.addEventListener('ilm-language',h);return()=>window.removeEventListener('ilm-language',h)},[]);
 useEffect(()=>{let active=true; async function load(){const supabase=getSupabase(); if(!supabase){setError('Supabase environment variables are not configured.');setLoading(false);return;} let q:any=supabase.from('content').select(`id,slug,content_type,difficulty,age_min,age_max,estimated_minutes,featured,subject_id,${subject?'subjects!inner(slug,name,icon)':'subjects(slug,name,icon)'},content_translations(language,title,summary,body)`).eq('published',true).order('featured',{ascending:false}).order('created_at',{ascending:false}).limit(limit); if(type)q=q.eq('content_type',type); if(subject)q=q.eq('subjects.slug',subject); const {data,error}=await q; if(!active)return;if(error)setError(error.message);else setRows((data??[]) as ContentRow[]);setLoading(false)}load();return()=>{active=false}},[type,subject,limit]);
 if(loading)return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i=><div key={i} className="h-48 animate-pulse rounded-3xl bg-slate-100"/>)}</div>;
 if(error)return <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900"><b>Content connection needs attention.</b><p className="mt-1 text-sm">{error}</p></div>;
 if(!rows.length)return <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">No published content yet. Add content in Supabase and it will appear here.</div>;
 return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rows.map(r=>{const t=translated(r,lang);return <Link key={r.id} href={`/content/${r.slug}`} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="flex items-center justify-between"><span className="text-3xl">{r.subjects?.icon??'✨'}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize">{r.content_type}</span></div><h3 className="mt-5 text-xl font-black">{t.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{t.summary}</p><div className="mt-5 flex gap-3 text-xs font-bold text-slate-400"><span>{r.difficulty??'beginner'}</span><span>•</span><span>{r.estimated_minutes??10} min</span></div><span className="mt-5 block font-extrabold text-indigo-600">Explore →</span></Link>})}</div>
}
