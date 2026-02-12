import ky from 'ky';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const UNIVERSITY_NAME = '연세대학교';
const ANNOUNCEMENT_URL = 'https://www.yonsei.ac.kr/sc/';
const BASE_URL = 'https://www.yonsei.ac.kr';

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
    await page.waitForTimeout(3000);
    
    // Click on 장학 menu
    const janghakButton = await page.$('button:has-text("장학")');
    if (janghakButton) {
      await janghakButton.click();
      await page.waitForTimeout(2000);
    }
    
    const announcements = await page.evaluate((baseUrl) => {
      const items = [];
      const links = document.querySelectorAll('a[href*="장학"], a[href*="scholarship"]');
      
      links.forEach((link) => {
        const title = link.textContent?.trim();
        const href = link.getAttribute('href');
        
        if (title && title.length > 5 && href) {
          items.push({
            title,
            link: href.startsWith('http') ? href : baseUrl + href,
            date: '',
            author: '',
            views: 0
          });
        }
      });
      
      return items;
    }, BASE_URL);
    
    await browser.close();
    
    if (announcements.length > 0) {
      console.log(`[${UNIVERSITY_NAME}] Success: ${announcements.length} items`);
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
    console.log(`[${UNIVERSITY_NAME}] Saved ${announcements.length} announcements`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`[${UNIVERSITY_NAME}] Failed:`, error.message);
    process.exit(1);
  });
