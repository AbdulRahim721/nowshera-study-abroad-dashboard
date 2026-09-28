'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Bot, Send, UserRound } from 'lucide-react';

type Turn = { from: 'ai' | 'student'; text: string };
const questions = ['Aap ka naam kya hai?', 'Aap ka email/Gmail kya hai?', 'Aap kis country mein study karna chahte hain?', 'Aap ke marks/percentage kitne hain?', 'IELTS score kya hai? Agar nahi diya to “not taken” likhein.', 'Aap ka annual budget kya hai?'];
const supportedCountries = ['uk', 'united kingdom', 'canada', 'germany', 'australia'];

function invalidAnswer(step: number, value: string) {
  const text = value.trim();
  if (step === 0 && !/^[a-zA-Z][a-zA-Z .'-]{1,49}$/.test(text)) return true;
  if (step === 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return true;
  if (step === 2 && !supportedCountries.includes(text.toLowerCase())) return true;
  if (step === 3 && (!/^\d{1,3}(\.\d+)?%?$/.test(text) || Number(text.replace('%', '')) < 0 || Number(text.replace('%', '')) > 100)) return true;
  if (step === 4 && !/^not\s*taken$/i.test(text) && (!/^\d+(\.\d+)?$/.test(text) || Number(text) > 9)) return true;
  if (step === 5 && !/\d/.test(text)) return true;
  return false;
}

export default function ChatPage() {
  const [phone, setPhone] = useState('0301 2345678');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [turns, setTurns] = useState<Turn[]>([{ from: 'ai', text: 'Assalam-o-alaikum! Main Nowshera Study Abroad ka assistant hoon. ' + questions[0] }]);
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!input.trim() || busy) return;
    const value = input.trim();
    setInput('');
    setTurns(t => [...t, { from: 'student', text: value }]);
    setBusy(true);
    if (step < questions.length) {
      if (invalidAnswer(step, value)) {
        setTurns(t => [...t, { from: 'ai', text: `Please provide the answer which I asked. ${questions[step]}` }]);
        setBusy(false);
        return;
      }
      const next = [...answers, value];
      setAnswers(next);
      if (step < questions.length - 1) {
        setStep(step + 1);
        setTurns(t => [...t, { from: 'ai', text: questions[step + 1] }]);
      } else {
        const [name, email, country, marks, ielts, budget] = next;
        const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, phone, country, marks: Number(marks.replace(/[^0-9.]/g, '')), ielts: ielts.toLowerCase().includes('not') ? null : Number(ielts.replace(/[^0-9.]/g, '')), budget }) });
        const data = await res.json();
        setTurns(t => [...t, { from: 'ai', text: data.ok ? 'Shukriya! Aapki application email ke saath save ho gayi hai. Ab aap approved university, fee, deadline ya documents ke baare mein pooch sakte hain.' : data.message }]);
        setStep(questions.length);
      }
    } else {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, message: value }) });
      const data = await res.json();
      setTurns(t => [...t, { from: 'ai', text: data.reply || data.message }]);
    }
    setBusy(false);
  }

  return <main className="min-h-screen bg-cream p-5 md:p-10"><div className="mx-auto max-w-3xl"><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-teal"><ArrowLeft size={16}/> Staff dashboard</Link><div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft"><div className="bg-ink p-6 text-white"><div className="flex items-center gap-3"><div className="rounded-2xl bg-cyan-300 p-3 text-ink"><Bot size={24}/></div><div><h1 className="text-xl font-bold">Student welcome chat</h1><p className="text-sm text-slate-300">Safe answers from the approved program list</p></div></div><label className="mt-5 block text-xs text-slate-300">Test phone number<input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none"/></label></div><div className="space-y-4 p-5">{turns.map((t, i) => <div key={i} className={`flex gap-3 ${t.from === 'student' ? 'justify-end' : ''}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${t.from === 'student' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-700'}`}>{t.from === 'ai' ? <Bot className="mb-1 text-teal" size={16}/> : <UserRound className="mb-1 text-white/80" size={16}/>} {t.text}</div></div>)}<div className="flex gap-2 border-t border-slate-100 pt-4"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Type your answer or question..." className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal"/><button onClick={send} disabled={busy} className="rounded-xl bg-teal px-4 text-white disabled:opacity-50"><Send size={18}/></button></div></div></div></div></main>;
}
