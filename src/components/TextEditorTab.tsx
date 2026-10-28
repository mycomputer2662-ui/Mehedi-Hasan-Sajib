import React from 'react';
import { Type, Sparkles, Hash, Palette, ShieldAlert } from 'lucide-react';
import { BANGLA_FONTS, toBanglaNumber } from '../presets';
import { ThumbnailState } from '../types';

interface TextEditorTabProps {
  state: ThumbnailState;
  onChange: (updated: Partial<ThumbnailState>) => void;
}

const COLOR_PRESETS = [
  { name: 'Red', hex: '#8C0000' },
  { name: 'Deep Crimson', hex: '#A10000' },
  { name: 'Forest Green', hex: '#0A4A1C' },
  { name: 'Navy Blue', hex: '#0B234A' },
  { name: 'Pitch Black', hex: '#000000' },
  { name: 'Royal Purple', hex: '#4A0E4E' },
];

const HIGHLIGHT_COLORS = [
  { name: 'Lemon Glow', hex: '#FFFF00' },
  { name: 'Electric Gold', hex: '#FFDF00' },
  { name: 'Neon Cyan', hex: '#00FFA6' },
  { name: 'Hot Orange', hex: '#FF6B00' },
  { name: 'Pure White', hex: '#FFFFFF' },
];

export const TextEditorTab: React.FC<TextEditorTabProps> = ({ state, onChange }) => {
  return (
    <div className="space-y-6 text-neutral-200">
      {/* SECTION 1: Top Line 1 (Red Banner) */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-red-400/40" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Line 1 (Main Red Banner)
            </h3>
          </div>
          <button
            onClick={() => onChange({ line1Text: toBanglaNumber(state.line1Text) })}
            className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700 transition"
            title="Convert English numbers 123 to Bangla numbers ১২৩"
          >
            <Hash className="w-3 h-3" />
            Bangla Digits
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-400 mb-1">
            Banner Headline Text
          </label>
          <input
            type="text"
            value={state.line1Text}
            onChange={(e) => onChange({ line1Text: e.target.value })}
            placeholder="e.g. গর্ভবতী ভাতা নিয়ে বড় আপডেট"
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white font-bold text-sm focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-neutral-400 font-semibold mb-1">
              Banner Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.line1BgColor}
                onChange={(e) => onChange({ line1BgColor: e.target.value })}
                className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
              />
              <div className="flex gap-1 flex-wrap">
                {COLOR_PRESETS.slice(0, 3).map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => onChange({ line1BgColor: c.hex })}
                    className="w-5 h-5 rounded border border-neutral-700 hover:scale-110 transition"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 font-semibold mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.line1TextColor}
                onChange={(e) => onChange({ line1TextColor: e.target.value })}
                className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-[11px] text-neutral-400">{state.line1TextColor}</span>
            </div>
          </div>
        </div>

        {/* Font Family & Stroke Slider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <label className="block text-neutral-400 font-semibold mb-1">Bengali Font</label>
            <select
              value={state.line1Font}
              onChange={(e) => onChange({ line1Font: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-white font-medium focus:outline-none focus:border-red-500 text-xs"
            >
              {BANGLA_FONTS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 font-semibold mb-1">
              <span>Text Outline (Stroke): {state.line1StrokeWidth}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="28"
              step="2"
              value={state.line1StrokeWidth}
              onChange={(e) => onChange({ line1StrokeWidth: parseInt(e.target.value) })}
              className="w-full accent-red-600"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Top Line 2 (Green Sub-bar with Highlight Number) */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-400/40" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Line 2 (Sub-Banner with Highlight Number)
            </h3>
          </div>
          <button
            onClick={() => {
              onChange({
                line2Prefix: toBanglaNumber(state.line2Prefix),
                line2Highlight: toBanglaNumber(state.line2Highlight),
                line2Suffix: toBanglaNumber(state.line2Suffix),
              });
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700 transition"
          >
            <Hash className="w-3 h-3" />
            Bangla Digits
          </button>
        </div>

        {/* 3 Segments: Prefix + Highlight Number + Suffix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-neutral-400 font-semibold mb-1">Prefix Text</label>
            <input
              type="text"
              value={state.line2Prefix}
              onChange={(e) => onChange({ line2Prefix: e.target.value })}
              placeholder="৩১ অক্টোবর বাকী"
              className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-white font-medium focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-amber-300 font-bold mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Highlight (Amount/Date)
            </label>
            <input
              type="text"
              value={state.line2Highlight}
              onChange={(e) => onChange({ line2Highlight: e.target.value })}
              placeholder="২৫৫০ টাকা"
              className="w-full px-2.5 py-1.5 bg-neutral-950 border-2 border-amber-400/60 rounded-lg text-amber-300 font-black focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-neutral-400 font-semibold mb-1">Suffix Text</label>
            <input
              type="text"
              value={state.line2Suffix}
              onChange={(e) => onChange({ line2Suffix: e.target.value })}
              placeholder="দিবে"
              className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-white font-medium focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Highlight Color Choices & Background */}
        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <label className="block text-neutral-400 font-semibold mb-1">
              Highlight Glow Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.line2HighlightColor}
                onChange={(e) => onChange({ line2HighlightColor: e.target.value })}
                className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
              />
              <div className="flex gap-1 flex-wrap">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => onChange({ line2HighlightColor: c.hex })}
                    className="w-5 h-5 rounded-full border border-neutral-700 hover:scale-125 transition"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 font-semibold mb-1">
              Sub-Banner Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.line2BgColor}
                onChange={(e) => onChange({ line2BgColor: e.target.value })}
                className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-[11px] text-neutral-400">{state.line2BgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Bottom Banner (Black Band) */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-200 ring-2 ring-white/40" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Bottom Banner (Categories & Urgent Tag)
            </h3>
          </div>
          <button
            onClick={() => onChange({ line3Text: toBanglaNumber(state.line3Text) })}
            className="flex items-center gap-1 text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700 transition"
          >
            <Hash className="w-3 h-3" />
            Bangla Digits
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-400 mb-1">
            Bottom Summary / Categories
          </label>
          <input
            type="text"
            value={state.line3Text}
            onChange={(e) => onChange({ line3Text: e.target.value })}
            placeholder="e.g. বয়স্ক, গর্ভবতী, প্রতিবন্ধী, বিধবা ভাতা"
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-neutral-400 font-semibold mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.line3TextColor}
                onChange={(e) => onChange({ line3TextColor: e.target.value })}
                className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-[11px] text-neutral-400">{state.line3TextColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 font-semibold mb-1">
              Banner Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.line3BgColor}
                onChange={(e) => onChange({ line3BgColor: e.target.value })}
                className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-[11px] text-neutral-400">{state.line3BgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Badges & 4K Stamps */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Corner Badges & 4K Stamp
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Badge toggle & text */}
          <div className="space-y-2 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-300">Urgency Badge</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showBadge}
                  onChange={(e) => onChange({ showBadge: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {state.showBadge && (
              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  value={state.badgeText}
                  onChange={(e) => onChange({ badgeText: e.target.value })}
                  placeholder="e.g. জরুরি নোটিশ"
                  className="w-full px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded text-white font-bold"
                />
                <div className="flex gap-1 flex-wrap pt-1">
                  {['জরুরি নোটিশ', 'ব্রেকিং নিউজ', '১০০% নিশ্চিত', 'LIVE 🔴', 'অফিসিয়াল'].map(
                    (preset) => (
                      <button
                        key={preset}
                        onClick={() => onChange({ badgeText: preset })}
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                      >
                        {preset}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4K Stamp toggle */}
          <div className="space-y-2 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-300">4K Ultra HD Stamp</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showStamp}
                  onChange={(e) => onChange({ showStamp: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {state.showStamp && (
              <input
                type="text"
                value={state.stampText}
                onChange={(e) => onChange({ stampText: e.target.value })}
                placeholder="4K ULTRA HD"
                className="w-full px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded text-amber-400 font-bold"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
