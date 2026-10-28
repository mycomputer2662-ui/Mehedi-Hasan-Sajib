import React, { useState, useRef } from 'react';
import { Layers, Type, Image as ImageIcon, Palette, Eye, Sparkles, Check, Download } from 'lucide-react';
import { ExportResolution, ThumbnailState } from './types';
import { INITIAL_THUMBNAIL_STATE, PRESETS } from './presets';
import { Header } from './components/Header';
import { CanvasPreview } from './components/CanvasPreview';
import { TextEditorTab } from './components/TextEditorTab';
import { VisualsEditorTab } from './components/VisualsEditorTab';
import { YouTubeSimulator } from './components/YouTubeSimulator';
import { AiHeadlineGenerator } from './components/AiHeadlineGenerator';
import { WindowsAppModal } from './components/WindowsAppModal';
import { downloadCanvas, renderThumbnailToCanvas } from './utils/canvasRenderer';

export default function App() {
  const [state, setState] = useState<ThumbnailState>(INITIAL_THUMBNAIL_STATE);
  const [activeTab, setActiveTab] = useState<'editor' | 'youtube-sim' | 'ai-hooks'>('editor');
  const [editorSubTab, setEditorSubTab] = useState<'text' | 'visuals' | 'presets'>('text');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isWindowsModalOpen, setIsWindowsModalOpen] = useState(false);

  // Canvas reference for live preview and export
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleStateChange = (updated: Partial<ThumbnailState>) => {
    setState((prev) => ({ ...prev, ...updated }));
  };

  const handleApplyPreset = (presetId: string) => {
    const found = PRESETS.find((p) => p.id === presetId);
    if (found) {
      setState((prev) => ({
        ...prev,
        ...found.state,
      }));
    }
  };

  const handleExport = async (res: ExportResolution) => {
    setIsExporting(true);
    try {
      const exportCanvas = document.createElement('canvas');
      await renderThumbnailToCanvas(exportCanvas, state, res);
      const fileName = `youtube-thumbnail-${res}-${Date.now()}.png`;
      downloadCanvas(exportCanvas, fileName, 'image/png');
    } catch (e) {
      console.error('Failed to export:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.warn('Clipboard write failed:', err);
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Studio Header */}
      <Header
        resolution={state.resolution}
        onResolutionChange={(res) => handleStateChange({ resolution: res })}
        onExport={handleExport}
        onCopyClipboard={handleCopyClipboard}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenWindowsModal={() => setIsWindowsModalOpen(true)}
        isExporting={isExporting}
        copied={copied}
      />

      {/* Preset Fast Switcher & Windows App Callout Bar */}
      <div className="bg-neutral-900/60 border-b border-neutral-800/80 px-4 lg:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="font-bold text-neutral-400 flex items-center gap-1.5 flex-shrink-0">
              <Palette className="w-3.5 h-3.5 text-red-500" />
              Viral Formats:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                    state.templateId === preset.id
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                  }`}
                >
                  <span>{preset.banglaName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Windows App Banner Trigger */}
          <button
            onClick={() => setIsWindowsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 border border-blue-600/30 text-blue-300 font-semibold transition flex-shrink-0 text-[11px] self-start sm:self-auto"
          >
            <svg className="w-3 h-3 fill-current text-blue-400" viewBox="0 0 24 24">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.8" />
            </svg>
            <span>Windows Desktop সফটওয়্যার (.exe) সেটআপ &gt;</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6">
        {activeTab === 'youtube-sim' ? (
          <YouTubeSimulator state={state} canvasRef={canvasRef} />
        ) : activeTab === 'ai-hooks' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <CanvasPreview
                state={state}
                canvasRef={canvasRef}
                onStateChange={handleStateChange}
              />
            </div>
            <div className="lg:col-span-5">
              <AiHeadlineGenerator
                currentState={state}
                onApply={(headline) => {
                  handleStateChange({
                    line1Text: headline.topText,
                    line2Prefix: headline.subPrefix,
                    line2Highlight: headline.highlightText,
                    line2Suffix: headline.subSuffix,
                    line3Text: headline.bottomText,
                    badgeText: headline.badge,
                    showBadge: true,
                  });
                }}
              />
            </div>
          </div>
        ) : (
          /* Editor Tab (Canvas + Controls) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: 4K Canvas Preview */}
            <div className="lg:col-span-7 lg:sticky lg:top-20">
              <CanvasPreview
                state={state}
                canvasRef={canvasRef}
                onStateChange={handleStateChange}
              />
            </div>

            {/* Right: Studio Controls */}
            <div className="lg:col-span-5 space-y-4">
              {/* Sub-tabs for Editor: Text vs Visuals vs Presets */}
              <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs font-bold">
                <button
                  onClick={() => setEditorSubTab('text')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                    editorSubTab === 'text'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Type className="w-3.5 h-3.5 text-red-500" />
                  Headlines & Text
                </button>
                <button
                  onClick={() => setEditorSubTab('visuals')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                    editorSubTab === 'visuals'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                  Panels & Photos
                </button>
                <button
                  onClick={() => setEditorSubTab('presets')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                    editorSubTab === 'presets'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-emerald-500" />
                  Style Presets
                </button>
              </div>

              {/* Sub-tab content */}
              {editorSubTab === 'text' && (
                <TextEditorTab state={state} onChange={handleStateChange} />
              )}

              {editorSubTab === 'visuals' && (
                <VisualsEditorTab state={state} onChange={handleStateChange} />
              )}

              {editorSubTab === 'presets' && (
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-400" />
                    Ready-To-Use Viral News Presets
                  </h3>
                  <div className="space-y-2.5">
                    {PRESETS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition flex items-start justify-between gap-3 ${
                          state.templateId === preset.id
                            ? 'bg-red-600/15 border-red-500'
                            : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{preset.banglaName}</span>
                            {state.templateId === preset.id && (
                              <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[10px]">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-snug">
                            {preset.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Windows Desktop App (.exe) Setup Modal */}
      <WindowsAppModal
        isOpen={isWindowsModalOpen}
        onClose={() => setIsWindowsModalOpen(false)}
      />
    </div>
  );
}
