import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ExportResolution, RESOLUTIONS, ThumbnailState } from '../types';
import { renderThumbnailToCanvas, downloadCanvas } from '../utils/canvasRenderer';

interface CanvasPreviewProps {
  state: ThumbnailState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onStateChange: (updated: Partial<ThumbnailState>) => void;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  state,
  canvasRef,
  onStateChange: _onStateChange,
}) => {
  const [isRendering, setIsRendering] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-render whenever state changes
  useEffect(() => {
    let isCancelled = false;

    const render = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        await renderThumbnailToCanvas(canvasRef.current, state);
      } catch (err) {
        console.error('Error rendering thumbnail:', err);
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    };

    render();

    return () => {
      isCancelled = true;
    };
  }, [state, canvasRef]);

  const handleDownload = async (res: ExportResolution) => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      // Create offscreen canvas for exact export target resolution
      const exportCanvas = document.createElement('canvas');
      await renderThumbnailToCanvas(exportCanvas, state, res);
      const fileName = `youtube-thumbnail-${res}-${Date.now()}.png`;
      downloadCanvas(exportCanvas, fileName, 'image/png');
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const currentRes = RESOLUTIONS[state.resolution];

  return (
    <div className="flex flex-col h-full bg-neutral-950/70 rounded-2xl border border-neutral-800/80 overflow-hidden shadow-2xl">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-neutral-200">Canvas Preview</span>
          <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono text-[11px]">
            {currentRes.width} × {currentRes.height} px
          </span>
          <span className="text-emerald-400 font-bold hidden sm:inline">
            16:9 Ultra HD
          </span>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.15))}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-neutral-400 text-[11px] min-w-10 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((prev) => Math.min(2.0, prev + 0.15))}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2 py-1 rounded-md text-[11px] font-semibold hover:bg-neutral-800 text-neutral-300"
            title="Reset Zoom to Fit"
          >
            Fit
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 md:p-6 flex items-center justify-center bg-radial from-neutral-900/60 to-neutral-950 relative"
      >
        {isRendering && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-black/80 rounded-full border border-neutral-700 text-[11px] text-amber-400 font-medium backdrop-blur-sm">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Updating 4K render...
          </div>
        )}

        {/* The Real Canvas */}
        <div
          className="relative transition-transform duration-150 shadow-2xl rounded-lg overflow-hidden border border-neutral-700/60"
          style={{
            maxWidth: '100%',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          <canvas
            ref={canvasRef}
            className="block w-full h-auto aspect-video max-h-[68vh] object-contain bg-black shadow-2xl"
          />
        </div>
      </div>

      {/* Canvas Bottom Quick Action Footer */}
      <div className="px-4 py-3 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Lossless 4K subpixel rendering with high-contrast text outlines</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('1080p')}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold border border-neutral-700 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Download 1080p
          </button>
          <button
            onClick={() => handleDownload('4k')}
            disabled={isExporting}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            {isExporting ? 'Exporting...' : 'Download 4K Ultra HD'}
          </button>
        </div>
      </div>
    </div>
  );
};
