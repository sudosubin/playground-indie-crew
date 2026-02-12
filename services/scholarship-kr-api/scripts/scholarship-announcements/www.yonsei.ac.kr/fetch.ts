import ky from 'ky';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const UNIVERSITY_NAME = '연세대학교';
const ANNOUNCEMENT_URL = 'https://www.yonsei.ac.kr/sc/support/notice.do';
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
    
    // Try multiple common selectors for Korean university boards
    const announcements = await page.evaluate((baseUrl) => {
      const items: Announcement[] = [];
      
      // Try various selectors
      const selectors = [
        '.board-list tbody tr',
        '.bbs-list tbody tr', 
        'table tbody tr',
        '.list-type tbody tr',
        '[class*="board"] tbody tr',
        '.notice-list li',
        '.post-list li'
      ];
      
      for (const selector of selectors) {
        const rows = document.querySelectorAll(selector);
        if (rows.length > 0) {
          rows.forEach((row) => {
            const titleEl = row.querySelector('.title a, td:nth-child(2) a, .subject a, a');
            const dateEl = row.querySelector('.date, td:nth-child(3), .reg-date');
            const authorEl = row.querySelector('.author, td:nth-child(4), .writer');
            const viewsEl = row.querySelector('.views, td:nth-child(5), .hit, .count');
            
            if (titleEl) {
              const title = titleEl.textContent?.trim() || '';
              let link = titleEl.getAttribute('href') || '';
              
              // Handle JavaScript links
              if (link.startsWith('javascript:')) {
                const onclick = titleEl.getAttribute('onclick') || '';
                const match = onclick.match(/\'(\d+)\'/);
                if (match) link = `/view/${match[1]}`;
              }
              
              if (title && title !== '제목' && title.length > 0) {
                items.push({
                  title,
                  link: link.startsWith('http') ? link : baseUrl + link,
                  date: dateEl?.textContent?.trim() || '',
                  author: authorEl?.textContent?.trim() || '',
                  views: parseInt(viewsEl?.textContent?.replace(/[^0-9]/g, '') || '0') || 0
                });
              }
            }
          });
          if (items.length > 0) break;
        }
      }
      
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
    console.error(`[${UNIVERSITY_NAME}] Error:`, e);
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
