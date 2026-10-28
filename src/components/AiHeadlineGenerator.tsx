import React, { useState } from 'react';
import { Sparkles, ArrowRight, Zap, RefreshCw, Check, BookOpen, AlertCircle } from 'lucide-react';
import { ThumbnailState } from '../types';

interface AiHeadlineGeneratorProps {
  onApply: (headline: {
    topText: string;
    subPrefix: string;
    highlightText: string;
    subSuffix: string;
    bottomText: string;
    badge: string;
  }) => void;
  currentState: ThumbnailState;
}

interface HeadlineOption {
  topText: string;
  subPrefix: string;
  highlightText: string;
  subSuffix: string;
  bottomText: string;
  badge: string;
}

const BUILTIN_VIRAL_FORMULAS: { category: string; banglaCategory: string; items: HeadlineOption[] }[] = [
  {
    category: 'welfare',
    banglaCategory: 'ভাতা ও সরকারি অনুদান',
    items: [
      {
        topText: 'গর্ভবতী ভাতা নিয়ে বড় আপডেট',
        subPrefix: '৩১ অক্টোবর বাকী',
        highlightText: '২৫৫০ টাকা',
        subSuffix: 'দিবে',
        bottomText: 'বয়স্ক, গর্ভবতী, প্রতিবন্ধী, বিধবা ভাতা',
        badge: 'জরুরি নোটিশ',
      },
      {
        topText: 'বয়স্ক ও বিধবা ভাতা একাউন্টে ঢুকছে!',
        subPrefix: 'এইমাত্র শুরু হলো',
        highlightText: '৩ মাসের টাকা',
        subSuffix: 'বিতরণ',
        bottomText: 'বিকাশ ও নগদে সরাসরি চেক করুন • সরকারি তালিকা',
        badge: 'ব্রেকিং নিউজ',
      },
      {
        topText: 'প্রতিবন্ধী ভাতার নতুন তালিকা প্রকাশ',
        subPrefix: 'প্রত্যেককে এককালীন',
        highlightText: '৪০০০ টাকা',
        subSuffix: 'প্রদান',
        bottomText: 'অনলাইনে নাম যাচাই ও কার্ড সংগ্রহের নিয়ম',
        badge: '১০০% নিশ্চিত',
      },
    ],
  },
  {
    category: 'news',
    banglaCategory: 'ব্রেকিং নিউজ ও জরুরি ঘোষণা',
    items: [
      {
        topText: 'জরুরি ব্রেকিং নিউজ! এইমাত্র বড় সিদ্ধান্ত',
        subPrefix: 'আজ মধ্যরাত থেকেই',
        highlightText: 'নতুন নিয়ম',
        subSuffix: 'কার্যকর হচ্ছে',
        bottomText: 'সকল নাগরিকের জানা জরুরি • এখনই নিয়ম দেখুন',
        badge: 'ব্রেকিং নিউজ',
      },
      {
        topText: 'দেশবাসীর জন্য প্রধানমন্ত্রীর জরুরি বার্তা',
        subPrefix: 'আগামীকাল থেকে বন্ধ',
        highlightText: 'বিশেষ সেবা',
        subSuffix: 'ঘোষণা',
        bottomText: 'জরুরি প্রেস ব্রিফিং • মন্ত্রণালয়ের সতর্কবার্তা',
        badge: 'LIVE 🔴',
      },
    ],
  },
  {
    category: 'education',
    banglaCategory: 'শিক্ষাবৃত্তি ও রেজাল্ট',
    items: [
      {
        topText: 'সকল শিক্ষার্থীদের জন্য মেগা সুখবর!',
        subPrefix: 'এককালীন সরাসরি',
        highlightText: '১০,০০০ টাকা',
        subSuffix: 'অনুদানের তালিকা প্রকাশ',
        bottomText: 'অনলাইনে আবেদনের লিংক ও প্রয়োজনীয় কাগজপত্র দেখুন',
        badge: 'শিক্ষা মন্ত্রণালয়',
      },
      {
        topText: 'উপবৃত্তি ও মেধা বৃত্তির ফলাফল প্রকাশ',
        subPrefix: 'তালিকায় যাদের নাম আছে',
        highlightText: '৮,৫০০ টাকা',
        subSuffix: 'পাবেন',
        bottomText: 'সকল শিক্ষাবোর্ড বিজ্ঞপ্তি • আবেদন ও উত্তোলনের শেষ তারিখ',
        badge: 'অফিসিয়াল রেজাল্ট',
      },
    ],
  },
  {
    category: 'passport',
    banglaCategory: 'পাসপোর্ট ও ভিসা সতর্কবার্তা',
    items: [
      {
        topText: 'পাসপোর্ট ও ভিসা নিয়ে নতুন কড়া নির্দেশনা',
        subPrefix: '৭ দিনের মধ্যে না করলে',
        highlightText: 'আবেদন বাতিল',
        subSuffix: 'হতে পারে',
        bottomText: 'প্রবাসী ও বিদেশগামীদের জরুরি সতর্কবার্তা • বিস্তারিত',
        badge: 'জরুরি সতর্কবার্তা',
      },
      {
        topText: 'ই-পাসপোর্ট দ্রুত পাওয়ার নতুন নিয়ম জারি',
        subPrefix: 'পুলিশ ভেরিফিকেশনে',
        highlightText: 'বড় পরিবর্তন',
        subSuffix: 'ঘোষণা',
        bottomText: 'ঘরে বসেই মাত্র ৩ দিনে পাসপোর্ট পাওয়ার উপায়',
        badge: '১০০% কার্যকর',
      },
    ],
  },
];

export const AiHeadlineGenerator: React.FC<AiHeadlineGeneratorProps> = ({ onApply }) => {
  const [topic, setTopic] = useState('গর্ভবতী ও মাতৃত্বকালীন ভাতা নতুন কিস্তি');
  const [language, setLanguage] = useState<'bangla' | 'english'>('bangla');
  const [tone, setTone] = useState<'breaking' | 'official' | 'relief'>('breaking');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<HeadlineOption[]>([]);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/gemini/headlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language, tone }),
      });

      const data = await res.json();
      if (res.ok && data.headlines && Array.isArray(data.headlines) && data.headlines.length > 0) {
        setGeneratedOptions(data.headlines);
        setStatusMessage('AI generated 4 high-CTR headline hooks!');
      } else {
        // Fallback to relevant category templates
        fallbackToBuiltins();
      }
    } catch {
      fallbackToBuiltins();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackToBuiltins = () => {
    // Collect from built-in formulas
    const all = BUILTIN_VIRAL_FORMULAS.flatMap((c) => c.items);
    setGeneratedOptions(all.slice(0, 4));
    setStatusMessage('Loaded viral high-CTR formulas.');
  };

  const handleApplyOption = (opt: HeadlineOption, idx: number) => {
    onApply(opt);
    setAppliedIndex(idx);
    setTimeout(() => setAppliedIndex(null), 1800);
  };

  return (
    <div className="space-y-6 text-neutral-200">
      {/* AI Prompt Input Bar */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">
            AI Viral Headline & Hook Generator
          </h2>
        </div>
        <p className="text-xs text-neutral-400">
          Generate curiosity-inducing, high-click-through headline packages with glowing highlight numbers in Bangla or English.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Your Video Topic or Core Subject
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. মাতৃত্বকালীন ভাতা, নতুন পাসপোর্ট ফি, বিদ্যুৎ বিল মওকুফ..."
                className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white font-medium text-sm focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Generate Viral Hooks
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Language:</span>
              <div className="flex bg-neutral-950 rounded-lg p-0.5 border border-neutral-800">
                <button
                  onClick={() => setLanguage('bangla')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    language === 'bangla' ? 'bg-emerald-600 text-white' : 'text-neutral-400'
                  }`}
                >
                  বাংলা (Bengali)
                </button>
                <button
                  onClick={() => setLanguage('english')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    language === 'english' ? 'bg-emerald-600 text-white' : 'text-neutral-400'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Tone:</span>
              <div className="flex bg-neutral-950 rounded-lg p-0.5 border border-neutral-800">
                {(
                  [
                    { id: 'breaking', label: 'ব্রেকিং নিউজ' },
                    { id: 'relief', label: 'সুখবর ও অনুদান' },
                    { id: 'official', label: 'অফিসিয়াল নোটিশ' },
                  ] as { id: 'breaking' | 'relief' | 'official'; label: string }[]
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      tone === t.id ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-400'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
            <Check className="w-3.5 h-3.5" />
            {statusMessage}
          </div>
        )}
      </div>

      {/* Generated Results (if any) */}
      {generatedOptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Generated Headline Packages (Click to Apply)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {generatedOptions.map((opt, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                    {opt.badge}
                  </span>
                  <button
                    onClick={() => handleApplyOption(opt, i)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95"
                  >
                    {appliedIndex === i ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Applied!
                      </>
                    ) : (
                      <>
                        Apply
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="p-1.5 rounded bg-[#8C0000] text-white text-xs font-black text-center">
                    {opt.topText}
                  </div>
                  <div className="p-1.5 rounded bg-[#0A4A1C] text-xs font-black text-center text-white flex items-center justify-center gap-1">
                    <span>{opt.subPrefix}</span>
                    <span className="text-[#FFFF00]">{opt.highlightText}</span>
                    <span>{opt.subSuffix}</span>
                  </div>
                  <div className="p-1 rounded bg-black text-[#FFEE22] text-[11px] font-bold text-center">
                    {opt.bottomText}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Built-in Viral Reference Catalog */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Proven Viral News & Welfare Templates
          </h3>
        </div>

        <div className="space-y-4">
          {BUILTIN_VIRAL_FORMULAS.map((group) => (
            <div key={group.category} className="space-y-2">
              <div className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {group.banglaCategory}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{item.topText}</div>
                      <div className="text-[11px] text-emerald-400 font-semibold truncate">
                        {item.subPrefix} {item.highlightText} {item.subSuffix}
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyOption(item, 100 + idx)}
                      className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex-shrink-0"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
