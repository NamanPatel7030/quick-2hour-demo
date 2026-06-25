// scripts/capture.mjs — take screenshots of Mediflow pages with an authenticated session
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const BASE = 'http://localhost:3000';
const OUT = 'screenshots';

const pages = [
  { name: '01-marketing', path: '/', auth: false },
  { name: '02-signin', path: '/auth/sign-in', auth: false },
  { name: '03-forgot-password', path: '/auth/forgot-password', auth: false },
  { name: '04-overview', path: '/attorney/overview', auth: true },
  { name: '05-cases-list', path: '/attorney/cases', auth: true },
  { name: '06-case-detail-overview', path: '/attorney/cases/CASE-2024-0142?tab=overview', auth: true },
  { name: '07-case-detail-documents', path: '/attorney/cases/CASE-2024-0142?tab=documents', auth: true },
  { name: '08-case-detail-billing', path: '/attorney/cases/CASE-2024-0142?tab=billing', auth: true },
  { name: '09-case-detail-timeline', path: '/attorney/cases/CASE-2024-0142?tab=timeline', auth: true },
  { name: '10-clients-list', path: '/attorney/clients', auth: true },
  { name: '11-client-detail', path: '/attorney/clients/cl_001', auth: true },
  { name: '12-billing-kanban', path: '/attorney/billing', auth: true },
  { name: '13-billing-offers', path: '/attorney/billing/offers', auth: true },
  { name: '14-billing-payments', path: '/attorney/billing/payments', auth: true },
  { name: '15-insights', path: '/attorney/insights', auth: true },
  { name: '16-documents', path: '/attorney/documents', auth: true },
  { name: '17-notifications', path: '/attorney/notifications', auth: true },
  { name: '18-firm-profile', path: '/attorney/firm', auth: true },
  { name: '19-firm-team', path: '/attorney/firm/team', auth: true },
  { name: '20-profile', path: '/attorney/profile', auth: true },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await context.newPage();

// Login first
console.log('Logging in as Danny...');
await page.goto(`${BASE}/auth/sign-in`);
await page.click('button:has-text("Demo account")'); // auto-fill demo creds
await page.click('button[type="submit"]:has-text("Sign in")');
await page.waitForURL(/\/attorney\/overview/, { timeout: 10000 });
console.log('Logged in.');

// Capture authenticated pages
for (const p of pages.filter((p) => p.auth)) {
  console.log(`Capturing ${p.name} (${p.path})...`);
  await page.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800); // settle
  await page.screenshot({ path: `${OUT}/${p.name}.png`, fullPage: true });
}

// Capture public pages from a clean context
const publicContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const publicPage = await publicContext.newPage();
for (const p of pages.filter((p) => !p.auth)) {
  console.log(`Capturing ${p.name} (${p.path})...`);
  await publicPage.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle' });
  await publicPage.waitForTimeout(600);
  await publicPage.screenshot({ path: `${OUT}/${p.name}.png`, fullPage: true });
}

await browser.close();
console.log('Done.');