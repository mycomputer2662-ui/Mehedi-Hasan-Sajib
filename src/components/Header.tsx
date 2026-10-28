import React from 'react';
import { Download, Sparkles, Eye, Share2, Layers, Check } from 'lucide-react';
import { ExportResolution, RESOLUTIONS } from '../types';

interface HeaderProps {
  resolution: ExportResolution;
  onResolutionChange: (res: ExportResolution) => void;
  onExport: (res: ExportResolution) => void;
  onCopyClipboard: () => void;
  activeTab: 'editor' | 'youtube-sim' | 'ai-hooks';
  onTabChange: (tab: 'editor' | 'youtube-sim' | 'ai-hooks') => void;
  onOpenWindowsModal: () => void;
  isExporting: boolean;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  resolution,
  onResolutionChange,
  onExport,
  onCopyClipboard,
  activeTab,
  onTabChange,
  onOpenWindowsModal,
  isExporting,
  copied,
}) => {
  return (
    <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 font-black text-white text-lg tracking-tighter">
            4K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Viral 4K Thumbnail Studio
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Ultra HD
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              High-contrast YouTube news & welfare thumbnail creator
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs font-semibold">
          <button
            onClick={() => onTabChange('editor')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'editor'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-red-500" />
            Studio Editor
          </button>
          <button
            onClick={() => onTabChange('youtube-sim')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'youtube-sim'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            YouTube CTR Simulator
          </button>
          <button
            onClick={() => onTabChange('ai-hooks')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'ai-hooks'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI Headline Hooks
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {/* Windows Desktop App (.exe) Button */}
          <button
            onClick={onOpenWindowsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition active:scale-95 shadow-sm shadow-blue-500/10"
            title="Windows ডেক্সটপ সফটওয়্যার (.exe) সেটআপ ও ডাউনলোড"
          >
            <svg className="w-3.5 h-3.5 fill-current text-blue-400" viewBox="0 0 24 24">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.8" />
            </svg>
            <span>Windows App (.exe)</span>
          </button>

          {/* Resolution Selector */}
          <div className="flex items-center bg-neutral-950 rounded-lg p-1 border border-neutral-800">
            {(['4k', '1080p', '720p'] as ExportResolution[]).map((res) => (
              <button
                key={res}
                onClick={() => onResolutionChange(res)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  resolution === res
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title={RESOLUTIONS[res].label}
              >
                {RESOLUTIONS[res].badge}
              </button>
            ))}
          </div>

          {/* Copy to Clipboard */}
          <button
            onClick={onCopyClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
            title="Copy thumbnail image to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>

          {/* Export 4K Button */}
          <button
            onClick={() => onExport(resolution)}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-600/25 active:scale-95 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Rendering...' : `Export ${RESOLUTIONS[resolution].badge}`}
          </button>
        </div>
      </div>
    </header>
  );
};
