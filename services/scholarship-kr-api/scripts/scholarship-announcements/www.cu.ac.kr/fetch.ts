import ky from 'ky';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const UNIVERSITY_NAME = 'University_4';
const ANNOUNCEMENT_URL = 'http://www.cu.ac.kr/download/scholarship-guide.pdf';
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
    // Set user agent
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    // Navigate with longer timeout
    const response = await page.goto(ANNOUNCEMENT_URL, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    
    if (!response || response.status() === 404) {
      console.log(`[${UNIVERSITY_NAME}] Page returned 404`);
      await browser.close();
      return null;
    }
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Try multiple selectors
    const announcements = await page.evaluate((baseUrl) => {
      const items: Announcement[] = [];
      
      // Comprehensive list of selectors for Korean university boards
      const rowSelectors = [
        'table tbody tr',
        '.board-list tbody tr',
        '.bbs-list tbody tr',
        '.notice-list tbody tr',
        '[class*="board"] tbody tr',
        '[class*="bbs"] tbody tr',
        '.list-type1 tbody tr',
        '.tbl_list tbody tr',
        '.list_table tbody tr',
        '.scholarship-list li',
        '.notice-list li',
        '.post-list li',
        '.article-list li',
        'ul li .title',
        '.content-list .item'
      ];
      
      for (const selector of rowSelectors) {
        const rows = document.querySelectorAll(selector);
        if (rows.length > 0 && rows.length < 200) { // Reasonable number
          rows.forEach((row) => {
            // Try various title selectors
            const titleSelectors = [
              'td:nth-child(2) a',
              'td:nth-child(2)',
              '.title a',
              '.title',
              '.subject a',
              '.subject',
              'a[href*="view"]',
              'a[href*="detail"]',
              'a[href*="article"]',
              '.list-title',
              'h3 a',
              'h4 a',
              'a'
            ];
            
            let titleEl: Element | null = null;
            let linkEl: Element | null = null;
            
            for (const ts of titleSelectors) {
              titleEl = row.querySelector(ts);
              if (titleEl) {
                linkEl = titleEl.tagName === 'A' ? titleEl : titleEl.closest('a');
                break;
              }
            }
            
            if (titleEl) {
              const title = titleEl.textContent?.trim() || '';
              
              // Skip header rows
              if (!title || title === '제목' || title === '번호' || title === 'Title' || title.length < 2) {
                return;
              }
              
              // Get link
              let link = linkEl?.getAttribute('href') || '';
              if (link.startsWith('javascript:')) {
                const onclick = linkEl?.getAttribute('onclick') || titleEl?.getAttribute('onclick') || '';
                const match = onclick.match(/['"](\d+)['"]/);
                if (match) {
                  link = `/view/${match[1]}`;
                }
              }
              
              // Get date from various selectors
              const dateSelectors = ['td:nth-child(3)', '.date', '.reg-date', '.wdate', '.write-date', '.created'];
              let date = '';
              for (const ds of dateSelectors) {
                const el = row.querySelector(ds);
                if (el?.textContent?.trim()) {
                  date = el.textContent.trim();
                  break;
                }
              }
              
              // Get author
              const authorSelectors = ['td:nth-child(4)', '.author', '.writer', '.name', '.user'];
              let author = '';
              for (const as of authorSelectors) {
                const el = row.querySelector(as);
                if (el?.textContent?.trim()) {
                  author = el.textContent.trim();
                  break;
                }
              }
              
              // Get views
              const viewsSelectors = ['td:nth-child(5)', '.views', '.hit', '.count', '.read'];
              let views = 0;
              for (const vs of viewsSelectors) {
                const el = row.querySelector(vs);
                if (el?.textContent) {
                  const num = parseInt(el.textContent.replace(/[^0-9]/g, ''));
                  if (!isNaN(num)) {
                    views = num;
                    break;
                  }
                }
              }
              
              items.push({
                title,
                link: link.startsWith('http') ? link : (link.startsWith('/') ? baseUrl + link : baseUrl + '/' + link),
                date,
                author,
                views
              });
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
    console.error(`[${UNIVERSITY_NAME}] Error:`, e);
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
