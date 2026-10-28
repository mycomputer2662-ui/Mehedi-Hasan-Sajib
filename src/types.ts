export type ExportResolution = '4k' | '1080p' | '720p';

export interface ResolutionConfig {
  width: number;
  height: number;
  label: string;
  badge: string;
}

export const RESOLUTIONS: Record<ExportResolution, ResolutionConfig> = {
  '4k': { width: 3840, height: 2160, label: '4K Ultra HD (3840 × 2160)', badge: '4K UHD' },
  '1080p': { width: 1920, height: 1080, label: 'Full HD (1920 × 1080)', badge: 'FHD' },
  '720p': { width: 1280, height: 720, label: 'YouTube Standard (1280 × 720)', badge: 'HD' },
};

export type PanelLayout = 'three-panel' | 'two-panel' | 'single-hero' | 'tv-news';

export interface PanelImageConfig {
  src: string;
  label?: string; // e.g. "সমাজকল্যাণ অধিদপ্তর" or "অর্থ মন্ত্রণালয়"
  subLabel?: string; // e.g. "সমাজসেবা মন্ত্রণালয় • গণপ্রজাতন্ত্রী বাংলাদেশ সরকার"
  zoom: number; // 1 to 2.5
  offsetX: number; // -100 to 100
  offsetY: number; // -100 to 100
  brightness: number; // 70 to 150
  contrast: number; // 70 to 160
  saturation: number; // 80 to 200
  showSeal?: boolean;
}

export interface ThumbnailState {
  // Metadata & general
  templateId: string;
  resolution: ExportResolution;
  outerBorderWidth: number; // 0 to 24px
  outerBorderColor: string;
  vignette: number; // 0 to 0.8
  highContrastPop: boolean; // extra saturation/contrast boost

  // Layout & Dividers
  layout: PanelLayout;
  dividerWidth: number; // 0 to 16px
  dividerColor: string; // red, yellow, white, etc.
  panels: [PanelImageConfig, PanelImageConfig, PanelImageConfig];

  // Top Line 1 (Red Banner in reference)
  line1Text: string;
  line1BgColor: string;
  line1TextColor: string;
  line1StrokeColor: string;
  line1StrokeWidth: number; // 0 to 30
  line1Font: string;
  line1FontSize: number; // relative size scale 0.7 to 1.4

  // Top Line 2 (Green Banner in reference)
  line2Prefix: string;
  line2Highlight: string;
  line2HighlightColor: string;
  line2Suffix: string;
  line2BgColor: string;
  line2TextColor: string;
  line2StrokeColor: string;
  line2StrokeWidth: number;
  line2Font: string;
  line2FontSize: number;

  // Bottom Banner (Black Banner in reference)
  line3Text: string;
  line3BgColor: string;
  line3TextColor: string;
  line3StrokeColor: string;
  line3StrokeWidth: number;
  line3Font: string;
  line3FontSize: number;

  // Corner Badges & Overlays
  showBadge: boolean;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
  badgePosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  // Live indicator or 4K stamp
  showStamp: boolean;
  stampText: string;
}

export interface ThumbnailPreset {
  id: string;
  name: string;
  banglaName: string;
  category: 'welfare' | 'news' | 'education' | 'finance' | 'custom';
  description: string;
  state: Partial<ThumbnailState>;
}
