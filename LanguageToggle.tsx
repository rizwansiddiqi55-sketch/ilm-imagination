'use client';
import { useEffect, useState } from 'react';
export default function LanguageToggle(){
  const [lang,setLang]=useState<'en'|'ur'>('en');
  useEffect(()=>{const saved=localStorage.getItem('ilm-lang') as 'en'|'ur'|null;if(saved)setLang(saved)},[]);
  function change(v:'en'|'ur'){setLang(v);localStorage.setItem('ilm-lang',v);document.documentElement.lang=v;document.documentElement.dir=v==='ur'?'rtl':'ltr';window.dispatchEvent(new CustomEvent('ilm-language',{detail:v}))}
  return <div className="flex rounded-full border border-slate-200 bg-white p-1 text-sm font-bold shadow-sm"><button onClick={()=>change('en')} className={`rounded-full px-3 py-1.5 ${lang==='en'?'bg-slate-900 text-white':''}`}>EN</button><button onClick={()=>change('ur')} className={`rounded-full px-3 py-1.5 ${lang==='ur'?'bg-slate-900 text-white':''}`}>اردو</button></div>
}
