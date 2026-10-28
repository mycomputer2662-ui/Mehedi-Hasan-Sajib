import { RESOLUTIONS, PanelImageConfig, ThumbnailState } from '../types';
import { toBanglaNumber } from '../presets';

// In-memory image cache to prevent flickering and enable smooth real-time dragging
const imageCache: Map<string, HTMLImageElement> = new Map();

export function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (e) => {
      console.warn(`Failed to load image at ${src}, using fallback color tile.`, e);
      reject(e);
    };
    img.src = src;
  });
}

// Draw a stylized Bangladesh / official emblem seal on canvas
function drawOfficialSeal(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#065F46'; // Deep emerald green
  ctx.fill();
  ctx.lineWidth = radius * 0.1;
  ctx.strokeStyle = '#FBBF24'; // Golden border
  ctx.stroke();

  // Inner red circle
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.65, 0, Math.PI * 2);
  ctx.fillStyle = '#DC2626'; // Red sun
  ctx.fill();

  // Inner star or water lily motif
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export async function renderThumbnailToCanvas(
  canvas: HTMLCanvasElement,
  state: ThumbnailState,
  targetResolution?: '4k' | '1080p' | '720p'
): Promise<void> {
  const resKey = targetResolution || state.resolution;
  const { width, height } = RESOLUTIONS[resKey];

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  // Scale factor relative to 4K base (3840x2160)
  const scale = width / 3840;

  // Enable high-quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Clear background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Layout heights:
  // Top Line 1: ~18%
  // Top Line 2: ~18%
  // Middle Panels: ~49%
  // Bottom Line 3: ~15%
  const line1H = Math.round(height * 0.185);
  const line2H = Math.round(height * 0.185);
  const line3H = Math.round(height * 0.15);
  const middleY = line1H + line2H;
  const middleH = height - middleY - line3H;

  // 1. Draw Middle Visual Panels
  await drawMiddlePanels(ctx, state, middleY, middleH, width, height, scale);

  // 2. High Contrast Pop Overlay (Vignette & Saturation glow)
  if (state.vignette > 0) {
    drawVignette(ctx, width, height, state.vignette);
  }

  // 3. Draw Top Line 1 (Red Band)
  drawLine1(ctx, state, 0, line1H, width, scale);

  // 4. Draw Top Line 2 (Green Band with Yellow Highlight)
  drawLine2(ctx, state, line1H, line2H, width, scale);

  // 5. Draw Bottom Banner (Black Band)
  drawLine3(ctx, state, height - line3H, line3H, width, scale);

  // 6. Draw Outer Accent Border
  if (state.outerBorderWidth > 0) {
    const borderWidth = state.outerBorderWidth * scale * 2;
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = state.outerBorderColor;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
  }

  // 7. Draw Floating Corner Badges & 4K Stamp
  drawBadgesAndStamps(ctx, state, width, height, scale, line1H, line2H, line3H);
}

// Draw the middle section (1, 2, or 3 panels)
async function drawMiddlePanels(
  ctx: CanvasRenderingContext2D,
  state: ThumbnailState,
  middleY: number,
  middleH: number,
  canvasW: number,
  _canvasH: number,
  scale: number
) {
  const layout = state.layout;
  const dividerW = state.dividerWidth * scale * 2;

  if (layout === 'single-hero') {
    // 1 Full-width panel
    await drawSinglePanelImage(ctx, state.panels[0], 0, middleY, canvasW, middleH, scale);
    return;
  }

  if (layout === 'two-panel') {
    const halfW = canvasW / 2;
    await drawSinglePanelImage(ctx, state.panels[0], 0, middleY, halfW, middleH, scale);
    await drawSinglePanelImage(ctx, state.panels[1], halfW, middleY, halfW, middleH, scale);

    // Vertical divider
    if (dividerW > 0) {
      ctx.fillStyle = state.dividerColor;
      ctx.fillRect(halfW - dividerW / 2, middleY, dividerW, middleH);
    }
    return;
  }

  // Default: three-panel grid (Left, Center, Right)
  const panelW = canvasW / 3;

  await drawSinglePanelImage(ctx, state.panels[0], 0, middleY, panelW, middleH, scale);
  await drawSinglePanelImage(ctx, state.panels[1], panelW, middleY, panelW, middleH, scale);
  await drawSinglePanelImage(ctx, state.panels[2], panelW * 2, middleY, panelW, middleH, scale);

  // Dividers
  if (dividerW > 0) {
    ctx.fillStyle = state.dividerColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 8 * scale;
    ctx.fillRect(panelW - dividerW / 2, middleY, dividerW, middleH);
    ctx.fillRect(panelW * 2 - dividerW / 2, middleY, dividerW, middleH);
    ctx.shadowBlur = 0;
  }

  // Horizontal separator between Line 2 and Middle
  ctx.fillStyle = state.dividerColor;
  ctx.fillRect(0, middleY - dividerW / 2, canvasW, dividerW);

  // Horizontal separator between Middle and Line 3
  ctx.fillRect(0, middleY + middleH - dividerW / 2, canvasW, dividerW);
}

// Draw a single cropped/zoomed/filtered image into a panel slot
async function drawSinglePanelImage(
  ctx: CanvasRenderingContext2D,
  panel: PanelImageConfig,
  x: number,
  y: number,
  w: number,
  h: number,
  scale: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Try to load cached image or draw placeholder
  let img: HTMLImageElement | null = null;
  try {
    img = await loadImage(panel.src);
  } catch {
    img = null;
  }

  if (img && img.naturalWidth > 0) {
    // Apply CSS filter for saturation, contrast, and brightness
    ctx.filter = `brightness(${panel.brightness}%) contrast(${panel.contrast}%) saturate(${panel.saturation}%)`;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const slotAspect = w / h;
    let renderW = w;
    let renderH = h;

    if (slotAspect > imgAspect) {
      renderW = w;
      renderH = w / imgAspect;
    } else {
      renderH = h;
      renderW = h * imgAspect;
    }

    renderW *= panel.zoom;
    renderH *= panel.zoom;

    const posX = x + (w - renderW) / 2 + (panel.offsetX * scale * 2);
    const posY = y + (h - renderH) / 2 + (panel.offsetY * scale * 2);

    ctx.drawImage(img, posX, posY, renderW, renderH);
    ctx.filter = 'none';
  } else {
    // Modern placeholder gradient tile
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, '#1E293B');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = '#64748B';
    ctx.font = `bold ${24 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Image Slot', x + w / 2, y + h / 2);
  }

  // Draw Signboard / Official Department Overlay if label is present
  if (panel.label) {
    drawPanelSignboard(ctx, panel, x, y, w, h, scale);
  }

  ctx.restore();
}

// Draw the department sign board (e.g. "সমাজকল্যাণ অধিদপ্তর" or "অর্থ মন্ত্রণালয়")
function drawPanelSignboard(
  ctx: CanvasRenderingContext2D,
  panel: PanelImageConfig,
  x: number,
  y: number,
  w: number,
  h: number,
  scale: number
) {
  ctx.save();
  const signH = Math.min(h * 0.38, 160 * scale);
  const signY = y + h - signH - (10 * scale);
  const signW = w * 0.94;
  const signX = x + (w - signW) / 2;

  // Plaque dark background
  ctx.fillStyle = 'rgba(7, 24, 15, 0.94)';
  ctx.strokeStyle = '#FBBF24'; // Gold border
  ctx.lineWidth = 3 * scale;

  ctx.beginPath();
  ctx.roundRect(signX, signY, signW, signH, 10 * scale);
  ctx.fill();
  ctx.stroke();

  // Seal on the left of plaque
  const sealRadius = signH * 0.32;
  const sealX = signX + sealRadius + (16 * scale);
  const sealY = signY + signH / 2;

  if (panel.showSeal) {
    drawOfficialSeal(ctx, sealX, sealY, sealRadius);
  }

  // Plaque text
  const textX = panel.showSeal ? sealX + sealRadius + (14 * scale) : signX + signW / 2;
  ctx.textAlign = panel.showSeal ? 'left' : 'center';
  ctx.textBaseline = 'middle';

  // Primary Plaque Title (e.g. সমাজকল্যাণ অধিদপ্তর)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${32 * scale}px 'Hind Siliguri', sans-serif`;
  ctx.fillText(panel.label || '', textX, signY + signH * 0.38);

  // Secondary subLabel (e.g. সমাজসেবা মন্ত্রণালয় • গণপ্রজাতন্ত্রী বাংলাদেশ সরকার)
  if (panel.subLabel) {
    ctx.fillStyle = '#FDE047'; // Golden yellow subtext
    ctx.font = `600 ${20 * scale}px 'Hind Siliguri', sans-serif`;
    ctx.fillText(panel.subLabel, textX, signY + signH * 0.72);
  }

  ctx.restore();
}

// Draw Top Line 1 (Red Band in reference)
function drawLine1(
  ctx: CanvasRenderingContext2D,
  state: ThumbnailState,
  y: number,
  height: number,
  width: number,
  scale: number
) {
  ctx.save();

  // Background with subtle gradient
  const grad = ctx.createLinearGradient(0, y, 0, y + height);
  grad.addColorStop(0, state.line1BgColor);
  grad.addColorStop(1, '#5C0000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, y, width, height);

  // Subtle bottom border line for crisp separation
  ctx.fillStyle = '#FF4444';
  ctx.fillRect(0, y + height - 3 * scale, width, 3 * scale);

  // Text setup
  const fontSize = Math.round(155 * state.line1FontSize * scale);
  ctx.font = `900 ${fontSize}px ${state.line1Font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;

  const textY = y + height / 2 + (4 * scale);

  // Outer shadow / stroke
  if (state.line1StrokeWidth > 0) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 18 * scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6 * scale;

    ctx.strokeStyle = state.line1StrokeColor;
    ctx.lineWidth = state.line1StrokeWidth * scale * 2.2;
    ctx.strokeText(state.line1Text, width / 2, textY);
  }

  // Fill text
  ctx.shadowBlur = 0;
  ctx.fillStyle = state.line1TextColor;
  ctx.fillText(state.line1Text, width / 2, textY);

  ctx.restore();
}

// Draw Top Line 2 (Deep Green Band with Lemon Yellow Highlight)
function drawLine2(
  ctx: CanvasRenderingContext2D,
  state: ThumbnailState,
  y: number,
  height: number,
  width: number,
  scale: number
) {
  ctx.save();

  // Background deep forest green gradient
  const grad = ctx.createLinearGradient(0, y, 0, y + height);
  grad.addColorStop(0, state.line2BgColor);
  grad.addColorStop(1, '#032D12');
  ctx.fillStyle = grad;
  ctx.fillRect(0, y, width, height);

  const fontSize = Math.round(152 * state.line2FontSize * scale);
  ctx.font = `900 ${fontSize}px ${state.line2Font}`;
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;

  const textY = y + height / 2 + (4 * scale);

  // Measure segments: Prefix + Highlight + Suffix
  const prefixStr = state.line2Prefix ? `${state.line2Prefix} ` : '';
  const highlightStr = state.line2Highlight ? `${state.line2Highlight} ` : '';
  const suffixStr = state.line2Suffix || '';

  const prefixW = prefixStr ? ctx.measureText(prefixStr).width : 0;
  const highlightW = highlightStr ? ctx.measureText(highlightStr).width : 0;
  const suffixW = suffixStr ? ctx.measureText(suffixStr).width : 0;
  const totalW = prefixW + highlightW + suffixW;

  let curX = (width - totalW) / 2;
  const strokeW = state.line2StrokeWidth * scale * 2.2;

  // 1. Draw Prefix (White)
  if (prefixStr) {
    if (strokeW > 0) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 18 * scale;
      ctx.strokeStyle = state.line2StrokeColor;
      ctx.lineWidth = strokeW;
      ctx.strokeText(prefixStr, curX, textY);
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = state.line2TextColor;
    ctx.fillText(prefixStr, curX, textY);
    curX += prefixW;
  }

  // 2. Draw Highlight (Neon Yellow Glow)
  if (highlightStr) {
    if (strokeW > 0) {
      // Glow behind highlight stroke
      ctx.shadowColor = state.line2HighlightColor;
      ctx.shadowBlur = 24 * scale;
      ctx.strokeStyle = state.line2StrokeColor;
      ctx.lineWidth = strokeW;
      ctx.strokeText(highlightStr, curX, textY);
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = state.line2HighlightColor;
    ctx.fillText(highlightStr, curX, textY);
    curX += highlightW;
  }

  // 3. Draw Suffix (White)
  if (suffixStr) {
    if (strokeW > 0) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 18 * scale;
      ctx.strokeStyle = state.line2StrokeColor;
      ctx.lineWidth = strokeW;
      ctx.strokeText(suffixStr, curX, textY);
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = state.line2TextColor;
    ctx.fillText(suffixStr, curX, textY);
  }

  ctx.restore();
}

// Draw Bottom Banner (Black Band with Gold/Yellow categories)
function drawLine3(
  ctx: CanvasRenderingContext2D,
  state: ThumbnailState,
  y: number,
  height: number,
  width: number,
  scale: number
) {
  ctx.save();

  // Solid deep pitch black with subtle top highlight
  ctx.fillStyle = state.line3BgColor;
  ctx.fillRect(0, y, width, height);

  // Text setup
  const fontSize = Math.round(145 * state.line3FontSize * scale);
  ctx.font = `900 ${fontSize}px ${state.line3Font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;

  const textY = y + height / 2 + (2 * scale);

  // Outer stroke
  if (state.line3StrokeWidth > 0) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 20 * scale;
    ctx.shadowOffsetY = 4 * scale;
    ctx.strokeStyle = state.line3StrokeColor;
    ctx.lineWidth = state.line3StrokeWidth * scale * 2.2;
    ctx.strokeText(state.line3Text, width / 2, textY);
  }

  // Fill text with vivid gold / yellow
  ctx.shadowBlur = 0;
  ctx.fillStyle = state.line3TextColor;
  ctx.fillText(state.line3Text, width / 2, textY);

  ctx.restore();
}

// Draw corner badges (e.g. "জরুরি নোটিশ", "ব্রেকিং নিউজ", "4K ULTRA HD")
function drawBadgesAndStamps(
  ctx: CanvasRenderingContext2D,
  state: ThumbnailState,
  width: number,
  height: number,
  scale: number,
  _line1H: number,
  _line2H: number,
  _line3H: number
) {
  // 1. Floating Corner Badge
  if (state.showBadge && state.badgeText) {
    ctx.save();
    const badgePadX = 32 * scale;
    const badgePadY = 16 * scale;
    const badgeFontSize = 42 * scale;
    ctx.font = `900 ${badgeFontSize}px 'Hind Siliguri', sans-serif`;

    const textW = ctx.measureText(state.badgeText).width;
    const badgeW = textW + badgePadX * 2;
    const badgeH = badgeFontSize + badgePadY * 2;

    let bx = 30 * scale;
    let by = 30 * scale;
    if (state.badgePosition === 'top-right') {
      bx = width - badgeW - 30 * scale;
    } else if (state.badgePosition === 'bottom-left') {
      by = height - badgeH - 30 * scale;
    } else if (state.badgePosition === 'bottom-right') {
      bx = width - badgeW - 30 * scale;
      by = height - badgeH - 30 * scale;
    }

    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 15 * scale;
    ctx.shadowOffsetY = 6 * scale;

    // Badge pill background
    ctx.fillStyle = state.badgeBg;
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeW, badgeH, 12 * scale);
    ctx.fill();

    // Badge border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3 * scale;
    ctx.stroke();

    // Text
    ctx.shadowBlur = 0;
    ctx.fillStyle = state.badgeTextColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.badgeText, bx + badgeW / 2, by + badgeH / 2);

    ctx.restore();
  }

  // 2. 4K ULTRA HD Stamp
  if (state.showStamp && state.stampText) {
    ctx.save();
    const stampFontSize = 36 * scale;
    ctx.font = `900 ${stampFontSize}px 'Montserrat', sans-serif`;
    const textW = ctx.measureText(state.stampText).width;
    const stampW = textW + 36 * scale;
    const stampH = stampFontSize + 22 * scale;

    const sx = width - stampW - 32 * scale;
    const sy = 28 * scale;

    // Dark glass background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.beginPath();
    ctx.roundRect(sx, sy, stampW, stampH, 8 * scale);
    ctx.fill();

    // Golden accent border
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 3 * scale;
    ctx.stroke();

    // Glowing Gold Text
    ctx.fillStyle = '#FDE047';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.stampText, sx + stampW / 2, sy + stampH / 2 + (2 * scale));

    ctx.restore();
  }
}

// Vignette filter around the perimeter
function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  ctx.save();
  const radius = Math.max(width, height) * 0.75;
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    radius * 0.35,
    width / 2,
    height / 2,
    radius
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Convert canvas to downloadable blob / data URL
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  fileName: string = 'youtube-thumbnail-4k.png',
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality: number = 0.95
) {
  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    format,
    quality
  );
}
