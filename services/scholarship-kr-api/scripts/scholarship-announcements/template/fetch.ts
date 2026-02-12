import ky from 'ky';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// University configuration
const UNIVERSITY_NAME = process.env.UNIVERSITY_NAME || 'Unknown';
const ANNOUNCEMENT_URL = process.env.ANNOUNCEMENT_URL || '';
const BASE_URL = ANNOUNCEMENT_URL ? new URL(ANNOUNCEMENT_URL).origin : '';

interface Announcement {
  title: string;
  link: string;
  date?: string;
  author?: string;
  views?: number;
}

/**
 * Method 1: Try to find JSON API from network requests
 */
async function fetchViaJsonApi(): Promise<Announcement[] | null> {
  console.log(`[${UNIVERSITY_NAME}] Trying JSON API method...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const apiUrls: string[] = [];

  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('.json') || url.includes('/api/') || url.includes('bbs') || url.includes('board')) {
      apiUrls.push(url);
    }
  });

  page.on('response', async (response) => {
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      apiUrls.push(response.url());
    }
  });

  try {
    await page.goto(ANNOUNCEMENT_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const nextButton = await page.$('[class*="next"], [class*="pagination"], .next, #next');
    if (nextButton) {
      await nextButton.click();
      await page.waitForTimeout(2000);
    }

    await browser.close();

    for (const apiUrl of [...new Set(apiUrls)]) {
      try {
        const response = await ky.get(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }).json<any>();

        if (response.data?.list || response.result?.list || response.list || response.items) {
          const items = response.data?.list || response.result?.list || response.list || response.items;
          const announcements: Announcement[] = items.map((item: any) => ({
            title: item.title || item.subject || item.brdTitle || '',
            link: item.link || item.url || `${BASE_URL}${item.brdNo ? `/view/${item.brdNo}` : ''}`,
            date: item.date || item.regDate || item.createDate || '',
            author: item.author || item.writer || item.regName || '',
            views: item.views || item.hit || item.readCount || 0
          }));

          console.log(`[${UNIVERSITY_NAME}] JSON API method succeeded: ${apiUrl}`);
          return announcements;
        }
      } catch (e) {
        // Continue to next URL
      }
    }

    return null;
  } catch (e) {
    await browser.close();
    return null;
  }
}

/**
 * Method 2: Fetch HTML and parse with cheerio
 */
async function fetchViaHtml(): Promise<Announcement[] | null> {
  console.log(`[${UNIVERSITY_NAME}] Trying HTML parsing method...`);

  try {
    const response = await ky.get(ANNOUNCEMENT_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    }).text();

    const $ = cheerio.load(response);
    const announcements: Announcement[] = [];

    const selectors = [
      'table tbody tr',
      '.board-list tbody tr',
      '.bbs-list tbody tr',
      '[class*="board"] tbody tr',
      '[class*="bbs"] tbody tr',
      '.list-item',
      '.notice-item',
      'article',
      '.post'
    ];

    for (const selector of selectors) {
      $(selector).each((_, elem) => {
        const $row = $(elem);
        const title = $row.find('td:nth-child(2), .title, .subject, a').first().text().trim();
        const link = $row.find('a').first().attr('href') || '';
        const date = $row.find('td:nth-child(3), .date, .reg-date').first().text().trim();
        const author = $row.find('td:nth-child(4), .author, .writer').first().text().trim();
        const viewsText = $row.find('td:nth-child(5), .views, .hit').first().text().trim();

        if (title && title !== '제목') {
          announcements.push({
            title,
            link: link.startsWith('http') ? link : `${BASE_URL}${link}`,
            date,
            author,
            views: parseInt(viewsText.replace(/,/g, '')) || 0
          });
        }
      });

      if (announcements.length > 0) break;
    }

    if (announcements.length > 0) {
      console.log(`[${UNIVERSITY_NAME}] HTML parsing method succeeded: ${announcements.length} items`);
      return announcements;
    }

    return null;
  } catch (e) {
    console.error(`[${UNIVERSITY_NAME}] HTML parsing failed:`, e);
    return null;
  }
}

/**
 * Method 3: Use Playwright to extract data after JS execution
 */
async function fetchViaPlaywright(): Promise<Announcement[] | null> {
  console.log(`[${UNIVERSITY_NAME}] Trying Playwright method...`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(ANNOUNCEMENT_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const announcements = await page.evaluate((baseUrl) => {
      const items: Announcement[] = [];

      const rows = document.querySelectorAll(
        'table tbody tr, .board-list tbody tr, .bbs-list tbody tr, [class*="board"] tbody tr, .list-item, .notice-item'
      );

      rows.forEach((row) => {
        const titleEl = row.querySelector('td:nth-child(2), .title, .subject, a');
        const linkEl = row.querySelector('a');
        const dateEl = row.querySelector('td:nth-child(3), .date, .reg-date');
        const authorEl = row.querySelector('td:nth-child(4), .author, .writer');
        const viewsEl = row.querySelector('td:nth-child(5), .views, .hit');

        if (titleEl) {
          const title = titleEl.textContent?.trim() || '';
          const link = linkEl?.getAttribute('href') || '';

          if (title && title !== '제목') {
            items.push({
              title,
              link: link.startsWith('http') ? link : `${baseUrl}${link}`,
              date: dateEl?.textContent?.trim() || '',
              author: authorEl?.textContent?.trim() || '',
              views: parseInt(viewsEl?.textContent?.replace(/,/g, '') || '0') || 0
            });
          }
        }
      });

      return items;
    }, BASE_URL);

    const hasNextPage = await page.$('[class*="next"], .pagination .next, [title*="다음"], [title*="next"]');
    if (hasNextPage && announcements.length > 0) {
      console.log(`[${UNIVERSITY_NAME}] Pagination detected, checking next page...`);
    }

    await browser.close();

    if (announcements.length > 0) {
      console.log(`[${UNIVERSITY_NAME}] Playwright method succeeded: ${announcements.length} items`);
      return announcements;
    }

    return null;
  } catch (e) {
    await browser.close();
    console.error(`[${UNIVERSITY_NAME}] Playwright method failed:`, e);
    return null;
  }
}

/**
 * Main fetch function - tries methods in order of priority
 */
async function fetchAnnouncements(): Promise<Announcement[]> {
  console.log(`\n[${UNIVERSITY_NAME}] Starting fetch from: ${ANNOUNCEMENT_URL}\n`);

  const jsonResult = await fetchViaJsonApi();
  if (jsonResult) return jsonResult;

  const htmlResult = await fetchViaHtml();
  if (htmlResult) return htmlResult;

  const playwrightResult = await fetchViaPlaywright();
  if (playwrightResult) return playwrightResult;

  throw new Error(`[${UNIVERSITY_NAME}] All fetch methods failed`);
}

// Execute and save
fetchAnnouncements()
  .then((announcements) => {
    const outputPath = join(__dirname, 'announcements.json');
    writeFileSync(outputPath, JSON.stringify({
      university: UNIVERSITY_NAME,
      url: ANNOUNCEMENT_URL,
      fetchedAt: new Date().toISOString(),
      count: announcements.length,
      announcements
    }, null, 2));

    console.log(`\n[${UNIVERSITY_NAME}] Success! Saved ${announcements.length} announcements to announcements.json\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`\n[${UNIVERSITY_NAME}] Failed:`, error.message);
    process.exit(1);
  });
