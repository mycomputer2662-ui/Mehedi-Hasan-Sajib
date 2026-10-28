import React from 'react';
import { LayoutGrid, Sliders, Image as ImageIcon, Upload, Building2, User, Users, Check } from 'lucide-react';
import { PanelImageConfig, PanelLayout, ThumbnailState } from '../types';
import { STOCK_IMAGES } from '../presets';

interface VisualsEditorTabProps {
  state: ThumbnailState;
  onChange: (updated: Partial<ThumbnailState>) => void;
}

export const VisualsEditorTab: React.FC<VisualsEditorTabProps> = ({ state, onChange }) => {
  const updatePanel = (index: 0 | 1 | 2, changes: Partial<PanelImageConfig>) => {
    const updatedPanels: [PanelImageConfig, PanelImageConfig, PanelImageConfig] = [
      { ...state.panels[0] },
      { ...state.panels[1] },
      { ...state.panels[2] },
    ];
    updatedPanels[index] = { ...updatedPanels[index], ...changes };
    onChange({ panels: updatedPanels });
  };

  const handleFileUpload = (index: 0 | 1 | 2, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updatePanel(index, { src: result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 text-neutral-200">
      {/* SECTION 1: Layout & Divider Styles */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Grid Layout & Panel Dividers
          </h3>
        </div>

        {/* Layout Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'three-panel', label: '3-Panel Grid', desc: 'Reference Style (1:1:1)' },
              { id: 'two-panel', label: '2-Panel Split', desc: 'Comparison (1:1)' },
              { id: 'single-hero', label: 'Single Hero', desc: 'Full-width visual' },
            ] as { id: PanelLayout; label: string; desc: string }[]
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => onChange({ layout: item.id })}
              className={`p-2.5 rounded-lg border text-left transition ${
                state.layout === item.id
                  ? 'bg-red-600/15 border-red-500 text-white shadow-sm'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-[10px] text-neutral-500">{item.desc}</div>
            </button>
          ))}
        </div>

        {/* Divider Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div>
            <div className="flex justify-between text-neutral-400 font-semibold mb-1">
              <span>Divider Border Thickness: {state.dividerWidth}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              step="1"
              value={state.dividerWidth}
              onChange={(e) => onChange({ dividerWidth: parseInt(e.target.value) })}
              className="w-full accent-red-600"
            />
          </div>

          <div>
            <label className="block text-neutral-400 font-semibold mb-1">Divider Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.dividerColor}
                onChange={(e) => onChange({ dividerColor: e.target.value })}
                className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
              />
              <div className="flex gap-1">
                {['#DC2626', '#FF0000', '#F59E0B', '#00FFA6', '#FFFFFF'].map((hex) => (
                  <button
                    key={hex}
                    onClick={() => onChange({ dividerColor: hex })}
                    className="w-5 h-5 rounded-full border border-neutral-700 hover:scale-125 transition"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Panel Slots (Left, Center, Right) */}
      {[
        {
          index: 0 as const,
          title: 'Panel 1 (Left - Official / Speaker)',
          icon: <User className="w-4 h-4 text-blue-400" />,
          defaultLabel: 'অর্থ মন্ত্রণালয়',
        },
        {
          index: 1 as const,
          title: 'Panel 2 (Center - Ministry Headquarters)',
          icon: <Building2 className="w-4 h-4 text-emerald-400" />,
          defaultLabel: 'সমাজকল্যাণ অধিদপ্তর',
        },
        {
          index: 2 as const,
          title: 'Panel 3 (Right - Beneficiaries / Citizens)',
          icon: <Users className="w-4 h-4 text-amber-400" />,
          defaultLabel: 'ভাতা বিতরণ ২০২৬',
        },
      ]
        .filter((slot) => {
          if (state.layout === 'single-hero') return slot.index === 0;
          if (state.layout === 'two-panel') return slot.index < 2;
          return true;
        })
        .map(({ index, title, icon }) => {
          const panel = state.panels[index];
          return (
            <div key={index} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {icon}
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                </div>
              </div>

              {/* Quick Image Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                  Choose Image or Upload
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {STOCK_IMAGES.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => updatePanel(index, { src: img.src })}
                      className={`relative aspect-video rounded-lg overflow-hidden border transition ${
                        panel.src === img.src
                          ? 'border-red-500 ring-2 ring-red-500/50'
                          : 'border-neutral-800 opacity-70 hover:opacity-100'
                      }`}
                      title={img.name}
                    >
                      <img src={img.src} alt={img.name} className="w-full h-full object-cover" />
                      {panel.src === img.src && (
                        <div className="absolute top-1 right-1 bg-red-600 rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-neutral-700 bg-neutral-950 hover:bg-neutral-900 text-neutral-300 text-xs font-semibold cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Custom Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(index, e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Adjustments: Zoom, Contrast, Saturation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
                <div>
                  <div className="flex justify-between text-neutral-400 font-medium mb-1">
                    <span>Zoom: {Math.round(panel.zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.2"
                    step="0.05"
                    value={panel.zoom}
                    onChange={(e) => updatePanel(index, { zoom: parseFloat(e.target.value) })}
                    className="w-full accent-red-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 font-medium mb-1">
                    <span>Contrast: {panel.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="160"
                    step="5"
                    value={panel.contrast}
                    onChange={(e) => updatePanel(index, { contrast: parseInt(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 font-medium mb-1">
                    <span>Saturation: {panel.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="180"
                    step="5"
                    value={panel.saturation}
                    onChange={(e) => updatePanel(index, { saturation: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Department Signboard / Seal Overlay */}
              <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-300">
                    Official Signboard Plaque
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!panel.label}
                      onChange={(e) =>
                        updatePanel(index, {
                          label: e.target.checked
                            ? index === 1
                              ? 'সমাজকল্যাণ অধিদপ্তর'
                              : 'অর্থ মন্ত্রণালয়'
                            : '',
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {panel.label !== undefined && panel.label !== '' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      value={panel.label || ''}
                      onChange={(e) => updatePanel(index, { label: e.target.value })}
                      placeholder="e.g. সমাজকল্যাণ অধিদপ্তর"
                      className="px-2.5 py-1 bg-neutral-950 border border-neutral-700 rounded text-white font-semibold"
                    />
                    <input
                      type="text"
                      value={panel.subLabel || ''}
                      onChange={(e) => updatePanel(index, { subLabel: e.target.value })}
                      placeholder="e.g. সমাজসেবা মন্ত্রণালয়"
                      className="px-2.5 py-1 bg-neutral-950 border border-neutral-700 rounded text-amber-300 font-medium"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

      {/* SECTION 3: Global Vignette & Contrast Pop */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Signature Pop & Framing
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex justify-between text-neutral-400 font-semibold mb-1">
              <span>Vignette Edge Intensity: {Math.round(state.vignette * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={state.vignette}
              onChange={(e) => onChange({ vignette: parseFloat(e.target.value) })}
              className="w-full accent-red-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 font-semibold mb-1">
              <span>Outer Frame Border: {state.outerBorderWidth}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              step="2"
              value={state.outerBorderWidth}
              onChange={(e) => onChange({ outerBorderWidth: parseInt(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
