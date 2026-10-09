export interface LogoState {
  mode: 'default' | 'custom' | 'none';
  customUrl: string | null;
}

const STORAGE_KEY = 'gurudev_brand_logo_state';
export const DEFAULT_LOGO_URL = '/src/assets/images/gurudev_creative_logo_1791517924919.jpg';

export function getLogoState(): LogoState {
  if (typeof window === 'undefined') {
    return { mode: 'default', customUrl: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { mode: 'default', customUrl: null };
    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode || 'default',
      customUrl: parsed.customUrl || null,
    };
  } catch {
    return { mode: 'default', customUrl: null };
  }
}

export function saveLogoState(state: LogoState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('gurudev:logo_updated', { detail: state }));
  } catch (err) {
    console.error('Failed to save logo state', err);
  }
}

export function resetToDefaultLogo() {
  saveLogoState({ mode: 'default', customUrl: null });
}

export function removeLogo() {
  saveLogoState({ mode: 'none', customUrl: null });
}

export function setCustomLogo(dataUrl: string) {
  saveLogoState({ mode: 'custom', customUrl: dataUrl });
}
