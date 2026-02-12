import ky from 'ky';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const UNIVERSITY_NAME = 'University_38';
const ANNOUNCEMENT_URL = 'https://www.knsu.ac.kr/knsu/unilife/scholarship-information.do';
const BASE_URL = new URL(ANNOUNCEMENT_URL).origin;

interface Announcement {
  title: string;
  link: string;
  date?: string;
  author?: string;
  views?: number;
}

async function fetchViaPlaywright(): Promise<Announcement[] | null> {
  console.log(`[${UNIVERSITY_NAME}] Fetching via Playwright...`);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(ANNOUNCEMENT_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const announcements = await page.evaluate((baseUrl) => {
      const items = [];
      const rows = document.querySelectorAll('table tbody tr, .board-list tbody tr, .bbs-list tbody tr, [class*="board"] tbody tr, .list-item, .notice-item');
      
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
              link: link.startsWith('http') ? link : baseUrl + link,
              date: dateEl?.textContent?.trim() || '',
              author: authorEl?.textContent?.trim() || '',
              views: parseInt(viewsEl?.textContent?.replace(/,/g, '') || '0') || 0
            });
          }
        }
      });
      
      return items;
    }, BASE_URL);
    
    await browser.close();
    
    if (announcements.length > 0) {
      console.log(`[${UNIVERSITY_NAME}] Playwright method succeeded: ${announcements.length} items`);
      return announcements;
    }
    
    return null;
  } catch (e) {
    await browser.close();
    return null;
  }
}

async function fetchAnnouncements(): Promise<Announcement[]> {
  const result = await fetchViaPlaywright();
  if (result) return result;
  throw new Error('All fetch methods failed');
}

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
    console.log(`[${UNIVERSITY_NAME}] Success! Saved ${announcements.length} announcements`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`[${UNIVERSITY_NAME}] Failed:`, error.message);
    process.exit(1);
  });
