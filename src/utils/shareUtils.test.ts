import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SHARED_APP_URL,
  getPublicShareUrl,
  generateWhatsAppShareLink,
  generateTelegramShareLink,
} from './shareUtils';

test('getPublicShareUrl returns shared app URL default', () => {
  const url = getPublicShareUrl();
  assert.ok(url.startsWith('https://ais-pre-'));
  assert.equal(url, SHARED_APP_URL);
});

test('generateWhatsAppShareLink encodes parameters correctly', () => {
  const wa = generateWhatsAppShareLink('https://example.com/app', 'KASAP_ID');
  assert.ok(wa.includes('https://api.whatsapp.com/send?text='));
  assert.ok(wa.includes(encodeURIComponent('https://example.com/app')));
  assert.ok(wa.includes('KASAP_ID'));
});

test('generateTelegramShareLink encodes parameters correctly', () => {
  const tg = generateTelegramShareLink('https://example.com/app', 'KASAP_ID');
  assert.ok(tg.startsWith('https://t.me/share/url?url='));
  assert.ok(tg.includes(encodeURIComponent('https://example.com/app')));
});
