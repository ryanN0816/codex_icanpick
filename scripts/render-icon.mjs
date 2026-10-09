import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {});
try {
 const page = await browser.newPage({ viewport: { width: 600, height: 600 }, deviceScaleFactor: 1 });
 await page.setContent(`<style>body{margin:0}</style>${await readFile('public/icon.svg', 'utf8')}`);
 await page.locator('svg').screenshot({ path: 'assets/icanpick-icon-600.png' });
} finally { await browser.close(); }
