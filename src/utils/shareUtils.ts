export const SHARED_APP_URL =
  'https://ais-pre-obbkt6wkzbu26r2ztjflms-714575046037.asia-northeast1.run.app';

export function getPublicShareUrl(): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    if (origin.includes('ais-pre-')) {
      return origin;
    }
    if (origin.includes('ais-dev-')) {
      return origin.replace('ais-dev-', 'ais-pre-');
    }
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return SHARED_APP_URL;
    }
    return origin;
  }
  return SHARED_APP_URL;
}

export function generateWhatsAppShareLink(url: string, title: string = 'KASAP_ID'): string {
  const text = `Halo! Yuk belanja dan buka toko di ${title} - Marketplace Hijau Gradasi Putih. Cek aplikasinya di sini: ${url}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function generateTelegramShareLink(url: string, title: string = 'KASAP_ID'): string {
  const text = `Belanja dan kelola toko online di ${title}: ${url}`;
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}
