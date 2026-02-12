# Scholarship KR API - Fetch Results

## Summary

| Metric | Value |
|--------|-------|
| Total Universities | 91 |
| Working Scripts | 40 (43.9%) |
| Failed Scripts | 51 (56.1%) |
| Total Announcements | 1,220+ |

## Working Universities (40)

| Rank | University | Domain | Announcements |
|------|------------|--------|---------------|
| 1 | 삼육대학교 | www.syu.ac.kr | 119 |
| 2 | 대전대학교 | www.dju.ac.kr | 95 |
| 3 | 용인대학교 | www.yongin.ac.kr | 90 |
| 4 | 서원대학교 | www.seowon.ac.kr | 59 |
| 5 | 한양여자대학교 | www.hywoman.ac.kr | 58 |
| 6 | 상지대학교 | sgu.ac.kr | 57 |
| 7 | 대구한의대학교 | www.dhu.ac.kr | 56 |
| 8 | 배재대학교 | www.pcu.ac.kr | 55 |
| 9 | 총신대학교 | www.cs.ac.kr | 46 |
| 10 | 한국복지대학교 | www.kwu.ac.kr | 45 |

## Failing Universities (51)

The following universities have failing fetch scripts due to outdated URLs or changed website structures:

- kau.ac.kr (한국항공대학교)
- rule.sungshin.ac.kr (성신여자대학교)
- www.ajou.ac.kr (아주대학교)
- www.bu.ac.kr (부산경상대학교)
- www.cau.ac.kr (중앙대학교)
- www.cbnu.ac.kr (충북대학교)
- www.cha.ac.kr (차의과학대학교)
- www.chugye.ac.kr (추계예술대학교)
- www.cju.ac.kr (청주대학교)
- www.cnue.ac.kr (춘천교육대학교)
- www.cu.ac.kr (대구가톨릭대학교)
- www.daegu.ac.kr (대구대학교)
- www.dankook.ac.kr (단국대학교)
- www.dongguk.edu (동국대학교)
- www.dongyang.ac.kr (동양대학교)
- www.ewha.ac.kr (이화여자대학교)
- www.gachon.ac.kr (가천대학교)
- www.ginue.ac.kr (경인교육대학교)
- www.gwnu.ac.kr (국립강릉원주대학교)
- www.halla.ac.kr (한라대학교)
- www.hallym.ac.kr (한림대학교)
- www.hansei.ac.kr (한세대학교)
- www.hansung.ac.kr (한성대학교)
- www.hanyang.ac.kr (한양대학교)
- www.hknu.ac.kr (한경국립대학교)
- www.hongik.ac.kr (홍익대학교)
- www.hufs.ac.kr (한국외국어대학교)
- www.inu.ac.kr (인천대학교)
- www.khu.ac.kr (경희대학교)
- www.knou.ac.kr (한국방송통신대학교)
- www.knue.ac.kr (한국교원대학교)
- www.konkuk.ac.kr (건국대학교)
- www.kookmin.ac.kr (국민대학교)
- www.korea.ac.kr (고려대학교)
- www.kpu.ac.kr (한국산업기술대학교)
- www.kumoh.ac.kr (금오공과대학교)
- www.mju.ac.kr (명지대학교)
- www.puts.ac.kr (장로회신학대학교)
- www.sejong.ac.kr (세종대학교)
- www.seoil.ac.kr (서일대학교)
- www.seoultech.ac.kr (서울과학기술대학교)
- www.shinhan.ac.kr (신한대학교)
- www.silla.ac.kr (신라대학교)
- www.skhu.ac.kr (성공회대학교)
- www.skku.edu (성균관대학교)
- www.sogang.ac.kr (서강대학교)
- www.sookmyung.ac.kr (숙명여자대학교)
- www.ssu.ac.kr (숭실대학교)
- www.swu.ac.kr (서울여자대학교)
- www.yju.ac.kr (영진전문대학교)
- www.yonsei.ac.kr (연세대학교)
- www.yu.ac.kr (영남대학교)

## Common Failure Reasons

1. **404 Errors** (80%): URLs in source document are outdated
2. **JavaScript-heavy sites** (15%): Require specific interaction patterns
3. **Authentication required** (5%): Some boards require login

## How to Fix Failing Scripts

For each failing university:

1. Use `agent-browser` to navigate to the university homepage
2. Search for "장학" (scholarship) menu
3. Find the correct scholarship announcement board URL
4. Update the `ANNOUNCEMENT_URL` in the fetch.ts script
5. Adjust CSS selectors if the page structure is different
6. Test with `bun run fetch.ts`

Example:
```bash
cd services/scholarship-kr-api
agent-browser open https://www.university.ac.kr --session uni
agent-browser --session uni snapshot -i  # Find 장학 menu
# Update URL in fetch.ts
bun run scripts/scholarship-announcements/www.university.ac.kr/fetch.ts
```

## Usage

```bash
cd services/scholarship-kr-api
bun install

# Run single script
bun run scripts/scholarship-announcements/www.syu.ac.kr/fetch.ts

# Run all scripts
bun run scripts/fetch-all.ts
```

## Output Format

Each successful script generates `announcements.json`:

```json
{
  "university": "University Name",
  "url": "https://...",
  "fetchedAt": "2026-02-12T...",
  "count": 42,
  "announcements": [
    {
      "title": "Scholarship Title",
      "link": "https://...",
      "date": "2026-02-10",
      "author": "Admin",
      "views": 123
    }
  ]
}
```
