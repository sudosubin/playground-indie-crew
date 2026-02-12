import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UNIVERSITY_NAME = '한국외국어대학교';
const ANNOUNCEMENT_URL = 'https://www.hufs.ac.kr/hufs/281/subview.do';
const BASE_URL = 'https://www.hufs.ac.kr';

async function fetchAnnouncements() {
  console.log(`[${UNIVERSITY_NAME}] Fetching...`);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(ANNOUNCEMENT_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const announcements = await page.evaluate((baseUrl) => {
      const items = [];
      document.querySelectorAll('table tbody tr').forEach((row) => {
        const titleEl = row.querySelector('td:nth-child(2) a');
        if (titleEl) {
          const title = titleEl.textContent?.trim();
          const link = titleEl.getAttribute('href');
          const date = row.querySelector('td:nth-child(3)')?.textContent?.trim();
          
          if (title && title !== '제목') {
            items.push({ title, link: baseUrl + link, date, author: '', views: 0 });
          }
        }
      });
      return items;
    }, BASE_URL);
    
    await browser.close();
    
    if (announcements.length === 0) throw new Error('No data');
    
    const outputPath = join(__dirname, 'announcements.json');
    writeFileSync(outputPath, JSON.stringify({
      university: UNIVERSITY_NAME,
      url: ANNOUNCEMENT_URL,
      fetchedAt: new Date().toISOString(),
      count: announcements.length,
      announcements
    }, null, 2));
    
    console.log(`[${UNIVERSITY_NAME}] Success: ${announcements.length} announcements`);
    return announcements;
  } catch (e) {
    await browser.close();
    throw e;
  }
}

fetchAnnouncements().catch(() => {
  console.error(`[${UNIVERSITY_NAME}] Failed`);
  process.exit(1);
});
